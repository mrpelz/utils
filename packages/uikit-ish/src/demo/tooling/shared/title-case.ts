import { createElement, Fragment, type ReactNode } from 'react';

// Titles (headings, navigation, the window's) in title case, Chicago style
// (The Chicago Manual of Style, 8.159–8.161): every word capitalized but
// articles, prepositions, the coordinating conjunctions and, but, for, or,
// nor, and "to" and "as"; the first and the last word always, and the
// first after a colon. Written in sentence case, a title's words keep the
// capitals they have (names, abbreviations, code): to capitalize a word
// that reads as a preposition but isn't (an adverb: "Set Up", "Swipe
// Over"), write it capitalized.

const ARTICLES = ['a', 'an', 'the'];
const CONJUNCTIONS = ['and', 'but', 'for', 'nor', 'or'];
const PREPOSITIONS = [
  'about',
  'above',
  'across',
  'after',
  'against',
  'along',
  'amid',
  'among',
  'around',
  'at',
  'before',
  'behind',
  'below',
  'beneath',
  'beside',
  'besides',
  'between',
  'beyond',
  'by',
  'despite',
  'down',
  'during',
  'except',
  'from',
  'in',
  'inside',
  'into',
  'like',
  'near',
  'of',
  'off',
  'on',
  'onto',
  'out',
  'outside',
  'over',
  'past',
  'per',
  'since',
  'through',
  'throughout',
  'till',
  'to',
  'toward',
  'towards',
  'under',
  'underneath',
  'unlike',
  'until',
  'up',
  'upon',
  'versus',
  'via',
  'vs.',
  'with',
  'within',
  'without',
];

/** Words lowercase within a title. */
const MINOR = new Set([...ARTICLES, ...CONJUNCTIONS, ...PREPOSITIONS, 'as']);

/** Prefixes that aren't words: the word after them stays lowercase. */
const PREFIXES = new Set([
  'anti',
  'co',
  'de',
  'multi',
  'non',
  'post',
  'pre',
  're',
  'semi',
  'sub',
  'un',
]);

/** A word without the punctuation around it (quotes, parentheses, …). */
const core = (word: string): string =>
  word.replaceAll(/^[^\p{L}\d]+|[^\p{L}\d]+$/gu, '');

const LETTER = /\p{L}/u;
const UPPERCASE = /\p{Lu}/u;
const STARTS_UPPERCASE = /^[^\p{L}]*\p{Lu}/u;
const STARTS_WITH_DIGIT = /^\d/u;
const ENDS_WITH_COLON = /:["”’)]*$/u;
const CODE = /[.<>=_`{}[\]]/u;
const ENTITY = /&\w+;/u;

/** Names written in lowercase. */
const NAMES = new Set(['uikit-ish']);

/**
 * Code, a name, an abbreviation, an ordinal (“1st”), an entity: left as
 * written.
 */
const isVerbatim = (word: string): boolean => {
  const letters = core(word);

  return (
    NAMES.has(letters) ||
    STARTS_WITH_DIGIT.test(letters) ||
    UPPERCASE.test(letters.slice(1)) ||
    CODE.test(letters) ||
    ENTITY.test(word) ||
    word.endsWith('()')
  );
};

/** Its first letter capitalized. */
const capitalize = (word: string): string =>
  word.replace(/\p{L}/u, (letter) => letter.toUpperCase());

/** The word to look up (lowercase, no punctuation). */
const bare = (word: string): string => core(word).toLowerCase();

/**
 * A hyphenated word: its first part capitalized, and its others but
 * articles, prepositions and conjunctions within (“Run-of-the-Mill”), and
 * the word after a prefix (“Re-slicing”). (Its last part, a preposition,
 * is an adverb: “Pop-Up”, “Built-In”.)
 */
const compound = (word: string): string => {
  const parts = word.split('-');
  const isPrefixed = PREFIXES.has(bare(parts[0] ?? ''));

  return parts
    .map((part, index) => {
      if (index === 0) return capitalize(part);
      if (index === 1 && isPrefixed) return part;
      return index < parts.length - 1 && MINOR.has(bare(part))
        ? part
        : capitalize(part);
    })
    .join('-');
};

/**
 * A title in title case: e.g. "When to use something else" → "When to Use
 * Something Else".
 */
export const titleCase = (title: string): string => {
  const tokens = title.split(/(?<gap>\s+|\/)/u);
  const words = tokens
    .map((token, index) => [token, index] as const)
    .filter(([token]) => LETTER.test(token));
  const first = words.at(0)?.[1];
  const last = words.at(-1)?.[1];
  let isAfterColon = false;

  return tokens
    .map((token, index) => {
      if (!LETTER.test(token)) return token;

      const isEdge = index === first || index === last || isAfterColon;
      isAfterColon = ENDS_WITH_COLON.test(token);

      if (isVerbatim(token)) return token;
      if (token.includes('-')) return compound(token);
      // (Capitalized as written: a name, or a word meant to be.)
      if (STARTS_UPPERCASE.test(token)) return token;

      return isEdge || !MINOR.has(bare(token)) ? capitalize(token) : token;
    })
    .join('');
};

const ELEMENT = '\0';

/**
 * A title's text in title case, its elements (code, links) kept as they
 * are: e.g. `["Using ", <code />, " in a list"]` → "Using <code /> in a
 * List".
 */
export const titleCaseNode = (node: ReactNode): ReactNode => {
  if (typeof node === 'string') return titleCase(node);
  if (!Array.isArray(node)) return node;

  const parts = node as ReactNode[];
  const texts = titleCase(
    parts.map((part) => (typeof part === 'string' ? part : ELEMENT)).join(''),
  ).split(ELEMENT);
  const elements = parts.filter((part) => typeof part !== 'string');

  return createElement(
    Fragment,
    null,
    ...texts.flatMap((text, index) =>
      index < elements.length ? [text, elements[index]] : text,
    ),
  );
};
