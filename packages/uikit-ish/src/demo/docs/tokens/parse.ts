/** A token's value under a condition (e.g. a media query, a forced color scheme). */
export type TokenVariant = { condition: string; value: string };

/** A custom property set on the root: its value as written, its variants. */
export type Token = {
  name: string;
  value: string;
  variants: TokenVariant[];
};

/** Tokens documented by one comment (its first paragraph the title). */
export type TokenGroup = {
  description: string;
  title: string;
  tokens: Token[];
};

// The blocks that don't make a condition: the library's layer, the root.
const plainPreludes = new Set([':root', '@layer uikit-ish']);

/** A comment's text, without its delimiters and leading asterisks. */
const commentText = (comment: string) =>
  comment
    .replace(/^\/\*+/u, '')
    .replace(/\*+\/$/u, '')
    .split('\n')
    .map((line) => line.replace(/^\s*\* ?/u, '').trimEnd())
    .join('\n')
    .trim();

const collapse = (text: string) => text.replaceAll(/\s+/gu, ' ').trim();

/**
 * The root's custom properties in a stylesheet (the library's, see
 * styles.css), in their order, grouped by the comments before them (a
 * comment starting a group, until the next one); each with its variants:
 * the same property set again under a condition (an `@media` within or
 * around the root, or another selector, e.g. `[data-color-scheme='dark']`).
 */
export const parseTokens = (css: string): TokenGroup[] => {
  const groups: TokenGroup[] = [];
  const byName = new Map<string, Token>();
  const variants: [name: string, variant: TokenVariant][] = [];
  const stack: string[] = [];
  let pending = '';
  let comment: string | undefined;
  let depth = 0;

  const declare = (text: string) => {
    const declaration = collapse(text);
    const colon = declaration.indexOf(':');
    // (Not a custom property, e.g. `color-scheme`: nor its comment.)
    if (!declaration.startsWith('--') || colon === -1) {
      comment = undefined;
      return;
    }
    const name = declaration.slice(0, colon).trim();
    const value = declaration.slice(colon + 1).trim();
    const condition = stack
      .filter((prelude) => !plainPreludes.has(prelude))
      .join(' ');

    if (condition !== '') {
      variants.push([name, { condition, value }]);
      return;
    }
    if (!stack.includes(':root')) return;

    const token: Token = { name, value, variants: [] };
    byName.set(name, token);
    if (comment !== undefined || groups.length === 0) {
      // (Its title: its first paragraph.)
      const [title = '', ...rest] = (comment ?? '').split(/\n\s*\n/u);
      groups.push({
        description: rest.join('\n\n').trim(),
        title: collapse(title),
        tokens: [],
      });
      comment = undefined;
    }
    groups.at(-1)?.tokens.push(token);
  };

  for (let index = 0; index < css.length; index += 1) {
    const character = css[index];

    if (character === '/' && css[index + 1] === '*') {
      const end = css.indexOf('*/', index + 2);
      const stop = end === -1 ? css.length : end + 2;
      comment = commentText(css.slice(index, stop));
      index = stop - 1;
      continue;
    }

    if (character === '(') depth += 1;
    if (character === ')') depth -= 1;

    if (character === '{' && depth === 0) {
      stack.push(collapse(pending));
      pending = '';
      comment = undefined;
    } else if (character === '}' && depth === 0) {
      declare(pending);
      pending = '';
      stack.pop();
      comment = undefined;
    } else if (character === ';' && depth === 0) {
      declare(pending);
      pending = '';
    } else {
      pending += character;
    }
  }

  for (const [name, variant] of variants) {
    byName.get(name)?.variants.push(variant);
  }

  return groups;
};
