import './style.css';

import {
  FunctionComponent,
  KeyboardEvent,
  ReactNode,
  UIEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import {
  List,
  Symbol,
  type SymbolIcon,
  TextField,
} from '../../../components/index.js';
import {
  iconPackage,
  type LoadedIcon,
  loadIcon,
  loadIconCategories,
  loadIconNames,
  sfMagnifyingglass,
} from '../../tooling/icons.js';

// Every SF Symbol of `@bradleyhodges/sfsymbols` (not this library's, see
// tooling/icons.ts), in a grid (no stage): on request, their names read off
// the package's index and their categories loaded, searchable by both; only
// the rows in view rendered, each cell's icon loaded once shown. A symbol
// clicked, its import is copied. Also its brand icons (FontAwesome's: their
// paths explicitly filled), at their own units. Its look: the guide's
// (plain controls), or an app's (`app`: sections of a list, its search a
// row, e.g. the kitchen sink's; see style.css).

/** Its look: the guide's, or an app's (the library's controls). */
type Look = 'app' | 'docs';

// A cell's size (px), and the rows rendered beyond the view (each way).
const cellSize = 96;
const overscan = 2;

/** A brand icon's units: FontAwesome's, 512 to an em. */
const withUnits = (icon: LoadedIcon): SymbolIcon =>
  icon.svgPathData.some((path) => 'fill' in path)
    ? { ...icon, unitsPerEm: 512 }
    : icon;

/** The import of a symbol, as copied. */
const importOf = (name: string) =>
  `import { ${name} } from '${iconPackage}/${name}';`;

/** A symbol's cell: its icon once loaded (until then, its space empty). */
const Cell: FunctionComponent<{
  name: string;
  onCopy: (name?: string) => void;
}> = ({ name, onCopy }) => {
  const [icon, setIcon] = useState<SymbolIcon>();

  useEffect(() => {
    let isCurrent = true;
    loadIcon(name)
      .then((loaded) => {
        if (isCurrent) setIcon(withUnits(loaded));
      })
      .catch(() => undefined);
    return () => {
      isCurrent = false;
    };
  }, [name]);

  return (
    <button
      className="symbol-catalog-cell"
      title={importOf(name)}
      type="button"
      onClick={() =>
        navigator.clipboard
          .writeText(importOf(name))
          .then(() => onCopy(name))
          .catch(() => onCopy())
      }
    >
      {icon ? <Symbol icon={icon} /> : <span />}
      <span className="symbol-catalog-name">{icon?.sourceName}</span>
    </button>
  );
};

/** What a symbol is found by: its name and its categories' names. */
const searchTexts = (
  names: readonly string[],
  categories: ReadonlyMap<string, readonly string[]>,
) => {
  const named = new Map<string, string[]>();
  for (const [category, members] of categories) {
    for (const member of members) {
      named.set(member, [...(named.get(member) ?? []), category]);
    }
  }
  return names.map((name) =>
    [name.slice(2), ...(named.get(name) ?? [])].join(' ').toLowerCase(),
  );
};

/**
 * An app's look (in a `List.Root`): a section titled, its row (the search,
 * or the button loading it), its footer (the status); the grid below, in a
 * strong block (see style.css).
 */
const AppSections: FunctionComponent<{
  children?: ReactNode;
  footer?: string;
  row: ReactNode;
}> = ({ children, footer, row }) => (
  <>
    <List.Section>
      <List.Header>
        <List.Title>SF Symbols</List.Title>
      </List.Header>
      <List.Group>{row}</List.Group>
      {footer === undefined ? null : (
        <List.Footer aria-live="polite">{footer}</List.Footer>
      )}
    </List.Section>
    {children === undefined ? null : (
      <List.Section>
        <List.Block strong>
          <div
            className="symbol-catalog"
            data-look="app"
          >
            {children}
          </div>
        </List.Block>
      </List.Section>
    )}
  </>
);

/** The symbols, once listed: searched, virtualized. */
const Grid: FunctionComponent<{
  categories: ReadonlyMap<string, readonly string[]>;
  look: Look;
  names: readonly string[];
}> = ({ categories, look, names }) => {
  const [query, setQuery] = useState('');
  const [copied, setCopied] = useState<string>();
  const [scrollTop, setScrollTop] = useState(0);
  const [size, setSize] = useState({ height: 0, width: 0 });
  const box = useRef<HTMLDivElement>(null);
  const texts = useMemo(
    () => searchTexts(names, categories),
    [categories, names],
  );

  const found = useMemo(() => {
    const terms = query.toLowerCase().split(/\s+/u).filter(Boolean);
    return names.filter((_, index) =>
      terms.every((term) => texts[index]?.includes(term)),
    );
  }, [names, query, texts]);

  useEffect(() => {
    const { current: element } = box;
    if (!element) return undefined;
    const observer = new ResizeObserver(() =>
      setSize({ height: element.clientHeight, width: element.clientWidth }),
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const columns = Math.max(1, Math.floor(size.width / cellSize));
  const rows = Math.ceil(found.length / columns);
  const first = Math.max(0, Math.floor(scrollTop / cellSize) - overscan);
  const last = Math.min(
    rows,
    Math.ceil((scrollTop + size.height) / cellSize) + overscan,
  );
  const shown = found.slice(first * columns, last * columns);
  // (Its keyboard's return key a search's; pressed, done: the keyboard
  // dismissed, the results shown.)
  const search = {
    'aria-label': 'Search symbols',
    enterKeyHint: 'search',
    onKeyDown: (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Enter') event.currentTarget.blur();
    },
    onInput: ({ currentTarget }: { currentTarget: HTMLInputElement }) => {
      setQuery(currentTarget.value);
      setScrollTop(0);
      box.current?.scrollTo({ top: 0 });
    },
    placeholder: `Search ${String(names.length)} symbols`,
    type: 'search',
    value: query,
  } as const;

  const status = copied ? `Copied: ${copied}` : `${String(found.length)} found`;
  const grid = (
    <div
      ref={box}
      className="symbol-catalog-box"
      onScroll={({ currentTarget }: UIEvent<HTMLDivElement>) =>
        setScrollTop(currentTarget.scrollTop)
      }
    >
      <div
        className="symbol-catalog-area"
        style={{ height: `${String(rows * cellSize)}px` }}
      >
        <div
          className="symbol-catalog-grid"
          style={{
            gridTemplateColumns: `repeat(${String(columns)}, ${String(cellSize)}px)`,
            top: `${String(first * cellSize)}px`,
          }}
        >
          {shown.map((name) => (
            <Cell
              key={name}
              name={name}
              onCopy={setCopied}
            />
          ))}
        </div>
      </div>
    </div>
  );

  // An app's: sections of its list (see `AppSections`), its search a row.
  if (look === 'app') {
    return (
      <AppSections
        footer={status}
        row={
          <TextField.Root render={<List.Item />}>
            <List.Leading>
              <List.Image>
                <Symbol icon={sfMagnifyingglass} />
              </List.Image>
            </List.Leading>
            <List.Trailing>
              <TextField.Control {...search} />
              <TextField.Clear mode="always" />
            </List.Trailing>
          </TextField.Root>
        }
      >
        {grid}
      </AppSections>
    );
  }

  return (
    <div className="symbol-catalog">
      <div className="symbol-catalog-bar">
        <input
          className="symbol-catalog-search"
          {...search}
        />
        <span
          aria-live="polite"
          className="symbol-catalog-status"
        >
          {status}
        </span>
      </div>
      {grid}
    </div>
  );
};

/**
 * Every SF Symbol, in a searchable grid: listed on request (the package's
 * index and categories, see above); in the guide's look, or an app's.
 */
export const Catalog: FunctionComponent<{ look?: Look }> = ({
  look = 'docs',
}) => {
  const [listed, setListed] = useState<{
    categories: ReadonlyMap<string, readonly string[]>;
    names: readonly string[];
  }>();
  const [state, setState] = useState<'error' | 'idle' | 'loading'>('idle');

  if (listed) {
    return (
      <Grid
        look={look}
        {...listed}
      />
    );
  }

  const load = () => {
    setState('loading');
    Promise.all([loadIconNames(), loadIconCategories()])
      .then(([names, categories]) => setListed({ categories, names }))
      .catch(() => setState('error'));
  };
  const label = state === 'loading' ? 'Loading…' : 'Load all symbols';

  if (look === 'app') {
    return (
      <AppSections
        footer={state === 'error' ? 'Loading failed.' : undefined}
        row={
          <List.Item>
            <List.Content>
              <List.Button
                disabled={state === 'loading'}
                onClick={load}
              >
                {label}
              </List.Button>
            </List.Content>
          </List.Item>
        }
      />
    );
  }

  return (
    <div className="symbol-catalog">
      <button
        className="demo-button"
        disabled={state === 'loading'}
        type="button"
        onClick={load}
      >
        {label}
      </button>
      {state === 'error' ? (
        <span className="symbol-catalog-status">Loading failed.</span>
      ) : null}
    </div>
  );
};
