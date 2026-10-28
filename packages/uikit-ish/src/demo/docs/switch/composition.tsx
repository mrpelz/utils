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
  <List.Image
    style={{ backgroundColor: 'var(--color-ios-system-orange)' }}
    variant="rounded"
  >
    <Symbol icon={sfAirplane} />
  </List.Image>
  <List.Title>Airplane Mode</List.Title>
  <Switch.Root
    aria-label="Airplane Mode"
    tint="var(--color-ios-system-orange)"
  >
    <Switch.Thumb />
  </Switch.Root>
</List.Item>`;

const delayedCode = `// A setting applied after \`delay\` ms (e.g. by a device): its requested
// state at once, its applied one later; slow past a second.
const useDelayedSetting = (delay, initial = false) => {
  const [value, setValue] = useState(initial);
  const [target, setTarget] = useState(initial);
  const [isSlow, setIsSlow] = useState(false);
  const timers = useRef([]);
  const clear = () => timers.current.forEach(clearTimeout);
  useEffect(() => clear, []);

  const change = (next) => {
    clear();
    setTarget(next);
    setIsSlow(false);
    if (delay === 0) {
      setValue(next);
      return;
    }
    timers.current = [
      setTimeout(() => setIsSlow(true), 1000),
      setTimeout(() => {
        clear();
        setValue(next);
        setIsSlow(false);
      }, delay),
    ];
  };

  return { change, isPending: target !== value, isSlow, target, value };
};

const airDrop = useDelayedSetting(4000);

{/* While slow: a spinner sliding in from the row's end (its edit mode),
    the switch sliding out (data-while-editing: no list part). */}
<List.Item
  editing={airDrop.isSlow ? 'trailing' : 'none'}
  onClick={forwardClick('[role=switch]')}
>
  <List.Title>AirDrop: {airDrop.value ? 'On' : 'Off'}</List.Title>
  {/* The requested state; indeterminate until it's applied. */}
  <Switch.Root
    aria-label="AirDrop"
    checked={airDrop.target}
    data-while-editing="hide"
    indeterminate={airDrop.isPending}
    onCheckedChange={airDrop.change}
  >
    <Switch.Thumb />
  </Switch.Root>
  {/* Last: sliding in from the row's end, pushing the switch over. */}
  <List.Detail whileEditing="show">
    <ActivityIndicator aria-label="Applying" size="small" />
  </List.Detail>
</List.Item>`;
/* eslint-enable unicorn/no-incorrect-template-string-interpolation */

/**
 * A setting applied after `delay` ms (e.g. by a device): its requested
 * state at once, its applied one later; slow past a second.
 */
const useDelayedSetting = (delay: number, initial = false) => {
  const [value, setValue] = useState(initial);
  const [target, setTarget] = useState(initial);
  const [isSlow, setIsSlow] = useState(false);
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
    setIsSlow(false);
    if (delay === 0) {
      setValue(next);
      return;
    }
    timers.current = [
      setTimeout(() => setIsSlow(true), 1000),
      setTimeout(() => {
        for (const timer of timers.current) clearTimeout(timer);
        setValue(next);
        setIsSlow(false);
      }, delay),
    ];
  };

  return { change, isPending: target !== value, isSlow, target, value };
};

/** Three settings applied at once, shortly, or slowly. */
const DelayedStates: FunctionComponent = () => {
  const [log, addLog] = useLog();
  // Its label, its setting, and whether it hides its switch while slow.
  const settings = [
    ['Wi-Fi', useDelayedSetting(0, true), false],
    ['Hotspot', useDelayedSetting(600), false],
    ['Bluetooth', useDelayedSetting(2500), false],
    ['AirDrop', useDelayedSetting(4000), true],
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
                  {settings.map(([label, setting, isHidingSwitch]) => (
                    <List.Item
                      key={label}
                      editing={setting.isSlow ? 'trailing' : 'none'}
                      onClick={forwardClick('[role=switch]')}
                    >
                      <List.Title>
                        {label}: {setting.value ? 'On' : 'Off'}
                      </List.Title>
                      <Switch.Root
                        aria-label={label}
                        checked={setting.target}
                        data-while-editing={isHidingSwitch ? 'hide' : undefined}
                        indeterminate={setting.isPending}
                        onCheckedChange={(isChecked: boolean) => {
                          addLog(
                            `${label}: ${isChecked ? 'on' : 'off'} requested`,
                          );
                          setting.change(isChecked);
                        }}
                      >
                        <Switch.Thumb />
                      </Switch.Root>
                      <List.Detail whileEditing="show">
                        <ActivityIndicator
                          aria-label="Applying"
                          size="small"
                        />
                      </List.Detail>
                    </List.Item>
                  ))}
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
              <List.Image
                style={{ backgroundColor: 'var(--color-ios-system-orange)' }}
                variant="rounded"
              >
                <Symbol icon={sfAirplane} />
              </List.Image>
              <List.Title>Airplane Mode</List.Title>
              <Switch.Root
                aria-label="Airplane Mode"
                tint="var(--color-ios-system-orange)"
                onCheckedChange={(isChecked: boolean) =>
                  addLog(`airplane mode: ${String(isChecked)}`)
                }
              >
                <Switch.Thumb />
              </Switch.Root>
            </List.Item>
            <List.Item onClick={forwardClick('[role=switch]')}>
              <List.Image
                style={{ backgroundColor: 'var(--color-ios-system-red)' }}
                variant="rounded"
              >
                <Symbol icon={sfBellFill} />
              </List.Image>
              <List.Title>Notifications</List.Title>
              <Switch.Root
                defaultChecked
                aria-label="Notifications"
                onCheckedChange={(isChecked: boolean) =>
                  addLog(`notifications: ${String(isChecked)}`)
                }
              >
                <Switch.Thumb />
              </Switch.Root>
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
        On iOS: in the trailing slot of <a href="list">List</a> rows.
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
        Settings that take a while to apply (e.g. on a device): the switch shows
        what was asked for (<code>checked</code>), the row’s title what’s
        applied.
      </li>
      <li>
        Wi-Fi applies at once. The hotspot shortly (0.6s): meanwhile its switch
        is indeterminate (<code>indeterminate</code>), its knob in the middle,
        its track half tinted while turning on.
      </li>
      <li>
        Bluetooth slowly (2.5s): past a second, an{' '}
        <a href="progress">activity indicator</a> slides in from the row’s end,
        pushing the switch over (the row’s edit mode,{' '}
        <code>editing=&quot;trailing&quot;</code>, showing its{' '}
        <PartLink
          component="list"
          part="List.Detail"
        />{' '}
        <code>whileEditing=&quot;show&quot;</code>), and out again once applied.
      </li>
      <li>
        AirDrop extra slowly (4s): the same, the switch sliding out meanwhile (
        <code>data-while-editing=&quot;hide&quot;</code>: an element that isn’t
        a list part), the spinner in its place.
      </li>
      <li>
        <strong>Library:</strong> the switch’s <code>indeterminate</code> state
        (
        <PartLink
          component="switch"
          part="Switch.Root"
        />
        ), the row’s edit mode sliding its parts in and out (
        <PartLink
          component="list"
          part="List.Item"
        />{' '}
        <code>editing</code>, <code>whileEditing</code>) and the{' '}
        <a href="progress">ActivityIndicator</a>.
      </li>
      <li>
        <strong>Demo:</strong> the delays, the requested and applied states (
        <code>useDelayedSetting</code>), the one-second threshold and the
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
