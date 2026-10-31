import '../button/style.css';
import '../menu/style.css';
import '../page-control/style.css';
import '../segmented/style.css';
import './style.css';

import type { RadioGroup as BaseRadioGroup } from '@base-ui/react/radio-group';
import { Slider as BaseSlider } from '@base-ui/react/slider';
import {
  cloneElement,
  ComponentProps,
  createContext,
  CSSProperties,
  FocusEvent,
  forwardRef,
  FunctionComponent,
  KeyboardEvent,
  MouseEvent,
  PointerEvent,
  useCallback,
  useContext,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { Button } from '../button/main.js';
import { Menu } from '../menu/main.js';
import { PageControl } from '../page-control/main.js';
import { Segmented } from '../segmented/main.js';
import { cn, useTouchHold, withStyle } from '../utils/main.js';
import { Viewport } from '../viewport/main.js';
import type {
  ColorPickerChangeEventDetails,
  ColorPickerEyedropperProps,
  ColorPickerModeProps,
  ColorPickerModesProps,
  ColorPickerPanelProps,
  ColorPickerRootProps,
  ColorPickerSavedColorsChangeEventDetails,
  ColorPickerSlidersModel,
  ColorPickerSlidersProps,
  ColorPickerSwatchesProps,
  ColorPickerViewProps,
  ColorWellProps,
  EyeDropperApi,
  PanelState,
  PickerState,
  Rgba,
} from './props.js';

export type {
  ColorPickerChangeEventDetails,
  ColorPickerEyedropperProps,
  ColorPickerModeProps,
  ColorPickerModesProps,
  ColorPickerPanelProps,
  ColorPickerRootProps,
  ColorPickerSavedColorsChangeEventDetails,
  ColorPickerSlidersModel,
  ColorPickerSlidersProps,
  ColorPickerSwatchesProps,
  ColorPickerViewProps,
  ColorWellProps,
} from './props.js';

// A color picker and a color well, in the app's popover (a regular width)
// or sheet (compact), its header the app's (a `Toolbar`: the
// eyedropper, “Colors”, close):
// - a segmented control (Grid, Spectrum, Sliders), 24px above the view;
// - Grid: 12 by 10 swatches (a gray row, then hues by lightness), its
//   corners 18px, the selected one outlined white (3px);
// - Spectrum: hues across, light to dark down (white at the top, pure hues
//   halfway, black at the bottom), its corners 18px, the color ringed;
// - Sliders: red, green and blue (0 to 255), each a channel's row (see
//   `ChannelRow`): its title (all caps), a slider mixing from the color
//   (the channel at 0 to 255), and its value, typed;
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
  registerOpacity: () => unregister,
  setColor: () => undefined,
});

/**
 * A color picker: its color, for its
 * parts (`Panel`, `Eyedropper`), in the app's popover or sheet.
 */
const Root = forwardRef<HTMLDivElement, ColorPickerRootProps>(
  (
    {
      className,
      defaultValue = '#000000',
      onValueChange,
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

    return (
      <PickerContext.Provider value={state}>
        <div
          ref={ref}
          style={withStyle(
            {
              // (For its parts.)
              '--uikit-color-picker-color': formatColor(color),
              '--uikit-color-picker-color-opaque': formatColor({
                ...color,
                a: 1,
              }),
            },
            style,
          )}
          {...props}
          className={cn('uikit-color-picker-root', className)}
          data-color-picker-part="root"
        />
      </PickerContext.Provider>
    );
  },
);

/**
 * Its panel's modes (see `Panel`): the one shown, chosen by its `Modes`;
 * the first `Mode` (or `View`) unless a default is given.
 */
const PanelContext = createContext<PanelState>({
  mode: null,
  registerMode: () => undefined,
  setMode: () => undefined,
});

/**
 * Its panel: its modes (`Modes`, a `Mode` each; a `View` each, paired by
 * their `value`s), the opacity, the color and the saved colors, as
 * composed (in its padding, its parts spaced).
 */
const Panel = forwardRef<HTMLDivElement, ColorPickerPanelProps>(
  ({ className, defaultMode, mode: modeProp, onModeChange, ...props }, ref) => {
    const [ownMode, setOwnMode] = useState(defaultMode);
    // (Without a default: the first mode, as it's rendered.)
    const [firstMode, setFirstMode] = useState<string | undefined>();
    // (Controlled from the start: none yet, before its first mode is
    // known, not undefined, which would leave its control uncontrolled.)
    const mode = modeProp ?? ownMode ?? firstMode ?? null;

    const panel = useMemo(
      () => ({
        mode,
        registerMode: (value: string) =>
          setFirstMode((first) => first ?? value),
        // Uncontrolled: its own state; controlled, only the app's `mode`.
        setMode: (next: string, details: BaseRadioGroup.ChangeEventDetails) => {
          if (modeProp === undefined) setOwnMode(next);
          onModeChange?.(next, details);
        },
      }),
      [mode, modeProp, onModeChange],
    );

    return (
      <PanelContext.Provider value={panel}>
        <div
          ref={ref}
          {...props}
          className={cn('uikit-color-picker-panel', className)}
          data-color-picker-part="panel"
        />
      </PanelContext.Provider>
    );
  },
);

/**
 * Its modes' control: a segmented control (its `Mode`s, its highlight),
 * choosing the `View` shown; 24px above it.
 */
const Modes = forwardRef<HTMLDivElement, ColorPickerModesProps>(
  ({ children, ...props }, ref) => {
    const { mode, setMode } = useContext(PanelContext);

    return (
      <Segmented.Root
        ref={ref}
        aria-label="Mode"
        {...props}
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

/**
 * A mode's view (by `value`, its `Mode`'s): shown while it's chosen; all
 * as high as the grid (so a popover doesn't move as they're switched).
 */
const View = forwardRef<HTMLDivElement, ColorPickerViewProps>(
  ({ className, value, ...props }, ref) => {
    const { mode, registerMode } = useContext(PanelContext);
    // (A mode, too: without `Modes`, its only view shown.)
    useLayoutEffect(() => registerMode(value), [registerMode, value]);
    if (mode !== value) return null;

    return (
      <div
        ref={ref}
        data-color-picker-view={value}
        {...props}
        className={cn('uikit-color-picker-view', className)}
        data-color-picker-part="view"
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
 * A gradient's stops, across a channel's track (from where its knob's
 * center is at its least to where it is at its most), evenly.
 */
const trackStops = (colors: readonly string[]) =>
  colors
    .map(
      (stop, index) =>
        `${stop} calc(20px + (100% - 40px) * ${String(index / Math.max(colors.length - 1, 1))})`,
    )
    .join(', ');

/**
 * A channel's row (the sliders', the opacity's): its title (all caps,
 * secondary), a slider (40px high, mixing from the color: its gradient
 * the color with the channel along its range; its knob 36px, in the color,
 * ringed white, 3px) and its value (a 75px by 40px field on the system
 * fill, 8px corners, Body emphasized: typed, committed on Enter or as it's
 * left).
 */
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
  // Held, its touch doesn't scroll (see `useTouchHold`).
  const holdHandlers = useTouchHold<HTMLDivElement>('x');

  const commit = (event: Event) => {
    if (draft === undefined) return;
    const next = Number.parseFloat(draft);
    if (Number.isFinite(next)) {
      onValueChange(clamp(Math.round(next), 0, max), event);
    }
    setDraft(undefined);
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
            onBlur={(event: FocusEvent<HTMLInputElement>) => commit(event)}
            onChange={(event) => setDraft(event.currentTarget.value)}
            // Focused, all of it (to type over).
            onFocus={(event) => event.currentTarget.select()}
            onKeyDown={(event) => {
              if (event.key === 'Enter') commit(event);
            }}
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

const models: Record<ColorPickerSlidersModel, Model> = { cmyk, hsl, rgb };

/**
 * A channel's track's colors: the color with the channel along its range,
 * enough of them to be exact (linear between them): a hue around (every
 * 60°), a lightness through the pure hue (halfway), the others its ends.
 */
const trackColors = (
  model: Model,
  values: readonly number[],
  index: number,
) => {
  const { max } = model.channels[index] ?? { max: 1 };
  const steps = model === hsl ? ([6, 1, 2][index] ?? 1) : 1;
  return Array.from({ length: steps + 1 }, (_, step) => {
    const next = values.with(index, (max * step) / steps);
    return formatColor({ ...model.to(next), a: 1 });
  });
};

/**
 * Sliders: a color model's channels (`model`: red, green and blue; hue,
 * saturation and lightness; cyan, magenta, yellow and black), each mixing
 * from the color, its value typed too.
 */
const Sliders = forwardRef<HTMLDivElement, ColorPickerSlidersProps>(
  ({ className, model: modelName = 'rgb', ...props }, ref) => {
    const { color, setColor } = useContext(PickerContext);
    const model = models[modelName];
    const opaque = formatColor({ ...color, a: 1 });

    // Its values as last set, while they're the color's: so a hue isn't
    // lost to a gray (no saturation), nor inks to black (all of it).
    const [last, setLast] = useState<{ color: string; values: number[] }>();
    const values = last?.color === opaque ? last.values : model.from(color);

    return (
      <div
        ref={ref}
        {...props}
        className={cn('uikit-color-picker-sliders', className)}
        data-color-picker-part="sliders"
        data-model={modelName}
      >
        {model.channels.map(({ label, max, unit }, index) => (
          <ChannelRow
            key={label}
            label={label}
            max={max}
            stops={trackColors(model, values, index)}
            thumbColor={opaque}
            unit={unit}
            value={values[index] ?? 0}
            onValueChange={(next, event) => {
              const nextValues = values.with(index, next);
              const nextColor = { ...model.to(nextValues), a: color.a };
              setLast({
                color: formatColor({ ...nextColor, a: 1 }),
                values: nextValues,
              });
              setColor(nextColor, { event, reason: 'sliders' });
            }}
          />
        ))}
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
            style={{ backgroundColor: hex }}
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

/**
 * The color (82px, 18px corners; translucent, over black and white) beside
 * the saved colors (in pages, with a page control; adding the color to
 * them, deleting one by its menu).
 */
const Swatches = forwardRef<HTMLDivElement, ColorPickerSwatchesProps>(
  (
    {
      className,
      defaultSavedColors: initialSaved = defaultSavedColors,
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
        {/* The color, over black and white (translucent). */}
        <div
          aria-hidden="true"
          className="uikit-color-picker-current"
          data-color-picker-part="current"
        />
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

// Its header (in the panel's popover: 16px from its top, 10px above the
// panel): the app's (e.g. a `Toolbar`: eyedropper, title,
// close); in a sheet, its `Sheet.Header` instead.
const Header = forwardRef<HTMLDivElement, ComponentProps<'div'>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('uikit-color-picker-header', className)}
      data-color-picker-part="header"
      {...props}
    />
  ),
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

export const ColorPicker = {
  Root,
  Header,
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
  Well,
};
