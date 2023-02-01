import { clearCacheProviders } from './cache';
import { autocompleteProviders } from './autocomplete';

export const providers = [
  ...autocompleteProviders,
  ...clearCacheProviders
];
