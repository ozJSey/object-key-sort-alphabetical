import * as ts from 'typescript';
import { SortableNode, PropertyInfo, SortConfig, ScriptBlock } from './types';

export function extractScriptBlocks(text: string): ScriptBlock[] | null {
    const blocks: ScriptBlock[] = [];
    const openTag = /<script[^>]*>/gi;
    const closeTag = /<\/script>/gi;

    let match;
    while ((match = openTag.exec(text)) !== null) {
        const contentStart = match.index + match[0].length;
        closeTag.lastIndex = contentStart;
        const close = closeTag.exec(text);
        if (close) {
            blocks.push({ contentStart, contentEnd: close.index });
        }
    }

    return blocks.length > 0 ? blocks : null;
}

export function parseDocument(text: string, fileName: string): ts.SourceFile {
    return ts.createSourceFile(
        fileName,
        text,
        ts.ScriptTarget.Latest,
        true,
        getScriptKind(fileName)
    );
}

function getScriptKind(fileName: string): ts.ScriptKind {
    if (fileName.endsWith('.tsx')) return ts.ScriptKind.TSX;
    if (fileName.endsWith('.ts')) return ts.ScriptKind.TS;
    if (fileName.endsWith('.jsx')) return ts.ScriptKind.JSX;
    if (fileName.endsWith('.js')) return ts.ScriptKind.JS;
    if (fileName.endsWith('.json')) return ts.ScriptKind.JSON;
    return ts.ScriptKind.TS;
}

export function findSortableNodes(sourceFile: ts.SourceFile, config: SortConfig): SortableNode[] {
    const allNodes: SortableNode[] = [];
    const text = sourceFile.getFullText();

    function hasIgnoreComment(node: ts.Node): boolean {
        const fullStart = node.getFullStart();
        const start = node.getStart(sourceFile);
        const trivia = text.substring(fullStart, start);
        return trivia.includes('auto-sort-ignore');
    }

    function hasInlineComment(node: ts.Node): boolean {
        const nodeText = text.substring(node.getStart(sourceFile), node.getEnd());
        if (/,\s*\/\//.test(nodeText)) return true;
        if (/\/\*[\s\S]*?\*\//.test(nodeText)) return true;
        return false;
    }

    function getPropertyName(element: ts.Node): string | null {
        if (ts.isPropertyAssignment(element)) {
            if (ts.isIdentifier(element.name)) {
                return element.name.text;
            }
            if (ts.isStringLiteral(element.name)) {
                return element.name.text;
            }
            if (ts.isComputedPropertyName(element.name)) {
                const expr = element.name.expression;
                if (ts.isStringLiteral(expr)) {
                    return expr.text;
                }
            }
        }

        if (ts.isShorthandPropertyAssignment(element)) {
            return element.name.text;
        }

        if (ts.isMethodDeclaration(element)) {
            if (ts.isIdentifier(element.name)) {
                return element.name.text;
            }
        }

        if (ts.isSpreadAssignment(element)) {
            return null;
        }

        if (ts.isPropertySignature(element)) {
            if (ts.isIdentifier(element.name)) {
                return element.name.text;
            }
            if (ts.isStringLiteral(element.name)) {
                return element.name.text;
            }
        }

        if (ts.isMethodSignature(element)) {
            if (ts.isIdentifier(element.name)) {
                return element.name.text;
            }
        }

        if (ts.isImportSpecifier(element)) {
            return element.name.text;
        }

        return null;
    }

    function extractProperties(members: ts.NodeArray<ts.Node>): PropertyInfo[] {
        const properties: PropertyInfo[] = [];

        for (const member of members) {
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

        return properties;
    }

    function visit(node: ts.Node) {
        if (hasIgnoreComment(node)) {
            return;
        }

        if (ts.isObjectLiteralExpression(node)) {
            if (hasInlineComment(node)) {
                ts.forEachChild(node, visit);
                return;
            }

            const properties = extractProperties(node.properties);
            if (properties.length > 1) {
                allNodes.push({
                    type: 'object',
                    node,
                    start: node.getStart(sourceFile),
                    end: node.getEnd(),
                    properties
                });
            }
        }

        if (ts.isInterfaceDeclaration(node)) {
            const properties = extractProperties(node.members);
            if (properties.length > 1) {
                allNodes.push({
                    type: 'interface',
                    node,
                    start: node.members.pos,
                    end: node.members.end,
                    properties
                });
            }
        }

        if (ts.isTypeLiteralNode(node)) {
            const properties = extractProperties(node.members);
            if (properties.length > 1) {
                allNodes.push({
                    type: 'type',
                    node,
                    start: node.getStart(sourceFile),
                    end: node.getEnd(),
                    properties
                });
            }
        }

        if (ts.isNamedImports(node) && config.sortImports) {
            const properties = extractProperties(node.elements);
            if (properties.length > 1) {
                allNodes.push({
                    type: 'import',
                    node,
                    start: node.getStart(sourceFile),
                    end: node.getEnd(),
                    properties
                });
            }
        }

        if (ts.isClassDeclaration(node) || ts.isClassExpression(node)) {
            return;
        }

        ts.forEachChild(node, visit);
    }

    visit(sourceFile);

    // Filter to only top-level nodes (remove nodes nested inside other sortable nodes)
    const topLevelNodes = allNodes.filter(node => {
        const isNested = allNodes.some(other =>
            other !== node &&
            other.start <= node.start &&
            other.end >= node.end
        );
        return !isNested;
    });

    // Sort by position descending (process later positions first to maintain correct offsets)
    return topLevelNodes.sort((a, b) => b.start - a.start);
}
