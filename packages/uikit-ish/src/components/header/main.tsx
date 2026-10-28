import '../toolbar/style.css';
import '../viewport/style.css';
import './style.css';

import { useRender } from '@base-ui/react/use-render';
import {
  createContext,
  CSSProperties,
  forwardRef,
  FunctionComponent,
  useCallback,
  useContext,
  useId,
  useLayoutEffect,
  useMemo,
  useState,
} from 'react';

import { cn } from '../utils/main.js';
import { useAnchorSize } from '../viewport/main.js';
import type {
  HeaderAccessoryProps,
  HeaderContextValue,
  HeaderLargeTitleProps,
  HeaderRootProps,
} from './props.js';

export type {
  HeaderAccessoryProps,
  HeaderLargeTitleProps,
  HeaderRootProps,
} from './props.js';

// Source: Apple iOS 26 Figma (“Toolbars”: “Toobar - Top - iPhone”,
// Style=Large Title), with the titles' colors mapped to UIKit's label
// colors. Behavior after Framework7's large navbar (`navbar.less`,
// `navbar.js`: `.navbar-large`, collapsing on scroll).
//
// A page's header (UIKit `UINavigationBar` with `prefersLargeTitles`): the
// app's top `Toolbar` (`placement="block-start"`) in a
// `Viewport.BlockStart` (staying where it is, as the page scrolls or
// bounces under it), and a large title in the page below it (`LargeTitle`,
// Large Title Emphasized, 16px from the sides, with an optional
// `Toolbar.Subtitle` in 15px, 510), scrolling with the page. `Root` ties
// them: around the anchor and the `Page` (or within the page, e.g. a tab's
// panel rendered as one); the page's content starts below the bar by a
// `Viewport.Padding` at its start (the app's: e.g. none while the bar is
// empty). As the
// large title scrolls under the bar, it fades out and the bar's own
// `Toolbar.Title` fades in (scroll-driven animations, no scroll
// listeners): without a large title, the bar's title just shows. Content
// scrolled under the bar blurs beneath it (iOS 26's scroll edge effect, a
// soft one: a backdrop blur, fading out downwards), whatever the page's
// background.
//
// An accessory (`Accessory`: a search field, a segmented control) scrolls
// with the large title, then sticks below the bar (UIKit: a search
// controller's bar with `hidesSearchBarWhenScrolling` false), 16px from
// the sides, 8px above the content.
//
// Deviations:
// - Pulled down, the large title doesn't grow (iOS: it scales up).
// - The page's content makes room for the bar with a `Viewport.Padding`
//   (the app's, at the page's start: as high as the bar, live); the large
//   title and the accessory follow the bar's height too.
// - The scroll edge effect is an approximation (Figma: none).

const HeaderContext = createContext<HeaderContextValue>({
  hasLargeTitle: false,
});

/**
 * A page's header: its bar (a `Toolbar` in a `Viewport.BlockStart`, its
 * child) and its page's `LargeTitle` (and `Accessory`), around the page (or
 * within it). It has no box of its own.
 */
const Root: FunctionComponent<HeaderRootProps> = ({ children }) => {
  const id = useId();
  const timeline = `--uikit-header-${id.replaceAll(/[^\w-]/gu, '')}`;
  const [largeTitles, setLargeTitles] = useState(0);
  const markLargeTitle = useCallback(() => {
    setLargeTitles((count) => count + 1);
    return () => setLargeTitles((count) => count - 1);
  }, []);
  const value = useMemo(
    () => ({ hasLargeTitle: largeTitles > 0, markLargeTitle, timeline }),
    [largeTitles, markLargeTitle, timeline],
  );
  // Its bar's height (the tallest at the block start, in its scope: see
  // Viewport.Padding), for its large title and accessory.
  const barSize = useAnchorSize('block-start');

  return (
    <HeaderContext.Provider value={value}>
      <div
        className="uikit-header-root"
        data-header-part="root"
        data-large-title={value.hasLargeTitle ? '' : undefined}
        style={
          {
            '--uikit-header-bar': `${String(barSize)}px`,
            '--uikit-header-timeline': timeline,
          } as CSSProperties
        }
      >
        {children}
      </div>
    </HeaderContext.Provider>
  );
};

/**
 * The header's large title (with an optional `Toolbar.Subtitle`), at its
 * page's start (below the bar), scrolling with the page.
 */
const LargeTitle = forwardRef<HTMLDivElement, HeaderLargeTitleProps>(
  ({ className, render, ...props }, ref) => {
    const { markLargeTitle } = useContext(HeaderContext);
    useLayoutEffect(() => markLargeTitle?.(), [markLargeTitle]);

    return useRender({
      defaultTagName: 'div',
      props: {
        'aria-level': 1,
        'data-header-part': 'large-title',
        role: 'heading',
        ...props,
        className: cn('uikit-header-large-title', className),
      },
      ref,
      render,
    });
  },
);

/**
 * What stays with the bar (a search field, a segmented control, UIKit's
 * `hidesSearchBarWhenScrolling` false): below the large title, scrolling
 * with it, then sticking below the bar, the content beneath it blurred.
 */
const Accessory = forwardRef<HTMLDivElement, HeaderAccessoryProps>(
  ({ className, render, ...props }, ref) =>
    useRender({
      defaultTagName: 'div',
      props: {
        'data-header-part': 'accessory',
        ...props,
        className: cn('uikit-header-accessory', className),
      },
      ref,
      render,
    }),
);

export const Header = {
  Root,
  LargeTitle,
  Accessory,
};
