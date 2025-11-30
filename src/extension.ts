import * as vscode from 'vscode';

const _isSortableContext = (text: string, bracePos: number) => {
    let i = bracePos - 1;
    while (i >= 0 && /[\s\n]/.test(text[i])) i--;
    if (i < 0) return false;
    
    if (text[i] === '=') return true;
    if (text[i] === ':') return true;
    if (text[i] === ',') return true;
    if (text[i] === '[') return true;
    
    const lookback = text.substring(Math.max(0, bracePos - 100), bracePos);
    if (/import\s*$/.test(lookback)) return true;
    if (/\binterface\s+\w+\s*$/.test(lookback)) return true;
    if (/\btype\s+\w+\s*=\s*$/.test(lookback)) return true;
    
    if (text[i] === ')') return false;
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

const _extractProperties = (blockContent: string) => {
    const properties: Array<{ start: number; end: number; key: string; full: string }> = [];
    let current = '';
    let currentStart = 0;
    let depth = 0;
    let inString = false;
    let stringChar = '';
    
    for (let i = 0; i < blockContent.length; i++) {
        const c = blockContent[i];
        const prev = i > 0 ? blockContent[i - 1] : '';
        
        if (!inString && (c === '"' || c === "'" || c === '`')) {
            inString = true;
            stringChar = c;
        } else if (inString && c === stringChar && prev !== '\\') {
            inString = false;
        } else if (!inString) {
            if (c === '{' || c === '[' || c === '(') depth++;
            if (c === '}' || c === ']' || c === ')') depth--;
            
            if ((c === ',' || c === ';') && depth === 0) {
                const prop = current.trim();
                if (prop) {
                    const key = _extractKey(prop);
                    if (key) {
                        properties.push({
                            start: currentStart,
                            end: i,
                            key,
                            full: current
                        });
                    }
                }
                current = '';
                currentStart = i + 1;
                continue;
            }
        }
        current += c;
    }
    
    if (current.trim()) {
        const prop = current.trim();
        const key = _extractKey(prop);
        if (key) {
            properties.push({
                start: currentStart,
                end: blockContent.length,
                key,
                full: current
            });
        }
    }
    
    return properties;
};

const _extractKey = (property: string) => {
    const trimmed = property.trim();
    
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

const _sortBlock = (fullBlock: string) => {
    const openBrace = fullBlock[0];
    const closeBrace = fullBlock[fullBlock.length - 1];
    const content = fullBlock.substring(1, fullBlock.length - 1);
    
    const props = _extractProperties(content);
    if (props.length <= 1) return fullBlock;
    
    const sorted = [...props].sort((a, b) => {
        const diff = _priority(a.key) - _priority(b.key);
        return diff !== 0 ? diff : a.key.localeCompare(b.key);
    });
    
    const isSorted = props.every((p, i) => p.key === sorted[i].key);
    if (isSorted) return fullBlock;
    
    const positionsWithIndex = props.map((p, idx) => ({ 
        start: p.start, 
        end: p.end, 
        originalIndex: idx 
    }));
    positionsWithIndex.sort((a, b) => b.start - a.start);
    
    let result = content;
    positionsWithIndex.forEach(pos => {
        const newContent = sorted[pos.originalIndex].full;
        result = result.substring(0, pos.start) + newContent + result.substring(pos.end);
    });
    
    return openBrace + result + closeBrace;
};

const _findIgnoreComments = (text: string) => {
    const positions: number[] = [];
    const lines = text.split('\n');
    let pos = 0;
    
    lines.forEach(line => {
        if (line.includes('auto-sort-ignore-next-line') || line.includes('auto-sort-ignore')) {
            positions.push(pos + line.length + 1);
        }
        pos += line.length + 1;
    });
    
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
