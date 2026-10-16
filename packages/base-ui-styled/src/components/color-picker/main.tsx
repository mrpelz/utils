import '../button/style.css';
import '../menu/style.css';
import '../page-control/style.css';
import '../segmented/style.css';
import '../slider/style.css';
import './style.css';

import { Slider as BaseSlider } from '@base-ui/react/slider';
import {
  cloneElement,
  ComponentProps,
  createContext,
  forwardRef,
  KeyboardEvent,
  PointerEvent,
  ReactNode,
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
import { Slider } from '../slider/main.js';
import { cn } from '../utils/main.js';
import type {
  ColorPickerEyedropperProps,
  ColorPickerMode,
  ColorPickerPanelProps,
  ColorPickerRootProps,
  ColorWellProps,
  EyeDropperApi,
  PickerState,
  Rgba,
} from './props.js';

export type {
  ColorPickerEyedropperProps,
  ColorPickerMode,
  ColorPickerPanelProps,
  ColorPickerRootProps,
  ColorWellProps,
} from './props.js';

// Source: Apple iOS 26 Figma (“Color Pickers”, UIKit
// `UIColorPickerViewController`, `UIColorWell`), in the app's popover
// (iPad) or sheet (iPhone), its header the app's (a `Toolbar`: the
// eyedropper, “Colors”, close):
// - a segmented control (Grid, Spectrum, Sliders), 24px above the view;
// - Grid: 12 by 10 swatches (a gray row, then hues by lightness), its
//   corners 18px, the selected one outlined white (3px);
// - Spectrum: hues across, light to dark down (white at the top, pure hues
//   halfway, black at the bottom), its corners 18px, the color ringed;
// - Sliders: red, green and blue (`Slider`s, 0 to 255);
// - Opacity (15px, semibold), a slider (40px high, a checkerboard under the
//   color fading in, its knob 36px, in the color, ringed white, 3px) and its
//   percentage (a 75px by 40px field on the system fill, 8px corners, Body
//   emphasized);
// - the color (82px, 18px corners) beside the saved colors (30px dots, 25px
//   apart, rows 22px apart; the color's ringed white, 2px, 4px in) and an
//   add button (on the system fill, its “+” the label's color).
// A color well (`ColorPicker.Well`): a 28px (or 36px) disk of hues around
// white; with a color, the hues as a ring around it.
//
// Deviations:
// - Colors are hex strings (`#rrggbb`, `#rrggbbaa` with opacity).
// - The eyedropper (`ColorPicker.Eyedropper`) is the browser's
//   (`EyeDropper`; not where it has none, e.g. Safari).
// - Saved colors are deleted by their menu (a secondary click: right click,
//   long press).

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

/** Figma's grid: a gray row, then hues by lightness. */
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

/** Figma's saved colors. */
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

const PickerContext = createContext<PickerState>({
  color: { a: 1, b: 0, g: 0, r: 0 },
  setColor: () => undefined,
});

/**
 * A color picker (UIKit `UIColorPickerViewController`): its color, for its
 * parts (`Panel`, `Eyedropper`), in the app's popover or sheet.
 */
const Root = forwardRef<HTMLDivElement, ColorPickerRootProps>(
  ({ defaultValue = '#000000', onValueChange, value, ...props }, ref) => {
    const [own, setOwn] = useState(defaultValue);
    const color = parseColor(value ?? own);
    const state = useMemo(
      () => ({
        color,
        setColor: (next: Rgba) => {
          const hex = formatColor(next);
          setOwn(hex);
          onValueChange?.(hex);
        },
      }),
      // (By its hex value.)
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [value ?? own, onValueChange],
    );

    return (
      <PickerContext.Provider value={state}>
        <div
          ref={ref}
          {...props}
          className={cn('bus-color-picker-root', props.className)}
        />
      </PickerContext.Provider>
    );
  },
);

const Grid: React.FunctionComponent = () => {
  const { color, setColor } = useContext(PickerContext);

  return (
    // Grid: swatches in rows, its corners 18px.
    <div
      aria-label="Grid"
      className="bus-color-picker-grid"
      role="group"
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
              onClick={() => setColor({ ...swatch, a: color.a })}
            />
          );
        }),
      )}
    </div>
  );
};

const Spectrum: React.FunctionComponent = () => {
  const { color, setColor } = useContext(PickerContext);
  const { h, l } = toHsl(color);

  const pick = (element: HTMLElement, x: number, y: number) => {
    const { height, left, top, width } = element.getBoundingClientRect();
    const hue = clamp((x - left) / width, 0, 1) * 360;
    const lightness = 1 - clamp((y - top) / height, 0, 1);
    setColor({ ...fromHsl(hue % 360, 1, lightness), a: color.a });
  };

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    const element = event.currentTarget;
    element.setPointerCapture(event.pointerId);
    pick(element, event.clientX, event.clientY);
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!event.currentTarget.hasPointerCapture(event.pointerId)) return;
    pick(event.currentTarget, event.clientX, event.clientY);
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
    setColor({
      ...fromHsl((h + move[0] + 360) % 360, 1, clamp(l + move[1], 0, 1)),
      a: color.a,
    });
  };

  return (
    // Spectrum: hues across, white to black down; the color ringed.
    <div
      aria-label="Spectrum"
      aria-valuetext={formatColor({ ...color, a: 1 })}
      className="bus-color-picker-spectrum"
      role="slider"
      tabIndex={0}
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
};

// Each in its color.
const channels = [
  ['r', 'Red', 'var(--color-ios-system-red)'],
  ['g', 'Green', 'var(--color-ios-system-green)'],
  ['b', 'Blue', 'var(--color-ios-system-blue)'],
] as const;

const Sliders: React.FunctionComponent = () => {
  const { color, setColor } = useContext(PickerContext);

  return (
    <div className="bus-color-picker-sliders">
      {channels.map(([channel, label, tint]) => (
        <Slider.Root
          key={channel}
          max={255}
          min={0}
          tint={tint}
          value={Math.round(color[channel])}
          onValueChange={(next) =>
            setColor({ ...color, [channel]: next as number })
          }
        >
          <Slider.Label placement="block-start">{label}</Slider.Label>
          <Slider.Value placement="block-start" />
          <Slider.Control>
            <Slider.Track>
              <Slider.Indicator />
              <Slider.Thumb />
            </Slider.Track>
          </Slider.Control>
        </Slider.Root>
      ))}
    </div>
  );
};

const Opacity: React.FunctionComponent = () => {
  const { color, setColor } = useContext(PickerContext);
  const percent = Math.round(color.a * 100);
  const [draft, setDraft] = useState<string | undefined>(undefined);

  const commit = () => {
    if (draft === undefined) return;
    const next = Number.parseFloat(draft);
    if (Number.isFinite(next)) {
      setColor({ ...color, a: clamp(next, 0, 100) / 100 });
    }
    setDraft(undefined);
  };

  return (
    <>
      <div className="bus-color-picker-opacity-title">Opacity</div>
      <div className="bus-color-picker-opacity-row">
        <BaseSlider.Root
          aria-label="Opacity"
          max={100}
          min={0}
          style={{ display: 'contents' }}
          thumbAlignment="center"
          value={percent}
          onValueChange={(next) =>
            setColor({ ...color, a: (next as number) / 100 })
          }
        >
          {/* The opacity slider: the color fading in over a checkerboard; its knob the
             color, ringed white. Centered on its value (no measuring, as Base UI's
             edge alignment does, which a popover scaling in would throw off), over a
             track inset by half a knob. */}
          <BaseSlider.Control
            className="bus-color-picker-opacity-control"
            data-color-picker-part="opacity"
          >
            <BaseSlider.Track>
              <BaseSlider.Thumb className="bus-color-picker-opacity-thumb" />
            </BaseSlider.Track>
          </BaseSlider.Control>
        </BaseSlider.Root>
        {/* Its percentage: the number typed, the “%” after it (not typed). */}
        <label className="bus-color-picker-percentage-field">
          <input
            aria-label="Opacity percentage"
            inputMode="numeric"
            value={draft ?? String(percent)}
            onBlur={commit}
            onChange={(event) => setDraft(event.currentTarget.value)}
            // Focused, all of it (to type over).
            onFocus={(event) => event.currentTarget.select()}
            onKeyDown={(event) => {
              if (event.key === 'Enter') commit();
            }}
          />
          <span aria-hidden="true">%</span>
        </label>
      </div>
    </>
  );
};

// A page of saved colors: 2 rows of 5 (Figma), always as high (so its
// popover doesn't move).
const Saved = forwardRef<HTMLDivElement, ComponentProps<'div'>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('bus-color-picker-saved', className)}
      {...props}
    />
  ),
);

/** Saved colors per page (with the add button, on the last). */
const pageSize = 10;

const SavedSwatch: React.FunctionComponent<{
  hex: string;
  onDelete: () => void;
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
            onClick={() => setColor(swatch)}
          />
        }
      />
      <Menu.Portal>
        <Menu.Positioner>
          <Menu.Popup>
            <Menu.Item
              destructive
              onClick={onDelete}
            >
              <Menu.Label>Delete</Menu.Label>
            </Menu.Item>
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  );
};

const modes: [ColorPickerMode, string][] = [
  ['grid', 'Grid'],
  ['spectrum', 'Spectrum'],
  ['sliders', 'Sliders'],
];

/**
 * Its views (Grid, Spectrum, Sliders), the opacity, the color and the saved
 * colors (in pages; adding the color to them, deleting one by its menu).
 */
const Panel = forwardRef<HTMLDivElement, ColorPickerPanelProps>(
  (
    {
      defaultMode = 'grid',
      defaultSavedColors: initialSaved = defaultSavedColors,
      mode: modeProp,
      onModeChange,
      onSavedColorsChange,
      savedColors: savedProp,
      style,
      ...props
    },
    ref,
  ) => {
    const { color } = useContext(PickerContext);
    const [ownMode, setOwnMode] = useState(defaultMode);
    const mode = modeProp ?? ownMode;
    const [ownSaved, setOwnSaved] = useState(initialSaved);
    const saved = savedProp ?? ownSaved;
    const opaque = formatColor({ ...color, a: 1 });

    const changeSaved = (next: string[]) => {
      setOwnSaved(next);
      onSavedColorsChange?.(next);
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
      const rtl = getComputedStyle(element).direction === 'rtl';
      element.scrollTo({
        behavior: 'smooth',
        left: (rtl ? -1 : 1) * scrollTarget * element.clientWidth,
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

    const views: Record<ColorPickerMode, ReactNode> = {
      grid: <Grid />,
      sliders: <Sliders />,
      spectrum: <Spectrum />,
    };

    return (
      // Its views all as high as the grid (so its popover doesn't move).
      <div
        ref={ref}
        style={{
          ...(style as React.CSSProperties | undefined),
          // (For its parts.)
          ...({
            '--styled-color': formatColor(color),
            '--styled-color-opaque': opaque,
          } as React.CSSProperties),
        }}
        {...props}
        className={cn('bus-color-picker-panel', props.className)}
      >
        <Segmented.Root
          aria-label="View"
          value={mode}
          onValueChange={(next) => {
            setOwnMode(next as ColorPickerMode);
            onModeChange?.(next as ColorPickerMode);
          }}
        >
          {modes.map(([value, label]) => (
            <Segmented.Item
              key={value}
              value={value}
            >
              {label}
            </Segmented.Item>
          ))}
          <Segmented.Highlight />
        </Segmented.Root>
        <div data-color-picker-view={mode}>{views[mode]}</div>
        <Opacity />
        <div className="bus-color-picker-swatches">
          {/* The color, over a checkerboard (translucent). */}
          <div
            aria-hidden="true"
            className="bus-color-picker-current"
          />
          <div className="bus-color-picker-saved-column">
            {/* Its pages of saved colors, side by side, swiped (snapping to each); room
               for their focus rings (4px) all around, the pages 8px apart (so a page's
               rings don't show beside another). */}
            <div
              ref={pagesRef}
              aria-label="Saved colors"
              className="bus-color-picker-saved-pages"
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
                          onClick={() => {
                            const next = formatColor(color);
                            if (saved.includes(next)) return;
                            changeSaved([...saved, next]);
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
                          onDelete={() =>
                            changeSaved(saved.filter((other) => other !== hex))
                          }
                        />
                      ),
                    )}
                </Saved>
              ))}
            </div>
            {/* (Its room kept with one page: so its popover doesn't move.) */}
            <PageControl
              count={Math.max(pages, 2)}
              style={pages > 1 ? undefined : { visibility: 'hidden' }}
              value={shownPage}
              variant="plain"
              onValueChange={goTo}
            />
          </div>
        </div>
      </div>
    );
  },
);

// Its header (Figma “Toolbar” in the panel's popover: 16px from its top,
// 10px above the panel): the app's (e.g. a `Toolbar`: eyedropper, title,
// close); in a sheet, its `Sheet.Header` instead.
const Header = forwardRef<HTMLDivElement, ComponentProps<'div'>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('bus-color-picker-header', className)}
      {...props}
    />
  ),
);

/** The browser's eyedropper (`EyeDropper`), if it has one. */
const eyeDropper = () =>
  (globalThis as { EyeDropper?: new () => EyeDropperApi }).EyeDropper;

/**
 * Its eyedropper (Figma's leading button): a `Button` (or what it
 * renders), picking a color off the screen (the browser's `EyeDropper`;
 * none without it).
 */
const Eyedropper: React.FunctionComponent<ColorPickerEyedropperProps> = ({
  render,
  ...props
}) => {
  const { color, setColor } = useContext(PickerContext);
  const Picker = eyeDropper();
  if (!Picker) return null;

  const pick = () => {
    new Picker()
      .open()
      .then(({ sRGBHex }) => setColor({ ...parseColor(sRGBHex), a: color.a }))
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

/** A color well (UIKit `UIColorWell`): its color, opening the picker. */
const Well = forwardRef<HTMLButtonElement, ColorWellProps>(
  ({ color, size = 'small', style, ...props }, ref) => (
    <button
      ref={ref}
      aria-label="Color"
      data-color={color === undefined ? undefined : ''}
      data-size={size}
      type="button"
      style={
        color === undefined
          ? style
          : ({
              ...(style as React.CSSProperties | undefined),
              '--styled-well-color': color,
            } as React.CSSProperties)
      }
      {...props}
      className={cn('bus-color-picker-well', props.className)}
    />
  ),
);

export const ColorPicker = {
  Root,
  Header,
  Panel,
  Eyedropper,
  Well,
};
