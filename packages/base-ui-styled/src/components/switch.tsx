import { Switch as BaseSwitch } from '@base-ui/react/switch';
import { Properties } from 'csstype';
import { styled } from 'goober';
import { forwardRef, MouseEvent, useCallback, useRef } from 'react';

import { glassLensGlow, glassLensScale } from './glass.js';
import { usePointerDrag } from './utils.js';

// Source: Apple iOS 26 Figma (“Toggle - Switch”, light and dark appearance),
// with Figma colors mapped to UIKit semantic colors: on `systemGreen`, off
// `systemFill`; the knob (`#fff`) has no semantic equivalent.
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

export type SwitchRootProps = BaseSwitch.Root.Props & {
  cursor?: Properties['cursor'];
};

// eslint-disable-next-line prettier/prettier
const StyledRoot = styled<typeof BaseSwitch.Root, SwitchRootProps>(BaseSwitch.Root, forwardRef)`
  --styled-cursor: attr(
    cursor type(\<custom-ident\>),
    ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')}
  );
  --styled-switch-min-width: 64px;
  --styled-switch-min-height: 28px;
  --styled-switch-knob-width: 39px;
  --styled-switch-knob-start: 2px;
  --styled-switch-pressed: 0;
  --styled-switch-on-color: var(--color-ios-system-green);
  --styled-switch-off-color: var(--color-ios-system-fill);

  position: relative;
  display: inline-block;
  min-width: var(--styled-switch-min-width);
  min-height: var(--styled-switch-min-height);
  box-sizing: border-box;
  align-self: center;
  border-radius: 100px;
  touch-action: pan-y;
  user-select: none;
  vertical-align: middle;

  @media (hover: hover) {
    cursor: var(--styled-cursor);
  }

  &::before {
    position: absolute;
    z-index: 0;
    border-radius: inherit;
    background-color: var(--styled-switch-off-color);
    content: '';
    inset: 0;
    transform: scale(calc(1 - 0.25 * var(--styled-switch-pressed)));
    transition-duration: var(--glass-ios-lens-duration);
  }

  &[data-checked] {
    --styled-switch-knob-start: calc(
      100% - var(--styled-switch-knob-width) - 2px
    );

    &::before {
      background-color: var(--styled-switch-on-color);
    }
  }

  &:active {
    --styled-switch-pressed: 1;
  }

  &[data-disabled],
  &[data-readonly] {
    --styled-switch-pressed: 0;
  }

  &[data-disabled] {
    opacity: 0.55;
  }
`;

type Drag = {
  checked: boolean;
  direction: 1 | -1;
  flipped: boolean;
  max: number;
  min: number;
  moved: number;
  start: number;
  startTime: number;
  startX: number;
};

// The pressed state is set here too, as `:active` is lost when the state
// flips during a drag.
const dragProperties = [
  '--styled-switch-knob-move-duration',
  '--styled-switch-knob-start',
  '--styled-switch-pressed',
] as const;

const isChecked = (root: HTMLElement) => Object.hasOwn(root.dataset, 'checked');

const Root = forwardRef<HTMLSpanElement, SwitchRootProps>(
  (
    {
      onClickCapture,
      onLostPointerCapture,
      onPointerCancel,
      onPointerDown,
      onPointerMove,
      onPointerUp,
      ...props
    },
    ref,
  ) => {
    const suppressClickRef = useRef(false);

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
      <StyledRoot
        ref={ref}
        {...props}
        {...handlers}
        onClickCapture={handleClickCapture}
      />
    );
  },
);

const Thumb = styled(BaseSwitch.Thumb, forwardRef)`
  position: absolute;
  z-index: 1;
  top: 2px;
  bottom: 2px;
  display: block;
  width: var(--styled-switch-knob-width);
  box-sizing: border-box;
  border-radius: 100px;
  background-color: color-mix(
    in srgb,
    #fff calc((1 - var(--styled-switch-pressed)) * 100%),
    transparent
  );
  inset-inline-start: var(--styled-switch-knob-start);
  transform: scale(${glassLensScale('var(--styled-switch-pressed)')});
  transform-origin: center;
  transition-duration:
    var(--styled-switch-knob-move-duration, var(--glass-ios-lens-duration)),
    var(--glass-ios-lens-duration), var(--glass-ios-lens-duration);
  transition-property: inset-inline-start, background-color, transform;

  &::before {
    ${glassLensGlow(
      'var(--styled-switch-on-color)',
      'var(--styled-switch-pressed)',
    )}
  }

  &::after {
    position: absolute;
    border-radius: inherit;
    box-shadow: var(--glass-ios-lens-shadow);
    content: '';
    inset: 0;
    opacity: var(--styled-switch-pressed);
    transition-duration: var(--glass-ios-lens-duration);
  }
`;

export const Switch = {
  ...BaseSwitch,
  Root,
  Thumb,
};
