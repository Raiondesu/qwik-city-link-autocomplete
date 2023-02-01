"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateSuggestions = void 0;
const vscode = require("vscode");
const providers_1 = require("./providers");
async function generateSuggestions(prefix, token, insertRange) {
    const files = await vscode.workspace.findFiles((0, providers_1.routesGlob)(prefix), 'src/routes/index*', undefined, token);
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
    return new vscode.CompletionList(items, true);
}
exports.generateSuggestions = generateSuggestions;
//# sourceMappingURL=generateSuggestions.js.map