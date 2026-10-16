import { VNode } from 'preact';
import { render } from 'preact-render-to-string/jsx';
import { createElement, isValidElement, ReactElement, ReactNode } from 'react';

// A copy of the tree (rendering marks its vnodes: never the live ones,
// which would break the app's own rendering).
const marker = '$';

const unwrap = (node: ReactNode): ReactNode => {
  if (Array.isArray(node)) return node.map((child: ReactNode) => unwrap(child));
  if (!isValidElement(node)) return node;

  const element = node as ReactElement<Record<string, unknown>>;
  const { children, ...props } = element.props;

  // (Elements in props, too, e.g. `render`.) Their names marked (see
  // `attributeHook`): rendering would rename some as HTML attributes
  // (e.g. `defaultValue` to `value`, `className` to `class`).
  const copied = Object.fromEntries(
    Object.entries(props).map(([key, value]) => [
      `${marker}${key}`,
      isValidElement(value) ? unwrap(value as ReactNode) : value,
    ]),
  );

  // (Created anew: a clone would keep the props, unmarked.)
  return children === undefined
    ? createElement(element.type, copied)
    : createElement(element.type, copied, unwrap(children as ReactNode));
};

const named = new WeakSet<object>();

// (Components' names start uppercase.)
const isComponentName = (text: string) =>
  text.charAt(0) !== text.charAt(0).toLowerCase();

const name = (component: unknown, displayName: string) => {
  if (typeof component !== 'function' || named.has(component)) return;
  named.add(component);
  (component as { displayName?: string }).displayName = displayName;
};

/**
 * Names the components of a module's exports for the code shown (e.g.
 * `Popover.Root`; anonymous `forwardRef`s would show as `ForwardRef`): its
 * components, and its namespaces' parts. The first name a component gets
 * stays (re-exported parts keep their first namespace's).
 */
export const nameComponents = (exports: Record<string, unknown>): void => {
  for (const [exportName, value] of Object.entries(exports)) {
    if (!isComponentName(exportName)) continue;
    if (typeof value === 'function') {
      name(value, exportName);
      continue;
    }
    if (typeof value !== 'object' || value === null) continue;
    for (const [part, component] of Object.entries(value)) {
      if (!isComponentName(part)) continue;
      name(component, `${exportName}.${part}`);
    }
  }
};

const indent = '  ';

const indented = (text: string, by: string) => text.split('\n').join(`\n${by}`);

// An SF Symbol's definition (see `Symbol`): shown as its name.
const isSymbol = (value: object): value is { iconName: string } =>
  'iconName' in value && 'svgPathData' in value;

// Props as written (their names unmarked, see `unwrap`): unset and false
// ones left out, handlers as arrows, symbols by name, elements as JSX,
// other values as JSON.
const attributeHook = (marked: string, value: unknown): false | string => {
  if (!marked.startsWith(marker)) return false;
  const attribute = marked.slice(marker.length);
  // Left out: unset or false (e.g. a demo's state, off), not written so.
  if (value === undefined || value === false) return '';
  if (value === null) return `\n${indent}${attribute}={${'null'}}`;
  if (value === true) return `\n${indent}${attribute}`;
  if (typeof value === 'string') return `\n${indent}${attribute}="${value}"`;
  if (typeof value === 'function') return `\n${indent}${attribute}={() => {…}}`;
  if (typeof value === 'object' && isSymbol(value)) {
    return `\n${indent}${attribute}={${value.iconName}}`;
  }
  if (isValidElement(value)) {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    const element = indented(renderCode(value), indent.repeat(2));
    return `\n${indent}${attribute}={\n${indent.repeat(2)}${element}\n${indent}}`;
  }

  // (Keys as in JS, unquoted where they can be.)
  const json = (
    JSON.stringify(value, undefined, 2) ?? String(value)
  ).replaceAll(/"(?<key>[$_a-z][\w$]*)":/giu, '$1:');
  return `\n${indent}${attribute}={${indented(json, indent)}}`;
};

/**
 * The JSX of a demo's stage, as written (components as tags, not
 * rendered; demo-only wrappers left out), or why it can't be shown.
 */
export const renderCode = (node: ReactNode): string => {
  try {
    return render((<>{unwrap(node)}</>) as unknown as VNode, {}, {
      attributeHook,
      jsx: true,
      pretty: indent,
      shallow: true,
      // (Empty elements as `<This />`.)
      xml: true,
    } as Parameters<typeof render>[2]);
  } catch (error) {
    return String(error);
  }
};

// Syntax highlighting: tags, attribute names, strings, expressions.
const tokens =
  /(?<tag><\/?[\w.-]+|\/?>)|(?<attribute>[\w-]+)(?==)|(?<string>"[^"]*")|(?<expression>\{[^\n]*?\})/gu;

/** The code, its tokens in spans (`data-token`: their kind). */
export const highlight = (code: string): ReactNode[] => {
  const parts: ReactNode[] = [];
  let last = 0;
  for (const match of code.matchAll(tokens)) {
    const kind = Object.entries(match.groups ?? {}).find(
      ([, value]) => value !== undefined,
    )?.[0];
    if (kind === undefined) continue;
    parts.push(
      code.slice(last, match.index),
      <span
        key={match.index}
        data-token={kind}
      >
        {match[0]}
      </span>,
    );
    last = match.index + match[0].length;
  }
  parts.push(code.slice(last));
  return parts;
};
