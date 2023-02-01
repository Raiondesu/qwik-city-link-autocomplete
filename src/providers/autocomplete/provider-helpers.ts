import { Range, CompletionItem, Position } from 'vscode';
import { attributes } from '../../configuration';

export const attributeRegex = () => new RegExp(`(${attributes().join('|')})=(?<quotes>["'])(?<prefix>[^"']*)(?:["'])?`);

export const applyRange = (range?: Range) => (item: CompletionItem) => ({
  ...item,
  range
});

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

  return { prefix, insertRange };
}
