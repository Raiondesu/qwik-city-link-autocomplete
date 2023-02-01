"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateSuggestions = exports.isParamLink = void 0;
const vscode = require("vscode");
const routesGlob = 'src/routes/**/index*';
const createCompletionItem = (foldername, prefix, quoteMark) => {
    const documentation = 'Autocompleted based on `routes` folder contents';
    const item = {
        label: foldername,
        detail: 'Regular link',
        documentation: `href="${foldername}"\n${documentation}`,
        sortText: foldername,
        preselect: foldername.includes(prefix),
        kind: vscode.CompletionItemKind.Folder,
        commitCharacters: ['"', "'"],
    };
    // If there are no [parameters] in the route
    if (!(0, exports.isParamLink)(foldername)) {
        return item;
    }
    // Set insertText to template string if a route paramter is found
    item.insertText = item.label.toString().replace(/\[(?:\.\.\.)?(.+?)\]/g, '\$\{$1\}');
    item.detail = 'Link with params';
    item.documentation = 'href='
        + quoteMark
        + item.insertText
        + `${quoteMark === '{\`' ? '\`}' : quoteMark}\n`
        + documentation;
    return item;
};
// filters out any (group) parts of the path
const filterGroup = (link) => link.replace(/\/\(.+\)\//g, '/');
const isParamLink = (link) => /\[.+?\]/.test(link);
exports.isParamLink = isParamLink;
async function generateSuggestions(prefix, quoteMark, token) {
    const files = await vscode.workspace.findFiles(routesGlob, 'src/routes/index*', undefined, token);
    const globalItems = files
        .map((file) => {
        const foldername = file.path.match(/\/routes(\/.+\/)index/)?.[1];
        return createCompletionItem(filterGroup(foldername), prefix, quoteMark);
    });
    // TODO: add local links (without leading "/")
    return globalItems;
}
exports.generateSuggestions = generateSuggestions;
//# sourceMappingURL=generate-suggestions.js.map