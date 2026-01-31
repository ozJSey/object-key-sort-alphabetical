"use strict";
import * as vscode from 'vscode';
import { getConfig, matchesPattern } from './config';
import { parseDocument, findSortableNodes } from './parser';
import { createEdits, applyEdits } from './sorter';

export function activate(context: vscode.ExtensionContext) {
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

        if (!config.supportedLanguages.includes(document.languageId)) return;

        if (matchesPattern(document.uri.fsPath, config.excludePatterns)) return;

        const editor = vscode.window.activeTextEditor;
        if (!editor || editor.document.uri.toString() !== document.uri.toString()) return;

        const text = document.getText();
        const sourceFile = parseDocument(text, document.fileName);
        const sortableNodes = findSortableNodes(sourceFile, config);

        if (sortableNodes.length === 0) return;

        const edits = createEdits(sortableNodes, text, document, config);
        if (edits.length === 0) return;

        isSorting = true;
        try {
            await applyEdits(editor, edits);
            await document.save();
        } catch (error) {
            console.error('Error sorting objects:', error);
        } finally {
            isSorting = false;
        }
    });

    context.subscriptions.push(saveListener, saveWithoutSortingCommand);
}

export function deactivate() {}
