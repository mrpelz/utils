import '../sheet/style.css';

import { FunctionComponent, useState } from 'react';

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
import { usePropControl } from '../../tooling/frame/prop-control.js';
import { useProvidedState } from '../../tooling/frame/state.js';
import { KeyPropsTable, pickRows } from '../../tooling/guide/props-table.js';
import {
  Contents,
  Heading,
  PartLink,
  type Section,
} from '../../tooling/guide/sections.js';
import { sfEyedropper, sfPaintpalette, sfXmark } from '../../tooling/icons.js';
import { publicUrl } from '../../tooling/public-url.js';
import { GuideLink } from '../hig-guide/link.js';
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
  const systemColors = content.systemColors ? (
    <ColorPicker.SystemColors render={<Toolbar.Button shape="circle" />}>
      <Button.Icon>
        <Symbol icon={sfPaintpalette} />
      </Button.Icon>
    </ColorPicker.SystemColors>
  ) : null;
  // Its modes; one alone, no control for them (its view shown).
  const modes = shownModes(content);
  const hasModesControl = modes.length > 1;
  const parts = (isModesElsewhere = false) =>
    panelParts({
      isModesElsewhere: isModesElsewhere || !hasModesControl,
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
      controls={[controlContent, controlRoot]}
      id={id}
      log={log}
      screen={isSheet ? 'centered' : undefined}
      stage={isSheet ? 'phone' : undefined}
      state={[stateContent, stateRoot]}
      title="Color picker"
    >
      {isSheet ? (
        <Viewport.Provider>
          {/* Tracking the keyboard over its screen (its fields kept above
             it, see Viewport.KeyboardAccessory). */}
          <Viewport.Content>
            <Sheet.Root>
              <Sheet.Trigger
                render={
                  <ColorPicker.Well
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
                    compact
                    detent="medium"
                  />
                }
              >
                <Sheet.Header>
                  <Sheet.Grabber />
                  <ColorPicker.Header>
                    <Toolbar.Root placement="block-start">
                      <Toolbar.Leading>{systemColors}</Toolbar.Leading>
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
                  </ColorPicker.Header>
                  {hasModesControl ? modesControl(modes) : null}
                </Sheet.Header>
                <Sheet.Content>
                  <Viewport.Padding edge="block-start" />
                  <ColorPicker.Panel>{parts(true)}</ColorPicker.Panel>
                  <Viewport.Padding edge="block-end" />
                </Sheet.Content>
              </ColorPicker.Root>
            </Sheet.Root>
          </Viewport.Content>
        </Viewport.Provider>
      ) : (
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
                  key={keyRoot}
                  {...rootProps}
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
                        {systemColors}
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
                  <ColorPicker.Panel>{parts()}</ColorPicker.Panel>
                </ColorPicker.Root>
              </Popover.Popup>
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
        (each mixing from the color); its opacity (optional); saved colors.
      </li>
      <li>Opened from a color well, in a popover or a sheet.</li>
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
        A few named colors (e.g. a label’s): a{' '}
        <a href={publicUrl('list')}>List</a> of checkmarked rows, or a{' '}
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
        All parts’ props: <a href={publicUrl('color-picker/parts')}>Parts</a>.
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
        The grid’s swatches are toggle buttons, named by their colors; the
        spectrum a slider (arrow keys: the hue across, the lightness down), its
        value the color.
      </li>
      <li>
        The sliders and the opacity are sliders (Base UI’s), named by their
        channels (“Red”, “Opacity”); each one’s value a field too (“Red value”,
        “Opacity percentage”).
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
        colors page, swiped or by their{' '}
        <a href={publicUrl('page-control')}>Page control</a>.
      </li>
      <li>
        The eyedropper (
        <PartLink
          component="color-picker"
          part="ColorPicker.Eyedropper"
        />
        ) is the browser’s: where there’s none (Safari), it doesn’t show.
      </li>
      <li>
        The system colors (
        <PartLink
          component="color-picker"
          part="ColorPicker.SystemColors"
        />
        ) open the system’s color picker; with the opacity, its alpha too where
        the browser’s has one (e.g. Safari), else its colors opaque, the opacity
        kept.
      </li>
    </ul>
  </>
);

/** Its live views, also on the component's page of demos (and `/all`). */
export const colorPickerOverviewDemos = [LiveView];
