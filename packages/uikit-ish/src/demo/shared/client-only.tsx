import { FunctionComponent, ReactNode, useEffect, useState } from 'react';

// Whether the page has been hydrated: after that (the router's navigations),
// nothing is prerendered to match, so the children render at once (and the
// page has its height when the browser restores its scroll position).
let hydrated = false;

/**
 * Its children on the client only: prerendered (and hydrated) as an empty
 * shell, so hydration has nothing to match; they mount right after, in a
 * render of their own (e.g. what depends on the URL's fragment, unknown
 * while prerendering).
 */
export const ClientOnly: FunctionComponent<{ children: ReactNode }> = ({
  children,
}) => {
  const [mounted, setMounted] = useState(hydrated);

  useEffect(() => {
    hydrated = true;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- mounted: once, after hydration
    setMounted(true);
  }, []);

  return <div className="demo-client-only">{mounted ? children : null}</div>;
};
