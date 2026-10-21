import { VNode } from 'preact';
import { render } from 'preact-render-to-string/jsx';
import { createElement, isValidElement, ReactElement, ReactNode } from 'react';

// A copy of the tree (rendering marks its vnodes: never the live ones,
// which would break the app's own rendering).
const marker = '$';

// A part shared by namespaces (e.g. Base UI's `Dialog.Trigger`, both
// `Sheet.Trigger` and `ActionSheet.Trigger`): named by its context, a
// descendant's namespace among its names (e.g. a root's, by its popup), or
// else the nearest of its ancestors' (e.g. a close button's); a stand-in,
// named so, renders in its place.
type StandIn = () => null;

const standIns = new Map<string, StandIn>();

const standIn = (displayName: string) => {
  let component = standIns.get(displayName);
  if (!component) {
    component = () => null;
    (component as { displayName?: string }).displayName = displayName;
    standIns.set(displayName, component);
  }
  return component;
};

const namespaceOf = (displayName: string): string =>
  displayName.split('.')[0] ?? displayName;

// The namespace of the first part below `node` named only in one of
// `namespaces` (in its children, or elements in its props).
const descendantNamespace = (
  node: ReactNode,
  namespaces: readonly string[],
): string | undefined => {
  if (Array.isArray(node)) {
    for (const child of node as ReactNode[]) {
      const found = descendantNamespace(child, namespaces);
      if (found) return found;
    }
    return undefined;
  }
  if (!isValidElement(node)) return undefined;

  const element = node as ReactElement<Record<string, unknown>>;
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  const own = names.get(element.type as object);
  const namespace = own?.length === 1 ? namespaceOf(own[0] ?? '') : undefined;
  if (namespace && namespaces.includes(namespace)) return namespace;

  for (const value of Object.values(element.props)) {
    if (!isValidElement(value) && !Array.isArray(value)) continue;
    const found = descendantNamespace(value as ReactNode, namespaces);
    if (found) return found;
  }
  return undefined;
};

const unwrap = (
  node: ReactNode,
  context: readonly string[] = [],
): ReactNode => {
  if (Array.isArray(node)) {
    return node.map((child: ReactNode) => unwrap(child, context));
  }
  if (!isValidElement(node)) return node;

  const element = node as ReactElement<Record<string, unknown>>;
  const { children, ...props } = element.props;
  // (Preact's compat copies an element's `className` to `class`: written once.)
  if ('className' in props) delete props.class;

  // Its name: its only one, or the one of its context.
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  const own = names.get(element.type as object) ?? [];
  const namespaces = own.map((displayName) => namespaceOf(displayName));
  const namespace =
    own.length > 1
      ? (descendantNamespace(element, namespaces) ??
        context.findLast((ancestor) => namespaces.includes(ancestor)))
      : namespaces[0];
  const resolved = own.find(
    (displayName) => namespaceOf(displayName) === namespace,
  );
  const type =
    own.length > 1 && resolved && resolved !== own[0]
      ? standIn(resolved)
      : element.type;
  const inner = namespace ? [...context, namespace] : context;

  // (Elements in props, too, e.g. `render`.) Their names marked (see
  // `attributeHook`): rendering would rename some as HTML attributes
  // (e.g. `defaultValue` to `value`, `className` to `class`).
  const copied = Object.fromEntries(
    Object.entries(props).map(([key, value]) => [
      `${marker}${key}`,
      isValidElement(value) ? unwrap(value as ReactNode, inner) : value,
    ]),
  );

  // (Created anew: a clone would keep the props, unmarked.)
  return children === undefined
    ? createElement(type, copied)
    : createElement(type, copied, unwrap(children as ReactNode, inner));
};

// Every name of a component (shared parts: several), the first its
// display name.
const names = new WeakMap<object, string[]>();

// (Components' names start uppercase.)
const isComponentName = (text: string) =>
  text.charAt(0) !== text.charAt(0).toLowerCase();

const name = (component: unknown, displayName: string) => {
  if (typeof component !== 'function') return;
  const own = names.get(component);
  if (own) {
    if (!own.includes(displayName)) own.push(displayName);
    return;
  }
  names.set(component, [displayName]);
  (component as { displayName?: string }).displayName = displayName;
};

/**
 * Names the components of a module's exports for the code shown (e.g.
 * `Popover.Root`; anonymous `forwardRef`s would show as `ForwardRef`): its
 * components, and its namespaces' parts. The first name a component gets
 * is its display name; a part shared by namespaces is named by its context
 * in the code (see `unwrap`).
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
    // (A copy already, see `unwrap`: its props marked once.)
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    const element = indented(renderCopy(value), indent.repeat(2));
    return `\n${indent}${attribute}={\n${indent.repeat(2)}${element}\n${indent}}`;
  }

  // (Keys as in JS, unquoted where they can be.)
  const json = (
    JSON.stringify(value, undefined, 2) ?? String(value)
  ).replaceAll(/"(?<key>[$_a-z][\w$]*)":/giu, '$1:');
  return `\n${indent}${attribute}={${indented(json, indent)}}`;
};

// A tree's copy (see `unwrap`), rendered as JSX.
const renderCopy = (node: ReactNode): string => {
  try {
    return render((<>{node}</>) as unknown as VNode, {}, {
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

/**
 * The JSX of a demo's stage, as written (components as tags, not
 * rendered; demo-only wrappers left out), or why it can't be shown.
 */
export const renderCode = (node: ReactNode): string => renderCopy(unwrap(node));
