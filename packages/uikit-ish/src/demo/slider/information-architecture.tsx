import { FunctionComponent } from 'react';

import {
  Contents,
  Heading,
  PartLink,
  type Section,
} from '../guide/sections.js';
import { GuideLink } from '../hig-guide/link.js';

const HIG = 'https://developer.apple.com/design/human-interface-guidelines';

/** The page's sections (its headings' ids), listed at its top. */
const sections: readonly Section[] = [
  ['primitive-value-input', 'Primitive: Value input'],
  ['the-indicator-continuum', 'The indicator continuum'],
  ['traits', 'Traits'],
  ['where-it-sits', 'Where it sits'],
];

/**
 * `/slider/information-architecture`: where a slider sits, after the
 * HIG-composition guide (“Apple HIG Components — Composition, Shared Traits
 * & a Re-Slicing”).
 */
export const SliderInformationArchitecture: FunctionComponent = () => (
  <>
    <Contents sections={sections} />
    <ul className="demo-lead">
      <li>
        Apple’s catalog:{' '}
        <a
          href={`${HIG}/sliders`}
          rel="noreferrer"
          target="_blank"
        >
          sliders
        </a>
        , under “Selection and input”.
      </li>
      <li>
        As a primitive (
        <GuideLink to="section-5">HIG composition guide</GuideLink>): a{' '}
        <em>Value input</em>, bounded, continuous (
        <GuideLink to="section-5-mapping">§5, mapping</GuideLink>).
      </li>
      <li>
        Conceptually an editable <em>Indicator</em>.
      </li>
    </ul>

    <Heading
      id="primitive-value-input"
      level={2}
    >
      Primitive: Value input
    </Heading>
    <ul>
      <li>
        Value input: sets a typed value that isn’t a pick from a set (guide,{' '}
        <GuideLink to="primitive-value-input">§5</GuideLink>, sliders listed
        first).
      </li>
      <li>
        Parameters: the value’s type (number, range, color, date…), precision,
        continuous or discrete.
      </li>
    </ul>
    <ul>
      <li>
        <strong>Value type:</strong> a number (one thumb), or a range (two).
      </li>
      <li>
        <strong>Precision:</strong> <code>step</code> (and{' '}
        <code>largeStep</code> for the keyboard), from <code>min</code>.
      </li>
      <li>
        <strong>Continuous or discrete:</strong> the guide maps sliders to
        continuous; with a coarse <code>step</code> and{' '}
        <PartLink
          component="slider"
          part="Slider.Ticks"
        />
        , the same slider is discrete (as macOS’s sliders with tick marks, in
        Apple’s HIG).
      </li>
    </ul>

    <Heading
      id="the-indicator-continuum"
      level={2}
    >
      The indicator continuum
    </Heading>
    <ul>
      <li>
        The guide: sliders at the editable end of the indicators, a quantity on
        a scale, only “editable?” differing (
        <GuideLink to="indicator-continuum">§5</GuideLink>).
      </li>
      <li>
        The Indicator (<GuideLink to="primitive-indicator">§5</GuideLink>)
        absorbs sliders “conceptually”.
      </li>
      <li>
        Read-only neighbor: <a href="progress">Progress</a>, the same track and
        fill, no knob.
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
        The slider’s row of the guide’s trait matrix (
        <GuideLink to="trait-matrix">§4</GuideLink>).
      </li>
    </ul>
    <table>
      <tbody>
        <tr>
          <th>Intent</th>
          <td>Enter</td>
        </tr>
        <tr>
          <th>Data shape</th>
          <td>Bounded scalar</td>
        </tr>
        <tr>
          <th>Selection</th>
          <td>One / Range</td>
        </tr>
        <tr>
          <th>Lifetime</th>
          <td>Persistent</td>
        </tr>
        <tr>
          <th>Anchor</th>
          <td>Inline</td>
        </tr>
        <tr>
          <th>Layer</th>
          <td>Content</td>
        </tr>
        <tr>
          <th>Capacity</th>
          <td>∞ (continuous)</td>
        </tr>
      </tbody>
    </table>

    <Heading
      id="where-it-sits"
      level={2}
    >
      Where it sits
    </Heading>
    <ul>
      <li>
        <strong>In an Item:</strong> Items contain a Value input (guide,{' '}
        <GuideLink to="section-6-containment">§6</GuideLink>); in a form, a
        Group of Items, each holding a Choice, a Value input or a Text input (
        <GuideLink to="section-8-2">§8.2</GuideLink>). In a settings list, the
        slider takes a row of its own.
      </li>
      <li>
        <strong>Commit model:</strong> settings take effect at once, per field;
        forms that create or edit something commit with the Surface’s Done (
        <GuideLink to="commit-model">§8.2</GuideLink>). The slider’s two
        callbacks fit both: <code>onValueChange</code> while it moves,{' '}
        <code>onValueCommitted</code> once it’s released.
      </li>
      <li>
        <strong>Layer:</strong> on the content layer, per the matrix. The guide
        doesn’t cover sliders on the functional (glass) layer, e.g. in a
        toolbar.
      </li>
    </ul>
  </>
);
