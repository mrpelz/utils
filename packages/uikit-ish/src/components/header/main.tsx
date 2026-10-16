import '../toolbar/style.css';
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

import { Toolbar } from '../toolbar/main.js';
import { cn } from '../utils/main.js';
import type {
  HeaderBarProps,
  HeaderContextValue,
  HeaderLargeTitleProps,
  HeaderRootProps,
} from './props.js';

export type {
  HeaderBarProps,
  HeaderLargeTitleProps,
  HeaderRootProps,
} from './props.js';

// Source: Apple iOS 26 Figma (“Toolbars”: “Toobar - Top - iPhone”,
// Style=Large Title), with the titles' colors mapped to UIKit's label
// colors. Behavior after Framework7's large navbar (`navbar.less`,
// `navbar.js`: `.navbar-large`, collapsing on scroll).
//
// A page's header (UIKit `UINavigationBar` with `prefersLargeTitles`): a
// top `Toolbar` (`Bar`), sticking to the top of the scroll container, and
// a large title below it (`LargeTitle`, Large Title Emphasized, 16px from
// the sides, with an optional `Toolbar.Subtitle` in 15px, 510), scrolling
// with the page. As the large title scrolls under the bar, it fades out and
// the bar's own `Toolbar.Title` fades in (scroll-driven animations, no
// scroll listeners): without a large title, the bar's title just shows.
// Content scrolled under the bar blurs beneath it (iOS 26's scroll edge
// effect, a soft one: a backdrop blur, fading out downwards), whatever the
// page's background.
//
// Deviations:
// - Pulled down, the large title doesn't grow (iOS: it scales up).
// - The scroll edge effect is an approximation (Figma: none).

const HeaderContext = createContext<HeaderContextValue>({ largeTitle: false });

/**
 * A page's header: its `Bar` and `LargeTitle`, at the start of the scroll
 * container. It has no box of its own, so the bar sticks to the top of the
 * whole scroll container.
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
    () => ({ largeTitle: largeTitles > 0, markLargeTitle, timeline }),
    [largeTitles, markLargeTitle, timeline],
  );

  return (
    <HeaderContext.Provider value={value}>
      <div
        style={
          {
            display: 'contents',
            'timeline-scope': timeline,
            '--uikit-header-timeline': timeline,
          } as CSSProperties
        }
      >
        {children}
      </div>
    </HeaderContext.Provider>
  );
};

/** The header's top toolbar, sticking to the top of the scroll container. */
const Bar = forwardRef<HTMLDivElement, HeaderBarProps>(
  ({ className, ...props }, ref) => {
    const { largeTitle } = useContext(HeaderContext);

    return (
      <Toolbar.Root
        ref={ref}
        data-large-title={largeTitle ? '' : undefined}
        placement="block-start"
        {...props}
        className={cn('uikit-header-bar', className)}
        data-header-part="bar"
      />
    );
  },
);

/**
 * The header's large title (with an optional `Toolbar.Subtitle`), below its
 * `Bar`, scrolling with the page.
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

export const Header = {
  Root,
  Bar,
  LargeTitle,
};
