import './style.css';

import { sfCheckmarkCircleFill } from '@bradleyhodges/sfsymbols/sfCheckmarkCircleFill';
import { sfCloudFill } from '@bradleyhodges/sfsymbols/sfCloudFill';
import { FunctionComponent } from 'react';

import { List, Symbol, Typography } from '../../../components/index.js';
import { Component } from '../../tooling/frame/component.js';
import { usePropControl } from '../../tooling/frame/prop-control.js';
import { useProvidedState } from '../../tooling/frame/state.js';
import {
  Contents,
  Heading,
  PartLink,
  type Section,
} from '../../tooling/guide/sections.js';
import { propOptionsCompositionSize } from './props.js';

/** An article's heading, paragraphs and caption, as their elements. */
const AnArticle: FunctionComponent = () => (
  <Component
    isCentered
    isInline
    id="typography-composition-article"
    title="Typography in an article"
  >
    <article className="typography-demo-article">
      <Typography
        emphasized
        render={<h2 />}
        textStyle="title2"
      >
        Morning Run
      </Typography>
      <Typography
        color="secondary"
        render={<p />}
        textStyle="subheadline"
      >
        Today, 7:12
      </Typography>
      <Typography render={<p />}>
        Six kilometers along the river, the last one the fastest. The legs felt
        heavy at the start, then easier with every kilometer.
      </Typography>
      <Typography
        color="secondary"
        render={<p />}
        textStyle="footnote"
      >
        Distances are measured by the phone’s motion sensors.
      </Typography>
    </article>
  </Component>
);

/** A list's rows at a Dynamic Type size, set around it. */
const ASizeForAList: FunctionComponent = () => {
  const id = 'typography-composition-size';
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(propOptionsCompositionSize, {
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
      title="Typography sizing a list"
    >
      <Typography
        className="typography-demo-list"
        render={<div />}
        {...props}
      >
        <List.Root>
          <List.Section>
            <List.Group>
              <List.Item>
                <List.Content>
                  <List.Title>Text Size</List.Title>
                </List.Content>
                <List.Trailing>
                  <List.Detail>{props.dynamicTypeSize}</List.Detail>
                </List.Trailing>
              </List.Item>
              <List.Item>
                <List.Content>
                  <List.Title>Bold Text</List.Title>
                </List.Content>
                <List.Trailing>
                  <List.Detail>Off</List.Detail>
                </List.Trailing>
              </List.Item>
            </List.Group>
          </List.Section>
        </List.Root>
      </Typography>
    </Component>
  );
};

/** Symbols in text: sized and weighted as the text around them. */
const SymbolsInText: FunctionComponent = () => (
  <Component
    isCentered
    isInline
    id="typography-composition-symbols"
    title="Symbols in text"
  >
    <div className="typography-demo-article">
      <Typography
        emphasized
        textStyle="title3"
      >
        <Symbol icon={sfCloudFill} /> Cloudy
      </Typography>
      <Typography
        color="secondary"
        textStyle="footnote"
      >
        <Symbol icon={sfCheckmarkCircleFill} /> Backed up
      </Typography>
    </div>
  </Component>
);

/** The page's sections (its headings' ids), listed at its top. */
const sections: readonly Section[] = [
  ['an-article', 'An article'],
  ['a-size-for-a-list', 'A size for a list'],
  ['symbols-in-text', 'Symbols in text'],
];

/** `/typography/composition`: text styles with other components. */
export const TypographyComposition: FunctionComponent = () => (
  <>
    <Contents sections={sections} />

    <Heading
      id="an-article"
      level={2}
    >
      An article
    </Heading>
    <ul>
      <li>
        Each text in its style and as its element (<code>render</code>): a
        heading (Title 2, emphasized, an <code>h2</code>), paragraphs, a
        caption.
      </li>
      <li>
        Secondary text in the secondary label color (<code>color</code>).
      </li>
      <li>
        <strong>Library:</strong> the text styles (
        <PartLink
          component="typography"
          part="Typography"
        />{' '}
        <code>textStyle</code>, <code>emphasized</code>, <code>color</code>) and
        rendering each as its element (<code>render</code>).
      </li>
      <li>
        <strong>Demo:</strong> the article’s text.
      </li>
    </ul>
    <AnArticle />

    <Heading
      id="a-size-for-a-list"
      level={2}
    >
      A size for a list
    </Heading>
    <ul>
      <li>
        A Dynamic Type size (<code>dynamicTypeSize</code>) for everything in it:
        here a <a href="list">List</a>’s rows, their text growing and the rows
        with it.
      </li>
      <li>
        The components use the text styles’ tokens, so they follow it (e.g. the
        app’s text size setting around its content).
      </li>
      <li>
        <strong>Library:</strong> the Dynamic Type size (
        <code>dynamicTypeSize</code>) for everything in it, and the components
        following its tokens.
      </li>
      <li>
        <strong>Demo:</strong> the rows.
      </li>
    </ul>
    <ASizeForAList />

    <Heading
      id="symbols-in-text"
      level={2}
    >
      Symbols in text
    </Heading>
    <ul>
      <li>
        A <a href="symbol">Symbol</a> in the text, sized as its glyphs and
        weighted as it (emphasized: heavier), in its color.
      </li>
      <li>
        <strong>Library:</strong> the{' '}
        <PartLink
          component="symbol"
          part="Symbol"
        />{' '}
        sized and colored by its text.
      </li>
      <li>
        <strong>Demo:</strong> the text.
      </li>
    </ul>
    <SymbolsInText />
  </>
);

/** Its live views, also on the component's page of demos (and `/all`). */
export const typographyCompositionDemos = [
  AnArticle,
  ASizeForAList,
  SymbolsInText,
];
