import { sfAirplane } from '@bradleyhodges/sfsymbols/sfAirplane';
import { sfBellFill } from '@bradleyhodges/sfsymbols/sfBellFill';
import { FunctionComponent, useEffect, useRef, useState } from 'react';

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
import {
  Contents,
  Heading,
  PartLink,
  type Section,
} from '../../tooling/guide/sections.js';

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

  return (
    <Component
      isInline
      id="switch-composition-delayed"
      log={log}
      stage="phone"
      title="Switch with delayed states"
    >
      <Viewport.Content safeArea="none">
        <Header.Root>
          <Viewport.BlockStart>
            <Toolbar.Root placement="block-start">
              <Toolbar.Title>
                <span>Settings</span>
              </Toolbar.Title>
            </Toolbar.Root>
          </Viewport.BlockStart>
          <Page.Root>
            <Viewport.Padding edge="block-start" />
            <List.Root>
              <List.Section>
                <List.Group>
                  {settings.map(([label, setting]) => {
                    const isSlow =
                      setting.stage === 'slow' || setting.stage === 'stalled';
                    const isStalled = setting.stage === 'stalled';
                    return (
                      <List.Item
                        key={label}
                        editing={isStalled ? 'trailing' : 'none'}
                        onClick={forwardClick('[role=switch]')}
                      >
                        <List.Content>
                          <List.Title>
                            {label}: {setting.value ? 'On' : 'Off'}
                          </List.Title>
                        </List.Content>
                        <List.Trailing>
                          <ActivityIndicator
                            aria-label="Applying"
                            display={isSlow ? 'animate' : 'none'}
                            movement="fade"
                            size="small"
                          />
                        </List.Trailing>
                        <List.Trailing whileEditing="hide">
                          <Switch.Root
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
                            <Switch.Thumb />
                          </Switch.Root>
                        </List.Trailing>
                        <List.Below hidden={!isStalled}>
                          <List.Subtitle>
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
            <Viewport.Padding edge="block-end" />
          </Page.Root>
        </Header.Root>
      </Viewport.Content>
    </Component>
  );
};

/** Settings rows, each toggled by its switch, or by the row. */
const InAList: FunctionComponent = () => {
  const [log, addLog] = useLog();

  return (
    <Component
      isCentered
      isInline
      id="switch-composition-list"
      log={log}
      title="Switch in a list"
    >
      <List.Root style={{ width: 'min(402px, 100%)' }}>
        <List.Section>
          <List.Group>
            <List.Item onClick={forwardClick('[role=switch]')}>
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
                  onCheckedChange={(isChecked: boolean) =>
                    addLog(`airplane mode: ${String(isChecked)}`)
                  }
                >
                  <Switch.Thumb />
                </Switch.Root>
              </List.Trailing>
            </List.Item>
            <List.Item onClick={forwardClick('[role=switch]')}>
              <List.Leading>
                <List.Image
                  style={{ backgroundColor: 'var(--color-ui-system-red)' }}
                  variant="rounded"
                >
                  <Symbol icon={sfBellFill} />
                </List.Image>
              </List.Leading>
              <List.Content>
                <List.Title>Notifications</List.Title>
              </List.Content>
              <List.Trailing>
                <Switch.Root
                  defaultChecked
                  aria-label="Notifications"
                  onCheckedChange={(isChecked: boolean) =>
                    addLog(`notifications: ${String(isChecked)}`)
                  }
                >
                  <Switch.Thumb />
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
        Typically: in the trailing slot of <a href="list">List</a> rows.
      </li>
      <li>
        The row passes its clicks on to the switch (
        <code>forwardClick(&apos;[role=switch]&apos;)</code> as its{' '}
        <code>onClick</code>): the whole row toggles it, as in Settings.
      </li>
      <li>
        <code>tint</code> can take the row image’s color (Airplane Mode).
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
        <strong>Demo:</strong> the settings and logging their changes.
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
        Settings that take a while to apply (e.g. on a device), how long not
        known: the switch shows what was asked for (<code>checked</code>), the
        row’s title what’s applied. Every row behaves the same, saying more the
        longer it waits.
      </li>
      <li>
        Asked: the switch indeterminate (<code>indeterminate</code>, its track
        half tinted while turning on) and read-only (<code>readOnly</code>): the
        hotspot (0.4s) gets no further.
      </li>
      <li>
        Past half a second: an{' '}
        <PartLink
          component="progress"
          part="ActivityIndicator"
        />{' '}
        fades in beside the switch, at its start (not sliding in: its{' '}
        <code>display</code>, <code>animate</code>; <code>movement</code>,{' '}
        <code>fade</code>, its spokes fading in place); applied, it finishes its
        turn, then fades out (<code>none</code>), taking no room: Bluetooth
        (1.5s).
      </li>
      <li>
        Past two seconds, not responding: the switch slides out at the row’s end
        (the row’s edit mode <code>trailing</code>, the switch’s{' '}
        <PartLink
          component="list"
          part="List.Trailing"
        />{' '}
        <code>whileEditing=&quot;hide&quot;</code>), the indicator moving on to
        the end, and a message under the row (
        <PartLink
          component="list"
          part="List.Below"
        />
        : across the row, as a field’s message; styled as a{' '}
        <PartLink
          component="list"
          part="List.Subtitle"
        />
        , the slot only placing it; growing in and out: its <code>hidden</code>
        ): AirDrop (8s).
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
        the stages (<code>useDelayedSetting</code>), the thresholds and the
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
        Renders a hidden checkbox input: in a <a href="form">Form</a>, submitted
        by its <code>name</code>, as a native checkbox.
      </li>
      <li>
        Value: <code>value</code> while on, <code>uncheckedValue</code> while
        off.
      </li>
    </ul>
  </>
);

/** Its live views, also on the component's page of demos (and `/all`). */
export const switchCompositionDemos = [InAList, DelayedStates];
