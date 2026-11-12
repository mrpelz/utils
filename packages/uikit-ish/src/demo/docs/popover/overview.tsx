import './style.css';

import { FunctionComponent, useMemo } from 'react';

import {
  Button,
  forwardClick,
  List,
  Popover,
  Switch,
  Symbol,
  Toolbar,
  Viewport,
} from '../../../components/index.js';
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
import { sfXmark } from '../../tooling/icons.js';
import { publicUrl } from '../../tooling/public-url.js';
import { partPropMaps } from '../part-options.js';
import {
  popoverPositionerRows,
  popoverRootRows,
  popoverTriggerRows,
} from './docs.js';
import {
  getPropOptionsOverviewRoot,
  propOptionsContent,
  propOptionsOverviewPositioner,
} from './props.js';

/** A button's popover: its bar (title, close), its settings, a note. */
const LiveView: FunctionComponent = () => {
  const id = 'popover-overview';
  const [log, addLog] = useLog();
  const [externalContent, externalRoot, externalPositioner] =
    useProvidedState(id);
  const [controlContent, content, stateContent] = usePropControl(
    propOptionsContent,
    { external: externalContent, isOpen: true, title: '[content]' },
  );
  const [controlRoot, propsRoot, stateRoot, keyRoot] = usePropControl(
    useMemo(() => getPropOptionsOverviewRoot(addLog), [addLog]),
    { external: externalRoot, title: 'Popover.Root' },
  );
  const [controlPositioner, propsPositioner, statePositioner] = usePropControl(
    propOptionsOverviewPositioner,
    { external: externalPositioner, title: 'Popover.Positioner' },
  );

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            Symbol: ['icon'],
            'Button.Icon': [],
            'Button.Label': [],
            'Button.Root': ['size', 'variant'],
            'List.Content': [],
            'List.Footer': [],
            'List.Group': [],
            'List.Item': ['onClick'],
            'List.Root': [],
            'List.Section': [],
            'List.Title': [],
            'List.Trailing': [],
            'Popover.Arrow': [],
            'Popover.Body': [],
            'Popover.Close': ['render'],
            'Popover.Description': [],
            'Popover.Header': [],
            'Popover.Popup': ['className'],
            'Popover.Portal': [],
            'Popover.Title': ['render'],
            'Popover.Trigger': ['render'],
            'Switch.Root': ['aria-label', 'defaultChecked', 'onCheckedChange'],
            'Switch.Thumb': [],
            'Toolbar.Button': ['aria-label', 'shape'],
            'Toolbar.Root': ['placement'],
            'Toolbar.Title': [],
            'Toolbar.Trailing': [],
            'Viewport.Padding': ['edge'],
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
      baseUiId="popover"
      controls={[controlContent, controlRoot, controlPositioner, partControls]}
      id={id}
      log={log}
      state={[stateContent, stateRoot, statePositioner, partState]}
      title="Popover"
    >
      <Popover.Root
        key={keyRoot}
        {...propsRoot}
      >
        <Popover.Trigger
          {...partProps['Popover.Trigger']}
          render={
            <Button.Root
              {...partProps['Button.Root']}
              size="large"
              variant="bordered"
            />
          }
        >
          <Button.Label {...partProps['Button.Label']}>
            Display Options
          </Button.Label>
        </Popover.Trigger>
        <Popover.Portal {...partProps['Popover.Portal']}>
          <Popover.Positioner {...propsPositioner}>
            <Popover.Popup
              {...partProps['Popover.Popup']}
              className="popover-demo-popup"
            >
              {content.arrow ? (
                <Popover.Arrow {...partProps['Popover.Arrow']} />
              ) : null}
              <Popover.Header {...partProps['Popover.Header']}>
                <Toolbar.Root
                  {...partProps['Toolbar.Root']}
                  placement="block-start"
                >
                  <Toolbar.Title {...partProps['Toolbar.Title']}>
                    <Popover.Title
                      {...partProps['Popover.Title']}
                      render={<span />}
                    >
                      Display
                    </Popover.Title>
                  </Toolbar.Title>
                  <Toolbar.Trailing {...partProps['Toolbar.Trailing']}>
                    <Popover.Close
                      {...partProps['Popover.Close']}
                      render={
                        <Toolbar.Button
                          {...partProps['Toolbar.Button']}
                          aria-label="Close"
                          shape="circle"
                        />
                      }
                    >
                      <Button.Icon {...partProps['Button.Icon']}>
                        <Symbol
                          {...partProps.Symbol}
                          icon={sfXmark}
                        />
                      </Button.Icon>
                    </Popover.Close>
                  </Toolbar.Trailing>
                </Toolbar.Root>
              </Popover.Header>
              <Popover.Body {...partProps['Popover.Body']}>
                <Viewport.Padding
                  {...partProps['Viewport.Padding']}
                  edge="block-start"
                />
                <List.Root {...partProps['List.Root']}>
                  <List.Section {...partProps['List.Section']}>
                    <List.Group {...partProps['List.Group']}>
                      <List.Item
                        {...partProps['List.Item']}
                        onClick={forwardClick('[role=switch]')}
                      >
                        <List.Content {...partProps['List.Content']}>
                          <List.Title {...partProps['List.Title']}>
                            Show Completed
                          </List.Title>
                        </List.Content>
                        <List.Trailing {...partProps['List.Trailing']}>
                          <Switch.Root
                            {...partProps['Switch.Root']}
                            aria-label="Show completed"
                            onCheckedChange={(isChecked: boolean) =>
                              addLog(`show completed: ${String(isChecked)}`)
                            }
                          >
                            <Switch.Thumb {...partProps['Switch.Thumb']} />
                          </Switch.Root>
                        </List.Trailing>
                      </List.Item>
                      <List.Item
                        {...partProps['List.Item']}
                        onClick={forwardClick('[role=switch]')}
                      >
                        <List.Content {...partProps['List.Content']}>
                          <List.Title {...partProps['List.Title']}>
                            Show Notes
                          </List.Title>
                        </List.Content>
                        <List.Trailing {...partProps['List.Trailing']}>
                          <Switch.Root
                            {...partProps['Switch.Root']}
                            defaultChecked
                            aria-label="Show notes"
                            onCheckedChange={(isChecked: boolean) =>
                              addLog(`show notes: ${String(isChecked)}`)
                            }
                          >
                            <Switch.Thumb {...partProps['Switch.Thumb']} />
                          </Switch.Root>
                        </List.Trailing>
                      </List.Item>
                    </List.Group>
                    <List.Footer {...partProps['List.Footer']}>
                      <Popover.Description
                        {...partProps['Popover.Description']}
                      >
                        For this list only.
                      </Popover.Description>
                    </List.Footer>
                  </List.Section>
                </List.Root>
              </Popover.Body>
            </Popover.Popup>
          </Popover.Positioner>
        </Popover.Portal>
      </Popover.Root>
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

/** `/popover`: what a popover is for, and its props. */
export const PopoverOverview: FunctionComponent = () => (
  <>
    <Contents sections={sections} />
    <ul className="demo-lead">
      <li>
        A transient view above the page, at the control that shows it, with its
        arrow pointing at that control.
      </li>
      <li>
        It’s for regular widths. On a compact width, the same content usually
        goes in a <a href={publicUrl('sheet')}>Sheet</a> (see{' '}
        <a href={publicUrl('popover/composition#a-sheet-in-a-compact-width')}>
          A sheet in a compact width
        </a>
        ).
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
        For a small task or a few settings about what the control acts on
        (display options, a color, a date), done without leaving the page.
      </li>
      <li>
        Its content can be anything: a <a href={publicUrl('list')}>List</a>, a{' '}
        <a href={publicUrl('roll')}>Roll</a>, a{' '}
        <a href={publicUrl('date-picker')}>Date Picker</a>’s calendar, or a{' '}
        <a href={publicUrl('color-picker')}>Color Picker</a>.
      </li>
      <li>
        It’s anchored to its control, and a press outside it dismisses it.
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
        A list of commands or choices: use a{' '}
        <a href={publicUrl('menu')}>Menu</a>. Those belong in menus, not
        popovers.
      </li>
      <li>
        A focused task that must be finished or canceled (a new item, a form):
        use a <a href={publicUrl('sheet')}>Sheet</a>.
      </li>
      <li>
        A decision the app needs now: use an{' '}
        <a href={publicUrl('alert')}>Alert</a> or an{' '}
        <a href={publicUrl('action-sheet')}>Action Sheet</a>.
      </li>
      <li>
        A short hint about a control: use a{' '}
        <a href={publicUrl('tooltip')}>Tooltip</a>.
      </li>
    </ul>

    <Heading
      id="key-props"
      level={2}
    >
      Key props
    </Heading>
    <ul>
      <li>The props most popovers set.</li>
      <li>
        All props of all parts are on the{' '}
        <a href={publicUrl('popover/parts')}>Parts</a> page.
      </li>
    </ul>
    <KeyPropsTable
      parts={[
        [
          'Popover.Root',
          pickRows(
            popoverRootRows,
            'open',
            'defaultOpen',
            'onOpenChange',
            'modal',
            'handle',
          ),
        ],
        ['Popover.Trigger', pickRows(popoverTriggerRows, 'render')],
        [
          'Popover.Positioner',
          pickRows(popoverPositionerRows, 'side', 'align'),
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
        The popup is a <code>dialog</code>, named by its{' '}
        <PartLink
          component="popover"
          part="Popover.Title"
        />{' '}
        and described by its{' '}
        <PartLink
          component="popover"
          part="Popover.Description"
        />
        . Without a title, name it with <code>aria-label</code>.
      </li>
      <li>
        The trigger has <code>aria-expanded</code> and{' '}
        <code>aria-haspopup</code>. Opening moves focus into the popup (by
        touch, onto the popup itself, so the keyboard doesn’t open), and closing
        moves it back to the trigger.
      </li>
      <li>
        Escape closes it. With <code>modal</code>, focus is trapped inside, so
        render a{' '}
        <PartLink
          component="popover"
          part="Popover.Close"
        />{' '}
        in it, which lets touch screen readers leave it.
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
        By default, it sits below its trigger (<code>side</code>), centered on
        it (<code>align</code>). In a <a href={publicUrl('list')}>List</a> row,
        align it with the row’s end (<code>align=&quot;end&quot;</code>).
        Without room, it goes to the other side. It keeps 8px from the screen’s
        edges.
      </li>
      <li>
        Its arrow points at its trigger from whichever side the popup ends up
        on, and the popup moves out by the arrow’s depth.
      </li>
      <li>
        When it’s taller than the room it has, its{' '}
        <PartLink
          component="popover"
          part="Popover.Body"
        />{' '}
        scrolls, while its bar stays.
      </li>
      <li>
        A press outside closes it. For a modal one, outside presses are blocked,
        and close it too.
      </li>
      <li>
        When a text field inside it is typed into, it’s lifted as a whole, clear
        of the keyboard and 8px above it (like a{' '}
        <PartLink
          component="viewport"
          part="Viewport.KeyboardAccessory"
        />
        ). It goes back as the keyboard hides.
      </li>
    </ul>
  </>
);

/** Its live views, also on the component's page of demos (and `/all`). */
export const popoverOverviewDemos = [LiveView];
