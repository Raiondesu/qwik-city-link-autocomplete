"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearCacheProviders = exports.cache = void 0;
const vscode_1 = require("vscode");
const configuration_1 = require("./configuration");
// cache is stored on a per-file basis so that it's easier to add local suggestions later
exports.cache = {};
exports.clearCacheProviders = (0, configuration_1.isCacheEnabled)() ? [
    vscode_1.workspace.onDidRenameFiles(clearCache),
    vscode_1.workspace.onDidDeleteFiles(clearCache),
    vscode_1.workspace.onDidCreateFiles(clearCache),
] : [];
function clearCache() {
    for (const file in exports.cache) {
        delete exports.cache[file];
    }
}
//# sourceMappingURL=cache.js.map