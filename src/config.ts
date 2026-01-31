import * as vscode from 'vscode';
import * as path from 'path';
import { SortConfig } from './types';

export function getConfig(): SortConfig {
    const config = vscode.workspace.getConfiguration('objectSortAlphabetical');
    return {
        caseSensitive: config.get<boolean>('caseSensitive', false),
        enabled: config.get<boolean>('enabled', true),
        enablePriorityKeys: config.get<boolean>('enablePriorityKeys', true),
        excludePatterns: config.get<string[]>('excludePatterns', []),
        priorityKeys: config.get<string[]>('priorityKeys', ['id', '_id', '__typename', 'type']),
        sortImports: config.get<boolean>('sortImports', true),
        sortOnSave: config.get<boolean>('sortOnSave', true),
        sortOrder: config.get<'asc' | 'desc'>('sortOrder', 'asc'),
        supportedLanguages: config.get<string[]>('supportedLanguages',
            ['javascript', 'typescript', 'javascriptreact', 'typescriptreact', 'vue', 'json', 'jsonc'])
    };
}

export function matchesPattern(filePath: string, patterns: string[]): boolean {
    if (!patterns || patterns.length === 0) return false;

    const fileName = path.basename(filePath);
    const relativePath = vscode.workspace.asRelativePath(filePath);

    return patterns.some(pattern => {
        const regexPattern = pattern
            .replace(/\./g, '\\.')
            .replace(/\*/g, '.*')
            .replace(/\?/g, '.');
        const regex = new RegExp(`^${regexPattern}$`);
        return regex.test(fileName) || regex.test(relativePath);
    });
}

export function getPriority(key: string, priorityKeys: string[]): number {
    for (let i = 0; i < priorityKeys.length; i++) {
        const priority = priorityKeys[i];

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
}
