"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const providers_1 = require("./providers");
function activate(context) {
    context.subscriptions.push(...providers_1.providers);
}
exports.activate = activate;
function deactivate() {
    providers_1.providers.forEach(p => p.dispose());
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map