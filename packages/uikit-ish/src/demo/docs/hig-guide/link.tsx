import { FunctionComponent, ReactNode } from 'react';

import { publicUrl } from '../../tooling/public-url.js';

/**
 * The guide's anchors: its sections (`section-5`, `section-8-2`, …), Apple's
 * and the universal rules (`rule-a1`, `rule-g4`, …), the primitives
 * (`primitive-choice`, …) and its named tables and diagrams (e.g.
 * `trait-matrix`, `choice-family`).
 */
export type GuideAnchor = string;

// (Under the site's public path, as the demo's other links.)
export const guideHref = (anchor?: GuideAnchor): string =>
  publicUrl(anchor === undefined ? 'hig-guide' : `hig-guide#${anchor}`);

/** A citation of the HIG-composition guide (`/hig-guide`), e.g. “§5”. */
export const GuideLink: FunctionComponent<{
  children: ReactNode;
  to: GuideAnchor;
}> = ({ children, to }) => <a href={guideHref(to)}>{children}</a>;
