import './style.css';

import { FunctionComponent } from 'react';

import { Typography } from '../../../components/index.js';
import { Component } from '../../tooling/frame/component.js';
import { usePropControl } from '../../tooling/frame/prop-control.js';
import { useProvidedState } from '../../tooling/frame/state.js';
import { KeyPropsTable, pickRows } from '../../tooling/guide/props-table.js';
import {
  Contents,
  Heading,
  type Section,
} from '../../tooling/guide/sections.js';
import { publicUrl } from '../../tooling/public-url.js';
import { typographyRows } from './docs.js';
import { propOptionsOverview } from './props.js';

/** A line of text in a text style, a weight, a color. */
const LiveView: FunctionComponent = () => {
  const id = 'typography-overview';
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(propOptionsOverview, {
    external,
    isOpen: true,
    title: 'Typography',
  });

  return (
    <Component
      isCentered
      isInline
      controls={[control]}
      id={id}
      state={[state]}
      title="Typography"
    >
      <Typography {...props}>
        The quick brown fox jumps over the lazy dog
      </Typography>
    </Component>
  );
};

/** The page's sections (its headings' ids), listed at its top. */
const sections: readonly Section[] = [
  ['when-to-use-it', 'When to use it'],
  ['when-to-use-something-else', 'When to use something else'],
  ['key-props', 'Key props'],
  ['accessibility', 'Accessibility'],
  ['behavior', 'Behavior'],
];

/** `/typography`: what the text styles are for, and their props. */
export const TypographyOverview: FunctionComponent = () => (
  <>
    <Contents sections={sections} />
    <ul className="demo-lead">
      <li>
        Text in one of the text styles, from Large Title to Caption 2. Each has
        its own size, line height, weight and tracking.
      </li>
      <li>It can be emphasized or italic, in a label color, at a text size.</li>
    </ul>
    <LiveView />

    <Heading
      id="when-to-use-it"
      level={2}
    >
      When to use it
    </Heading>
    <ul>
      <li>
        For text of your own (a heading, a paragraph, a caption) that should
        look like the components’ text, since they use the same styles’ tokens.
      </li>
      <li>
        For setting a text size for a part of the page, its components included.
      </li>
    </ul>

    <Heading
      id="when-to-use-something-else"
      level={2}
    >
      When to use something else
    </Heading>
    <ul>
      <li>
        A list row’s texts: use the row’s own parts (the{' '}
        <a href={publicUrl('list')}>List</a>’s title, subtitle and detail).
      </li>
      <li>
        A page’s title: use a <a href={publicUrl('header')}>Header</a>’s large
        title.
      </li>
      <li>
        A symbol in text: put a <a href={publicUrl('symbol')}>Symbol</a> inside
        it, and it’s sized and weighted with the text.
      </li>
    </ul>

    <Heading
      id="key-props"
      level={2}
    >
      Key props
    </Heading>
    <ul>
      <li>The props most text sets.</li>
      <li>
        All its props are on the{' '}
        <a href={publicUrl('typography/parts')}>Parts</a> page.
      </li>
    </ul>
    <KeyPropsTable
      parts={[
        [
          'Typography',
          pickRows(
            typographyRows,
            'textStyle',
            'emphasized',
            'color',
            'render',
          ),
        ],
      ]}
    />

    <Heading
      id="accessibility"
      level={2}
    >
      Accessibility
    </Heading>
    <ul>
      <li>
        A style is only a look. A heading needs its element (
        <code>{'render={<h2 />}'}</code>), because Large Title isn’t one.
      </li>
      <li>
        The app sets the text sizes (for example from a setting). The browser’s
        text size doesn’t change them.
      </li>
      <li>
        The tertiary and quaternary label colors are for placeholders and
        watermarks. They’re too faint for text people need to read.
      </li>
    </ul>

    <Heading
      id="behavior"
      level={2}
    >
      Behavior
    </Heading>
    <ul>
      <li>
        It uses its style’s tokens (<code>--font-ui-*</code>): Body by default,
        at Large (the default text size).
      </li>
      <li>
        Weights are variable (the system font’s), so a symbol inside it follows
        the weight (see <a href={publicUrl('symbol')}>Symbol</a>).
      </li>
      <li>
        It inherits its color unless one is set. Its text size applies to its
        text and everything inside it.
      </li>
    </ul>
  </>
);

/** Its live views, also on the component's page of demos (and `/all`). */
export const typographyOverviewDemos = [LiveView];
