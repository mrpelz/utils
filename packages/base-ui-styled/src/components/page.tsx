import { styled } from 'goober';
import { ComponentProps, forwardRef } from 'react';

// A page (after Framework7's `.page` and `.page-content`; UIKit: a view
// controller's root view): what a screen shows, filling its container (a
// `Layout.Column`, a `Navigation.Root`'s page, the viewport's content),
// scrolling its content on its own (e.g. a `Header` at its start, then
// lists), on the page background (`grouped`: `systemGroupedBackground`, as
// lists of style `insetGrouped` and `grouped` sit on; `plain`:
// `systemBackground`). Track its scrolling with `Viewport.Provider`'s
// `scroller`. In a column clear of a floating one (see `Layout`), its
// content is inset by that column's size, its background running beneath
// it.

export type PageRootProps = ComponentProps<'div'> & {
  /**
   * The page background (default: `grouped`, for grouped lists; `plain`:
   * for plain lists, and other content).
   */
  background?: 'grouped' | 'plain';
};

const backgrounds = {
  grouped: 'var(--color-ios-system-grouped-background)',
  plain: 'var(--color-ios-system-background)',
};

const StyledRoot = styled('div', forwardRef)<{
  pageBackground: Required<PageRootProps>['background'];
}>`
  position: relative;
  overflow: auto;
  height: 100%;
  min-height: 0;
  box-sizing: border-box;
  background-color: ${({ pageBackground }) => backgrounds[pageBackground]};
  color: var(--color-ios-label);
  overscroll-behavior: contain;
  padding-inline-start: var(--styled-layout-inset-start, 0);
  scrollbar-width: thin;
`;

/** A page: its content's scroll container, on the page background. */
const Root = forwardRef<HTMLDivElement, PageRootProps>(
  ({ background = 'grouped', ...props }, ref) => (
    <StyledRoot
      ref={ref}
      data-page-part="root"
      pageBackground={background}
      {...props}
    />
  ),
);

export const Page = {
  Root,
};
