import { sfEyedropper } from '@bradleyhodges/sfsymbols/sfEyedropper';
import { sfXmark } from '@bradleyhodges/sfsymbols/sfXmark';
import { FunctionComponent, useState } from 'react';

import {
  Button,
  ColorPicker,
  Popover,
  Symbol,
  Toolbar,
} from '../../components/index.js';
import { Component } from '../frame/component.js';
import { useLog } from '../frame/log.js';
import { usePropControl } from '../frame/prop-control.js';
import { useProvidedState } from '../frame/state.js';
import { KeyPropsTable, pickRows } from '../guide/props-table.js';
import {
  Contents,
  Heading,
  PartLink,
  type Section,
} from '../guide/sections.js';
import { GuideLink } from '../hig-guide/link.js';
import { colorPickerPanelRows, colorPickerRootRows } from './docs.js';
import { propOptionsOverview } from './props.js';

/** A well (its color the app's), opening the picker in a popover. */
const LiveView: FunctionComponent = () => {
  const id = 'color-picker-overview';
  const [log, addLog] = useLog();
  const [color, setColor] = useState('#AF52DE');
  const [external] = useProvidedState(id);
  const [control, props, state, elementKey] = usePropControl(
    propOptionsOverview,
    'ColorPicker.Panel',
    external,
    true,
  );

  return (
    <Component
      center
      inline
      inputGuards
      controls={[control]}
      id={id}
      log={log}
      state={[state]}
      title="Color picker"
    >
      <Popover.Root>
        <Popover.Trigger
          render={
            <ColorPicker.Well
              color={color}
              size="large"
            />
          }
        />
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
                <ColorPicker.Panel
                  key={elementKey}
                  {...props}
                />
              </ColorPicker.Root>
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

/** `/color-picker`: what a color picker is for, and its props. */
export const ColorPickerOverview: FunctionComponent = () => (
  <>
    <Contents sections={sections} />
    <ul className="demo-lead">
      <li>
        Picks a color (UIKit <code>UIColorPickerViewController</code>): from a
        grid, a spectrum, or red, green and blue sliders; its opacity; saved
        colors.
      </li>
      <li>
        Opened from a color well (UIKit <code>UIColorWell</code>), in a popover
        or a sheet.
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
        For any color: a drawing’s, a text’s, an app’s tint, a calendar’s.
      </li>
      <li>
        A value, not a pick from the app’s few: the guide’s{' '}
        <GuideLink to="primitive-value-input">Value input</GuideLink> (its value
        type: a color).
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
        A few named colors (e.g. a label’s): a <a href="list">List</a> of
        checkmarked rows, or a <a href="segmented">Segmented</a> control.
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
        All parts’ props: <a href="color-picker/parts">Parts</a>.
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
          ),
        ],
        [
          'ColorPicker.Panel',
          pickRows(colorPickerPanelRows, 'defaultMode', 'savedColors'),
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
        The grid’s swatches are toggle buttons, named by their colors; the
        spectrum a slider (arrow keys: the hue across, the lightness down), its
        value the color.
      </li>
      <li>
        The sliders and the opacity are <a href="slider">Slider</a>s; the
        opacity’s percentage a field.
      </li>
      <li>
        Saved colors are buttons, named by their colors; their menu (a secondary
        click) deletes them.
      </li>
      <li>
        The well is a button named “Color”: name it by what it colors (e.g.
        “Tint”).
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
        Each change applies at once (<code>onValueChange</code>), opacity kept
        across views.
      </li>
      <li>
        The add button saves the color (not if saved); more than ten, the saved
        colors page, swiped or by their <a href="page-control">Page control</a>.
      </li>
      <li>
        The eyedropper (
        <PartLink
          component="color-picker"
          part="ColorPicker.Eyedropper"
        />
        ) is the browser’s: where there’s none (Safari), it doesn’t show.
      </li>
    </ul>
  </>
);

/** Its live views, also on the component's page of demos (and `/all`). */
export const colorPickerOverviewDemos = [LiveView];
