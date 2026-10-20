import {
  FunctionComponent,
  ReactNode,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { ColorScheme } from '../../components/utils/main.js';
import { Breadcrumb, Tabs, useEntry } from '../guide/nav.js';
import { useLocalStorage } from '../shared/use-local-storage.js';
import { CodeView } from './code-view.js';
import { renderCode } from './render-code.js';
import { setOptions, useOptions } from './state.js';

// A demo's frame: its stage, its header (full-page) and its config
// column (settings, prop controls, code, log); inline, a page's live view.

const BASE_URL_DOC = 'https://base-ui.com/react/components';

/**
 * A full-page demo's header (as a page's: where it is, its title, its
 * component's pages); hidden inline.
 */
const DemoHeader: FunctionComponent<{
  baseUiId?: string;
  hidden: boolean;
  id: string;
  showId?: string;
  stateUrl?: string;
  title: string;
}> = ({ baseUiId, hidden, id, showId, stateUrl, title }) => {
  const entry = useEntry();

  return (
    <header
      className="demo-header"
      hidden={hidden}
    >
      {entry ? (
        <Breadcrumb
          withComponent
          entry={entry}
        />
      ) : null}
      <h2 className="demo-heading">
        {title}
        {stateUrl ? (
          <a
            className="demo-id"
            href={stateUrl}
            rel="noreferrer"
            target="_blank"
          >
            [{id}]
          </a>
        ) : null}
        {showId ? (
          <>
            <a
              className="demo-id"
              href={`${stateUrl}&raw=true`}
              rel="noreferrer"
              target="_blank"
            >
              [raw]
            </a>
            <a
              className="demo-id"
              onClick={() =>
                setOptions({
                  id: undefined,
                  raw: undefined,
                  state: undefined,
                })
              }
            >
              [x]
            </a>
          </>
        ) : null}
      </h2>
      {entry ? (
        <Tabs
          baseUiId={baseUiId}
          entry={entry}
          tab="all"
        />
      ) : null}
      {!entry && baseUiId !== undefined ? (
        <a
          className="demo-docs-link"
          href={`${BASE_URL_DOC}/${baseUiId}`}
          rel="noreferrer"
          target="_blank"
        >
          base-ui.com/react/components/{baseUiId}
        </a>
      ) : null}
    </header>
  );
};

export const Component: FunctionComponent<{
  backdrop?: boolean;
  /** Base UI component the demo is built on, for the docs link (if any). */
  baseUiId?: string;
  center?: boolean;
  controls?: ReactNode;
  /** Unique demo id, used for selecting demos (`#id=…`) and storing config. */
  id: string;
  /**
   * In a page's flow (e.g. a component's overview), as a section's live
   * view: sized by its content, without a heading of its own.
   */
  inline?: boolean;
  log?: ReactNode;
  stateUrl?: string;
  stretch?: boolean;
  title: string;
}> = ({
  backdrop = false,
  baseUiId,
  center = false,
  children,
  controls,
  id,
  inline = false,
  log,
  stateUrl,
  stretch = false,
  title,
}) => {
  const { id: showId, raw } = useOptions();
  // Its settings: its component's, shared by the component's demos on all
  // its pages (see guide/nav.tsx); a demo's own outside of one.
  const entry = useEntry();
  const settings = entry?.id ?? id;
  const [colorScheme, setColorScheme] = useLocalStorage<
    ColorScheme | undefined
  >('colorScheme', undefined);
  const [stageBackground, setStageBackground] = useLocalStorage(
    `${settings}.stageBackground`,
    true,
  );
  const [isCentered, setIsCentered] = useLocalStorage(
    `${settings}.center`,
    center,
  );
  const [isStretched, setIsStretched] = useLocalStorage(
    `${settings}.stretch`,
    stretch,
  );
  const [hasBackdrop, setHasBackdrop] = useLocalStorage(
    `${settings}.backdrop`,
    backdrop,
  );
  const [codeOpen, setCodeOpen] = useLocalStorage(`${settings}.code`, false);
  // (After rendering: rendering to a string resets Preact's hooks state.)
  const [code, setCode] = useState('');
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCode(codeOpen && !raw ? renderCode(children) : '');
  }, [children, codeOpen, raw]);

  const isHidden = useMemo(() => {
    if (showId === undefined || showId === id) return false;

    return true;
  }, [id, showId]);

  if (isHidden) return null;
  if (raw) return children;

  return (
    <div
      className="demo-container"
      data-inline={inline ? '' : undefined}
    >
      <section className="demo-content">
        <DemoHeader
          baseUiId={baseUiId}
          hidden={inline}
          id={id}
          showId={showId}
          stateUrl={stateUrl}
          title={title}
        />
        <div className="demo-stage">
          {stageBackground ? <div className="demo-stage-background" /> : null}
          <div
            className="demo-stage-inner"
            data-backdrop={hasBackdrop ? '' : undefined}
            data-center={isCentered ? '' : undefined}
            data-stretch={isStretched ? '' : undefined}
          >
            {children}
          </div>
        </div>
      </section>
      <aside className="demo-config">
        <section className="demo-config demo-config-section">
          <summary className="demo-config-heading">Config</summary>
          <label style={{ display: 'block' }}>
            Color Scheme{' '}
            <select
              name="colorScheme"
              value={colorScheme}
              onChange={({ currentTarget }) =>
                setColorScheme(
                  (currentTarget.value as ColorScheme) || undefined,
                )
              }
            >
              <option value="">[auto]</option>
              <option value="light">light</option>
              <option value="dark">dark</option>
            </select>
          </label>
          <label style={{ display: 'block' }}>
            <input
              checked={stageBackground}
              name={`${settings}.stageBackground`}
              type="checkbox"
              onClick={() => setStageBackground(!stageBackground)}
            />
            Stage Background
          </label>
          <label style={{ display: 'block' }}>
            <input
              checked={hasBackdrop}
              name={`${settings}.backdrop`}
              type="checkbox"
              onClick={() => setHasBackdrop(!hasBackdrop)}
            />
            Backdrop
          </label>
          <label style={{ display: 'block' }}>
            <input
              checked={isCentered}
              name={`${settings}.center`}
              type="checkbox"
              onClick={() => setIsCentered(!isCentered)}
            />
            Center
          </label>
          <label style={{ display: 'block' }}>
            <input
              checked={isStretched}
              name={`${settings}.stretch`}
              type="checkbox"
              onClick={() => setIsStretched(!isStretched)}
            />
            Stretch
          </label>
        </section>
        {controls}
        <section className="demo-config demo-config-section">
          <details
            open={codeOpen}
            onToggle={({ currentTarget }) =>
              setCodeOpen((currentTarget as HTMLDetailsElement).open)
            }
          >
            <summary className="demo-config-heading">Code</summary>
            {codeOpen ? <CodeView code={code} /> : null}
          </details>
        </section>
        {log}
      </aside>
    </div>
  );
};
