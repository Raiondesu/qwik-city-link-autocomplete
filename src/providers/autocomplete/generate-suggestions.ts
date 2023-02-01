import * as vscode from 'vscode';

const routesGlob = 'src/routes/**/index*';

const createCompletionItem = (
  foldername: string,
  prefix: string
): vscode.CompletionItem => ({
  label: foldername,
  detail: 'Route Path',
  documentation: 'Autocompleted based on `routes` folder contents',

  preselect: foldername.includes(prefix),

  kind: vscode.CompletionItemKind.Folder,

  commitCharacters: ['"', "'"],
});

export async function generateSuggestions(
  prefix: string,
  token: vscode.CancellationToken
) {
  const files = await vscode.workspace.findFiles(routesGlob, 'src/routes/index*', undefined, token);

  const globalItems = files
    .map((file): vscode.CompletionItem => {
      const foldername = file.path.match(/\/routes(\/.+\/)index/)?.[1]!;

      return createCompletionItem(foldername, prefix);
    });

  // TODO: add local links (without leading "/")
  return [
    createCompletionItem('/', prefix),
    ...globalItems
  ];
}