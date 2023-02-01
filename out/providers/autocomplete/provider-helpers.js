"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractInsertionData = exports.attributeRegex = void 0;
const vscode_1 = require("vscode");
const configuration_1 = require("../../configuration");
const generate_suggestions_1 = require("./generate-suggestions");
const attributeRegex = () => new RegExp(`(${(0, configuration_1.attributes)().join('|')})=(?<quotes>"|'|\{\`)(?<prefix>[^"'\`]*)(?:["'\`])?`);
exports.attributeRegex = attributeRegex;
function extractInsertionData(position, text, match) {
    const [_, attribute, quoteMark, prefix] = match ?? [];
    const attrStartText = attribute + '=' + quoteMark;
    const indexOfAttr = text.indexOf(attrStartText) + attrStartText.length;
    const attrContent = {
        start: indexOfAttr,
        end: indexOfAttr + prefix.length
    };
    const insertRange = new vscode_1.Range(new vscode_1.Position(position.line, attrContent.start), new vscode_1.Position(position.line, attrContent.end));
    return { prefix, quoteMark, applyRange: applyRange(quoteMark, insertRange) };
}
exports.extractInsertionData = extractInsertionData;
const applyRange = (quoteMark, range) => (item) => {
    const newItem = { ...item, range };
    if (!(0, generate_suggestions_1.isParamLink)(newItem.label.toString())) {
        return newItem;
    }
    // adjust range to account for different quote marks
    if (quoteMark !== '{`') {
        newItem.additionalTextEdits = [{
                newText: '{`',
                range: new vscode_1.Range(range.start.translate(0, -1), range.start)
            }];
        newItem.insertText += '`}';
        newItem.range = new vscode_1.Range(range.start, range.end.translate(0, 1));
    }
    return newItem;
};
//# sourceMappingURL=provider-helpers.js.map