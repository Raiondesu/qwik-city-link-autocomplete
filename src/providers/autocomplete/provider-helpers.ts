import { Range, CompletionItem, Position } from 'vscode';
import { attributes } from '../../configuration';
import { isParamLink } from './generate-suggestions';

export const attributeRegex = () => new RegExp(
  `(${attributes().join('|')})=(?<quotes>"|'|\{\`)(?<prefix>[^"'\`]*)(?:["'\`])?`
);

export function extractInsertionData(position: Position, text: string, match: RegExpMatchArray) {
  const [_, attribute, quoteMark, prefix] = match ?? [];

  const attrStartText = attribute + '=' + quoteMark;
  const indexOfAttr = text.indexOf(attrStartText) + attrStartText.length;

  const attrContent = {
    start: indexOfAttr,
    end: indexOfAttr + prefix.length
  };

  const insertRange = new Range(
    new Position(position.line, attrContent.start),
    new Position(position.line, attrContent.end)
  );

  return { prefix, quoteMark, applyRange: applyRange(quoteMark, insertRange) };
}

const applyRange = (quoteMark: string, range: Range) => (item: CompletionItem): CompletionItem => {
  const newItem = { ...item, range };

  if (!isParamLink(newItem.label.toString())) {
    return newItem;
  }

  // adjust range to account for different quote marks
  if (quoteMark !== '{`') {
    newItem.additionalTextEdits = [{
      newText: '{`',
      range: new Range(
        range.start.translate(0, -1),
        range.start
      )
    }];
    newItem.insertText += '`}';

    newItem.range = new Range(
      range.start,
      range.end.translate(0, 1)
    );
  }

  return newItem;
};
