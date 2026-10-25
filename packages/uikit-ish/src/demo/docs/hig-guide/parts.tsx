import {
  FunctionComponent,
  ReactNode,
  useEffect,
  useId,
  useState,
} from 'react';

import { useDark } from '../../tooling/shared/use-dark.js';

const HIG = 'https://developer.apple.com/design/human-interface-guidelines';

/** A page of Apple's HIG (`page`: its path, e.g. `toggles`). */
export const Hig: FunctionComponent<{ children: ReactNode; page: string }> = ({
  children,
  page,
}) => (
  <a
    href={`${HIG}/${page}`}
    rel="noreferrer"
    target="_blank"
  >
    {children}
  </a>
);

/** A diagram drawn in text (box-drawing characters), as written. */
export const Diagram: FunctionComponent<{ children: string; id?: string }> = ({
  children,
  id = undefined,
}) => (
  <pre
    className="demo-diagram"
    id={id}
  >
    {children}
  </pre>
);

/** A table from rows of cells (the first row its head). */
export const Table: FunctionComponent<{
  id?: string;
  /** Rows' anchors (by their index in `rows`, e.g. a rule's `rule-a1`). */
  rowIds?: readonly (string | undefined)[];
  rows: readonly (readonly ReactNode[])[];
}> = ({ id = undefined, rowIds = [], rows }) => {
  const [head = [], ...body] = rows;

  return (
    <div className="demo-table">
      <table id={id}>
        <thead>
          <tr>
            {head.map((cell, index) => (
              <th key={index}>{cell}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {body.map((row, index) => (
            <tr
              key={index}
              id={rowIds[index]}
            >
              {row.map((cell, cellIndex) => (
                <td key={cellIndex}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// (One import for all diagrams, on the client only.)
let loading: Promise<typeof import('mermaid').default> | undefined;
const loadMermaid = () => {
  loading ??= import(/* webpackChunkName: "mermaid" */ 'mermaid').then(
    (module) => module.default,
  );
  return loading;
};

// Rendered diagrams, by color scheme and source: shown at once when their
// page is shown again (e.g. back), so it has its final height as the
// browser restores its scroll position.
const rendered = new Map<string, string>();

/**
 * A Mermaid diagram, rendered on the client (its source as text until then,
 * and while prerendering), in the page's color scheme.
 */
export const Mermaid: FunctionComponent<{ children: string; id?: string }> = ({
  children,
  id = undefined,
}) => {
  const isDark = useDark();
  const key = `${isDark ? 'dark' : 'light'}\n${children}`;
  const svg = rendered.get(key);
  const [, setRenderedKey] = useState<string | undefined>(undefined);
  const renderId = `mermaid-${useId().replaceAll(/[^\w-]/gu, '')}`;

  useEffect(() => {
    if (rendered.has(key)) return undefined;
    let isCancelled = false;

    loadMermaid()
      .then(async (mermaid) => {
        mermaid.initialize({
          securityLevel: 'strict',
          startOnLoad: false,
          theme: isDark ? 'dark' : 'default',
        });
        const result = await mermaid.render(renderId, children);
        rendered.set(key, result.svg);
        if (!isCancelled) setRenderedKey(key);
      })
      .catch(() => undefined);

    return () => {
      isCancelled = true;
    };
  }, [children, isDark, key, renderId]);

  return (
    <figure
      className="demo-mermaid"
      id={id}
    >
      {svg === undefined ? (
        <pre className="demo-diagram">{children}</pre>
      ) : (
        // (Mermaid's own output, rendered with its `strict` security level.)
        <div dangerouslySetInnerHTML={{ __html: svg }} />
      )}
    </figure>
  );
};

/** A section's heading, anchored (`section-…`), with a link to itself. */
export const Heading: FunctionComponent<{
  children: ReactNode;
  id: string;
  level: 2 | 3 | 4;
}> = ({ children, id, level }) => {
  const Tag = `h${String(level)}` as 'h2';

  return (
    <Tag id={id}>
      {children}{' '}
      <a
        aria-label="Link to this section"
        className="demo-anchor"
        href={`hig-guide#${id}`}
      >
        #
      </a>
    </Tag>
  );
};
