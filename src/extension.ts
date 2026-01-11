"use strict";
import * as vscode from 'vscode';
import * as path from 'path';

interface SortConfig {
    caseSensitive: boolean;
    enabled: boolean;
    excludePatterns: string[];
    priorityKeys: string[];
    sortImports: boolean;
    sortOnSave: boolean;
    sortOrder: 'asc' | 'desc';
    supportedLanguages: string[];
}

const getConfig = (): SortConfig => {
    const config = vscode.workspace.getConfiguration('objectSortAlphabetical');
    return {
        caseSensitive: config.get<boolean>('caseSensitive', false),
        enabled: config.get<boolean>('enabled', true),
        excludePatterns: config.get<string[]>('excludePatterns', []),
        priorityKeys: config.get<string[]>('priorityKeys', ['id', '_id', 'constructor']),
        sortImports: config.get<boolean>('sortImports', true),
        sortOnSave: config.get<boolean>('sortOnSave', true),
        sortOrder: config.get<'asc' | 'desc'>('sortOrder', 'asc'),
        supportedLanguages: config.get<string[]>('supportedLanguages', 
            ['javascript', 'typescript', 'javascriptreact', 'typescriptreact', 'vue', 'json', 'jsonc'])
    };
};

const matchesPattern = (filePath: string, patterns: string[]): boolean => {
    if (!patterns || patterns.length === 0) return false;
    
    const fileName = path.basename(filePath);
    const relativePath = vscode.workspace.asRelativePath(filePath);
    
    return patterns.some(pattern => {
        // Simple glob matching
        const regexPattern = pattern
            .replace(/\./g, '\\.')
            .replace(/\*/g, '.*')
            .replace(/\?/g, '.');
        const regex = new RegExp(`^${regexPattern}$`);
        return regex.test(fileName) || regex.test(relativePath);
    });
};

export const _isObjectLiteral = (content: string) => {
    const trimmed = content.trim();
    if (trimmed.length === 0) return false;
    
    // Skip objects with inline comments
    if (/,\s*\/\//.test(trimmed)) return false;
    // Skip objects with block comments
    if (/\/\*[\s\S]*?\*\//.test(trimmed)) return false;
    
    let depth = 0;
    let inString = false;
    let stringChar = '';
    let colonCount = 0;
    let commaCount = 0;
    let hasFunctions = false;
    
    for (let i = 0; i < trimmed.length; i++) {
        const c = trimmed[i];
        const prev = i > 0 ? trimmed[i - 1] : '';
        
        if (!inString && (c === '"' || c === "'" || c === '`')) {
            inString = true;
            stringChar = c;
        } else if (inString && c === stringChar && prev !== '\\') {
            inString = false;
        } else if (!inString) {
            if (c === '{' || c === '[' || c === '(') depth++;
            if (c === '}' || c === ']' || c === ')') depth--;
            
            if (depth === 0) {
                if (c === ':') colonCount++;
                if (c === ',') commaCount++;
            }
            
            // Detect function patterns at depth 0 (object level)
            if (depth === 0) {
                // Arrow function detection
                if (c === '(' && i + 1 < trimmed.length) {
                    const nextChars = trimmed.substring(i + 1, Math.min(i + 10, trimmed.length));
                    if (nextChars.includes(')') && trimmed.substring(i + 1).includes('=>')) {
                        hasFunctions = true;
                    }
                }
                // Regular function/method detection
                if ((c === 'f' && trimmed.substring(i, i + 8) === 'function') ||
                    (c === 'a' && trimmed.substring(i, i + 5) === 'async') ||
                    (c === '(' && prev === ')')) { // method shorthand
                    hasFunctions = true;
                }
            }
        }
    }
    
    // For objects with functions, be more lenient - they're still sortable
    if (hasFunctions) {
        return commaCount > 0 || colonCount > 0;
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
    if (/\bclass\s+\w+\s*$/.test(lookback)) return false;
    
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
    
    // Handle regular key: value
    const colonMatch = trimmed.match(/^["']?([^"'\s:]+)["']?\s*:/);
    if (colonMatch) return colonMatch[1];
    
    // Handle computed properties [key]: value
    const computedMatch = trimmed.match(/^\s*\[["']?([^"'\]]+)["']?\]\s*:/);
    if (computedMatch) return computedMatch[1];
    
    // Handle method shorthand: method() { ... }
    const methodMatch = trimmed.match(/^([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\([^)]*\)\s*\{/);
    if (methodMatch) return methodMatch[1];
    
    // Handle arrow functions: key: () => { ... } or key: async () => { ... }
    const arrowFnMatch = trimmed.match(/^([a-zA-Z_$][a-zA-Z0-9_$]*)\s*:\s*(async\s*)?\s*\([^)]*\)\s*=>/);
    if (arrowFnMatch) return arrowFnMatch[1];
    
    // Handle regular function: key: function() { ... }
    const functionMatch = trimmed.match(/^([a-zA-Z_$][a-zA-Z0-9_$]*)\s*:\s*function\s*\(/);
    if (functionMatch) return functionMatch[1];
    
    // Simple shorthand (last resort)
    const shorthandMatch = trimmed.match(/^([a-zA-Z_$][a-zA-Z0-9_$]*)/);
    if (shorthandMatch) return shorthandMatch[1];
    
    return null;
};

const _priority = (key: string, priorityKeys: string[]) => {
    for (let i = 0; i < priorityKeys.length; i++) {
        const priority = priorityKeys[i];
        
        // Support wildcard patterns like '__*'
        if (priority.endsWith('*')) {
            const prefix = priority.slice(0, -1);
            if (key.startsWith(prefix)) {
                return -(priorityKeys.length - i);
            }
        } else if (key === priority) {
            return -(priorityKeys.length - i);
        }
    }
    return 0;
};

const _findPropertyRanges = (content: string) => {
    const ranges: Array<{ end: number; start: number }> = [];
    let depth = 0;
    let inString = false;
    let stringChar = '';
    let propStart = 0;
    
    // Skip initial whitespace
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
            if (c === '{' || c === '[' || c === '(') depth++;
            if (c === '}' || c === ']' || c === ')') depth--;
            
            // Handle generics: <Type>
            if (c === '<') {
                const next = i < content.length - 1 ? content[i + 1] : '';
                if (/^[a-zA-Z0-9_]/.test(next)) depth++;
            }
            if (c === '>') {
                if (prev !== '=' && /^[a-zA-Z0-9_>]/.test(prev)) depth--;
            }
            
            // Split on comma or semicolon at depth 0 (object level)
            if (depth === 0 && (c === ',' || c === ';')) {
                ranges.push({ end: i, start: propStart });
                
                propStart = i + 1;
                // Skip whitespace after separator
                while (propStart < content.length && /[\s\n]/.test(content[propStart])) {
                    propStart++;
                }
            }
        }
    }
    
    // Add the last property
    let propEnd = content.length;
    while (propEnd > propStart && /[\s\n]/.test(content[propEnd - 1])) {
        propEnd--;
    }
    
    if (propStart < propEnd) {
        ranges.push({ end: propEnd, start: propStart });
    }
    
    return ranges;
};

const _sortNestedObjects = (text: string, config: SortConfig): string => {
    let result = text;
    let i = 0;
    let inString = false;
    let stringChar = '';
    
    while (i < result.length) {
        const c = result[i];
        const prev = i > 0 ? result[i - 1] : '';

        if (!inString && (c === '"' || c === "'" || c === '`')) {
            inString = true;
            stringChar = c;
            i++;
            continue;
        } else if (inString && c === stringChar && prev !== '\\') {
            inString = false;
            i++;
            continue;
        }

        if (inString) {
            i++;
            continue;
        }

        if (c === '{' && i + 1 < result.length && result[i + 1] === '{') {
            i += 2;
            continue;
        }

        if (result[i] === '{') {
            const end = _findClosing(result, i);
            if (end === -1) {
                i++;
                continue;
            }
            
            const fullBlock = result.substring(i, end + 1);
            const content = fullBlock.substring(1, fullBlock.length - 1);
            
            // Recursively sort nested objects first
            const sortedNested = _sortNestedObjects(content, config);
            let newBlock = '{' + sortedNested + '}';
            
            // Check if this block itself is an object literal that needs sorting
            if (_isObjectLiteral(content)) {
                newBlock = _sortBlock(newBlock, config);
            }
            
            if (newBlock !== fullBlock) {
                result = result.substring(0, i) + newBlock + result.substring(end + 1);
                i = i + newBlock.length;
            } else {
                i = end + 1;
            }
        } else {
            i++;
        }
    }
    
    return result;
};

export const _sortBlock = (fullBlock: string, config: SortConfig) => {
    const content = fullBlock.substring(1, fullBlock.length - 1);
    const ranges = _findPropertyRanges(content);
    
    if (ranges.length <= 1) return fullBlock;
    
    const properties: Array<{ key: string; range: { end: number; start: number }; text: string }> = [];
    
    ranges.forEach(range => {
        const text = content.substring(range.start, range.end);
        const key = _extractKey(text);
        if (key) {
            properties.push({ key, range, text });
        }
    });
    
    if (properties.length <= 1) return fullBlock;
    
    const sorted = [...properties].sort((a, b) => {
        const priorityDiff = _priority(a.key, config.priorityKeys) - _priority(b.key, config.priorityKeys);
        if (priorityDiff !== 0) return priorityDiff;
        
        const comparison = config.caseSensitive 
            ? a.key.localeCompare(b.key)
            : a.key.toLowerCase().localeCompare(b.key.toLowerCase());
        
        return config.sortOrder === 'desc' ? -comparison : comparison;
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

export const _findBlocksAndSort = (text: string, document: vscode.TextDocument, config: SortConfig) => {
    const edits: vscode.TextEdit[] = [];
    const blocks: Array<{ depth: number; end: number; start: number }> = [];
    const ignorePositions = _findIgnoreComments(text);
    
    let inString = false;
    let stringChar = '';

    for (let i = 0; i < text.length; i++) {
        const c = text[i];
        const prev = i > 0 ? text[i - 1] : '';

        if (!inString && (c === '"' || c === "'" || c === '`')) {
            inString = true;
            stringChar = c;
            continue;
        } else if (inString && c === stringChar && prev !== '\\') {
            inString = false;
            continue;
        }

        if (inString) continue;

        if (c === '{' && i + 1 < text.length && text[i + 1] === '{') {
            i++;
            continue;
        }

        if (text[i] === '{') {
            const end = _findClosing(text, i);
            if (end === -1) continue;
            
            if (_shouldIgnore(text, i, ignorePositions)) continue;
            
            const isSortable = _isSortableContext(text, i);
            if (!isSortable) continue;
            
            const depth = _getDepth(text, i);
            blocks.push({ depth, end, start: i });
        }
    }
    
    blocks.sort((a, b) => a.depth - b.depth);
    
    const processedRanges: Array<{ end: number; start: number }> = [];
    
    blocks.forEach(({ end, start }) => {
        const isNested = processedRanges.some(r => start > r.start && end < r.end);
        if (isNested) return;
        
        const original = text.substring(start, end + 1);
        const sorted = _sortNestedObjects(original.substring(1, original.length - 1), config);
        const sortedBlock = _sortBlock('{' + sorted + '}', config);
        
        if (sortedBlock !== original) {
            edits.push(vscode.TextEdit.replace(
                new vscode.Range(document.positionAt(start), document.positionAt(end + 1)),
                sortedBlock
            ));
            processedRanges.push({ end, start });
        }
    });
    
    return edits.sort((a, b) => b.range.start.line - a.range.start.line);
};

export const _applyEdits = async (editor: vscode.TextEditor, edits: vscode.TextEdit[]) => {
    await edits.reduce(async (promise, edit) => {
        await promise;
        await editor.edit(builder => builder.replace(edit.range, edit.newText), 
            { undoStopAfter: false, undoStopBefore: false });
    }, Promise.resolve());
};

export const activate = (context: vscode.ExtensionContext) => {
    let isSorting = false;
    let skipNextSort = false;

    const saveWithoutSortingCommand = vscode.commands.registerCommand(
        'objectSortAlphabetical.saveWithoutSorting',
        async () => {
            const editor = vscode.window.activeTextEditor;
            if (!editor) {
                vscode.window.showWarningMessage('No active editor');
                return;
            }

            skipNextSort = true;
            try {
                await editor.document.save();
            } finally {
                // Reset flag after a short delay
                setTimeout(() => {
                    skipNextSort = false;
                }, 100);
            }
        }
    );

    const saveListener = vscode.workspace.onDidSaveTextDocument(async (document) => {
        if (isSorting || skipNextSort) return;

        const config = getConfig();
        if (!config.enabled || !config.sortOnSave) return;

        // Check language support
        if (!config.supportedLanguages.includes(document.languageId)) return;

        // Check file exclusion patterns
        if (matchesPattern(document.uri.fsPath, config.excludePatterns)) return;

        const editor = vscode.window.activeTextEditor;
        if (!editor || editor.document.uri.toString() !== document.uri.toString()) return;

        const edits = _findBlocksAndSort(document.getText(), document, config);
        if (!edits.length) return;

        isSorting = true;
        try {
            await _applyEdits(editor, edits);
            await document.save();
        } catch (error) {
            console.error('Error sorting objects:', error);
        } finally {
            isSorting = false;
        }
    });

    context.subscriptions.push(saveListener, saveWithoutSortingCommand);
};

export const deactivate = () => {};