"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.watcher = void 0;
const vscode = require("vscode");
const providers_1 = require("./providers");
exports.watcher = vscode.workspace.createFileSystemWatcher((0, providers_1.routesGlob)());
//# sourceMappingURL=file-watcher.js.map