import {
  Dispatch,
  FunctionComponent,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import {
  useFocusShiftPrevention,
  useInputZoomPrevention,
} from '../../components/index.js';
import { ColorScheme } from '../../components/utils/main.js';
import { Breadcrumb, Tabs, useEntry } from '../guide/nav.js';
import { PagePathContext } from '../guide/sections.js';
import { CodeView } from './code-view.js';
import { usePortalColorScheme } from './portal-scheme.js';
import { renderCode } from './render-code.js';
import {
  Settings,
  useCreateStateUrl,
  useOptions,
  useProvidedSettings,
} from './state.js';

// A demo's frame: its stage, its header (full-page) and its config
// column (settings, prop controls, code, log); inline, a page's live view.

const BASE_URL_DOC = 'https://base-ui.com/react/components';

/**
 * A full-page demo's header (as a page's: where it is, its title, its
 * component's pages); hidden inline.
 */
const DemoHeader: FunctionComponent<{
  back?: boolean;
  baseUiId?: string;
  hidden: boolean;
  id: string;
  showId?: string;
  stateUrl?: string;
  title: string;
}> = ({ back, baseUiId, hidden, id, showId, stateUrl, title }) => {
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
          <a
            className="demo-id"
            href={`${stateUrl}&raw=true`}
            rel="noreferrer"
            target="_blank"
          >
            [raw]
          </a>
        ) : null}
        {back ? (
          <a
            className="demo-id"
            onClick={() => close()}
          >
            [back]
          </a>
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

/**
 * An inline demo (see `Component`) and, below it (as a code view's Copy
 * button), a link to it on its component's page of demos, and its width:
 * the page's, or the viewport's (expanded, a setting, see `Settings`).
 */
const InlineDemo: FunctionComponent<{
  children: ReactNode;
  expanded: boolean;
  fullscreenUrl?: string;
  setExpanded: (expanded: boolean) => void;
}> = ({ children, expanded, fullscreenUrl, setExpanded }) => (
  <div
    className="demo-inline"
    data-expanded={expanded ? '' : undefined}
  >
    {children}
    <div className="demo-inline-actions">
      <a
        className="demo-button"
        href={fullscreenUrl}
        rel="noreferrer"
        target="_blank"
      >
        Fullscreen
      </a>
      <button
        className="demo-button"
        type="button"
        onClick={() => setExpanded(!expanded)}
      >
        {expanded ? 'Collapse' : 'Expand'}
      </button>
    </div>
  </div>
);

/**
 * A demo's stage, by its frame's settings (its color scheme also its
 * popups', portaled out of it, see portal-scheme.ts).
 */
const Stage: FunctionComponent<{
  children: ReactNode;
  settings: Settings;
}> = ({
  children,
  settings: {
    backdrop,
    center,
    colorScheme,
    safeAreas,
    stageBackground,
    stretch,
  },
}) => {
  const ref = useRef<HTMLDivElement>(null);
  usePortalColorScheme(ref, colorScheme);

  return (
    <div
      ref={ref}
      className="demo-stage"
      data-color-scheme={colorScheme}
      data-safe-areas={safeAreas ? '' : undefined}
    >
      {stageBackground ? <div className="demo-stage-background" /> : null}
      <div
        className="demo-stage-inner"
        data-backdrop={backdrop ? '' : undefined}
        data-center={center ? '' : undefined}
        data-stretch={stretch ? '' : undefined}
      >
        {children}
      </div>
    </div>
  );
};

/** The guards' hooks, above the code of a demo with `inputGuards`. */
const inputGuardsCode = `useInputZoomPrevention();
useFocusShiftPrevention();

`;

/**
 * The iOS input guards of a shown demo's stage (with `inputGuards`:
 * document-wide, as its code shows) and of its config (the prop controls':
 * on every demo, so zoom is held wherever one is); the config's ref.
 */
const useGuards = (hidden: boolean, inputGuards: boolean, raw: boolean) => {
  const ref = useRef<HTMLElement>(null);
  const stage = !hidden && inputGuards;
  const config = !hidden && !raw;
  useInputZoomPrevention(stage || config);
  useFocusShiftPrevention(undefined, stage);
  useFocusShiftPrevention(ref, config);

  return ref;
};

/** A demo's code: its stage's, below its guards' hooks (if it has them). */
const demoCode = (children: ReactNode, inputGuards: boolean) =>
  `${inputGuards ? inputGuardsCode : ''}${renderCode(children)}`;

/** A demo's settings changed from its defaults (none: `undefined`). */
const changedSettings = (defaults: Settings, settings: Settings) => {
  const changed = Object.fromEntries(
    Object.entries(settings).filter(
      ([key, value]) => defaults[key as keyof Settings] !== value,
    ),
  ) as Partial<Settings>;

  return Object.keys(changed).length > 0 ? changed : undefined;
};

/** A demo's stage settings, in its config column. */
const StageSettings: FunctionComponent<{
  defaults: Settings;
  setSettings: Dispatch<SetStateAction<Settings>>;
  settings: Settings;
}> = ({ defaults, setSettings, settings }) => {
  const toggle = (
    key: Exclude<keyof Settings, 'colorScheme'>,
    label: string,
  ) => (
    <label style={{ display: 'block' }}>
      <input
        checked={settings[key]}
        name={key}
        type="checkbox"
        onChange={() =>
          setSettings((settings_) => ({ ...settings_, [key]: !settings_[key] }))
        }
      />
      {label}
    </label>
  );

  return (
    <section className="demo-config-section">
      <details open>
        <summary className="demo-config-heading">Stage</summary>
        <label style={{ display: 'block' }}>
          Color Scheme{' '}
          <select
            name="colorScheme"
            value={settings.colorScheme ?? ''}
            onChange={({ currentTarget }) =>
              setSettings((settings_) => ({
                ...settings_,
                colorScheme: (currentTarget.value as ColorScheme) || undefined,
              }))
            }
          >
            <option value="">[auto]</option>
            <option value="light">light</option>
            <option value="dark">dark</option>
          </select>
        </label>
        {toggle('stageBackground', 'Stage Background')}
        {toggle('backdrop', 'Backdrop')}
        {toggle('center', 'Center')}
        {toggle('stretch', 'Stretch')}
        {toggle('safeAreas', 'Safe Areas')}
        <button
          className="demo-button"
          disabled={changedSettings(defaults, settings) === undefined}
          onClick={() => setSettings(defaults)}
        >
          Reset
        </button>
      </details>
    </section>
  );
};

export const Component: FunctionComponent<{
  backdrop?: boolean;
  /** Base UI component the demo is built on, for the docs link (if any). */
  baseUiId?: string;
  center?: boolean;
  /** Forced on its stage (a setting, see `Settings`). */
  colorScheme?: ColorScheme;
  controls?: ReactNode;
  /**
   * Inline, as wide as the viewport at first (a setting, see `Settings`):
   * e.g. a tablet's screen, wider than the page's column.
   */
  expanded?: boolean;
  /** Unique demo id, used for selecting demos (`#id=…`) and storing config. */
  id: string;
  /**
   * In a guide page's flow (e.g. a component's overview), as a section's
   * live view: sized by its content, without a heading of its own, with a
   * link opening it on its component's page of demos (where it's a demo as
   * any) in a tab of its own.
   */
  inline?: boolean;
  /**
   * Its stage has text fields: guarded against iOS' zoom and focus shift
   * (`useInputZoomPrevention`, `useFocusShiftPrevention`), shown in its code.
   */
  inputGuards?: boolean;
  log?: ReactNode;
  /** Its devices' safe area insets hatched (a setting, see `Settings`). */
  safeAreas?: boolean;
  /** Its stage's dotted background (a setting, see `Settings`). */
  stageBackground?: boolean;
  /** Its prop controls' state, for its URL (see `useCreateStateUrl`). */
  state?: unknown[];
  stretch?: boolean;
  title: string;
}> = ({
  backdrop = false,
  baseUiId,
  center = false,
  children,
  colorScheme,
  controls,
  expanded = false,
  id,
  inline = false,
  inputGuards = false,
  log,
  safeAreas = false,
  stageBackground = true,
  state,
  stretch = false,
  title,
}) => {
  const { back, id: showId, raw } = useOptions();
  const entry = useEntry();
  // (Inline on a guide page only, see guide/pages.tsx.)
  const pagePath = useContext(PagePathContext);
  const isInline = inline && pagePath !== '';
  // Its settings: its defaults, or as its URL has them; changed here alone.
  const defaults = useMemo<Settings>(
    () => ({
      backdrop,
      center,
      colorScheme,
      expanded,
      safeAreas,
      stageBackground,
      stretch,
    }),
    [
      backdrop,
      center,
      colorScheme,
      expanded,
      safeAreas,
      stageBackground,
      stretch,
    ],
  );
  const provided = useProvidedSettings(id);
  const initial = useMemo(
    () => ({ ...defaults, ...provided }),
    [defaults, provided],
  );
  const [settings, setSettings] = useState(initial);
  useEffect(() => {
    // (Its URL changed, as a prop control's state does.)
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSettings(initial);
  }, [initial]);
  const changed = useMemo(
    () => changedSettings(defaults, settings),
    [defaults, settings],
  );
  const stateUrl = useCreateStateUrl(id, { settings: changed, state });
  // (Full-page there: not expanded, as inline.)
  const fullscreenSettings = useMemo(() => {
    if (!changed) return undefined;
    const { expanded: _expanded, ...rest } = changed;
    return Object.keys(rest).length > 0 ? rest : undefined;
  }, [changed]);
  const fullscreenUrl = useCreateStateUrl(id, {
    back: true,
    path: `${entry?.id ?? ''}/all`,
    settings: fullscreenSettings,
    state,
  });
  // (Its own: closed at first, not kept, nor shared with other views.)
  const [codeOpen, setCodeOpen] = useState(false);
  // (After rendering: rendering to a string resets Preact's hooks state.)
  const [code, setCode] = useState('');
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCode(codeOpen && !raw ? demoCode(children, inputGuards) : '');
  }, [children, codeOpen, inputGuards, raw]);

  const isHidden = useMemo(() => {
    if (showId === undefined || showId === id) return false;

    return true;
  }, [id, showId]);

  const config = useGuards(isHidden, inputGuards, raw);

  if (isHidden) return null;
  if (raw) return children;

  const container = (
    <div
      className="demo-container"
      data-inline={isInline ? '' : undefined}
    >
      <section className="demo-content">
        <DemoHeader
          back={back}
          baseUiId={baseUiId}
          hidden={isInline}
          id={id}
          showId={showId}
          stateUrl={stateUrl}
          title={title}
        />
        <Stage settings={settings}>{children}</Stage>
      </section>
      <aside
        ref={config}
        className="demo-config"
      >
        <StageSettings
          defaults={defaults}
          setSettings={setSettings}
          settings={settings}
        />
        {controls}
        <section className="demo-config-section">
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

  return isInline ? (
    <InlineDemo
      expanded={settings.expanded}
      fullscreenUrl={fullscreenUrl}
      setExpanded={(expanded_) =>
        setSettings((settings_) => ({ ...settings_, expanded: expanded_ }))
      }
    >
      {container}
    </InlineDemo>
  ) : (
    container
  );
};
