"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.autocompleteProviders = void 0;
const vscode = require("vscode");
const configuration_1 = require("../../configuration");
const cache_1 = require("../cache");
const generate_suggestions_1 = require("./generate-suggestions");
const provider_helpers_1 = require("./provider-helpers");
exports.autocompleteProviders = ['javascriptreact', 'typescriptreact']
    .map((language) => (vscode.languages.registerCompletionItemProvider({ language }, {
    provideCompletionItems(document, position, token) {
        const text = document.lineAt(position.line).text;
        const textContextMatch = text.match((0, provider_helpers_1.attributeRegex)());
        if (!textContextMatch) {
            return [];
        }
        const { prefix, quoteMark, applyRange } = (0, provider_helpers_1.extractInsertionData)(position, text, textContextMatch);
        if ((0, configuration_1.isCacheEnabled)() && cache_1.cache[document.fileName]) {
            return cache_1.cache[document.fileName].map(applyRange);
        }
        return (0, generate_suggestions_1.generateSuggestions)(prefix, quoteMark, token).then(results => {
            if ((0, configuration_1.isCacheEnabled)() && results.length > 0) {
                cache_1.cache[document.fileName] = results;
            }
            return results.map(applyRange);
        });
    },
}, '/', "'", '"')));
//# sourceMappingURL=index.js.map