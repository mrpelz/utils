import '../card/style.css';
import '../list/style.css';
import '../progress/style.css';
import './style.css';

import { Radio as BaseRadio } from '@base-ui/react/radio';
import { RadioGroup as BaseRadioGroup } from '@base-ui/react/radio-group';
import {
  createContext,
  type CSSProperties,
  forwardRef,
  type MouseEvent,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
  type TouchEvent as ReactTouchEvent,
  useCallback,
  useContext,
  useLayoutEffect,
  useMemo,
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
import { gridIcons, startWithFrame, useGridItem } from '../grid/main.js';
import { forwardClick, List } from '../list/main.js';
import { Progress } from '../progress/main.js';
import { useSettings } from '../settings/main.js';
import { Slider } from '../slider/main.js';
import { Symbol, type SymbolIcon } from '../symbol/main.js';
import { cn, reducedMotionOf } from '../utils/main.js';
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
  ControlCardSegmentedItemProps,
  ControlCardSegmentedProps,
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
  ControlCardSegmentedItemProps,
  ControlCardSegmentedProps,
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
    box="square"
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
// handle's, see Grid's edit.ts); a touch's (or a pen's), before it's told
// a drag (along the slider) from a scroll (across it), as a browser tells
// a pan.
const pressSlop = 4;
const touchSlop = 8;

// (A press handed on to the slider (see `pressProps`): let through; one
// held back, not yet a drag or a click: its touch held back too.)
let isHandingOn = false;
let isHolding = false;

/**
 * A slider's press (its `Slider.Root`'s props), held back at first (the
 * slider would set its value as it's pressed, and, a touch, follow it
 * even as the page scrolls, see Base UI's SliderControl):
 * - Moved (`pressSlop`; a touch, `touchSlop`) along it (a mouse, any
 *   way): a drag, handed on to the slider (the press again, where it
 *   started).
 * - A touch moved across it, or the browser panning (it's cancelled): a
 *   scroll, the page's, the slider never told.
 * - Released before: `onClick`'s, the slider never told (its value
 *   kept); its click, if the browser moves it to a control near it (e.g.
 *   the card's switch, a tap's target adjusted, as WebKit's on iOS), not
 *   that control's too (toggled back): swallowed (not the click deciding:
 *   on iOS, none may come to it). No `onClick`: handed on to the slider as
 *   it's released (its value set where it was pressed).
 */
const pressProps = (
  onClick: (() => void) | undefined,
  orientation: CardOrientation,
): {
  onPointerDownCapture: (event: ReactPointerEvent<HTMLElement>) => void;
  onTouchStartCapture: (event: ReactTouchEvent<HTMLElement>) => void;
} => ({
  onPointerDownCapture: (event) => {
    if (isHandingOn || event.button !== 0) return;
    event.stopPropagation();
    // (The DOM's event: React's wraps it, Preact's is it.)
    const pressed =
      (event as { nativeEvent?: PointerEvent }).nativeEvent ??
      (event as unknown as PointerEvent);
    const { clientX, clientY, pointerId, pointerType, target } = pressed;
    const isMouse = pointerType === 'mouse';
    const slop = isMouse ? pressSlop : touchSlop;
    const root = event.currentTarget;
    const handOn = () => {
      isHandingOn = true;
      try {
        target?.dispatchEvent(new PointerEvent('pointerdown', pressed));
      } finally {
        isHandingOn = false;
      }
    };
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
        const across = Math.abs(move.clientX - clientX);
        const upright = Math.abs(move.clientY - clientY);
        if (Math.hypot(across, upright) < slop) return;
        listening.abort();
        // (A touch across it: a scroll, let go.)
        const along = orientation === 'vertical' ? upright : across;
        const crossing = orientation === 'vertical' ? across : upright;
        if (!isMouse && crossing > along) return;
        handOn();
      },
      options,
    );
    addEventListener(
      'pointerup',
      (up) => {
        if (up.pointerId !== pointerId) return;
        listening.abort();
        // (No click of its own: the slider's, its value set there; this
        // release ending it, as it goes on.)
        if (onClick === undefined) {
          handOn();
          return;
        }
        onClick();
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
  // it (see Base UI's SliderControl), following it past a pan: held back
  // with it.)
  onTouchStartCapture: (event) => {
    if (isHolding) event.stopPropagation();
  },
});

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
        {...pressProps(onPress, orientation)}
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
 * How many rows of its list fit in it whole (its box filling its room in
 * the card, see Card; a row's height its `--uikit-list-row-min-height`, as
 * Card sets it, opened above the page too): by its height, at least one;
 * as the card's size changes too.
 */
const rowsIn = (list: HTMLElement) => {
  const row =
    Number.parseFloat(
      getComputedStyle(list).getPropertyValue('--uikit-list-row-min-height'),
    ) || 30;
  return Math.max(1, Math.floor(list.clientHeight / row));
};

const useRowsThatFit = () => {
  const [list, setList] = useState<HTMLElement | null>(null);
  const [count, setCount] = useState(1);
  useLayoutEffect(() => {
    if (!list) return undefined;
    const observer = new ResizeObserver(() => setCount(rowsIn(list)));
    observer.observe(list);
    return () => observer.disconnect();
  }, [list]);
  // (Also after each render, before it's painted: its tile resized in it
  // (e.g. collapsed), its rows counted at once, not a frame late (a frame
  // of the rows of the size it had, its last row a new one after).)
  useLayoutEffect(() => {
    if (!list) return;
    const read = () => setCount(rowsIn(list));
    read();
  });
  return [setList, count, list] as const;
};

/** Grid's reflow (its tiles reshaping): its duration and easing. */
const reflowDuration = 300;
const reflowEasing = 'cubic-bezier(0.32, 0.72, 0, 1)';

/** Its last row's height's animation (see `useLastRowHeight`). */
const lastRowId = 'uikit-control-cards-last-row';

/**
 * Its list's last row's height changing with how many rows there are (one
 * only: taller, see Card), as its tile reshapes (Grid's reflow: its
 * duration and easing): from the height it had, animated, started with
 * the frames (see Grid's `startWithFrame`: a long task laying the page out
 * anew, e.g. its tile expanding, not past it already, as a transition
 * would be).
 */
const useLastRowHeight = (list: HTMLElement | null, count: number): void => {
  const last = useRef<{ count: number; height: string } | undefined>(undefined);
  useLayoutEffect(() => {
    const row = list?.querySelector<HTMLElement>(
      ':scope .uikit-list-item:last-child .uikit-list-row',
    );
    if (!row) {
      last.current = undefined;
      return;
    }
    for (const animation of row.getAnimations()) {
      if (animation.id === lastRowId) animation.cancel();
    }
    const height = getComputedStyle(row).minHeight;
    const before = last.current;
    last.current = { count, height };
    if (
      !before ||
      before.count === count ||
      before.height === height ||
      reducedMotionOf(row).matches
    ) {
      return;
    }
    startWithFrame(
      row.animate([{ minHeight: before.height }, { minHeight: height }], {
        duration: reflowDuration,
        easing: reflowEasing,
        id: lastRowId,
      }),
    );
  }, [count, list]);
};

/** What its list's last row does, if anything (see `ListCard`). */
type ListAction =
  | { kind: 'expand' | 'less'; onPress: () => void }
  | { kind: 'more'; onPress?: () => void }
  | { kind: 'open'; onPress: () => void };

const actionIcons = {
  expand: gridIcons.expand,
  less: gridIcons.collapse,
  more: undefined,
  open: gridIcons.open,
} as const;

/**
 * What a list card's last row does (see `ListCard`): open above the page,
 * none; expanded, making it small again; rows left out, expanding it (only
 * where that'd change its size, as `ExpandButton`), else opening it, else
 * only counting them; none.
 */
const useListAction = ({
  expansion,
  isLeftOut,
  opening,
}: {
  expansion: ControlCardExpandButtonProps | undefined;
  isLeftOut: boolean;
  opening: ControlCardOpenButtonsProps | undefined;
}): ListAction | undefined => {
  const item = useGridItem();
  if (item?.open === true) return undefined;
  const canExpand =
    expansion !== undefined &&
    (item?.sizeOf(expansion.collapsedSize).size ?? expansion.collapsedSize) !==
      (item?.sizeOf(expansion.expandedSize).size ?? expansion.expandedSize);
  if (canExpand && expansion.expanded) {
    return { kind: 'less', onPress: () => expansion.onExpandedChange(false) };
  }
  if (!isLeftOut) return undefined;
  if (canExpand) {
    return { kind: 'expand', onPress: () => expansion.onExpandedChange(true) };
  }
  return opening
    ? { kind: 'open', onPress: () => item?.setOpen(true) }
    : { kind: 'more' };
};

/**
 * A list card's last row (see `ListCard`): its label where its rows' are
 * (after their symbols' room, if they have them), pressed doing its
 * action; the corner symbol for it where a value is.
 */
const ActionRow = ({
  action,
  hasIcons,
  label,
}: {
  action: ListAction;
  hasIcons: boolean;
  label: string;
}): ReactNode => {
  const icon = actionIcons[action.kind];
  const isExpanding = action.kind === 'expand' || action.kind === 'less';
  return (
    <List.Item data-control-cards-part="list-action">
      {hasIcons ? (
        <List.Leading>
          <List.Image variant="symbol" />
        </List.Leading>
      ) : null}
      <List.Content>
        <List.Title
          render={
            action.onPress ? (
              <button
                aria-expanded={isExpanding ? action.kind === 'less' : undefined}
                type="button"
                onClick={action.onPress}
              />
            ) : undefined
          }
        >
          {label}
        </List.Title>
      </List.Content>
      {icon ? (
        <List.Trailing>
          <List.Detail>
            <Symbol icon={icon} />
          </List.Detail>
        </List.Trailing>
      ) : null}
    </List.Item>
  );
};

/**
 * A summary in rows (e.g. a room's, a device's details): its symbol, its
 * title and status beside it at its top, a glass list of rows (as many as
 * fit whole) in a well at its bottom. Rows left out, its last row counts
 * them, expanding or opening it (`expansion`, `opening`); expanded, it
 * makes it small again. No rows, no list (its corner buttons instead);
 * open above the page, an x in its top trailing corner closes it.
 */
const ListCard = forwardRef<HTMLDivElement, ControlCardListProps>(
  (
    {
      children,
      className,
      emphasizedIcon,
      expansion,
      getMoreLabel = (count) => `${String(count)} more`,
      icon,
      lessLabel = 'Less',
      name,
      opening,
      rows,
      status,
      ...props
    },
    ref,
  ) => {
    const [list, fit, listElement] = useRowsThatFit();
    const item = useGridItem();
    const isOpen = item?.open === true;
    const action = useListAction({
      expansion,
      isLeftOut: rows.length > fit,
      opening,
    });
    // (Its last row the action's, if any: one row less.)
    const shown = action ? rows.slice(0, fit - 1) : rows.slice(0, fit);
    useLastRowHeight(listElement, shown.length + (action ? 1 : 0));
    return (
      <Card.Root
        ref={ref}
        {...props}
        className={cn('uikit-control-cards-list', className)}
        data-control-cards-part="list"
      >
        <Card.Symbol>{symbolOf({ emphasizedIcon, icon })}</Card.Symbol>
        <Card.Title>{name}</Card.Title>
        {status === undefined ? null : <Card.Value>{status}</Card.Value>}
        {rows.length === 0 ? null : (
          <List.Root ref={list}>
            <List.Section>
              <List.Group>
                {shown.map((row) => (
                  <List.Item key={row.label}>
                    {row.icon ? (
                      <List.Leading>
                        <List.Image variant="symbol">
                          <Symbol icon={row.icon} />
                        </List.Image>
                      </List.Leading>
                    ) : null}
                    <List.Content>
                      {/* (Pressed, going on (e.g. to its page): its label
                          a button, its row its hit area, see List.) */}
                      <List.Title
                        render={
                          row.onPress ? (
                            <button
                              type="button"
                              onClick={row.onPress}
                            />
                          ) : undefined
                        }
                      >
                        {row.label}
                      </List.Title>
                    </List.Content>
                    <List.Trailing>
                      <List.Detail>{row.value}</List.Detail>
                      {row.onPress ? <List.DrillIn /> : null}
                    </List.Trailing>
                  </List.Item>
                ))}
                {action ? (
                  // (Keyed: the same row however many come before it, its
                  // height animated, see `useLastRowHeight`.)
                  <ActionRow
                    key="action"
                    action={action}
                    hasIcons={rows.some((row) => row.icon !== undefined)}
                    label={
                      action.kind === 'less'
                        ? lessLabel
                        : getMoreLabel(rows.length - shown.length)
                    }
                  />
                ) : null}
              </List.Group>
            </List.Section>
          </List.Root>
        )}
        {/* (Its last row's action, also a corner button over it, not
            drawn (its row draws its symbol there): a corner button's large
            hit area; for pointers only, the row's button for keys and
            assistive technology.) */}
        {rows.length > 0 && action?.onPress ? (
          <Card.CornerButton
            aria-hidden
            className="uikit-control-cards-hit-area"
            icon={actionIcons[action.kind] ?? gridIcons.open}
            tabIndex={-1}
            onClick={action.onPress}
          />
        ) : null}
        {/* (No list: its corner buttons, as the other cards'.) */}
        {rows.length === 0 && expansion ? (
          <ExpandButton {...expansion} />
        ) : null}
        {rows.length === 0 && opening && !expansion ? (
          <Card.CornerButton
            aria-label={opening.label}
            icon={gridIcons.open}
            visible={!isOpen}
            onClick={() => item?.setOpen(true)}
          />
        ) : null}
        {opening ? (
          <Card.CornerButton
            aria-label={opening.closeLabel}
            corner="top-trailing"
            icon={gridIcons.close}
            visible={isOpen}
            onClick={() => item?.setOpen(false)}
          />
        ) : null}
        {children}
      </Card.Root>
    );
  },
);

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
        corner="top-trailing"
        icon={gridIcons.close}
        visible={isOpen}
        onClick={() => item?.setOpen(false)}
      />
    </>
  );
};

/** A segmented card's layout, by its tile's size (see `SegmentedCard`). */
type SegmentedLayout = 'compact' | 'row' | 'tall' | 'upright';

/**
 * Its layout by its size (open above the page, that one) and its
 * orientation (the app's; none, by its size): taller than a row, its
 * options stacked (`upright`: vertical, or one wide) or side by side, a
 * symbol over its words (`tall`: horizontal, or wider); one row, side by
 * side across it (`row`: wider, not vertical); else none (`compact`: 1x1,
 * or vertical in one row, no room to stack them). Outside a grid, a row,
 * or stacked (vertical).
 */
const layoutOf = (
  orientation: ControlCardSegmentedProps['orientation'],
  isWide: boolean,
  isTall: boolean,
): SegmentedLayout => {
  if (isTall) {
    if (orientation === undefined) return isWide ? 'tall' : 'upright';
    return orientation === 'vertical' ? 'upright' : 'tall';
  }
  return isWide && orientation !== 'vertical' ? 'row' : 'compact';
};

/** Its layout (see `layoutOf`), and whether it's one wide (narrow). */
const useSegmentedLayout = (
  orientation: ControlCardSegmentedProps['orientation'],
): readonly [SegmentedLayout, boolean] => {
  const item = useGridItem();
  if (!item) return [orientation === 'vertical' ? 'upright' : 'row', false];
  const [columns = '1', rows = '1'] = (
    item.open ? item.openSize : item.size
  ).split('x');
  const isWide = columns === '*' || Number(columns) >= 2;
  return [layoutOf(orientation, isWide, Number(rows) >= 2), !isWide];
};

/** A segmented card's thumb, placed on an option's box (see below). */
const placeThumb = (thumb: HTMLElement, on: HTMLElement | null) => {
  thumb.hidden = !on;
  if (!on) return;
  thumb.style.setProperty(
    '--uikit-control-cards-thumb-x',
    `${String(on.offsetLeft)}px`,
  );
  thumb.style.setProperty(
    '--uikit-control-cards-thumb-y',
    `${String(on.offsetTop)}px`,
  );
  thumb.style.setProperty(
    '--uikit-control-cards-thumb-width',
    `${String(on.offsetWidth)}px`,
  );
  thumb.style.setProperty(
    '--uikit-control-cards-thumb-height',
    `${String(on.offsetHeight)}px`,
  );
};

/** The option nearest a point, along the options (see `dragProps`). */
const nearestOption = (
  root: HTMLElement,
  isUpright: boolean,
  { clientX, clientY }: { clientX: number; clientY: number },
) => {
  let nearest: HTMLElement | undefined;
  let distance = Infinity;
  for (const option of root.querySelectorAll<HTMLElement>('[role="radio"]')) {
    if (Object.hasOwn(option.dataset, 'disabled')) continue;
    const box = option.getBoundingClientRect();
    const away = isUpright
      ? Math.abs(box.top + box.height / 2 - clientY)
      : Math.abs(box.left + box.width / 2 - clientX);
    if (!(away < distance)) {
      continue;
    }

    distance = away;
    nearest = option;
  }
  return nearest;
};

/**
 * Dragging between a segmented card's options (as Segmented's, no lens:
 * its thumb what moves): held back until it moves (`pressSlop`; a touch,
 * `touchSlop`), then along the options (a mouse, any way), the nearest one
 * chosen as it's reached (its thumb going there); a touch across them, or
 * the browser panning first (it's cancelled), a scroll, let go (as a
 * slider card's, see `pressProps`). Dragging, the page doesn't pan (see
 * `SegmentedChoice`). Released before, a press: the option's own (its
 * click).
 */
const dragProps = (
  isUpright: boolean,
  onChoose: (value: string) => void,
): { onPointerDown: (event: ReactPointerEvent<HTMLElement>) => void } => ({
  onPointerDown: (event) => {
    if (event.button !== 0) return;
    const root = event.currentTarget;
    const { clientX, clientY, pointerId, pointerType } = event;
    const isMouse = pointerType === 'mouse';
    const slop = isMouse ? pressSlop : touchSlop;
    let isDragging = false;
    let under: HTMLElement | undefined;
    const listening = new AbortController();
    const options = { capture: true, signal: listening.signal };
    const end = () => {
      listening.abort();
      delete root.dataset.dragging;
    };
    addEventListener(
      'pointermove',
      (move) => {
        if (move.pointerId !== pointerId) return;
        if (!isDragging) {
          const across = Math.abs(move.clientX - clientX);
          const upright = Math.abs(move.clientY - clientY);
          if (Math.hypot(across, upright) < slop) return;
          const along = isUpright ? upright : across;
          const crossing = isUpright ? across : upright;
          // (A touch across them: a scroll, let go.)
          if (!isMouse && crossing > along) {
            end();
            return;
          }
          isDragging = true;
          root.dataset.dragging = '';
        }
        // (Its nearest option chosen as it's reached.)
        const next = nearestOption(root, isUpright, move);
        if (!next || next === under) return;
        under = next;
        const { value } = next.dataset;
        if (value !== undefined && !Object.hasOwn(next.dataset, 'checked')) {
          onChoose(value);
        }
      },
      options,
    );
    addEventListener(
      'pointerup',
      (up) => {
        if (up.pointerId !== pointerId) return;
        end();
        if (!isDragging) return;
        // (Its click next, if any: not an option's (dragged, not pressed);
        // none before another press or key, nothing.)
        const clicking = new AbortController();
        const once = { capture: true, signal: clicking.signal };
        addEventListener(
          'click',
          (clicked) => {
            clicking.abort();
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
        if (cancel.pointerId === pointerId) end();
      },
      options,
    );
  },
});

/** A segmented card's option, as it tells its card (see `SegmentedItem`). */
type SegmentedOptionInfo = {
  icon: SymbolIcon | undefined;
  label: ReactNode;
  tint: string | undefined;
};

/** What a segmented card's options read from it (see `SegmentedItem`). */
type SegmentedContextValue = {
  content: 'both' | 'icon' | 'label';
  layout: SegmentedLayout;
  /** Tells it an option (its symbol, words, tint), until it's gone. */
  register: (value: string, info: SegmentedOptionInfo) => () => void;
};

const SegmentedContext = createContext<SegmentedContextValue | undefined>(
  undefined,
);

/**
 * Its options, as they've told it (in the order they did: theirs), see
 * `SegmentedItem`.
 */
const useSegmentedOptions = () => {
  const [options, setOptions] = useState<
    ReadonlyMap<string, SegmentedOptionInfo>
  >(() => new Map());
  const register = useCallback((value: string, info: SegmentedOptionInfo) => {
    setOptions((current) => new Map(current).set(value, info));
    return () =>
      setOptions((current) => {
        const next = new Map(current);
        next.delete(value);
        return next;
      });
  }, []);
  return [options, register] as const;
};

/**
 * Its options' segments (a radio group, Base UI's; its options its
 * children, see `SegmentedItem`): in a well, the chosen one's raised (a
 * thumb, moved to it as it's chosen, by its box: its corners the well's
 * less its padding, a pill while short); dragged between (see
 * `dragProps`). None shown (1x1): there all the same, unseen, its options
 * telling the card theirs.
 */
const SegmentedChoice = ({
  children,
  isNarrow,
  layout,
  name,
  onValueChange,
  value,
}: {
  children: ReactNode;
  /** One wide (stacked: each its symbol over its words, see Card). */
  isNarrow: boolean;
  layout: SegmentedLayout;
  name: string;
  onValueChange: (value: string) => void;
  value: string;
}): ReactNode => {
  const group = useRef<HTMLDivElement>(null);
  const isShown = layout !== 'compact';
  // (Its thumb on the chosen segment, as it's chosen and as its box
  // changes; moved (transitioned) once it's been placed.)
  useLayoutEffect(() => {
    const root = group.current;
    const thumb = root?.querySelector<HTMLElement>('[data-part="thumb"]');
    if (!root || !thumb || !isShown) return undefined;
    const place = () => {
      placeThumb(thumb, root.querySelector('[data-checked]'));
    };
    place();
    let frame = requestAnimationFrame(() => {
      root.dataset.placed = '';
    });
    // (Its box changing (e.g. its card resized, opened): there at once, as
    // its options are; moved only as another's chosen. Its first report
    // (as it's observed, each choice: this effect's again) no change.)
    let size = `${String(root.offsetWidth)}x${String(root.offsetHeight)}`;
    const observer = new ResizeObserver(() => {
      const next = `${String(root.offsetWidth)}x${String(root.offsetHeight)}`;
      if (next === size) return;
      size = next;
      cancelAnimationFrame(frame);
      delete root.dataset.placed;
      place();
      frame = requestAnimationFrame(() => {
        root.dataset.placed = '';
      });
    });
    observer.observe(root);
    // (Its options changing (added, removed, laid out anew), or another
    // marked chosen (Base UI's radios a render after its value): placed
    // again.)
    const mutations = new MutationObserver(place);
    mutations.observe(root, {
      attributeFilter: ['data-checked'],
      childList: true,
      subtree: true,
    });
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      mutations.disconnect();
    };
  }, [isShown, layout, value]);
  // (Dragged (see `dragProps`): its touch's moves not the page's, its pan
  // not starting as the finger strays across its options; not passive, as
  // React's listeners are.)
  useLayoutEffect(() => {
    const root = group.current;
    if (!root) return undefined;
    const hold = (move: TouchEvent) => {
      if (Object.hasOwn(root.dataset, 'dragging') && move.cancelable) {
        move.preventDefault();
      }
    };
    root.addEventListener('touchmove', hold, { passive: false });
    return () => root.removeEventListener('touchmove', hold);
  }, []);
  return (
    <BaseRadioGroup
      ref={group}
      aria-label={name}
      className="uikit-control-cards-segmented-choice"
      data-control-cards-part="segmented-choice"
      data-layout={layout}
      data-narrow={isNarrow ? '' : undefined}
      hidden={!isShown}
      value={value}
      onValueChange={(next) => onValueChange(next as string)}
      {...dragProps(layout === 'upright', onValueChange)}
    >
      <span
        aria-hidden="true"
        className="uikit-control-cards-segmented-thumb"
        data-part="thumb"
      />
      {children}
    </BaseRadioGroup>
  );
};

/**
 * A segmented card's option (a radio, Base UI's): its symbol and its words
 * (`children`), or either (its card's `optionContent`; its symbol only, its
 * words unseen, its name), a subtitle under them where there's room;
 * telling its card its symbol, words and tint (its value and symbol while
 * it's chosen).
 */
const SegmentedItem = forwardRef<HTMLElement, ControlCardSegmentedItemProps>(
  ({ children, className, icon, subtitle, tint, value, ...props }, ref) => {
    const context = useContext(SegmentedContext);
    const register = context?.register;
    useLayoutEffect(
      () => register?.(value, { icon, label: children, tint }),
      [children, icon, register, tint, value],
    );
    const content = context?.content ?? 'both';
    const hasIcon = icon !== undefined && content !== 'label';
    const isIconOnly = hasIcon && content === 'icon';
    return (
      <BaseRadio.Root
        ref={ref}
        {...props}
        className={cn('uikit-control-cards-segmented-item', className)}
        data-control-cards-part="segmented-item"
        data-value={value}
        value={value}
      >
        {hasIcon ? <Symbol icon={icon} /> : null}
        {/* (Its words, and more under them where there's room: taller
            than a row; its symbol only, unseen, its name.) */}
        <span
          className="uikit-control-cards-segmented-text"
          data-unseen={isIconOnly ? '' : undefined}
        >
          <span className="uikit-control-cards-segmented-label">
            {children}
          </span>
          {context?.layout !== 'row' && subtitle !== undefined ? (
            <span className="uikit-control-cards-segmented-subtitle">
              {subtitle}
            </span>
          ) : null}
        </span>
      </BaseRadio.Root>
    );
  },
);

/**
 * A device of a few modes (e.g. a heat pump's Off, Heat, Cool, Auto): its
 * options (its children, `SegmentedItem`s) as segments in a well at its
 * bottom (see `SegmentedChoice`), laid out by its size and orientation
 * (see `useSegmentedLayout`); 1x1, its chosen option's words only, opening
 * above the page to choose (`opening`). Lit while its chosen option isn't
 * its `offValue`; its symbol and tint the chosen option's.
 */
const SegmentedCard = forwardRef<HTMLDivElement, ControlCardSegmentedProps>(
  (
    {
      children,
      className,
      defaultValue = '',
      emphasizedIcon,
      icon,
      name,
      offValue,
      onClick,
      onValueChange,
      opening,
      optionContent = 'both',
      orientation,
      tint,
      value,
      ...props
    },
    ref,
  ) => {
    const [options, register] = useSegmentedOptions();
    // (None chosen at first: its first option.)
    const [chosenValue, setCurrent] = useControlled(value, defaultValue);
    const current = chosenValue || (options.keys().next().value ?? '');
    const [layout, isNarrow] = useSegmentedLayout(orientation);
    const item = useGridItem();
    const chosen = options.get(current);
    const isCompact = layout === 'compact';
    const context = useMemo(
      () => ({ content: optionContent, layout, register }),
      [layout, optionContent, register],
    );
    return (
      <Card.Root
        ref={ref}
        active={offValue === undefined ? undefined : current !== offValue}
        {...props}
        className={cn('uikit-control-cards-segmented', className)}
        data-control-cards-part="segmented"
        data-layout={layout}
        onClick={
          onClick ??
          (isCompact && opening ? () => item?.setOpen(true) : undefined)
        }
      >
        <Card.Symbol tint={chosen?.tint ?? tint}>
          {chosen?.icon ? (
            <Symbol
              box="square"
              icon={chosen.icon}
            />
          ) : (
            symbolOf({ emphasizedIcon, icon })
          )}
        </Card.Symbol>
        <Card.Title>{name}</Card.Title>
        {layout === 'row' ? null : <Card.Value>{chosen?.label}</Card.Value>}
        <SegmentedContext.Provider value={context}>
          <SegmentedChoice
            isNarrow={isNarrow}
            layout={layout}
            name={name}
            value={current}
            onValueChange={(next) => {
              setCurrent(next);
              onValueChange?.(next);
            }}
          >
            {children}
          </SegmentedChoice>
        </SegmentedContext.Provider>
        {/* (Its corner buttons, as a list card's: one opening it, 1x1;
            open, an x in its top trailing corner, clear of its symbol.) */}
        {opening ? (
          <>
            <Card.CornerButton
              aria-label={opening.label}
              icon={gridIcons.open}
              visible={isCompact && item?.open !== true}
              onClick={() => item?.setOpen(true)}
            />
            <Card.CornerButton
              aria-label={opening.closeLabel}
              corner="top-trailing"
              icon={gridIcons.close}
              visible={item?.open === true}
              onClick={() => item?.setOpen(false)}
            />
          </>
        ) : null}
      </Card.Root>
    );
  },
);

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
  Segmented: SegmentedCard,
  SegmentedItem,
  Channels,
  Trend,
  ExpandButton,
  OpenButtons,
};
