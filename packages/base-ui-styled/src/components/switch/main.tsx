import '../glass/style.css';
import './style.css';

import { Switch as BaseSwitch } from '@base-ui/react/switch';
import {
  ComponentProps,
  forwardRef,
  MouseEvent,
  Ref,
  useCallback,
  useLayoutEffect,
  useRef,
} from 'react';

import { cn, usePointerDrag, withStyle } from '../utils/main.js';
import type { Drag, SwitchRootProps } from './props.js';

export type { SwitchRootProps } from './props.js';

// Source: Apple iOS 26 Figma (“Toggle - Switch”, light and dark appearance),
// with Figma colors mapped to UIKit semantic colors: on `systemGreen` (or
// `tint`, UIKit `onTintColor`), off `systemFill`; the knob (`#fff`) has no
// semantic equivalent.
// The pressed glass effect and everything Figma does not specify come from
// Framework7 `components/toggle/toggle.less`, `toggle-ios.less` (iOS values,
// `.toggle-active-state`): transitions, pressed scales, glow, glass shadow.
//
// Deviations:
// - The track's end cap (Framework7 `.toggle::after`) is omitted, as it shows
//   as a separate circle while the pressed track shrinks.
// - Track size (64×28) is a minimum, not a fixed size; the knob is positioned
//   with `inset-inline-start` instead of a fixed translation, so it adapts to
//   the actual width and to right-to-left layouts.
// - The pressed state is driven by `:active` and custom properties inherited
//   by the thumb, instead of Framework7's JS-driven `.toggle-active-state`.
// - Dragging (Framework7 `toggle-class.js`) moves the knob with the pointer,
//   like the tab bar's lens, instead of only flipping the state after a third
//   of the width: the state flips whenever the knob's center crosses the
//   middle, and the knob settles on release. Releases within 300ms that did
//   not flip the state act as a tap (toggling), unless they flick towards the
//   current side (Framework7: swipes within 300ms toggle).
// - The browser's default focus ring is kept.
// - Indeterminate (as a checkbox, which the platform's switches are; UIKit:
//   none): the knob in the middle, on the off color.
//
// On/off labels (UIKit's accessibility setting “On/Off Labels”, measured on
// Apple's illustration): a 9px “I” bar (white) and a 9px “O” ring (tertiary
// label), 1px strokes, each centered in the track beside the knob on its
// side; the knob covers the other (both hidden while indeterminate, and
// while pressed, as the knob is a lens).

// Base UI's root, the props that only style it as attributes and properties.
const BaseRoot = forwardRef<HTMLSpanElement, Omit<SwitchRootProps, 'ref'>>(
  ({ indeterminate, style, tint, ...props }, ref) => (
    <BaseSwitch.Root
      ref={ref}
      data-indeterminate={indeterminate ? '' : undefined}
      style={withStyle({ '--styled-switch-on-color': tint }, style)}
      {...props}
    />
  ),
);

// The pressed state is set here too, as `:active` is lost when the state
// flips during a drag.
const dragProperties = [
  '--styled-switch-knob-move-duration',
  '--styled-switch-knob-start',
  '--styled-switch-pressed',
] as const;

const isChecked = (root: HTMLElement) => Object.hasOwn(root.dataset, 'checked');

const Root = forwardRef<HTMLSpanElement, Omit<SwitchRootProps, 'ref'>>(
  (
    {
      onClickCapture,
      onLostPointerCapture,
      onPointerCancel,
      onPointerDown,
      onPointerMove,
      onPointerUp,
      children,
      indeterminate = false,
      inputRef,
      onOffLabels = false,
      ...props
    },
    ref,
  ) => {
    const suppressClickRef = useRef(false);

    // The hidden input is indeterminate, too (as a checkbox's).
    const ownInputRef = useRef<HTMLInputElement | null>(null);
    const handleInputRef = useCallback(
      (element: HTMLInputElement | null) => {
        ownInputRef.current = element;
        if (typeof inputRef === 'function') {
          inputRef(element);
        } else if (inputRef) {
          (inputRef as { current: HTMLInputElement | null }).current = element;
        }
      },
      [inputRef],
    );
    useLayoutEffect(() => {
      const { current: input } = ownInputRef;
      if (input) input.indeterminate = indeterminate;
    });

    const handlers = usePointerDrag<HTMLSpanElement, Drag>(
      {
        end: (root, drag, cancelled) => {
          for (const property of dragProperties) {
            root.style.removeProperty(property);
          }
          if (cancelled) return;

          const quick = performance.now() - drag.startTime < 300;
          const towardsCurrent = drag.checked ? drag.moved > 0 : drag.moved < 0;

          // The native click following this release toggles; suppress it
          // unless the release acts as a tap.
          suppressClickRef.current = drag.flipped || !quick || towardsCurrent;
          setTimeout(() => {
            suppressClickRef.current = false;
          });
        },
        move: (root, drag, event) => {
          drag.moved = (event.clientX - drag.startX) * drag.direction;

          const start = Math.max(
            drag.min,
            Math.min(drag.start + drag.moved, drag.max),
          );

          root.style.setProperty('--styled-switch-knob-move-duration', '0s');
          root.style.setProperty('--styled-switch-knob-start', `${start}px`);

          const checked = (start - drag.min) / (drag.max - drag.min) > 0.5;
          if (checked === isChecked(root)) return;

          drag.flipped = true;
          root.click();
        },
        start: (root, event) => {
          const { firstElementChild: thumb } = root;
          if (!(thumb instanceof HTMLElement)) return undefined;
          if (
            Object.hasOwn(root.dataset, 'disabled') ||
            Object.hasOwn(root.dataset, 'readonly')
          ) {
            return undefined;
          }

          const rootRect = root.getBoundingClientRect();
          const thumbRect = thumb.getBoundingClientRect();
          const direction = getComputedStyle(root).direction === 'rtl' ? -1 : 1;
          const min = Number.parseFloat(getComputedStyle(thumb).top);

          root.style.setProperty('--styled-switch-pressed', '1');

          return {
            checked: isChecked(root),
            direction,
            flipped: false,
            max: rootRect.width - thumbRect.width - min,
            min,
            moved: 0,
            start:
              direction === 1
                ? thumbRect.left - rootRect.left
                : rootRect.right - thumbRect.right,
            startTime: performance.now(),
            startX: event.clientX,
          };
        },
      },
      {
        onLostPointerCapture,
        onPointerCancel,
        onPointerDown,
        onPointerMove,
        onPointerUp,
      },
    );

    const handleClickCapture = useCallback(
      (event: MouseEvent<HTMLSpanElement>) => {
        (
          onClickCapture as
            ((clickEvent: MouseEvent<HTMLSpanElement>) => void) | undefined
        )?.(event);
        if (!suppressClickRef.current) return;

        suppressClickRef.current = false;
        event.preventDefault();
        event.stopImmediatePropagation();
      },
      [onClickCapture],
    );

    return (
      <BaseRoot
        ref={ref}
        indeterminate={indeterminate}
        inputRef={handleInputRef as Ref<HTMLInputElement>}
        {...props}
        {...handlers}
        className={cn('bus-switch-root', props.className)}
        onClickCapture={handleClickCapture}
      >
        {children}
        {onOffLabels ? (
          <>
            <span
              aria-hidden="true"
              className="bus-switch-on-label"
              data-switch-part="label"
            />
            <span
              aria-hidden="true"
              className="bus-switch-off-label"
              data-switch-part="label"
            />
          </>
        ) : null}
      </BaseRoot>
    );
  },
);

const Thumb = forwardRef<
  HTMLElement,
  Omit<ComponentProps<typeof BaseSwitch.Thumb>, 'ref'>
>(({ className, ...props }, ref) => (
  <BaseSwitch.Thumb
    ref={ref}
    className={cn('bus-switch-thumb', className)}
    {...props}
  />
));

export const Switch = {
  ...BaseSwitch,
  Root,
  Thumb,
};
