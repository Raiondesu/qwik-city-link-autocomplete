import * as vscode from 'vscode';
import { isCacheEnabled } from '../../configuration';
import { cache } from '../cache';
import { generateSuggestions } from './generate-suggestions';
import { attributeRegex, extractInsertionData, applyRange } from './provider-helpers';

export const autocompleteProviders = ['javascriptreact', 'typescriptreact']
  .map((language: string) => (
    vscode.languages.registerCompletionItemProvider({ language }, {
      provideCompletionItems(document, position, token) {
        const text = document.lineAt(position.line).text;

        const textContextMatch = text.match(attributeRegex());

        if (!textContextMatch) {
          return [];
        }

        const { prefix, insertRange } = extractInsertionData(position, text, textContextMatch);

        if (isCacheEnabled() && cache[document.fileName]) {
          return cache[document.fileName].map(applyRange(insertRange));
        }

        return generateSuggestions(prefix, token).then(results => {
          if (isCacheEnabled() && results.length > 0) {
            cache[document.fileName] = results;
          }

          return results.map(applyRange(insertRange));
        });
      },
    }, '/', "'", '"')
  ));

