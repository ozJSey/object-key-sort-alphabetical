"use strict";
import * as vscode from 'vscode';

// Structural detection - no keyword checking
// An object literal: { key: value, key2: value2 } or { shorthand, other }
export const _isObjectLiteral = (content: string) => {
    const trimmed = content.trim();
    if (trimmed.length === 0) return false;
    
    let depth = 0;
    let inString = false;
    let stringChar = '';
    let colonCount = 0;
    let commaCount = 0;
    let semicolonCount = 0;
    
    for (let i = 0; i < trimmed.length; i++) {
        const c = trimmed[i];
        const prev = i > 0 ? trimmed[i - 1] : '';
        
        if (!inString && (c === '"' || c === "'" || c === '`')) {
            inString = true;
            stringChar = c;
        } else if (inString && c === stringChar && prev !== '\\') {
            inString = false;
        } else if (!inString) {
            if (c === '{' || c === '[' || c === '(' || c === '<') depth++;
            if (c === '}' || c === ']' || c === ')') depth--;
            if (c === '>' && prev !== '=') depth--;
            
            if (depth === 0) {
                if (c === ':') colonCount++;
                if (c === ',') commaCount++;
                if (c === ';') semicolonCount++;
            }
        }
    }
    
    const isObject = (colonCount > 0 && colonCount >= commaCount) || 
                     (commaCount > 0 && /^[\s\n]*[a-zA-Z_$][\w]*[\s\n]*,/.test(trimmed));
    
    return isObject;
};

export const _isSortableContext = (text: string, bracePos: number) => {
    const closePos = _findClosing(text, bracePos);
    if (closePos === -1) return false;
    
    const content = text.substring(bracePos + 1, closePos);
    
    if (_isObjectLiteral(content)) {
        return true;
    }
    
    const lookback = text.substring(Math.max(0, bracePos - 100), bracePos);
    if (/\b(import|export)\s*$/.test(lookback)) return true;
    if (/\binterface\s+\w+\s*$/.test(lookback)) return true;
    if (/\btype\s+\w+\s*=\s*$/.test(lookback)) return true;
    
    return false;
};

export const _findClosing = (text: string, start: number) => {
    let depth = 0;
    let inString = false;
    let stringChar = '';
    
    for (let i = start; i < text.length; i++) {
        const c = text[i];
        const prev = i > 0 ? text[i - 1] : '';
        
        if (!inString && (c === '"' || c === "'" || c === '`')) {
            inString = true;
            stringChar = c;
        } else if (inString && c === stringChar && prev !== '\\') {
            inString = false;
        } else if (!inString) {
            if (c === '{') depth++;
            if (c === '}') {
                depth--;
                if (depth === 0) return i;
            }
        }
    }
    return -1;
};

export const _extractKey = (propertyText: string) => {
    const trimmed = propertyText.trim();
    
    const colonMatch = trimmed.match(/^["']?([^:"'\s]+)["']?\s*:/);
    if (colonMatch) return colonMatch[1];
    
    const shorthandMatch = trimmed.match(/^([a-zA-Z_$][a-zA-Z0-9_$]*)/);
    if (shorthandMatch) return shorthandMatch[1];
    
    return null;
};

const _priority = (key: string) => {
    if (key.startsWith('__')) return -3;
    if (key === 'id') return -2;
    if (key === '_id') return -1;
    return 0;
};

const _findPropertyRanges = (content: string) => {
    const ranges: Array<{ start: number; end: number }> = [];
    let depth = 0;
    let inString = false;
    let stringChar = '';
    let propStart = 0;
    
    while (propStart < content.length && /[\s\n]/.test(content[propStart])) {
        propStart++;
    }
    
    for (let i = 0; i < content.length; i++) {
        const c = content[i];
        const prev = i > 0 ? content[i - 1] : '';
        
        if (!inString && (c === '"' || c === "'" || c === '`')) {
            inString = true;
            stringChar = c;
        } else if (inString && c === stringChar && prev !== '\\') {
            inString = false;
        } else if (!inString) {
            if (c === '{' || c === '[' || c === '(' || c === '<') depth++;
            if (c === '}' || c === ']' || c === ')') depth--;
            if (c === '>' && prev !== '=') depth--;
            
            if (c === ',' && depth === 0) {
                // Property ends at comma, but we need to check if there's an inline comment after it
                let propEnd = i;
                
                // Look ahead after the comma for inline comment
                let checkPos = i + 1;
                // Skip spaces/tabs after comma
                while (checkPos < content.length && (content[checkPos] === ' ' || content[checkPos] === '\t')) {
                    checkPos++;
                }
                
                // If we find //, include everything up to the newline as part of this property
                if (checkPos + 1 < content.length && content[checkPos] === '/' && content[checkPos + 1] === '/') {
                    // Find the end of the line
                    let lineEnd = content.indexOf('\n', checkPos);
                    if (lineEnd === -1) lineEnd = content.length;
                    propEnd = lineEnd;
                }
                
                ranges.push({ start: propStart, end: propEnd });
                
                propStart = propEnd + 1;
                while (propStart < content.length && /[\s\n]/.test(content[propStart])) {
                    propStart++;
                }
            }
        }
    }
    
    let propEnd = content.length;
    while (propEnd > propStart && /[\s\n]/.test(content[propEnd - 1])) {
        propEnd--;
    }
    
    if (propStart < propEnd) {
        ranges.push({ start: propStart, end: propEnd });
    }
    
    return ranges;
};

const _sortNestedObjects = (text: string): string => {
    let result = text;
    let i = 0;
    
    while (i < result.length) {
        if (result[i] === '{') {
            const end = _findClosing(result, i);
            if (end === -1) {
                i++;
                continue;
            }
            
            const fullBlock = result.substring(i, end + 1);
            const content = fullBlock.substring(1, fullBlock.length - 1);
            
            if (_isObjectLiteral(content)) {
                const sortedNested = _sortNestedObjects(content);
                const sortedBlock = _sortBlock('{' + sortedNested + '}');
                
                if (sortedBlock !== fullBlock) {
                    result = result.substring(0, i) + sortedBlock + result.substring(end + 1);
                    i = i + sortedBlock.length;
                    continue;
                }
            }
            
            i = end + 1;
        } else {
            i++;
        }
    }
    
    return result;
};

export const _sortBlock = (fullBlock: string) => {
    const content = fullBlock.substring(1, fullBlock.length - 1);
    const ranges = _findPropertyRanges(content);
    
    if (ranges.length <= 1) return fullBlock;
    
    const properties: Array<{ text: string; key: string; range: { start: number; end: number } }> = [];
    
    ranges.forEach(range => {
        const text = content.substring(range.start, range.end);
        const key = _extractKey(text);
        if (key) {
            properties.push({ text, key, range });
        }
    });
    
    if (properties.length <= 1) return fullBlock;
    
    const sorted = [...properties].sort((a, b) => {
        const diff = _priority(a.key) - _priority(b.key);
        return diff !== 0 ? diff : a.key.localeCompare(b.key);
    });
    
    const isSorted = properties.every((p, i) => p.key === sorted[i].key);
    if (isSorted) return fullBlock;
    
    let result = fullBlock[0];
    let lastEnd = 0;
    
    properties.forEach((prop, idx) => {
        result += content.substring(lastEnd, prop.range.start);
        result += sorted[idx].text;
        lastEnd = prop.range.end;
    });
    
    result += content.substring(lastEnd);
    result += fullBlock[fullBlock.length - 1];
    
    return result;
};

const _findIgnoreComments = (text: string) => {
    const positions: number[] = [];
    let i = 0;
    
    while (i < text.length) {
        if (text.substring(i, i + 27) === '// auto-sort-ignore-next-line' || 
            text.substring(i, i + 19) === '// auto-sort-ignore') {
            let lineEnd = text.indexOf('\n', i);
            if (lineEnd === -1) lineEnd = text.length;
            positions.push(lineEnd + 1);
        }
        const nextNewline = text.indexOf('\n', i);
        if (nextNewline === -1) break;
        i = nextNewline + 1;
    }
    
    return positions;
};

const _shouldIgnore = (text: string, bracePos: number, ignorePositions: number[]) => {
    return ignorePositions.some(ignorePos => {
        const distance = bracePos - ignorePos;
        return distance >= 0 && distance < 50;
    });
};

const _getDepth = (text: string, pos: number) => {
    let depth = 0;
    let inString = false;
    let stringChar = '';
    
    for (let i = 0; i < pos; i++) {
        const c = text[i];
        const prev = i > 0 ? text[i - 1] : '';
        
        if (!inString && (c === '"' || c === "'" || c === '`')) {
            inString = true;
            stringChar = c;
        } else if (inString && c === stringChar && prev !== '\\') {
            inString = false;
        } else if (!inString) {
            if (c === '{' || c === '[') depth++;
            if (c === '}' || c === ']') depth--;
        }
    }
    
    return depth;
};

export const _findBlocksAndSort = (text: string, document: vscode.TextDocument) => {
    const edits: vscode.TextEdit[] = [];
    const blocks: Array<{ start: number; end: number; depth: number }> = [];
    const ignorePositions = _findIgnoreComments(text);
    
    for (let i = 0; i < text.length; i++) {
        if (text[i] === '{') {
            const end = _findClosing(text, i);
            if (end === -1) continue;
            
            if (_shouldIgnore(text, i, ignorePositions)) continue;
            
            const isSortable = _isSortableContext(text, i);
            if (!isSortable) continue;
            
            const depth = _getDepth(text, i);
            blocks.push({ start: i, end, depth });
        }
    }
    
    blocks.sort((a, b) => a.depth - b.depth);
    
    const processedRanges: Array<{ start: number; end: number }> = [];
    
    blocks.forEach(({ start, end }) => {
        const isNested = processedRanges.some(r => start > r.start && end < r.end);
        if (isNested) return;
        
        const original = text.substring(start, end + 1);
        const sorted = _sortNestedObjects(original.substring(1, original.length - 1));
        const sortedBlock = _sortBlock('{' + sorted + '}');
        
        if (sortedBlock !== original) {
            edits.push(vscode.TextEdit.replace(
                new vscode.Range(document.positionAt(start), document.positionAt(end + 1)),
                sortedBlock
            ));
            processedRanges.push({ start, end });
        }
    });
    
    return edits.sort((a, b) => b.range.start.line - a.range.start.line);
};

export const _applyEdits = async (editor: vscode.TextEditor, edits: vscode.TextEdit[]) => {
    await edits.reduce(async (promise, edit) => {
        await promise;
        await editor.edit(builder => builder.replace(edit.range, edit.newText), 
            { undoStopBefore: false, undoStopAfter: false });
    }, Promise.resolve());
};

export const activate = (context: vscode.ExtensionContext) => {
    let isSorting = false;

    const saveListener = vscode.workspace.onDidSaveTextDocument(async (document) => {
        if (isSorting) return;

        const config = vscode.workspace.getConfiguration('objectSortAlphabetical');
        if (!config.get<boolean>('enabled', true) || !config.get<boolean>('sortOnSave', true)) return;

        const supported = ['javascript', 'typescript', 'javascriptreact', 'typescriptreact', 'json', 'jsonc'];
        if (!supported.includes(document.languageId)) return;

        const editor = vscode.window.activeTextEditor;
        if (!editor || editor.document.uri.toString() !== document.uri.toString()) return;

        const edits = _findBlocksAndSort(document.getText(), document);
        if (!edits.length) return;

        isSorting = true;
        await _applyEdits(editor, edits);
        await document.save();
        isSorting = false;
    });

    context.subscriptions.push(saveListener);
};

export const deactivate = () => {};
