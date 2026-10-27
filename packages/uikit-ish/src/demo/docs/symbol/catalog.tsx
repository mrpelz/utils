import type { IconDefinition } from '@bradleyhodges/sfsymbols-types';
import {
  FunctionComponent,
  UIEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { Symbol } from '../../../components/index.js';

// Every SF Symbol of `@bradleyhodges/sfsymbols`, in a grid (no stage): the
// package's index loaded on request (all of its symbols: a large download),
// searchable by name, keyword and category; only the rows in view rendered.
// A symbol clicked, its import is copied.

// A cell's size (px), and the rows rendered beyond the view (each way).
const cellSize = 96;
const overscan = 2;

const isIcon = (value: unknown): value is IconDefinition =>
  typeof value === 'object' && value !== null && 'svgPathData' in value;

/** What a symbol is found by: its names, keywords and categories. */
const searchText = ({
  categories,
  iconName,
  keywords,
  sourceName,
}: IconDefinition) =>
  // (Its keywords: a list, typed as a record.)
  [iconName, sourceName, ...Object.values(keywords ?? {}), ...categories]
    .join(' ')
    .toLowerCase();

/** The import of a symbol, as copied. */
const importOf = ({ iconName }: IconDefinition) =>
  `import { ${iconName} } from '@bradleyhodges/sfsymbols/${iconName}';`;

/** The symbols, once loaded: searched, virtualized. */
const Grid: FunctionComponent<{ icons: readonly IconDefinition[] }> = ({
  icons,
}) => {
  const [query, setQuery] = useState('');
  const [copied, setCopied] = useState<string>();
  const [scrollTop, setScrollTop] = useState(0);
  const [size, setSize] = useState({ height: 0, width: 0 });
  const box = useRef<HTMLDivElement>(null);
  const texts = useMemo(() => icons.map((icon) => searchText(icon)), [icons]);

  const found = useMemo(() => {
    const terms = query.toLowerCase().split(/\s+/u).filter(Boolean);
    return icons.filter((_, index) =>
      terms.every((term) => texts[index]?.includes(term)),
    );
  }, [icons, query, texts]);

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

  return (
    <div className="symbol-catalog">
      <div className="symbol-catalog-bar">
        <input
          aria-label="Search symbols"
          className="symbol-catalog-search"
          placeholder={`Search ${String(icons.length)} symbols`}
          type="search"
          value={query}
          onInput={({ currentTarget }) => {
            setQuery(currentTarget.value);
            setScrollTop(0);
            box.current?.scrollTo({ top: 0 });
          }}
        />
        <span
          aria-live="polite"
          className="symbol-catalog-status"
        >
          {copied ? `Copied: ${copied}` : `${String(found.length)} found`}
        </span>
      </div>
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
            {shown.map((icon) => (
              <button
                key={icon.iconName}
                className="symbol-catalog-cell"
                title={importOf(icon)}
                type="button"
                onClick={() =>
                  navigator.clipboard
                    .writeText(importOf(icon))
                    .then(() => setCopied(icon.iconName))
                    .catch(() => setCopied(undefined))
                }
              >
                <Symbol icon={icon} />
                <span className="symbol-catalog-name">{icon.sourceName}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Every SF Symbol, in a searchable grid: loaded on request (the package's
 * index, see above).
 */
export const Catalog: FunctionComponent = () => {
  const [icons, setIcons] = useState<readonly IconDefinition[]>();
  const [state, setState] = useState<'error' | 'idle' | 'loading'>('idle');

  if (icons) return <Grid icons={icons} />;

  return (
    <div className="symbol-catalog">
      <button
        className="demo-button"
        disabled={state === 'loading'}
        type="button"
        onClick={() => {
          setState('loading');
          import('@bradleyhodges/sfsymbols')
            .then((module) => setIcons(Object.values(module).filter(isIcon)))
            .catch(() => setState('error'));
        }}
      >
        {state === 'loading' ? 'Loading…' : 'Load all symbols'}
      </button>
      {state === 'error' ? (
        <span className="symbol-catalog-status">Loading failed.</span>
      ) : null}
    </div>
  );
};
