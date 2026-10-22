import { FunctionComponent } from 'react';

import { Contents, Heading, type Section } from '../guide/sections.js';
import { GuideLink } from '../hig-guide/link.js';

const HIG = 'https://developer.apple.com/design/human-interface-guidelines';

/** The page's sections (its headings' ids), listed at its top. */
const sections: readonly Section[] = [
  ['primitive-indicator', 'Primitive: Indicator'],
  ['traits', 'Traits'],
  ['where-it-sits', 'Where it sits'],
  ['what-the-guide-doesnt-cover', 'What the guide doesn’t cover'],
];

/**
 * `/progress/information-architecture`: where progress indicators sit,
 * after the HIG-composition guide (“Apple HIG Components — Composition,
 * Shared Traits & a Re-Slicing”).
 */
export const ProgressInformationArchitecture: FunctionComponent = () => (
  <>
    <Contents sections={sections} />
    <ul className="demo-lead">
      <li>
        Apple’s catalog:{' '}
        <a
          href={`${HIG}/progress-indicators`}
          rel="noreferrer"
          target="_blank"
        >
          Progress indicators
        </a>
        , under “Status”.
      </li>
      <li>
        As a primitive (
        <GuideLink to="section-5-mapping">HIG composition guide</GuideLink>): an{' '}
        <em>Indicator</em>, bounded (a bar) or not (a spinner).
      </li>
    </ul>

    <Heading
      id="primitive-indicator"
      level={2}
    >
      Primitive: Indicator
    </Heading>
    <ul>
      <li>
        Indicator: displays a quantity or state; becomes a Value input when made
        editable (guide, <GuideLink to="primitive-indicator">§5</GuideLink>).
      </li>
      <li>
        Its parameters (the mapping table: “bounded · determinate · series”): a
        bar bounded and determinate, one series, continuous; an activity
        indicator neither bounded nor determinate.
      </li>
      <li>
        On the guide’s <GuideLink to="indicator-continuum">continuum</GuideLink>
        , read-only; made editable, it’s a <a href="slider">Slider</a>.
      </li>
    </ul>

    <Heading
      id="traits"
      level={2}
    >
      Traits
    </Heading>
    <ul>
      <li>
        The progress indicator’s row of the guide’s trait matrix (
        <GuideLink to="trait-matrix">§4</GuideLink>).
      </li>
    </ul>
    <table>
      <tbody>
        <tr>
          <th>Intent</th>
          <td>Report</td>
        </tr>
        <tr>
          <th>Data shape</th>
          <td>Bounded/unbounded scalar</td>
        </tr>
        <tr>
          <th>Selection</th>
          <td>—</td>
        </tr>
        <tr>
          <th>Lifetime</th>
          <td>Contextual</td>
        </tr>
        <tr>
          <th>Anchor</th>
          <td>Inline/Edge</td>
        </tr>
        <tr>
          <th>Layer</th>
          <td>Content</td>
        </tr>
        <tr>
          <th>Capacity</th>
          <td>∞</td>
        </tr>
      </tbody>
    </table>
    <ul>
      <li>Contextual: there while its work runs.</li>
    </ul>

    <Heading
      id="where-it-sits"
      level={2}
    >
      Where it sits
    </Heading>
    <ul>
      <li>
        <strong>Scope:</strong> the narrowest it describes (guide rule{' '}
        <GuideLink to="status-by-scope">G8</GuideLink>): an item’s in its row, a
        view’s in its content or toolbar, a window’s in its toolbar.
      </li>
      <li>
        <strong>Layer:</strong> the content layer (guide{' '}
        <GuideLink to="layers">§2</GuideLink>); in a bar, its region’s.
      </li>
    </ul>

    <Heading
      id="what-the-guide-doesnt-cover"
      level={2}
    >
      What the guide doesn’t cover
    </Heading>
    <ul>
      <li>
        A bar’s label and value (Base UI’s; Figma has none), and the value in a
        tooltip.
      </li>
      <li>An indeterminate bar (Base UI’s; UIKit has none).</li>
      <li>The spinner’s other movements (smooth, fading in place).</li>
    </ul>
  </>
);
