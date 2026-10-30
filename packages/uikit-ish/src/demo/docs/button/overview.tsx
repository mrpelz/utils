import { FunctionComponent } from 'react';

import { Button, Symbol } from '../../../components/index.js';
import { Component } from '../../tooling/frame/component.js';
import { useLog } from '../../tooling/frame/log.js';
import { usePropControl } from '../../tooling/frame/prop-control.js';
import { useProvidedState } from '../../tooling/frame/state.js';
import { KeyPropsTable, pickRows } from '../../tooling/guide/props-table.js';
import {
  Contents,
  Heading,
  type Section,
} from '../../tooling/guide/sections.js';
import { sfHeartFill } from '../../tooling/icons.js';
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

  return (
    <Component
      isCentered
      isInline
      controls={[controlContent, controlRoot]}
      id={id}
      log={log}
      state={[stateContent, stateRoot]}
      title="Button"
    >
      <Button.Root
        key={elementKey}
        aria-label={content.label ? undefined : 'Like'}
        {...props}
        onClick={() => addLog('Like clicked')}
      >
        {content.symbol ? (
          <Button.Icon>
            <Symbol icon={sfHeartFill} />
          </Button.Icon>
        ) : null}
        {content.label ? <Button.Label>Like</Button.Label> : null}
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
        Performs an action at once (Base UI’s <code>Button</code>): a label, a
        symbol, or both.
      </li>
      <li>
        Its prominence by its style: a label alone, on a fill, on the tint; or
        Glass, floating over content.
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
        An action in the page: Continue, Add to Library, Sign In (the most
        likely one prominent, one per view).
      </li>
      <li>
        A control of its own over content (glass): a player’s, a map’s (see{' '}
        <a href="button/composition">Composition</a>).
      </li>
      <li>
        In other components: a <a href="toolbar">Toolbar</a>’s buttons, a{' '}
        <a href="list">List</a> row’s trailing one, a trigger’s{' '}
        <code>render</code> (a <a href="sheet">Sheet</a>’s, an{' '}
        <a href="alert">Alert</a>’s).
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
        Going somewhere (a page of the app’s): a <a href="list">List</a> row
        drilling in, or a link.
      </li>
      <li>
        A setting on or off: a <a href="switch">Switch</a>; one of a few
        options: a <a href="segmented">Segmented</a> control.
      </li>
      <li>
        Several actions behind one: a <a href="menu">Menu</a> (its trigger a
        button).
      </li>
      <li>
        A bar’s actions: a <a href="toolbar">Toolbar</a>’s buttons (its
        capsules, its keyboard).
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
        All parts’ props: <a href="button/parts">Parts</a>.
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
        A native <code>button</code> (Base UI’s): Tab focuses it, Enter or Space
        presses it.
      </li>
      <li>
        A symbol alone has no name: give it an <code>aria-label</code> (as the
        circle here, without its label).
      </li>
      <li>
        Disabled, it’s out of the tab order; <code>focusableWhenDisabled</code>{' '}
        keeps it in (e.g. while it’s busy), with <code>aria-disabled</code>.
      </li>
      <li>
        A hit region of at least 44×44px, centered, however small it looks
        (HIG).
      </li>
      <li>
        Destructive isn’t told by color alone: name it by what it does (Delete,
        not OK).
      </li>
      <li>
        Its pressed lens (glass) doesn’t follow{' '}
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
        Hugging its content (a symbol, then a label, 4px apart; in the order
        given), centered; <code>fill</code>, as wide as its container.
      </li>
      <li>
        Its label truncated with an ellipsis when narrower than its content.
      </li>
      <li>
        Pressed: classic styles the tint at 15% over its fill (Framework7’s);
        glass ones a lens (scaled up, a tinted glow behind, its content scaled
        less).
      </li>
      <li>
        Without an <code>onClick</code> (or <code>onSecondaryClick</code>), it
        shows as disabled: a button that does nothing looks unavailable; a{' '}
        <code>submit</code> or <code>reset</code> button doesn’t.
      </li>
      <li>
        Borderless without a size: in its context’s text style (a list row’s:
        Body).
      </li>
    </ul>
  </>
);

/** Its live views, also on the component's page of demos (and `/all`). */
export const buttonOverviewDemos = [LiveView];
