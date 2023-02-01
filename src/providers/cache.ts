import { CompletionItem, workspace } from 'vscode';
import { isCacheEnabled } from '../configuration';

// cache is stored on a per-file basis so that it's easier to add local suggestions later
export const cache: Record<string, CompletionItem[]> = {};

export const clearCacheProviders = isCacheEnabled() ? [
  workspace.onDidRenameFiles(clearCache),
  workspace.onDidDeleteFiles(clearCache),
  workspace.onDidCreateFiles(clearCache),
] : [];

function clearCache() {
  for (const file in cache) {
    delete cache[file];
  }
}
