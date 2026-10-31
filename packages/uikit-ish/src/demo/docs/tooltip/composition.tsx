import '../toolbar/style.css';
import './style.css';

import { FunctionComponent, useRef } from 'react';

import { Button, Symbol, Toolbar, Tooltip } from '../../../components/index.js';
import { Component } from '../../tooling/frame/component.js';
import { useLog } from '../../tooling/frame/log.js';
import {
  Contents,
  Heading,
  PartLink,
  type Section,
} from '../../tooling/guide/sections.js';
import {
  sfMappinAndEllipse,
  sfPlusSquareOnSquare,
  sfSquareAndArrowUp,
  sfTrash,
} from '../../tooling/icons.js';

/** A toolbar's symbol buttons, their tooltips sharing a provider. */
const InAToolbar: FunctionComponent = () => {
  const [log, addLog] = useLog();

  return (
    <Component
      isCentered
      isInline
      baseUiId="tooltip"
      id="tooltip-composition-toolbar"
      log={log}
      title="Tooltips in a toolbar"
    >
      <div className="tooltip-demo-buttons">
        <div className="toolbar-demo-bar">
          <Tooltip.Provider>
            <Toolbar.Root placement="block-start">
              <Toolbar.Title>
                <span>Notes</span>
              </Toolbar.Title>
              <Toolbar.Trailing>
                <Toolbar.Group>
                  <Tooltip.Root>
                    <Tooltip.Trigger
                      aria-label="Share"
                      render={
                        <Toolbar.Button
                          shape="circle"
                          onClick={() => addLog('share clicked')}
                        />
                      }
                    >
                      <Button.Icon>
                        <Symbol icon={sfSquareAndArrowUp} />
                      </Button.Icon>
                    </Tooltip.Trigger>
                    <Tooltip.Portal>
                      <Tooltip.Positioner>
                        <Tooltip.Popup>Share</Tooltip.Popup>
                      </Tooltip.Positioner>
                    </Tooltip.Portal>
                  </Tooltip.Root>
                  <Tooltip.Root>
                    <Tooltip.Trigger
                      aria-label="Duplicate"
                      render={
                        <Toolbar.Button
                          shape="circle"
                          onClick={() => addLog('duplicate clicked')}
                        />
                      }
                    >
                      <Button.Icon>
                        <Symbol icon={sfPlusSquareOnSquare} />
                      </Button.Icon>
                    </Tooltip.Trigger>
                    <Tooltip.Portal>
                      <Tooltip.Positioner>
                        <Tooltip.Popup>Duplicate</Tooltip.Popup>
                      </Tooltip.Positioner>
                    </Tooltip.Portal>
                  </Tooltip.Root>
                  <Tooltip.Root>
                    <Tooltip.Trigger
                      aria-label="Delete"
                      render={
                        <Toolbar.Button
                          shape="circle"
                          onClick={() => addLog('delete clicked')}
                        />
                      }
                    >
                      <Button.Icon>
                        <Symbol icon={sfTrash} />
                      </Button.Icon>
                    </Tooltip.Trigger>
                    <Tooltip.Portal>
                      <Tooltip.Positioner>
                        <Tooltip.Popup>Delete</Tooltip.Popup>
                      </Tooltip.Positioner>
                    </Tooltip.Portal>
                  </Tooltip.Root>
                </Toolbar.Group>
              </Toolbar.Trailing>
            </Toolbar.Root>
          </Tooltip.Provider>
        </div>
      </div>
    </Component>
  );
};

/** Held open at an element (no trigger): a map's “You Are Here”. */
const HeldOpen: FunctionComponent = () => {
  const pin = useRef<HTMLSpanElement>(null);

  return (
    <Component
      isCentered
      isInline
      baseUiId="tooltip"
      id="tooltip-composition-held"
      title="Tooltip held open"
    >
      <div className="tooltip-demo-buttons">
        <span
          ref={pin}
          className="tooltip-demo-pin"
        >
          <Symbol icon={sfMappinAndEllipse} />
        </span>
        <Tooltip.Root open>
          <Tooltip.Portal>
            <Tooltip.Positioner anchor={pin}>
              <Tooltip.Popup>You Are Here</Tooltip.Popup>
            </Tooltip.Positioner>
          </Tooltip.Portal>
        </Tooltip.Root>
      </div>
    </Component>
  );
};

/** The page's sections (its headings' ids), listed at its top. */
const sections: readonly Section[] = [
  ['in-a-toolbar', 'In a toolbar'],
  ['held-open-at-an-element', 'Held open at an element'],
];

/** `/tooltip/composition`: tooltips with other components. */
export const TooltipComposition: FunctionComponent = () => (
  <>
    <Contents sections={sections} />

    <Heading
      id="in-a-toolbar"
      level={2}
    >
      In a toolbar
    </Heading>
    <ul>
      <li>
        A <a href="toolbar">Toolbar</a>’s symbol buttons (
        <code>{'render={<Toolbar.Button />}'}</code>), each named (
        <code>aria-label</code>), each with its tooltip.
      </li>
      <li>
        In one{' '}
        <PartLink
          component="tooltip"
          part="Tooltip.Provider"
        />
        : once one has shown, moving to the next shows its tooltip at once.
      </li>
      <li>
        <strong>Library:</strong> the tooltips (
        <PartLink
          component="tooltip"
          part="Tooltip.Root"
        />
        ) on the bar’s buttons, and the provider (
        <PartLink
          component="tooltip"
          part="Tooltip.Provider"
        />
        ) showing the next at once.
      </li>
      <li>
        <strong>Demo:</strong> the buttons, their names and what each does
        (logged).
      </li>
    </ul>
    <InAToolbar />

    <Heading
      id="held-open-at-an-element"
      level={2}
    >
      Held open at an element
    </Heading>
    <ul>
      <li>
        No trigger: held open (<code>open</code>), placed at any element (
        <PartLink
          component="tooltip"
          part="Tooltip.Positioner"
        />
        ’s <code>anchor</code>): a label for good, on touch too.
      </li>
      <li>
        As <a href="slider">Slider</a>’s and <a href="progress">Progress</a>’
        value labels, and a <a href="page-control">Page control</a>’s.
      </li>
      <li>
        <strong>Library:</strong> holding it open (<code>open</code>) at an
        anchor element (
        <PartLink
          component="tooltip"
          part="Tooltip.Positioner"
        />{' '}
        <code>anchor</code>).
      </li>
      <li>
        <strong>Demo:</strong> the element it’s pinned to (a ref) and its label.
      </li>
    </ul>
    <HeldOpen />
  </>
);

/** Its live views, also on the component's page of demos (and `/all`). */
export const tooltipCompositionDemos = [InAToolbar, HeldOpen];
