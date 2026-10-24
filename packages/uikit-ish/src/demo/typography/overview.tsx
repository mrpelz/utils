import './style.css';

import { FunctionComponent } from 'react';

import { Typography } from '../../components/index.js';
import { Component } from '../frame/component.js';
import { usePropControl } from '../frame/prop-control.js';
import { useProvidedState } from '../frame/state.js';
import { KeyPropsTable, pickRows } from '../guide/props-table.js';
import { Contents, Heading, type Section } from '../guide/sections.js';
import { typographyRows } from './docs.js';
import { propOptionsOverview } from './props.js';

/** A line of text in a text style, a weight, a color. */
const LiveView: FunctionComponent = () => {
  const id = 'typography-overview';
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(propOptionsOverview, {
    external,
    open: true,
    title: 'Typography',
  });

  return (
    <Component
      center
      inline
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
        Text in one of iOS’s text styles (UIKit <code>UIFont.TextStyle</code>
        ): Large Title to Caption 2, each with its size, line height, weight and
        tracking.
      </li>
      <li>
        Emphasized or italic, in a label color, at a Dynamic Type size (Figma
        “Typography”).
      </li>
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
        Text of your own (a heading, a paragraph, a caption) that should look
        like the components’ (they use the same styles’ tokens).
      </li>
      <li>
        A Dynamic Type size for a part of the page, its components included.
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
        A list row’s texts: its own parts (<a href="list">List</a>’s title,
        subtitle, detail).
      </li>
      <li>
        A page’s title: a <a href="header">Header</a>’s large title.
      </li>
      <li>
        A symbol in text: a <a href="symbol">Symbol</a>, inside it (sized and
        weighted with it).
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
        All its props: <a href="typography/parts">Parts</a>.
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
        A style is only a look: a heading needs its element (
        <code>{'render={<h2 />}'}</code>), as Large Title isn’t one.
      </li>
      <li>
        Dynamic Type sizes are the app’s to set (e.g. from a setting): the
        browser’s text size doesn’t change them.
      </li>
      <li>
        The tertiary and quaternary label colors are for placeholders and
        watermarks (UIKit’s): too faint for text to be read.
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
        Its style’s tokens (<code>--font-ios-*</code>): Body by default, at
        Large (the default Dynamic Type size).
      </li>
      <li>
        Weights are variable (SF Pro’s): a symbol in it follows the weight (see{' '}
        <a href="symbol">Symbol</a>).
      </li>
      <li>
        Its color inherited unless set; its Dynamic Type size, for its text and
        everything in it.
      </li>
    </ul>
  </>
);

/** Its live views, also on the component's page of demos (and `/all`). */
export const typographyOverviewDemos = [LiveView];
