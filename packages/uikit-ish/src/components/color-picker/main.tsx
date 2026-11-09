import '../action-sheet/style.css';
import '../button/style.css';
import '../list/style.css';
import '../menu/style.css';
import '../page-control/style.css';
import '../segmented/style.css';
import './style.css';

import type { RadioGroup as BaseRadioGroup } from '@base-ui/react/radio-group';
import { Slider as BaseSlider } from '@base-ui/react/slider';
import { useRender } from '@base-ui/react/use-render';
import {
  Children,
  cloneElement,
  ComponentProps,
  createContext,
  CSSProperties,
  FocusEvent,
  forwardRef,
  Fragment,
  FunctionComponent,
  isValidElement,
  KeyboardEvent,
  MouseEvent,
  PointerEvent,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { ActionSheet } from '../action-sheet/main.js';
import { Button } from '../button/main.js';
import { List } from '../list/main.js';
import { Menu } from '../menu/main.js';
import { PageControl } from '../page-control/main.js';
import { Segmented } from '../segmented/main.js';
import {
  Checkmark,
  cn,
  useForwardedRef,
  useTouchHold,
  withStyle,
} from '../utils/main.js';
import { Viewport } from '../viewport/main.js';
import { codeGroups, type ColorCode, parseCssColor } from './color.js';
import { cssNamedColors } from './named-colors.js';
import type {
  ColorPickerChangeEventDetails,
  ColorPickerCodeCopyProps,
  ColorPickerCodeProps,
  ColorPickerEyedropperProps,
  ColorPickerModeProps,
  ColorPickerModesProps,
  ColorPickerNamedColorProps,
  ColorPickerNamedProps,
  ColorPickerPanelProps,
  ColorPickerRootProps,
  ColorPickerSavedColorsChangeEventDetails,
  ColorPickerSlidersModel,
  ColorPickerSlidersProps,
  ColorPickerSwatchesProps,
  ColorPickerSystemColorsProps,
  ColorPickerViewProps,
  ColorWellProps,
  EyeDropperApi,
  NamedIndexEntry,
  PanelState,
  PickerState,
  Rgba,
} from './props.js';

export type {
  ColorPickerChangeEventDetails,
  ColorPickerCodeCopyProps,
  ColorPickerCodeProps,
  ColorPickerEyedropperProps,
  ColorPickerModeProps,
  ColorPickerModesProps,
  ColorPickerNamedColorProps,
  ColorPickerNamedProps,
  ColorPickerPanelProps,
  ColorPickerRootProps,
  ColorPickerSavedColorsChangeEventDetails,
  ColorPickerSlidersModel,
  ColorPickerSlidersProps,
  ColorPickerSlidersRange,
  ColorPickerSwatchesProps,
  ColorPickerSystemColorsProps,
  ColorPickerViewProps,
  ColorWellProps,
} from './props.js';

// A color picker and a color well, in the app's popover (a regular width)
// or sheet (compact), its header the app's (a `Toolbar`: the eyedropper,
// “Colors”, close; in the popup's header, `Popover.Header` or
// `Sheet.Header`, the panel scrolling under it, behind its edge effect):
// - a segmented control (Grid, Spectrum, Sliders), 24px above the view;
// - Grid: 12 by 10 swatches (a gray row, then hues by lightness), its
//   corners 18px, the selected one outlined white (3px);
// - Spectrum: hues across, light to dark down (white at the top, pure hues
//   halfway, black at the bottom), its corners 18px, the color ringed;
// - Sliders: red, green and blue (0 to 255; or 0 to 100%, see `Sliders`),
//   each a channel's row (see `ChannelRow`): its title (all caps), a slider
//   mixing from the color (the channel along its range), and its value,
//   typed;
// - Each channel's row kept above the keyboard as its field's typed into
//   (a `Viewport.KeyboardAccessory`; in a `Viewport.Provider`);
// - Opacity (optional: its part, `Opacity`), a channel's row too: the
//   color fading in over a checkerboard, its knob the color (translucent),
//   its value a percentage;
// - the color (82px, 18px corners) beside the saved colors (30px dots, 25px
//   apart, rows 22px apart; the color's ringed white, 2px, 4px in) and an
//   add button (on the system fill, its “+” the label's color).
// A color well (`ColorPicker.Well`): a 28px (or 36px) disk of hues around
// white; with a color, the hues as a ring around it.
//
// Also:
// - Colors are hex strings (`#rrggbb`, `#rrggbbaa` with opacity; without
//   opacity, always opaque).
// - The eyedropper (`ColorPicker.Eyedropper`) is the browser's
//   (`EyeDropper`; not where it has none, e.g. Safari).
// - The system's color picker (`ColorPicker.SystemColors`) is a color
//   input's (over its button, pressed itself: on iOS, nothing else opens
//   it; with the opacity rendered, its alpha too where the input has one,
//   e.g. Safari; else its colors opaque, the opacity kept).
// - Saved colors are deleted by their menu (a secondary click: right click,
//   long press).

// eslint-disable-next-line unicorn/no-unnecessary-parameters
const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

/** A hex color (#rgb, #rrggbb, #rrggbbaa) as channels (0–255, alpha 0–1). */
export const parseColor = (hex: string): Rgba => {
  let digits = hex.trim().replace(/^#/u, '');
  if (digits.length <= 4) {
    digits = [...digits].map((digit) => digit + digit).join('');
  }
  const channel = (index: number) =>
    Number.parseInt(digits.slice(index, index + 2), 16);
  const [r = 0, g = 0, b = 0] = [0, 2, 4].map((index) => channel(index) || 0);

  return {
    a: digits.length >= 8 ? channel(6) / 255 : 1,
    b,
    g,
    r,
  };
};

const toHex = (value: number) =>
  Math.round(clamp(value, 0, 255))
    .toString(16)
    .padStart(2, '0');

/** Channels as a hex color (#rrggbb, or #rrggbbaa if not opaque). */
export const formatColor = ({ a, b, g, r }: Rgba): string =>
  `#${toHex(r)}${toHex(g)}${toHex(b)}${a < 1 ? toHex(a * 255) : ''}`.toUpperCase();

// HSL (hue 0–360, saturation and lightness 0–1), for the spectrum.

const fromHsl = (h: number, s: number, l: number) => {
  const k = (n: number) => (n + h / 30) % 12;
  const amount = s * Math.min(l, 1 - l);
  const f = (n: number) =>
    255 * (l - amount * Math.max(-1, Math.min(k(n) - 3, 9 - k(n), 1)));
  return { b: f(4), g: f(8), r: f(0) };
};

const toHsl = ({ b, g, r }: Rgba) => {
  const [red, green, blue] = [r / 255, g / 255, b / 255];
  const max = Math.max(red, green, blue);
  const min = Math.min(red, green, blue);
  const l = (max + min) / 2;
  const d = max - min;
  if (d === 0) return { h: 0, l, s: 0 };

  const s = d / (1 - Math.abs(2 * l - 1));
  let h: number;
  if (max === red) h = ((green - blue) / d) % 6;
  else if (max === green) h = (blue - red) / d + 2;
  else h = (red - green) / d + 4;
  return { h: (h * 60 + 360) % 360, l, s };
};

/** The grid: a gray row, then hues by lightness. */
const grid = [
  '#FEFFFE #EBEBEB #D6D6D6 #C2C2C2 #ADADAD #999999 #858585 #707070 #5C5C5C #474747 #333333 #000000',
  '#00374A #011D57 #11053B #2E063D #3C071B #5C0701 #5A1C00 #583300 #563D00 #666100 #4F5504 #263E0F',
  '#004D65 #012F7B #1A0A52 #450D59 #551029 #831100 #7B2900 #7A4A00 #785800 #8D8602 #6F760A #38571A',
  '#016E8F #0042A9 #2C0977 #61187C #791A3D #B51A00 #AD3E00 #A96800 #A67B01 #C4BC00 #9BA50E #4E7A27',
  '#008CB4 #0056D6 #371A94 #7A219E #99244F #E22400 #DA5100 #D38301 #D19D01 #F5EC00 #C3D117 #669D34',
  '#00A1D8 #0061FD #4D22B2 #982ABC #B92D5D #FF4015 #FF6A00 #FFAB01 #FCC700 #FEFB41 #D9EC37 #76BB40',
  '#01C7FC #3A87FD #5E30EB #BE38F3 #E63B7A #FE6250 #FE8648 #FEB43F #FECB3E #FFF76B #E4EF65 #96D35F',
  '#52D6FC #74A7FF #864FFD #D357FE #EE719E #FF8C82 #FEA57D #FEC777 #FED977 #FFF994 #EAF28F #B1DD8B',
  '#93E3FC #A7C6FF #B18CFE #E292FE #F4A4C0 #FFB5AF #FFC5AB #FED9A8 #FDE4A8 #FFFBB9 #F1F7B7 #CDE8B5',
  '#CBF0FF #D2E2FE #D8C9FE #EFCAFE #F9D3E0 #FFDAD8 #FFE2D6 #FEECD4 #FEF1D5 #FDFBDD #F6FADB #DEEED4',
].map((row) => row.split(' '));

/** The default saved colors. */
export const defaultSavedColors = [
  '#000000',
  '#007AFF',
  '#34C759',
  '#FFCC00',
  '#FF3B30',
  '#7AC6F5',
  '#AF52DE',
  '#5856D6',
  '#FF2D55',
];

const sameColor = (a: Rgba, b: Rgba) =>
  Math.round(a.r) === Math.round(b.r) &&
  Math.round(a.g) === Math.round(b.g) &&
  Math.round(a.b) === Math.round(b.b);

const unregister = () => undefined;

const PickerContext = createContext<PickerState>({
  color: { a: 1, b: 0, g: 0, r: 0 },
  hasOpacity: false,
  registerOpacity: () => unregister,
  setColor: () => undefined,
});

/**
 * Its modes (see `Root`): the one shown, chosen by its `Modes`; the first
 * `Mode` (or `View`) unless a default is given.
 */
const PanelContext = createContext<PanelState>({
  isGridHeight: false,
  mode: null,
  registerGridHeight: () => unregister,
  registerMode: () => undefined,
  setMode: () => undefined,
});

/**
 * A color picker: its color and its mode, for its parts (`Modes`,
 * `Panel`, `Eyedropper`, anywhere in it), in the app's popover or sheet.
 * Its element (`render`) may be the popover's or the sheet's popup, so its
 * toolbar (and, in a sheet, its modes' control) can be in the popup's
 * header (`Popover.Header`, `Sheet.Header`), its panel scrolling under it.
 */
const Root = forwardRef<HTMLDivElement, ColorPickerRootProps>(
  (
    {
      className,
      defaultMode,
      defaultValue = '#000000',
      mode: modeProp,
      onModeChange,
      onValueChange,
      render,
      style,
      value,
      ...props
    },
    ref,
  ) => {
    const [own, setOwn] = useState(defaultValue);
    // Its `Opacity`s rendered: without one, the color opaque (its alpha,
    // if given one, dropped).
    const [opacities, setOpacities] = useState(0);
    const hasOpacity = opacities > 0;
    const parsed = parseColor(value ?? own);
    const color = hasOpacity ? parsed : { ...parsed, a: 1 };
    const registerOpacity = useCallback(() => {
      setOpacities((count) => count + 1);
      return () => setOpacities((count) => count - 1);
    }, []);
    const state = useMemo(
      () => ({
        color,
        hasOpacity,
        registerOpacity,
        // Uncontrolled: its own state; controlled, only the app's `value`.
        setColor: (next: Rgba, details: ColorPickerChangeEventDetails) => {
          const hex = formatColor(hasOpacity ? next : { ...next, a: 1 });
          if (value === undefined) setOwn(hex);
          onValueChange?.(hex, details);
        },
      }),
      // (By its hex value.)
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [value ?? own, onValueChange, hasOpacity],
    );

    const [ownMode, setOwnMode] = useState(defaultMode);
    // (Without a default: the first mode, as it's rendered.)
    const [firstMode, setFirstMode] = useState<string | undefined>();
    // (Controlled from the start: none yet, before its first mode is
    // known, not undefined, which would leave its control uncontrolled.)
    const mode = modeProp ?? ownMode ?? firstMode ?? null;
    // Its views of the grid's height (a `Grid`, a `Spectrum`): with one,
    // all as high (see `View`).
    const [gridHeights, setGridHeights] = useState(0);
    const registerGridHeight = useCallback(() => {
      setGridHeights((count) => count + 1);
      return () => setGridHeights((count) => count - 1);
    }, []);
    const modes = useMemo(
      () => ({
        isGridHeight: gridHeights > 0,
        mode,
        registerGridHeight,
        registerMode: (next: string) => setFirstMode((first) => first ?? next),
        // Uncontrolled: its own state; controlled, only the app's `mode`.
        setMode: (next: string, details: BaseRadioGroup.ChangeEventDetails) => {
          if (modeProp === undefined) setOwnMode(next);
          onModeChange?.(next, details);
        },
      }),
      [gridHeights, mode, modeProp, onModeChange, registerGridHeight],
    );

    const element = useRender({
      defaultTagName: 'div',
      props: {
        style: withStyle(
          {
            // (For its parts.)
            '--uikit-color-picker-color': formatColor(color),
            '--uikit-color-picker-color-opaque': formatColor({
              ...color,
              a: 1,
            }),
          },
          style,
        ),
        ...props,
        className: cn('uikit-color-picker-root', className),
        'data-color-picker-part': 'root',
      },
      ref,
      render,
    });

    return (
      <PickerContext.Provider value={state}>
        <PanelContext.Provider value={modes}>{element}</PanelContext.Provider>
      </PickerContext.Provider>
    );
  },
);

/**
 * Its panel: its modes' control (`Modes`, unless elsewhere, e.g. a sheet's
 * header) and views (a `View` each, paired with its `Mode` by their
 * `value`s), the opacity, the color and the saved colors, as composed (in
 * its padding, its parts spaced).
 */
const Panel = forwardRef<HTMLDivElement, ColorPickerPanelProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      {...props}
      className={cn('uikit-color-picker-panel', className)}
      data-color-picker-part="panel"
    />
  ),
);

/**
 * Its modes' control: a segmented control (its `Mode`s, its highlight),
 * choosing the `View` shown; 24px above it (in its panel, or at the end of
 * a header).
 */
const Modes = forwardRef<HTMLDivElement, ColorPickerModesProps>(
  ({ children, ...props }, ref) => {
    const { mode, setMode } = useContext(PanelContext);

    return (
      <Segmented.Root
        ref={ref}
        aria-label="Mode"
        // (Its modes, however many, scrolled when they don't fit.)
        overflow="scroll"
        {...props}
        className={cn('uikit-color-picker-modes', props.className)}
        value={mode}
        onValueChange={(next, details) => setMode(String(next), details)}
      >
        {children}
        <Segmented.Highlight />
      </Segmented.Root>
    );
  },
);

/** A mode, in its `Modes`: its label, choosing its `View` (by `value`). */
const Mode = forwardRef<HTMLElement, ColorPickerModeProps>(
  ({ value, ...props }, ref) => {
    const { registerMode } = useContext(PanelContext);
    useLayoutEffect(() => registerMode(value), [registerMode, value]);

    return (
      <Segmented.Item
        ref={ref}
        value={value}
        {...props}
      />
    );
  },
);

/** Swatches in rows (a gray row, then hues by lightness), its corners 18px. */
const Grid = forwardRef<HTMLDivElement, ComponentProps<'div'>>(
  ({ className, ...props }, ref) => {
    const { color, setColor } = useContext(PickerContext);

    return (
      <div
        ref={ref}
        aria-label="Grid"
        role="group"
        {...props}
        className={cn('uikit-color-picker-grid', className)}
        data-color-picker-part="grid"
      >
        {grid.flatMap((row) =>
          row.map((hex) => {
            const swatch = parseColor(hex);
            return (
              <button
                key={hex}
                aria-label={hex}
                aria-pressed={sameColor(swatch, color)}
                style={{ backgroundColor: hex }}
                type="button"
                onClick={(event: MouseEvent<HTMLButtonElement>) =>
                  setColor({ ...swatch, a: color.a }, { event, reason: 'grid' })
                }
              />
            );
          }),
        )}
      </div>
    );
  },
);

/** Hues across, white to black down, the color ringed; its corners 18px. */
const Spectrum = forwardRef<HTMLDivElement, ComponentProps<'div'>>(
  ({ className, ...props }, ref) => {
    const { color, setColor } = useContext(PickerContext);
    const { h, l } = toHsl(color);

    const pick = (event: PointerEvent<HTMLDivElement>) => {
      const { height, left, top, width } =
        event.currentTarget.getBoundingClientRect();
      const hue = clamp((event.clientX - left) / width, 0, 1) * 360;
      const lightness = 1 - clamp((event.clientY - top) / height, 0, 1);
      setColor(
        { ...fromHsl(hue % 360, 1, lightness), a: color.a },
        { event, reason: 'spectrum' },
      );
    };

    const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
      event.currentTarget.setPointerCapture(event.pointerId);
      pick(event);
    };

    const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
      if (!event.currentTarget.hasPointerCapture(event.pointerId)) return;
      pick(event);
    };

    // Arrow keys: hue across (5°), lightness down (5%).
    const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
      const moves: Record<string, [number, number]> = {
        ArrowDown: [0, -0.05],
        ArrowLeft: [-5, 0],
        ArrowRight: [5, 0],
        ArrowUp: [0, 0.05],
      };
      const move = moves[event.key];
      if (!move) return;
      event.preventDefault();
      setColor(
        {
          ...fromHsl((h + move[0] + 360) % 360, 1, clamp(l + move[1], 0, 1)),
          a: color.a,
        },
        { event, reason: 'spectrum' },
      );
    };

    return (
      <div
        ref={ref}
        aria-label="Spectrum"
        aria-valuetext={formatColor({ ...color, a: 1 })}
        role="slider"
        tabIndex={0}
        {...props}
        className={cn('uikit-color-picker-spectrum', className)}
        // Its drags don't swipe a sheet (or drawer) away.
        data-base-ui-swipe-ignore=""
        data-color-picker-part="spectrum"
        onKeyDown={handleKeyDown}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
      >
        <span
          style={{
            backgroundColor: formatColor({ ...color, a: 1 }),
            left: `${String((h / 360) * 100)}%`,
            top: `${String((1 - l) * 100)}%`,
          }}
        />
      </div>
    );
  },
);

/**
 * A mode's view (by `value`, its `Mode`'s): shown while it's chosen. With a
 * view of the grid's height (a `Grid` or `Spectrum` in it) among them, all
 * as high (so a popover doesn't move as they're switched); without, each as
 * high as its content (e.g. sliders alone).
 */
const View = forwardRef<HTMLDivElement, ColorPickerViewProps>(
  ({ children, className, value, ...props }, ref) => {
    const { isGridHeight, mode, registerGridHeight, registerMode } =
      useContext(PanelContext);
    // (A mode, too: without `Modes`, its only view shown.)
    useLayoutEffect(() => registerMode(value), [registerMode, value]);
    // (Rendered or not: its own height known by its children's types.)
    const isOwnGridHeight = Children.toArray(children).some(
      (child) =>
        isValidElement(child) &&
        (child.type === Grid || child.type === Spectrum),
    );
    useLayoutEffect(
      () => (isOwnGridHeight ? registerGridHeight() : undefined),
      [isOwnGridHeight, registerGridHeight],
    );
    if (mode !== value) return null;

    return (
      <div
        ref={ref}
        data-color-picker-view={value}
        {...props}
        className={cn('uikit-color-picker-view', className)}
        data-color-picker-part="view"
        data-grid-height={isGridHeight ? '' : undefined}
      >
        {children}
      </div>
    );
  },
);

/**
 * A gradient's stops, across a channel's track (from where its knob's
 * center is at its least to where it is at its most), evenly.
 */
const trackStops = (colors: readonly string[]) =>
  colors
    .map(
      (stop, index) =>
        `${stop} calc(var(--uikit-color-picker-channel-size) / 2 + (100% - var(--uikit-color-picker-channel-size)) * ${String(index / Math.max(colors.length - 1, 1))})`,
    )
    .join(', ');

/**
 * A channel's row (the sliders', the opacity's): its title (all caps,
 * secondary), a slider (32px high, mixing from the color: its gradient
 * the color with the channel along its range; its knob as high, in the
 * color, ringed white, 3px) and its value (a 75px by 32px field on the system
 * fill, 8px corners, Body emphasized: typed, applied as it's typed, within
 * its range).
 */
/**
 * A typed field's handlers (a channel's value, the code): focused, all of
 * it selected (to type over); left (or Enter), `onLeave` (its value again,
 * e.g. emptied) and its selection collapsed (kept, the next tap would be on
 * selected text). The tap focusing it is on its text, selected: Chrome opens
 * its context menu for that; not for this tap (a later press, held, opens
 * it).
 */
const useFieldSelection = (onLeave: () => void) => {
  // Focused by a tap (until its click).
  const focusingRef = useRef(false);

  return {
    onBlur: (event: FocusEvent<HTMLInputElement>) => {
      onLeave();
      focusingRef.current = false;
      const { length } = event.currentTarget.value;
      event.currentTarget.setSelectionRange(length, length);
    },
    onClick: () => {
      focusingRef.current = false;
    },
    onContextMenu: (event: MouseEvent<HTMLInputElement>) => {
      if (focusingRef.current) event.preventDefault();
    },
    onFocus: (event: FocusEvent<HTMLInputElement>) => {
      focusingRef.current = true;
      event.currentTarget.select();
    },
    onKeyDown: (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Enter') onLeave();
    },
  };
};

const ChannelRow: FunctionComponent<{
  /** Its field's name (e.g. “Opacity percentage”; default: “Red value”). */
  fieldLabel?: string;
  /** Its track's background under its gradient (the opacity's checkerboard). */
  isCheckered?: boolean;
  label: string;
  max: number;
  onValueChange: (value: number, event: Event) => void;
  /** Its gradient: the color with the channel along its range, evenly. */
  stops: readonly string[];
  /** Its knob's color (translucent, over the checkerboard). */
  thumbColor: string;
  /** After its value, not typed (e.g. “%”). */
  unit?: string;
  value: number;
}> = ({
  fieldLabel,
  isCheckered = false,
  label,
  max,
  onValueChange,
  stops,
  thumbColor,
  unit,
  value,
}) => {
  const [draft, setDraft] = useState<string | undefined>(undefined);
  const selection = useFieldSelection(() => setDraft(undefined));
  // Held, its touch doesn't scroll (see `useTouchHold`).
  const holdHandlers = useTouchHold<HTMLDivElement>('x');

  // Typed: its digits (a whole number), within its range, applied at once;
  // shown as applied (e.g. 300 as 255), or empty while it's typed over.
  const type = (text: string, event: Event) => {
    const digits = text.replaceAll(/\D/gu, '');
    if (digits === '') {
      setDraft('');
      return;
    }
    const next = clamp(Number.parseInt(digits, 10), 0, max);
    setDraft(String(next));
    onValueChange(next, event);
  };

  return (
    // Its field typed into: kept above the keyboard, all of the row.
    // (8px above it, as any; and its card's 12px past its end, lifted: see
    // style.css.)
    <Viewport.KeyboardAccessory
      className="uikit-color-picker-channel"
      data-color-picker-part="channel"
      gap={20}
    >
      <div
        aria-hidden="true"
        className="uikit-color-picker-channel-title"
        data-color-picker-part="channel-title"
      >
        {label}
      </div>
      <div
        className="uikit-color-picker-channel-row"
        data-color-picker-part="channel-row"
      >
        <BaseSlider.Root
          aria-label={label}
          max={max}
          min={0}
          style={{ display: 'contents' }}
          thumbAlignment="center"
          value={value}
          onValueChange={(next, { event }) =>
            onValueChange(next as number, event)
          }
        >
          {/* The slider: its gradient over the track (a checkerboard,
             translucent), a hole in it at the knob; its knob the color,
             ringed white. Centered on its value (no measuring, as Base UI's
             edge alignment does, which a popover scaling in would throw
             off), over a track inset by half a knob. */}
          <BaseSlider.Control
            className="uikit-color-picker-channel-control"
            // Its drags don't swipe a sheet (or drawer) away.
            data-base-ui-swipe-ignore=""
            data-checkered={isCheckered ? '' : undefined}
            data-color-picker-part="channel-control"
            // (Its knob's place, for the hole in its gradient: the slider's
            // value, not the color's, which is rounded otherwise.)
            style={
              {
                '--uikit-color-picker-channel-position': value / max,
                '--uikit-color-picker-channel-stops': trackStops(stops),
                '--uikit-color-picker-channel-thumb': thumbColor,
              } as CSSProperties
            }
            {...holdHandlers}
          >
            <BaseSlider.Track>
              <BaseSlider.Thumb
                className="uikit-color-picker-channel-thumb"
                data-color-picker-part="channel-thumb"
              />
            </BaseSlider.Track>
          </BaseSlider.Control>
        </BaseSlider.Root>
        {/* Its value: the number typed, its unit after it (not typed). */}
        <label
          className="uikit-color-picker-channel-field"
          data-color-picker-part="channel-field"
        >
          <input
            aria-label={fieldLabel ?? `${label} value`}
            inputMode="numeric"
            value={draft ?? String(value)}
            // (Left, or Enter: its value again, e.g. emptied; see
            // `useFieldSelection`.)
            onChange={(event) => type(event.currentTarget.value, event)}
            {...selection}
          />
          {unit ? <span aria-hidden="true">{unit}</span> : null}
        </label>
      </div>
    </Viewport.KeyboardAccessory>
  );
};

/** A model's channels: their values (rounded, as shown) and back. */
type Model = {
  channels: readonly {
    label: string;
    max: number;
    unit?: string;
  }[];
  /** The color's channels (rounded). */
  from: (color: Rgba) => number[];
  /**
   * The color, one channel set (only it: the others as they are, not as
   * rounded; by default, from all of them, see `to`).
   */
  set?: (color: Rgba, index: number, value: number) => Omit<Rgba, 'a'>;
  /** Channels as a color (its red, green and blue). */
  to: (values: readonly number[]) => Omit<Rgba, 'a'>;
};

/** Hue (0–360°), saturation and lightness (0–100%). */
const hsl: Model = {
  channels: [
    { label: 'Hue', max: 360, unit: '°' },
    { label: 'Saturation', max: 100, unit: '%' },
    { label: 'Lightness', max: 100, unit: '%' },
  ],
  from: (color) => {
    const { h, l, s } = toHsl(color);
    return [Math.round(h) % 360, Math.round(s * 100), Math.round(l * 100)];
  },
  to: ([h = 0, s = 0, l = 0]) => fromHsl(h % 360, s / 100, l / 100),
};

/**
 * Cyan, magenta, yellow and black (0–100%): naive (from sRGB, no ink's
 * profile), as on screen.
 */
const cmyk: Model = {
  channels: [
    { label: 'Cyan', max: 100, unit: '%' },
    { label: 'Magenta', max: 100, unit: '%' },
    { label: 'Yellow', max: 100, unit: '%' },
    { label: 'Black', max: 100, unit: '%' },
  ],
  from: ({ b, g, r }) => {
    const k = 1 - Math.max(r, g, b) / 255;
    const ink = (channel: number) =>
      k >= 1 ? 0 : Math.round(((1 - channel / 255 - k) / (1 - k)) * 100);
    return [ink(r), ink(g), ink(b), Math.round(k * 100)];
  },
  to: ([c = 0, m = 0, y = 0, k = 0]) => {
    const channel = (ink: number) => 255 * (1 - ink / 100) * (1 - k / 100);
    return { b: channel(y), g: channel(m), r: channel(c) };
  },
};

/** Red, green and blue (0–255). */
const rgb: Model = {
  channels: [
    { label: 'Red', max: 255 },
    { label: 'Green', max: 255 },
    { label: 'Blue', max: 255 },
  ],
  from: ({ b, g, r }) => [r, g, b].map((channel) => Math.round(channel)),
  to: ([r = 0, g = 0, b = 0]) => ({ b, g, r }),
};

const rgbKeys = ['r', 'g', 'b'] as const;

/**
 * Red, green and blue in percent (0–100%): coarser than bytes, so a channel
 * set leaves the others as they are (not as rounded, see `set`).
 */
const rgbPercentage: Model = {
  channels: [
    { label: 'Red', max: 100, unit: '%' },
    { label: 'Green', max: 100, unit: '%' },
    { label: 'Blue', max: 100, unit: '%' },
  ],
  from: ({ b, g, r }) =>
    [r, g, b].map((channel) => Math.round((channel / 255) * 100)),
  set: ({ b, g, r }, index, value) => ({
    b,
    g,
    r,
    [rgbKeys[index] ?? 'r']: (value * 255) / 100,
  }),
  to: ([r = 0, g = 0, b = 0]) => ({
    b: (b * 255) / 100,
    g: (g * 255) / 100,
    r: (r * 255) / 100,
  }),
};

const models: Record<ColorPickerSlidersModel, Model> = { cmyk, hsl, rgb };

/** A model's color, one channel set (see `Model`'s `set`). */
const withChannel = (
  model: Model,
  color: Rgba,
  values: readonly number[],
  index: number,
  value: number,
) =>
  model.set
    ? model.set(color, index, value)
    : model.to(values.with(index, value));

/**
 * A channel's track's colors: the color with the channel along its range,
 * enough of them to be exact (linear between them): a hue around (every
 * 60°), a lightness through the pure hue (halfway), the others its ends.
 */
const trackColors = (
  model: Model,
  color: Rgba,
  values: readonly number[],
  index: number,
) => {
  const { max } = model.channels[index] ?? { max: 1 };
  const steps = model === hsl ? ([6, 1, 2][index] ?? 1) : 1;
  return Array.from({ length: steps + 1 }, (_, step) =>
    formatColor({
      ...withChannel(model, color, values, index, (max * step) / steps),
      a: 1,
    }),
  );
};

/**
 * Sliders: a color model's channels (`model`: red, green and blue, in bytes
 * or percent, its `range`; hue, saturation and lightness; cyan, magenta,
 * yellow and black), each mixing from the color, its value typed too; then
 * its children (e.g. the `Code`), spaced as the channels.
 */
const Sliders = forwardRef<HTMLDivElement, ColorPickerSlidersProps>(
  (
    { children, className, model: modelName = 'rgb', range = 'byte', ...props },
    ref,
  ) => {
    const { color, setColor } = useContext(PickerContext);
    const model =
      modelName === 'rgb' && range === 'percentage'
        ? rgbPercentage
        : models[modelName];
    const opaque = formatColor({ ...color, a: 1 });

    // Its values as last set, while they're the color's (and its model's):
    // so a hue isn't lost to a gray (no saturation), nor inks to black (all
    // of it).
    const [last, setLast] = useState<{
      color: string;
      model: Model;
      values: number[];
    }>();
    const values =
      last?.color === opaque && last.model === model
        ? last.values
        : model.from(color);

    return (
      <div
        ref={ref}
        {...props}
        className={cn('uikit-color-picker-sliders', className)}
        data-color-picker-part="sliders"
        data-model={modelName}
        data-range={modelName === 'rgb' ? range : undefined}
      >
        {model.channels.map(({ label, max, unit }, index) => (
          <ChannelRow
            key={label}
            label={label}
            max={max}
            stops={trackColors(model, color, values, index)}
            thumbColor={opaque}
            unit={unit}
            value={values[index] ?? 0}
            onValueChange={(next, event) => {
              const nextValues = values.with(index, next);
              const nextColor = {
                ...withChannel(model, color, values, index, next),
                a: color.a,
              };
              setLast({
                color: formatColor({ ...nextColor, a: 1 }),
                model,
                values: nextValues,
              });
              setColor(nextColor, { event, reason: 'sliders' });
            }}
          />
        ))}
        {children}
      </div>
    );
  },
);

/**
 * The opacity: the color fading in over a checkerboard, in percent; 22px
 * above what follows. Rendered, the color has it (see `Root`): without
 * it, it's opaque.
 */
const Opacity = forwardRef<HTMLDivElement, ComponentProps<'div'>>(
  ({ className, ...props }, ref) => {
    const { color, registerOpacity, setColor } = useContext(PickerContext);
    useLayoutEffect(registerOpacity, [registerOpacity]);

    return (
      <div
        ref={ref}
        {...props}
        className={cn('uikit-color-picker-opacity', className)}
        data-color-picker-part="opacity"
      >
        <ChannelRow
          isCheckered
          fieldLabel="Opacity percentage"
          label="Opacity"
          max={100}
          thumbColor={formatColor(color)}
          unit="%"
          value={Math.round(color.a * 100)}
          stops={[
            formatColor({ ...color, a: 0 }),
            formatColor({ ...color, a: 1 }),
          ]}
          onValueChange={(next, event) =>
            setColor({ ...color, a: next / 100 }, { event, reason: 'opacity' })
          }
        />
      </div>
    );
  },
);

// A page of saved colors: 2 rows of 5, always as high (so its
// popover doesn't move).
const Saved = forwardRef<HTMLDivElement, ComponentProps<'div'>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('uikit-color-picker-saved', className)}
      data-color-picker-part="saved"
      {...props}
    />
  ),
);

/** Saved colors per page (with the add button, on the last). */
const pageSize = 10;

const SavedSwatch: FunctionComponent<{
  hex: string;
  onDelete: (event: Event) => void;
}> = ({ hex, onDelete }) => {
  const { color, setColor } = useContext(PickerContext);
  const swatch = parseColor(hex);

  // Its menu (a secondary click: right click, or a long press): delete it.
  return (
    <Menu.Root>
      <Menu.Trigger
        openOn="secondaryClick"
        render={
          <button
            aria-label={hex}
            aria-pressed={sameColor(swatch, color) && swatch.a === color.a}
            style={{ '--uikit-color-picker-color': hex }}
            type="button"
            onClick={(event: MouseEvent<HTMLButtonElement>) =>
              setColor(swatch, { event, reason: 'saved' })
            }
          />
        }
      />
      <Menu.Portal>
        <Menu.Positioner>
          <Menu.Popup>
            <Menu.Item
              destructive
              onClick={(event: MouseEvent<HTMLElement>) => onDelete(event)}
            >
              <Menu.Label>Delete</Menu.Label>
            </Menu.Item>
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  );
};

/** A color laid over an opaque one (`on`): its mix, opaque. */
const flattened = (color: Rgba, on: number): Rgba => {
  const mix = (channel: number) => channel * color.a + on * (1 - color.a);
  return { a: 1, b: mix(color.b), g: mix(color.g), r: mix(color.r) };
};

/**
 * The color, translucent, pressed (see `Swatches` `flattenOnPress`): an
 * action sheet offering it opaque (its transparency removed, or flattened
 * on white or on black).
 */
const FlattenCurrent: FunctionComponent = () => {
  const { color, setColor } = useContext(PickerContext);
  // (Pressed, its button: gone once the color's opaque.)
  const triggerRef = useRef<HTMLButtonElement>(null);
  const choose =
    (next: Rgba) =>
    (event: MouseEvent<HTMLElement>): void =>
      setColor(next, { event, reason: 'flatten' });

  return (
    <ActionSheet.Root>
      <ActionSheet.Trigger
        render={
          <button
            ref={triggerRef}
            aria-label="Flatten color"
            className="uikit-color-picker-current"
            data-color-picker-part="current"
            type="button"
          />
        }
      />
      {/* Closed, focus back on its button while it's there; once the color
         is opaque (its button gone), left as it is: else it went to what
         had it before (e.g. the system colors' input, which, focused on
         iOS, opens the system's picker). */}
      <ActionSheet.Popup
        finalFocus={() => triggerRef.current?.isConnected === true}
      >
        <ActionSheet.Header>
          <ActionSheet.Title>Flatten Color?</ActionSheet.Title>
        </ActionSheet.Header>
        <ActionSheet.Actions>
          <ActionSheet.Action onClick={choose({ ...color, a: 1 })}>
            Remove Transparency
          </ActionSheet.Action>
          <ActionSheet.Action onClick={choose(flattened(color, 255))}>
            Flatten on White
          </ActionSheet.Action>
          <ActionSheet.Action onClick={choose(flattened(color, 0))}>
            Flatten on Black
          </ActionSheet.Action>
        </ActionSheet.Actions>
      </ActionSheet.Popup>
    </ActionSheet.Root>
  );
};

/**
 * The color (82px, 18px corners; translucent, over black and white) beside
 * the saved colors (in pages, with a page control; adding the color to
 * them, deleting one by its menu). Translucent, pressed: offering it opaque
 * (`flattenOnPress`, see `FlattenCurrent`).
 */
const Swatches = forwardRef<HTMLDivElement, ColorPickerSwatchesProps>(
  (
    {
      className,
      defaultSavedColors: initialSaved = defaultSavedColors,
      flattenOnPress = true,
      onSavedColorsChange,
      savedColors: savedProp,
      ...props
    },
    ref,
  ) => {
    const { color } = useContext(PickerContext);
    const [ownSaved, setOwnSaved] = useState(initialSaved);
    const saved = savedProp ?? ownSaved;

    // Uncontrolled: their own state; controlled, only the app's.
    const changeSaved = (
      next: string[],
      details: ColorPickerSavedColorsChangeEventDetails,
    ) => {
      if (savedProp === undefined) setOwnSaved(next);
      onSavedColorsChange?.(next, details);
    };

    // Pages of saved colors, the add button after them (unless the color
    // is one of them).
    const isSaved = saved.some((hex) => {
      const swatch = parseColor(hex);
      return sameColor(swatch, color) && swatch.a === color.a;
    });
    const items = isSaved ? saved : [...saved, undefined];
    const pages = Math.max(1, Math.ceil(items.length / pageSize));
    const [page, setPage] = useState(0);
    const shownPage = Math.min(page, pages - 1);

    // Swiped to (the page mostly shown), or scrolled to (by its page
    // control, or a color added: once its page is there).
    const pagesRef = useRef<HTMLDivElement>(null);
    const [scrollTarget, setScrollTarget] = useState<number | undefined>();
    const handleScroll = () => {
      const { current: element } = pagesRef;
      if (!element || scrollTarget !== undefined) return;
      setPage(Math.round(Math.abs(element.scrollLeft) / element.clientWidth));
    };
    useLayoutEffect(() => {
      const { current: element } = pagesRef;
      if (!element || scrollTarget === undefined) return undefined;
      const isRightToLeft = getComputedStyle(element).direction === 'rtl';
      element.scrollTo({
        behavior: 'smooth',
        left: (isRightToLeft ? -1 : 1) * scrollTarget * element.clientWidth,
      });
      // (Swipes count again once it's there.)
      const done = () => setScrollTarget(undefined);
      element.addEventListener('scrollend', done, { once: true });
      const fallback = setTimeout(done, 1000);
      return () => {
        element.removeEventListener('scrollend', done);
        clearTimeout(fallback);
      };
    }, [scrollTarget]);
    const goTo = (next: number) => {
      setPage(next);
      setScrollTarget(next);
    };

    return (
      <div
        ref={ref}
        {...props}
        className={cn('uikit-color-picker-swatches', className)}
        data-color-picker-part="swatches"
      >
        {/* The color, over black and white (translucent); then, pressed,
           offering it opaque. */}
        {flattenOnPress && color.a < 1 ? (
          <FlattenCurrent />
        ) : (
          <div
            aria-hidden="true"
            className="uikit-color-picker-current"
            data-color-picker-part="current"
          />
        )}
        <div
          className="uikit-color-picker-saved-column"
          data-color-picker-part="saved-column"
        >
          {/* Its pages of saved colors, side by side, swiped (snapping to
             each); room for their focus rings (4px) all around, the pages 8px
             apart (so a page's rings don't show beside another). */}
          <div
            ref={pagesRef}
            aria-label="Saved colors"
            className="uikit-color-picker-saved-pages"
            data-color-picker-part="saved-pages"
            role="group"
            onScroll={handleScroll}
          >
            {Array.from({ length: pages }, (_, index) => (
              <Saved
                key={index}
                // (Only the page shown can be reached.)
                inert={index !== shownPage}
              >
                {items
                  .slice(index * pageSize, (index + 1) * pageSize)
                  .map((hex) =>
                    hex === undefined ? (
                      <button
                        key="add"
                        aria-label="Add color"
                        data-add=""
                        type="button"
                        onClick={(event: MouseEvent<HTMLButtonElement>) => {
                          const next = formatColor(color);
                          if (saved.includes(next)) return;
                          changeSaved([...saved, next], {
                            event,
                            reason: 'add',
                          });
                          // On the page it lands on.
                          goTo(Math.floor(saved.length / pageSize));
                        }}
                      >
                        +
                      </button>
                    ) : (
                      <SavedSwatch
                        key={hex}
                        hex={hex}
                        onDelete={(event: Event) =>
                          changeSaved(
                            saved.filter((other) => other !== hex),
                            { event, reason: 'delete' },
                          )
                        }
                      />
                    ),
                  )}
              </Saved>
            ))}
          </div>
          {/* (Only with pages: one page, no room below the colors.) */}
          {pages > 1 ? (
            <PageControl
              count={pages}
              value={shownPage}
              variant="plain"
              onValueChange={goTo}
            />
          ) : null}
        </div>
      </div>
    );
  },
);

/** The browser's eyedropper (`EyeDropper`), if it has one. */
const eyeDropper = () =>
  (globalThis as { EyeDropper?: new () => EyeDropperApi }).EyeDropper;

/**
 * Its eyedropper (the leading button): a `Button` (or what it
 * renders), picking a color off the screen (the browser's `EyeDropper`;
 * none without it).
 */
const Eyedropper: FunctionComponent<ColorPickerEyedropperProps> = ({
  render,
  ...props
}) => {
  const { color, setColor } = useContext(PickerContext);
  const Picker = eyeDropper();
  if (!Picker) return null;

  const pick = (event: Event) => {
    new Picker()
      .open()
      .then(({ sRGBHex }) =>
        setColor(
          { ...parseColor(sRGBHex), a: color.a },
          { event, reason: 'eyedropper' },
        ),
      )
      .catch(() => undefined);
  };

  return render ? (
    cloneElement(render, {
      'aria-label': 'Eyedropper',
      ...props,
      onClick: pick,
    })
  ) : (
    <Button.Root
      aria-label="Eyedropper"
      {...props}
      onClick={pick}
    />
  );
};

/** Whether the browser has a color input (its picker the system's). */
const hasColorInput = () => {
  if (typeof document === 'undefined') return false;
  const input = document.createElement('input');
  input.type = 'color';
  return input.type === 'color';
};

/**
 * Whether its color input has an alpha (its `alpha` attribute: e.g.
 * Safari's; without, a value with one is invalid, black).
 */
const hasColorInputAlpha = () =>
  typeof HTMLInputElement !== 'undefined' &&
  'alpha' in HTMLInputElement.prototype;

/**
 * A color input's `alpha` (its picker's opacity), as a property: too new for
 * the JSX types, and React renders no attribute it doesn't know as `true`.
 * Its value given again after it (`value`): given before, without an alpha
 * yet, the value's alpha was dropped.
 */
const setAlpha = (
  input: HTMLInputElement | null,
  hasAlpha: boolean,
  value: string,
) => {
  if (!input) return;
  (input as HTMLInputElement & { alpha: boolean }).alpha = hasAlpha;
  input.value = value;
};

/**
 * Its system colors (a leading button, after the eyedropper): a `Button`
 * (or what it renders), opening the system's color picker: a color input's
 * (none without one), over the button, transparent: pressed itself (on iOS,
 * nothing else opens it: neither `showPicker` nor a click, see WebKit's bug
 * 261703), the button showing the press; the button clicking it from the
 * keyboard. With the opacity rendered, its alpha too, where the input has
 * one (its `alpha`: e.g. Safari); else its colors opaque, the opacity kept.
 */
const SystemColors: FunctionComponent<ColorPickerSystemColorsProps> = ({
  render,
  ...props
}) => {
  const { color, hasOpacity, setColor } = useContext(PickerContext);
  // (Its input, as rendered: for its button's press.)
  const [input, setInput] = useState<HTMLInputElement | null>(null);
  // (With the opacity, the input's alpha too, where it has one.)
  const hasAlpha = hasOpacity && hasColorInputAlpha();
  // (The color, as it is: its picker opened from it.)
  const value = formatColor(
    hasAlpha ? color : { ...color, a: 1 },
  ).toLowerCase();
  // Its alpha set after it's rendered (a property, see `setAlpha`): its
  // value, given before (an alpha's dropped then, the input without one),
  // given again, with its alpha (else opaque until the color changes).
  useLayoutEffect(
    () => setAlpha(input, hasAlpha, value),
    [hasAlpha, input, value],
  );
  if (!hasColorInput()) return null;

  const open = () => input?.click();

  return (
    <span
      className="uikit-color-picker-system-colors"
      data-color-picker-part="system-colors"
    >
      {render ? (
        cloneElement(render, {
          'aria-label': 'System colors',
          ...props,
          onClick: open,
        })
      ) : (
        <Button.Root
          aria-label="System colors"
          {...props}
          onClick={open}
        />
      )}
      <input
        ref={setInput}
        aria-hidden="true"
        className="uikit-color-picker-system-colors-input"
        disabled={props.disabled}
        tabIndex={-1}
        type="color"
        value={value}
        // (As it's picked, live; without its alpha, the opacity kept.)
        onChange={(event) => {
          // (Any CSS color, with an alpha: see color.ts.)
          const picked = parseCssColor(event.currentTarget.value);
          if (!picked) return;
          setColor(hasAlpha ? picked : { ...picked, a: color.a }, {
            event,
            reason: 'system-colors',
          });
        }}
      />
    </span>
  );
};

/** A field without spell checking (its `spellcheck` property). */
const noSpellcheck = (input: HTMLInputElement | null) => {
  if (input) input.spellcheck = false;
};

/**
 * Its code (a row; its place the app's: e.g. under the sliders), as high as a
 * channel's, its field where a channel's value is: “Hex” (a channel's title,
 * beside them, centered), then its children (e.g. a `CodeCopy`), the color's
 * hex code typed (`#` before it, not typed: its digits, applied as they make
 * a code, 3, 4, 6 or 8 of them; with an alpha, 4 or 8), at its end. Kept above the keyboard as it's typed into (as a
 * channel's row).
 */
const Code = forwardRef<HTMLDivElement, ColorPickerCodeProps>(
  ({ children, className, ...props }, ref) => {
    const { color, setColor } = useContext(PickerContext);
    const [draft, setDraft] = useState<string | undefined>(undefined);
    const selection = useFieldSelection(() => setDraft(undefined));

    const type = (text: string, event: Event) => {
      const digits = text
        .replaceAll(/[^\da-f]/giu, '')
        .slice(0, 8)
        .toUpperCase();
      setDraft(digits);
      if (![3, 4, 6, 8].includes(digits.length)) return;
      const typed = parseColor(`#${digits}`);
      // (Without an alpha typed, the color's kept.)
      setColor(digits.length % 4 === 0 ? typed : { ...typed, a: color.a }, {
        event,
        reason: 'code',
      });
    };

    return (
      <Viewport.KeyboardAccessory
        ref={ref}
        gap={20}
        {...props}
        className={cn('uikit-color-picker-code', className)}
        data-color-picker-part="code"
      >
        <div
          className="uikit-color-picker-channel-row uikit-color-picker-code-row"
          data-color-picker-part="code-row"
        >
          <div
            aria-hidden="true"
            className="uikit-color-picker-channel-title"
            data-color-picker-part="code-title"
          >
            Hex
          </div>
          {children}
          {/* Its code: `#` (not typed), its digits typed, in a field as a
             channel's value is. */}
          <label
            className="uikit-color-picker-channel-field uikit-color-picker-code-field"
            data-color-picker-part="code-field"
          >
            <span aria-hidden="true">#</span>
            <input
              // (As a property: spelled differently in React's and Preact's
              // JSX.)
              ref={noSpellcheck}
              value={draft ?? formatColor(color).slice(1)}
              onChange={(event) => type(event.currentTarget.value, event)}
              {...selection}
            />
          </label>
        </div>
      </Viewport.KeyboardAccessory>
    );
  },
);

/** A color well: its color, opening the picker. */
const Well = forwardRef<HTMLButtonElement, ColorWellProps>(
  ({ className, color, size = 'small', style, ...props }, ref) => (
    <button
      ref={ref}
      aria-label="Color"
      data-color={color === undefined ? undefined : ''}
      data-size={size}
      style={withStyle({ '--uikit-color-picker-well-color': color }, style)}
      type="button"
      {...props}
      className={cn('uikit-color-picker-well', className)}
      data-color-picker-part="well"
    />
  ),
);

// How long a copy shows as done (its checkmark).
const copiedFor = 1500;

/**
 * Its code's copy button: a `Button` (or what it renders, its content the
 * app's: e.g. a symbol), opening a menu of the color's codes (see color.ts):
 * hex's, then a submenu each of the others' groups, each code its format and
 * its values (`Menu.Label`, `Menu.Subtitle`). One picked, copied to the
 * clipboard (`onCodeCopy`); for a moment, a checkmark instead of its content
 * (`data-copied`). Its place the app's (in a `Code`, or not).
 */
const CodeCopy: FunctionComponent<ColorPickerCodeCopyProps> = ({
  children,
  onCodeCopy,
  render,
  ...props
}) => {
  const { color } = useContext(PickerContext);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    if (!isCopied) return undefined;
    const timeout = setTimeout(() => setIsCopied(false), copiedFor);
    return () => clearTimeout(timeout);
  }, [isCopied]);

  const copy = (code: string, event: Event) => {
    navigator.clipboard
      .writeText(code)
      .then(() => {
        setIsCopied(true);
        onCodeCopy?.(code, event);
      })
      .catch(() => undefined);
  };

  // (Hex's: its color in a well at its end, inert.)
  const item = ({ code, label, subtitle, well }: ColorCode) => (
    <Menu.Item
      key={code}
      onClick={(event: MouseEvent<HTMLElement>) => copy(code, event)}
    >
      <Menu.Label>{label}</Menu.Label>
      <Menu.Subtitle>{subtitle}</Menu.Subtitle>
      {well === undefined ? null : (
        <Well
          inert
          aria-hidden="true"
          className="uikit-color-picker-code-copy-well"
          color={well}
          tabIndex={-1}
        />
      )}
    </Menu.Item>
  );

  const content = isCopied ? (
    <Button.Icon>
      <Checkmark />
    </Button.Icon>
  ) : (
    children
  );
  const trigger = render ? (
    cloneElement(
      render,
      {
        'aria-label': 'Copy color code',
        ...props,
        'data-copied': isCopied ? '' : undefined,
      },
      content,
    )
  ) : (
    <Button.Root
      aria-label="Copy color code"
      {...props}
      data-copied={isCopied ? '' : undefined}
    >
      {content}
    </Button.Root>
  );

  return (
    <Menu.Root>
      <Menu.Trigger render={trigger} />
      <Menu.Portal>
        <Menu.Positioner>
          <Menu.Popup>
            {codeGroups(color, formatColor({ ...color, a: 1 })).map(
              ([title, codes], index) =>
                index === 0 ? (
                  <Fragment key={title}>
                    {codes.map((entry) => item(entry))}
                  </Fragment>
                ) : (
                  <Menu.SubmenuRoot key={title}>
                    <Menu.SubmenuTrigger>
                      <Menu.Label>{title}</Menu.Label>
                    </Menu.SubmenuTrigger>
                    <Menu.Portal>
                      <Menu.Positioner>
                        <Menu.Popup>
                          {codes.map((entry) => item(entry))}
                        </Menu.Popup>
                      </Menu.Positioner>
                    </Menu.Portal>
                  </Menu.SubmenuRoot>
                ),
            )}
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  );
};

/**
 * Its named colors' rows (see `Named`): one registered (its label's first
 * letter, for the index), while mounted.
 */
const NamedContext = createContext<(entry: NamedIndexEntry) => () => void>(
  () => unregister,
);

/** The scroll container `element` is in (its block axis), or the page. */
const scrollerOf = (element: HTMLElement): Element => {
  for (
    let parent = element.parentElement;
    parent && parent !== document.body;
    parent = parent.parentElement
  ) {
    const { overflowY } = getComputedStyle(parent);
    if (overflowY === 'auto' || overflowY === 'scroll') return parent;
  }
  return document.scrollingElement ?? document.documentElement;
};

/** A row at the top of its scroll container (below its scroll padding). */
const jumpTo = (element: HTMLElement) => {
  const scroller = scrollerOf(element);
  const padding =
    Number.parseFloat(getComputedStyle(scroller).scrollPaddingBlockStart) || 0;
  const top =
    scroller === document.scrollingElement
      ? 0
      : scroller.getBoundingClientRect().top;
  scroller.scrollTo({
    top:
      scroller.scrollTop + element.getBoundingClientRect().top - top - padding,
  });
};

/**
 * A row in view (between its scroll container's scroll paddings: e.g. a
 * sheet's header), at once: already, it stays; else, centered there.
 */
const revealCentered = (element: HTMLElement) => {
  const scroller = scrollerOf(element);
  const style = getComputedStyle(scroller);
  const paddingStart = Number.parseFloat(style.scrollPaddingBlockStart) || 0;
  const paddingEnd = Number.parseFloat(style.scrollPaddingBlockEnd) || 0;
  const scrollerTop =
    scroller === document.scrollingElement
      ? 0
      : scroller.getBoundingClientRect().top;
  const { bottom, height, top } = element.getBoundingClientRect();
  const viewStart = scrollerTop + paddingStart;
  const viewHeight = scroller.clientHeight - paddingStart - paddingEnd;
  if (top >= viewStart && bottom <= viewStart + viewHeight) return;
  scroller.scrollTo({
    behavior: 'instant',
    top: scroller.scrollTop + top - viewStart - (viewHeight - height) / 2,
  });
};

/**
 * Its named colors (a mode's content, e.g. “Named”): one list of their rows
 * (`NamedColor`s: e.g. the app's, `CssNamedColors`'), as high as they are
 * (scrolled by its container: e.g. a sheet's content, a popover's body). At
 * its end (in its panel's inset), an index of their labels' first letters,
 * kept centered in view as it's scrolled; one picked, the first row with it
 * at the top (below the container's scroll padding: e.g. a sheet's header).
 * Shown, the color's row in view at once (see `revealCentered`).
 */
const Named = forwardRef<HTMLDivElement, ColorPickerNamedProps>(
  ({ children, className, ...props }, forwardedRef) => {
    const ref = useForwardedRef(forwardedRef);
    // Shown (e.g. its mode chosen): the color's row in view, at once.
    useLayoutEffect(() => {
      const picked = ref.current?.querySelector<HTMLElement>(
        '[data-color-picker-part="named-color"][data-picked]',
      );
      if (picked) revealCentered(picked);
    }, [ref]);
    const [entries, setEntries] = useState<readonly NamedIndexEntry[]>([]);
    const register = useCallback((entry: NamedIndexEntry) => {
      // (In the document's order; rows apart, neither in the other: only
      // following, or not.)
      setEntries((current) =>
        [...current, entry].toSorted((a, b) =>
          a.element.compareDocumentPosition(b.element) ===
          Node.DOCUMENT_POSITION_FOLLOWING
            ? -1
            : 1,
        ),
      );
      return () =>
        setEntries((current) => current.filter((other) => other !== entry));
    }, []);
    // Each letter's first row.
    const letters = useMemo(() => {
      const first = new Map<string, HTMLElement>();
      for (const { element, label } of entries) {
        if (!first.has(label)) first.set(label, element);
      }
      return [...first];
    }, [entries]);

    return (
      <NamedContext.Provider value={register}>
        <div
          ref={ref}
          {...props}
          className={cn('uikit-color-picker-named', className)}
          data-color-picker-part="named"
        >
          <List.Root listStyle="insetGrouped">
            <List.Section>
              <List.Group>{children}</List.Group>
            </List.Section>
          </List.Root>
          {letters.length > 0 ? (
            <div
              className="uikit-color-picker-named-index"
              data-color-picker-part="named-index"
            >
              <List.Index aria-label="Index">
                {letters.map(([letter, element]) => (
                  <List.IndexItem
                    key={letter}
                    onClick={() => jumpTo(element)}
                  >
                    {letter}
                  </List.IndexItem>
                ))}
              </List.Index>
            </div>
          ) : null}
        </div>
      </NamedContext.Provider>
    );
  },
);

/**
 * A named color's row (in a `Named`): its color in a well (inert), its label
 * (or its color), a checkmark while it's the color (its opacity aside); its
 * label's first letter in the index. Pressed, the color (its opacity kept,
 * as a grid swatch's).
 */
const NamedColor = forwardRef<HTMLElement, ColorPickerNamedColorProps>(
  ({ children, color: cssColor, ...props }, forwardedRef) => {
    const { color, setColor } = useContext(PickerContext);
    const register = useContext(NamedContext);
    const ref = useForwardedRef(forwardedRef);
    const named = useMemo(() => parseCssColor(cssColor), [cssColor]);
    const isPicked = named !== undefined && sameColor(named, color);
    const letter = (typeof children === 'string' ? children : cssColor)
      .charAt(0)
      .toUpperCase();

    useLayoutEffect(() => {
      const { current: element } = ref;
      return element ? register({ element, label: letter }) : undefined;
    }, [letter, ref, register]);

    return (
      <List.Item
        ref={ref}
        {...props}
        data-color-picker-part="named-color"
        data-picked={isPicked ? '' : undefined}
      >
        <List.Leading>
          <Well
            inert
            aria-hidden="true"
            color={cssColor}
            tabIndex={-1}
          />
        </List.Leading>
        <List.Content>
          <List.Title
            aria-pressed={isPicked}
            render={<button type="button" />}
            onClick={(event: MouseEvent<HTMLElement>) => {
              if (!named) return;
              setColor({ ...named, a: color.a }, { event, reason: 'named' });
            }}
          >
            {children ?? cssColor}
          </List.Title>
        </List.Content>
        <List.Trailing>{isPicked ? <List.Checkmark /> : null}</List.Trailing>
      </List.Item>
    );
  },
);

/**
 * The CSS named colors (148, synonyms too: e.g. gray and grey; not
 * `transparent`; see named-colors.ts), as a `Named`'s rows, labeled by their
 * names.
 */
const CssNamedColors: FunctionComponent = () => (
  <>
    {cssNamedColors.map((name) => (
      <NamedColor
        key={name}
        color={name}
      />
    ))}
  </>
);

export const ColorPicker = {
  Root,
  Panel,
  Modes,
  Mode,
  View,
  Grid,
  Spectrum,
  Sliders,
  Opacity,
  Swatches,
  Eyedropper,
  SystemColors,
  Code,
  CodeCopy,
  Named,
  NamedColor,
  CssNamedColors,
  Well,
};
