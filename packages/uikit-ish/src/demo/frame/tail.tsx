import {
  FunctionComponent,
  ReactNode,
  Ref,
  useLayoutEffect,
  useRef,
} from 'react';

/**
 * A scroll container following its content's end, as `tail -f` does (e.g.
 * a log): laid out in reverse (`column-reverse`, see style.css), its
 * scroll position 0 is its end, which stays in view as content grows. When
 * content changes (React's children, or nodes appended to `contentRef`'s
 * element), it scrolls back to its end, unless scrolled away from it.
 */
export const Tail: FunctionComponent<{
  children?: ReactNode;
  className?: string;
  /** The content's element (e.g. to append to). */
  contentRef?: Ref<HTMLDivElement>;
}> = ({ children, className, contentRef }) => {
  const ref = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const { current: element } = ref;
    if (!element) return undefined;

    // Whether it's at its end, as of before the content changes (scroll
    // anchoring then moves it away). Reversed: scrolled away from the end,
    // its position is negative.
    let following = true;
    // While it scrolls back to its end itself (smoothly), not scrolled away.
    let returning = false;

    const onScroll = () => {
      const atEnd = element.scrollTop >= -5;
      if (atEnd) returning = false;
      if (!returning) following = atEnd;
    };

    const observer = new MutationObserver(() => {
      if (!following || element.scrollTop === 0) return;
      returning = true;
      element.scrollTo({ behavior: 'smooth', top: 0 });
    });

    element.addEventListener('scroll', onScroll, { passive: true });
    observer.observe(element, { childList: true, subtree: true });

    return () => {
      element.removeEventListener('scroll', onScroll);
      observer.disconnect();
    };
  }, []);

  return (
    <section
      ref={ref}
      className={['demo-tail', className].filter(Boolean).join(' ')}
    >
      <div ref={contentRef}>{children}</div>
    </section>
  );
};
