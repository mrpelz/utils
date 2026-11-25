import '../card/style.css';
import '../card/parts.css';
import './style.css';

import {
  forwardRef,
  type ReactNode,
  useCallback,
  useMemo,
  useState,
} from 'react';

import { Badge } from '../badge/main.js';
import { OpenButtonHintContext } from '../card/buttons.js';
import { ChannelsHostContext } from '../card/channels.js';
import { Card, type CardLight } from '../card/main.js';
import {
  SegmentedHostContext,
  type SegmentedLayout,
  type SegmentedOptionInfo,
  useSegmentedOptions,
} from '../card/segmented.js';
import {
  formatted,
  percentFormat,
  useControlled,
  useIsLarge,
} from '../card/shared.js';
import { useGridItem } from '../grid/main.js';
import { forwardClick } from '../list/main.js';
import { Symbol, type SymbolIcon } from '../symbol/main.js';
import { cn, withStyle } from '../utils/main.js';
import type {
  ControlCardButtonProps,
  ControlCardLightProps,
  ControlCardListProps,
  ControlCardProgressProps,
  ControlCardSegmentedProps,
  ControlCardSliderProps,
  ControlCardStagesProps,
  ControlCardStateProps,
  ControlCardStates,
  ControlCardSwitchProps,
  ControlCardValueProps,
  ControlCardValueTextDetails,
} from './props.js';

export type {
  ControlCardButtonProps,
  ControlCardGetValueText,
  ControlCardLightProps,
  ControlCardListProps,
  ControlCardProgressProps,
  ControlCardProps,
  ControlCardSegmentedProps,
  ControlCardSliderProps,
  ControlCardStagesProps,
  ControlCardStateProps,
  ControlCardStates,
  ControlCardSwitchProps,
  ControlCardValueProps,
  ControlCardValueTextDetails,
} from './props.js';

// Control cards: ready-made cards for what a home's devices show and
// control (a state, a switch, a value, a slider, a momentary button, a
// progress, a run of stages, a light of several channels, a summary in
// rows, a few modes), each a `Card.Root` and Card's parts, composed. A
// namespace, not one component's parts: each card stands on its own, its
// other props its `Card.Root`'s. Its `children` added after its parts
// (e.g. a corner button); a composed card's (a progress, stages, a light,
// rows, a choice) its own parts too, Card's, as the app shows them.

/** The words for on and off, unless given. */
const onOff: ControlCardStates = ['On', 'Off'];

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

/** Its switching: on or off, controlled or its own, told as it changes. */
const useSwitching = (
  checked: boolean | undefined,
  defaultChecked: boolean,
  onCheckedChange: ((checked: boolean) => void) | undefined,
) => {
  const [isOn, setIsOn] = useControlled(checked, defaultChecked);
  const switchTo = (next: boolean) => {
    setIsOn(next);
    onCheckedChange?.(next);
  };
  return [isOn, switchTo] as const;
};

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
      label,
      states = onOff,
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
      <Card.Title>{label}</Card.Title>
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
      disabled,
      emphasizedIcon,
      icon,
      label,
      onCheckedChange,
      onClick,
      states = onOff,
      tint,
      ...props
    },
    ref,
  ) => {
    const [isOn, switchTo] = useSwitching(
      checked,
      defaultChecked,
      onCheckedChange,
    );
    return (
      <Card.Root
        ref={ref}
        active={isOn}
        {...props}
        className={cn('uikit-control-cards-switch', className)}
        data-control-cards-part="switch"
        onClick={
          onClick ??
          (disabled ? undefined : forwardClick('[role=switch]:not([disabled])'))
        }
      >
        <Card.Symbol tint={tint}>
          {symbolOf({ emphasizedIcon, icon })}
        </Card.Symbol>
        <Card.Title>{label}</Card.Title>
        <Card.Value>{isOn ? states[0] : states[1]}</Card.Value>
        <Card.Switch
          aria-label={label}
          checked={isOn}
          disabled={disabled}
          tint={tint}
          onCheckedChange={switchTo}
        />
        {children}
      </Card.Root>
    );
  },
);

/**
 * A numerical display: its value, formatted as the app says, and its
 * trend (a `Card.Trend` after it), if given.
 */
const Value = forwardRef<HTMLDivElement, ControlCardValueProps>(
  (
    {
      children,
      className,
      emphasizedIcon,
      format,
      icon,
      label,
      locale,
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
      <Card.Title>{label}</Card.Title>
      <Card.Value>
        {typeof value === 'number'
          ? formatted(value, { format, locale })
          : value}
        {trend === undefined ? null : <Card.Trend angle={trend} />}
      </Card.Value>
      {children}
    </Card.Root>
  ),
);

/**
 * A slider card's value text by default (see `getValueText`): with a
 * switch, its state's word and its number (“On · 60%”); without one, its
 * number.
 */
const defaultValueText = (
  formattedValue: string,
  _value: number,
  { checked, states: [on, off] }: ControlCardValueTextDetails,
) =>
  checked === undefined
    ? formattedValue
    : `${checked ? on : off} · ${formattedValue}`;

/**
 * A numerical control: a `Card.Slider` in a card, its symbol at its top.
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
      disabled,
      emphasizedIcon,
      format,
      getValueText = defaultValueText,
      icon,
      label,
      locale,
      max = 100,
      min = 0,
      onCheckedChange,
      onValueChange,
      states = onOff,
      step,
      tint,
      value,
      ...props
    },
    ref,
  ) => {
    const [current, setCurrent] = useControlled(value, defaultValue ?? min);
    const hasSwitch = checked !== undefined || defaultChecked !== undefined;
    const [isOn, switchTo] = useSwitching(
      checked,
      defaultChecked ?? true,
      onCheckedChange,
    );
    // (Its symbol on: a brightness's above its minimum, while on; else, as
    // its switch, if any.)
    const isOnAtAll = !hasSwitch || isOn;
    const isSymbolOn = brightness
      ? isOnAtAll && current > min
      : hasSwitch && isOn;
    const details = { checked: hasSwitch ? isOn : undefined, states };
    const text = (formattedValue: string, number: number) =>
      getValueText(formattedValue, number, details);
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
        <Card.Slider
          disabled={disabled}
          format={format}
          getAriaValueText={text}
          label={label}
          locale={locale}
          max={max}
          min={min}
          step={step}
          tint={tint}
          value={current}
          onPress={hasSwitch && !disabled ? () => switchTo(!isOn) : undefined}
          onValueChange={(next) => {
            setCurrent(next);
            onValueChange?.(next);
          }}
        >
          {text}
        </Card.Slider>
        {hasSwitch ? (
          <Card.Switch
            aria-label={label}
            checked={isOn}
            disabled={disabled}
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
 * A momentary button: a press (its `onClick`) does something once (e.g. a
 * doorbell rung, all lights off); it lights up for a moment and fades
 * back, also as the app flashes it (`actionsRef`). A badge on its symbol,
 * if given.
 */
const Button = forwardRef<HTMLDivElement, ControlCardButtonProps>(
  (
    {
      badge,
      children,
      className,
      emphasizedIcon,
      icon,
      label,
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
    >
      <Card.Symbol>
        {symbolOf(
          { emphasizedIcon, icon },
          badge === undefined || badge === null ? null : (
            <Badge placement="symbol">{badge}</Badge>
          ),
        )}
      </Card.Symbol>
      <Card.Title>{label}</Card.Title>
      {status === undefined ? null : <Card.Value>{status}</Card.Value>}
      {children}
    </Card.Root>
  ),
);

/**
 * A device's progress (e.g. a washer's run): its symbol (in its tint) and
 * its title; its parts composed in it (its children: a `Card.Progress`
 * holding a `Card.Subtitle`, a `Card.ProgressValue`, a `Card.ProgressBar`),
 * as the app shows them; its bar's fill in its tint (unless the bar's own).
 */
const ProgressCard = forwardRef<HTMLDivElement, ControlCardProgressProps>(
  (
    {
      active,
      children,
      className,
      emphasizedIcon,
      icon,
      label,
      style,
      tint,
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
      style={withStyle({ '--uikit-card-progress-tint': tint }, style)}
    >
      {/* (In its tint, as its fill: the app's, by default.) */}
      <Card.Symbol tint={tint ?? 'var(--color-ui-primary)'}>
        {symbolOf({ emphasizedIcon, icon })}
      </Card.Symbol>
      <Card.Title>{label}</Card.Title>
      {children}
    </Card.Root>
  ),
);

/**
 * A run of stages in order (e.g. a washer's: Wash, Rinse, Spin, Done),
 * shown, not chosen: its symbol (in its tint) and its title, its parts
 * composed in it (its children: a `Card.Subtitle`, a `Card.StageList` of
 * `Card.Stage`s, its current one its `value`), its stages in its tint
 * (unless the list's own). Never 1x1 (see `cardSizes.stagesDisplay`).
 */
const StagesCard = forwardRef<HTMLDivElement, ControlCardStagesProps>(
  (
    {
      active,
      children,
      className,
      emphasizedIcon,
      icon,
      label,
      style,
      tint,
      ...props
    },
    ref,
  ) => (
    <Card.Root
      ref={ref}
      active={active}
      {...props}
      className={cn('uikit-control-cards-stages', className)}
      data-control-cards-part="stages"
      style={withStyle({ '--uikit-card-stages-tint': tint }, style)}
    >
      {/* (In its tint, as its stages: the app's, by default.) */}
      <Card.Symbol tint={tint ?? 'var(--color-ui-primary)'}>
        {symbolOf({ emphasizedIcon, icon })}
      </Card.Symbol>
      <Card.Title>{label}</Card.Title>
      {children}
    </Card.Root>
  ),
);

/**
 * A light's value text by default (see `getValueText`): on, its
 * brightness; off, its off word.
 */
const lightValueText = (
  formattedValue: string,
  _value: number,
  { checked, states: [, off] }: ControlCardValueTextDetails,
) => (checked ? formattedValue : off);

/**
 * A light of several channels (e.g. red, green, blue): a switch, lit while
 * on, its symbol in the color its channels make (see `Card.Channels`'
 * light), its value its brightness (its strongest amount channel's share).
 * Its channels composed in it (a `Card.Channels`, its children), shown
 * while it's large (expanded, resized, opened). A press on its body (not on
 * its channels: theirs, see `forwardClick`) toggles it.
 */
const Light = forwardRef<HTMLDivElement, ControlCardLightProps>(
  (
    {
      checked,
      children,
      className,
      defaultChecked = false,
      disabled,
      emphasizedIcon,
      format = percentFormat,
      getValueText = lightValueText,
      icon,
      label,
      locale,
      onCheckedChange,
      onClick,
      states = onOff,
      ...props
    },
    ref,
  ) => {
    const [isOn, switchTo] = useSwitching(
      checked,
      defaultChecked,
      onCheckedChange,
    );
    const isLarge = useIsLarge();
    const [light, setLight] = useState<CardLight>({
      brightness: 1,
      color: undefined,
    });
    const onLightChange = useCallback((next: CardLight) => {
      setLight((last) =>
        last.brightness === next.brightness && last.color === next.color
          ? last
          : next,
      );
    }, []);
    const host = useMemo(
      () => ({ isShown: isLarge, onLightChange }),
      [isLarge, onLightChange],
    );
    const color = isOn ? light.color : undefined;
    const formattedValue = formatted(light.brightness, { format, locale });
    return (
      <Card.Root
        ref={ref}
        {...props}
        className={cn('uikit-control-cards-light', className)}
        data-control-cards-part="light"
        onClick={
          onClick ??
          (disabled ? undefined : forwardClick('[role=switch]:not([disabled])'))
        }
      >
        <Card.Symbol style={color ? { color } : undefined}>
          {symbolOf({ emphasizedIcon, icon })}
        </Card.Symbol>
        <Card.Switch
          aria-label={label}
          checked={isOn}
          disabled={disabled}
          tint={color}
          onCheckedChange={switchTo}
        />
        <Card.Title>{label}</Card.Title>
        <Card.Value>
          {getValueText(formattedValue, light.brightness, {
            checked: isOn,
            states,
          })}
        </Card.Value>
        <ChannelsHostContext.Provider value={host}>
          {children}
        </ChannelsHostContext.Provider>
      </Card.Root>
    );
  },
);

/**
 * A summary in rows (e.g. a room's, a device's details): its symbol, its
 * title and status beside it at its top, its rows (a `Card.Rows`, its
 * children) in a well at its bottom, as many as fit whole; rows left out,
 * its last row counts them, expanding or opening its tile (see
 * `Card.Rows`).
 */
const ListCard = forwardRef<HTMLDivElement, ControlCardListProps>(
  (
    { children, className, emphasizedIcon, icon, label, status, ...props },
    ref,
  ) => (
    <Card.Root
      ref={ref}
      {...props}
      className={cn('uikit-control-cards-list', className)}
      data-control-cards-part="list"
    >
      <Card.Symbol>{symbolOf({ emphasizedIcon, icon })}</Card.Symbol>
      <Card.Title>{label}</Card.Title>
      {status === undefined ? null : <Card.Value>{status}</Card.Value>}
      {children}
    </Card.Root>
  ),
);

/**
 * A device of a few modes (e.g. a heat pump's Off, Heat, Cool, Auto): its
 * choice composed in it (a `Card.Segmented` of `Card.SegmentedItem`s, its
 * children), laid out by its size; 1x1, its chosen option's words only, a
 * press on it opening it above the page (its grid item's `openSize` given;
 * a `Card.OpenButton` and a `Card.CloseButton` among its children). Lit
 * while its chosen option isn't its `offValue`; its symbol and tint the
 * chosen option's.
 */
const SegmentedCard = forwardRef<HTMLDivElement, ControlCardSegmentedProps>(
  (
    {
      children,
      className,
      emphasizedIcon,
      icon,
      label,
      offValue,
      onClick,
      tint,
      ...props
    },
    ref,
  ) => {
    const [options, register] = useSegmentedOptions();
    const [{ layout, value }, setReported] = useState<{
      layout: SegmentedLayout | undefined;
      value: string | undefined;
    }>({ layout: undefined, value: undefined });
    const report = useCallback(
      (next: string, nextLayout: SegmentedLayout) =>
        setReported((last) =>
          last.value === next && last.layout === nextLayout
            ? last
            : { layout: nextLayout, value: next },
        ),
      [],
    );
    const host = useMemo(() => ({ register, report }), [register, report]);
    const item = useGridItem();
    const chosen: SegmentedOptionInfo | undefined =
      value === undefined ? undefined : options.get(value);
    const isCompact = layout === 'compact';
    return (
      <Card.Root
        ref={ref}
        active={
          offValue === undefined || value === undefined
            ? undefined
            : value !== offValue
        }
        {...props}
        className={cn('uikit-control-cards-segmented', className)}
        data-control-cards-part="segmented"
        onClick={
          onClick ??
          (isCompact && item?.canOpen ? () => item.setOpen(true) : undefined)
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
        <Card.Title>{label}</Card.Title>
        {layout === 'row' ? null : <Card.Value>{chosen?.label}</Card.Value>}
        <SegmentedHostContext.Provider value={host}>
          {/* (Its open button shown only while its options aren't.) */}
          <OpenButtonHintContext.Provider value={isCompact}>
            {children}
          </OpenButtonHintContext.Provider>
        </SegmentedHostContext.Provider>
      </Card.Root>
    );
  },
);

export const ControlCards = {
  State,
  Switch: SwitchCard,
  Value,
  Slider: SliderCard,
  Button,
  Progress: ProgressCard,
  Stages: StagesCard,
  Light,
  List: ListCard,
  Segmented: SegmentedCard,
};
