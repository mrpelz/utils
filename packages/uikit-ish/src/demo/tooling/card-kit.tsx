import './card-kit.css';

import {
  type CSSProperties,
  FunctionComponent,
  type ReactNode,
  useLayoutEffect,
  useState,
} from 'react';

import { Symbol, type SymbolIcon } from '../../components/index.js';

// What the demos' cards build beyond the library's (ControlCards and
// Card): an app's own, too specific for the library: their tints, a color
// temperature's color, a sparkline, generated artwork, a bar chart, a
// dial, an hourly forecast.

/**
 * The demos' slider cards' tints (the fill filling the card, its text
 * drawn over it in its tone's color, see Card): a lamp's warm amber,
 * a heater's orange, daylight's blue for blinds.
 */
export const cardTints = {
  air: 'oklch(76% 0.12 195)',
  heat: 'oklch(72% 0.17 50)',
  light: 'oklch(84% 0.15 85)',
  shade: 'oklch(80% 0.09 230)',
} as const;

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
