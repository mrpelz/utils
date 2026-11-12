import './style.css';

import { FunctionComponent, useMemo } from 'react';

import { Button, Symbol, Tooltip } from '../../../components/index.js';
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
  PartLink,
  type Section,
} from '../../tooling/guide/sections.js';
import { sfSquareAndArrowUp } from '../../tooling/icons.js';
import { publicUrl } from '../../tooling/public-url.js';
import { partPropMaps } from '../part-options.js';
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

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            Symbol: ['icon'],
            'Button.Icon': [],
            'Button.Root': ['onClick', 'shape', 'size', 'variant'],
            'Tooltip.Popup': [],
            'Tooltip.Portal': [],
            'Tooltip.Trigger': ['aria-label', 'render'],
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
      baseUiId="tooltip"
      controls={[controlContent, controlRoot, controlPositioner, partControls]}
      id={id}
      log={log}
      state={[stateContent, stateRoot, statePositioner, partState]}
      title="Tooltip"
    >
      <div className="tooltip-demo-buttons">
        <Tooltip.Root
          key={keyRoot}
          {...propsRoot}
        >
          <Tooltip.Trigger
            {...partProps['Tooltip.Trigger']}
            aria-label="Share"
            render={
              <Button.Root
                {...partProps['Button.Root']}
                shape="circle"
                size="large"
                variant="glass"
                onClick={() => addLog('share clicked')}
              />
            }
          >
            <Button.Icon {...partProps['Button.Icon']}>
              <Symbol
                {...partProps.Symbol}
                icon={sfSquareAndArrowUp}
              />
            </Button.Icon>
          </Tooltip.Trigger>
          <Tooltip.Portal {...partProps['Tooltip.Portal']}>
            <Tooltip.Positioner {...propsPositioner}>
              <Tooltip.Popup {...partProps['Tooltip.Popup']}>
                {content.text}
              </Tooltip.Popup>
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
        A short label at a control, shown on hover and keyboard focus. It’s Base
        UI’s <code>Tooltip</code>, made for pointers and keyboards.
      </li>
      <li>A capsule of the menus’ glass, above its control.</li>
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
        For naming a symbol-only button for pointer users (Share, Delete): it
        shows what the button’s accessible name says.
      </li>
      <li>
        Held open, as a lasting label that works on touch too, such as a value
        at a slider’s thumb (see <a href={publicUrl('slider')}>Slider</a> and{' '}
        <a href={publicUrl('progress')}>Progress</a>).
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
        Anything people need on touch: put a label on the control, or use a{' '}
        <a href={publicUrl('popover')}>Popover</a> that it opens. There’s no
        hover on touch, and while a long press shows the tooltip, nobody finds
        that.
      </li>
      <li>
        Anything to press or select: use a{' '}
        <a href={publicUrl('popover')}>Popover</a> or a{' '}
        <a href={publicUrl('menu')}>Menu</a>, because a tooltip can’t be hovered
        or pressed.
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
        All props of all parts are on the{' '}
        <a href={publicUrl('tooltip/parts')}>Parts</a> page.
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
        It isn’t the control’s name. Give the control its own (
        <code>aria-label</code>); the tooltip shows it to pointer users.
      </li>
      <li>
        It also shows on keyboard focus, and Escape hides it. On touch, only a
        long press shows it, so nothing should depend on what only the tooltip
        says.
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
        It shows after 300ms of hovering (Base UI’s default is 600ms). In a{' '}
        <PartLink
          component="tooltip"
          part="Tooltip.Provider"
        />
        , the provider’s delay applies, and once one tooltip has shown, the next
        one shows at once.
      </li>
      <li>
        It sits above its control, 8px away (or below it, without room), and
        scales in from it. One line is 32px tall, and longer text wraps past
        320px.
      </li>
      <li>A click on its control hides it.</li>
    </ul>
  </>
);

/** Its live views, also on the component's page of demos (and `/all`). */
export const tooltipOverviewDemos = [LiveView];
