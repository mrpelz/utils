import { FunctionComponent } from 'react';

import { Stack } from '../../../components/index.js';
import { Component } from '../../tooling/frame/component.js';
import { usePropControl } from '../../tooling/frame/prop-control.js';
import { useProvidedState } from '../../tooling/frame/state.js';
import { KeyPropsTable, pickRows } from '../../tooling/guide/props-table.js';
import {
  Contents,
  Heading,
  PartLink,
  type Section,
} from '../../tooling/guide/sections.js';
import { publicUrl } from '../../tooling/public-url.js';
import { buttons } from './content.js';
import { stackRows } from './docs.js';
import { propOptionsStack } from './props.js';

/** Buttons in a stack: a column, or a row. */
const LiveView: FunctionComponent = () => {
  const id = 'stack-overview';
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(propOptionsStack, {
    external,
    isOpen: true,
    title: 'Stack',
  });

  return (
    <Component
      isInline
      isStretched
      controls={[control]}
      id={id}
      state={[state]}
      title="Stack"
    >
      <Stack {...props}>{buttons(3)}</Stack>
    </Component>
  );
};

const sections: readonly Section[] = [
  ['when-to-use-it', 'When to use it'],
  ['when-to-use-something-else', 'When to use something else'],
  ['key-props', 'Key props'],
  ['accessibility', 'Accessibility'],
  ['behavior', 'Behavior'],
];

/** `/stack`: what a stack is for, and its props. */
export const StackOverview: FunctionComponent = () => (
  <>
    <Contents sections={sections} />
    <ul className="demo-lead">
      <li>
        Lays out components one below another, or side by side, with a step of
        the library’s spacing scale between them.
      </li>
      <li>
        The space between components belongs to it, not to the components: none
        of them has a margin of its own.
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
        For components next to each other outside a list: a value above its
        control, sliders above a form’s button, a row of buttons.
      </li>
      <li>
        With <code>inset</code>, for a page’s content that isn’t a list, so it
        keeps the same distance from the screen’s sides as a list’s groups.
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
        Rows of items: use a <a href={publicUrl('list')}>List</a>. It spaces its
        sections, groups and blocks itself.
      </li>
      <li>
        Columns of an app (a sidebar, a detail): use{' '}
        <a href={publicUrl('layout')}>Layout</a>.
      </li>
      <li>
        Tiles on a grid: use <a href={publicUrl('grid')}>Grid</a>.
      </li>
      <li>
        Room at a page’s top and bottom (for bars, and the content margin): use{' '}
        <PartLink
          component="viewport"
          part="Viewport.Padding"
        />
        .
      </li>
    </ul>

    <Heading
      id="key-props"
      level={2}
    >
      Key props
    </Heading>
    <ul>
      <li>The props most stacks set.</li>
      <li>
        All of its props are on the <a href={publicUrl('stack/parts')}>Parts</a>{' '}
        page.
      </li>
    </ul>
    <KeyPropsTable
      parts={[['Stack', pickRows(stackRows, 'axis', 'spacing', 'inset')]]}
    />

    <Heading
      id="accessibility"
      level={2}
    >
      Accessibility
    </Heading>
    <ul>
      <li>
        It’s a plain <code>div</code> with no role, so it doesn’t change what
        assistive technology reads. Its children are read in their order.
      </li>
      <li>
        It only changes where they sit, not their order. Keep the order of the
        code the order they’re read in.
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
        A column by default, its children stretched to its width, 16px apart.
      </li>
      <li>
        The spacing steps are 8px, 12px, 16px and 32px, as tokens. Set them
        anywhere (for example on the root) to change them for everything inside.
      </li>
      <li>
        In a right-to-left language, a row runs from the right, as its language
        does.
      </li>
    </ul>
  </>
);

/** Its live views, also on the component's page of demos (and `/all`). */
export const stackOverviewDemos = [LiveView];
