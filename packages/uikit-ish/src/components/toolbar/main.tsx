import '../button/style.css';
import '../glass/style.css';
import '../typography/style.css';
import './style.css';

import { Toolbar as BaseToolbar } from '@base-ui/react/toolbar';
import { useRender } from '@base-ui/react/use-render';
import { ComponentProps, createContext, forwardRef, useContext } from 'react';

import { Button, ButtonRootProps } from '../button/main.js';
import {
  GlassBackground,
  InheritedGlassContext,
  useGlassContext,
} from '../glass/main.js';
import { cn, useForwardedRef, withStyle } from '../utils/main.js';
import type {
  ToolbarButtonProps,
  ToolbarGroupProps,
  ToolbarRootProps,
  ToolbarSideProps,
  ToolbarTitleProps,
} from './props.js';

export type {
  ToolbarButtonProps,
  ToolbarGroupProps,
  ToolbarRootProps,
  ToolbarSideProps,
  ToolbarTitleProps,
} from './props.js';

// Source: Apple iOS 26 Figma (“Toolbars”: “Toolbar - Bottom”, “Toobar - Top -
// iPhone”, “_Buttons - Top”, “_Button - Bottom”, BG Context Dim/Bright), with
// the glass materials and vibrant content colors as tokens in `styles.css`,
// used via `glass/main.tsx`, and the titles' colors mapped to UIKit's label
// colors (`label`, `secondaryLabel`).
//
// A toolbar holds glass capsules (`Group`) of buttons (`Button`): at the
// bottom (default) 48px high, their buttons 36px, 6px from the capsule's
// ends and 12px apart; at the top (`placement`, a navigation bar) 44px high,
// 4px from the ends. Capsules sit at the bar's start (`Leading`) and end
// (`Trailing`), 12px (top: 10px) apart, anything else (a `Title`, a page
// control, a field) between them. A button of its own is a glass `Button`
// (a circle for a symbol); several share a capsule (`Group`). Symbols and
// labels are 17px (510, SF Pro's `ss16` alternates), in the glass' vibrant
// content color; glass can be tinted (`prominent`, Figma “Text - Primary”,
// “Symbol Primary”), its content white.
//
// Titles (Figma “Title”, “Title and Subtitle”): Body Emphasized, centered
// in the bar; with a subtitle, over 12px (510) in the secondary label
// color. Large titles sit below a top bar (see `Header`).
//
// Deviations:
// - The bar's middle is centered in it while the sides fit (as iOS's
//   titles; Figma: the title absolutely centered): the sides share the free
//   space equally; a title aligned to the start (or anything taking the
//   free space) takes all of it instead.
// - Pressed, a capsule of several buttons turns into a glass lens as the tab
//   bar's groups do (scaled up by 1.05, measured on iOS 26), the pressed
//   button showing the selection (Figma: no pressed state).
// - The bottom bar's padding is Figma's (4px 16px 36px, the home
//   indicator's 34px included), not the safe area's.
// - With a subtitle, the title stays in 17px (Figma: 15px), as iOS 26's
//   (user: not smaller than the rows' text).

/** The bar (its glass context also for glass inside it). */
const Root = forwardRef<HTMLDivElement, ToolbarRootProps>(
  (
    { className, context: contextProp, placement = 'block-end', ...props },
    forwardedRef,
  ) => {
    const ref = useForwardedRef(forwardedRef);
    const context = useGlassContext(ref, contextProp);

    return (
      <InheritedGlassContext.Provider value={context}>
        <BaseToolbar.Root
          ref={ref}
          data-glass-context={context ?? 'auto'}
          data-placement={placement}
          {...props}
          className={cn('uikit-toolbar-root', className)}
          data-toolbar-part="root"
        />
      </InheritedGlassContext.Provider>
    );
  },
);

/** The bar's start: its leading capsules. */
const Leading = forwardRef<HTMLElement, ToolbarSideProps>(
  ({ className, render, ...props }, ref) =>
    useRender({
      defaultTagName: 'div',
      props: {
        'data-toolbar-part': 'leading',
        className: cn('uikit-toolbar-leading', className),
        ...props,
      },
      ref,
      render,
    }),
);

/** The bar's end: its trailing capsules. */
const Trailing = forwardRef<HTMLElement, ToolbarSideProps>(
  ({ className, render, ...props }, ref) =>
    useRender({
      defaultTagName: 'div',
      props: {
        'data-toolbar-part': 'trailing',
        className: cn('uikit-toolbar-trailing', className),
        ...props,
      },
      ref,
      render,
    }),
);

/** Free space between parts (e.g. a capsule at each end, without sides). */
const Spacer = forwardRef<HTMLDivElement, ComponentProps<'div'>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('uikit-toolbar-spacer', className)}
      data-toolbar-part="spacer"
      {...props}
    />
  ),
);

// Whether a button is in a capsule of several (see `ToolbarButton`).
const GroupContext = createContext(false);

/**
 * A glass capsule of several buttons (Figma “Button Group”); a single
 * button is a glass `Button` of its own (see `ToolbarButton`).
 */
const Group = forwardRef<HTMLDivElement, ToolbarGroupProps>(
  (
    { className, children, prominent, style, textColor, tint, ...props },
    ref,
  ) => {
    const tinted = prominent ?? tint !== undefined;
    // With its own tint: the glass context's variables made of it (their
    // tint resolved here, not at the toolbar's).
    const context = useContext(InheritedGlassContext);

    return (
      <BaseToolbar.Group
        ref={ref}
        data-prominent={tinted ? '' : undefined}
        data-glass-context={
          tint === undefined ? undefined : (context ?? 'auto')
        }
        style={withStyle(
          {
            '--uikit-glass-tint': tint,
            '--uikit-toolbar-content': textColor,
            '--uikit-toolbar-content-blend':
              textColor === undefined ? undefined : 'normal',
          },
          style,
        )}
        {...props}
        className={cn('uikit-toolbar-group', className)}
        data-toolbar-part="group"
      >
        <GlassBackground
          kind="button"
          tinted={tinted}
        />
        <GroupContext.Provider value>{children}</GroupContext.Provider>
      </BaseToolbar.Group>
    );
  },
);

const isClassic = (variant: ButtonRootProps['variant']) =>
  variant !== undefined && variant !== 'glass' && variant !== 'glass-prominent';

/**
 * A toolbar button (`Button.Root`, with `Button.Icon` or `Button.Label`
 * content), in the toolbar's keyboard navigation: in a `Group`, one of its
 * buttons (in the capsule's style: as `Button`, as far as that goes; not
 * its `size`, `context`, nor glass variants, which are the capsule's);
 * otherwise a `Button` of its own (by default, glass).
 */
const ToolbarButton = forwardRef<HTMLButtonElement, ToolbarButtonProps>(
  (
    {
      context,
      cursor,
      destructive,
      fill,
      onSecondaryClick,
      prominent,
      render,
      shape,
      size,
      tint,
      variant,
      ...props
    },
    ref,
  ) => {
    const inGroup = useContext(GroupContext);
    // (Alone: the bar's glass context, unless its own.)
    const inherited = useContext(InheritedGlassContext);
    const shared = { cursor, destructive, onSecondaryClick, tint };

    return (
      <BaseToolbar.Button
        ref={ref}
        data-toolbar-part="button"
        {...props}
        render={
          render ??
          (inGroup ? (
            // Figma “Symbol”, “Text”: 36px (symbols: circles, as their 17px
            // glyph and the padding are narrower), the content vibrant (blended
            // with the glass), scaled with the capsule's lens; pressed among
            // several, the selection. As `Button` as far as that goes in a
            // capsule: tinted, destructive, a classic variant (its own colors
            // and fill; glass ones are the capsule's), a circle, filling the
            // capsule's free space. Over the button's own styles (doubled).
            <Button.Root
              {...shared}
              className="uikit-toolbar-button"
              data-toolbar-classic={isClassic(variant) ? '' : undefined}
              fill={fill}
              shape={shape}
              variant={isClassic(variant) ? variant : undefined}
              data-toolbar-tinted={
                (destructive ?? tint) && !isClassic(variant) ? '' : undefined
              }
            />
          ) : (
            // A button of its own: a `Button`, by default a glass one (Figma
            // “_Button - Bottom”, “_Buttons - Top”), as high as the bar's
            // capsules, its content as theirs; text 12px from its ends (Figma:
            // 6px around a “Text” frame of 6px padding). Other variants are as
            // `Button`'s. (Over the button's own styles: tripled.)
            <Button.Root
              {...shared}
              className="uikit-toolbar-glass-button"
              context={context ?? inherited}
              fill={fill}
              shape={shape}
              size={size}
              variant={variant ?? (prominent ? 'glass-prominent' : 'glass')}
            />
          ))
        }
      />
    );
  },
);

/** The bar's title; takes the free space when aligned to the start. */
const Title = forwardRef<HTMLElement, ToolbarTitleProps>(
  ({ alignStart, className, render, ...props }, ref) =>
    useRender({
      defaultTagName: 'div',
      props: {
        'data-align-start': alignStart ? '' : undefined,
        'data-toolbar-part': 'title',
        className: cn('uikit-toolbar-title', className),
        ...props,
      },
      ref,
      render,
    }),
);

/** A title's subtitle (Figma “Subtitle”), inside `Title`. */
const Subtitle = forwardRef<HTMLElement, useRender.ComponentProps<'span'>>(
  ({ className, render, ...props }, ref) =>
    useRender({
      defaultTagName: 'span',
      props: {
        'data-toolbar-part': 'subtitle',
        className: cn('uikit-toolbar-subtitle', className),
        ...props,
      },
      ref,
      render,
    }),
);

export const Toolbar = {
  ...BaseToolbar,
  Root,
  Leading,
  Trailing,
  Spacer,
  Group,
  Button: ToolbarButton,
  Title,
  Subtitle,
};
