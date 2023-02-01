import { workspace } from 'vscode';

export const isCacheEnabled = () => workspace.getConfiguration().get('qwik-city-link-autocomplete.cacheEnabled', true);

export const attributes = () => workspace.getConfiguration().get('qwik-city-link-autocomplete.attributes', ['href']);
