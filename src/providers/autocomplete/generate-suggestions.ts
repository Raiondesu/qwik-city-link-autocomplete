import * as vscode from 'vscode';

const routesGlob = 'src/routes/**/index*';

const createCompletionItem = (
  foldername: string,
  prefix: string,
  quoteMark: string
): vscode.CompletionItem => {
  const documentation = 'Autocompleted based on `routes` folder contents'
  const item: vscode.CompletionItem = {
    label: foldername,
    detail: 'Regular link',
    documentation: `href="${foldername}"\n${documentation}`,
    sortText: foldername,
    preselect: foldername.includes(prefix),

    kind: vscode.CompletionItemKind.Folder,

    commitCharacters: ['"', "'"],
  };

  // If there are no [parameters] in the route
  if (!isParamLink(foldername)) {
    return item;
  }

  // Set insertText to template string if a route paramter is found
  item.insertText = item.label.toString().replace(/\[(?:\.\.\.)?(.+)\]/g, '\$\{$1\}');

  item.detail = 'Link with params';
  item.documentation = 'href='
    + quoteMark
    + item.insertText
    + `${quoteMark === '{\`' ? '\`}' : quoteMark}\n`
    + documentation;

  return item;
};

// filters out any (group) parts of the path
const filterGroup = (link: string) => link.replace(/\/\(.+\)\//g, '/');

export const isParamLink = (link: string) => /\[.+\]/.test(link);

export async function generateSuggestions(
  prefix: string,
  quoteMark: string,
  token: vscode.CancellationToken
) {
  const files = await vscode.workspace.findFiles(routesGlob, 'src/routes/index*', undefined, token);

  const globalItems = files
    .map((file): vscode.CompletionItem => {
      const foldername = file.path.match(/\/routes(\/.+\/)index/)?.[1]!;

      return createCompletionItem(
        filterGroup(foldername),
        prefix,
        quoteMark
      );
    });

  // TODO: add local links (without leading "/")
  return globalItems;
}