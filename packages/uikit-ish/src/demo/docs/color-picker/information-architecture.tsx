import { FunctionComponent } from 'react';

import {
  Contents,
  Heading,
  type Section,
} from '../../tooling/guide/sections.js';
import { GuideLink } from '../hig-guide/link.js';

const HIG = 'https://developer.apple.com/design/human-interface-guidelines';

/** The page's sections (its headings' ids), listed at its top. */
const sections: readonly Section[] = [
  ['primitive-value-input', 'Primitive: Value input'],
  ['a-value-slot', 'A value slot'],
  ['where-it-sits', 'Where it sits'],
];

/**
 * `/color-picker/information-architecture`: where a color picker sits,
 * after the HIG-composition guide (“Apple HIG Components — Composition,
 * Shared Traits & a Re-Slicing”).
 */
export const ColorPickerInformationArchitecture: FunctionComponent = () => (
  <>
    <Contents sections={sections} />
    <ul className="demo-lead">
      <li>
        Apple’s catalog:{' '}
        <a
          href={`${HIG}/color-wells`}
          rel="noreferrer"
          target="_blank"
        >
          Color wells
        </a>
        , under “Selection and input”; the picker they open has no page of its
        own.
      </li>
      <li>
        As a primitive (
        <GuideLink to="section-5">HIG composition guide</GuideLink>): a{' '}
        <em>Value input</em> of a color.
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
        Value input: a typed value that isn’t a pick from a set (guide,{' '}
        <GuideLink to="primitive-value-input">§5</GuideLink>); it absorbs color
        wells. Parameters: value type (here a color), precision, continuous or
        discrete.
      </li>
      <li>
        Its views are each a way to the one value: the grid discrete, the
        spectrum and the sliders continuous; the opacity a second channel.
      </li>
      <li>
        The <GuideLink to="section-5-mapping">mapping table</GuideLink>: a color
        well is a “Value input, typed slot · drop target”.
      </li>
    </ul>

    <Heading
      id="a-value-slot"
      level={2}
    >
      A value slot
    </Heading>
    <ul>
      <li>
        Apple’s clusters (<GuideLink to="section-3-clusters">§3</GuideLink>) put
        color wells with image wells (and date pickers) as “hold a value slot”:
        what differs is the value type only.
      </li>
      <li>
        The well holds the color in its slot, inline; the picker it summons is
        the editor, on demand.
      </li>
    </ul>

    <Heading
      id="where-it-sits"
      level={2}
    >
      Where it sits
    </Heading>
    <ul>
      <li>
        <strong>Layer:</strong> the well in the content layer (e.g. a{' '}
        <a href="list">List</a> row); the picker in the overlay, a{' '}
        <a href="popover">Popover</a> (iPad) or a <a href="sheet">Sheet</a>{' '}
        (iPhone) (guide <GuideLink to="layers">§2</GuideLink>).
      </li>
      <li>
        <strong>Containment:</strong> an Item holds a Value input inline (the
        grammar, <GuideLink to="section-6-containment">§6</GuideLink>): the
        well; a Command summons a Surface: the picker’s popover or sheet.
      </li>
      <li>
        <strong>Commit model:</strong> a form either applies each field at once
        (settings) or defers to a Done on its surface (create, edit), not both
        in one surface (<GuideLink to="commit-model">§8.2</GuideLink>). The
        picker applies each change at once; its close button dismisses it,
        nothing to confirm.
      </li>
    </ul>
  </>
);
