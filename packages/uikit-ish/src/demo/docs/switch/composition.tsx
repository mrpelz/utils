import { FunctionComponent, useEffect, useMemo, useRef, useState } from 'react';

import {
  ActivityIndicator,
  forwardClick,
  Header,
  List,
  Page,
  Switch,
  Symbol,
  Toolbar,
  Viewport,
} from '../../../components/index.js';
import { CodeView } from '../../tooling/frame/code-view.js';
import { Component } from '../../tooling/frame/component.js';
import { useLog } from '../../tooling/frame/log.js';
import { usePartControls } from '../../tooling/frame/prop-control.js';
import { useProvidedState } from '../../tooling/frame/state.js';
import {
  Contents,
  Heading,
  PartLink,
  type Section,
} from '../../tooling/guide/sections.js';
import { sfAirplane, sfBellFill } from '../../tooling/icons.js';
import { publicUrl } from '../../tooling/public-url.js';
import { partPropMaps } from '../part-options.js';

// A row's code (as Airplane Mode's in the list below).
/* eslint-disable unicorn/no-incorrect-template-string-interpolation -- JSX braces in a code sample, not interpolations */
const listRowCode = `<List.Item onClick={forwardClick('[role=switch]')}>
  <List.Leading>
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
  <List.Trailing>
    <Switch.Root
      aria-label="Airplane Mode"
      tint="var(--color-ui-system-orange)"
    >
      <Switch.Thumb />
    </Switch.Root>
  </List.Trailing>
</List.Item>`;

const delayedCode = `// A setting a device applies after a while, how long not known: the switch
// shows what was asked for at once; waiting longer, the row says so more.
const useDelayedSetting = (delay, initial = false) => {
  const [value, setValue] = useState(initial);
  const [target, setTarget] = useState(initial);
  // 'idle', 'pending', 'slow' (past 0.5s), 'stalled' (past 2s).
  const [stage, setStage] = useState('idle');
  const timers = useRef([]);
  const clear = () => timers.current.forEach(clearTimeout);
  useEffect(() => clear, []);

  const change = (next) => {
    clear();
    setTarget(next);
    if (delay === 0) {
      setValue(next);
      return;
    }
    setStage('pending');
    timers.current = [
      setTimeout(() => setStage('slow'), 500),
      setTimeout(() => setStage('stalled'), 2000),
      // (The device, done.)
      setTimeout(() => {
        clear();
        setValue(next);
        setStage('idle');
      }, delay),
    ];
  };

  return { change, isPending: target !== value, stage, target, value };
};

const airDrop = useDelayedSetting(8000);
const isSlow = airDrop.stage === 'slow' || airDrop.stage === 'stalled';
const isStalled = airDrop.stage === 'stalled';

// Stalled: the switch sliding out (its trailing slot hidden while the
// trailing side edits), the spinner on to the row's end.
<List.Item
  editing={isStalled ? 'trailing' : 'none'}
  onClick={forwardClick('[role=switch]')}
>
  <List.Content>
    <List.Title>AirDrop: {airDrop.value ? 'On' : 'Off'}</List.Title>
  </List.Content>
  <List.Trailing>
    {/* Slow: a spinner beside the switch, fading in (not sliding in);
        applied, finishing its turn, then fading out. */}
    <ActivityIndicator
      aria-label="Applying"
      display={isSlow ? 'animate' : 'none'}
      movement="fade"
      size="small"
    />
  </List.Trailing>
  <List.Trailing whileEditing="hide">
    {/* The requested state; indeterminate (and read-only) until applied. */}
    <Switch.Root
      aria-label="AirDrop"
      checked={airDrop.target}
      indeterminate={airDrop.isPending}
      readOnly={airDrop.isPending}
      onCheckedChange={airDrop.change}
    >
      <Switch.Thumb />
    </Switch.Root>
  </List.Trailing>
  {/* Stalled: a message under the row, growing in. */}
  <List.Below hidden={!isStalled}>
    <List.Subtitle>
      Request delivered successfully, waiting for device to respond.
    </List.Subtitle>
  </List.Below>
</List.Item>`;
/* eslint-enable unicorn/no-incorrect-template-string-interpolation */

/** How long a change has been waiting to apply. */
type Stage = 'idle' | 'pending' | 'slow' | 'stalled';

/**
 * A setting a device applies after `delay` ms (unknown to the app): the
 * switch shows what was asked for at once; waiting longer (past 0.5s, past
 * 2s), the row says so more.
 */
const useDelayedSetting = (delay: number, initial = false) => {
  const [value, setValue] = useState(initial);
  const [target, setTarget] = useState(initial);
  const [stage, setStage] = useState<Stage>('idle');
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  useEffect(
    () => () => {
      for (const timer of timers.current) clearTimeout(timer);
    },
    [],
  );

  const change = (next: boolean) => {
    for (const timer of timers.current) clearTimeout(timer);
    setTarget(next);
    if (delay === 0) {
      setValue(next);
      return;
    }
    setStage('pending');
    timers.current = [
      setTimeout(() => setStage('slow'), 500),
      setTimeout(() => setStage('stalled'), 2000),
      // (The device, done.)
      setTimeout(() => {
        for (const timer of timers.current) clearTimeout(timer);
        setValue(next);
        setStage('idle');
      }, delay),
    ];
  };

  return { change, isPending: target !== value, stage, target, value };
};

/**
 * Four settings applied after different, unknown waits: each row says so
 * the same way, as far as its wait gets.
 */
const DelayedStates: FunctionComponent = () => {
  const [log, addLog] = useLog();
  const settings = [
    ['Wi-Fi', useDelayedSetting(0, true)],
    ['Hotspot', useDelayedSetting(400)],
    ['Bluetooth', useDelayedSetting(1500)],
    ['AirDrop', useDelayedSetting(8000)],
  ] as const;

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            ActivityIndicator: ['aria-label', 'display', 'movement', 'size'],
            'List.Below': ['hidden'],
            'List.Content': [],
            'List.Group': [],
            'List.Item': ['editing', 'onClick'],
            'List.Root': [],
            'List.Section': [],
            'List.Subtitle': [],
            'List.Title': [],
            'List.Trailing': ['whileEditing'],
            'Page.Root': [],
            'Switch.Root': [
              'aria-label',
              'checked',
              'indeterminate',
              'onCheckedChange',
              'readOnly',
            ],
            'Switch.Thumb': [],
            'Toolbar.Root': ['placement'],
            'Toolbar.Title': [],
            'Viewport.BlockStart': [],
            'Viewport.Content': [],
            'Viewport.Padding': ['edge'],
          },
          addLog,
        ),
      [addLog],
    ),
    { provided: useProvidedState('switch-composition-delayed') },
  );

  return (
    <Component
      isInline
      controls={[partControls]}
      id="switch-composition-delayed"
      log={log}
      stage="phone"
      state={[partState]}
      title="Switch with delayed states"
    >
      <Viewport.Content {...partProps['Viewport.Content']}>
        <Header.Root>
          <Viewport.BlockStart {...partProps['Viewport.BlockStart']}>
            <Toolbar.Root
              {...partProps['Toolbar.Root']}
              placement="block-start"
            >
              <Toolbar.Title {...partProps['Toolbar.Title']}>
                <span>Settings</span>
              </Toolbar.Title>
            </Toolbar.Root>
          </Viewport.BlockStart>
          <Page.Root {...partProps['Page.Root']}>
            <Viewport.Padding
              {...partProps['Viewport.Padding']}
              edge="block-start"
            />
            <List.Root {...partProps['List.Root']}>
              <List.Section {...partProps['List.Section']}>
                <List.Group {...partProps['List.Group']}>
                  {settings.map(([label, setting]) => {
                    const isSlow =
                      setting.stage === 'slow' || setting.stage === 'stalled';
                    const isStalled = setting.stage === 'stalled';
                    return (
                      <List.Item
                        key={label}
                        {...partProps['List.Item']}
                        editing={isStalled ? 'trailing' : 'none'}
                        onClick={forwardClick('[role=switch]')}
                      >
                        <List.Content {...partProps['List.Content']}>
                          <List.Title {...partProps['List.Title']}>
                            {label}: {setting.value ? 'On' : 'Off'}
                          </List.Title>
                        </List.Content>
                        <List.Trailing {...partProps['List.Trailing']}>
                          <ActivityIndicator
                            {...partProps.ActivityIndicator}
                            aria-label="Applying"
                            display={isSlow ? 'animate' : 'none'}
                            movement="fade"
                            size="small"
                          />
                        </List.Trailing>
                        <List.Trailing
                          {...partProps['List.Trailing']}
                          whileEditing="hide"
                        >
                          <Switch.Root
                            {...partProps['Switch.Root']}
                            aria-label={label}
                            checked={setting.target}
                            indeterminate={setting.isPending}
                            readOnly={setting.isPending}
                            onCheckedChange={(isChecked: boolean) => {
                              addLog(
                                `${label}: ${isChecked ? 'on' : 'off'} requested`,
                              );
                              setting.change(isChecked);
                            }}
                          >
                            <Switch.Thumb {...partProps['Switch.Thumb']} />
                          </Switch.Root>
                        </List.Trailing>
                        <List.Below
                          {...partProps['List.Below']}
                          hidden={!isStalled}
                        >
                          <List.Subtitle {...partProps['List.Subtitle']}>
                            Request delivered successfully, waiting for device
                            to respond.
                          </List.Subtitle>
                        </List.Below>
                      </List.Item>
                    );
                  })}
                </List.Group>
              </List.Section>
            </List.Root>
            <Viewport.Padding
              {...partProps['Viewport.Padding']}
              edge="block-end"
            />
          </Page.Root>
        </Header.Root>
      </Viewport.Content>
    </Component>
  );
};

/** Settings rows, each toggled by its switch, or by the row. */
const InAList: FunctionComponent = () => {
  const [log, addLog] = useLog();

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            Symbol: ['icon'],
            'List.Content': [],
            'List.Group': [],
            'List.Image': ['style', 'variant'],
            'List.Item': ['onClick'],
            'List.Leading': [],
            'List.Root': ['style'],
            'List.Section': [],
            'List.Title': [],
            'List.Trailing': [],
            'Switch.Root': [
              'aria-label',
              'defaultChecked',
              'onCheckedChange',
              'tint',
            ],
            'Switch.Thumb': [],
          },
          addLog,
        ),
      [addLog],
    ),
    { provided: useProvidedState('switch-composition-list') },
  );

  return (
    <Component
      isCentered
      isInline
      controls={[partControls]}
      id="switch-composition-list"
      log={log}
      state={[partState]}
      title="Switch in a list"
    >
      <List.Root
        {...partProps['List.Root']}
        style={{ width: 'min(402px, 100%)' }}
      >
        <List.Section {...partProps['List.Section']}>
          <List.Group {...partProps['List.Group']}>
            <List.Item
              {...partProps['List.Item']}
              onClick={forwardClick('[role=switch]')}
            >
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
              <List.Trailing {...partProps['List.Trailing']}>
                <Switch.Root
                  {...partProps['Switch.Root']}
                  aria-label="Airplane Mode"
                  tint="var(--color-ui-system-orange)"
                  onCheckedChange={(isChecked: boolean) =>
                    addLog(`airplane mode: ${String(isChecked)}`)
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
              <List.Leading {...partProps['List.Leading']}>
                <List.Image
                  {...partProps['List.Image']}
                  style={{ backgroundColor: 'var(--color-ui-system-red)' }}
                  variant="rounded"
                >
                  <Symbol
                    {...partProps.Symbol}
                    icon={sfBellFill}
                  />
                </List.Image>
              </List.Leading>
              <List.Content {...partProps['List.Content']}>
                <List.Title {...partProps['List.Title']}>
                  Notifications
                </List.Title>
              </List.Content>
              <List.Trailing {...partProps['List.Trailing']}>
                <Switch.Root
                  {...partProps['Switch.Root']}
                  defaultChecked
                  aria-label="Notifications"
                  onCheckedChange={(isChecked: boolean) =>
                    addLog(`notifications: ${String(isChecked)}`)
                  }
                >
                  <Switch.Thumb {...partProps['Switch.Thumb']} />
                </Switch.Root>
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
  ['in-list-rows', 'In list rows'],
  ['delayed-states', 'Delayed states'],
  ['in-forms', 'In forms'],
];

/** `/switch/composition`: switches with other components. */
export const SwitchComposition: FunctionComponent = () => (
  <>
    <Contents sections={sections} />
    <Heading
      id="in-list-rows"
      level={2}
    >
      In list rows
    </Heading>
    <ul>
      <li>
        Usually, it sits in the trailing slot of{' '}
        <a href={publicUrl('list')}>List</a> rows.
      </li>
      <li>
        The row passes its clicks on to the switch (with{' '}
        <code>forwardClick(&apos;[role=switch]&apos;)</code> as its{' '}
        <code>onClick</code>), so the whole row toggles it, as in a settings
        app.
      </li>
      <li>
        <code>tint</code> can match the color of the row’s image (Airplane
        Mode).
      </li>
      <li>
        <strong>Library:</strong> the switch (
        <PartLink
          component="switch"
          part="Switch.Root"
        />
        ) in the row’s trailing slot, <code>forwardClick</code>, and{' '}
        <code>tint</code>.
      </li>
      <li>
        <strong>Demo:</strong> the settings, and logging their changes.
      </li>
    </ul>
    <CodeView code={listRowCode} />
    <InAList />

    <Heading
      id="delayed-states"
      level={2}
    >
      Delayed states
    </Heading>
    <ul>
      <li>
        Some settings take a while to apply (for example on a device), and how
        long isn’t known. The switch shows what was asked for (
        <code>checked</code>), and the row’s title shows what’s applied. Every
        row behaves the same, saying more the longer it waits.
      </li>
      <li>
        Once asked, the switch is indeterminate (<code>indeterminate</code>,
        with its track half tinted while turning on) and read-only (
        <code>readOnly</code>). The hotspot (0.4s) gets no further than that.
      </li>
      <li>
        Past half a second, an{' '}
        <PartLink
          component="progress"
          part="ActivityIndicator"
        />{' '}
        fades in next to the switch, at its start. It doesn’t slide in: its{' '}
        <code>display</code> is <code>animate</code>, and its{' '}
        <code>movement</code> is <code>fade</code>, so its spokes fade in place.
        Once the setting is applied, it finishes its turn, then fades out (
        <code>none</code>) and takes no room. That’s Bluetooth (1.5s).
      </li>
      <li>
        Past two seconds without a response, the switch slides out at the row’s
        end (the row’s edit mode is <code>trailing</code>, and the switch’s{' '}
        <PartLink
          component="list"
          part="List.Trailing"
        />{' '}
        has <code>whileEditing=&quot;hide&quot;</code>). The indicator moves on
        to the end, and a message shows under the row in a{' '}
        <PartLink
          component="list"
          part="List.Below"
        />
        , across the row like a field’s message. It’s styled as a{' '}
        <PartLink
          component="list"
          part="List.Subtitle"
        />{' '}
        (the slot only places it), and grows in and out through its{' '}
        <code>hidden</code>. That’s AirDrop (8s).
      </li>
      <li>
        <strong>Library:</strong> the switch’s <code>indeterminate</code> and{' '}
        <code>readOnly</code> states (
        <PartLink
          component="switch"
          part="Switch.Root"
        />
        ), the indicator’s <code>display</code> (
        <PartLink
          component="progress"
          part="ActivityIndicator"
        />
        ), and the row’s edit mode sliding the switch out (
        <PartLink
          component="list"
          part="List.Item"
        />{' '}
        <code>editing</code>, <code>whileEditing</code>).
      </li>
      <li>
        <strong>Demo:</strong> the delays, the requested and applied states and
        the stages (<code>useDelayedSetting</code>), the thresholds, and the
        titles.
      </li>
    </ul>
    <CodeView code={delayedCode} />
    <DelayedStates />

    <Heading
      id="in-forms"
      level={2}
    >
      In forms
    </Heading>
    <ul>
      <li>
        It renders a hidden checkbox input, so in a{' '}
        <a href={publicUrl('form')}>Form</a>, it submits under its{' '}
        <code>name</code>, like a native checkbox.
      </li>
      <li>
        Its value is <code>value</code> while on, and{' '}
        <code>uncheckedValue</code> while off.
      </li>
    </ul>
  </>
);

/** Its live views, also on the component's page of demos (and `/all`). */
export const switchCompositionDemos = [InAList, DelayedStates];
