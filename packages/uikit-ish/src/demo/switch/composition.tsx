import { sfAirplane } from '@bradleyhodges/sfsymbols/sfAirplane';
import { sfBellFill } from '@bradleyhodges/sfsymbols/sfBellFill';
import { FunctionComponent } from 'react';

import { forwardClick, List, Switch, Symbol } from '../../components/index.js';
import { CodeView } from '../utils/code-view.js';
import { useLog } from '../utils/log.js';
import { Component } from '../utils/main.js';
import { Contents, type Section } from '../utils/sections.js';

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
/* eslint-enable unicorn/no-incorrect-template-string-interpolation */

/** Settings rows, each toggled by its switch, or by the row. */
const InAList: FunctionComponent = () => {
  const [log, addLog] = useLog();

  return (
    <Component
      center
      inline
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
                onCheckedChange={(checked: boolean) =>
                  addLog(`airplane mode: ${String(checked)}`)
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
                onCheckedChange={(checked: boolean) =>
                  addLog(`notifications: ${String(checked)}`)
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
  ['in-forms', 'In forms'],
];

/** `/switch/composition`: switches with other components. */
export const SwitchComposition: FunctionComponent = () => (
  <>
    <Contents sections={sections} />
    <h2 id="in-list-rows">In list rows</h2>
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
    </ul>
    <CodeView code={listRowCode} />
    <InAList />

    <h2 id="in-forms">In forms</h2>
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
