import './card-kit.css';

import {
  type CSSProperties,
  FunctionComponent,
  type ReactNode,
  useLayoutEffect,
  useState,
} from 'react';

import {
  Slider,
  Symbol,
  type SymbolIcon,
  useGridItem,
} from '../../components/index.js';
import { sfArrowRight } from './icons.js';

// What the demos' cards build from the library's parts (an app's own, not
// the library's: too specific for it): channel sliders (several in one
// card, as bars), a trend arrow, the colors a light's channels make, rows
// that fit, a sparkline, generated artwork, a bar chart, a dial, an
// hourly forecast.

/** A light channel (see `ChannelSliders`): 0 to 1. */
export type Channel = {
  /** Its name, short (e.g. “R”), shown on its bar. */
  label: string;
  /** Its accessible name (e.g. “Red”). */
  name: string;
  /** Its bar's color. */
  tint: string;
  value: number;
};

/**
 * A card's sliders as bars side by side (upright) in a tile taller than
 * one row, else stacked across: one per channel, each its name on it, in
 * its tint. Between the card's top row and its title (see the CSS).
 */
export const ChannelSliders: FunctionComponent<{
  channels: readonly Channel[];
  onChange: (index: number, value: number) => void;
}> = ({ channels, onChange }) => {
  const [, rows = '1'] = (useGridItem()?.size ?? '2x2').split('x');
  const orientation = rows === '1' ? 'horizontal' : 'vertical';
  return (
    <div
      className="demo-channels"
      data-orientation={orientation}
    >
      {channels.map(({ label, name, tint, value }, index) => (
        <Slider.Root
          key={name}
          format={{ style: 'percent' }}
          max={1}
          min={0}
          orientation={orientation}
          step={0.01}
          tint={tint}
          value={value}
          onValueChange={(next) => onChange(index, next as number)}
        >
          <Slider.Control>
            <Slider.Track>
              <Slider.Indicator />
              <Slider.Thumb aria-label={name} />
            </Slider.Track>
          </Slider.Control>
          <Slider.Label aria-hidden="true">{label}</Slider.Label>
        </Slider.Root>
      ))}
    </div>
  );
};

/** A trend's words, by its angle (see `Trend`). */
const trendOf = (angle: number) => {
  if (angle > 10) return 'rising';
  return angle < -10 ? 'falling' : 'steady';
};

/**
 * A value's trend: an arrow pointing up as steeply as it rises (`angle`,
 * -90 to 90 degrees: 0 steady), named for assistive technology (rising,
 * falling, steady). It turns to a new angle by its own transform.
 */
export const Trend: FunctionComponent<{ angle: number }> = ({ angle }) => {
  const clamped = Math.max(-90, Math.min(90, angle));
  return (
    <span
      aria-label={trendOf(clamped)}
      className="demo-trend"
      role="img"
      style={{ '--demo-trend-angle': String(clamped) } as CSSProperties}
    >
      <Symbol icon={sfArrowRight} />
    </span>
  );
};

/**
 * A color temperature's color (in kelvin, about 2000 to 6500): warm to
 * cool, interpolated between a few points (close enough for a demo).
 */
export const kelvinColor = (kelvin: number): string => {
  const stops: readonly (readonly [number, string])[] = [
    [2000, '#ff8b27'],
    [2700, '#ffa757'],
    [3500, '#ffc48f'],
    [4500, '#ffdcbc'],
    [5500, '#fff0e9'],
    [6500, '#f5f3ff'],
  ];
  const upper = stops.findIndex(([k]) => k >= kelvin);
  if (upper <= 0) return stops[upper === 0 ? 0 : stops.length - 1]?.[1] ?? '';
  const [k0, c0] = stops[upper - 1] ?? stops[0] ?? [0, ''];
  const [k1, c1] = stops[upper] ?? [0, ''];
  const share = Math.round(((kelvin - k0) / (k1 - k0)) * 100);
  return `color-mix(in srgb, ${c1} ${String(share)}%, ${c0})`;
};

/**
 * What a light's channels make together (each 0 to 1, by its tint): the
 * colors mixed by their shares (white ones too), at full strength; none
 * on: none.
 */
export const mixColor = (channels: readonly Channel[]): string | undefined => {
  const lit = channels.filter(({ value }) => value > 0);
  const total = lit.reduce((sum, { value }) => sum + value, 0);
  if (total === 0) return undefined;
  // (color-mix of two at a time, each step weighting the next by its share
  // of what's mixed so far.)
  let mixed = lit[0]?.tint ?? '';
  let sum = lit[0]?.value ?? 0;
  for (const { tint, value } of lit.slice(1)) {
    sum += value;
    const share = Math.round((value / sum) * 100);
    mixed = `color-mix(in oklab, ${tint} ${String(share)}%, ${mixed})`;
  }
  return mixed;
};

/**
 * How many rows of a list in a card fit in it whole (its box fills its
 * room in the card, see Card, whatever's in it): by its height and a row's
 * (36px in a card), at least one; as the card's size changes too. A ref
 * callback for the list (it may appear later, e.g. as the card grows).
 */
export const useRowsThatFit = (
  rowHeight = 36,
): readonly [ref: (list: HTMLElement | null) => void, count: number] => {
  const [list, setList] = useState<HTMLElement | null>(null);
  const [count, setCount] = useState(1);
  useLayoutEffect(() => {
    if (!list) return undefined;
    const update = () =>
      setCount(Math.max(1, Math.floor(list.clientHeight / rowHeight)));
    update();
    const observer = new ResizeObserver(update);
    observer.observe(list);
    return () => observer.disconnect();
  }, [list, rowHeight]);
  return [setList, count];
};

/**
 * A sparkline: a series' course as a line across its box (the card's
 * layout's middle row, see the CSS), in its text's color, at its lowest and
 * highest values the box's bottom and top; its last value a dot. Named for
 * assistive technology by its `label`.
 */
export const Sparkline: FunctionComponent<{
  label: string;
  values: readonly number[];
}> = ({ label, values }) => {
  const low = Math.min(...values);
  const high = Math.max(...values);
  const range = high - low || 1;
  const points = values.map(
    (value, index) =>
      [
        (index / Math.max(1, values.length - 1)) * 100,
        100 - ((value - low) / range) * 100,
      ] as const,
  );
  const last = points.at(-1) ?? [100, 50];
  return (
    <span
      aria-label={label}
      className="demo-sparkline"
      role="img"
    >
      <svg
        preserveAspectRatio="none"
        viewBox="-2 -6 104 112"
      >
        <polyline
          fill="none"
          points={points.map(([x, y]) => `${String(x)},${String(y)}`).join(' ')}
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      <span
        className="demo-sparkline-dot"
        style={{ insetBlockStart: `${String(last[1])}%` }}
      />
    </span>
  );
};

/**
 * Album artwork, generated (no image: a few soft color fields, by `hue`):
 * filling its card behind its content (`fill`, a scrim at its bottom for
 * the text over it), or as a small square (a symbol's).
 */
export const Artwork: FunctionComponent<{ fill?: boolean; hue: number }> = ({
  fill = false,
  hue,
}) => (
  <span
    aria-hidden="true"
    className={fill ? 'demo-artwork' : 'demo-artwork-thumb'}
    style={{ '--demo-artwork-hue': String(hue) } as CSSProperties}
  />
);

/**
 * A day's values as bars (one an hour), the current hour's in `tint`, a few
 * hours named under them; between a card's top row and its title.
 */
export const BarChart: FunctionComponent<{
  current: number;
  label: string;
  tint: string;
  values: readonly number[];
}> = ({ current, label, tint, values }) => {
  const high = Math.max(...values) || 1;
  return (
    <span
      aria-label={label}
      className="demo-barchart"
      role="img"
      style={{ '--demo-barchart-tint': tint } as CSSProperties}
    >
      <span className="demo-barchart-bars">
        {values.map((value, index) => (
          <span
            key={index}
            data-current={index === current ? '' : undefined}
            data-future={index > current ? '' : undefined}
            style={{
              blockSize: `${String(Math.max(4, (value / high) * 100))}%`,
            }}
          />
        ))}
      </span>
      <span
        aria-hidden="true"
        className="demo-barchart-hours"
      >
        {['0', '6', '12', '18', '24'].map((hour) => (
          <span key={hour}>{hour}</span>
        ))}
      </span>
    </span>
  );
};

/**
 * A dial: an arc (three quarters of a turn, its gap at the bottom) filled
 * to `value` (0 to 1) in `tint`, a knob at its end; in its middle, what it
 * sets (`children`). As large as its room, square.
 */
export const Dial: FunctionComponent<{
  children?: ReactNode;
  tint: string;
  value: number;
}> = ({ children, tint, value }) => {
  // (The arc: from 135° (bottom leading) clockwise by 270°.)
  const arc = 'M 21.7 78.3 A 40 40 0 1 1 78.3 78.3';
  const angle = ((135 + value * 270) * Math.PI) / 180;
  return (
    <span
      className="demo-dial"
      style={{ '--demo-dial-tint': tint } as CSSProperties}
    >
      <svg
        aria-hidden="true"
        className="demo-dial-arcs"
        viewBox="0 0 100 100"
      >
        <path
          className="demo-dial-track"
          d={arc}
          pathLength={100}
        />
        <path
          className="demo-dial-value"
          d={arc}
          pathLength={100}
          strokeDasharray={`${String(value * 100)} 100`}
        />
        <circle
          className="demo-dial-knob"
          cx={50 + 40 * Math.cos(angle)}
          cy={50 + 40 * Math.sin(angle)}
          r={5.5}
        />
      </svg>
      <span className="demo-dial-center">{children}</span>
    </span>
  );
};

/** An hour of a forecast (see `HourStrip`). */
export type Hour = readonly [
  hour: string,
  icon: SymbolIcon,
  temperature: string,
];

/**
 * A forecast's hours in columns (its hour, its sky, its temperature), as
 * many as fit its width whole (56px each, at least two); a well in the
 * card's glass, between its top row and its title.
 */
export const HourStrip: FunctionComponent<{ hours: readonly Hour[] }> = ({
  hours,
}) => {
  const [strip, setStrip] = useState<HTMLElement | null>(null);
  const [count, setCount] = useState(4);
  useLayoutEffect(() => {
    if (!strip) return undefined;
    const update = () =>
      setCount(Math.max(2, Math.floor(strip.clientWidth / 56)));
    update();
    const observer = new ResizeObserver(update);
    observer.observe(strip);
    return () => observer.disconnect();
  }, [strip]);
  return (
    <span
      ref={setStrip}
      className="demo-hours"
    >
      {hours.slice(0, count).map(([hour, icon, temperature]) => (
        <span key={hour}>
          <span className="demo-hours-hour">{hour}</span>
          <Symbol icon={icon} />
          <span className="demo-hours-temperature">{temperature}</span>
        </span>
      ))}
    </span>
  );
};
