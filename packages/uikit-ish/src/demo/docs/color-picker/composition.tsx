import '../sheet/style.css';

import { FunctionComponent, useMemo, useState } from 'react';

import {
  Button,
  ColorPicker,
  type ColorPickerSavedColorsChangeEventDetails,
  forwardClick,
  List,
  Popover,
  Sheet,
  Symbol,
  Toolbar,
  useSizeClass,
  Viewport,
} from '../../../components/index.js';
import { CodeView } from '../../tooling/frame/code-view.js';
import { Component } from '../../tooling/frame/component.js';
import { useLog } from '../../tooling/frame/log.js';
import {
  usePartControls,
  usePropControl,
} from '../../tooling/frame/prop-control.js';
import { useProvidedState } from '../../tooling/frame/state.js';
import {
  Contents,
  Heading,
  PartLink,
  type Section,
} from '../../tooling/guide/sections.js';
import { sfEyedropper, sfPaintpalette, sfXmark } from '../../tooling/icons.js';
import { publicUrl } from '../../tooling/public-url.js';
import { partPropMaps } from '../part-options.js';
import { modesControl, panelParts } from './panel.js';
import { propOptionsPresentation } from './props.js';

/* eslint-disable unicorn/no-incorrect-template-string-interpolation -- JSX braces in code samples, not interpolations */
const inAPopoverCode = `const [color, setColor] = useState('#AF52DE');

<Popover.Root>
  <Popover.Trigger render={<ColorPicker.Well color={color} />} />
  <Popover.Portal>
    <Popover.Positioner>
      {/* The picker the popover's popup. */}
      <ColorPicker.Root
        render={<Popover.Popup />}
        value={color}
        onValueChange={setColor}
      >
        <Popover.Arrow />
        <Popover.Header>
          <Toolbar.Root placement="block-start">
            <Toolbar.Leading>
              <ColorPicker.Eyedropper render={<Toolbar.Button shape="circle" />}>
                …
              </ColorPicker.Eyedropper>
              <ColorPicker.SystemColors render={<Toolbar.Button shape="circle" />}>
                …
              </ColorPicker.SystemColors>
            </Toolbar.Leading>
            <Toolbar.Title>
              <span>Colors</span>
            </Toolbar.Title>
            <Toolbar.Trailing>
              <Popover.Close render={<Toolbar.Button aria-label="Close" shape="circle" />}>
                …
              </Popover.Close>
            </Toolbar.Trailing>
          </Toolbar.Root>
          {/* The modes' control, in the header: it doesn't scroll. */}
          <ColorPicker.Modes>
            <ColorPicker.Mode value="grid">Grid</ColorPicker.Mode>
            <ColorPicker.Mode value="spectrum">Spectrum</ColorPicker.Mode>
            <ColorPicker.Mode value="rgb">Sliders</ColorPicker.Mode>
          </ColorPicker.Modes>
        </Popover.Header>
        <Popover.Body>
          <Viewport.Padding edge="block-start" />
          <ColorPicker.Panel>
            <ColorPicker.View value="grid">
              <ColorPicker.Grid />
            </ColorPicker.View>
            <ColorPicker.View value="spectrum">
              <ColorPicker.Spectrum />
            </ColorPicker.View>
            <ColorPicker.View value="rgb">
              <ColorPicker.Sliders>
                <ColorPicker.Code>
                  <ColorPicker.CodeCopy>…</ColorPicker.CodeCopy>
                </ColorPicker.Code>
              </ColorPicker.Sliders>
            </ColorPicker.View>
            <ColorPicker.Opacity />
            <ColorPicker.Swatches />
          </ColorPicker.Panel>
        </Popover.Body>
      </ColorPicker.Root>
    </Popover.Positioner>
  </Popover.Portal>
</Popover.Root>`;

const inASheetCode = `const [color, setColor] = useState('#007AFF');

<Sheet.Root>
  <Sheet.Trigger render={<ColorPicker.Well color={color} />} />
  {/* The picker the sheet's popup: its header and modes in the sheet's
     header (not scrolling), its panel in its content. */}
  <ColorPicker.Root
    value={color}
    render={
      <Sheet.Popup
        compact
        detent="medium"
      />
    }
    onValueChange={setColor}
  >
    <Sheet.Header>
      <Sheet.Grabber />
      <Toolbar.Root placement="block-start">
        <Toolbar.Title>
          <span>Colors</span>
        </Toolbar.Title>
        <Toolbar.Trailing>
          <Sheet.Close render={<Toolbar.Button aria-label="Close" shape="circle" />}>
            …
          </Sheet.Close>
        </Toolbar.Trailing>
      </Toolbar.Root>
      <ColorPicker.Modes>…</ColorPicker.Modes>
    </Sheet.Header>
    <Sheet.Content>
      <Viewport.Padding edge="block-start" />
      <ColorPicker.Panel>
        <ColorPicker.View value="grid">…</ColorPicker.View>
        …
        <ColorPicker.Opacity />
        <ColorPicker.Swatches />
      </ColorPicker.Panel>
      <Viewport.Padding edge="block-end" />
    </Sheet.Content>
  </ColorPicker.Root>
</Sheet.Root>`;

const inAListRowCode = `const [tint, setTint] = useState('#FF9500');
const isSheet = useSizeClass() === 'compact';

<List.Item onClick={forwardClick('[data-color-picker-part=well]')}>
  <List.Content>
    <List.Title>Tint</List.Title>
  </List.Content>
  <List.Trailing>
    {isSheet ? (
      <Sheet.Root>
        <Sheet.Trigger render={<ColorPicker.Well aria-label="Tint" color={tint} />} />
        <ColorPicker.Root render={<Sheet.Popup compact detent="medium" />} …>
          …
        </ColorPicker.Root>
      </Sheet.Root>
    ) : (
      <Popover.Root>
        <Popover.Trigger render={<ColorPicker.Well aria-label="Tint" color={tint} />} />
        <Popover.Portal>
          {/* Aligned with the well's end. */}
          <Popover.Positioner align="end">
            <ColorPicker.Root
              render={<Popover.Popup />}
              value={tint}
              onValueChange={setTint}
            >
              <Popover.Body>
                <ColorPicker.Panel>
                  <ColorPicker.Modes>…</ColorPicker.Modes>
                  <ColorPicker.View value="grid">…</ColorPicker.View>
                  …
                </ColorPicker.Panel>
              </Popover.Body>
            </ColorPicker.Root>
          </Popover.Positioner>
        </Popover.Portal>
      </Popover.Root>
    )}
  </List.Trailing>
</List.Item>`;

const savedCode = `const [saved, setSaved] = useState(['#FF3B30', '#34C759', '#007AFF']);

{/* Two pickers, sharing the app's saved colors. */}
<ColorPicker.Root defaultValue="#AF52DE">
  <ColorPicker.Panel>
    …
    <ColorPicker.Swatches
      savedColors={saved}
      onSavedColorsChange={setSaved}
    />
  </ColorPicker.Panel>
</ColorPicker.Root>
<ColorPicker.Root defaultValue="#FFCC00">
  <ColorPicker.Panel>
    …
    <ColorPicker.Swatches
      savedColors={saved}
      onSavedColorsChange={setSaved}
    />
  </ColorPicker.Panel>
</ColorPicker.Root>`;

const modesCode = `<ColorPicker.Root
  defaultMode="hsl"
  defaultValue="#AF52DE"
>
  <ColorPicker.Panel>
    <ColorPicker.Modes>
      <ColorPicker.Mode value="spectrum">Spectrum</ColorPicker.Mode>
      <ColorPicker.Mode value="rgb">RGB</ColorPicker.Mode>
      <ColorPicker.Mode value="hsl">HSL</ColorPicker.Mode>
      <ColorPicker.Mode value="cmyk">CMYK</ColorPicker.Mode>
    </ColorPicker.Modes>
    <ColorPicker.View value="spectrum">
      <ColorPicker.Spectrum />
    </ColorPicker.View>
    <ColorPicker.View value="rgb">
      <ColorPicker.Sliders model="rgb" />
    </ColorPicker.View>
    <ColorPicker.View value="hsl">
      <ColorPicker.Sliders model="hsl" />
    </ColorPicker.View>
    <ColorPicker.View value="cmyk">
      <ColorPicker.Sliders model="cmyk" />
    </ColorPicker.View>
    {/* No ColorPicker.Opacity: the color stays opaque. */}
    <ColorPicker.Swatches />
  </ColorPicker.Panel>
</ColorPicker.Root>`;
/* eslint-enable unicorn/no-incorrect-template-string-interpolation */

/** The regular pattern: a well opening the picker in a popover. */
const InAPopover: FunctionComponent = () => {
  const [log, addLog] = useLog();
  const [color, setColor] = useState('#AF52DE');

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            'Button.Icon': [],
            'ColorPicker.Code': [],
            'ColorPicker.CodeCopy': ['shape', 'size', 'variant'],
            'ColorPicker.Eyedropper': ['render'],
            'ColorPicker.Grid': [],
            'ColorPicker.Mode': ['value'],
            'ColorPicker.Modes': [],
            'ColorPicker.Named': [],
            'ColorPicker.Opacity': [],
            'ColorPicker.Panel': [],
            'ColorPicker.Root': ['onValueChange', 'render', 'value'],
            'ColorPicker.Sliders': ['model', 'range'],
            'ColorPicker.Spectrum': [],
            'ColorPicker.Swatches': [],
            'ColorPicker.SystemColors': ['render'],
            'ColorPicker.View': ['value'],
            'ColorPicker.Well': ['color'],
            'Popover.Arrow': [],
            'Popover.Body': [],
            'Popover.Close': ['render'],
            'Popover.Header': [],
            'Popover.Popup': ['style'],
            'Popover.Portal': [],
            'Popover.Positioner': [],
            'Popover.Root': [],
            'Popover.Trigger': ['render'],
            Symbol: ['icon'],
            'Toolbar.Button': ['aria-label', 'shape'],
            'Toolbar.Leading': [],
            'Toolbar.Root': ['placement'],
            'Toolbar.Title': [],
            'Toolbar.Trailing': [],
            'Viewport.Padding': ['edge'],
          },
          addLog,
        ),
      [addLog],
    ),
    { provided: useProvidedState('color-picker-composition-popover') },
  );

  return (
    <Component
      hasInputGuards
      isCentered
      isInline
      controls={[partControls]}
      id="color-picker-composition-popover"
      log={log}
      state={[partState]}
      title="Color picker in a popover"
    >
      <Popover.Root {...partProps['Popover.Root']}>
        <Popover.Trigger
          {...partProps['Popover.Trigger']}
          render={
            <ColorPicker.Well
              {...partProps['ColorPicker.Well']}
              color={color}
            />
          }
        />
        <Popover.Portal {...partProps['Popover.Portal']}>
          <Popover.Positioner {...partProps['Popover.Positioner']}>
            <ColorPicker.Root
              {...partProps['ColorPicker.Root']}
              value={color}
              render={
                <Popover.Popup
                  {...partProps['Popover.Popup']}
                  style={{ width: 'min(402px, 100vw)' }}
                />
              }
              onValueChange={(next: string) => {
                addLog(`color: ${next}`);
                setColor(next);
              }}
            >
              <Popover.Arrow {...partProps['Popover.Arrow']} />
              <Popover.Header {...partProps['Popover.Header']}>
                <Toolbar.Root
                  {...partProps['Toolbar.Root']}
                  placement="block-start"
                >
                  <Toolbar.Leading {...partProps['Toolbar.Leading']}>
                    <ColorPicker.Eyedropper
                      {...partProps['ColorPicker.Eyedropper']}
                      render={
                        <Toolbar.Button
                          {...partProps['Toolbar.Button']}
                          shape="circle"
                        />
                      }
                    >
                      <Button.Icon {...partProps['Button.Icon']}>
                        <Symbol
                          {...partProps.Symbol}
                          icon={sfEyedropper}
                        />
                      </Button.Icon>
                    </ColorPicker.Eyedropper>
                    <ColorPicker.SystemColors
                      {...partProps['ColorPicker.SystemColors']}
                      render={
                        <Toolbar.Button
                          {...partProps['Toolbar.Button']}
                          shape="circle"
                        />
                      }
                    >
                      <Button.Icon {...partProps['Button.Icon']}>
                        <Symbol
                          {...partProps.Symbol}
                          icon={sfPaintpalette}
                        />
                      </Button.Icon>
                    </ColorPicker.SystemColors>
                  </Toolbar.Leading>
                  <Toolbar.Title {...partProps['Toolbar.Title']}>
                    <span>Colors</span>
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
                {modesControl(undefined, partProps)}
              </Popover.Header>
              <Popover.Body {...partProps['Popover.Body']}>
                <Viewport.Padding
                  {...partProps['Viewport.Padding']}
                  edge="block-start"
                />
                <ColorPicker.Panel {...partProps['ColorPicker.Panel']}>
                  {panelParts({ partProps, isModesElsewhere: true })}
                </ColorPicker.Panel>
              </Popover.Body>
            </ColorPicker.Root>
          </Popover.Positioner>
        </Popover.Portal>
      </Popover.Root>
    </Component>
  );
};

/** The compact pattern: a well opening the picker in a sheet. */
const InASheet: FunctionComponent = () => {
  const [log, addLog] = useLog();
  const [color, setColor] = useState('#007AFF');

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            'Button.Icon': [],
            'ColorPicker.Code': [],
            'ColorPicker.CodeCopy': ['shape', 'size', 'variant'],
            'ColorPicker.Grid': [],
            'ColorPicker.Mode': ['value'],
            'ColorPicker.Modes': [],
            'ColorPicker.Named': [],
            'ColorPicker.Opacity': [],
            'ColorPicker.Panel': [],
            'ColorPicker.Root': ['onValueChange', 'render', 'value'],
            'ColorPicker.Sliders': ['model', 'range'],
            'ColorPicker.Spectrum': [],
            'ColorPicker.Swatches': [],
            'ColorPicker.View': ['value'],
            'ColorPicker.Well': ['color'],
            'Sheet.Close': ['render'],
            'Sheet.Content': [],
            'Sheet.Grabber': [],
            'Sheet.Header': [],
            'Sheet.Popup': ['compact', 'detent'],
            'Sheet.Root': [],
            'Sheet.Trigger': ['render'],
            Symbol: ['icon'],
            'Toolbar.Button': ['aria-label', 'shape'],
            'Toolbar.Root': ['placement'],
            'Toolbar.Title': [],
            'Toolbar.Trailing': [],
            'Viewport.Content': [],
            'Viewport.Padding': ['edge'],
            'Viewport.Provider': [],
          },
          addLog,
        ),
      [addLog],
    ),
    { provided: useProvidedState('color-picker-composition-sheet') },
  );

  return (
    <Component
      hasInputGuards
      isInline
      controls={[partControls]}
      id="color-picker-composition-sheet"
      log={log}
      screen="centered"
      stage="phone"
      state={[partState]}
      title="Color picker in a sheet"
    >
      <Viewport.Provider {...partProps['Viewport.Provider']}>
        {/* Tracking the keyboard over its screen (its fields kept above
           it, see Viewport.KeyboardAccessory). */}
        <Viewport.Content {...partProps['Viewport.Content']}>
          <Sheet.Root {...partProps['Sheet.Root']}>
            <Sheet.Trigger
              {...partProps['Sheet.Trigger']}
              render={
                <ColorPicker.Well
                  {...partProps['ColorPicker.Well']}
                  color={color}
                />
              }
            />
            {/* The picker the sheet's popup: its header and modes in the
               sheet's header (not scrolling), its panel in its content. */}
            <ColorPicker.Root
              {...partProps['ColorPicker.Root']}
              value={color}
              render={
                <Sheet.Popup
                  {...partProps['Sheet.Popup']}
                  compact
                  detent="medium"
                />
              }
              onValueChange={(next: string) => {
                addLog(`color: ${next}`);
                setColor(next);
              }}
            >
              <Sheet.Header {...partProps['Sheet.Header']}>
                <Sheet.Grabber {...partProps['Sheet.Grabber']} />
                <Toolbar.Root
                  {...partProps['Toolbar.Root']}
                  placement="block-start"
                >
                  <Toolbar.Title {...partProps['Toolbar.Title']}>
                    <span>Colors</span>
                  </Toolbar.Title>
                  <Toolbar.Trailing {...partProps['Toolbar.Trailing']}>
                    <Sheet.Close
                      {...partProps['Sheet.Close']}
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
                    </Sheet.Close>
                  </Toolbar.Trailing>
                </Toolbar.Root>
                {modesControl(undefined, partProps)}
              </Sheet.Header>
              <Sheet.Content {...partProps['Sheet.Content']}>
                <Viewport.Padding
                  {...partProps['Viewport.Padding']}
                  edge="block-start"
                />
                <ColorPicker.Panel {...partProps['ColorPicker.Panel']}>
                  {panelParts({ partProps, isModesElsewhere: true })}
                </ColorPicker.Panel>
                <Viewport.Padding
                  {...partProps['Viewport.Padding']}
                  edge="block-end"
                />
              </Sheet.Content>
            </ColorPicker.Root>
          </Sheet.Root>
        </Viewport.Content>
      </Viewport.Provider>
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

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            'Button.Icon': [],
            'ColorPicker.Code': [],
            'ColorPicker.CodeCopy': ['shape', 'size', 'variant'],
            'ColorPicker.Grid': [],
            'ColorPicker.Mode': ['value'],
            'ColorPicker.Modes': [],
            'ColorPicker.Named': [],
            'ColorPicker.Opacity': [],
            'ColorPicker.Panel': [],
            'ColorPicker.Root': ['onValueChange', 'render', 'value'],
            'ColorPicker.Sliders': ['model', 'range'],
            'ColorPicker.Spectrum': [],
            'ColorPicker.Swatches': [],
            'ColorPicker.View': ['value'],
            'ColorPicker.Well': ['aria-label', 'color'],
            'List.Content': [],
            'List.Group': [],
            'List.Item': [],
            'List.Root': ['style'],
            'List.Section': [],
            'List.Title': [],
            'List.Trailing': [],
            'Popover.Body': [],
            'Popover.Popup': ['style'],
            'Popover.Portal': [],
            'Popover.Positioner': ['align'],
            'Popover.Root': [],
            'Popover.Trigger': ['render'],
            'Sheet.Content': [],
            'Sheet.Grabber': [],
            'Sheet.Header': [],
            'Sheet.Popup': ['compact', 'detent'],
            'Sheet.Root': [],
            'Sheet.Trigger': ['render'],
            Symbol: ['icon'],
            'Toolbar.Root': ['placement'],
            'Toolbar.Title': [],
            'Viewport.Content': [],
            'Viewport.Padding': ['edge'],
            'Viewport.Provider': [],
          },
          addLog,
        ),
      [addLog],
    ),
    { provided: useProvidedState(id) },
  );

  return (
    <Component
      hasInputGuards
      isCentered
      isInline
      controls={[control, partControls]}
      id={id}
      log={log}
      screen={isSheet ? 'centered' : undefined}
      stage={isSheet ? 'phone' : undefined}
      state={[state, partState]}
      title="Color picker in a list row"
    >
      {isSheet ? (
        <Viewport.Provider {...partProps['Viewport.Provider']}>
          {/* Tracking the keyboard over its screen (its fields kept above
             it, see Viewport.KeyboardAccessory). */}
          <Viewport.Content {...partProps['Viewport.Content']}>
            <List.Root
              {...partProps['List.Root']}
              style={{ width: '100%' }}
            >
              <List.Section {...partProps['List.Section']}>
                <List.Group {...partProps['List.Group']}>
                  <List.Item
                    {...partProps['List.Item']}
                    onClick={forwardClick('[data-color-picker-part=well]')}
                  >
                    <List.Content {...partProps['List.Content']}>
                      <List.Title {...partProps['List.Title']}>Tint</List.Title>
                    </List.Content>
                    <List.Trailing {...partProps['List.Trailing']}>
                      <Sheet.Root {...partProps['Sheet.Root']}>
                        <Sheet.Trigger
                          {...partProps['Sheet.Trigger']}
                          render={
                            <ColorPicker.Well
                              {...partProps['ColorPicker.Well']}
                              aria-label="Tint"
                              color={tint}
                            />
                          }
                        />
                        {/* The picker the sheet's popup: its header and modes in the
                           sheet's header (not scrolling), its panel in its content. */}
                        <ColorPicker.Root
                          {...partProps['ColorPicker.Root']}
                          value={tint}
                          render={
                            <Sheet.Popup
                              {...partProps['Sheet.Popup']}
                              compact
                              detent="medium"
                            />
                          }
                          onValueChange={(next: string) => {
                            addLog(`tint: ${next}`);
                            setTint(next);
                          }}
                        >
                          <Sheet.Header {...partProps['Sheet.Header']}>
                            <Sheet.Grabber {...partProps['Sheet.Grabber']} />
                            <Toolbar.Root
                              {...partProps['Toolbar.Root']}
                              placement="block-start"
                            >
                              <Toolbar.Title {...partProps['Toolbar.Title']}>
                                <span>Tint</span>
                              </Toolbar.Title>
                            </Toolbar.Root>
                            {modesControl(undefined, partProps)}
                          </Sheet.Header>
                          <Sheet.Content {...partProps['Sheet.Content']}>
                            <Viewport.Padding
                              {...partProps['Viewport.Padding']}
                              edge="block-start"
                            />
                            <ColorPicker.Panel
                              {...partProps['ColorPicker.Panel']}
                            >
                              {panelParts({
                                partProps,
                                isModesElsewhere: true,
                              })}
                            </ColorPicker.Panel>
                            <Viewport.Padding
                              {...partProps['Viewport.Padding']}
                              edge="block-end"
                            />
                          </Sheet.Content>
                        </ColorPicker.Root>
                      </Sheet.Root>
                    </List.Trailing>
                  </List.Item>
                </List.Group>
              </List.Section>
            </List.Root>
          </Viewport.Content>
        </Viewport.Provider>
      ) : (
        <List.Root
          {...partProps['List.Root']}
          style={{ width: 'min(402px, 100%)' }}
        >
          <List.Section {...partProps['List.Section']}>
            <List.Group {...partProps['List.Group']}>
              <List.Item
                {...partProps['List.Item']}
                onClick={forwardClick('[data-color-picker-part=well]')}
              >
                <List.Content {...partProps['List.Content']}>
                  <List.Title {...partProps['List.Title']}>Tint</List.Title>
                </List.Content>
                <List.Trailing {...partProps['List.Trailing']}>
                  <Popover.Root {...partProps['Popover.Root']}>
                    <Popover.Trigger
                      {...partProps['Popover.Trigger']}
                      render={
                        <ColorPicker.Well
                          {...partProps['ColorPicker.Well']}
                          aria-label="Tint"
                          color={tint}
                        />
                      }
                    />
                    <Popover.Portal {...partProps['Popover.Portal']}>
                      <Popover.Positioner
                        {...partProps['Popover.Positioner']}
                        align="end"
                      >
                        <ColorPicker.Root
                          {...partProps['ColorPicker.Root']}
                          value={tint}
                          render={
                            <Popover.Popup
                              {...partProps['Popover.Popup']}
                              style={{ width: 'min(402px, 100vw)' }}
                            />
                          }
                          onValueChange={(next: string) => {
                            addLog(`tint: ${next}`);
                            setTint(next);
                          }}
                        >
                          <Popover.Body {...partProps['Popover.Body']}>
                            <ColorPicker.Panel
                              {...partProps['ColorPicker.Panel']}
                            >
                              {panelParts({ partProps })}
                            </ColorPicker.Panel>
                          </Popover.Body>
                        </ColorPicker.Root>
                      </Popover.Positioner>
                    </Popover.Portal>
                  </Popover.Root>
                </List.Trailing>
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

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            'Button.Icon': [],
            'ColorPicker.Code': [],
            'ColorPicker.CodeCopy': ['shape', 'size', 'variant'],
            'ColorPicker.Grid': [],
            'ColorPicker.Mode': ['value'],
            'ColorPicker.Modes': [],
            'ColorPicker.Named': [],
            'ColorPicker.Opacity': [],
            'ColorPicker.Panel': [],
            'ColorPicker.Root': ['defaultValue', 'style'],
            'ColorPicker.Sliders': ['model', 'range'],
            'ColorPicker.Spectrum': [],
            'ColorPicker.View': ['value'],
            Symbol: ['icon'],
          },
          addLog,
        ),
      [addLog],
    ),
    { provided: useProvidedState('color-picker-composition-saved') },
  );

  return (
    <Component
      hasInputGuards
      isCentered
      isInline
      controls={[partControls]}
      id="color-picker-composition-saved"
      log={log}
      state={[partState]}
      title="Color picker with app-held saved colors"
    >
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24 }}>
        <ColorPicker.Root
          {...partProps['ColorPicker.Root']}
          defaultValue="#AF52DE"
          style={{ width: 'min(402px, 100%)' }}
        >
          <ColorPicker.Panel {...partProps['ColorPicker.Panel']}>
            {panelParts({
              partProps,
              swatchesProps: {
                onSavedColorsChange: (
                  next: string[],
                  { reason }: ColorPickerSavedColorsChangeEventDetails,
                ) => {
                  addLog(`saved (${reason}, first picker): ${next.join(', ')}`);
                  setSaved(next);
                },
                savedColors: saved,
              },
            })}
          </ColorPicker.Panel>
        </ColorPicker.Root>
        <ColorPicker.Root
          {...partProps['ColorPicker.Root']}
          defaultValue="#FFCC00"
          style={{ width: 'min(402px, 100%)' }}
        >
          <ColorPicker.Panel {...partProps['ColorPicker.Panel']}>
            {panelParts({
              partProps,
              swatchesProps: {
                onSavedColorsChange: (
                  next: string[],
                  { reason }: ColorPickerSavedColorsChangeEventDetails,
                ) => {
                  addLog(
                    `saved (${reason}, second picker): ${next.join(', ')}`,
                  );
                  setSaved(next);
                },
                savedColors: saved,
              },
            })}
          </ColorPicker.Panel>
        </ColorPicker.Root>
      </div>
    </Component>
  );
};

/**
 * Its own modes: the spectrum, then sliders by color model (labeled by
 * them), without the opacity (the color opaque).
 */
const ComposedModes: FunctionComponent = () => {
  const [log, addLog] = useLog();

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            'ColorPicker.Mode': ['value'],
            'ColorPicker.Modes': [],
            'ColorPicker.Panel': [],
            'ColorPicker.Root': [
              'defaultMode',
              'defaultValue',
              'onValueChange',
              'style',
            ],
            'ColorPicker.Sliders': ['model'],
            'ColorPicker.Spectrum': [],
            'ColorPicker.Swatches': [],
            'ColorPicker.View': ['value'],
          },
          addLog,
        ),
      [addLog],
    ),
    { provided: useProvidedState('color-picker-composition-modes') },
  );

  return (
    <Component
      hasInputGuards
      isCentered
      isInline
      controls={[partControls]}
      id="color-picker-composition-modes"
      log={log}
      state={[partState]}
      title="Color picker with its own modes"
    >
      <ColorPicker.Root
        {...partProps['ColorPicker.Root']}
        defaultMode="hsl"
        defaultValue="#AF52DE"
        style={{ width: 'min(402px, 100%)' }}
        onValueChange={(value: string) => addLog(`value change: ${value}`)}
      >
        <ColorPicker.Panel {...partProps['ColorPicker.Panel']}>
          <ColorPicker.Modes {...partProps['ColorPicker.Modes']}>
            <ColorPicker.Mode
              {...partProps['ColorPicker.Mode']}
              value="spectrum"
            >
              Spectrum
            </ColorPicker.Mode>
            <ColorPicker.Mode
              {...partProps['ColorPicker.Mode']}
              value="rgb"
            >
              RGB
            </ColorPicker.Mode>
            <ColorPicker.Mode
              {...partProps['ColorPicker.Mode']}
              value="hsl"
            >
              HSL
            </ColorPicker.Mode>
            <ColorPicker.Mode
              {...partProps['ColorPicker.Mode']}
              value="cmyk"
            >
              CMYK
            </ColorPicker.Mode>
          </ColorPicker.Modes>
          <ColorPicker.View
            {...partProps['ColorPicker.View']}
            value="spectrum"
          >
            <ColorPicker.Spectrum {...partProps['ColorPicker.Spectrum']} />
          </ColorPicker.View>
          <ColorPicker.View
            {...partProps['ColorPicker.View']}
            value="rgb"
          >
            <ColorPicker.Sliders
              {...partProps['ColorPicker.Sliders']}
              model="rgb"
            />
          </ColorPicker.View>
          <ColorPicker.View
            {...partProps['ColorPicker.View']}
            value="hsl"
          >
            <ColorPicker.Sliders
              {...partProps['ColorPicker.Sliders']}
              model="hsl"
            />
          </ColorPicker.View>
          <ColorPicker.View
            {...partProps['ColorPicker.View']}
            value="cmyk"
          >
            <ColorPicker.Sliders
              {...partProps['ColorPicker.Sliders']}
              model="cmyk"
            />
          </ColorPicker.View>
          <ColorPicker.Swatches {...partProps['ColorPicker.Swatches']} />
        </ColorPicker.Panel>
      </ColorPicker.Root>
    </Component>
  );
};

/** The page's sections (its headings' ids), listed at its top. */
const sections: readonly Section[] = [
  ['from-a-well-in-a-popover', 'From a well, in a popover'],
  ['in-a-sheet', 'In a sheet'],
  ['in-a-list-row', 'In a list row'],
  ['app-held-saved-colors', 'App-held saved colors'],
  ['its-own-modes', 'Its own modes'],
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
        On a regular width, a well (
        <PartLink
          component="color-picker"
          part="ColorPicker.Well"
        />
        ) is the trigger of a <a href={publicUrl('popover')}>Popover</a> that
        holds the picker.
      </li>
      <li>
        The app builds its header: a <a href={publicUrl('toolbar')}>Toolbar</a>{' '}
        with the eyedropper (
        <PartLink
          component="color-picker"
          part="ColorPicker.Eyedropper"
        >
          {'render={<Toolbar.Button />}'}
        </PartLink>
        ) and the system colors, “Colors”, and a close button. The modes’
        control sits below the bar, so it doesn’t scroll.
      </li>
      <li>It’s controlled: the app holds the color, and the well shows it.</li>
      <li>
        <strong>Library:</strong> the well (
        <PartLink
          component="color-picker"
          part="ColorPicker.Well"
        />
        ) as the popover’s trigger, the picker (
        <PartLink
          component="color-picker"
          part="ColorPicker.Panel"
        />
        ), and its eyedropper (
        <PartLink
          component="color-picker"
          part="ColorPicker.Eyedropper"
        />
        ).
      </li>
      <li>
        <strong>Demo:</strong> the color (the app’s state, shown by the well),
        and the popover’s header, a toolbar with its close button.
      </li>
    </ul>
    <CodeView code={inAPopoverCode} />
    <InAPopover />

    <Heading
      id="in-a-sheet"
      level={2}
    >
      In a sheet
    </Heading>
    <ul>
      <li>
        On a compact width, the well opens a{' '}
        <a href={publicUrl('sheet')}>Sheet</a> at its medium detent, with the
        picker as the sheet’s popup. Its toolbar and modes go in the sheet’s{' '}
        <PartLink
          component="sheet"
          part="Sheet.Header"
        />{' '}
        (after the grabber; in a popover, in its{' '}
        <PartLink
          component="popover"
          part="Popover.Header"
        />
        ), and the panel scrolls under it in the content.
      </li>
      <li>
        <strong>Library:</strong> the well opening a{' '}
        <PartLink
          component="sheet"
          part="Sheet.Popup"
        />{' '}
        at its medium detent, with the picker in its content.
      </li>
      <li>
        <strong>Demo:</strong> the color (the app’s state), and the sheet’s
        toolbar.
      </li>
    </ul>
    <CodeView code={inASheetCode} />
    <InASheet />

    <Heading
      id="in-a-list-row"
      level={2}
    >
      In a list row
    </Heading>
    <ul>
      <li>
        A well at a <a href={publicUrl('list')}>List</a> row’s end, named after
        what it colors (here “Tint”).
      </li>
      <li>
        The window’s size class (
        <PartLink
          component="viewport"
          part="useSizeClass"
        />
        ) picks a popover aligned with the well’s end (regular) or a sheet
        (compact). Here, you can also choose the presentation.
      </li>
      <li>
        <strong>Library:</strong> the well at the row’s end, the popover or
        sheet around the picker, and the window’s size class (
        <code>useSizeClass</code>).
      </li>
      <li>
        <strong>Demo:</strong> the tint (the app’s state), choosing the popover
        or the sheet by the size class, and the presentation control.
      </li>
    </ul>
    <CodeView code={inAListRowCode} />
    <InAListRow />

    <Heading
      id="app-held-saved-colors"
      level={2}
    >
      App-held saved colors
    </Heading>
    <ul>
      <li>
        The app controls <code>savedColors</code> (for example to persist them),
        and keeps their changes (<code>onSavedColorsChange</code>, with{' '}
        <code>add</code> or <code>delete</code>).
      </li>
      <li>
        Here, two pickers share them, so a color saved in one shows in the
        other.
      </li>
      <li>
        <strong>Library:</strong> the picker’s saved colors (
        <code>savedColors</code>, <code>onSavedColorsChange</code>).
      </li>
      <li>
        <strong>Demo:</strong> holding the saved colors (for example to persist
        them), and sharing them between the two pickers.
      </li>
    </ul>
    <CodeView code={savedCode} />
    <AppHeldSavedColors />

    <Heading
      id="its-own-modes"
      level={2}
    >
      Its own modes
    </Heading>
    <ul>
      <li>
        The panel as composed: which modes, in which order, and how they’re
        labeled (
        <PartLink
          component="color-picker"
          part="ColorPicker.Modes"
        />
        , with a{' '}
        <PartLink
          component="color-picker"
          part="ColorPicker.View"
        />{' '}
        for each). Here, that’s the spectrum, then sliders by color model (
        <PartLink
          component="color-picker"
          part="ColorPicker.Sliders"
        >
          model
        </PartLink>
        : RGB, HSL, CMYK), with HSL shown first.
      </li>
      <li>
        Without an{' '}
        <PartLink
          component="color-picker"
          part="ColorPicker.Opacity"
        />
        , the color stays opaque (<code>#rrggbb</code>).
      </li>
      <li>
        <strong>Library:</strong> the panel’s parts (
        <PartLink
          component="color-picker"
          part="ColorPicker.Panel"
        />
        ), and the sliders’ color models.
      </li>
      <li>
        <strong>Demo:</strong> the choice of modes, and their labels.
      </li>
    </ul>
    <CodeView code={modesCode} />
    <ComposedModes />
  </>
);

/** Its live views, also on the component's page of demos (and `/all`). */
export const colorPickerCompositionDemos = [
  InAPopover,
  InASheet,
  InAListRow,
  AppHeldSavedColors,
  ComposedModes,
];
