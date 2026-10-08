import { Toolbar as BaseToolbar } from '@base-ui/react/toolbar';
import { useRender } from '@base-ui/react/use-render';
import { styled } from 'goober';
import { createContext, forwardRef, useContext } from 'react';

import { Button, ButtonRootProps } from './button.js';
import {
  GlassBackground,
  GlassContext,
  glassContext,
  InheritedGlassContext,
} from './glass.js';
import { textStyle } from './typography.js';
import { css, fontWeight } from './utils.js';

// Source: Apple iOS 26 Figma (“Toolbars”: “Toolbar - Bottom”, “Toobar - Top -
// iPhone”, “_Buttons - Top”, “_Button - Bottom”, BG Context Dim/Bright), with
// the glass materials and vibrant content colors as tokens in `styles.tsx`,
// used via `glass.tsx`, and the titles' colors mapped to UIKit's label
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
// in the bar; with a subtitle, 15px (590) over 12px (510) in the secondary
// label color. Large titles sit below a top bar (see `Header`).
//
// Deviations:
// - The bar's middle is centered in it while the sides fit (as iOS's
//   titles; Figma: the title absolutely centered): the sides share the free
//   space equally; a title aligned to the start (or anything taking the
//   free space) takes all of it instead.
// - Pressed, a capsule of several buttons turns into a glass lens as glass
//   buttons do (see `Button`), the pressed button showing the selection
//   (Figma: no pressed state).
// - The bottom bar's padding is Figma's (4px 16px 36px, the home
//   indicator's 34px included), not the safe area's.

type Placement = 'bottom' | 'top';

/** Marks a toolbar's internal parts. */
const part = 'data-toolbar-part';

const placementVars: Record<Placement, string> = {
  bottom: css`
    --styled-toolbar-group-height: 48px;
    --styled-toolbar-group-padding: 6px;
    --styled-toolbar-gap: 12px;
    --styled-toolbar-text-padding: 6px;

    padding: 4px 16px 36px;
  `,
  top: css`
    --styled-toolbar-group-height: 44px;
    --styled-toolbar-group-padding: 4px;
    --styled-toolbar-gap: 10px;
    --styled-toolbar-text-padding: 8px;

    min-height: 54px;
    padding: 0 16px 10px;
  `,
};

export type ToolbarRootProps = Omit<BaseToolbar.Root.Props, 'ref'> & {
  /**
   * Brightness of the content behind the glass.
   * @default 'bright', or 'dim' in dark mode
   */
  context?: GlassContext;
  /**
   * Where the bar is: at the bottom, or at the top (a navigation bar).
   * @default 'bottom'
   */
  placement?: Placement;
};

// eslint-disable-next-line prettier/prettier
const StyledRoot = styled<typeof BaseToolbar.Root, BaseToolbar.Root.Props & Omit<ToolbarRootProps, keyof BaseToolbar.Root.Props>>(BaseToolbar.Root, forwardRef)`
  ${({ context }) => glassContext(context)}

  display: flex;
  box-sizing: border-box;
  align-items: center;
  gap: var(--styled-toolbar-gap);

  ${({ placement = 'bottom' }) => placementVars[placement]}
`;

/** The bar (its glass context also for glass inside it). */
const Root = forwardRef<HTMLDivElement, ToolbarRootProps>((props, ref) => (
  <InheritedGlassContext.Provider value={props.context}>
    <StyledRoot
      ref={ref}
      {...props}
    />
  </InheritedGlassContext.Provider>
));

export type ToolbarSideProps = useRender.ComponentProps<'div'>;

// The bar's sides share its free space equally, so its middle is centered
// while they fit (see above); never narrower than their content.
const side = css`
  display: flex;
  min-width: max-content;
  flex: 1 1 0;
  align-items: center;
  gap: var(--styled-toolbar-gap);
`;

const sidePart = (name: string) =>
  forwardRef<HTMLElement, ToolbarSideProps>(({ render, ...props }, ref) =>
    useRender({
      defaultTagName: 'div',
      props: { [part]: name, ...props },
      ref,
      render,
    }),
  );

/** The bar's start: its leading capsules. */
const Leading = styled(sidePart('leading'), forwardRef)`
  ${side}

  justify-content: flex-start;
`;

/** The bar's end: its trailing capsules. */
const Trailing = styled(sidePart('trailing'), forwardRef)`
  ${side}

  justify-content: flex-end;
`;

/** Free space between parts (e.g. a capsule at each end, without sides). */
const Spacer = styled('div', forwardRef)`
  flex: 1 1 0;
`;

export type ToolbarGroupProps = Omit<BaseToolbar.Group.Props, 'ref'> & {
  /** A tinted capsule (Figma “Text - Primary”, “Symbol Primary”). */
  prominent?: boolean;
};

// eslint-disable-next-line prettier/prettier
const StyledGroup = styled<typeof BaseToolbar.Group, BaseToolbar.Group.Props & { prominent?: boolean }>(BaseToolbar.Group, forwardRef)`
  --styled-glass-outset: 0px;
  --styled-toolbar-content: var(--styled-glass-content);
  --styled-toolbar-content-blend: var(--styled-glass-content-blend);
  --styled-toolbar-content-disabled: var(--styled-glass-content-disabled);

  position: relative;
  display: flex;
  min-width: var(--styled-toolbar-group-height);
  min-height: var(--styled-toolbar-group-height);
  box-sizing: border-box;
  flex: none;
  align-items: center;
  justify-content: center;
  padding: 0 var(--styled-toolbar-group-padding);
  border-radius: 100px;
  gap: 12px;

  ${({ prominent }) =>
    prominent
      ? css`
          --styled-toolbar-content: var(--styled-glass-content-prominent);
          --styled-toolbar-content-blend: var(
            --styled-glass-content-prominent-blend
          );
          --styled-toolbar-content-disabled: var(
            --styled-glass-content-prominent-disabled
          );
        `
      : undefined}

  &:has(:active) {
    --styled-glass-pressed: 1;
    --styled-glass-scale: var(--glass-ios-lens-scale);
    --styled-toolbar-content-scale: var(--glass-ios-lens-content-scale);
  }
`;

// Whether a button is in a capsule of several (see `ToolbarButton`).
const GroupContext = createContext(false);

/**
 * A glass capsule of several buttons (Figma “Button Group”); a single
 * button is a glass `Button` of its own (see `ToolbarButton`).
 */
const Group = forwardRef<HTMLDivElement, ToolbarGroupProps>(
  ({ children, prominent = false, ...props }, ref) => (
    <StyledGroup
      ref={ref}
      prominent={prominent}
      {...props}
    >
      <GlassBackground
        kind="button"
        tinted={prominent}
      />
      <GroupContext.Provider value>{children}</GroupContext.Provider>
    </StyledGroup>
  ),
);

// Figma “Symbol”, “Text”: 36px (symbols: circles, as their 17px glyph and
// the padding are narrower), the content vibrant (blended with the glass),
// scaled with the capsule's lens; pressed among several, the selection.
// Over the button's own styles (doubled).
// eslint-disable-next-line prettier/prettier
const StyledButton = styled<typeof Button.Root, ButtonRootProps>(Button.Root, forwardRef)`
  && {
    --styled-button-color: var(--styled-toolbar-content);
    --styled-button-color-disabled: var(--styled-toolbar-content-disabled);
    --styled-button-background-pressed: var(--styled-glass-selection);
    --styled-button-size: 36px;
    --styled-button-symbol-font-size: 17px;
    --styled-button-symbol-font-weight: 510;
    --styled-button-symbol-line-height: 20px;

    padding: 0 var(--styled-toolbar-text-padding);
    border-radius: 100px;
    font-feature-settings: 'ss16';
    font-size: 17px;
    ${fontWeight(510)}
    letter-spacing: 0;
    line-height: 20px;
    mix-blend-mode: var(--styled-toolbar-content-blend);
    scale: var(--styled-toolbar-content-scale, none);
    transition-duration: var(--glass-ios-lens-duration);
    transition-property: background-color, scale;
  }
`;

// A button of its own: a glass `Button` (Figma “_Button - Bottom”, “_Buttons
// - Top”), as high as the bar's capsules, its content as theirs; text 12px
// from its ends (Figma: 6px around a “Text” frame of 6px padding).
// eslint-disable-next-line prettier/prettier
const StyledGlassButton = styled<typeof Button.Root, ButtonRootProps>(Button.Root, forwardRef)`
  && {
    --styled-button-size: var(--styled-toolbar-group-height);
    --styled-button-symbol-font-size: 17px;
    --styled-button-symbol-font-weight: 510;
    --styled-button-symbol-line-height: 20px;

    padding-inline: 12px;
  }

  ${({ shape }) =>
    shape === 'circle'
      ? css`
          && {
            padding: 0;
          }
        `
      : undefined}
`;

export type ToolbarButtonProps = Omit<BaseToolbar.Button.Props, 'ref'> &
  Pick<ButtonRootProps, 'cursor' | 'destructive'> & {
    /**
     * Of its own (not in a `Group`): tinted glass (Figma “Text - Primary”,
     * “Symbol Primary”).
     */
    prominent?: boolean;
    /** Of its own: a circle (a symbol), or a capsule (default). */
    shape?: 'capsule' | 'circle';
  };

/**
 * A toolbar button (`Button.Root`, with `Button.Symbol` or `Button.Label`
 * content), in the toolbar's keyboard navigation: in a `Group`, one of its
 * buttons; otherwise a glass `Button` of its own.
 */
const ToolbarButton = forwardRef<HTMLButtonElement, ToolbarButtonProps>(
  ({ cursor, destructive, prominent, render, shape, ...props }, ref) => {
    const inGroup = useContext(GroupContext);

    return (
      <BaseToolbar.Button
        ref={ref}
        {...{ [part]: 'button' }}
        {...props}
        render={
          render ??
          (inGroup ? (
            <StyledButton
              cursor={cursor}
              destructive={destructive}
            />
          ) : (
            <StyledGlassButton
              cursor={cursor}
              destructive={destructive}
              shape={shape}
              variant={prominent ? 'glass-prominent' : 'glass'}
            />
          ))
        }
      />
    );
  },
);

export type ToolbarTitleProps = useRender.ComponentProps<'div'> & {
  /** Aligned to the bar's start (Figma Style=Title 2 Line Left). */
  alignStart?: boolean;
};

// The title's styling props aren't the element's.
const TitlePart = forwardRef<
  HTMLElement,
  useRender.ComponentProps<'div'> & { alignStart?: boolean }
>(({ render, ...props }, ref) => {
  const elementProps: Record<string, unknown> = { ...props };
  delete elementProps.alignStart;

  return useRender({
    defaultTagName: 'div',
    props: { [part]: 'title', ...elementProps },
    ref,
    render,
  });
});

// The title takes the free space when aligned to the start (see above).
// eslint-disable-next-line prettier/prettier
const Title = styled<typeof TitlePart, ToolbarTitleProps>(TitlePart, forwardRef)`
  display: flex;
  overflow: hidden;
  min-width: 0;
  flex: 0 1 auto;
  flex-direction: column;
  align-items: center;
  color: var(--color-ios-label);
  ${textStyle('body', { emphasized: true })}
  text-align: center;
  white-space: nowrap;

  & > * {
    overflow: hidden;
    max-width: 100%;
    text-overflow: ellipsis;
  }

  /* Title and Subtitle (Figma Style=Title 2 Line). */
  &:has(> [${part}='subtitle']) {
    padding-top: 6px;
    font-size: 15px;
    letter-spacing: -0.23px;
    line-height: 18px;
  }

  ${({ alignStart }) =>
    alignStart
      ? css`
          flex: 999 1 auto;
          align-items: flex-start;
          text-align: start;
        `
      : undefined}
`;

const SubtitlePart = forwardRef<HTMLElement, useRender.ComponentProps<'span'>>(
  ({ render, ...props }, ref) =>
    useRender({
      defaultTagName: 'span',
      props: { [part]: 'subtitle', ...props },
      ref,
      render,
    }),
);

/** A title's subtitle (Figma “Subtitle”), inside `Title`. */
const Subtitle = styled(SubtitlePart, forwardRef)`
  color: var(--color-ios-secondary-label);
  font-size: 12px;
  ${fontWeight(510)}
  letter-spacing: 0;
  line-height: 14px;
`;

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
