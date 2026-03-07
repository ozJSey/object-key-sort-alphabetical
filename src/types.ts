import * as ts from 'typescript';

export interface SortConfig {
    caseSensitive: boolean;
    enabled: boolean;
    enablePriorityKeys: boolean;
    excludePatterns: string[];
    priorityKeys: string[];
    sortImports: boolean;
    sortOnSave: boolean;
    sortOrder: 'asc' | 'desc';
    supportedLanguages: string[];
}

export type SortableNodeType = 'object' | 'interface' | 'type' | 'import';

export interface SortableNode {
    type: SortableNodeType;
    node: ts.Node;
    start: number;
    end: number;
    properties: PropertyInfo[];
}

export interface PropertyInfo {
    key: string;
    start: number;
    end: number;
    text: string;
}

export interface ScriptBlock {
    contentStart: number;
    contentEnd: number;
}
