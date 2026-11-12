import './style.css';

import { FunctionComponent, useMemo } from 'react';

import { List, Symbol } from '../../../components/index.js';
import { CodeView } from '../../tooling/frame/code-view.js';
import { Component } from '../../tooling/frame/component.js';
import { usePartControls } from '../../tooling/frame/prop-control.js';
import { useProvidedState } from '../../tooling/frame/state.js';
import {
  Contents,
  Heading,
  PartLink,
  type Section,
} from '../../tooling/guide/sections.js';
import { sfAirplane, sfIcloudSlash, sfWifi } from '../../tooling/icons.js';
import { publicUrl } from '../../tooling/public-url.js';
import { partPropMaps } from '../part-options.js';

/* eslint-disable unicorn/no-incorrect-template-string-interpolation -- JSX braces in code samples, not interpolations */
const rowImagesCode = `<List.Item>
  <List.Leading>
    {/* Rounded, its background the color: the symbol white in it. */}
    <List.Image
      style={{ backgroundColor: 'var(--color-ui-system-orange)' }}
      variant="rounded"
    >
      <Symbol icon={sfAirplane} />
    </List.Image>
  </List.Leading>
  <List.Content>
    <List.Title>Airplane Mode</List.Title>
  </List.Content>
</List.Item>`;

const onItsOwnCode = `<List.Item>
  <List.Content>
    <List.Title>Notes</List.Title>
  </List.Content>
  <List.Trailing>
    <List.Detail>
      {/* No text tells it: an image, named. */}
      <Symbol
        aria-label="Not synced"
        icon={sfIcloudSlash}
        role="img"
      />
    </List.Detail>
  </List.Trailing>
</List.Item>`;
/* eslint-enable unicorn/no-incorrect-template-string-interpolation */

/** Settings' rows: each a symbol, white on its color, as its image. */
const RowImages: FunctionComponent = () => {
  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps({
          Symbol: ['icon'],
          'List.Content': [],
          'List.Detail': [],
          'List.Group': [],
          'List.Image': ['style', 'variant'],
          'List.Item': [],
          'List.Leading': [],
          'List.Root': ['className'],
          'List.Section': [],
          'List.Title': [],
          'List.Trailing': [],
        }),
      [],
    ),
    { provided: useProvidedState('symbol-composition-rows') },
  );
  return (
    <Component
      isCentered
      isInline
      controls={[partControls]}
      id="symbol-composition-rows"
      state={[partState]}
      title="Symbols as rows' images"
    >
      <List.Root
        {...partProps['List.Root']}
        className="symbol-demo-list"
      >
        <List.Section {...partProps['List.Section']}>
          <List.Group {...partProps['List.Group']}>
            <List.Item {...partProps['List.Item']}>
              <List.Leading {...partProps['List.Leading']}>
                <List.Image
                  {...partProps['List.Image']}
                  style={{ backgroundColor: 'var(--color-ui-system-orange)' }}
                  variant="rounded"
                >
                  <Symbol
                    {...partProps.Symbol}
                    icon={sfAirplane}
                  />
                </List.Image>
              </List.Leading>
              <List.Content {...partProps['List.Content']}>
                <List.Title {...partProps['List.Title']}>
                  Airplane Mode
                </List.Title>
              </List.Content>
            </List.Item>
            <List.Item {...partProps['List.Item']}>
              <List.Leading {...partProps['List.Leading']}>
                <List.Image
                  {...partProps['List.Image']}
                  style={{ backgroundColor: 'var(--color-ui-system-blue)' }}
                  variant="rounded"
                >
                  <Symbol
                    {...partProps.Symbol}
                    icon={sfWifi}
                  />
                </List.Image>
              </List.Leading>
              <List.Content {...partProps['List.Content']}>
                <List.Title {...partProps['List.Title']}>Wi-Fi</List.Title>
              </List.Content>
              <List.Trailing {...partProps['List.Trailing']}>
                <List.Detail {...partProps['List.Detail']}>Home</List.Detail>
              </List.Trailing>
            </List.Item>
          </List.Group>
        </List.Section>
      </List.Root>
    </Component>
  );
};

/** A status told by a symbol alone: an image, named. */
const OnItsOwn: FunctionComponent = () => {
  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps({
          Symbol: ['aria-label', 'icon', 'role'],
          'List.Content': [],
          'List.Detail': [],
          'List.Group': [],
          'List.Item': [],
          'List.Root': ['className'],
          'List.Section': [],
          'List.Title': [],
          'List.Trailing': [],
        }),
      [],
    ),
    { provided: useProvidedState('symbol-composition-image') },
  );
  return (
    <Component
      isCentered
      isInline
      controls={[partControls]}
      id="symbol-composition-image"
      state={[partState]}
      title="A symbol meaning something"
    >
      <List.Root
        {...partProps['List.Root']}
        className="symbol-demo-list"
      >
        <List.Section {...partProps['List.Section']}>
          <List.Group {...partProps['List.Group']}>
            <List.Item {...partProps['List.Item']}>
              <List.Content {...partProps['List.Content']}>
                <List.Title {...partProps['List.Title']}>Notes</List.Title>
              </List.Content>
              <List.Trailing {...partProps['List.Trailing']}>
                <List.Detail {...partProps['List.Detail']}>
                  <Symbol
                    {...partProps.Symbol}
                    aria-label="Not synced"
                    icon={sfIcloudSlash}
                    role="img"
                  />
                </List.Detail>
              </List.Trailing>
            </List.Item>
          </List.Group>
        </List.Section>
      </List.Root>
    </Component>
  );
};

/** The page's sections (its headings' ids), listed at its top. */
const sections: readonly Section[] = [
  ['in-buttons', 'In buttons'],
  ['as-a-row-s-image', 'As a row’s image'],
  ['meaning-something-on-its-own', 'Meaning something on its own'],
  ['with-a-badge', 'With a badge'],
];

/** `/symbol/composition`: symbols in other components. */
export const SymbolComposition: FunctionComponent = () => (
  <>
    <Contents sections={sections} />

    <Heading
      id="in-buttons"
      level={2}
    >
      In buttons
    </Heading>
    <ul>
      <li>
        In a <a href={publicUrl('button')}>Button</a>’s icon (
        <PartLink
          component="button"
          part="Button.Icon"
        />
        ), it can go before a label, after it (a pop-up button’s chevrons), or
        stand alone (a named circle). See{' '}
        <a href={publicUrl('button/composition#symbols-and-labels')}>Button</a>.
      </li>
      <li>
        On glass, its glyph is blended with the button’s content (vibrant), like
        the label.
      </li>
    </ul>

    <Heading
      id="as-a-row-s-image"
      level={2}
    >
      As a row’s image
    </Heading>
    <ul>
      <li>
        As in a settings app’s rows: a <a href={publicUrl('list')}>List</a>{' '}
        row’s{' '}
        <PartLink
          component="list"
          part="List.Image"
        />{' '}
        (rounded, with the color as its background) holds the symbol in white.
      </li>
      <li>It’s decorative, because the row’s title names it.</li>
      <li>
        <strong>Library:</strong> the{' '}
        <PartLink
          component="symbol"
          part="Symbol"
        />{' '}
        in the row’s image (
        <PartLink
          component="list"
          part="List.Image"
        />
        ), with the color as its background.
      </li>
      <li>
        <strong>Demo:</strong> the rows, their symbols and colors.
      </li>
    </ul>
    <CodeView code={rowImagesCode} />
    <RowImages />

    <Heading
      id="meaning-something-on-its-own"
      level={2}
    >
      Meaning something on its own
    </Heading>
    <ul>
      <li>
        For a status that no text gives (notes that aren’t synced), it’s an
        image (<code>role=&quot;img&quot;</code>) with a name (
        <code>aria-label</code>).
      </li>
      <li>It sits in a row’s detail, in the secondary label color.</li>
      <li>
        <strong>Library:</strong> the{' '}
        <PartLink
          component="symbol"
          part="Symbol"
        />{' '}
        as a named image (<code>role=&quot;img&quot;</code>) in the row’s
        detail.
      </li>
      <li>
        <strong>Demo:</strong> the status it gives, and its name.
      </li>
    </ul>
    <CodeView code={onItsOwnCode} />
    <OnItsOwn />

    <Heading
      id="with-a-badge"
      level={2}
    >
      With a badge
    </Heading>
    <ul>
      <li>
        A <a href={publicUrl('badge')}>Badge</a> can be its child (
        <code>placement=&quot;symbol&quot;</code>), on its top end corner,
        without being blended with it. See{' '}
        <a href={publicUrl('badge/composition#on-a-toolbar-button')}>Badge</a>.
      </li>
    </ul>
  </>
);

/** Its live views, also on the component's page of demos (and `/all`). */
export const symbolCompositionDemos = [RowImages, OnItsOwn];
