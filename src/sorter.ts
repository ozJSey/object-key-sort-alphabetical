import * as vscode from 'vscode';
import * as ts from 'typescript';
import { SortableNode, SortConfig, PropertyInfo } from './types';
import { getPriority } from './config';

export function createEdits(
    nodes: SortableNode[],
    text: string,
    document: vscode.TextDocument,
    config: SortConfig
): vscode.TextEdit[] {
    const edits: vscode.TextEdit[] = [];

    for (const node of nodes) {
        const sorted = sortNodeWithNested(node, text, config);
        if (sorted !== null) {
            const range = new vscode.Range(
                document.positionAt(node.start),
                document.positionAt(node.end)
            );
            edits.push(vscode.TextEdit.replace(range, sorted));
        }
    }

    return edits;
}

function sortNodeWithNested(node: SortableNode, fullText: string, config: SortConfig): string | null {
    const blockText = fullText.substring(node.start, node.end);

    // First, recursively sort any nested objects within the block
    const textWithSortedNested = sortNestedObjects(blockText, config);

    // Now sort the properties of this node
    return sortProperties(node, textWithSortedNested, fullText, config);
}

function sortNestedObjects(text: string, config: SortConfig): string {
    // Parse the text to find nested objects
    const sourceFile = ts.createSourceFile('temp.ts', text, ts.ScriptTarget.Latest, true);
    const nestedNodes: Array<{ start: number; end: number; properties: PropertyInfo[] }> = [];

    function hasInlineComment(node: ts.Node): boolean {
        const nodeText = text.substring(node.getStart(sourceFile), node.getEnd());
        if (/,\s*\/\//.test(nodeText)) return true;
        if (/\/\*[\s\S]*?\*\//.test(nodeText)) return true;
        return false;
    }

    function getPropertyName(element: ts.Node): string | null {
        if (ts.isPropertyAssignment(element)) {
            if (ts.isIdentifier(element.name)) return element.name.text;
            if (ts.isStringLiteral(element.name)) return element.name.text;
        }
        if (ts.isShorthandPropertyAssignment(element)) return element.name.text;
        if (ts.isMethodDeclaration(element) && ts.isIdentifier(element.name)) return element.name.text;
        if (ts.isPropertySignature(element)) {
            if (ts.isIdentifier(element.name)) return element.name.text;
            if (ts.isStringLiteral(element.name)) return element.name.text;
        }
        if (ts.isMethodSignature(element) && ts.isIdentifier(element.name)) return element.name.text;
        return null;
    }

    function visit(node: ts.Node, depth: number) {
        if (ts.isObjectLiteralExpression(node) && depth > 0) {
            if (!hasInlineComment(node) && node.properties.length > 1) {
                const properties: PropertyInfo[] = [];
                for (const prop of node.properties) {
                    const key = getPropertyName(prop);
                    if (key !== null) {
                        properties.push({
                            key,
                            start: prop.getStart(sourceFile),
                            end: prop.getEnd(),
                            text: text.substring(prop.getStart(sourceFile), prop.getEnd())
                        });
                    }
                }
                if (properties.length > 1) {
                    nestedNodes.push({
                        start: node.getStart(sourceFile),
                        end: node.getEnd(),
                        properties
                    });
                }
            }
        }

        if (ts.isTypeLiteralNode(node) && depth > 0) {
            if (node.members.length > 1) {
                const properties: PropertyInfo[] = [];
                for (const member of node.members) {
                    const key = getPropertyName(member);
                    if (key !== null) {
                        properties.push({
                            key,
                            start: member.getStart(sourceFile),
                            end: member.getEnd(),
                            text: text.substring(member.getStart(sourceFile), member.getEnd())
                        });
                    }
                }
                if (properties.length > 1) {
                    nestedNodes.push({
                        start: node.getStart(sourceFile),
                        end: node.getEnd(),
                        properties
                    });
                }
            }
        }

        if (!ts.isClassDeclaration(node) && !ts.isClassExpression(node)) {
            ts.forEachChild(node, child => visit(child, depth + 1));
        }
    }

    visit(sourceFile, 0);

    if (nestedNodes.length === 0) return text;

    // Sort nested nodes by position descending (process from end to start)
    nestedNodes.sort((a, b) => b.start - a.start);

    // Filter to only top-level nested nodes
    const topLevelNested = nestedNodes.filter(node => {
        return !nestedNodes.some(other =>
            other !== node &&
            other.start <= node.start &&
            other.end >= node.end
        );
    });

    let result = text;

    for (const nested of topLevelNested) {
        const nestedText = result.substring(nested.start, nested.end);

        // Recursively sort deeper nested objects first
        const nestedWithChildren = sortNestedObjects(nestedText, config);

        // Sort this nested object's properties
        const sorted = sortPropertiesSimple(nested.properties, nestedWithChildren, nested.start, config);

        if (sorted !== null) {
            result = result.substring(0, nested.start) + sorted + result.substring(nested.end);
        } else if (nestedWithChildren !== nestedText) {
            result = result.substring(0, nested.start) + nestedWithChildren + result.substring(nested.end);
        }
    }

    return result;
}

function sortPropertiesSimple(
    properties: PropertyInfo[],
    blockText: string,
    blockStart: number,
    config: SortConfig
): string | null {
    if (properties.length <= 1) return null;

    const priorityKeys = config.enablePriorityKeys ? config.priorityKeys : [];
    const sorted = [...properties].sort((a, b) => {
        const priorityDiff = getPriority(a.key, priorityKeys) - getPriority(b.key, priorityKeys);
        if (priorityDiff !== 0) return priorityDiff;

        const comparison = config.caseSensitive
            ? a.key.localeCompare(b.key)
            : a.key.toLowerCase().localeCompare(b.key.toLowerCase());

        return config.sortOrder === 'desc' ? -comparison : comparison;
    });

    const isSorted = properties.every((p, i) => p.key === sorted[i].key);
    if (isSorted) return null;

    // Re-extract property texts from the current blockText (may have been modified by nested sorting)
    const updatedProperties = properties.map(prop => ({
        ...prop,
        text: blockText.substring(prop.start - blockStart, prop.end - blockStart)
    }));

    const updatedSorted = sorted.map(prop => {
        const originalIdx = properties.findIndex(p => p.key === prop.key);
        return updatedProperties[originalIdx];
    });

    return swapProperties(blockText, updatedProperties, updatedSorted, blockStart);
}

function sortProperties(
    node: SortableNode,
    blockText: string,
    fullText: string,
    config: SortConfig
): string | null {
    const properties = node.properties;
    if (properties.length <= 1) return blockText !== fullText.substring(node.start, node.end) ? blockText : null;

    const priorityKeys = config.enablePriorityKeys ? config.priorityKeys : [];
    const sorted = [...properties].sort((a, b) => {
        const priorityDiff = getPriority(a.key, priorityKeys) - getPriority(b.key, priorityKeys);
        if (priorityDiff !== 0) return priorityDiff;

        const comparison = config.caseSensitive
            ? a.key.localeCompare(b.key)
            : a.key.toLowerCase().localeCompare(b.key.toLowerCase());

        return config.sortOrder === 'desc' ? -comparison : comparison;
    });

    const isSorted = properties.every((p, i) => p.key === sorted[i].key);

    // If properties are already sorted but we modified nested objects, still return the modified text
    if (isSorted) {
        const originalText = fullText.substring(node.start, node.end);
        return blockText !== originalText ? blockText : null;
    }

    // Re-extract property texts from the current blockText
    const updatedProperties = properties.map(prop => ({
        ...prop,
        text: blockText.substring(prop.start - node.start, prop.end - node.start)
    }));

    const updatedSorted = sorted.map(prop => {
        const originalIdx = properties.findIndex(p => p.key === prop.key);
        return updatedProperties[originalIdx];
    });

    return swapProperties(blockText, updatedProperties, updatedSorted, node.start);
}

function swapProperties(
    blockText: string,
    original: PropertyInfo[],
    sorted: PropertyInfo[],
    blockStart: number
): string {
    // Normalize trailing delimiters (; in interfaces/types, , in type literals)
    // For objects/imports, commas live in the gaps so no normalization is needed
    const delimRegex = /[,;]\s*$/;
    const propsWithDelim = original.filter(p => delimRegex.test(p.text));

    if (propsWithDelim.length > 0) {
        const delimType = propsWithDelim[0].text.match(/([,;])\s*$/)![1];
        const lastHasDelimiter = delimRegex.test(original[original.length - 1].text);

        sorted = sorted.map((prop, idx) => {
            let text = prop.text.replace(/[,;]\s*$/, '');
            const isLast = idx === sorted.length - 1;
            if (!isLast || lastHasDelimiter) {
                text += delimType;
            }
            return { ...prop, text };
        });
    }

    const relativeProps = original.map((prop, idx) => ({
        relStart: prop.start - blockStart,
        relEnd: prop.end - blockStart,
        sortedText: sorted[idx].text
    }));

    let result = '';
    let lastEnd = 0;

    for (const prop of relativeProps) {
        result += blockText.substring(lastEnd, prop.relStart);
        result += prop.sortedText;
        lastEnd = prop.relEnd;
    }

    result += blockText.substring(lastEnd);

    return result;
}

export async function applyEdits(editor: vscode.TextEditor, edits: vscode.TextEdit[]): Promise<void> {
    if (edits.length === 0) return;

    await editor.edit(
        builder => {
            for (const edit of edits) {
                builder.replace(edit.range, edit.newText);
            }
        },
        { undoStopAfter: false, undoStopBefore: false }
    );
}
