import * as vscode from 'vscode';

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

const _findBlocksAndSort = (text: string, document: vscode.TextDocument) => {
    const edits: vscode.TextEdit[] = [];
    const blocks: Array<{ start: number; end: number; depth: number; isArray: boolean }> = [];
    const ignorePositions = _findIgnoreComments(text);
    
    for (let i = 0; i < text.length; i++) {
        if (text[i] === '{') {
            const end = _findClosing(text, i, '{', '}');
            if (end === -1) continue;
            
            if (_shouldIgnoreBlock(text, i, ignorePositions)) continue;
            
            const depth = _getDepth(text, i);
            blocks.push({ start: i, end, depth, isArray: false });
        } else if (text[i] === '[') {
            const end = _findClosing(text, i, '[', ']');
            if (end === -1) continue;
            
            if (_shouldIgnoreBlock(text, i, ignorePositions)) continue;
            
            const depth = _getDepth(text, i);
            blocks.push({ start: i, end, depth, isArray: true });
        }
    }
    
    blocks.sort((a, b) => b.depth - a.depth);
    
    blocks.forEach(({ start, end, isArray }) => {
        const block = text.substring(start, end + 1);
        const sorted = isArray ? _sortArrayIfNeeded(block) : _sortIfNeeded(block);
        
        if (sorted !== block) {
            edits.push(vscode.TextEdit.replace(
                new vscode.Range(document.positionAt(start), document.positionAt(end + 1)),
                sorted
            ));
        }
    });
    
    return edits.sort((a, b) => b.range.start.line - a.range.start.line);
};

const _findIgnoreComments = (text: string) => {
    const positions: number[] = [];
    const lines = text.split('\n');
    let currentPos = 0;
    
    lines.forEach((line, index) => {
        if (line.includes('auto-sort-ignore-next-line') || line.includes('auto-sort-ignore')) {
            const nextLineStart = currentPos + line.length + 1;
            positions.push(nextLineStart);
        }
        currentPos += line.length + 1;
    });
    
    return positions;
};

const _shouldIgnoreBlock = (text: string, blockStart: number, ignorePositions: number[]) => {
    return ignorePositions.some(ignorePos => {
        const distance = blockStart - ignorePos;
        return distance >= 0 && distance < 200;
    });
};

const _getDepth = (text: string, pos: number) => {
    let depth = 0;
    let inString = false;
    let quote = '';
    
    for (let i = 0; i < pos; i++) {
        const c = text[i];
        
        if (!inString && (c === '"' || c === "'" || c === '`')) {
            inString = true;
            quote = c;
        } else if (inString && c === quote && text[i - 1] !== '\\') {
            inString = false;
        } else if (!inString) {
            if (c === '{' || c === '[') depth++;
            if (c === '}' || c === ']') depth--;
        }
    }
    
    return depth;
};

const _sortArrayIfNeeded = (array: string) => {
    const inner = array.slice(1, -1);
    const items = _splitItems(inner);
    
    if (items.length <= 1) return array;
    
    const isPrimitive = items.every(item => {
        const trimmed = item.trim();
        return /^["'`]/.test(trimmed) || 
               /^\d+$/.test(trimmed) || 
               /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(trimmed) ||
               trimmed === 'true' || 
               trimmed === 'false' ||
               trimmed === 'null' ||
               trimmed === 'undefined';
    });
    
    if (!isPrimitive) return array;
    
    const contents = items.map(item => item.replace(/^[\s\n]+/, '').replace(/[\s\n,]+$/, ''));
    const sorted = [...contents].sort((a, b) => {
        const cleanA = a.replace(/^["'`]|["'`]$/g, '');
        const cleanB = b.replace(/^["'`]|["'`]$/g, '');
        return cleanA.localeCompare(cleanB);
    });
    
    if (contents.every((c, i) => c === sorted[i])) return array;
    
    const rebuilt = items.map((originalItem, i) => {
        const leading = originalItem.match(/^[\s\n]*/)?.[0] || '';
        const trailing = originalItem.match(/[\s\n,]*$/)?.[0] || '';
        return leading + sorted[i] + trailing;
    });
    
    return '[' + rebuilt.join(',') + ']';
};

const _findClosing = (text: string, start: number, openChar = '{', closeChar = '}') => {
    let depth = 0;
    let inString = false;
    let quote = '';
    
    for (let i = start; i < text.length; i++) {
        const c = text[i];
        
        if (!inString && (c === '"' || c === "'" || c === '`')) {
            inString = true;
            quote = c;
        } else if (inString && c === quote && text[i - 1] !== '\\') {
            inString = false;
        } else if (!inString) {
            if (c === openChar) depth++;
            if (c === closeChar) {
                depth--;
                if (depth === 0) return i;
            }
        }
    }
    
    return -1;
};

const _sortIfNeeded = (block: string) => {
    const inner = block.slice(1, -1);
    const items = _splitItems(inner);
    
    if (items.length <= 1) return block;
    
    const contents = items.map(item => item.replace(/^[\s\n]+/, '').replace(/[\s\n,;]+$/, ''));
    const sorted = [...contents].sort((a, b) => {
        const keyA = _getKey(a);
        const keyB = _getKey(b);
        const diff = _priority(keyA) - _priority(keyB);
        return diff !== 0 ? diff : keyA.localeCompare(keyB);
    });
    
    if (contents.every((c, i) => _getKey(c) === _getKey(sorted[i]))) return block;
    
    const rebuilt = items.map((originalItem, i) => {
        const leading = originalItem.match(/^[\s\n]*/)?.[0] || '';
        const trailing = originalItem.match(/[\s\n,;]*$/)?.[0] || '';
        return leading + sorted[i] + trailing;
    });
    
    const firstItemTrailing = items[0].match(/[\s\n,;]*$/)?.[0] || '';
    const separator = firstItemTrailing.includes(';') ? ';' : ',';
    
    return '{' + rebuilt.join(separator) + '}';
};

const _splitItems = (text: string) => {
    const items: string[] = [];
    let current = '';
    let depth = 0;
    let inString = false;
    let quote = '';
    
    text.split('').forEach((c, i) => {
        if (!inString && (c === '"' || c === "'" || c === '`')) {
            inString = true;
            quote = c;
        } else if (inString && c === quote && text[i - 1] !== '\\') {
            inString = false;
        } else if (!inString && (c === '{' || c === '[' || c === '(')) {
            depth++;
        } else if (!inString && (c === '}' || c === ']' || c === ')')) {
            depth--;
        } else if (!inString && (c === ',' || c === ';') && depth === 0) {
            items.push(current);
            current = '';
            return;
        }
        current += c;
    });
    
    if (current.trim()) items.push(current);
    
    return items;
};

const _getKey = (item: string) => {
    const match = item.match(/^["']?([^:"'\s]+)["']?\s*:/);
    if (match) return match[1];
    const shorthand = item.match(/^([a-zA-Z_$][a-zA-Z0-9_$]*)/);
    return shorthand ? shorthand[1] : item;
};

const _priority = (key: string) => {
    if (key.startsWith('__')) return -3;
    if (key === 'id') return -2;
    if (key === '_id') return -1;
    return 0;
};

const _applyEdits = async (editor: vscode.TextEditor, edits: vscode.TextEdit[]) => {
    await edits.reduce(async (promise, edit) => {
        await promise;
        await editor.edit(builder => builder.replace(edit.range, edit.newText), 
            { undoStopBefore: false, undoStopAfter: false });
    }, Promise.resolve());
};

export const deactivate = () => {};
