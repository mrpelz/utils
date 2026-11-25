import { Slider as BaseSlider } from '@base-ui/react/slider';
import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { useSettings } from '../settings/main.js';
import { cn, withStyle } from '../utils/main.js';
import {
  colorAt,
  colorAtLinear,
  cssOf,
  linearOf,
  type LinearRgb,
  textSchemeOn,
} from './color.js';
import { pressProps } from './press.js';
import type {
  CardChannelProps,
  CardChannelsProps,
  CardLight,
} from './props.js';
import {
  formattedShare,
  percentFormat,
  shareOf,
  useControlled,
} from './shared.js';

// A card's channels (`Card.Channels` of `Card.Channel`s): sliders, each in
// a well of its own, stacked (e.g. a light's red, green and blue); the
// light they make together, told (`onLightChange`).

/**
 * The light a channel gives (see `Channels`): an amount's (its tint, by its
 * share), or a scale's (its color at its value).
 */
type ChannelLight = {
  kind: 'amount' | 'scale';
  rgb: LinearRgb;
  share: number;
};

/** Where a channel reports the light it gives (see `Channels`). */
type ChannelReport = (id: string, light: ChannelLight | undefined) => void;

/** A card's channels' own, for each channel: where it reports its light. */
const ChannelsContext = createContext<ChannelReport | undefined>(undefined);

/**
 * What a ready-made card holding channels tells them (see ControlCards'
 * `Light`): whether they're shown (mounted either way, telling it the light
 * they give), and where the light they make goes. Internal.
 */
type ChannelsHost = {
  isShown: boolean;
  onLightChange: (light: CardLight) => void;
};
export const ChannelsHostContext = createContext<ChannelsHost | undefined>(
  undefined,
);

/**
 * What a light's channels make together: the amounts added up, tinted by
 * the scales (multiplied: e.g. a brightness, by a color temperature), at
 * full strength (its strongest channel full: its color, not how bright,
 * see its value); none giving any, none.
 */
const lightColorOf = (lights: readonly ChannelLight[]) => {
  const amounts = lights.filter(({ kind }) => kind === 'amount');
  let rgb: [number, number, number] =
    amounts.length === 0 ? [1, 1, 1] : [0, 0, 0];
  for (const {
    rgb: [red, green, blue],
  } of amounts) {
    rgb = [rgb[0] + red, rgb[1] + green, rgb[2] + blue];
  }
  for (const {
    kind,
    rgb: [red, green, blue],
  } of lights) {
    if (kind === 'scale') rgb = [rgb[0] * red, rgb[1] * green, rgb[2] * blue];
  }
  const strongest = Math.max(...rgb);
  return strongest <= 0
    ? undefined
    : cssOf([rgb[0] / strongest, rgb[1] / strongest, rgb[2] / strongest]);
};

/** Its well's measures (px): its thumb's inset, its size; its labels'. */
const channelInset = 4;
const channelThumb = 28;
const channelPadding = 12;
const channelGap = 6;
/** How far its thumb clears a label moved away before it moves back. */
const channelSlack = 8;

/**
 * A channel's colors as computed (vars, `light-dark()` resolved where it's
 * drawn: its probes', see `Channel`), read as they or the color scheme
 * change; and in linear light.
 */
const useResolvedColors = (
  probes: { current: HTMLElement | null },
  colors: readonly string[],
) => {
  const { colorScheme } = useSettings();
  const colorKey = colors.join('|');
  const [resolved, setResolved] = useState<readonly string[]>([]);
  useLayoutEffect(() => {
    const { current: element } = probes;
    if (!element) return;
    const read = () => {
      const next = [...element.children].map(
        (probe) => getComputedStyle(probe).color,
      );
      setResolved((last) => (last.join('|') === next.join('|') ? last : next));
    };
    read();
  }, [colorKey, colorScheme, probes]);
  const linear = useMemo(
    () =>
      resolved
        .map((color) => linearOf(color))
        .filter((rgb): rgb is LinearRgb => rgb !== undefined),
    [resolved],
  );
  return { linear, resolved };
};

/**
 * The light a channel gives, told its channels (see `Channels`): an
 * amount's tint by its share, a scale's color at it; gone, none.
 */
const useChannelReport = (
  linear: readonly LinearRgb[],
  isScale: boolean,
  share: number,
) => {
  const report = useContext(ChannelsContext);
  const id = useId();
  useLayoutEffect(() => {
    if (!report) return;
    const [own] = linear;
    const rgb = isScale
      ? colorAtLinear(linear, share)
      : own && ([own[0] * share, own[1] * share, own[2] * share] as const);
    report(id, rgb && { kind: isScale ? 'scale' : 'amount', rgb, share });
  }, [id, isScale, linear, report, share]);
  useLayoutEffect(() => () => report?.(id, undefined), [id, report]);
};

/**
 * A channel's own properties (see the CSS): the light at its thumb, a
 * scale's colors along its well (their stops from its thumb's center at
 * one end to it at the other), its share, its tint.
 */
const channelStyleOf = (
  scale: readonly string[] | undefined,
  share: number,
  tint: string | undefined,
) => {
  const middle = channelInset + channelThumb / 2;
  return {
    '--uikit-card-channel-light': scale
      ? colorAt(scale, share)
      : `color-mix(in srgb-linear, var(--uikit-card-channel-tint) ${String(share * 100)}%, black)`,
    '--uikit-card-channel-scale': scale
      ?.map(
        (color, index) =>
          `${color} calc(${String(middle)}px + (100% - ${String(2 * middle)}px) * ${String(index / (scale.length - 1))})`,
      )
      .join(', '),
    '--uikit-card-channel-share': String(share),
    '--uikit-card-channel-tint': tint,
  };
};

/** An amount's fill's edge (px, from its start; see `placeChannelLabels`). */
const fillEdgeOf = (width: number, share: number) => {
  if (share <= 0) return 0;
  if (share >= 1) return width;
  const middle = channelInset + channelThumb / 2;
  return middle + (width - 2 * middle) * share;
};

/**
 * A channel's labels placed (see `Channel`): its name at its start, its
 * value at its end, the one its thumb would cover beside the other (back
 * once the thumb's clear of it by `channelSlack`), each in the color scheme
 * of what's under its center (an amount's fill, by its tint, see
 * `textSchemeOn`; or its well; a scale's color there). Which were moved,
 * for the next time.
 */
const placeChannelLabels = ({
  element,
  linear,
  moved,
  named,
  scale,
  share,
  tint,
  valued,
}: {
  element: HTMLElement;
  linear: readonly LinearRgb[];
  moved: { name: boolean; value: boolean };
  named: HTMLElement;
  scale: boolean;
  share: number;
  tint: string | undefined;
  valued: HTMLElement;
}) => {
  const width = element.clientWidth;
  const nameWidth = named.offsetWidth;
  const valueWidth = valued.offsetWidth;
  // (Its thumb, from its start: as Base UI insets it, see `Channel`.)
  const thumbStart =
    channelInset + (width - 2 * channelInset - channelThumb) * share;
  const thumbEnd = thumbStart + channelThumb;
  const nameAt = [channelPadding, channelPadding + nameWidth] as const;
  const valueAt = [
    width - channelPadding - valueWidth,
    width - channelPadding,
  ] as const;
  const isOver = ([from, to]: readonly [number, number], wasMoved: boolean) => {
    const slack = wasMoved ? channelSlack : 0;
    return thumbEnd > from - slack && thumbStart < to + slack;
  };
  const nameMoved = isOver(nameAt, moved.name);
  const valueMoved = !nameMoved && isOver(valueAt, moved.value);
  const nameX = nameMoved ? valueAt[0] - channelGap - nameWidth : nameAt[0];
  const valueX = valueMoved ? nameAt[1] + channelGap : valueAt[0];
  const sign = getComputedStyle(element).direction === 'rtl' ? -1 : 1;
  // (An amount's fill's edge, from its start: its thumb's center, its ends
  // all the way, see the CSS.)
  const edge = fillEdgeOf(width, share);
  const schemeAt = (center: number) => {
    if (scale) {
      const rgb = colorAtLinear(linear, center / width);
      return rgb && textSchemeOn(cssOf(rgb));
    }
    return center < edge && tint ? textSchemeOn(tint) : undefined;
  };
  for (const [label, x, labelWidth] of [
    [named, nameX, nameWidth],
    [valued, valueX, valueWidth],
  ] as const) {
    label.style.translate = `${String(sign * x)}px 0`;
    const scheme = schemeAt(x + labelWidth / 2);
    label.style.colorScheme = scheme ?? '';
    if (scheme) label.dataset.colorScheme = scheme;
    else delete label.dataset.colorScheme;
  }
  // (Placed where it starts without sliding there; from then on, sliding,
  // see the CSS.)
  if (element.dataset.placed === undefined) {
    requestAnimationFrame(() => {
      element.dataset.placed = '';
    });
  }
  return { name: nameMoved, value: valueMoved };
};

/** The light its channels make together (see `CardLight`). */
const lightOf = (lights: readonly ChannelLight[]): CardLight => {
  const amounts = lights.filter(({ kind }) => kind === 'amount');
  return {
    brightness:
      amounts.length === 0 ? 1 : Math.max(...amounts.map(({ share }) => share)),
    color: lightColorOf(lights),
  };
};

/**
 * A card's channels (e.g. a light's red, green and blue): its sliders
 * (`Channel`s, its children), each in a well of its own, stacked at its
 * bottom, whatever its width. The light they make together told as it
 * changes (`onLightChange`: their color, their brightness). In a
 * ready-made light card, shown only while it's large (mounted all the
 * same, unseen, telling it the light they give).
 */
export const Channels = forwardRef<HTMLDivElement, CardChannelsProps>(
  ({ children, className, hidden, onLightChange, ...props }, ref) => {
    const host = useContext(ChannelsHostContext);
    const [lights, setLights] = useState<
      Readonly<Record<string, ChannelLight>>
    >({});
    const report = useCallback(
      (id: string, light: ChannelLight | undefined) =>
        setLights((last) => {
          const before = last[id];
          if (
            before?.kind === light?.kind &&
            before?.share === light?.share &&
            before?.rgb.join(',') === light?.rgb.join(',')
          ) {
            return last;
          }
          const next = { ...last };
          if (light) next[id] = light;
          else delete next[id];
          return next;
        }),
      [],
    );
    const light = useMemo(() => lightOf(Object.values(lights)), [lights]);
    const latest = useRef({ host, onLightChange });
    useLayoutEffect(() => {
      latest.current = { host, onLightChange };
    });
    // (Told as it changes, before it's painted: a ready-made card's
    // symbol in its color at once.)
    useLayoutEffect(() => {
      latest.current.onLightChange?.(light);
      latest.current.host?.onLightChange(light);
    }, [light]);
    return (
      <div
        ref={ref}
        {...props}
        className={cn('uikit-card-channels', className)}
        // (Its presses its channels', not its card's: no press tint on the
        // card, see Card.)
        data-card-own-press=""
        data-card-part="channels"
        hidden={hidden ?? (host ? !host.isShown : undefined)}
      >
        <ChannelsContext.Provider value={report}>
          {children}
        </ChannelsContext.Provider>
      </div>
    );
  },
);

/**
 * A channel: Base UI's slider in a well of its own, its thumb round, kept
 * inside it (`thumbAlignment: 'edge'`), filled with the light it gives. An
 * amount (`tint`): filled from its start in its tint as far as its thumb's
 * center (all the way at its ends, sliding there), its thumb its tint mixed
 * on black by its share (in linear light, as light adds up: none, black).
 * A scale (`colors`): its colors along its well, its thumb the color at its
 * value. Its label at its start, its value at its end; the one its thumb
 * would cover sliding to the other end, beside the other, and back once
 * the thumb's clear of it again. Each label's color scheme by one sample
 * under its center (the fill's, by its tint, see `textSchemeOn`; the
 * well's; a scale's color there), its colors read as they or the color
 * scheme change. A press held back until it's a drag along it (a touch
 * across it the page's scroll); then its touch held from the page.
 */
export const Channel = forwardRef<HTMLDivElement, CardChannelProps>(
  (
    {
      children,
      className,
      colors,
      defaultValue,
      format = percentFormat,
      getAriaValueText,
      label,
      locale,
      max = 100,
      min = 0,
      onValueChange,
      step,
      style,
      tint,
      value,
      ...props
    },
    ref,
  ) => {
    const [current, setCurrent] = useControlled(value, defaultValue ?? min);
    const share = shareOf(current, min, max);
    const scale = colors && colors.length >= 2 ? colors : undefined;
    const formattedValue = formattedShare(current, share, { format, locale });
    const text = children ? children(formattedValue, current) : formattedValue;

    // (Its colors resolved, see `useResolvedColors`; the light it gives
    // told its channels, see `useChannelReport`.)
    const probes = useRef<HTMLSpanElement>(null);
    const probed = scale ?? [tint ?? 'var(--color-ui-primary)'];
    const { linear, resolved } = useResolvedColors(probes, probed);
    useChannelReport(linear, scale !== undefined, share);

    // (Its labels placed (see above), each in its color scheme: written as
    // its value or its labels' sizes change, not rendered.)
    const well = useRef<HTMLDivElement>(null);
    const nameLabel = useRef<HTMLSpanElement>(null);
    const valueLabel = useRef<HTMLSpanElement>(null);
    const moved = useRef({ name: false, value: false });
    const place = useRef<() => void>(() => undefined);
    useLayoutEffect(() => {
      place.current = () => {
        const { current: element } = well;
        const { current: named } = nameLabel;
        const { current: valued } = valueLabel;
        if (!element || !named || !valued) return;
        moved.current = placeChannelLabels({
          element,
          linear,
          moved: moved.current,
          named,
          scale: scale !== undefined,
          share,
          tint: resolved[0],
          valued,
        });
      };
      place.current();
    });
    useLayoutEffect(() => {
      const observer = new ResizeObserver(() => place.current());
      for (const element of [
        well.current,
        nameLabel.current,
        valueLabel.current,
      ]) {
        if (element) observer.observe(element);
      }
      return () => observer.disconnect();
    }, []);

    // (Dragged (handed on to it, see `pressProps`): its touch's moves not
    // the page's; not passive, as React's listeners are.)
    useLayoutEffect(() => {
      const { current: element } = well;
      if (!element) return undefined;
      const hold = (move: TouchEvent) => {
        if (element.closest('[data-dragging]') && move.cancelable) {
          move.preventDefault();
        }
      };
      element.addEventListener('touchmove', hold, { passive: false });
      return () => element.removeEventListener('touchmove', hold);
    }, []);

    // (At an end, its fill all the way, see the CSS.)
    let edge: 'max' | 'min' | undefined;
    if (share <= 0) edge = 'min';
    if (share >= 1) edge = 'max';
    return (
      <BaseSlider.Root
        ref={ref}
        {...props}
        className={cn('uikit-card-channel', className)}
        data-card-part="channel"
        data-scale={scale ? '' : undefined}
        format={format}
        locale={locale}
        max={max}
        min={min}
        step={step ?? (max - min) / 100}
        style={withStyle(channelStyleOf(scale, share, tint), style)}
        thumbAlignment="edge"
        value={current}
        onValueChange={(next) => {
          setCurrent(next as number);
          onValueChange?.(next as number);
        }}
        // (A press held back until it's a drag along it; a touch across it
        // the page's scroll, see `pressProps`.)
        {...pressProps(undefined, 'horizontal')}
      >
        <div
          ref={well}
          className="uikit-card-channel-well"
        >
          {scale ? null : (
            <span
              aria-hidden="true"
              className="uikit-card-channel-fill"
              data-edge={edge}
            />
          )}
          <span
            ref={probes}
            hidden
            aria-hidden="true"
          >
            {probed.map((color, index) => (
              <span
                key={index}
                style={{ color }}
              />
            ))}
          </span>
          <span
            ref={nameLabel}
            aria-hidden="true"
            className="uikit-card-channel-label"
          >
            {label}
          </span>
          <span
            ref={valueLabel}
            aria-hidden="true"
            className="uikit-card-channel-value"
          >
            {text}
          </span>
          <BaseSlider.Control className="uikit-card-channel-control">
            <BaseSlider.Track className="uikit-card-channel-track">
              <BaseSlider.Thumb
                aria-label={label}
                className="uikit-card-channel-thumb"
                getAriaValueText={
                  getAriaValueText
                    ? (formattedThumb, thumbValue) =>
                        getAriaValueText(formattedThumb, thumbValue)
                    : undefined
                }
              />
            </BaseSlider.Track>
          </BaseSlider.Control>
        </div>
      </BaseSlider.Root>
    );
  },
);
