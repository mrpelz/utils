import './style.css';

import { sfAirplane } from '@bradleyhodges/sfsymbols/sfAirplane';
import { sfIcloudSlash } from '@bradleyhodges/sfsymbols/sfIcloudSlash';
import { sfWifi } from '@bradleyhodges/sfsymbols/sfWifi';
import { FunctionComponent } from 'react';

import { List, Symbol } from '../../../components/index.js';
import { Component } from '../../tooling/frame/component.js';
import {
  Contents,
  Heading,
  PartLink,
  type Section,
} from '../../tooling/guide/sections.js';

/** Settings' rows: each a symbol, white on its color, as its image. */
const RowImages: FunctionComponent = () => (
  <Component
    isCentered
    isInline
    id="symbol-composition-rows"
    title="Symbols as rows' images"
  >
    <List.Root className="symbol-demo-list">
      <List.Section>
        <List.Group>
          <List.Item>
            <List.Leading>
              <List.Image
                style={{ backgroundColor: 'var(--color-ios-system-orange)' }}
                variant="rounded"
              >
                <Symbol icon={sfAirplane} />
              </List.Image>
            </List.Leading>
            <List.Content>
              <List.Title>Airplane Mode</List.Title>
            </List.Content>
          </List.Item>
          <List.Item>
            <List.Leading>
              <List.Image
                style={{ backgroundColor: 'var(--color-ios-system-blue)' }}
                variant="rounded"
              >
                <Symbol icon={sfWifi} />
              </List.Image>
            </List.Leading>
            <List.Content>
              <List.Title>Wi-Fi</List.Title>
            </List.Content>
            <List.Trailing>
              <List.Detail>Home</List.Detail>
            </List.Trailing>
          </List.Item>
        </List.Group>
      </List.Section>
    </List.Root>
  </Component>
);

/** A status told by a symbol alone: an image, named. */
const OnItsOwn: FunctionComponent = () => (
  <Component
    isCentered
    isInline
    id="symbol-composition-image"
    title="A symbol meaning something"
  >
    <List.Root className="symbol-demo-list">
      <List.Section>
        <List.Group>
          <List.Item>
            <List.Content>
              <List.Title>Notes</List.Title>
            </List.Content>
            <List.Trailing>
              <List.Detail>
                <Symbol
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
        In a <a href="button">Button</a>’s icon (
        <PartLink
          component="button"
          part="Button.Icon"
        />
        ): before a label, after it (a pop-up’s chevrons), or alone (a circle,
        named): see <a href="button/composition#symbols-and-labels">Button</a>.
      </li>
      <li>
        On glass, its glyph blended with the button’s content (vibrant), as the
        label is.
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
        Settings’ rows: a <a href="list">List</a> row’s{' '}
        <PartLink
          component="list"
          part="List.Image"
        />{' '}
        (rounded, its background the color), the symbol white in it.
      </li>
      <li>Decorative: the row’s title names it.</li>
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
        ), its background the color.
      </li>
      <li>
        <strong>Demo:</strong> the rows, their symbols and colors.
      </li>
    </ul>
    <RowImages />

    <Heading
      id="meaning-something-on-its-own"
      level={2}
    >
      Meaning something on its own
    </Heading>
    <ul>
      <li>
        A status no text tells (Notes not synced): an image (
        <code>role=&quot;img&quot;</code>), named (<code>aria-label</code>).
      </li>
      <li>In a row’s detail, in its secondary label color.</li>
      <li>
        <strong>Library:</strong> the{' '}
        <PartLink
          component="symbol"
          part="Symbol"
        />{' '}
        as an image (<code>role=&quot;img&quot;</code>, named) in the row’s
        detail.
      </li>
      <li>
        <strong>Demo:</strong> the status it tells and its name.
      </li>
    </ul>
    <OnItsOwn />

    <Heading
      id="with-a-badge"
      level={2}
    >
      With a badge
    </Heading>
    <ul>
      <li>
        A <a href="badge">Badge</a> as its child (
        <code>placement=&quot;symbol&quot;</code>), on its top end corner, not
        blended with it: see{' '}
        <a href="badge/composition#on-a-toolbar-button">Badge</a>.
      </li>
    </ul>
  </>
);

/** Its live views, also on the component's page of demos (and `/all`). */
export const symbolCompositionDemos = [RowImages, OnItsOwn];
