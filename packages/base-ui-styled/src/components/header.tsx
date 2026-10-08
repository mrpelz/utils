import { useRender } from '@base-ui/react/use-render';
import { keyframes, styled } from 'goober';
import {
  createContext,
  CSSProperties,
  forwardRef,
  FunctionComponent,
  ReactNode,
  Ref,
  useCallback,
  useContext,
  useId,
  useLayoutEffect,
  useMemo,
  useState,
} from 'react';

import { Toolbar, ToolbarRootProps } from './toolbar.js';
import { textStyle } from './typography.js';
import { css, fontWeight } from './utils.js';

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

const fadeIn = keyframes`
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
`;

const fadeOut = keyframes`
  from {
    opacity: 1;
  }

  to {
    opacity: 0;
  }
`;

type HeaderContextValue = {
  /** Whether the header has a large title (see `LargeTitle`). */
  largeTitle: boolean;
  markLargeTitle?: () => () => void;
  /** The large title's view timeline (unique per header). */
  timeline?: string;
};

const HeaderContext = createContext<HeaderContextValue>({ largeTitle: false });

export type HeaderRootProps = { children?: ReactNode };

/**
 * A page's header: its `Bar` and `LargeTitle`, at the start of the scroll
 * container. It has no box of its own, so the bar sticks to the top of the
 * whole scroll container.
 */
const Root: FunctionComponent<HeaderRootProps> = ({ children }) => {
  const id = useId();
  const timeline = `--styled-header-${id.replaceAll(/[^\w-]/gu, '')}`;
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
          } as CSSProperties
        }
      >
        {children}
      </div>
    </HeaderContext.Provider>
  );
};

// The bar's height, so the large title passes under it.
const barHeight = '54px';

type StyledBarProps = ToolbarRootProps & {
  largeTitle?: boolean;
  ref?: Ref<HTMLDivElement>;
  timeline?: string;
};

// eslint-disable-next-line prettier/prettier
const StyledBar = styled<typeof Toolbar.Root, StyledBarProps>(Toolbar.Root, forwardRef)`
  position: sticky;
  z-index: 10;
  top: 0;

  /* The scroll edge effect, once content is scrolled under the bar. */
  &::before {
    position: absolute;
    z-index: -1;
    animation: ${fadeIn} linear both;
    animation-range: 0 16px;
    animation-timeline: scroll(nearest);
    backdrop-filter: blur(8px);
    content: '';
    inset: 0 0 -16px;
    mask-image: linear-gradient(#000 50%, transparent);
    pointer-events: none;
  }

  ${({ largeTitle, timeline }) =>
    largeTitle && timeline
      ? css`
          & > [data-toolbar-part='title'] {
            animation: ${fadeIn} linear both;
            animation-range: exit-crossing 50% exit-crossing 100%;
            animation-timeline: ${timeline};
          }
        `
      : undefined}
`;

export type HeaderBarProps = Omit<ToolbarRootProps, 'placement'>;

/** The header's top toolbar, sticking to the top of the scroll container. */
const Bar = forwardRef<HTMLDivElement, HeaderBarProps>((props, ref) => {
  const { largeTitle, timeline } = useContext(HeaderContext);

  return (
    <StyledBar
      ref={ref}
      largeTitle={largeTitle}
      placement="top"
      timeline={timeline}
      {...props}
    />
  );
});

const LargeTitlePart = forwardRef<
  HTMLDivElement,
  useRender.ComponentProps<'div'> & { timeline?: string }
>(({ render, style, timeline, ...props }, ref) =>
  useRender({
    defaultTagName: 'div',
    props: {
      'data-header-part': 'large-title',
      role: 'heading',
      'aria-level': 1,
      ...props,
      style: {
        'view-timeline-name': timeline,
        ...(typeof style === 'object' && style),
      } as CSSProperties,
    },
    ref,
    render,
  }),
);

// Figma “Title and Subtitle”: 16px from the sides, 10px from the bar; as it
// scrolls under the bar, it fades out.
const StyledLargeTitle = styled(LargeTitlePart, forwardRef)`
  display: flex;
  box-sizing: border-box;
  flex-direction: column;
  padding: 0 16px 10px;
  animation: ${fadeOut} linear both;
  animation-range: exit-crossing 0% exit-crossing 50%;
  animation-timeline: view(block ${barHeight} 0);
  color: var(--color-ios-label);
  ${textStyle('largeTitle', { emphasized: true })}
  view-timeline-axis: block;
  view-timeline-inset: ${barHeight} 0;

  & > [data-toolbar-part='subtitle'] {
    font-size: 15px;
    ${fontWeight(510)}
    letter-spacing: -0.25px;
    line-height: 20px;
  }
`;

export type HeaderLargeTitleProps = useRender.ComponentProps<'div'>;

/**
 * The header's large title (with an optional `Toolbar.Subtitle`), below its
 * `Bar`, scrolling with the page.
 */
const LargeTitle = forwardRef<HTMLDivElement, HeaderLargeTitleProps>(
  (props, ref) => {
    const { markLargeTitle, timeline } = useContext(HeaderContext);
    useLayoutEffect(() => markLargeTitle?.(), [markLargeTitle]);

    return (
      <StyledLargeTitle
        ref={ref}
        timeline={timeline}
        {...props}
      />
    );
  },
);

export const Header = {
  Root,
  Bar,
  LargeTitle,
};
