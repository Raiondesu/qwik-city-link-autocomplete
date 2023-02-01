"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractInsertionData = exports.applyRange = exports.attributeRegex = void 0;
const vscode_1 = require("vscode");
const configuration_1 = require("../../configuration");
const attributeRegex = () => new RegExp(`(${(0, configuration_1.attributes)().join('|')})=(?<quotes>["'])(?<prefix>[^"']*)(?:["'])?`);
exports.attributeRegex = attributeRegex;
const applyRange = (range) => (item) => ({
    ...item,
    range
});
exports.applyRange = applyRange;
function extractInsertionData(position, text, match) {
    const [_, attribute, quoteMark, prefix] = match ?? [];
    const attrStartText = attribute + '=' + quoteMark;
    const indexOfAttr = text.indexOf(attrStartText) + attrStartText.length;
    const attrContent = {
        start: indexOfAttr,
        end: indexOfAttr + prefix.length
    };
    const insertRange = new vscode_1.Range(new vscode_1.Position(position.line, attrContent.start), new vscode_1.Position(position.line, attrContent.end));
    return { prefix, insertRange };
}
exports.extractInsertionData = extractInsertionData;
//# sourceMappingURL=provider-helpers.js.map