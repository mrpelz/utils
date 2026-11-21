import { FunctionComponent } from 'react';

import { CodeView } from '../../tooling/frame/code-view.js';
import {
  Contents,
  Heading,
  PartLink,
  type Section,
} from '../../tooling/guide/sections.js';
import { publicUrl } from '../../tooling/public-url.js';

// `/collapsible/architecture`: how Collapsible is built, and what flows into it.

/* eslint-disable unicorn/no-incorrect-template-string-interpolation -- JSX braces in code samples, not interpolations */
const panelCode = `// Collapsible.Panel: Base UI's, with a class and a part attribute.
const Panel = forwardRef(({ className, ...props }, ref) => (
  <BaseCollapsible.Panel
    ref={ref}
    className={cn('uikit-collapsible-panel', className)}
    data-collapsible-part="panel"
    {...props}
  />
));

export const Collapsible = { ...BaseCollapsible, Panel };`;

const styleCode = `.uikit-collapsible-panel {
  overflow: clip;
  /* Base UI's measured height of its content. */
  height: var(--collapsible-panel-height);
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

/** `/collapsible/architecture`: how it's built, and what flows into it. */
export const CollapsibleArchitecture: FunctionComponent = () => (
  <>
    <Contents sections={sections} />
    <ul className="demo-lead">
      <li>
        Collapsible is Base UI’s collapsible, with one part of the library’s
        own: a panel that opens and closes in place. To learn how to use it, see
        its <a href={publicUrl('collapsible/parts')}>parts</a>.
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
        <PartLink part="Collapsible.Root" /> <span>(Base UI’s: its state)</span>
        <ul>
          <li>
            <PartLink part="Collapsible.Trigger" />{' '}
            <span>(Base UI’s: a button)</span>
          </li>
          <li>
            <PartLink part="Collapsible.Panel" />{' '}
            <span>(the library’s: Base UI’s, with its class)</span>
          </li>
        </ul>
      </li>
    </ul>
    <ul>
      <li>
        Every part except the panel comes straight from Base UI, unchanged. The
        namespace spreads Base UI’s parts and replaces only{' '}
        <PartLink part="Collapsible.Panel" />. Base UI handles the state, the
        keyboard and <code>aria-expanded</code>.
      </li>
      <li>
        The panel only adds a class and a part attribute. It runs no script of
        its own. Its look comes from its stylesheet.
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
        Base UI measures the panel’s content and sets the height as{' '}
        <code>--collapsible-panel-height</code>.
      </li>
      <li>
        While the panel opens or closes, Base UI marks it with{' '}
        <code>data-starting-style</code> or <code>data-ending-style</code>. It
        keeps a closing panel mounted until its transition ends.
      </li>
      <li>
        The stylesheet transitions the height between that measurement and zero,
        and the opacity along with it. This takes 300ms, the same as a list’s
        collapsible rows. While it moves, the panel clips whatever overflows.
      </li>
      <li>With reduced motion, there’s no transition.</li>
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
        Rows in a list that open and close don’t use these parts. A list group’s
        rows have to stay its direct children. So{' '}
        <PartLink
          component="list"
          part="List.CollapsibleRoot"
        />{' '}
        and its trigger and panel are List’s own parts. They have the same names
        and the same state as Base UI’s, but they render no elements. Their
        timing matches this panel’s.
      </li>
      <li>
        This component is for content that isn’t rows. One example is a
        sidebar’s section, where the header is the trigger and the group is the
        panel.
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
        <strong>From Base UI:</strong> everything except the panel’s look. That
        includes the state, the trigger, measuring and mounting.
      </li>
      <li>
        <strong>From Settings:</strong> reduced motion, read by a style query in
        the stylesheet.
      </li>
      <li>
        <strong>Out:</strong> nothing. No other component renders it. Apps put
        its parts around their own content, as the demos do for a sidebar’s
        sections.
      </li>
    </ul>
  </>
);
