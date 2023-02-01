"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.attributes = exports.isCacheEnabled = void 0;
const vscode_1 = require("vscode");
const isCacheEnabled = () => vscode_1.workspace.getConfiguration().get('qwik-city-link-autocomplete.cacheEnabled', true);
exports.isCacheEnabled = isCacheEnabled;
const attributes = () => vscode_1.workspace.getConfiguration().get('qwik-city-link-autocomplete.attributes', ['href']);
exports.attributes = attributes;
//# sourceMappingURL=configuration.js.map