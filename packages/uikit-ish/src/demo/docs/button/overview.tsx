import { FunctionComponent, useMemo } from 'react';

import { Button, Symbol } from '../../../components/index.js';
import { Component } from '../../tooling/frame/component.js';
import { useLog } from '../../tooling/frame/log.js';
import {
  usePartControls,
  usePropControl,
} from '../../tooling/frame/prop-control.js';
import { useProvidedState } from '../../tooling/frame/state.js';
import { KeyPropsTable, pickRows } from '../../tooling/guide/props-table.js';
import {
  Contents,
  Heading,
  type Section,
} from '../../tooling/guide/sections.js';
import { sfHeartFill } from '../../tooling/icons.js';
import { publicUrl } from '../../tooling/public-url.js';
import { partPropMaps } from '../part-options.js';
import { buttonRootRows } from './docs.js';
import {
  propOptionsOverviewContent,
  propOptionsOverviewRoot,
} from './props.js';

/** A button: a symbol, a label, or both, with a few of its props. */
const LiveView: FunctionComponent = () => {
  const id = 'button-overview';
  const [log, addLog] = useLog();
  const [externalContent, externalRoot] = useProvidedState(id);
  const [controlContent, content, stateContent] = usePropControl(
    propOptionsOverviewContent,
    { external: externalContent, isOpen: true, title: '[content]' },
  );
  const [controlRoot, props, stateRoot, elementKey] = usePropControl(
    propOptionsOverviewRoot,
    { external: externalRoot, title: 'Button.Root' },
  );

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            Symbol: ['icon'],
            'Button.Icon': [],
            'Button.Label': [],
          },
          addLog,
        ),
      [addLog],
    ),
    { provided: useProvidedState(id) },
  );

  return (
    <Component
      isCentered
      isInline
      controls={[controlContent, controlRoot, partControls]}
      id={id}
      log={log}
      state={[stateContent, stateRoot, partState]}
      title="Button"
    >
      <Button.Root
        key={elementKey}
        aria-label={content.label ? undefined : 'Like'}
        {...props}
        onClick={() => addLog('Like clicked')}
      >
        {content.symbol ? (
          <Button.Icon {...partProps['Button.Icon']}>
            <Symbol
              {...partProps.Symbol}
              icon={sfHeartFill}
            />
          </Button.Icon>
        ) : null}
        {content.label ? (
          <Button.Label {...partProps['Button.Label']}>Like</Button.Label>
        ) : null}
      </Button.Root>
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

/** `/button`: what a button is for, and its props. */
export const ButtonOverview: FunctionComponent = () => (
  <>
    <Contents sections={sections} />
    <ul className="demo-lead">
      <li>
        Performs an action at once, with a label, a symbol, or both. It’s Base
        UI’s <code>Button</code>.
      </li>
      <li>
        Its style sets its prominence: a label on its own, on a fill, or on the
        tint. Or glass, floating above content.
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
        For an action in the page, such as Continue, Add to Library or Sign In.
        Make the most likely one prominent, one per view.
      </li>
      <li>
        For a control of its own above content, in glass, such as a player’s or
        a map’s (see <a href={publicUrl('button/composition')}>Composition</a>).
      </li>
      <li>
        Inside other components: a <a href={publicUrl('toolbar')}>Toolbar</a>’s
        buttons, a <a href={publicUrl('list')}>List</a> row’s trailing button,
        or a trigger’s <code>render</code> (a{' '}
        <a href={publicUrl('sheet')}>Sheet</a>’s, an{' '}
        <a href={publicUrl('alert')}>Alert</a>’s).
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
        Going somewhere (one of the app’s pages): use a{' '}
        <a href={publicUrl('list')}>List</a> row that drills in, or a link.
      </li>
      <li>
        A setting that’s on or off: use a{' '}
        <a href={publicUrl('switch')}>Switch</a>. One of a few options: use a{' '}
        <a href={publicUrl('segmented')}>Segmented</a> control.
      </li>
      <li>
        Several actions behind one: use a <a href={publicUrl('menu')}>Menu</a>,
        with a button as its trigger.
      </li>
      <li>
        A bar’s actions: use a <a href={publicUrl('toolbar')}>Toolbar</a>’s
        buttons, for its capsules and its keyboard handling.
      </li>
    </ul>

    <Heading
      id="key-props"
      level={2}
    >
      Key props
    </Heading>
    <ul>
      <li>The props most buttons set.</li>
      <li>
        All props of all parts are on the{' '}
        <a href={publicUrl('button/parts')}>Parts</a> page.
      </li>
    </ul>
    <KeyPropsTable
      parts={[
        [
          'Button.Root',
          pickRows(
            buttonRootRows,
            'onClick',
            'variant',
            'size',
            'shape',
            'tint',
            'destructive',
            'fill',
            'disabled',
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
        A native <code>button</code> (Base UI’s): Tab focuses it, and Enter or
        Space presses it.
      </li>
      <li>
        A symbol on its own has no name. Give the button an{' '}
        <code>aria-label</code> (like the circle here, which has no label).
      </li>
      <li>
        When disabled, it leaves the tab order.{' '}
        <code>focusableWhenDisabled</code> keeps it in (for example while it’s
        busy), with <code>aria-disabled</code>.
      </li>
      <li>
        Its hit region is at least 44×44px, centered, however small it looks.
      </li>
      <li>
        Color alone doesn’t say it’s destructive, so name it by what it does
        (Delete, not OK).
      </li>
      <li>
        Its pressed lens (on glass) doesn’t follow{' '}
        <code>prefers-reduced-motion</code>.
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
        It hugs its content (a symbol, then a label, 4px apart, in the order
        given), centered. With <code>fill</code>, it’s as wide as its container.
      </li>
      <li>When it’s narrower than its content, its label truncates.</li>
      <li>
        When pressed, classic styles lay the tint at 15% over their fill (like
        Framework7’s). Glass styles turn into a lens: scaled up, with a tinted
        glow behind, and their content scaled less.
      </li>
      <li>
        Without an <code>onClick</code> (or <code>onSecondaryClick</code>), it
        shows as disabled, because a button that does nothing should look
        unavailable. A <code>submit</code> or <code>reset</code> button doesn’t.
      </li>
      <li>
        Borderless without a size, it takes its context’s text style (Body, in a
        list row).
      </li>
    </ul>
  </>
);

/** Its live views, also on the component's page of demos (and `/all`). */
export const buttonOverviewDemos = [LiveView];
