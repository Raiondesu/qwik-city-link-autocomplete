"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateSuggestions = void 0;
const vscode = require("vscode");
const routesGlob = 'src/routes/**/index*';
const createCompletionItem = (foldername, prefix) => ({
    label: foldername,
    detail: 'Route Path',
    documentation: 'Autocompleted based on `routes` folder contents',
    preselect: foldername.includes(prefix),
    kind: vscode.CompletionItemKind.Folder,
    commitCharacters: ['"', "'"],
});
async function generateSuggestions(prefix, token) {
    const files = await vscode.workspace.findFiles(routesGlob, 'src/routes/index*', undefined, token);
    const globalItems = files
        .map((file) => {
        const foldername = file.path.match(/\/routes(\/.+\/)index/)?.[1];
        return createCompletionItem(foldername, prefix);
    });
    // TODO: add local links (without leading "/")
    return [
        createCompletionItem('/', prefix),
        ...globalItems
    ];
}
exports.generateSuggestions = generateSuggestions;
//# sourceMappingURL=generate-suggestions.js.map