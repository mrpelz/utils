import { FunctionComponent } from 'react';

import { CodeView } from '../../tooling/frame/code-view.js';
import {
  Contents,
  Heading,
  PartLink,
  type Section,
} from '../../tooling/guide/sections.js';
import { publicUrl } from '../../tooling/public-url.js';

// `/accordion/architecture`: how Accordion is built, and what flows into it.

/* eslint-disable unicorn/no-incorrect-template-string-interpolation -- JSX braces in code samples, not interpolations */
const panelCode = `// Accordion.Panel: Base UI's, with a class and a part attribute.
const Panel = forwardRef(({ className, ...props }, ref) => (
  <BaseAccordion.Panel
    ref={ref}
    className={cn('uikit-accordion-panel', className)}
    data-accordion-part="panel"
    {...props}
  />
));

export const Accordion = { ...BaseAccordion, Panel };`;

const styleCode = `.uikit-accordion-panel {
  overflow: clip;
  /* Base UI's measured height of its content. */
  height: var(--accordion-panel-height);
  transition: height 300ms ease, opacity 300ms ease;

  /* Base UI's marks while it opens and closes: from and to nothing. */
  &[data-starting-style],
  &[data-ending-style] {
    height: 0;
    opacity: 0;
  }
}`;
/* eslint-enable unicorn/no-incorrect-template-string-interpolation */

const sections: readonly Section[] = [
  ['the-parts', 'The parts'],
  ['opening-and-closing', 'Opening and closing'],
  ['in-a-list', 'In a list'],
  ['what-flows-in-and-out', 'What flows in and out'],
];

/** `/accordion/architecture`: how it's built, and what flows into it. */
export const AccordionArchitecture: FunctionComponent = () => (
  <>
    <Contents sections={sections} />
    <ul className="demo-lead">
      <li>
        Accordion is Base UI’s, with one part of its own: a panel that opens and
        closes in place. For using it, see its{' '}
        <a href={publicUrl('accordion/parts')}>parts</a>.
      </li>
    </ul>

    <Heading
      id="the-parts"
      level={2}
    >
      The parts
    </Heading>
    <ul className="demo-tree">
      <li>
        <PartLink part="Accordion.Root" />{' '}
        <span>(Base UI’s: which items are open)</span>
        <ul>
          <li>
            <PartLink part="Accordion.Item" /> <span>(Base UI’s)</span>
            <ul>
              <li>
                <PartLink part="Accordion.Header" />
                <ul>
                  <li>
                    <PartLink part="Accordion.Trigger" />
                  </li>
                </ul>
              </li>
              <li>
                <PartLink part="Accordion.Panel" />{' '}
                <span>(the library’s: Base UI’s, with its class)</span>
              </li>
            </ul>
          </li>
        </ul>
      </li>
    </ul>
    <ul>
      <li>
        Every part but the panel is Base UI’s, passed through unchanged: the
        namespace spreads Base UI’s and replaces only{' '}
        <PartLink part="Accordion.Panel" />. State, keyboard handling and{' '}
        <code>aria-expanded</code> are Base UI’s.
      </li>
      <li>
        The panel adds a class and a part attribute, nothing in script. What it
        looks like comes from its stylesheet.
      </li>
    </ul>
    <CodeView code={panelCode} />

    <Heading
      id="opening-and-closing"
      level={2}
    >
      Opening and closing
    </Heading>
    <ul>
      <li>
        Base UI measures the panel’s content and sets it as{' '}
        <code>--accordion-panel-height</code>. While it opens or closes, it
        marks the panel <code>data-starting-style</code> or{' '}
        <code>data-ending-style</code>, and it keeps a closing panel mounted
        until its transition ends.
      </li>
      <li>
        The stylesheet transitions the height between that measurement and
        nothing, and the opacity with it, over 300ms, the same as a list’s
        collapsible rows. The panel clips what overflows while it moves. With
        reduced motion, there’s no transition.
      </li>
    </ul>
    <CodeView code={styleCode} />

    <Heading
      id="in-a-list"
      level={2}
    >
      In a list
    </Heading>
    <ul>
      <li>
        A list’s rows that open and close don’t use these parts. A list group’s
        rows must stay its children, so{' '}
        <PartLink
          component="list"
          part="List.AccordionRoot"
        />{' '}
        and its trigger and panel are List’s own: they keep the same names and
        state as Base UI’s, but render no elements. Their timing matches this
        panel’s.
      </li>
      <li>
        This component is for what isn’t rows: for example a sidebar’s section,
        its header the trigger and its group the panel.
      </li>
    </ul>

    <Heading
      id="what-flows-in-and-out"
      level={2}
    >
      What flows in and out
    </Heading>
    <ul>
      <li>
        <strong>From Base UI:</strong> everything but the panel’s look: state,
        the trigger, measuring, mounting.
      </li>
      <li>
        <strong>From the system:</strong> reduced motion, by the stylesheet’s
        media query.
      </li>
      <li>
        <strong>Out:</strong> nothing. No other component renders it; apps put
        its parts around their own, as the demos do for a sidebar’s sections.
      </li>
    </ul>
  </>
);
