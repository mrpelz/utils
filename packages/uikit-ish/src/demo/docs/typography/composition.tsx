import './style.css';

import { FunctionComponent, useMemo } from 'react';

import { List, Symbol, Typography } from '../../../components/index.js';
import { CodeView } from '../../tooling/frame/code-view.js';
import { Component } from '../../tooling/frame/component.js';
import {
  usePartControls,
  usePropControl,
} from '../../tooling/frame/prop-control.js';
import { useProvidedState } from '../../tooling/frame/state.js';
import {
  Contents,
  Heading,
  PartLink,
  type Section,
} from '../../tooling/guide/sections.js';
import { sfCheckmarkCircleFill, sfCloudFill } from '../../tooling/icons.js';
import { publicUrl } from '../../tooling/public-url.js';
import { partPropMaps } from '../part-options.js';
import { propOptionsCompositionSize } from './props.js';

/* eslint-disable unicorn/no-incorrect-template-string-interpolation -- JSX braces in code samples, not interpolations */
const anArticleCode = `<article>
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
  {/* Body by default. */}
  <Typography render={<p />}>Six kilometers along the river, …</Typography>
  <Typography
    color="secondary"
    render={<p />}
    textStyle="footnote"
  >
    Distances are measured by the phone’s motion sensors.
  </Typography>
</article>`;

const aSizeForAListCode = `const textSize = 'xLarge';

{/* Everything in it at that size, the list's rows too. */}
<Typography
  render={<div />}
  textSize={textSize}
>
  <List.Root>
    <List.Section>
      <List.Group>
        <List.Item>
          <List.Content>
            <List.Title>Text Size</List.Title>
          </List.Content>
          <List.Trailing>
            <List.Detail>{textSize}</List.Detail>
          </List.Trailing>
        </List.Item>
        …
      </List.Group>
    </List.Section>
  </List.Root>
</Typography>`;

const symbolsInTextCode = `<Typography
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
</Typography>`;
/* eslint-enable unicorn/no-incorrect-template-string-interpolation */

/** An article's heading, paragraphs and caption, as their elements. */
const AnArticle: FunctionComponent = () => {
  const id = 'typography-composition-article';
  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps({
          Typography: ['color', 'emphasized', 'render', 'textStyle'],
        }),
      [],
    ),
    { provided: useProvidedState(id) },
  );

  return (
    <Component
      isCentered
      isInline
      controls={[partControls]}
      id={id}
      state={[partState]}
      title="Typography in an article"
    >
      <article className="typography-demo-article">
        <Typography
          {...partProps.Typography}
          emphasized
          render={<h2 />}
          textStyle="title2"
        >
          Morning Run
        </Typography>
        <Typography
          {...partProps.Typography}
          color="secondary"
          render={<p />}
          textStyle="subheadline"
        >
          Today, 7:12
        </Typography>
        <Typography
          {...partProps.Typography}
          render={<p />}
        >
          Six kilometers along the river, the last one the fastest. The legs
          felt heavy at the start, then easier with every kilometer.
        </Typography>
        <Typography
          {...partProps.Typography}
          color="secondary"
          render={<p />}
          textStyle="footnote"
        >
          Distances are measured by the phone’s motion sensors.
        </Typography>
      </article>
    </Component>
  );
};

/** A list's rows at a text size, set around it. */
const ASizeForAList: FunctionComponent = () => {
  const id = 'typography-composition-size';
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(propOptionsCompositionSize, {
    external,
    isOpen: true,
    title: 'Typography',
  });

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps({
          'List.Content': [],
          'List.Detail': [],
          'List.Group': [],
          'List.Item': [],
          'List.Root': [],
          'List.Section': [],
          'List.Title': [],
          'List.Trailing': [],
        }),
      [],
    ),
    { provided: useProvidedState(id) },
  );

  return (
    <Component
      isCentered
      isInline
      controls={[control, partControls]}
      id={id}
      state={[state, partState]}
      title="Typography sizing a list"
    >
      <Typography
        className="typography-demo-list"
        render={<div />}
        {...props}
      >
        <List.Root {...partProps['List.Root']}>
          <List.Section {...partProps['List.Section']}>
            <List.Group {...partProps['List.Group']}>
              <List.Item {...partProps['List.Item']}>
                <List.Content {...partProps['List.Content']}>
                  <List.Title {...partProps['List.Title']}>
                    Text Size
                  </List.Title>
                </List.Content>
                <List.Trailing {...partProps['List.Trailing']}>
                  <List.Detail {...partProps['List.Detail']}>
                    {props.textSize}
                  </List.Detail>
                </List.Trailing>
              </List.Item>
              <List.Item {...partProps['List.Item']}>
                <List.Content {...partProps['List.Content']}>
                  <List.Title {...partProps['List.Title']}>
                    Bold Text
                  </List.Title>
                </List.Content>
                <List.Trailing {...partProps['List.Trailing']}>
                  <List.Detail {...partProps['List.Detail']}>Off</List.Detail>
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
const SymbolsInText: FunctionComponent = () => {
  const id = 'typography-composition-symbols';
  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps({
          Symbol: ['icon'],
          Typography: ['color', 'emphasized', 'textStyle'],
        }),
      [],
    ),
    { provided: useProvidedState(id) },
  );

  return (
    <Component
      isCentered
      isInline
      controls={[partControls]}
      id={id}
      state={[partState]}
      title="Symbols in text"
    >
      <div className="typography-demo-article">
        <Typography
          {...partProps.Typography}
          emphasized
          textStyle="title3"
        >
          <Symbol
            {...partProps.Symbol}
            icon={sfCloudFill}
          />{' '}
          Cloudy
        </Typography>
        <Typography
          {...partProps.Typography}
          color="secondary"
          textStyle="footnote"
        >
          <Symbol
            {...partProps.Symbol}
            icon={sfCheckmarkCircleFill}
          />{' '}
          Backed up
        </Typography>
      </div>
    </Component>
  );
};

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
        Each text has its style and its element (<code>render</code>): a heading
        (Title 2, emphasized, as an <code>h2</code>), paragraphs, and a caption.
      </li>
      <li>
        Secondary text uses the secondary label color (<code>color</code>).
      </li>
      <li>
        <strong>Library:</strong> the text styles (
        <PartLink
          component="typography"
          part="Typography"
        />{' '}
        <code>textStyle</code>, <code>emphasized</code>, <code>color</code>),
        and rendering each as its element (<code>render</code>).
      </li>
      <li>
        <strong>Demo:</strong> the article’s text.
      </li>
    </ul>
    <CodeView code={anArticleCode} />
    <AnArticle />

    <Heading
      id="a-size-for-a-list"
      level={2}
    >
      A size for a list
    </Heading>
    <ul>
      <li>
        A text size (<code>textSize</code>) applies to everything inside it.
        Here, that’s a <a href={publicUrl('list')}>List</a>’s rows: their text
        grows, and the rows grow with it.
      </li>
      <li>
        The components use the text styles’ tokens, so they follow it (for
        example an app’s text size setting, set around its content).
      </li>
      <li>
        <strong>Library:</strong> the text size (<code>textSize</code>) for
        everything inside it, and the components following its tokens.
      </li>
      <li>
        <strong>Demo:</strong> the rows.
      </li>
    </ul>
    <CodeView code={aSizeForAListCode} />
    <ASizeForAList />

    <Heading
      id="symbols-in-text"
      level={2}
    >
      Symbols in text
    </Heading>
    <ul>
      <li>
        A <a href={publicUrl('symbol')}>Symbol</a> in the text is sized like its
        letters, weighted like them (heavier when emphasized), and takes their
        color.
      </li>
      <li>
        <strong>Library:</strong> the{' '}
        <PartLink
          component="symbol"
          part="Symbol"
        />
        , sized and colored by its text.
      </li>
      <li>
        <strong>Demo:</strong> the text.
      </li>
    </ul>
    <CodeView code={symbolsInTextCode} />
    <SymbolsInText />
  </>
);

/** Its live views, also on the component's page of demos (and `/all`). */
export const typographyCompositionDemos = [
  AnArticle,
  ASizeForAList,
  SymbolsInText,
];
