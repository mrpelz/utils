import {
  Dispatch,
  FunctionComponent,
  ReactNode,
  RefObject,
  SetStateAction,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import {
  PortalContainerContext,
  useFocusShiftPrevention,
  useInputZoomPrevention,
} from '../../../components/index.js';
import { ColorScheme } from '../../../components/utils/main.js';
import { Breadcrumb, Tabs, useEntry } from '../guide/nav.js';
import { PagePathContext } from '../guide/sections.js';
import { CodeView } from './code-view.js';
import { usePortalColorScheme } from './portal-scheme.js';
import { renderCode } from './render-code.js';
import {
  Settings,
  StageType,
  useCreateStateUrl,
  useOptions,
  useProvidedSettings,
} from './state.js';

// A demo's frame: its stage, its header (full-page) and its config
// column (settings, diagnostics, prop controls, code, log); inline, a
// page's live view.

const BASE_URL_DOC = 'https://base-ui.com/react/components';

/**
 * A full-page demo's header (as a page's: where it is, its title, its
 * component's pages); none inline.
 */
const DemoHeader: FunctionComponent<{
  baseUiId?: string;
  id: string;
  isBack?: boolean;
  showId?: string;
  stateUrl?: string;
  title: string;
}> = ({ baseUiId, id, isBack, showId, stateUrl, title }) => {
  const entry = useEntry();

  return (
    <header className="demo-header">
      {entry ? (
        <Breadcrumb
          hasComponent
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
        {isBack ? (
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
 * Whether an inline demo, expanded, would be wider than the page's column
 * it's in (the viewport's width, 1rem from its edges, see style.css): not
 * on a phone, the column as wide already.
 */
const useCanExpand = (ref: RefObject<HTMLElement | null>) => {
  const [canExpand, setCanExpand] = useState(true);

  useLayoutEffect(() => {
    const column = ref.current?.parentElement;
    if (!column) return undefined;

    const update = () => {
      const { paddingLeft, paddingRight } = getComputedStyle(column);
      const width =
        column.clientWidth -
        Number.parseFloat(paddingLeft) -
        Number.parseFloat(paddingRight);
      const remInPx = Number.parseFloat(
        getComputedStyle(document.documentElement).fontSize,
      );
      setCanExpand(
        document.documentElement.clientWidth - 2 * remInPx > width + 1,
      );
    };

    update();
    // (The column's width, and the viewport's: the root's. In the next
    // frame: its state changing the layout, the observer isn't looped.)
    let frame = 0;
    const observer = new ResizeObserver(() => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    });
    observer.observe(column);
    observer.observe(document.documentElement);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [ref]);

  return canExpand;
};

/**
 * An inline demo (see `Component`) and, below it (as a code view's Copy
 * button), a link to it on its component's page of demos, and its width:
 * the page's, or the viewport's (expanded, a setting, see `Settings`).
 */
const InlineDemo: FunctionComponent<{
  canExpand: boolean;
  children: ReactNode;
  containsOverscroll?: boolean;
  fullscreenUrl?: string;
  inlineRef: RefObject<HTMLDivElement | null>;
  isExpanded: boolean;
  setIsExpanded: (isExpanded: boolean) => void;
}> = ({
  canExpand,
  children,
  containsOverscroll,
  fullscreenUrl,
  inlineRef,
  isExpanded,
  setIsExpanded,
}) => (
  <div
    ref={inlineRef}
    className="demo-inline"
    data-contains-overscroll={containsOverscroll ? '' : undefined}
    data-expanded={isExpanded ? '' : undefined}
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
        disabled={!canExpand}
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {isExpanded ? 'Collapse' : 'Expand'}
      </button>
    </div>
  </div>
);

/** Its device's screen's ref: the one given, or its own. */
const useScreenRef = (given?: RefObject<HTMLDivElement | null>) => {
  const own = useRef<HTMLDivElement>(null);
  return given ?? own;
};

/** Raw: as the URL has it, on a demos' page only (see `EntryDemos`). */
const useIsRaw = () => {
  const { raw } = useOptions();
  const pagePath = useContext(PagePathContext);
  return raw && pagePath === '';
};

/**
 * Raw, the demo is the app (its screen the window's): the document marked,
 * so it doesn't bounce (see shared/style.css); titled as the demo. (Added
 * to the Home Screen as itself, see scripts/demo-head.js: decided as the
 * page loads.)
 */
const useRawDocument = (isRaw: boolean, isHidden: boolean, title: string) => {
  const isRawShown = isRaw && !isHidden;
  useLayoutEffect(() => {
    if (!isRawShown) return undefined;
    const { documentElement: root } = document;
    root.dataset.demoRaw = '';
    const { title: documentTitle } = document;
    document.title = title;

    return () => {
      delete root.dataset.demoRaw;
      document.title = documentTitle;
    };
  }, [isRawShown, title]);
};

/**
 * A device's screen (a stage's, see `Stage`): its frame (see
 * shared/style.css), also its popups' portal container (they show within
 * it, as on the device: see `PortalContainerContext`).
 */
const Screen: FunctionComponent<{
  children: ReactNode;
  hasWallpaper: boolean;
  screen?: 'centered' | 'flow';
  screenRef: RefObject<HTMLDivElement | null>;
  stage: StageType;
}> = ({ children, hasWallpaper, screen, screenRef: ref, stage }) => (
  <div
    ref={ref}
    className={`demo-${stage}`}
    data-screen={screen}
    data-wallpaper={hasWallpaper ? '' : undefined}
  >
    <PortalContainerContext.Provider value={ref}>
      {children}
    </PortalContainerContext.Provider>
  </div>
);

/**
 * A demo's stage, by its type and its frame's settings (its color scheme
 * also its popups', portaled out of it, see portal-scheme.ts): a device's
 * screen (see `Screen`), centered, or the demo's own element (a simple
 * demo's, see `Settings`). Its type is named at its top.
 */
const Stage: FunctionComponent<{
  children: ReactNode;
  hasWallpaper: boolean;
  screen?: 'centered' | 'flow';
  screenRef: RefObject<HTMLDivElement | null>;
  settings: Settings;
  stage?: StageType;
}> = ({
  children,
  hasWallpaper,
  screen,
  screenRef,
  settings: {
    colorScheme,
    hasBackdrop,
    hasSafeAreas,
    hasStageBackground,
    isCentered,
    isStretched,
  },
  stage,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  usePortalColorScheme(ref, colorScheme);

  return (
    <div
      ref={ref}
      className="demo-stage"
      data-color-scheme={colorScheme}
      data-safe-areas={stage && hasSafeAreas ? '' : undefined}
    >
      {hasStageBackground ? <div className="demo-stage-background" /> : null}
      <span className="demo-stage-type">{stage ?? 'simple'}</span>
      {stage ? (
        <div
          data-center
          className="demo-stage-inner"
        >
          <Screen
            hasWallpaper={hasWallpaper}
            screen={screen}
            screenRef={screenRef}
            stage={stage}
          >
            {children}
          </Screen>
        </div>
      ) : (
        <div
          className="demo-stage-inner"
          data-backdrop={hasBackdrop ? '' : undefined}
          data-center={isCentered ? '' : undefined}
          data-stretch={isStretched ? '' : undefined}
        >
          {children}
        </div>
      )}
    </div>
  );
};

/**
 * A demo's diagnostics (see `Component`), in its config column: read as in
 * its device's screen (`screenRef`, its portal container), if it has one.
 */
const Diagnostics: FunctionComponent<{
  children: ReactNode;
  screenRef: RefObject<HTMLDivElement | null> | undefined;
}> = ({ children, screenRef }) =>
  children ? (
    <section className="demo-config-section">
      <details open>
        <summary className="demo-config-heading">Diagnostics</summary>
        <div className="demo-diagnostics">
          {screenRef ? (
            <PortalContainerContext.Provider value={screenRef}>
              {children}
            </PortalContainerContext.Provider>
          ) : (
            children
          )}
        </div>
      </details>
    </section>
  ) : null;

/** The guards' hooks, above the code of a demo with `hasInputGuards`. */
const inputGuardsCode = `useInputZoomPrevention();
useFocusShiftPrevention();

`;

/**
 * The iOS input guards of a shown demo's stage (with `hasInputGuards`:
 * document-wide, as its code shows) and of its config (the prop controls':
 * on every demo, so zoom is held wherever one is); the config's ref.
 */
const useGuards = (
  isHidden: boolean,
  hasInputGuards: boolean,
  isRaw: boolean,
) => {
  const ref = useRef<HTMLElement>(null);
  const isStageGuarded = !isHidden && hasInputGuards;
  const isConfigGuarded = !isHidden && !isRaw;
  useInputZoomPrevention(isStageGuarded || isConfigGuarded);
  useFocusShiftPrevention(undefined, isStageGuarded);
  useFocusShiftPrevention(ref, isConfigGuarded);

  return ref;
};

/**
 * A demo's code: its guards' hooks (if it has them), the definitions of
 * the labelled values its JSX uses (handles, refs; those its setup doesn't
 * define), its setup (the state and hooks its JSX uses), then its stage's
 * JSX.
 */
const demoCode = (
  children: ReactNode,
  hasInputGuards: boolean,
  setup: string | undefined,
) => {
  const { code, definitions } = renderCode(children);
  const defined = [...definitions]
    .filter(([label]) => !setup?.includes(`const ${label} =`))
    .map(([, definition]) => definition);
  const start = [...defined, ...(setup ? [setup.trim()] : [])].join('\n');

  return `${hasInputGuards ? inputGuardsCode : ''}${start ? `${start}\n\n` : ''}${code}`;
};

/** A demo's settings changed from its defaults (none: `undefined`). */
const changedSettings = (defaults: Settings, settings: Settings) => {
  const changed = Object.fromEntries(
    Object.entries(settings).filter(
      ([key, value]) => defaults[key as keyof Settings] !== value,
    ),
  ) as Partial<Settings>;

  return Object.keys(changed).length > 0 ? changed : undefined;
};

/**
 * A demo's stage settings, in its config column; those its stage has no
 * use for (or, expanding, can't now) disabled.
 */
const StageSettings: FunctionComponent<{
  canExpand: boolean;
  defaults: Settings;
  isInline: boolean;
  setSettings: Dispatch<SetStateAction<Settings>>;
  settings: Settings;
  stage?: StageType;
}> = ({ canExpand, defaults, isInline, setSettings, settings, stage }) => {
  const toggle = (
    key: Exclude<keyof Settings, 'colorScheme'>,
    label: string,
    isDisabled = false,
  ) => (
    <label className="demo-setting">
      <input
        checked={settings[key]}
        disabled={isDisabled}
        name={key}
        type="checkbox"
        onChange={() =>
          setSettings((settings_) => ({ ...settings_, [key]: !settings_[key] }))
        }
      />
      {label}
    </label>
  );

  const isFramed = stage !== undefined;

  return (
    <section className="demo-config-section">
      <details open>
        <summary className="demo-config-heading">Stage</summary>
        <label className="demo-setting">
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
        {toggle('hasStageBackground', 'Stage Background')}
        {toggle('hasBackdrop', 'Backdrop', isFramed)}
        {toggle('isCentered', 'Center', isFramed)}
        {toggle('isStretched', 'Stretch', isFramed)}
        {toggle('hasSafeAreas', 'Safe Areas', !isFramed)}
        {toggle('isExpanded', 'Expand', !isInline || !canExpand)}
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
  /** Base UI component the demo is built on, for the docs link (if any). */
  baseUiId?: string;
  /** Forced on its stage (a setting, see `Settings`). */
  colorScheme?: ColorScheme;
  /**
   * Inline, its scrolling keeps its overscroll (as in an app), not handing
   * it on to the page's: e.g. pulled past an end (`overscroll`).
   */
  containsOverscroll?: boolean;
  controls?: ReactNode;
  /**
   * What the demo reads out (e.g. a hook's values), beside its stage: a
   * section of its own in its config column, open. Technical values go
   * here, not on its screen. On a device, read as in its screen (its
   * portal container, e.g. for its anchors' sizes).
   */
  diagnostics?: ReactNode;
  /** An app's background behind it (a setting of simple demos). */
  hasBackdrop?: boolean;
  /**
   * Its stage has text fields: guarded against iOS' zoom and focus shift
   * (`useInputZoomPrevention`, `useFocusShiftPrevention`), shown in its code.
   */
  hasInputGuards?: boolean;
  /** Its device's safe area insets hatched (a setting, see `Settings`). */
  hasSafeAreas?: boolean;
  /** Its stage's dotted background (a setting, see `Settings`). */
  hasStageBackground?: boolean;
  /** Its device's screen behind its content (see shared/style.css). */
  hasWallpaper?: boolean;
  /** Unique demo id, used for selecting demos (`#id=…`) and storing config. */
  id: string;
  /** Centered on the stage (a setting of simple demos). */
  isCentered?: boolean;
  /**
   * Inline, as wide as the viewport at first (a setting, see `Settings`):
   * e.g. a tablet's screen, wider than the page's column.
   */
  isExpanded?: boolean;
  /**
   * In a guide page's flow (e.g. a component's overview), as a section's
   * live view: sized by its content, without a heading of its own, with a
   * link opening it on its component's page of demos (where it's a demo as
   * any) in a tab of its own.
   */
  isInline?: boolean;
  /** As wide as the stage (a setting of simple demos). */
  isStretched?: boolean;
  log?: ReactNode;
  /**
   * Its device's screen's layout (see shared/style.css): its content
   * centered (e.g. a sheet's trigger), or as high as it is (a page in the
   * stage's flow, nothing scrolling within it).
   */
  screen?: 'centered' | 'flow';
  /**
   * Its device's screen's element, for what's around the demo (e.g. a
   * `Viewport.Provider` wrapping its view, given it as its `screen`, so it
   * tracks the screen, not the window); raw, none (the window's).
   */
  screenRef?: RefObject<HTMLDivElement | null>;
  /**
   * Its code's start, above its JSX: the state and hooks the JSX uses
   * (e.g. a `useState` wiring parts in controlled mode).
   */
  setup?: string;
  /** Its stage: a device's screen, or none (a simple demo). */
  stage?: StageType;
  /** Its prop controls' state, for its URL (see `useCreateStateUrl`). */
  state?: unknown[];
  title: string;
}> = ({
  baseUiId,
  children,
  colorScheme,
  containsOverscroll,
  controls,
  diagnostics,
  hasBackdrop = false,
  hasInputGuards = false,
  hasSafeAreas = false,
  hasStageBackground = true,
  hasWallpaper = false,
  id,
  isCentered = false,
  isExpanded = false,
  isInline: isInlineProp = false,
  isStretched = false,
  log,
  screen,
  screenRef: screenRefProp,
  setup,
  stage,
  state,
  title,
}) => {
  const { back: isBack, id: showId } = useOptions();
  const isRaw = useIsRaw();
  const entry = useEntry();
  // (Inline on a guide page only, see guide/pages.tsx.)
  const pagePath = useContext(PagePathContext);
  const isInline = isInlineProp && pagePath !== '';
  // Its settings: its defaults, or as its URL has them; changed here alone.
  const defaults = useMemo<Settings>(
    () => ({
      colorScheme,
      hasBackdrop,
      hasSafeAreas,
      hasStageBackground,
      isCentered,
      isExpanded,
      isStretched,
    }),
    [
      colorScheme,
      hasBackdrop,
      hasSafeAreas,
      hasStageBackground,
      isCentered,
      isExpanded,
      isStretched,
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
  const fullscreenUrl = useCreateStateUrl(id, {
    back: true,
    path: `${entry?.id ?? ''}/all`,
    settings: changed,
    state,
  });
  const inlineRef = useRef<HTMLDivElement>(null);
  // (Its device's screen: its content's portal container, see `Screen`;
  // also its diagnostics', read as in it, e.g. its anchors' sizes.)
  const screenRef = useScreenRef(screenRefProp);
  const canExpand = useCanExpand(inlineRef);
  // (Its own: closed at first, not kept, nor shared with other views.)
  const [isCodeOpen, setIsCodeOpen] = useState(false);
  // (After rendering: rendering to a string resets Preact's hooks state.)
  const [code, setCode] = useState('');
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCode(
      isCodeOpen && !isRaw ? demoCode(children, hasInputGuards, setup) : '',
    );
  }, [children, hasInputGuards, isCodeOpen, isRaw, setup]);

  const isHidden = useMemo(() => {
    if (showId === undefined || showId === id) return false;

    return true;
  }, [id, showId]);

  const config = useGuards(isHidden, hasInputGuards, isRaw);

  useRawDocument(isRaw, isHidden, title);

  if (isHidden) return null;
  if (isRaw) return children;

  const container = (
    <div
      className="demo-container"
      data-inline={isInline ? '' : undefined}
    >
      <section className="demo-content">
        {isInline ? null : (
          <DemoHeader
            baseUiId={baseUiId}
            id={id}
            isBack={isBack}
            showId={showId}
            stateUrl={stateUrl}
            title={title}
          />
        )}
        <Stage
          hasWallpaper={hasWallpaper}
          screen={screen}
          screenRef={screenRef}
          settings={settings}
          stage={stage}
        >
          {children}
        </Stage>
      </section>
      <aside
        ref={config}
        className="demo-config"
      >
        <StageSettings
          canExpand={canExpand}
          defaults={defaults}
          isInline={isInline}
          setSettings={setSettings}
          settings={settings}
          stage={stage}
        />
        <Diagnostics screenRef={stage ? screenRef : undefined}>
          {diagnostics}
        </Diagnostics>
        {controls}
        <section className="demo-config-section">
          <details
            open={isCodeOpen}
            onToggle={({ currentTarget }) =>
              setIsCodeOpen((currentTarget as HTMLDetailsElement).open)
            }
          >
            <summary className="demo-config-heading">Code</summary>
            {isCodeOpen ? <CodeView code={code} /> : null}
          </details>
        </section>
        {log}
      </aside>
    </div>
  );

  return isInline ? (
    <InlineDemo
      canExpand={canExpand}
      containsOverscroll={containsOverscroll}
      fullscreenUrl={fullscreenUrl}
      inlineRef={inlineRef}
      isExpanded={settings.isExpanded}
      setIsExpanded={(isExpanded_) =>
        setSettings((settings_) => ({ ...settings_, isExpanded: isExpanded_ }))
      }
    >
      {container}
    </InlineDemo>
  ) : (
    container
  );
};
