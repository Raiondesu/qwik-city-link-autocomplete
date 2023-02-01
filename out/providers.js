"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.providers = void 0;
const vscode = require("vscode");
const config = require("./configuration");
const cache_1 = require("./cache");
const generate_suggestions_1 = require("./generate-suggestions");
exports.providers = ['javascriptreact', 'typescriptreact']
    .map((language) => (vscode.languages.registerCompletionItemProvider({ language }, {
    provideCompletionItems(document, position, token) {
        const text = document.lineAt(position.line).text;
        const textContextMatch = text.match(attributeRegex());
        if (!textContextMatch) {
            return [];
        }
        const { prefix, insertRange } = extractInsertionData(position, text, textContextMatch);
        if (config.isCacheEnabled() && cache_1.cache[document.fileName]) {
            return cache_1.cache[document.fileName].map(applyRange(insertRange));
        }
        return (0, generate_suggestions_1.generateSuggestions)(prefix, token).then(results => {
            if (config.isCacheEnabled()) {
                cache_1.cache[document.fileName] = results;
            }
            return results.map(applyRange(insertRange));
        });
    },
}, '/', "'", '"')))
    .concat(cache_1.clearCacheProviders);
const attributeRegex = () => new RegExp(`(${config.attributes().join('|')})=(?<quotes>["'])(?<prefix>[^"']*)(?:["'])?`);
const applyRange = (range) => (item) => ({
    ...item,
    range
});
function extractInsertionData(position, text, match) {
    const [_, attribute, quoteMark, prefix] = match ?? [];
    const attrStartText = attribute + '=' + quoteMark;
    const indexOfAttr = text.indexOf(attrStartText) + attrStartText.length;
    const attrContent = {
        start: indexOfAttr,
        end: indexOfAttr + prefix.length
    };
    const insertRange = new vscode.Range(new vscode.Position(position.line, attrContent.start), new vscode.Position(position.line, attrContent.end));
    return { prefix, insertRange };
}
//# sourceMappingURL=providers.js.map