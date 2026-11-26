import { FunctionComponent, useMemo } from 'react';

import {
  Button,
  Page,
  Segmented,
  Stack,
  Typography,
  Viewport,
} from '../../../components/index.js';
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
import { partPropMaps } from '../part-options.js';
import { buttons } from './content.js';

const pageCode = `<Page.Root>
  <Viewport.Padding edge="block-start" />
  {/* The page's content, 16px from the screen's sides, as a list's groups. */}
  <Stack inset>
    <Typography textStyle="title2">Weekly Plan</Typography>
    <Segmented.Root aria-label="Period" defaultValue="w">
      …
    </Segmented.Root>
    <Typography color="secondary">…</Typography>
    {/* Its buttons in a row at the end, 12px apart. */}
    <Stack axis="horizontal" justify="end" spacing="medium">
      <Button.Root variant="bordered">…</Button.Root>
      <Button.Root variant="bordered-prominent">…</Button.Root>
    </Stack>
  </Stack>
  <Viewport.Padding edge="block-end" />
</Page.Root>`;

const rowCode = `<Stack axis="horizontal" justify="center" spacing="medium" wrap>
  <Button.Root variant="bordered">
    <Button.Label>Share</Button.Label>
  </Button.Root>
  …
</Stack>`;

/** A page's content that isn't a list: inset, a row of buttons in it. */
const OnAPage: FunctionComponent = () => {
  const id = 'stack-composition-page';
  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps({
          'Page.Root': [],
          Stack: ['inset'],
          'Stack (row)': ['axis', 'justify', 'spacing'],
          'Viewport.Content': [],
          'Viewport.Padding': ['edge'],
        }),
      [],
    ),
    { provided: useProvidedState(id) },
  );

  return (
    <Component
      isInline
      controls={[partControls]}
      id={id}
      stage="phone"
      state={[partState]}
      title="Content on a page"
    >
      <Viewport.Content {...partProps['Viewport.Content']}>
        <Page.Root {...partProps['Page.Root']}>
          <Viewport.Padding
            {...partProps['Viewport.Padding']}
            edge="block-start"
          />
          <Stack
            inset
            {...partProps.Stack}
          >
            <Typography textStyle="title2">Weekly Plan</Typography>
            <Segmented.Root
              aria-label="Period"
              defaultValue="w"
            >
              <Segmented.Item value="d">Day</Segmented.Item>
              <Segmented.Item value="w">Week</Segmented.Item>
              <Segmented.Item value="m">Month</Segmented.Item>
              <Segmented.Highlight />
            </Segmented.Root>
            <Typography color="secondary">
              Three workouts and two rest days, with the longest run on Sunday.
            </Typography>
            <Stack
              {...partProps['Stack (row)']}
              axis="horizontal"
              justify="end"
              spacing="medium"
            >
              <Button.Root
                disabled={false}
                variant="bordered"
              >
                <Button.Label>Edit</Button.Label>
              </Button.Root>
              <Button.Root
                disabled={false}
                variant="bordered-prominent"
              >
                <Button.Label>Start</Button.Label>
              </Button.Root>
            </Stack>
          </Stack>
          <Viewport.Padding
            {...partProps['Viewport.Padding']}
            edge="block-end"
          />
        </Page.Root>
      </Viewport.Content>
    </Component>
  );
};

/** Buttons in a row, wrapping onto a second line as they don't fit. */
const ARow: FunctionComponent = () => {
  const id = 'stack-composition-row';
  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () => partPropMaps({ Stack: ['axis', 'justify', 'spacing', 'wrap'] }),
      [],
    ),
    { provided: useProvidedState(id) },
  );

  return (
    <Component
      isInline
      isStretched
      controls={[partControls]}
      id={id}
      state={[partState]}
      title="A row of buttons"
    >
      <Stack
        {...partProps.Stack}
        wrap
        axis="horizontal"
        justify="center"
        spacing="medium"
      >
        {buttons(6)}
      </Stack>
    </Component>
  );
};

const sections: readonly Section[] = [
  ['content-on-a-page', 'Content on a page'],
  ['a-row-of-buttons', 'A row of buttons'],
];

/** `/stack/composition`: stacks in an app. */
export const StackComposition: FunctionComponent = () => (
  <>
    <Contents sections={sections} />
    <ul className="demo-lead">
      <li>Stacks in an app: a page’s content, and a row of buttons.</li>
    </ul>

    <Heading
      id="content-on-a-page"
      level={2}
    >
      Content on a page
    </Heading>
    <ul>
      <li>
        A page’s content that isn’t a list, in a stack with <code>inset</code>:
        16px from the screen’s sides, as a list’s groups are, and 16px apart.
      </li>
      <li>
        Its buttons in a stack of their own, a row at the end, 12px apart.
        Stacks nest.
      </li>
      <li>
        <strong>Library:</strong> the stacks, their spacing and inset, the{' '}
        <PartLink
          component="viewport"
          part="Viewport.Padding"
        />{' '}
        at the page’s ends.
      </li>
      <li>
        <strong>Demo:</strong> the content.
      </li>
    </ul>
    <CodeView code={pageCode} />
    <OnAPage />

    <Heading
      id="a-row-of-buttons"
      level={2}
    >
      A row of buttons
    </Heading>
    <ul>
      <li>
        Buttons side by side, centered, wrapping onto another line when they
        don’t fit (<code>wrap</code>).
      </li>
      <li>
        <strong>Library:</strong> the row and its spacing.
      </li>
      <li>
        <strong>Demo:</strong> the buttons.
      </li>
    </ul>
    <CodeView code={rowCode} />
    <ARow />
  </>
);

/** Its live views, also on the component's page of demos (and `/all`). */
export const stackCompositionDemos = [OnAPage, ARow];
