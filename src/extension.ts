import * as vscode from 'vscode';

const _isSortableContext = (text: string, bracePos: number) => {
    let i = bracePos - 1;
    while (i >= 0 && /[\s\n]/.test(text[i])) i--;
    if (i < 0) return false;
    
    if (text[i] === ')') return false;
    
    if (text[i] === '=') {
        if (i > 0 && text[i - 1] === '=') return false;
        if (i < text.length - 1 && text[i + 1] === '>') return false;
        return true;
    }
    
    if (text[i] === '>') {
        if (i > 0 && text[i - 1] === '=') return false;
    }
    
    if (text[i] === ':') return true;
    if (text[i] === ',') return true;
    if (text[i] === '[') return true;
    
    const lookback = text.substring(Math.max(0, bracePos - 100), bracePos);
    if (/import\s*$/.test(lookback)) return true;
    if (/\binterface\s+\w+\s*$/.test(lookback)) return true;
    if (/\btype\s+\w+\s*=\s*$/.test(lookback)) return true;
    
    if (/\b(const|let|var)\s+$/.test(lookback)) return true;
    
    if (/\bclass\s+\w+/.test(lookback)) return false;
    
    return false;
};

const _findClosing = (text: string, start: number) => {
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

const _extractKey = (propertyText: string) => {
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
            if (c === '}' || c === ']' || c === ')' || c === '>') depth--;
            
            if ((c === ',' || c === ';') && depth === 0) {
                ranges.push({ start: propStart, end: i });
                
                propStart = i + 1;
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

const _sortBlock = (fullBlock: string) => {
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
    let pos = 0;
    let i = 0;
    
    while (i < text.length) {
        if (text.substring(i, i + 24) === 'auto-sort-ignore-next-line' || 
            text.substring(i, i + 16) === 'auto-sort-ignore') {
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
            if (!_isSortableContext(text, i)) continue;
            
            const depth = _getDepth(text, i);
            blocks.push({ start: i, end, depth });
        }
    }
    
    blocks.sort((a, b) => b.depth - a.depth);
    
    blocks.forEach(({ start, end }) => {
        const original = text.substring(start, end + 1);
        const sorted = _sortBlock(original);
        
        if (sorted !== original) {
            edits.push(vscode.TextEdit.replace(
                new vscode.Range(document.positionAt(start), document.positionAt(end + 1)),
                sorted
            ));
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
