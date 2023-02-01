import * as vscode from 'vscode';
import * as config from './configuration';
import { cache, clearCacheProviders } from './cache';
import { generateSuggestions } from './generate-suggestions';

export const providers = ['javascriptreact', 'typescriptreact']
  .map((language: string) => (
    vscode.languages.registerCompletionItemProvider({ language }, {
      provideCompletionItems(document, position, token) {
        const text = document.lineAt(position.line).text;

        const textContextMatch = text.match(attributeRegex());

        if (!textContextMatch) {
          return [];
        }

        const { prefix, insertRange } = extractInsertionData(position, text, textContextMatch);

        if (config.isCacheEnabled() && cache[document.fileName]) {
          return cache[document.fileName].map(applyRange(insertRange));
        }

        return generateSuggestions(prefix, token).then(results => {
          if (config.isCacheEnabled()) {
            cache[document.fileName] = results;
          }

          return results.map(applyRange(insertRange));
        });
      },
    }, '/', "'", '"')
  ))
  .concat(clearCacheProviders);

const attributeRegex = () => new RegExp(`(${config.attributes().join('|')})=(?<quotes>["'])(?<prefix>[^"']*)(?:["'])?`);

const applyRange = (range?: vscode.Range) => (item: vscode.CompletionItem) => ({
  ...item,
  range
});

function extractInsertionData(position: vscode.Position, text: string, match: RegExpMatchArray) {
  const [_, attribute, quoteMark, prefix] = match ?? [];

  const attrStartText = attribute + '=' + quoteMark;
  const indexOfAttr = text.indexOf(attrStartText) + attrStartText.length;

  const attrContent = {
    start: indexOfAttr,
    end: indexOfAttr + prefix.length
  };

  const insertRange = new vscode.Range(
    new vscode.Position(position.line, attrContent.start),
    new vscode.Position(position.line, attrContent.end)
  );

  return { prefix, insertRange };
}
