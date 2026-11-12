import '../sheet/style.css';

import { FunctionComponent, useMemo, useState } from 'react';

import {
  Button,
  ColorPicker,
  Popover,
  Sheet,
  Symbol,
  Toolbar,
  useSizeClass,
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
import {
  sfDocumentOnDocument,
  sfEyedropper,
  sfPaintpalette,
  sfXmark,
} from '../../tooling/icons.js';
import { publicUrl } from '../../tooling/public-url.js';
import { partPropMaps } from '../part-options.js';
import {
  colorPickerPanelRows,
  colorPickerRootRows,
  colorPickerSlidersRows,
  colorPickerSwatchesRows,
} from './docs.js';
import { modesControl, panelParts, shownModes } from './panel.js';
import { propOptionsOverview, propOptionsOverviewContent } from './props.js';

/**
 * A well (its color the app's), opening the picker: in a popover (a regular
 * width), or a sheet (a compact one; or as set).
 */
const LiveView: FunctionComponent = () => {
  const id = 'color-picker-overview';
  const [log, addLog] = useLog();
  const sizeClass = useSizeClass();
  const [color, setColor] = useState('#AF52DE');
  const [externalContent, externalRoot] = useProvidedState(id);
  const [controlContent, content, stateContent] = usePropControl(
    propOptionsOverviewContent,
    { external: externalContent, isOpen: true, title: '[content]' },
  );
  // (Its modes' control in its panel, or elsewhere: the sheet's header.)
  // The system's color picker's button (left out, none).
  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            'Button.Icon': [],
            'ColorPicker.Code': [],
            'ColorPicker.CodeCopy': ['render', 'shape', 'size', 'variant'],
            'ColorPicker.Eyedropper': ['render'],
            'ColorPicker.Grid': [],
            'ColorPicker.Mode': ['value'],
            'ColorPicker.Modes': [],
            'ColorPicker.Named': [],
            'ColorPicker.Opacity': [],
            'ColorPicker.Panel': [],
            'ColorPicker.Sliders': ['model', 'range'],
            'ColorPicker.Spectrum': [],
            'ColorPicker.Swatches': [],
            'ColorPicker.SystemColors': ['render'],
            'ColorPicker.View': ['value'],
            'ColorPicker.Well': ['color', 'size'],
            'Popover.Arrow': [],
            'Popover.Body': [],
            'Popover.Close': ['render'],
            'Popover.Header': [],
            'Popover.Popup': ['style'],
            'Popover.Portal': [],
            'Popover.Positioner': [],
            'Popover.Root': [],
            'Popover.Trigger': ['render'],
            'Sheet.Close': ['render'],
            'Sheet.Content': [],
            'Sheet.Grabber': [],
            'Sheet.Header': [],
            'Sheet.Popup': ['compact', 'detent'],
            'Sheet.Root': [],
            'Sheet.Trigger': ['render'],
            Symbol: ['icon'],
            'Toolbar.Button': ['aria-label', 'shape'],
            'Toolbar.Leading': [],
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
    { provided: useProvidedState(id) },
  );
  const systemColors = content.systemColors ? (
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
  ) : null;
  // The code's copy button without its row (left out): on its own, in the
  // header's toolbar (before its close button).
  const codeCopy =
    !content.code && content.codeCopy ? (
      <ColorPicker.CodeCopy
        {...partProps['ColorPicker.CodeCopy']}
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
            icon={sfDocumentOnDocument}
          />
        </Button.Icon>
      </ColorPicker.CodeCopy>
    ) : null;
  // Its modes; one alone, no control for them (its view shown).
  const modes = shownModes(content);
  const hasModesControl = modes.length > 1;
  // (Its modes' control elsewhere: the popover's or the sheet's header.)
  const parts = () =>
    panelParts({
      partProps,
      isModesElsewhere: true,
      modes,
      opacity: content.opacity,
    });
  const [controlRoot, propsRoot, stateRoot, keyRoot] = usePropControl(
    propOptionsOverview,
    { external: externalRoot, title: 'ColorPicker.Root' },
  );
  const rootProps = {
    ...propsRoot,
    value: color,
    onValueChange: (next: string) => {
      addLog(`color: ${next}`);
      setColor(next);
    },
  };
  const isSheet =
    (content.presentation ??
      (sizeClass === 'compact' ? 'sheet' : 'popover')) === 'sheet';

  return (
    <Component
      hasInputGuards
      isCentered
      isInline
      controls={[controlContent, controlRoot, partControls]}
      id={id}
      log={log}
      screen={isSheet ? 'centered' : undefined}
      stage={isSheet ? 'phone' : undefined}
      state={[stateContent, stateRoot, partState]}
      title="Color picker"
    >
      {isSheet ? (
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
                    size="large"
                  />
                }
              />
              {/* The picker the sheet's popup: its header and modes in the
                 sheet's header (not scrolling), its panel in its content. */}
              <ColorPicker.Root
                key={keyRoot}
                {...rootProps}
                render={
                  <Sheet.Popup
                    {...partProps['Sheet.Popup']}
                    compact
                    detent="medium"
                  />
                }
              >
                <Sheet.Header {...partProps['Sheet.Header']}>
                  <Sheet.Grabber {...partProps['Sheet.Grabber']} />
                  <Toolbar.Root
                    {...partProps['Toolbar.Root']}
                    placement="block-start"
                  >
                    <Toolbar.Leading {...partProps['Toolbar.Leading']}>
                      {systemColors}
                    </Toolbar.Leading>
                    <Toolbar.Title {...partProps['Toolbar.Title']}>
                      <span>Colors</span>
                    </Toolbar.Title>
                    <Toolbar.Trailing {...partProps['Toolbar.Trailing']}>
                      {codeCopy}
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
                  {hasModesControl ? modesControl(modes, partProps) : null}
                </Sheet.Header>
                <Sheet.Content {...partProps['Sheet.Content']}>
                  <Viewport.Padding
                    {...partProps['Viewport.Padding']}
                    edge="block-start"
                  />
                  <ColorPicker.Panel {...partProps['ColorPicker.Panel']}>
                    {parts()}
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
      ) : (
        <Popover.Root {...partProps['Popover.Root']}>
          <Popover.Trigger
            {...partProps['Popover.Trigger']}
            render={
              <ColorPicker.Well
                {...partProps['ColorPicker.Well']}
                color={color}
                size="large"
              />
            }
          />
          <Popover.Portal {...partProps['Popover.Portal']}>
            <Popover.Positioner {...partProps['Popover.Positioner']}>
              <ColorPicker.Root
                key={keyRoot}
                {...rootProps}
                render={
                  <Popover.Popup
                    {...partProps['Popover.Popup']}
                    style={{ width: 'min(402px, 100vw)' }}
                  />
                }
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
                      {systemColors}
                    </Toolbar.Leading>
                    <Toolbar.Title {...partProps['Toolbar.Title']}>
                      <span>Colors</span>
                    </Toolbar.Title>
                    <Toolbar.Trailing {...partProps['Toolbar.Trailing']}>
                      {codeCopy}
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
                  {hasModesControl ? modesControl(modes, partProps) : null}
                </Popover.Header>
                <Popover.Body {...partProps['Popover.Body']}>
                  <Viewport.Padding
                    {...partProps['Viewport.Padding']}
                    edge="block-start"
                  />
                  <ColorPicker.Panel {...partProps['ColorPicker.Panel']}>
                    {parts()}
                  </ColorPicker.Panel>
                </Popover.Body>
              </ColorPicker.Root>
            </Popover.Positioner>
          </Popover.Portal>
        </Popover.Root>
      )}
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

/** `/color-picker`: what a color picker is for, and its props. */
export const ColorPickerOverview: FunctionComponent = () => (
  <>
    <Contents sections={sections} />
    <ul className="demo-lead">
      <li>
        Picks a color: from a grid, a spectrum, or red, green and blue sliders
        (each mixing from the color), with an optional opacity and saved colors.
      </li>
      <li>It opens from a color well, in a popover or a sheet.</li>
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
        For any color: a drawing’s, a text’s, an app’s tint, or a calendar’s.
      </li>
      <li>
        For entering a value (a color), not for picking one of the app’s few
        colors.
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
        A few named colors (for example a label’s): use a{' '}
        <a href={publicUrl('list')}>List</a> of rows with checkmarks, or a{' '}
        <a href={publicUrl('segmented')}>Segmented</a> control.
      </li>
    </ul>

    <Heading
      id="key-props"
      level={2}
    >
      Key props
    </Heading>
    <ul>
      <li>The props most color pickers set.</li>
      <li>
        All props of all parts are on the{' '}
        <a href={publicUrl('color-picker/parts')}>Parts</a> page.
      </li>
    </ul>
    <KeyPropsTable
      parts={[
        [
          'ColorPicker.Root',
          pickRows(
            colorPickerRootRows,
            'value',
            'defaultValue',
            'onValueChange',
            'defaultMode',
          ),
        ],
        ['ColorPicker.Panel', pickRows(colorPickerPanelRows, 'children')],
        [
          'ColorPicker.Sliders',
          pickRows(colorPickerSlidersRows, 'model', 'range'),
        ],
        [
          'ColorPicker.Swatches',
          pickRows(colorPickerSwatchesRows, 'savedColors'),
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
        The grid’s swatches are toggle buttons, named by their colors. The
        spectrum is a slider (the arrow keys move the hue across and the
        lightness down), with the color as its value.
      </li>
      <li>
        The sliders and the opacity are sliders (Base UI’s), named by their
        channels (“Red”, “Opacity”). Each one’s value is a field too (“Red
        value”, “Opacity percentage”).
      </li>
      <li>
        Saved colors are buttons, named by their colors. Their menu (on a
        secondary click) deletes them.
      </li>
      <li>
        The well is a button named “Color”. Name it after what it colors (for
        example “Tint”).
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
        Each change applies at once (<code>onValueChange</code>), and the
        opacity is kept across views.
      </li>
      <li>
        The add button saves the color (unless it’s already saved). With more
        than ten, the saved colors form pages, which can be swiped or turned
        with their <a href={publicUrl('page-control')}>Page Control</a>.
      </li>
      <li>
        The eyedropper (
        <PartLink
          component="color-picker"
          part="ColorPicker.Eyedropper"
        />
        ) is the browser’s. Where there’s none (Safari), it doesn’t show.
      </li>
      <li>
        The system colors (
        <PartLink
          component="color-picker"
          part="ColorPicker.SystemColors"
        />
        ) open the system’s color picker. With the opacity, its alpha applies
        too where the browser’s picker has one (for example Safari’s).
        Otherwise, its colors are opaque, and the opacity is kept.
      </li>
      <li>
        Under the sliders sits the color’s hex code (
        <PartLink
          component="color-picker"
          part="ColorPicker.Code"
        />
        ), which can be typed. The copy button before it (
        <PartLink
          component="color-picker"
          part="ColorPicker.CodeCopy"
        />
        ) copies it, or another format (for example <code>oklch()</code>) from
        its menu. Without the code’s row, the copy button sits in the header’s
        toolbar, before the close button.
      </li>
      <li>
        With <code>named</code>, the CSS named colors (
        <PartLink
          component="color-picker"
          part="ColorPicker.CssNamedColors"
        />
        ) show in a list (
        <PartLink
          component="color-picker"
          part="ColorPicker.Named"
        />
        ), with an index of their first letters at its end. The sheet’s content
        (or the popover’s body) scrolls it.
      </li>
    </ul>
  </>
);

/** Its live views, also on the component's page of demos (and `/all`). */
export const colorPickerOverviewDemos = [LiveView];
