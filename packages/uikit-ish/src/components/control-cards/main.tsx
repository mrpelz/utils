import '../card/style.css';
import '../list/style.css';
import '../progress/style.css';
import './style.css';

import {
  type CSSProperties,
  forwardRef,
  type MouseEvent,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
  type TouchEvent as ReactTouchEvent,
  useContext,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';

import { Badge } from '../badge/main.js';
import {
  Card,
  CardBlendScope,
  type CardOrientation,
  useCardOrientation,
} from '../card/main.js';
import {
  type BackdropTone,
  colorSchemeStyle,
  toneOfColor,
} from '../glass/main.js';
import { measureOf } from '../grid/handle.js';
import { iconOf, polyline } from '../grid/icons.js';
import { gridIcons, useGridItem } from '../grid/main.js';
import { forwardClick, List } from '../list/main.js';
import { Progress } from '../progress/main.js';
import { useSettings } from '../settings/main.js';
import { Slider } from '../slider/main.js';
import { Symbol, type SymbolIcon } from '../symbol/main.js';
import { cn } from '../utils/main.js';
import type {
  ControlCardButtonProps,
  ControlCardChannel,
  ControlCardChannelsProps,
  ControlCardExpandButtonProps,
  ControlCardFormat,
  ControlCardLightProps,
  ControlCardListProps,
  ControlCardOpenButtonsProps,
  ControlCardProgressProps,
  ControlCardSliderFillProps,
  ControlCardSliderProps,
  ControlCardStateProps,
  ControlCardSwitchProps,
  ControlCardTrendProps,
  ControlCardValueProps,
  ControlCardValueTextDetails,
} from './props.js';

export type {
  ControlCardButtonProps,
  ControlCardChannel,
  ControlCardChannelsProps,
  ControlCardExpandButtonProps,
  ControlCardFormat,
  ControlCardLightProps,
  ControlCardListProps,
  ControlCardOpenButtonsProps,
  ControlCardProgressProps,
  ControlCardProps,
  ControlCardRow,
  ControlCardSliderFillProps,
  ControlCardSliderProps,
  ControlCardStateProps,
  ControlCardStates,
  ControlCardSwitchProps,
  ControlCardTextStates,
  ControlCardTrendProps,
  ControlCardValueProps,
  ControlCardValueTextDetails,
} from './props.js';

// Control cards: ready-made cards (each a `Card.Root` and its parts) for
// what a home's devices show and control: a state, a switch, a value, a
// slider, a momentary button, a progress, a light of several channels, a
// list; and what they're made of besides (a light's bars, corner buttons
// expanding a card and opening it above the page). A namespace, not one
// component's parts: each card stands on its own, its other props its
// `Card.Root`'s, its `children` added after its parts (e.g. a corner
// button).

/** Controlled or uncontrolled state (as Base UI's components). */
const useControlled = <T,>(
  value: T | undefined,
  defaultValue: T,
): [T, (next: T) => void] => {
  const [state, setState] = useState(defaultValue);
  return [value === undefined ? state : value, setState];
};

/** The document's language, if it says (none: the runtime's default). */
const documentLocale = () =>
  typeof document === 'undefined'
    ? undefined
    : document.documentElement.lang || undefined;

/** A number, formatted (see `ControlCardFormat`). */
const formatted = (value: number, { format, locale }: ControlCardFormat) =>
  new Intl.NumberFormat(locale ?? documentLocale(), format).format(value);

/**
 * Whether its card shows its large layout: its tile at least 2x2 (a full
 * width's: wide), however it got there (expanded, resized), or open above
 * the page.
 */
const useIsLarge = () => {
  const item = useGridItem();
  if (!item) return false;
  const [columns = '1', rows = '1'] = item.size.split('x');
  return (
    item.open ||
    ((columns === '*' || Number(columns) >= 2) && Number(rows) >= 2)
  );
};

/** Its symbol: its icon, or its emphasized one while on. */
const symbolOf = (
  { emphasizedIcon, icon }: { emphasizedIcon?: SymbolIcon; icon: SymbolIcon },
  children?: ReactNode,
) => (
  <Symbol
    emphasizedIcon={emphasizedIcon}
    icon={icon}
  >
    {children}
  </Symbol>
);

/**
 * A binary display: its state lit (`active`), its symbol emphasized, its
 * value its state's words (e.g. a door open or closed).
 */
const State = forwardRef<HTMLDivElement, ControlCardStateProps>(
  (
    {
      active,
      children,
      className,
      emphasizedIcon,
      icon,
      name,
      states = ['On', 'Off'],
      ...props
    },
    ref,
  ) => (
    <Card.Root
      ref={ref}
      active={active}
      {...props}
      className={cn('uikit-control-cards-state', className)}
      data-control-cards-part="state"
    >
      <Card.Symbol>{symbolOf({ emphasizedIcon, icon })}</Card.Symbol>
      <Card.Title>{name}</Card.Title>
      <Card.Value>{active ? states[0] : states[1]}</Card.Value>
      {children}
    </Card.Root>
  ),
);

/**
 * A binary control: a switch at its top trailing corner, a press on the
 * card toggling it; lit while on.
 */
const SwitchCard = forwardRef<HTMLDivElement, ControlCardSwitchProps>(
  (
    {
      checked,
      children,
      className,
      defaultChecked = false,
      emphasizedIcon,
      icon,
      name,
      onCheckedChange,
      onClick,
      states = ['On', 'Off'],
      tint,
      ...props
    },
    ref,
  ) => {
    const [isOn, setIsOn] = useControlled(checked, defaultChecked);
    const switchTo = (next: boolean) => {
      setIsOn(next);
      onCheckedChange?.(next);
    };
    return (
      <Card.Root
        ref={ref}
        active={isOn}
        {...props}
        className={cn('uikit-control-cards-switch', className)}
        data-control-cards-part="switch"
        onClick={onClick ?? forwardClick('[role=switch]')}
      >
        <Card.Symbol tint={tint}>
          {symbolOf({ emphasizedIcon, icon })}
        </Card.Symbol>
        <Card.Title>{name}</Card.Title>
        <Card.Value>{isOn ? states[0] : states[1]}</Card.Value>
        <Card.Switch
          aria-label={name}
          checked={isOn}
          tint={tint}
          onCheckedChange={switchTo}
        />
        {children}
      </Card.Root>
    );
  },
);

/** A trend's arrow (see `Trend`): pointing ahead, turned by its angle. */
const trendIcon = iconOf(
  'control-cards.trend',
  polyline([-4.5, 0], [4.5, 0]) + polyline([0.5, -4], [4.5, 0], [0.5, 4]),
);

/** A trend's words, by its angle (see `Trend`). */
const trendOf = (angle: number) => {
  if (angle > 10) return 'rising';
  return angle < -10 ? 'falling' : 'steady';
};

/**
 * A value's trend: an arrow pointing up as steeply as it rises (`angle`,
 * -90 to 90 degrees: 0 steady), named for assistive technology. It turns
 * to a new angle by its own transform.
 */
const Trend = ({ angle }: ControlCardTrendProps): ReactNode => {
  const clamped = Math.max(-90, Math.min(90, angle));
  return (
    <span
      aria-label={trendOf(clamped)}
      className="uikit-control-cards-trend"
      role="img"
      style={
        { '--uikit-control-cards-trend': String(clamped) } as CSSProperties
      }
    >
      <Symbol icon={trendIcon} />
    </span>
  );
};

/**
 * A numerical display: its value, formatted as the app says, and its
 * trend (an arrow after it), if given.
 */
const Value = forwardRef<HTMLDivElement, ControlCardValueProps>(
  (
    {
      children,
      className,
      emphasizedIcon,
      format,
      icon,
      locale,
      name,
      trend,
      value,
      ...props
    },
    ref,
  ) => (
    <Card.Root
      ref={ref}
      {...props}
      className={cn('uikit-control-cards-value', className)}
      data-control-cards-part="value"
    >
      <Card.Symbol>{symbolOf({ emphasizedIcon, icon })}</Card.Symbol>
      <Card.Title>{name}</Card.Title>
      <Card.Value>
        {typeof value === 'number'
          ? formatted(value, { format, locale })
          : value}
        {trend === undefined ? null : <Trend angle={trend} />}
      </Card.Value>
      {children}
    </Card.Root>
  ),
);

// How far a press moves before it's a drag (px; the grid's resize
// handle's, see Grid's edit.ts).
const pressSlop = 4;

// (A press handed on to the slider (see `pressProps`): let through; one
// held back, not yet a drag or a click: its touch held back too.)
let isHandingOn = false;
let isHolding = false;

/**
 * A slider's press (its `Slider.Root`'s props): a drag goes to the slider,
 * from where it was pressed; a click (released before it moves
 * `pressSlop`) is `onClick`'s, the slider never told (its value kept).
 * Its click, if the browser moves it to a control near it (e.g. the
 * card's switch, a tap's target adjusted, as WebKit's on iOS), not that
 * control's too (toggled back): swallowed. (Not the click deciding: on
 * iOS, none may come to it.)
 * Held back at first (the slider would set its value as it's pressed),
 * then handed on (the press again, where it started) once it's a drag.
 * None: the slider's own.
 */
const pressProps = (
  onClick: (() => void) | undefined,
): {
  onPointerDownCapture?: (event: ReactPointerEvent<HTMLElement>) => void;
  onTouchStartCapture?: (event: ReactTouchEvent<HTMLElement>) => void;
} => {
  if (onClick === undefined) return {};
  const click = onClick;
  return {
    onPointerDownCapture: (event) => {
      if (isHandingOn || event.button !== 0) return;
      event.stopPropagation();
      // (The DOM's event: React's wraps it, Preact's is it.)
      const pressed =
        (event as { nativeEvent?: PointerEvent }).nativeEvent ??
        (event as unknown as PointerEvent);
      const { clientX, clientY, pointerId, target } = pressed;
      const root = event.currentTarget;
      const listening = new AbortController();
      const options = { capture: true, signal: listening.signal };
      isHolding = true;
      listening.signal.addEventListener('abort', () => {
        isHolding = false;
      });
      addEventListener(
        'pointermove',
        (move) => {
          if (move.pointerId !== pointerId) return;
          const moved = Math.hypot(
            move.clientX - clientX,
            move.clientY - clientY,
          );
          if (moved < pressSlop) return;
          listening.abort();
          // (A drag: the press handed on, as it was.)
          isHandingOn = true;
          try {
            target?.dispatchEvent(new PointerEvent('pointerdown', pressed));
          } finally {
            isHandingOn = false;
          }
        },
        options,
      );
      addEventListener(
        'pointerup',
        (up) => {
          if (up.pointerId !== pointerId) return;
          listening.abort();
          click();
          // (Its click next, if any, elsewhere: swallowed; none before
          // another press or key, nothing.)
          const clicking = new AbortController();
          const once = { capture: true, signal: clicking.signal };
          addEventListener(
            'click',
            (clicked) => {
              clicking.abort();
              if (root.contains(clicked.target as Node | null)) return;
              clicked.preventDefault();
              clicked.stopPropagation();
            },
            once,
          );
          for (const type of ['pointerdown', 'keydown']) {
            addEventListener(type, () => clicking.abort(), once);
          }
        },
        options,
      );
      addEventListener(
        'pointercancel',
        (cancel) => {
          if (cancel.pointerId === pointerId) listening.abort();
        },
        options,
      );
    },
    // (The slider takes a touch's start too, unless its pointer's started
    // it (see Base UI's SliderControl): held back with it.)
    onTouchStartCapture: (event) => {
      if (isHolding) event.stopPropagation();
    },
  };
};

/**
 * Its fill's tone (opaque: its color's), as its tint or the color scheme
 * changes (not as it moves), and the color scheme of what's drawn over it.
 * Its tint's, read where it's drawn (its `light-dark()` resolved there), not
 * what's painted: off, with a switch, the fill isn't drawn (see Card), and
 * its tone is still wanted as it's switched on.
 */
const useFillScheme = (
  indicator: { current: HTMLElement | null },
  tint: string | undefined,
) => {
  const { colorScheme } = useSettings();
  const [tone, setTone] = useState<BackdropTone | undefined>();
  useLayoutEffect(() => {
    const { current: element } = indicator;
    if (!element) return;
    // (Read once it's laid out: its color computed, a var's resolved, by a
    // probe in it, gone again.)
    const read = () => {
      const probe = document.createElement('span');
      probe.style.color = 'var(--uikit-slider-tint)';
      element.append(probe);
      const { color } = getComputedStyle(probe);
      probe.remove();
      setTone((last) => toneOfColor(color, last));
    };
    read();
  }, [colorScheme, indicator, tint]);
  if (tone === undefined) return undefined;
  return tone === 'bright' ? 'light' : 'dark';
};

/**
 * A slider card's switch (see `ControlCardSliderProps.checked`): whether
 * it has one, whether it's on (with none: on), switching it.
 */
const useSliderSwitch = (
  checked: boolean | undefined,
  defaultChecked: boolean | undefined,
  onCheckedChange: ((checked: boolean) => void) | undefined,
) => {
  const hasSwitch = checked !== undefined || defaultChecked !== undefined;
  const [isOn, setIsOn] = useControlled(checked, defaultChecked ?? true);
  const switchTo = (next: boolean) => {
    setIsOn(next);
    onCheckedChange?.(next);
  };
  return { hasSwitch, isOn, switchTo };
};

/**
 * What's over a slider's fill, drawn again in it (see `SliderFill`): a
 * layer at the card's size, in the fill's color scheme, its label, its
 * value and its ticks in it; the card's own parts portaled in (see Card's
 * `CardBlendScope`). Hidden from assistive technology, inert.
 */
/** A slider's value text, as `Slider.Value`'s children (its first value). */
type ValueText = (
  formattedValues: readonly string[],
  values: readonly number[],
) => string;

/** A value text (see `getValueText`) as `Slider.Value`'s children. */
const valueTextOf = (
  getValueText: ((formattedValue: string, value: number) => string) | undefined,
): ValueText | undefined =>
  getValueText
    ? (formattedValues, values) =>
        getValueText(formattedValues[0] ?? '', values[0] ?? 0)
    : undefined;

const FillCopies = ({
  layerRef,
  name,
  orientation,
  scheme,
  ticks,
  valueText,
}: {
  layerRef: ((layer: HTMLElement | null) => void) | undefined;
  name: string;
  orientation: CardOrientation;
  scheme: 'dark' | 'light';
  ticks: number | undefined;
  valueText: ValueText | undefined;
}) => (
  <span
    ref={layerRef}
    aria-hidden
    inert
    className="uikit-card-blend"
    data-color-scheme={scheme}
    data-orientation={orientation}
    style={colorSchemeStyle(scheme)}
  >
    <span
      className="uikit-slider-label"
      data-card-copy=""
    >
      {name}
    </span>
    <Slider.Value data-card-copy="">{valueText}</Slider.Value>
    {ticks === undefined ? null : (
      <Slider.Ticks
        count={ticks}
        data-card-copy=""
      />
    )}
  </span>
);

/**
 * A slider filling its card (a `Card.Root`'s, among its parts): its fill
 * the card's background (from its leading edge, or from its bottom upright,
 * by its tile's shape), ticks at its steps (`step`), its label and value at
 * the card's bottom. What's over the fill (its label, value and ticks, the
 * card's symbol and corner buttons) drawn twice: on the card, and again
 * inside the fill in the fill's color scheme (dark on a bright fill, light
 * on a dim one), clipped by its edge, so it reads whatever its tint. With
 * an `onPress`, a click on it is that (e.g. a switch toggled), a drag sets
 * its value.
 */
const SliderFill = forwardRef<HTMLDivElement, ControlCardSliderFillProps>(
  (
    {
      className,
      defaultValue,
      format,
      getValueText,
      locale,
      max = 100,
      min = 0,
      name,
      onPress,
      onValueChange,
      step,
      tint,
      value,
    },
    ref,
  ) => {
    const orientation: CardOrientation = useCardOrientation();
    const [current, setCurrent] = useControlled(value, defaultValue ?? min);
    // (Its fill's color scheme; the layer in it registered with its card,
    // see `CardBlendScope`.)
    const indicator = useRef<HTMLDivElement>(null);
    const scheme = useFillScheme(indicator, tint);
    const setLayer = useContext(CardBlendScope)?.setLayer;
    const ticks =
      step === undefined ? undefined : Math.round((max - min) / step) + 1;
    const valueText = valueTextOf(getValueText);
    return (
      <Slider.Root
        ref={ref}
        className={cn('uikit-control-cards-slider-fill', className)}
        data-control-cards-part="slider-fill"
        format={format}
        locale={locale}
        max={max}
        min={min}
        orientation={orientation}
        step={step ?? (max - min) / 100}
        tint={tint}
        value={current}
        onValueChange={(next) => {
          setCurrent(next as number);
          onValueChange?.(next as number);
        }}
        {...pressProps(onPress)}
      >
        <Slider.Control>
          <Slider.Track>
            <Slider.Indicator ref={indicator}>
              {scheme ? (
                <FillCopies
                  layerRef={setLayer}
                  name={name}
                  orientation={orientation}
                  scheme={scheme}
                  ticks={ticks}
                  valueText={valueText}
                />
              ) : null}
            </Slider.Indicator>
            {ticks === undefined ? null : <Slider.Ticks count={ticks} />}
            <Slider.Thumb
              aria-label={name}
              getAriaValueText={getValueText}
            />
          </Slider.Track>
        </Slider.Control>
        <Slider.Label>{name}</Slider.Label>
        <Slider.Value>{valueText}</Slider.Value>
      </Slider.Root>
    );
  },
);

/**
 * A slider card's value text by default (see `getValueText`): with a
 * switch, its state's word and its number (“On · 60%”); without one, its
 * number.
 */
const defaultValueText = (
  formattedValue: string,
  { checked, states: [on, off] }: ControlCardValueTextDetails,
) =>
  checked === undefined
    ? formattedValue
    : `${checked ? on : off} · ${formattedValue}`;

/**
 * A numerical control: a `SliderFill` in a card, its symbol at its top.
 * Optionally a switch (`checked`): on and off, its value kept; a click on
 * the card toggles it, a drag sets its value.
 */
const SliderCard = forwardRef<HTMLDivElement, ControlCardSliderProps>(
  (
    {
      brightness = false,
      checked,
      children,
      className,
      defaultChecked,
      defaultValue,
      emphasizedIcon,
      format,
      getValueText,
      icon,
      locale,
      max = 100,
      min = 0,
      name,
      onCheckedChange,
      onValueChange,
      states = ['On', 'Off'],
      step,
      tint,
      value,
      ...props
    },
    ref,
  ) => {
    const [current, setCurrent] = useControlled(value, defaultValue ?? min);
    const { hasSwitch, isOn, switchTo } = useSliderSwitch(
      checked,
      defaultChecked,
      onCheckedChange,
    );
    // (Its symbol on: a brightness's above its minimum, while on; else, as
    // its switch, if any.)
    const isOnAtAll = !hasSwitch || isOn;
    const isSymbolOn = brightness
      ? isOnAtAll && current > min
      : hasSwitch && isOn;
    return (
      <Card.Root
        ref={ref}
        // (A brightness's: never lit, its dark glass and its fill telling
        // how much light; else, its glass the color scheme's.)
        active={brightness ? false : undefined}
        {...props}
        className={cn('uikit-control-cards-slider', className)}
        data-control-cards-part="slider"
      >
        <Card.Symbol active={isSymbolOn}>
          {symbolOf({ emphasizedIcon, icon })}
        </Card.Symbol>
        <SliderFill
          format={format}
          locale={locale}
          max={max}
          min={min}
          name={name}
          step={step}
          tint={tint}
          value={current}
          getValueText={(formattedValue, number) => {
            const isChecked = hasSwitch ? isOn : undefined;
            if (getValueText) {
              return getValueText(formattedValue, number, {
                checked: isChecked,
                states,
              });
            }
            return defaultValueText(formattedValue, {
              checked: isChecked,
              states,
            });
          }}
          onPress={hasSwitch ? () => switchTo(!isOn) : undefined}
          onValueChange={(next) => {
            setCurrent(next);
            onValueChange?.(next);
          }}
        />
        {hasSwitch ? (
          <Card.Switch
            aria-label={name}
            checked={isOn}
            tint={tint}
            onCheckedChange={switchTo}
          />
        ) : null}
        {children}
      </Card.Root>
    );
  },
);

/**
 * A momentary button: a press does something once (e.g. a doorbell rung,
 * all lights off); it lights up for a moment and fades back, also as the
 * app flashes it (`actionsRef`). A badge on its symbol, if given.
 */
const Button = forwardRef<HTMLDivElement, ControlCardButtonProps>(
  (
    {
      badge,
      children,
      className,
      emphasizedIcon,
      icon,
      name,
      onClick,
      onPress,
      status,
      ...props
    },
    ref,
  ) => (
    <Card.Root
      ref={ref}
      momentary
      {...props}
      className={cn('uikit-control-cards-button', className)}
      data-control-cards-part="button"
      onClick={(event: MouseEvent<HTMLDivElement>) => {
        onPress?.();
        onClick?.(event);
      }}
    >
      <Card.Symbol>
        {symbolOf(
          { emphasizedIcon, icon },
          badge === undefined || badge === null ? null : (
            <Badge placement="symbol">{badge}</Badge>
          ),
        )}
      </Card.Symbol>
      <Card.Title>{name}</Card.Title>
      {status === undefined ? null : <Card.Value>{status}</Card.Value>}
      {children}
    </Card.Root>
  ),
);

/**
 * A progress (e.g. a washer's, a garage door moving): a bar between its
 * top row and its title while there is one (`value`), its value's words.
 */
const ProgressCard = forwardRef<HTMLDivElement, ControlCardProgressProps>(
  (
    {
      active,
      children,
      className,
      emphasizedIcon,
      icon,
      max = 100,
      name,
      status,
      tint,
      value,
      ...props
    },
    ref,
  ) => (
    <Card.Root
      ref={ref}
      active={active}
      {...props}
      className={cn('uikit-control-cards-progress', className)}
      data-control-cards-part="progress"
    >
      <Card.Symbol>{symbolOf({ emphasizedIcon, icon })}</Card.Symbol>
      {value === undefined ? null : (
        <div className="uikit-control-cards-controls">
          <Progress.Root
            aria-label={name}
            max={max}
            tint={tint}
            value={value}
          >
            <Progress.Track>
              <Progress.Indicator />
            </Progress.Track>
          </Progress.Root>
        </div>
      )}
      <Card.Title>{name}</Card.Title>
      {status === undefined ? null : <Card.Value>{status}</Card.Value>}
      {children}
    </Card.Root>
  ),
);

/**
 * A card's bars (e.g. a light's channels): side by side, upright, in a
 * tile taller than one row, else stacked across; each a slider (0 to 1),
 * its short name on it (upright) or beside it (across, too thin for it),
 * in its tint. Between the card's top row and its title.
 */
const Channels = forwardRef<HTMLDivElement, ControlCardChannelsProps>(
  ({ channels, className, onValueChange, value }, ref) => {
    const [, rows = '1'] = (useGridItem()?.size ?? '2x2').split('x');
    const orientation = rows === '1' ? 'horizontal' : 'vertical';
    return (
      <div
        ref={ref}
        className={cn('uikit-control-cards-channels', className)}
        data-control-cards-part="channels"
        data-orientation={orientation}
      >
        {channels.map(({ label, name, tint }, index) => (
          <Slider.Root
            key={name}
            format={{ style: 'percent' }}
            max={1}
            min={0}
            orientation={orientation}
            step={0.01}
            tint={tint}
            value={value[index] ?? 0}
            onValueChange={(next) => onValueChange?.(index, next as number)}
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
  },
);

/**
 * What channels make together (each 0 to 1, by its tint): their colors
 * mixed by their shares, at full strength; none on, none.
 */
const mixColor = (
  channels: readonly ControlCardChannel[],
  values: readonly number[],
): string | undefined => {
  const lit = channels
    .map(({ tint }, index) => ({ tint, value: values[index] ?? 0 }))
    .filter(({ value }) => value > 0);
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
 * A light of several channels (e.g. red, green, blue): a switch, lit while
 * on, its symbol in the color they make, its value its brightness (its
 * strongest channel's); large (expanded, resized, opened), a bar per
 * channel (see `Channels`). Small, a press on it toggles it.
 */
const Light = forwardRef<HTMLDivElement, ControlCardLightProps>(
  (
    {
      channels,
      checked,
      children,
      className,
      defaultChecked = true,
      defaultValue,
      emphasizedIcon,
      format = { maximumFractionDigits: 0, style: 'percent' },
      icon,
      locale,
      name,
      offLabel = 'Off',
      onCheckedChange,
      onClick,
      onValueChange,
      value,
      ...props
    },
    ref,
  ) => {
    const [isOn, setIsOn] = useControlled(checked, defaultChecked);
    const [values, setValues] = useControlled(
      value,
      defaultValue ?? channels.map(() => 1),
    );
    const isLarge = useIsLarge();
    const color = isOn ? mixColor(channels, values) : undefined;
    const switchTo = (next: boolean) => {
      setIsOn(next);
      onCheckedChange?.(next);
    };
    return (
      <Card.Root
        ref={ref}
        {...props}
        className={cn('uikit-control-cards-light', className)}
        data-control-cards-part="light"
        onClick={
          onClick ??
          (isLarge ? undefined : forwardClick('[role=switch]:not([disabled])'))
        }
      >
        <Card.Symbol style={color ? { color } : undefined}>
          {symbolOf({ emphasizedIcon, icon })}
        </Card.Symbol>
        <Card.Switch
          aria-label={name}
          checked={isOn}
          tint={color}
          onCheckedChange={switchTo}
        />
        {isLarge ? (
          <Channels
            channels={channels}
            value={values}
            onValueChange={(index, next) => {
              const all = values.map((each, at) =>
                at === index ? next : each,
              );
              setValues(all);
              onValueChange?.(all);
            }}
          />
        ) : null}
        <Card.Title>{name}</Card.Title>
        <Card.Value>
          {isOn
            ? formatted(Math.max(0, ...values), { format, locale })
            : offLabel}
        </Card.Value>
        {children}
      </Card.Root>
    );
  },
);

/** A list card's row's height (px; a row in a card, see Card). */
const rowHeight = 36;

/**
 * How many rows of its list fit in it whole (its box filling its room in
 * the card, see Card): by its height, at least one; as the card's size
 * changes too.
 */
const useRowsThatFit = () => {
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
  }, [list]);
  return [setList, count] as const;
};

/**
 * A summary in rows (e.g. a room's, a device's details): its symbol and
 * title at its top, a glass list of rows under them (as many as fit
 * whole); its value's words, if given. No rows, no list.
 */
const ListCard = forwardRef<HTMLDivElement, ControlCardListProps>(
  (
    { children, className, emphasizedIcon, icon, name, rows, status, ...props },
    ref,
  ) => {
    const [list, fit] = useRowsThatFit();
    return (
      <Card.Root
        ref={ref}
        {...props}
        className={cn('uikit-control-cards-list', className)}
        data-control-cards-part="list"
      >
        <Card.Symbol>{symbolOf({ emphasizedIcon, icon })}</Card.Symbol>
        {rows.length === 0 ? null : (
          <List.Root ref={list}>
            <List.Section>
              <List.Group>
                {rows.slice(0, fit).map((row) => (
                  <List.Item key={row.label}>
                    {row.icon ? (
                      <List.Leading>
                        <List.Image variant="symbol">
                          <Symbol icon={row.icon} />
                        </List.Image>
                      </List.Leading>
                    ) : null}
                    <List.Content>
                      <List.Title>{row.label}</List.Title>
                    </List.Content>
                    <List.Trailing>
                      <List.Detail>{row.value}</List.Detail>
                    </List.Trailing>
                  </List.Item>
                ))}
              </List.Group>
            </List.Section>
          </List.Root>
        )}
        <Card.Title>{name}</Card.Title>
        {status === undefined ? null : <Card.Value>{status}</Card.Value>}
        {children}
      </Card.Root>
    );
  },
);

/**
 * A corner button expanding its card in place and making it small again
 * (bottom trailing; its grid item's size is the app's, see Grid).
 */
const ExpandButton = ({
  collapsedSize,
  expanded,
  expandedSize,
  label,
  onExpandedChange,
}: ControlCardExpandButtonProps): ReactNode => {
  // (Each size as its item would be it now (see `useGridItem`'s
  // `sizeOf`): the same, expanding changes nothing, hidden; outside a
  // grid, as given.)
  const item = useGridItem();
  const small = item?.sizeOf(collapsedSize).size ?? collapsedSize;
  const large = item?.sizeOf(expandedSize).size ?? expandedSize;
  // (Its icon by where it goes: larger, expanding; smaller, collapsing
  // (e.g. expanded smaller than it's stored).)
  const [from, to] = expanded ? [large, small] : [small, large];
  return (
    <Card.CornerButton
      mirrored
      aria-expanded={expanded}
      aria-label={label}
      visible={small !== large}
      icon={
        measureOf(to) > measureOf(from) ? gridIcons.expand : gridIcons.collapse
      }
      onClick={() => onExpandedChange(!expanded)}
    />
  );
};

/**
 * Corner buttons opening its card above the page (its grid item's `open`,
 * see `Grid.Item`), bottom trailing, and closing it (top leading), each
 * shown as it applies.
 */
const OpenButtons = ({
  closeLabel,
  label,
}: ControlCardOpenButtonsProps): ReactNode => {
  const item = useGridItem();
  const isOpen = item?.open === true;
  return (
    <>
      <Card.CornerButton
        aria-label={label}
        icon={gridIcons.open}
        visible={!isOpen}
        onClick={() => item?.setOpen(true)}
      />
      <Card.CornerButton
        aria-label={closeLabel}
        corner="top-leading"
        icon={gridIcons.close}
        visible={isOpen}
        onClick={() => item?.setOpen(false)}
      />
    </>
  );
};

export const ControlCards = {
  State,
  Switch: SwitchCard,
  Value,
  Slider: SliderCard,
  SliderFill,
  Button,
  Progress: ProgressCard,
  Light,
  List: ListCard,
  Channels,
  Trend,
  ExpandButton,
  OpenButtons,
};
