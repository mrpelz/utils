import './style.css';

import {
  FunctionComponent,
  KeyboardEvent,
  RefObject,
  UIEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import {
  Symbol,
  type SymbolIcon,
  TextField,
  Viewport,
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
// (plain controls), or a screen's (`screen`, e.g. the kitchen sink's: the
// grid its content layer, filling the screen above the keyboard; its
// search a list row's field in a bottom anchor, on the keyboard; loaded at
// once; see style.css).

/** Its look: the guide's, or a screen's (the library's parts). */
type Look = 'docs' | 'screen';

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

/** The symbols, once listed: searched, virtualized. */
const Grid: FunctionComponent<{
  boxRef?: RefObject<HTMLDivElement | null>;
  categories: ReadonlyMap<string, readonly string[]>;
  look: Look;
  names: readonly string[];
}> = ({ boxRef, categories, look, names }) => {
  const [query, setQuery] = useState('');
  const [copied, setCopied] = useState<string>();
  const [scrollTop, setScrollTop] = useState(0);
  const [size, setSize] = useState({ height: 0, width: 0 });
  const ownBox = useRef<HTMLDivElement>(null);
  const box = boxRef ?? ownBox;
  const area = useRef<HTMLDivElement>(null);
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
    // (Its width inside its padding: e.g. a content layer's, clear of a
    // floating sidebar.)
    const observer = new ResizeObserver(() => {
      const style = getComputedStyle(element);
      setSize({
        height: element.clientHeight,
        width:
          element.clientWidth -
          Number.parseFloat(style.paddingLeft) -
          Number.parseFloat(style.paddingRight),
      });
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, [box]);

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
  // (From the area's start: below a screen's top padding.)
  const onScroll = ({ currentTarget }: UIEvent<HTMLDivElement>) =>
    setScrollTop(
      Math.max(0, currentTarget.scrollTop - (area.current?.offsetTop ?? 0)),
    );
  const areaElement = (
    <div
      ref={area}
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
  );

  // A screen's: the grid its content layer (the screen's scroller, above
  // the keyboard), its search below it, on the keyboard.
  if (look === 'screen') {
    return (
      <>
        <Viewport.Content
          ref={box}
          className="symbol-catalog-screen"
          onScroll={onScroll}
        >
          <Viewport.Padding edge="block-start" />
          {areaElement}
          <Viewport.Padding edge="block-end" />
        </Viewport.Content>
        <Viewport.BlockEnd>
          <div className="symbol-catalog-search-bar">
            <TextField.Root>
              <TextField.Frame variant="row">
                <Symbol icon={sfMagnifyingglass} />
                <TextField.Control {...search} />
                <TextField.Clear />
              </TextField.Frame>
            </TextField.Root>
            <span
              aria-live="polite"
              className="symbol-catalog-status"
            >
              {status}
            </span>
          </div>
        </Viewport.BlockEnd>
      </>
    );
  }

  const grid = (
    <div
      ref={box}
      className="symbol-catalog-box"
      onScroll={onScroll}
    >
      {areaElement}
    </div>
  );

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
 * Every SF Symbol, in a searchable grid: listed (the package's index and
 * categories, see above) on request, or (a screen's, `screen`) at once; a
 * screen's grid its content layer (`boxRef`: the screen's provider's
 * tracked scroller).
 */
export const Catalog: FunctionComponent<{
  boxRef?: RefObject<HTMLDivElement | null>;
  look?: Look;
}> = ({ boxRef, look = 'docs' }) => {
  const [listed, setListed] = useState<{
    categories: ReadonlyMap<string, readonly string[]>;
    names: readonly string[];
  }>();
  // (A screen's: loading at once.)
  const [state, setState] = useState<'error' | 'idle' | 'loading'>(
    look === 'screen' ? 'loading' : 'idle',
  );

  const request = () =>
    Promise.all([loadIconNames(), loadIconCategories()])
      .then(([names, categories]) => setListed({ categories, names }))
      .catch(() => setState('error'));
  const load = () => {
    setState('loading');
    request();
  };

  useEffect(() => {
    if (look === 'screen') request();
    // (Once, as it's shown.)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (listed) {
    return (
      <Grid
        boxRef={boxRef}
        look={look}
        {...listed}
      />
    );
  }

  const label = state === 'loading' ? 'Loading…' : 'Load all symbols';

  if (look === 'screen') {
    return (
      <Viewport.Content ref={boxRef}>
        <Viewport.Padding edge="block-start" />
        <p className="symbol-catalog-status">
          {state === 'error' ? 'Loading failed.' : 'Loading…'}
        </p>
      </Viewport.Content>
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
