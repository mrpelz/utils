import '../sheet/style.css';

import { sfEyedropper } from '@bradleyhodges/sfsymbols/sfEyedropper';
import { sfXmark } from '@bradleyhodges/sfsymbols/sfXmark';
import { FunctionComponent, useState } from 'react';

import {
  Button,
  ColorPicker,
  type ColorPickerSavedColorsChangeEventDetails,
  List,
  Popover,
  Sheet,
  Symbol,
  Toolbar,
  useSizeClass,
  Viewport,
} from '../../../components/index.js';
import { Component } from '../../tooling/frame/component.js';
import { useLog } from '../../tooling/frame/log.js';
import { usePropControl } from '../../tooling/frame/prop-control.js';
import { useProvidedState } from '../../tooling/frame/state.js';
import {
  Contents,
  Heading,
  PartLink,
  type Section,
} from '../../tooling/guide/sections.js';
import { propOptionsPresentation } from './props.js';

/** The iPad pattern: a well opening the picker in a popover. */
const InAPopover: FunctionComponent = () => {
  const [log, addLog] = useLog();
  const [color, setColor] = useState('#AF52DE');

  return (
    <Component
      hasInputGuards
      isCentered
      isInline
      id="color-picker-composition-popover"
      log={log}
      title="Color picker in a popover"
    >
      <Popover.Root>
        <Popover.Trigger render={<ColorPicker.Well color={color} />} />
        <Popover.Portal>
          <Popover.Positioner>
            <Popover.Popup style={{ width: 'min(402px, 100vw)' }}>
              <Popover.Arrow />
              <ColorPicker.Root
                value={color}
                onValueChange={(next: string) => {
                  addLog(`color: ${next}`);
                  setColor(next);
                }}
              >
                <ColorPicker.Header>
                  <Toolbar.Root placement="block-start">
                    <Toolbar.Leading>
                      <ColorPicker.Eyedropper
                        render={<Toolbar.Button shape="circle" />}
                      >
                        <Button.Icon>
                          <Symbol icon={sfEyedropper} />
                        </Button.Icon>
                      </ColorPicker.Eyedropper>
                    </Toolbar.Leading>
                    <Toolbar.Title>
                      <span>Colors</span>
                    </Toolbar.Title>
                    <Toolbar.Trailing>
                      <Popover.Close
                        render={
                          <Toolbar.Button
                            aria-label="Close"
                            shape="circle"
                          />
                        }
                      >
                        <Button.Icon>
                          <Symbol icon={sfXmark} />
                        </Button.Icon>
                      </Popover.Close>
                    </Toolbar.Trailing>
                  </Toolbar.Root>
                </ColorPicker.Header>
                <ColorPicker.Panel />
              </ColorPicker.Root>
            </Popover.Popup>
          </Popover.Positioner>
        </Popover.Portal>
      </Popover.Root>
    </Component>
  );
};

/** The iPhone pattern: a well opening the picker in a sheet. */
const InASheet: FunctionComponent = () => {
  const [log, addLog] = useLog();
  const [color, setColor] = useState('#007AFF');

  return (
    <Component
      hasInputGuards
      isInline
      id="color-picker-composition-sheet"
      log={log}
      screen="centered"
      stage="phone"
      title="Color picker in a sheet"
    >
      <Viewport.Content>
        <Sheet.Root>
          <Sheet.Trigger render={<ColorPicker.Well color={color} />} />
          <Sheet.Popup
            compact
            detent="medium"
          >
            <Sheet.Header>
              <Sheet.Grabber />
              <Toolbar.Root placement="block-start">
                <Toolbar.Title>
                  <span>Colors</span>
                </Toolbar.Title>
                <Toolbar.Trailing>
                  <Sheet.Close
                    render={
                      <Toolbar.Button
                        aria-label="Close"
                        shape="circle"
                      />
                    }
                  >
                    <Button.Icon>
                      <Symbol icon={sfXmark} />
                    </Button.Icon>
                  </Sheet.Close>
                </Toolbar.Trailing>
              </Toolbar.Root>
            </Sheet.Header>
            <Sheet.Content>
              <ColorPicker.Root
                value={color}
                onValueChange={(next: string) => {
                  addLog(`color: ${next}`);
                  setColor(next);
                }}
              >
                <ColorPicker.Panel />
              </ColorPicker.Root>
              <Viewport.Padding edge="block-end" />
            </Sheet.Content>
          </Sheet.Popup>
        </Sheet.Root>
      </Viewport.Content>
    </Component>
  );
};

/**
 * A settings row: its color in a well at its end, opening the picker in a
 * popover (a regular width) or a sheet (a compact one; or as set).
 */
const InAListRow: FunctionComponent = () => {
  const id = 'color-picker-composition-list';
  const [log, addLog] = useLog();
  const sizeClass = useSizeClass();
  const [tint, setTint] = useState('#FF9500');
  const [external] = useProvidedState(id);
  const [control, content, state] = usePropControl(propOptionsPresentation, {
    external,
    isOpen: true,
    title: '[content]',
  });
  const isSheet =
    (content.presentation ??
      (sizeClass === 'compact' ? 'sheet' : 'popover')) === 'sheet';

  return (
    <Component
      hasInputGuards
      isCentered
      isInline
      controls={[control]}
      id={id}
      log={log}
      screen={isSheet ? 'centered' : undefined}
      stage={isSheet ? 'phone' : undefined}
      state={[state]}
      title="Color picker in a list row"
    >
      {isSheet ? (
        <Viewport.Content>
          <List.Root style={{ width: '100%' }}>
            <List.Section>
              <List.Group>
                <List.Item>
                  <List.Title>Tint</List.Title>
                  <Sheet.Root>
                    <Sheet.Trigger
                      render={
                        <ColorPicker.Well
                          aria-label="Tint"
                          color={tint}
                        />
                      }
                    />
                    <Sheet.Popup
                      compact
                      detent="medium"
                    >
                      <Sheet.Header>
                        <Sheet.Grabber />
                        <Toolbar.Root placement="block-start">
                          <Toolbar.Title>
                            <span>Tint</span>
                          </Toolbar.Title>
                        </Toolbar.Root>
                      </Sheet.Header>
                      <Sheet.Content>
                        <ColorPicker.Root
                          value={tint}
                          onValueChange={(next: string) => {
                            addLog(`tint: ${next}`);
                            setTint(next);
                          }}
                        >
                          <ColorPicker.Panel />
                        </ColorPicker.Root>
                        <Viewport.Padding edge="block-end" />
                      </Sheet.Content>
                    </Sheet.Popup>
                  </Sheet.Root>
                </List.Item>
              </List.Group>
            </List.Section>
          </List.Root>
        </Viewport.Content>
      ) : (
        <List.Root style={{ width: 'min(402px, 100%)' }}>
          <List.Section>
            <List.Group>
              <List.Item>
                <List.Title>Tint</List.Title>
                <Popover.Root>
                  <Popover.Trigger
                    render={
                      <ColorPicker.Well
                        aria-label="Tint"
                        color={tint}
                      />
                    }
                  />
                  <Popover.Portal>
                    <Popover.Positioner align="end">
                      <Popover.Popup style={{ width: 'min(402px, 100vw)' }}>
                        <ColorPicker.Root
                          value={tint}
                          onValueChange={(next: string) => {
                            addLog(`tint: ${next}`);
                            setTint(next);
                          }}
                        >
                          <ColorPicker.Panel />
                        </ColorPicker.Root>
                      </Popover.Popup>
                    </Popover.Positioner>
                  </Popover.Portal>
                </Popover.Root>
              </List.Item>
            </List.Group>
          </List.Section>
        </List.Root>
      )}
    </Component>
  );
};

/** Two pickers, their saved colors the app's (e.g. persisted). */
const AppHeldSavedColors: FunctionComponent = () => {
  const [log, addLog] = useLog();
  const [saved, setSaved] = useState(['#FF3B30', '#34C759', '#007AFF']);

  return (
    <Component
      hasInputGuards
      isCentered
      isInline
      id="color-picker-composition-saved"
      log={log}
      title="Color picker with app-held saved colors"
    >
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24 }}>
        <ColorPicker.Root
          defaultValue="#AF52DE"
          style={{ width: 'min(402px, 100%)' }}
        >
          <ColorPicker.Panel
            savedColors={saved}
            onSavedColorsChange={(
              next: string[],
              { reason }: ColorPickerSavedColorsChangeEventDetails,
            ) => {
              addLog(`saved (${reason}, first picker): ${next.join(', ')}`);
              setSaved(next);
            }}
          />
        </ColorPicker.Root>
        <ColorPicker.Root
          defaultValue="#FFCC00"
          style={{ width: 'min(402px, 100%)' }}
        >
          <ColorPicker.Panel
            savedColors={saved}
            onSavedColorsChange={(
              next: string[],
              { reason }: ColorPickerSavedColorsChangeEventDetails,
            ) => {
              addLog(`saved (${reason}, second picker): ${next.join(', ')}`);
              setSaved(next);
            }}
          />
        </ColorPicker.Root>
      </div>
    </Component>
  );
};

/** The page's sections (its headings' ids), listed at its top. */
const sections: readonly Section[] = [
  ['from-a-well-in-a-popover', 'From a well, in a popover'],
  ['in-a-sheet', 'In a sheet'],
  ['in-a-list-row', 'In a list row'],
  ['app-held-saved-colors', 'App-held saved colors'],
];

/** `/color-picker/composition`: color pickers in popovers, sheets, rows. */
export const ColorPickerComposition: FunctionComponent = () => (
  <>
    <Contents sections={sections} />
    <Heading
      id="from-a-well-in-a-popover"
      level={2}
    >
      From a well, in a popover
    </Heading>
    <ul>
      <li>
        As on iPad: a well (
        <PartLink
          component="color-picker"
          part="ColorPicker.Well"
        />
        ) is the trigger of a <a href="popover">Popover</a> with the picker.
      </li>
      <li>
        Its header the app’s: a <a href="toolbar">Toolbar</a> with the
        eyedropper (
        <PartLink
          component="color-picker"
          part="ColorPicker.Eyedropper"
        >
          {'render={<Toolbar.Button />}'}
        </PartLink>
        ), “Colors”, and a close button.
      </li>
      <li>Controlled: the app holds the color, and the well shows it.</li>
    </ul>
    <InAPopover />

    <Heading
      id="in-a-sheet"
      level={2}
    >
      In a sheet
    </Heading>
    <ul>
      <li>
        As on iPhone: the well opens a <a href="sheet">Sheet</a> (its medium
        detent), the toolbar in its{' '}
        <PartLink
          component="sheet"
          part="Sheet.Header"
        />
        , the picker in its content.
      </li>
    </ul>
    <InASheet />

    <Heading
      id="in-a-list-row"
      level={2}
    >
      In a list row
    </Heading>
    <ul>
      <li>
        A well at a <a href="list">List</a> row’s end (named by what it colors,
        here “Tint”).
      </li>
      <li>
        By the window’s size class (
        <PartLink
          component="viewport"
          part="useSizeClass"
        />
        ): a popover aligned to the well’s end (regular), or a sheet (compact);
        here also set (<code>[content]</code>).
      </li>
    </ul>
    <InAListRow />

    <Heading
      id="app-held-saved-colors"
      level={2}
    >
      App-held saved colors
    </Heading>
    <ul>
      <li>
        <code>savedColors</code> controlled by the app (e.g. persisted), its
        changes (<code>onSavedColorsChange</code>: <code>add</code>,{' '}
        <code>delete</code>) its to keep.
      </li>
      <li>
        Two pickers sharing them: a color saved in one shows in the other.
      </li>
    </ul>
    <AppHeldSavedColors />
  </>
);

/** Its live views, also on the component's page of demos (and `/all`). */
export const colorPickerCompositionDemos = [
  InAPopover,
  InASheet,
  InAListRow,
  AppHeldSavedColors,
];
