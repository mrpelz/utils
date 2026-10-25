import './style.css';

import { sfSquareAndArrowUp } from '@bradleyhodges/sfsymbols/sfSquareAndArrowUp';
import { FunctionComponent, useMemo } from 'react';

import { Button, Symbol, Tooltip } from '../../../components/index.js';
import { Component } from '../../tooling/frame/component.js';
import { useLog } from '../../tooling/frame/log.js';
import { usePropControl } from '../../tooling/frame/prop-control.js';
import { useProvidedState } from '../../tooling/frame/state.js';
import { KeyPropsTable, pickRows } from '../../tooling/guide/props-table.js';
import {
  Contents,
  Heading,
  PartLink,
  type Section,
} from '../../tooling/guide/sections.js';
import {
  tooltipPositionerRows,
  tooltipProviderRows,
  tooltipRootRows,
  tooltipTriggerRows,
} from './docs.js';
import {
  getPropOptionsRoot,
  propOptionsContent,
  propOptionsOverviewPositioner,
} from './props.js';

/** A share button's label, on hover and keyboard focus. */
const LiveView: FunctionComponent = () => {
  const id = 'tooltip-overview';
  const [log, addLog] = useLog();
  const [externalContent, externalRoot, externalPositioner] =
    useProvidedState(id);
  const [controlContent, content, stateContent] = usePropControl(
    propOptionsContent,
    { external: externalContent, isOpen: true, title: '[content]' },
  );
  const [controlRoot, propsRoot, stateRoot, keyRoot] = usePropControl(
    useMemo(() => getPropOptionsRoot(addLog), [addLog]),
    { external: externalRoot, title: 'Tooltip.Root' },
  );
  const [controlPositioner, propsPositioner, statePositioner] = usePropControl(
    propOptionsOverviewPositioner,
    { external: externalPositioner, title: 'Tooltip.Positioner' },
  );

  return (
    <Component
      isCentered
      isInline
      baseUiId="tooltip"
      controls={[controlContent, controlRoot, controlPositioner]}
      id={id}
      log={log}
      state={[stateContent, stateRoot, statePositioner]}
      title="Tooltip"
    >
      <div className="tooltip-demo-buttons">
        <Tooltip.Root
          key={keyRoot}
          {...propsRoot}
        >
          <Tooltip.Trigger
            aria-label="Share"
            render={
              <Button.Root
                shape="circle"
                size="large"
                variant="glass"
                onClick={() => addLog('share clicked')}
              />
            }
          >
            <Button.Icon>
              <Symbol icon={sfSquareAndArrowUp} />
            </Button.Icon>
          </Tooltip.Trigger>
          <Tooltip.Portal>
            <Tooltip.Positioner {...propsPositioner}>
              <Tooltip.Popup>{content.text}</Tooltip.Popup>
            </Tooltip.Positioner>
          </Tooltip.Portal>
        </Tooltip.Root>
      </div>
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

/** `/tooltip`: what a tooltip is for, and its props. */
export const TooltipOverview: FunctionComponent = () => (
  <>
    <Contents sections={sections} />
    <ul className="demo-lead">
      <li>
        A short label at a control, on hover and keyboard focus (Base UI’s{' '}
        <code>Tooltip</code>; iOS has none: iPadOS’s pointer, macOS’s help
        tags).
      </li>
      <li>
        In iOS 26’s language: a capsule of the menus’ glass, above its control.
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
        Naming a symbol-only button for a pointer (Share, Delete): what its
        accessible name says, shown.
      </li>
      <li>
        Held open, labeling something for good, on touch too (a value at a
        slider’s thumb: see <a href="slider">Slider</a>,{' '}
        <a href="progress">Progress</a>).
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
        Anything needed on touch (no hover there): a label on the control, or a{' '}
        <a href="popover">Popover</a> it opens.
      </li>
      <li>
        Anything to press or select: a <a href="popover">Popover</a> or a{' '}
        <a href="menu">Menu</a> (a tooltip can’t be hovered or pressed).
      </li>
    </ul>

    <Heading
      id="key-props"
      level={2}
    >
      Key props
    </Heading>
    <ul>
      <li>The props most tooltips set.</li>
      <li>
        All parts’ props: <a href="tooltip/parts">Parts</a>.
      </li>
    </ul>
    <KeyPropsTable
      parts={[
        ['Tooltip.Provider', pickRows(tooltipProviderRows, 'delay')],
        ['Tooltip.Root', pickRows(tooltipRootRows, 'open', 'disabled')],
        ['Tooltip.Trigger', pickRows(tooltipTriggerRows, 'delay', 'render')],
        [
          'Tooltip.Positioner',
          pickRows(tooltipPositionerRows, 'side', 'anchor'),
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
        It isn’t the control’s name: give the control its own (
        <code>aria-label</code>); the tooltip shows it for a pointer.
      </li>
      <li>
        Shown on keyboard focus too; Escape hides it. Not on touch, so nothing
        only it says can be needed.
      </li>
      <li>
        Its scale-in doesn’t follow <code>prefers-reduced-motion</code>.
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
        After 300ms of hovering (Base UI: 600ms); in a{' '}
        <PartLink
          component="tooltip"
          part="Tooltip.Provider"
        />
        , its delay, and the next at once once one has shown.
      </li>
      <li>
        Above its control, 8px away (below if there’s no room), scaling in from
        it; one line 32px high, longer text wrapping past 320px.
      </li>
      <li>A click on its control hides it.</li>
    </ul>
  </>
);

/** Its live views, also on the component's page of demos (and `/all`). */
export const tooltipOverviewDemos = [LiveView];
