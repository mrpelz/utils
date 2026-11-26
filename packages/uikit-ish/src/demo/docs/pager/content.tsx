import type { ReactNode } from 'react';

import { Pager } from '../../../components/index.js';

/** A pager's example pages: onboarding steps, a title and a line each. */
export const steps = [
  ['Welcome', 'Swipe through, or press the dots.'],
  ['Your pages', 'A page per screen, snapping into place.'],
  ['The dots', 'They follow the swipe, and move it.'],
  ['Many more', 'Each fling moves one page, never past it.'],
  ['Done', 'The last page: nothing beyond it.'],
] as const;

/** The first `count` example pages (`Pager.Page`s), with `props` each. */
export const pages = (
  count: number = steps.length,
  props: Record<string, unknown> = {},
): ReactNode[] =>
  steps.slice(0, count).map(([title, text]) => (
    <Pager.Page
      key={title}
      className="pager-demo-page"
      {...props}
    >
      <h3>{title}</h3>
      <p>{text}</p>
    </Pager.Page>
  ));
