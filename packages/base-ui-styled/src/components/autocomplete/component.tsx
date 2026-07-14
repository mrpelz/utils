import { CommonAutocomplete } from './common.js';
import { asyncSearch } from './variants/async-search.js';
import { autoHighlight } from './variants/auto-highlight.js';
import { commandPalette } from './variants/command-palette.js';
import { fuzzyMatching } from './variants/fuzzy-matching.js';
import { gridLayout } from './variants/grid-layout.js';
import { grouped } from './variants/grouped.js';
import { inlineAutocomplete } from './variants/inline-autocomplete.js';
import { limitResults } from './variants/limit-results.js';
import { main } from './variants/main.js';
import { virtualized } from './variants/virtualized.js';

export const variants = {
  main,
  asyncSearch,
  inlineAutocomplete,
  grouped,
  fuzzyMatching,
  limitResults,
  autoHighlight,
  commandPalette,
  gridLayout,
  virtualized,
};

export const Autocomplete = {
  ...CommonAutocomplete,
  variants,
};

export { CommonAutocomplete, itemBaseStyles } from './common.js';
