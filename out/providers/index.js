"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.providers = void 0;
const cache_1 = require("./cache");
const autocomplete_1 = require("./autocomplete");
exports.providers = [
    ...autocomplete_1.autocompleteProviders,
    ...cache_1.clearCacheProviders
];
//# sourceMappingURL=index.js.map