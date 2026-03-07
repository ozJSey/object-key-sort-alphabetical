"use strict";
import * as vscode from 'vscode';
import { getConfig, matchesPattern } from './config';
import { parseDocument, findSortableNodes, extractScriptBlocks } from './parser';
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
        const scriptBlocks = extractScriptBlocks(text);

        let allEdits: vscode.TextEdit[] = [];

        if (scriptBlocks) {
            for (const block of scriptBlocks) {
                const scriptContent = text.substring(block.contentStart, block.contentEnd);
                const sourceFile = parseDocument(scriptContent, document.fileName);
                const sortableNodes = findSortableNodes(sourceFile, config);

                if (sortableNodes.length === 0) continue;

                const edits = createEdits(sortableNodes, scriptContent, document, config, block.contentStart);
                allEdits.push(...edits);
            }
        } else {
            const sourceFile = parseDocument(text, document.fileName);
            const sortableNodes = findSortableNodes(sourceFile, config);

            if (sortableNodes.length > 0) {
                allEdits = createEdits(sortableNodes, text, document, config);
            }
        }

        const edits = allEdits;
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
