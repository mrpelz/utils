import { Tabs as BaseTabs } from '@base-ui/react/tabs';
import { Properties } from 'csstype';
import { styled } from 'goober';
import { createContext, PointerEventHandler } from 'preact';
import { forwardRef } from 'preact/compat';
import { useCallback, useContext, useLayoutEffect, useRef } from 'preact/hooks';

import { css } from './utils.js';

// Source: Apple iOS 26 Figma (“Tab Bar - iPhone”, BG Context Dim/Bright),
// with the selected content color mapped to the app tint
// (`--color-ios-primary`, i.e. `systemBlue`); glass materials, vibrant content
// and selection colors are tokens in `styles.tsx`. The selection's transition
// duration comes from Framework7 `components/toolbar/toolbar-ios.less`
// (`.tab-link-highlight`), disabled opacity from Framework7
// `less/mixins.less` (`.disabled()`).
//
// Deviations:
// - Tab shape is a prop: capsule tabs have a preferred (shrinkable, not
//   fixed) width of 102px, down to a minimum of 54px (Figma: 102px, or filling
//   the bar with 4+ tabs); `width` is used as `flex-basis` is ignored for the
//   group's intrinsic size. Circle tabs (Figma: search) are 54px square. A
//   single capsule tab next to the search tab is 102px (Figma: 110px).
// - The bar's inline padding is always 32px (Figma: 28px with up to 3 tabs).
// - Nothing isolates blending (Figma: each group), as that would cut the
//   glass blur off from the content behind the bar; glass, indicator and tabs
//   stack by document order instead.
// - Each group positions its own selection (the indicator) on its active tab.
//   When the active tab leaves a group, its selection fades out in place; a
//   group gaining the active tab fades its selection in, so the selection
//   never travels between groups.
// - Figma's fill blend modes are applied as `mix-blend-mode` of separate
//   layers (blending with the blurred backdrop), each carrying the fill's
//   opacity.
// - The blur layer's own `filter: blur(10px)` and masking are omitted.
// - Figma's glass effect (a layer effect, missing from the CSS export) is
//   emulated as in Framework7 `less/mixins.less` (`.ios-glass()`: backdrop
//   `saturate(180%)` and `--f7-glass-shadow`, see `styles.tsx`).
// - Pressing a tab turns the selection into a glass lens that follows the
//   pointer and activates the closest tab on release, as in Framework7
//   `components/toolbar/tabbar-highlight.js` and `toolbar-ios.less`
//   (`.tab-link-highlight-pressed`); unlike Framework7 for all pointer types,
//   not only touch. The lens belongs to the list, so it moves (and can be
//   dragged) between groups, and is drawn above the tabs, as it has to be
//   above the groups' glass. While dragging, it follows the pointer without
//   a transition (Framework7: 300ms ease-out).
// - The browser's default focus ring is kept.

type Context = 'bright' | 'dim';

type Shape = 'capsule' | 'circle';

const contextVars = (context: Context) => css`
  --styled-tabbar-blur: var(--glass-ios-${context}-blur);
  --styled-tabbar-fill-bottom: var(--glass-ios-${context}-fill-bottom);
  --styled-tabbar-fill-bottom-blend: var(
    --glass-ios-${context}-fill-bottom-blend
  );
  --styled-tabbar-fill-middle: var(--glass-ios-${context}-fill-middle);
  --styled-tabbar-fill-top: var(--glass-ios-${context}-fill-top);
  --styled-tabbar-fill-top-blend: var(--glass-ios-${context}-fill-top-blend);
  --styled-tabbar-fill-opacity: var(--glass-ios-${context}-fill-opacity);
  --styled-tabbar-content: var(--glass-ios-${context}-content);
  --styled-tabbar-content-blend: var(--glass-ios-${context}-content-blend);
  --styled-tabbar-selection: var(--glass-ios-${context}-selection);
  --styled-tabbar-selection-blend: var(--glass-ios-${context}-selection-blend);
  --styled-tabbar-shadow: var(--glass-ios-${context}-shadow);
  --styled-tabbar-lens: var(--glass-ios-${context}-lens);
  --styled-tabbar-lens-shadow: var(--glass-ios-${context}-lens-shadow);
`;

const setProperties = (
  element: HTMLElement,
  properties: Record<string, string>,
) => {
  for (const [property, value] of Object.entries(properties)) {
    element.style.setProperty(property, value);
  }
};

const isTab = (element: Element): element is HTMLElement =>
  element instanceof HTMLElement && element.getAttribute('role') === 'tab';

const isActive = (element: HTMLElement) =>
  Object.hasOwn(element.dataset, 'active');

// Groups that had an active tab when their selection was last positioned.
const hadActiveTab = new WeakMap<HTMLElement, boolean>();

const setSelection = (
  group: HTMLElement,
  rect: DOMRect,
  { instant = false, left = rect.left } = {},
) => {
  const groupRect = group.getBoundingClientRect();

  if (instant) {
    group.style.setProperty('--styled-tabbar-selection-duration', '0s');
  }

  setProperties(group, {
    '--styled-tabbar-selection-height': `${rect.height}px`,
    '--styled-tabbar-selection-left': `${left - groupRect.left}px`,
    '--styled-tabbar-selection-top': `${rect.top - groupRect.top}px`,
    '--styled-tabbar-selection-width': `${rect.width}px`,
  });

  if (instant) {
    group.getBoundingClientRect();
    group.style.removeProperty('--styled-tabbar-selection-duration');
  }
};

// Positions a group's selection on its active tab and shows it; without an
// active tab, the selection fades out in place. A selection appearing in a
// group is placed instantly, so it does not travel in from elsewhere.
const updateSelection = (group: HTMLElement) => {
  const tab = [...group.children]
    .filter(isTab)
    .find((child) => isActive(child));
  const hadActive = hadActiveTab.get(group) ?? false;
  hadActiveTab.set(group, Boolean(tab));

  group.style.setProperty('--styled-tabbar-selection-opacity', tab ? '1' : '0');
  if (!tab) return;

  group.style.removeProperty('--styled-tabbar-pressed');

  setSelection(group, tab.getBoundingClientRect(), { instant: !hadActive });
};

// eslint-disable-next-line prettier/prettier
const StyledList = styled<typeof BaseTabs.List, TabBarListProps>(BaseTabs.List, forwardRef)`
  position: relative;
  display: flex;
  box-sizing: border-box;
  align-items: center;
  justify-content: center;
  padding: 16px 32px 32px;
  gap: 16px;
  touch-action: none;

  ${({ context }) =>
    context
      ? contextVars(context)
      : css`
          ${contextVars('bright')}

          @media (prefers-color-scheme: dark) {
            ${contextVars('dim')}
          }
        `}
`;

// Positioned by its center, so it stays under the pointer while its size
// transitions between tab shapes.
const Lens = styled('span')`
  position: absolute;
  top: 0;
  left: 0;
  width: var(--styled-tabbar-lens-width, 0);
  height: var(--styled-tabbar-lens-height, 0);
  border-radius: 100px;
  background-color: var(--styled-tabbar-lens);
  box-shadow: var(--styled-tabbar-lens-shadow);
  opacity: var(--styled-tabbar-pressed, 0);
  pointer-events: none;
  scale: calc(1 + 0.4 * var(--styled-tabbar-pressed, 0));
  transition-duration:
    var(--styled-tabbar-lens-move-duration, 300ms),
    var(--styled-tabbar-lens-size-duration, 300ms),
    var(--styled-tabbar-lens-size-duration, 300ms), 300ms, 300ms;
  transition-property: translate, width, height, opacity, scale;
  transition-timing-function: ease-out;
  translate: calc(var(--styled-tabbar-lens-x, 0px) - 50%)
    calc(var(--styled-tabbar-lens-y, 0px) - 50%);
`;

const getTabs = (list: HTMLElement) =>
  [...list.querySelectorAll('[role="tab"]')].filter(
    (tab): tab is HTMLElement =>
      tab instanceof HTMLElement && !Object.hasOwn(tab.dataset, 'disabled'),
  );

const getGroups = (list: HTMLElement) =>
  new Set(
    getTabs(list)
      .map(({ parentElement }) => parentElement)
      .filter((group): group is HTMLElement => group !== null),
  );

const setLens = (list: HTMLElement, rect: DOMRect, centerX: number) => {
  const listRect = list.getBoundingClientRect();

  setProperties(list, {
    '--styled-tabbar-lens-height': `${rect.height}px`,
    '--styled-tabbar-lens-width': `${rect.width}px`,
    '--styled-tabbar-lens-x': `${centerX - listRect.left - list.clientLeft + list.scrollLeft}px`,
    '--styled-tabbar-lens-y': `${rect.top + rect.height / 2 - listRect.top - list.clientTop + list.scrollTop}px`,
  });
};

// Moves the lens to the pointer, clamped to the list's tabs, and returns the
// closest tab (Framework7 `tabbar-highlight.js`, `setHighlightOnTouch`). The
// (hidden) selection of the closest tab's group follows the lens, so it
// settles from there on release.
const press = (list: HTMLElement, clientX: number) => {
  const tabs = getTabs(list);
  const rects = tabs.map((tab) => tab.getBoundingClientRect());
  const distances = rects.map((rect) =>
    Math.abs(rect.left + rect.width / 2 - clientX),
  );
  const index = distances.indexOf(Math.min(...distances));
  const tab = tabs[index];
  const rect = rects[index];
  if (!tab || !rect) return undefined;

  const centerX = Math.max(
    Math.min(...rects.map(({ left }) => left)) + rect.width / 2,
    Math.min(
      clientX,
      Math.max(...rects.map(({ right }) => right)) - rect.width / 2,
    ),
  );

  setLens(list, rect, centerX);

  const { parentElement: pressedGroup } = tab;

  for (const group of getGroups(list)) {
    if (group === pressedGroup) {
      // Only a group holding the active tab moves its selection; others place
      // it instantly, so it never travels in from a stale position.
      setSelection(group, rect, {
        instant: !hadActiveTab.get(group),
        left: centerX - rect.width / 2,
      });
    } else {
      updateSelection(group);
    }
  }

  return tab;
};

// Settles the lens on the chosen tab (if any) while it fades out. Groups take
// their final state right away, so the selection of a group losing the active
// tab does not reappear while the press ends: the chosen tab's group settles
// its selection from the lens position, all others fade out. They are
// reconciled on the next frame, in case the chosen tab is not activated.
const release = (list: HTMLElement, tab?: HTMLElement) => {
  list.style.removeProperty('--styled-tabbar-lens-move-duration');
  list.style.removeProperty('--styled-tabbar-pressed');

  const groups = getGroups(list);

  if (!tab) {
    for (const group of groups) updateSelection(group);
    return;
  }

  const rect = tab.getBoundingClientRect();
  setLens(list, rect, rect.left + rect.width / 2);

  for (const group of groups) {
    const chosen = group === tab.parentElement;
    const hadActive = hadActiveTab.get(group) ?? false;
    hadActiveTab.set(group, chosen);
    group.style.setProperty(
      '--styled-tabbar-selection-opacity',
      chosen ? '1' : '0',
    );

    if (chosen) {
      // A group gaining the active tab only fades its selection in.
      setSelection(group, rect, { instant: !hadActive });
    } else {
      // Keep the selection hidden like while pressed, so it only fades out.
      group.style.setProperty('--styled-tabbar-pressed', '1');
    }
  }

  requestAnimationFrame(() => {
    for (const group of groups) updateSelection(group);
  });
};

export type TabBarListProps = BaseTabs.List.Props & {
  /**
   * Brightness of the content behind the glass.
   * @default 'bright', or 'dim' in dark mode
   */
  context?: Context;
};

type Handler = PointerEventHandler<HTMLDivElement>;

/**
 * The tab bar, containing `TabBar.Group`s. Renders the glass lens shown
 * while a tab is pressed.
 */
const List = forwardRef<HTMLDivElement, TabBarListProps>(
  (
    {
      children,
      onLostPointerCapture,
      onPointerCancel,
      onPointerDown,
      onPointerMove,
      onPointerUp,
      ...props
    },
    ref,
  ) => {
    const pressRef = useRef<{
      clientX?: number;
      frame?: number;
      pointerId: number;
      tab?: HTMLElement;
    } | null>(null);

    const end = useCallback((list: HTMLElement, pointerId: number) => {
      const { current: pressed } = pressRef;
      if (pressed?.pointerId !== pointerId) return undefined;

      if (pressed.frame !== undefined) cancelAnimationFrame(pressed.frame);
      if (pressed.clientX !== undefined) {
        pressed.tab = press(list, pressed.clientX);
      }

      pressRef.current = null;
      return pressed;
    }, []);

    const handlePointerDown = useCallback<Handler>(
      (event) => {
        (onPointerDown as Handler | undefined)?.(event);
        if (event.button !== 0) return;
        if (!(event.target instanceof Element)) return;
        if (!event.target.closest('[role="tab"]')) return;

        const list = event.currentTarget;
        list.setPointerCapture(event.pointerId);

        // Place (and size) the lens at the pointer without a transition, then
        // let it follow without delay; only opacity and scale animate in.
        list.style.setProperty('--styled-tabbar-lens-move-duration', '0s');
        list.style.setProperty('--styled-tabbar-lens-size-duration', '0s');
        const tab = press(list, event.clientX);
        list.getBoundingClientRect();
        list.style.removeProperty('--styled-tabbar-lens-size-duration');
        list.style.setProperty('--styled-tabbar-pressed', '1');

        pressRef.current = { pointerId: event.pointerId, tab };
      },
      [onPointerDown],
    );

    const handlePointerMove = useCallback<Handler>(
      (event) => {
        (onPointerMove as Handler | undefined)?.(event);

        const { current: pressed } = pressRef;
        if (pressed?.pointerId !== event.pointerId) return;

        const list = event.currentTarget;
        pressed.clientX = event.clientX;

        pressed.frame ??= requestAnimationFrame(() => {
          pressed.frame = undefined;
          if (pressed.clientX === undefined) return;

          pressed.tab = press(list, pressed.clientX);
          pressed.clientX = undefined;
        });
      },
      [onPointerMove],
    );

    const handlePointerUp = useCallback<Handler>(
      (event) => {
        (onPointerUp as Handler | undefined)?.(event);

        const list = event.currentTarget;
        const pressed = end(list, event.pointerId);
        if (!pressed) return;

        release(list, pressed.tab);
        if (pressed.tab && !isActive(pressed.tab)) pressed.tab.click();
      },
      [end, onPointerUp],
    );

    const handlePointerCancel = useCallback<Handler>(
      (event) => {
        (onPointerCancel as Handler | undefined)?.(event);

        const list = event.currentTarget;
        if (end(list, event.pointerId)) release(list);
      },
      [end, onPointerCancel],
    );

    const handleLostPointerCapture = useCallback<Handler>(
      (event) => {
        (onLostPointerCapture as Handler | undefined)?.(event);

        const list = event.currentTarget;
        if (end(list, event.pointerId)) release(list);
      },
      [end, onLostPointerCapture],
    );

    return (
      <StyledList
        ref={ref}
        {...props}
        onLostPointerCapture={handleLostPointerCapture}
        onPointerCancel={handlePointerCancel}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        {children}
        <Lens aria-hidden="true" />
      </StyledList>
    );
  },
);

const glassLayer = css`
  position: absolute;
  border-radius: 1000px;
  inset: -4px;
  pointer-events: none;
`;

const GlassBlur = styled('span')`
  ${glassLayer}

  backdrop-filter: saturate(180%) blur(20px);
  background-color: var(--styled-tabbar-blur);
  opacity: 0.67;
`;

const GlassFillBottom = styled('span')`
  ${glassLayer}

  background-color: var(--styled-tabbar-fill-bottom);
  mix-blend-mode: var(--styled-tabbar-fill-bottom-blend);
  opacity: var(--styled-tabbar-fill-opacity);
`;

const GlassFillMiddle = styled('span')`
  ${glassLayer}

  background-color: var(--styled-tabbar-fill-middle);
  opacity: var(--styled-tabbar-fill-opacity);
`;

const GlassFillTop = styled('span')`
  ${glassLayer}

  background-color: var(--styled-tabbar-fill-top);
  mix-blend-mode: var(--styled-tabbar-fill-top-blend);
  opacity: var(--styled-tabbar-fill-opacity);
`;

const GlassEffect = styled('span')`
  ${glassLayer}

  box-shadow: var(--styled-tabbar-shadow);
`;

// Neighboring tabs overlap (Figma: negative spacing of 10px, 7.333px with 4
// and 5.5px with 5 tabs).
const StyledGroup = styled('div', forwardRef)`
  --styled-tabbar-overlap: 10px;

  position: relative;
  display: flex;
  min-width: 54px;
  min-height: 54px;
  box-sizing: border-box;
  flex: 0 1 auto;
  align-items: center;
  margin-inline: auto;

  &:has(> [role='tab'] ~ [role='tab'] ~ [role='tab'] ~ [role='tab']) {
    --styled-tabbar-overlap: 7.333px;
  }

  &:has(
    > [role='tab'] ~ [role='tab'] ~ [role='tab'] ~ [role='tab'] ~ [role='tab']
  ) {
    --styled-tabbar-overlap: 5.5px;
  }
`;

const GroupContext = createContext<{ shape?: Shape }>({});

export type TabBarGroupProps = React.ComponentProps<'div'> & {
  /** Default shape of the contained tabs. */
  shape?: Shape;
};

/**
 * A glass capsule of tabs, to be rendered inside `TabBar.List`. Its
 * `TabBar.Indicator` has to precede its tabs.
 */
const Group = forwardRef<HTMLDivElement, TabBarGroupProps>(
  ({ children, shape, ...props }, forwardedRef) => {
    const ref = useRef<HTMLDivElement | null>(null);

    const setRef = useCallback(
      (element: HTMLDivElement | null) => {
        ref.current = element;

        if (typeof forwardedRef === 'function') {
          forwardedRef(element);
        } else if (forwardedRef) {
          forwardedRef.current = element;
        }
      },
      [forwardedRef],
    );

    useLayoutEffect(() => {
      const { current: group } = ref;
      if (!group) return undefined;

      const update = () => updateSelection(group);
      update();

      const resizeObserver = new ResizeObserver(update);
      resizeObserver.observe(group);
      for (const child of group.children) resizeObserver.observe(child);

      const mutationObserver = new MutationObserver(update);
      mutationObserver.observe(group, {
        attributeFilter: ['data-active'],
        childList: true,
        subtree: true,
      });

      return () => {
        resizeObserver.disconnect();
        mutationObserver.disconnect();
      };
    }, []);

    const context = { shape };

    return (
      <GroupContext.Provider value={context}>
        <StyledGroup
          ref={setRef}
          {...props}
        >
          <GlassBlur aria-hidden="true" />
          <GlassFillBottom aria-hidden="true" />
          <GlassFillMiddle aria-hidden="true" />
          <GlassFillTop aria-hidden="true" />
          <GlassEffect aria-hidden="true" />
          {children}
        </StyledGroup>
      </GroupContext.Provider>
    );
  },
);

/**
 * The selection, to be rendered first inside each `TabBar.Group`, which
 * positions it on its active tab; hidden while pressed, when the list's lens
 * takes over (Framework7 `toolbar-ios.less`, `.tab-link-highlight`).
 */
const Indicator = styled(BaseTabs.Indicator, forwardRef)`
  position: absolute;
  top: var(--styled-tabbar-selection-top, 0);
  left: var(--styled-tabbar-selection-left, 0);
  width: var(--styled-tabbar-selection-width, 0);
  height: var(--styled-tabbar-selection-height, 0);
  border-radius: 100px;
  transition-duration: var(--styled-tabbar-selection-duration, 300ms);
  transition-property: top, left, width, height;

  /* Fades here, not on the indicator: opacity on the indicator would isolate
     the fill's blending, rendering its raw color while fading. */
  &::before {
    position: absolute;
    border-radius: inherit;
    background-color: var(--styled-tabbar-selection);
    content: '';
    inset: 0;
    mix-blend-mode: var(--styled-tabbar-selection-blend);
    opacity: calc(
      var(--styled-tabbar-selection-opacity, 0) *
        (1 - var(--styled-tabbar-pressed, 0))
    );
    transform: scale(calc(1 + 0.4 * var(--styled-tabbar-pressed, 0)));
    transition-duration: 300ms;
  }
`;

export type TabBarTabProps = BaseTabs.Tab.Props & {
  cursor?: Properties['cursor'];
  /** @default the group's shape, or 'capsule' */
  shape?: Shape;
};

// eslint-disable-next-line prettier/prettier
const StyledTab = styled<typeof BaseTabs.Tab, TabBarTabProps>(BaseTabs.Tab, forwardRef)`
  --styled-cursor: attr(
    cursor type(\<custom-ident\>),
    ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')}
  );

  position: relative;
  display: flex;
  width: 102px;
  min-width: 54px;
  min-height: 54px;
  box-sizing: border-box;
  flex: 0 1 auto;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 6px 8px 7px;
  border: 0;
  margin: 0;
  appearance: none;
  background-color: transparent;
  color: var(--styled-tabbar-content);
  font-family: inherit;
  gap: 1px;
  margin-inline-end: calc(var(--styled-tabbar-overlap) * -1);
  text-align: center;
  user-select: none;

  @media (hover: hover) {
    cursor: var(--styled-cursor);
  }

  ${({ shape }) =>
    shape === 'circle'
      ? css`
          width: auto;
          flex-shrink: 0;
          aspect-ratio: 1;
        `
      : undefined}

  &:last-child {
    margin-inline-end: 0;
  }

  &[data-active] {
    color: var(--color-ios-primary);
  }

  &[data-disabled] {
    opacity: 0.55;
  }
`;

const Tab = forwardRef<HTMLButtonElement, TabBarTabProps>(
  ({ shape, ...props }, ref) => {
    const group = useContext(GroupContext);

    return (
      <StyledTab
        ref={ref}
        {...props}
        shape={shape ?? group.shape}
      />
    );
  },
);

const Icon = styled('span', forwardRef)`
  display: flex;
  align-items: center;
  align-self: stretch;
  justify-content: center;
  font-feature-settings: 'ss16';
  font-size: 17px;
  font-weight: 400;
  line-height: 28px;
  mix-blend-mode: var(--styled-tabbar-content-blend);

  [data-active] > & {
    font-weight: 590;
    mix-blend-mode: normal;
  }
`;

const Label = styled('span', forwardRef)`
  overflow: hidden;
  min-width: 0;
  align-self: stretch;
  font-size: 10px;
  font-weight: 510;
  line-height: 12px;
  mix-blend-mode: var(--styled-tabbar-content-blend);
  text-align: center;
  text-overflow: ellipsis;
  white-space: nowrap;

  [data-active] > & {
    font-weight: 700;
    mix-blend-mode: normal;
  }
`;

export const TabBar = {
  ...BaseTabs,
  List,
  Group,
  Indicator,
  Tab,
  Icon,
  Label,
};
