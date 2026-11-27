import { useRender } from '@base-ui/react/use-render';
import {
  createContext,
  forwardRef,
  type MouseEvent,
  type Ref,
  type RefObject,
  useCallback,
  useContext,
  useEffect,
  useId,
  useImperativeHandle,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';

import { colorSchemeStyle, useGlassScheme } from '../glass/main.js';
import { iconOf, polyline } from '../grid/icons.js';
import {
  Grid,
  type GridItemLayoutChange,
  startWithFrame,
  useGridItem,
  useGridItemLayout,
} from '../grid/main.js';
import { ColorSchemeScope, useLocale } from '../settings/main.js';
import { Switch } from '../switch/main.js';
import { Symbol } from '../symbol/main.js';
import { cn, useForwardedRef, withStyle } from '../utils/main.js';
import type {
  CardActions,
  CardCornerButtonProps,
  CardOrientation,
  CardRootProps,
  CardSizes,
  CardSubtitleProps,
  CardSwitchProps,
  CardSymbolProps,
  CardTitleProps,
  CardTrendProps,
  CardValueProps,
} from './props.js';
import { CardContext, useGivenTint } from './shared.js';

// A card's own parts (see main.tsx): its root, its symbol, its switch,
// its title, value and subtitle, a trend, its corner buttons.

/** A card's copy layer and its setter (see `CardBlendScope`). */
type CardBlend = {
  layer: HTMLElement | null;
  setLayer: (layer: HTMLElement | null) => void;
};

/**
 * A layer over the card's content where its parts draw a copy of
 * themselves (`Card.Symbol`, `Card.CornerButton`): e.g. inside a slider's
 * fill filling the card, in the fill's color scheme, clipped by its edge
 * (see `Card.Slider`), registered by it (`setLayer`); the
 * root marked `data-card-blend` while there is one (its originals under
 * the fill, see style.css). None: no copies. Internal.
 */
export const CardBlendScope = createContext<CardBlend | undefined>(undefined);

/**
 * Its layer over its veil while editing (see `Root`): where its corner
 * buttons shown then are (see `CornerButton`), outside its inert frame.
 */
const CardEditLayer = createContext<HTMLElement | null>(null);

/** The tile's shape (its item's effective size): wide, horizontal. */
export const useCardOrientation = (): CardOrientation => {
  const item = useGridItem();
  if (!item) return 'horizontal';
  const [columns = '1', rows = '1'] = item.size.split('x');
  return columns === '*' || Number(columns) >= Number(rows)
    ? 'horizontal'
    : 'vertical';
};

/**
 * The sizes the library's kinds of cards support, for their items'
 * `supportedSizes`: a binary display or control (a state, a switch), a
 * numerical display (a value) or control (a slider: never square, so it
 * has a direction), a choice of a few (segments: across a row, taller,
 * upright, or 1x1 opening to choose), a summary (rows: never 1x1), a
 * progress (a pill), a run of stages (along a line: never 1x1, too narrow
 * for them).
 */
export const cardSizes: CardSizes = {
  binaryControl: ['1x1', '2x1'],
  binaryDisplay: ['1x1', '2x1'],
  choiceControl: [
    '1x1',
    '2x1',
    '3x1',
    '4x1',
    '1x2',
    '2x2',
    '3x2',
    '4x2',
    '1x3',
    '2x3',
    '1x4',
    '2x4',
  ],
  numericalControl: ['2x1', '3x1', '4x1', '1x2', '1x3'],
  numericalDisplay: ['1x1', '2x1', '2x2'],
  progressDisplay: ['1x1', '2x1', '3x1', '4x1', '2x2'],
  stagesDisplay: ['2x1', '3x1', '4x1', '2x2', '4x2'],
  summaryDisplay: ['2x1', '2x2', '3x2', '4x1', '4x2', '3x3', '4x3', '4x4'],
};

/** Its corner buttons' animations' id (see `useCornersFollowing`). */
const cornerId = 'uikit-card-corner';

/**
 * Its corner buttons following its corners as its tile gets to a new box
 * (see the top): laid out in its frame, at the size it's getting to, each
 * at its trailing or bottom edge moved by as much as its glass's edge is
 * off it, by its tile's timing (a translate added to any of its own).
 */
const useCornersFollowing = (rootRef: RefObject<HTMLElement | null>) => {
  useGridItemLayout({
    onAfterChange: ({ duration, easing, from, to }: GridItemLayoutChange) => {
      const root = rootRef.current;
      if (!root) return;
      const isRtl = getComputedStyle(root).direction === 'rtl';
      const across = isRtl ? to.width - from.width : from.width - to.width;
      const down = from.height - to.height;
      for (const button of root.querySelectorAll<HTMLElement>(
        // (Its copies too, over a slider's fill: on its glass, in the fill.)
        ':scope > .uikit-card-frame .uikit-card-corner-button',
      )) {
        for (const animation of button.getAnimations()) {
          if (animation.id === cornerId) animation.cancel();
        }
        // (Which edge it's at: by where it's laid out, in its frame.)
        const center = button.offsetLeft + button.offsetWidth / 2;
        const isAtEnd = center > to.width / 2 !== isRtl;
        const isAtBottom =
          button.offsetTop + button.offsetHeight / 2 > to.height / 2;
        const x = isAtEnd ? across : 0;
        const y = isAtBottom ? down : 0;
        if (x === 0 && y === 0) continue;
        // (With its tile: from the next frame, see Grid's reshape.ts.)
        startWithFrame(
          button.animate(
            [
              { translate: `${String(x)}px ${String(y)}px` },
              { translate: '0 0' },
            ],
            { composite: 'add', duration, easing, id: cornerId },
          ),
        );
      }
    },
  });
};

/**
 * How long a flashed card stays lit, and how long it fades back (see
 * style.css).
 */
const flashTime = 150;
const fadeTime = 500;

/**
 * The state of a switch in it (its layout's, see style.css): on, off, or
 * none (no switch), as it changes (its `data-checked`, Switch's), before it
 * paints.
 */
const useSwitchState = (rootRef: RefObject<HTMLElement | null>) => {
  const [state, setState] = useState<boolean | undefined>(undefined);
  useLayoutEffect(() => {
    const { current: root } = rootRef;
    if (!root) return undefined;
    const read = () => {
      const control = root.querySelector<HTMLElement>(
        ':scope > .uikit-card-frame > .uikit-card-layout > .uikit-switch-root',
      );
      setState(control ? Object.hasOwn(control.dataset, 'checked') : undefined);
    };
    read();
    const observer = new MutationObserver(read);
    observer.observe(root, {
      attributeFilter: ['data-checked'],
      childList: true,
      subtree: true,
    });
    return () => observer.disconnect();
  }, [rootRef]);
  return state;
};

/**
 * A card flashed (by a press on a momentary one, or its `actionsRef`'s
 * `flash`): lit as if active (`data-flashing`) for a moment, then fading
 * back (`data-fading`, see style.css); flashed again meanwhile, lit as long
 * again.
 */
const useFlash = (
  rootRef: RefObject<HTMLElement | null>,
  actionsRef: RefObject<CardActions | null> | undefined,
) => {
  const timers = useRef([0, 0]);
  const flash = useCallback(() => {
    const root = rootRef.current;
    if (!root) return;
    for (const timer of timers.current) clearTimeout(timer);
    delete root.dataset.fading;
    root.dataset.flashing = '';
    timers.current[0] = window.setTimeout(() => {
      delete root.dataset.flashing;
      root.dataset.fading = '';
      timers.current[1] = window.setTimeout(() => {
        delete root.dataset.fading;
      }, fadeTime);
    }, flashTime);
  }, [rootRef]);
  useImperativeHandle(
    // (None given: nothing set; typed as one for Preact's types.)
    actionsRef as Ref<CardActions>,
    () => ({ flash }),
    [flash],
  );
  useEffect(
    () => () => {
      for (const timer of timers.current) clearTimeout(timer);
    },
    [],
  );
  return flash;
};

/**
 * The card: its glass, its parts on it; bright while `active` (or a switch
 * in it is on); pressable as a whole with an `onClick` (its feedback, see
 * style.css); in a grid's tile (its item's), inert and veiled while
 * editing (see the top).
 */
const Root = forwardRef<HTMLDivElement, CardRootProps>(
  (
    {
      actionsRef,
      active,
      children,
      className,
      context,
      momentary = false,
      onClick,
      render,
      style,
      ...props
    },
    forwardedRef,
  ) => {
    const item = useGridItem();
    const isEditing = item?.editing === true;
    const ref = useForwardedRef(forwardedRef);
    useCornersFollowing(ref);
    const flash = useFlash(ref, actionsRef);
    // Switchable (`active` given, or a switch in it): on, lit; off, dark
    // glass (in both schemes: its luminance telling which); else its
    // glass's tone's (see Glass); none while editing (its veil, and its
    // grid's controls on it, the page's, see style.css).
    const switchState = useSwitchState(ref);
    const state = active ?? switchState;
    const toned = useGlassScheme(ref, context);
    const schemeOfState = state ? 'light' : 'dark';
    const stated = state === undefined ? toned : schemeOfState;
    const scheme = isEditing ? undefined : stated;
    // (A layer its parts draw their copies in, registered by what fills
    // it, see `CardBlendScope`.)
    const [blendLayer, setBlendLayer] = useState<HTMLElement | null>(null);
    // (Editing: a layer over its veil, for its corner buttons shown then;
    // see `CornerButton`.)
    const [editLayer, setEditLayer] = useState<HTMLElement | null>(null);
    // (Its title's id, for its parts named by it, see `Title`.)
    const [titleId, setTitleId] = useState<string | undefined>(undefined);
    const card = useMemo(() => ({ setTitleId, titleId }), [titleId]);
    const blend = useMemo(
      () => ({ layer: blendLayer, setLayer: setBlendLayer }),
      [blendLayer],
    );
    // (Editing: not pressed, its presses the grid's.)
    const flashed =
      momentary && onClick
        ? (event: MouseEvent<HTMLDivElement>) => {
            flash();
            onClick(event);
          }
        : onClick;
    const pressed = isEditing ? undefined : flashed;
    return useRender({
      defaultTagName: 'div',
      props: {
        ...props,
        // (Its parts on a layout of its own, in a frame: what its size
        // queries ask, see style.css.)
        children: (
          <ColorSchemeScope colorScheme={scheme}>
            {/* (Its colors known (its glass, lit or not): its parts not
                sampled.) */}
            <CardContext.Provider value={card}>
              <CardBlendScope.Provider value={blend}>
                <CardEditLayer.Provider value={isEditing ? editLayer : null}>
                  {/* (Editing: what's in it inert, see the top; its corner
                    buttons shown then over it, in its edit layer.) */}
                  <div
                    className="uikit-card-frame"
                    inert={isEditing || undefined}
                  >
                    <div className="uikit-card-layout">{children}</div>
                  </div>
                  {isEditing ? (
                    <div
                      ref={setEditLayer}
                      className="uikit-card-edit-layer"
                    />
                  ) : null}
                </CardEditLayer.Provider>
              </CardBlendScope.Provider>
            </CardContext.Provider>
          </ColorSchemeScope>
        ),
        className: cn(
          'uikit-card-root uikit-glass-medium uikit-glass-panel',
          className,
        ),
        'data-active': state === true ? '' : undefined,
        // (Its `active` given: its state, whatever a switch in it says
        // (e.g. a dimmer's, never lit), see style.css.)
        'data-active-given': active === undefined ? undefined : '',
        'data-card-blend': blendLayer ? '' : undefined,
        'data-card-part': 'root',
        'data-color-scheme': scheme,
        'data-momentary': momentary ? '' : undefined,
        // (Pressed as a whole: its feedback, see style.css.)
        'data-pressable': onClick ? '' : undefined,
        'data-editing': isEditing ? '' : undefined,
        onClick: pressed,
        style: withStyle(colorSchemeStyle(scheme), style),
      },
      ref,
      render,
    });
  },
);

/**
 * Its symbol (e.g. a `Symbol`), at its top leading corner: on (its card lit,
 * or its own `active`), in its tint, its `Symbol`'s emphasized icon (e.g.
 * filled) shown; else its icon (e.g. outlined). Over a slider's fill (see
 * `CardBlendScope`): in its text's color, drawn again in the
 * fill, its emphasis on both.
 */
const CardSymbol = forwardRef<HTMLSpanElement, CardSymbolProps>(
  (
    { active = false, children, className, render, style, tint, ...props },
    ref,
  ) => {
    const blendLayer = useContext(CardBlendScope)?.layer ?? null;
    const givenTint = useGivenTint(tint);
    const symbol = useRender({
      defaultTagName: 'span',
      props: {
        ...props,
        children,
        className: cn('uikit-card-symbol', className),
        'data-active': active ? '' : undefined,
        'data-card-part': 'symbol',
        style: withStyle({ '--uikit-card-symbol-tint': givenTint }, style),
      },
      ref,
      render,
    });
    return (
      <>
        {symbol}
        {blendLayer
          ? createPortal(
              <span
                className={cn('uikit-card-symbol', className)}
                data-active={active ? '' : undefined}
                data-card-copy=""
              >
                {children}
              </span>,
              blendLayer,
            )
          : null}
      </>
    );
  },
);

/**
 * Its switch (a `Switch.Root` with its thumb): its top trailing corner, the
 * card's state (on, lit), on in the card's tint (`tint`; see style.css: on
 * a slider's fill, or in a card never lit, a darker shade of it). A part of
 * the card's (moved with its other parts as its tile changes, see
 * `useGridItemLayout`).
 */
const CardSwitch = forwardRef<HTMLSpanElement, CardSwitchProps>(
  ({ className, style, tint, ...props }, ref) => {
    const givenTint = useGivenTint(tint);
    return (
      <Switch.Root
        ref={ref}
        {...props}
        className={cn('uikit-card-switch', className)}
        data-card-part="switch"
        style={withStyle({ '--uikit-card-switch-tint': givenTint }, style)}
      >
        <Switch.Thumb />
      </Switch.Root>
    );
  },
);

/**
 * What it is (e.g. a device's name), above its value; what its parts are
 * named by (its id, its own or one of its card's, told the card).
 */
const Title = forwardRef<HTMLSpanElement, CardTitleProps>(
  ({ className, id, render, ...props }, ref) => {
    const generatedId = useId();
    const ownId = (typeof id === 'string' ? id : undefined) ?? generatedId;
    const setTitleId = useContext(CardContext)?.setTitleId;
    useLayoutEffect(() => {
      setTitleId?.(ownId);
      return () => setTitleId?.(undefined);
    }, [ownId, setTitleId]);
    return useRender({
      defaultTagName: 'span',
      props: {
        ...props,
        className: cn('uikit-card-title', className),
        'data-card-part': 'title',
        id: ownId,
      },
      ref,
      render,
    });
  },
);

/**
 * Its value: a number formatted as the app says (`format`, `locale`:
 * `Intl.NumberFormat`'s), what's given after it (e.g. a `Trend`); or,
 * without a number, what's given instead (e.g. a state).
 */
const Value = forwardRef<HTMLSpanElement, CardValueProps>(
  (
    { children, className, format, locale: ownLocale, render, value, ...props },
    ref,
  ) => {
    const locale = useLocale(ownLocale);
    return useRender({
      defaultTagName: 'span',
      props: {
        ...props,
        // (A number, and what's given after it (e.g. a `Trend`); none,
        // what's given.)
        children:
          value === undefined ? (
            children
          ) : (
            <>
              {new Intl.NumberFormat(locale, format).format(value)}
              {children}
            </>
          ),
        className: cn('uikit-card-value', className),
        'data-card-part': 'value',
      },
      ref,
      render,
    });
  },
);

/**
 * Its subtitle: more words under its title (e.g. a program's), small, in
 * its secondary text color; where there's room for them (in a tile a row
 * tall beside a bar, stages or channels, none: see the CSS).
 */
const Subtitle = forwardRef<HTMLSpanElement, CardSubtitleProps>(
  ({ className, render, ...props }, ref) =>
    useRender({
      defaultTagName: 'span',
      props: {
        ...props,
        className: cn('uikit-card-subtitle', className),
        'data-card-part': 'subtitle',
      },
      ref,
      render,
    }),
);

/** A trend's arrow (see `Trend`): pointing ahead, turned by its angle. */
const trendIcon = iconOf(
  'card.trend',
  polyline([-4.5, 0], [4.5, 0]) + polyline([0.5, -4], [4.5, 0], [0.5, 4]),
);

/** A trend's words, by its angle (see `Trend`). */
const trendOf = (angle: number) => {
  if (angle > 10) return 'rising';
  return angle < -10 ? 'falling' : 'steady';
};

/**
 * A value's trend (in its `Value`, after its number): an arrow pointing up
 * as steeply as it rises (`angle`, -90 to 90 degrees: 0 steady), named for
 * assistive technology. It turns to a new angle by its own transform.
 */
const Trend = forwardRef<HTMLSpanElement, CardTrendProps>(
  ({ angle, className, render, style, ...props }, ref) => {
    const clamped = Math.max(-90, Math.min(90, angle));
    return useRender({
      defaultTagName: 'span',
      props: {
        'aria-label': trendOf(clamped),
        role: 'img',
        ...props,
        children: <Symbol icon={trendIcon} />,
        className: cn('uikit-card-trend', className),
        'data-card-part': 'trend',
        style: withStyle({ '--uikit-card-trend': String(clamped) }, style),
      },
      ref,
      render,
    });
  },
);

/**
 * A button in its corner (see `Grid.CornerButton`): shown while its grid
 * isn't editing (faded out, inert, while it is), or while it is too, or
 * then only (`whileEditing`: over its veil then); and as `visible` says. A
 * press on it is its own, not the card's (e.g. not toggling a switch in
 * it, see `forwardClick`).
 */
const CornerButton = forwardRef<HTMLButtonElement, CardCornerButtonProps>(
  (
    {
      className,
      corner,
      icon,
      mirrored,
      onClick,
      visible = true,
      whileEditing = 'hide',
      ...props
    },
    ref,
  ) => {
    // (Over a slider's fill (see `CardBlendScope`): pressed, but
    // drawn by its copies, one on its glass, under the fill, one in it.)
    const blendLayer = useContext(CardBlendScope)?.layer ?? null;
    // (Shown while editing (see `whileEditing`): over its card's veil, in
    // its edit layer, outside its inert frame.)
    const editLayer = useContext(CardEditLayer);
    const isOnEditLayer =
      editLayer !== null && visible && whileEditing !== 'hide';
    const copy = (
      <Grid.CornerButton
        aria-hidden
        inert
        className={cn('uikit-card-corner-button', className)}
        corner={corner}
        data-card-copy=""
        icon={icon}
        mirrored={mirrored}
        render={<span />}
        visible={visible}
        whileEditing={whileEditing}
      />
    );
    const button = (
      <Grid.CornerButton
        ref={ref}
        className={cn('uikit-card-corner-button', className)}
        corner={corner}
        data-card-part="corner-button"
        icon={icon}
        mirrored={mirrored}
        visible={visible}
        whileEditing={whileEditing}
        {...props}
        onClick={(event: MouseEvent<HTMLButtonElement>) => {
          event.stopPropagation();
          onClick?.(event);
        }}
      />
    );
    return (
      <>
        {isOnEditLayer ? createPortal(button, editLayer) : button}
        {blendLayer ? copy : null}
        {blendLayer ? createPortal(copy, blendLayer) : null}
      </>
    );
  },
);

export {
  CardSwitch,
  CardSymbol,
  CornerButton,
  Root,
  Subtitle,
  Title,
  Trend,
  Value,
};
