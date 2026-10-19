import { FunctionComponent } from 'react';

import { GuideLink } from '../hig-guide/link.js';

const HIG = 'https://developer.apple.com/design/human-interface-guidelines';

/**
 * `/slider/information-architecture`: where a slider sits, after the
 * HIG-composition guide (“Apple HIG Components — Composition, Shared Traits
 * & a Re-Slicing”).
 */
export const SliderInformationArchitecture: FunctionComponent = () => (
  <>
    <p className="demo-lead">
      In Apple’s catalog,{' '}
      <a
        href={`${HIG}/sliders`}
        rel="noreferrer"
        target="_blank"
      >
        sliders
      </a>{' '}
      are under “Selection and input”. Re-sliced into primitives (after the{' '}
      <GuideLink to="section-5">HIG composition guide</GuideLink>), a slider is
      a <em>Value input</em>: bounded, continuous (
      <GuideLink to="section-5-mapping">§5, mapping</GuideLink>), and
      conceptually an editable <em>Indicator</em>.
    </p>

    <h2>Primitive: Value input</h2>
    <p>
      A Value input sets a typed value that isn’t a pick from a set; its
      parameters are the value’s type (a number, a range, a color, a date…), its
      precision, and whether it’s continuous or discrete (guide,{' '}
      <GuideLink to="primitive-value-input">§5</GuideLink>, which lists sliders
      first among those it absorbs). Here:
    </p>
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
        <code>Slider.Ticks</code>, the same slider is discrete (as macOS’s
        sliders with tick marks, in Apple’s HIG).
      </li>
    </ul>

    <h2>The indicator continuum</h2>
    <p>
      The guide places sliders at the editable end of the indicators: a quantity
      on a scale, where only “editable?” changes (
      <GuideLink to="indicator-continuum">§5</GuideLink>; the Indicator,{' '}
      <GuideLink to="primitive-indicator">§5</GuideLink>, absorbs sliders
      “conceptually”). Its read-only neighbor here is{' '}
      <a href="progress">Progress</a>: the same track and fill, without a knob.
    </p>

    <h2>Traits</h2>
    <p>
      The slider’s row of the guide’s trait matrix (
      <GuideLink to="trait-matrix">§4</GuideLink>):
    </p>
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

    <h2>Where it sits</h2>
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
