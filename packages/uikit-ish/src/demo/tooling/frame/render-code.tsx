import { VNode } from 'preact';
import { render } from 'preact-render-to-string/jsx';
import {
  createElement,
  createRef,
  Fragment,
  isValidElement,
  ReactElement,
  ReactNode,
  RefObject,
  useState,
} from 'react';

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

const indent = '  ';

// A handle's namespace (e.g. a drawer's, given to `Drawer.Root`): a shared
// part linked by it (e.g. a trigger outside its root) named by it.
let handleNamespaces = new WeakMap<object, string>();

// The namespaces of the handles given to parts named only once (e.g. a
// root), throughout `node` (its children, elements in its props).
const collectHandles = (node: ReactNode) => {
  if (Array.isArray(node)) {
    for (const child of node as ReactNode[]) collectHandles(child);
    return;
  }
  if (!isValidElement(node)) return;

  const element = node as ReactElement<Record<string, unknown>>;
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  const own = names.get(element.type as object);
  const { handle } = element.props;
  if (own?.length === 1 && typeof handle === 'object' && handle !== null) {
    handleNamespaces.set(handle, namespaceOf(own[0] ?? ''));
  }
  for (const value of Object.values(element.props)) {
    if (isValidElement(value) || Array.isArray(value)) {
      collectHandles(value as ReactNode);
    }
  }
};

// A render function's code (e.g. a root's children, a function of its
// payload): markers around its result as JSX (each on a line of its own),
// the start's with its parameters and whether it's a fragment, written as
// its code's ends (see `writeRenderFunctions`).
const renderFunctionStart = (parameters: string, isFragment: boolean) =>
  `\0start[${parameters}]${isFragment ? 'fragment' : ''}\0`;
const renderFunctionEnd = (isFragment: boolean) =>
  `\0end${isFragment ? 'fragment' : ''}\0`;
const markerPattern =
  /^(?<space> *)\0(?:start\[(?<parameters>[^\]]*)\]|end)(?<fragment>fragment)?\0$/u;

// The markers written as code (`{({ payload }) => (`, `)}`; a fragment's
// `<>`, `</>`), the lines between indented.
const writeRenderFunctions = (code: string) => {
  let depth = 0;

  return code
    .split('\n')
    .flatMap((line) => {
      const match = markerPattern.exec(line);
      if (!match?.groups) return `${indent.repeat(depth)}${line}`;

      const { fragment, parameters, space = '' } = match.groups;
      const isStart = parameters !== undefined;
      if (!isStart) depth -= fragment ? 2 : 1;
      const at = `${space}${indent.repeat(depth)}`;
      if (isStart) {
        depth += fragment ? 2 : 1;
        return fragment
          ? [`${at}{(${parameters}) => (`, `${at}${indent}<>`]
          : `${at}{(${parameters}) => (`;
      }
      return fragment ? [`${at}${indent}</>`, `${at})}`] : `${at})}`;
    })
    .join('\n');
};

// A stand-in value, named: as text, `{name}`; its fields, `{name?.field}`.
const standInValue = (name: string) =>
  new Proxy(
    {},
    {
      get: (_target, key) => {
        if (key === Symbol.toPrimitive || key === 'toString') {
          return () => `{${name}}`;
        }
        return typeof key === 'string' ? `{${name}?.${key}}` : undefined;
      },
    },
  );

// A function's parameters as written (its source's): `undefined` if its
// first destructures an object (e.g. `{ payload }`), else their names.
const parameterList = /^[^(=]*\((?<list>[^)]*)\)/u;
const singleParameter = /^\s*(?<single>[\w$]+)\s*=>/u;

const positionalParameters = (renderFunction: unknown) => {
  const source = Function.prototype.toString.call(renderFunction);
  const listed =
    parameterList.exec(source)?.groups?.list ??
    singleParameter.exec(source)?.groups?.single ??
    '';
  return listed.trimStart().startsWith('{')
    ? undefined
    : listed
        .split(',')
        .map((parameter) => parameter.split('=')[0]?.trim() ?? '')
        .filter(Boolean);
};

/**
 * A render function's result, called with stand-ins, and its parameters:
 * positional ones (e.g. a value's `formattedValue, value`) as named
 * stand-ins; an object's (e.g. `{ payload }`), its fields read, each a
 * stand-in (`payload?.title` read as `{payload?.title}`, text in the code).
 */
const callRenderFunction = (
  renderFunction: (...parameters: unknown[]) => ReactNode,
) => {
  const positional = positionalParameters(renderFunction);
  if (positional) {
    return {
      parameters: positional.join(', '),
      result: renderFunction(...positional.map((name) => standInValue(name))),
    };
  }

  const fields: string[] = [];
  const argument = new Proxy(
    {},
    {
      get: (_target, field) => {
        if (typeof field !== 'string') return undefined;
        if (!fields.includes(field)) fields.push(field);
        return standInValue(field);
      },
    },
  );
  const result = renderFunction(argument);
  const parameters = fields.length > 0 ? `{ ${fields.join(', ')} }` : '';

  return { parameters, result };
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
  // (Linked by a handle: its root's.)
  const { handle } = props;
  const handleNamespace =
    typeof handle === 'object' && handle !== null
      ? handleNamespaces.get(handle)
      : undefined;
  const namespace =
    own.length > 1
      ? ((handleNamespace && namespaces.includes(handleNamespace)
          ? handleNamespace
          : undefined) ??
        descendantNamespace(element, namespaces) ??
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
  if (children === undefined) return createElement(type, copied);
  return createElement(
    type,
    copied,
    typeof children === 'function'
      ? // eslint-disable-next-line @typescript-eslint/no-use-before-define
        unwrapRenderFunction(
          children as (...parameters: unknown[]) => ReactNode,
          inner,
        )
      : unwrap(children as ReactNode, inner),
  );
};

// A render function (e.g. a root's children): its result, between its
// code's ends (see `writeRenderFunctions`).
const unwrapRenderFunction = (
  renderFunction: (...parameters: unknown[]) => ReactNode,
  context: readonly string[],
): ReactNode[] => {
  const { parameters, result } = callRenderFunction(renderFunction);
  // Text (e.g. a value's): as a template literal, on its line (its
  // stand-ins' expressions interpolated).
  if (typeof result === 'string' || typeof result === 'number') {
    const template = String(result).replaceAll(
      /\{(?<expression>[^{}]+)\}/gu,
      (_match, expression: string) => `\${${expression}}`,
    );
    return [`{(${parameters}) => \`${template}\`}`];
  }

  const isFragment =
    Array.isArray(result) ||
    (isValidElement(result) && (result as ReactElement).type === Fragment);

  return [
    renderFunctionStart(parameters, isFragment),
    unwrap(result, context),
    renderFunctionEnd(isFragment),
  ];
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

const indented = (text: string, by: string) => text.split('\n').join(`\n${by}`);

// Objects shown by a label (e.g. their variable's name: a ref, a handle),
// not their contents, and the code defining it (see `codeLabel`).
const codeLabels = new WeakMap<
  object,
  { definition: string | undefined; label: string }
>();

// The definitions of the labelled objects the code shown uses (see
// `renderCode`), by their labels.
let usedDefinitions = new Map<string, string>();

/**
 * `value`, labelled in the code shown (e.g. `codeLabel(handle, 'handle')`:
 * written `handle={handle}`); returns it, so it can be labelled as it's
 * made or passed. With its `definition` (e.g. `const handle =
 * Sheet.createHandle();`), the code shown defines it where it's used
 * (unless its demo's setup does).
 */
export const codeLabel = <T extends object>(
  value: T,
  label: string,
  definition?: string,
): T => {
  codeLabels.set(value, { definition, label });
  return value;
};

/**
 * A ref, made once, labelled (see `codeLabel`): e.g. its variable's name,
 * defined as a `useRef` of its element's `type` (e.g. `HTMLDivElement`).
 */
export const useLabelledRef = <T,>(
  label: string,
  type: string,
): RefObject<T | null> => {
  const [ref] = useState(() =>
    codeLabel(createRef<T>(), label, `const ${label} = useRef<${type}>(null);`),
  );

  return ref;
};

// A ref (`{ current }`), unlabelled: shown as one.
const isRef = (value: object) =>
  Object.getPrototypeOf(value) === Object.prototype &&
  Object.keys(value).length === 1 &&
  'current' in value;

// An instance of a class (not plain data), unlabelled: shown by its class.
const className = (value: object) => {
  const prototype: unknown = Object.getPrototypeOf(value);
  if (prototype === Object.prototype || prototype === Array.prototype) {
    return undefined;
  }
  return prototype === null
    ? undefined
    : (value.constructor as { name?: string } | undefined)?.name;
};

// An icon's definition (see `Symbol`): shown as its name.
const isSymbol = (value: object): value is { iconName: string } =>
  'iconName' in value && 'svgPathData' in value;

// An object's label (see `codeLabel`; its definition used), a ref's or a
// class instance's; an array of labelled objects as theirs (e.g. handles).
const labelOf = (value: object): string | undefined => {
  if (Array.isArray(value) && value.length > 0) {
    const labels = value.map((item: unknown) =>
      typeof item === 'object' && item !== null && codeLabels.has(item)
        ? labelOf(item)
        : undefined,
    );
    return labels.includes(undefined) ? undefined : `[${labels.join(', ')}]`;
  }
  const labelled = codeLabels.get(value);
  if (labelled?.definition) {
    usedDefinitions.set(labelled.label, labelled.definition);
  }

  return (
    labelled?.label ?? (isRef(value) ? 'ref' : undefined) ?? className(value)
  );
};

// Props as written (their names unmarked, see `unwrap`): unset and false
// ones left out, handlers as arrows, symbols by name, labelled objects (and
// refs, class instances) by their labels, elements as JSX, other values as
// JSON.
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
  if (typeof value === 'object') {
    const label = labelOf(value);
    if (label !== undefined) return `\n${indent}${attribute}={${label}}`;
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
export const renderCode = (
  node: ReactNode,
): { code: string; definitions: ReadonlyMap<string, string> } => {
  handleNamespaces = new WeakMap();
  usedDefinitions = new Map();
  collectHandles(node);
  const code = writeRenderFunctions(renderCopy(unwrap(node)));

  return { code, definitions: usedDefinitions };
};
