"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerCompletionProvider = exports.cache = void 0;
const vscode = require("vscode");
exports.cache = {
    javascriptreact: {},
    typescriptreact: {},
};
const registerCompletionProvider = (language) => (vscode.languages.registerCompletionItemProvider({ language }, {
    async provideCompletionItems(document, position, token) {
        if (exports.cache[language][document.fileName]) {
            return new vscode.CompletionList(exports.cache[language][document.fileName], false);
        }
        const start = new vscode.Position(position.line, 0);
        const range = new vscode.Range(start, position);
        const text = document.getText(range);
        const insertRange = new vscode.Range(new vscode.Position(position.line, text.indexOf('href=') + 'href='.length + 1), position);
        const textContextMatch = text.match(/href=["'](.*)$/);
        if (!textContextMatch) {
            return [];
        }
        const prefix = textContextMatch[1];
        const files = await vscode.workspace.findFiles(`src/routes${prefix || '/'}**/index*`, `src/routes/index*`, undefined, token);
        const items = files
            .filter((file) => file.path.includes(prefix))
            .map((file) => {
            const foldername = file.path.match(/\/routes(\/.+\/)index/)?.[1];
            return {
                label: foldername,
                detail: 'Route Path',
                documentation: JSON.stringify({ prefix, foldername }, null, 2),
                preselect: foldername.includes(prefix),
                filterText: prefix,
                kind: vscode.CompletionItemKind.Folder,
                range: insertRange,
                commitCharacters: ['"', "'"],
            };
        });
        exports.cache[language][document.fileName] = items;
        return new vscode.CompletionList(items, true);
    },
}, '/', "'", '"'));
exports.registerCompletionProvider = registerCompletionProvider;
//# sourceMappingURL=registerCompletionProvider.js.map