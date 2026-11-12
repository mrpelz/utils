import '../toolbar/style.css';
import './style.css';

import { FunctionComponent, useMemo, useRef } from 'react';

import { Button, Symbol, Toolbar, Tooltip } from '../../../components/index.js';
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
import {
  sfMappinAndEllipse,
  sfPlusSquareOnSquare,
  sfSquareAndArrowUp,
  sfTrash,
} from '../../tooling/icons.js';
import { publicUrl } from '../../tooling/public-url.js';
import { partPropMaps } from '../part-options.js';

/* eslint-disable unicorn/no-incorrect-template-string-interpolation -- JSX braces in code samples, not interpolations */
const inAToolbarCode = `{/* One provider: once one has shown, the next shows at once. */}
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
            render={<Toolbar.Button shape="circle" />}
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
        …
      </Toolbar.Group>
    </Toolbar.Trailing>
  </Toolbar.Root>
</Tooltip.Provider>`;

const heldOpenCode = `const pin = useRef<HTMLSpanElement>(null);

<span ref={pin}>
  <Symbol icon={sfMappinAndEllipse} />
</span>
{/* No trigger: held open at the pin. */}
<Tooltip.Root open>
  <Tooltip.Portal>
    <Tooltip.Positioner anchor={pin}>
      <Tooltip.Popup>You Are Here</Tooltip.Popup>
    </Tooltip.Positioner>
  </Tooltip.Portal>
</Tooltip.Root>`;
/* eslint-enable unicorn/no-incorrect-template-string-interpolation */

/** A toolbar's symbol buttons, their tooltips sharing a provider. */
const InAToolbar: FunctionComponent = () => {
  const [log, addLog] = useLog();

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            Symbol: ['icon'],
            'Button.Icon': [],
            'Toolbar.Button': ['onClick', 'shape'],
            'Toolbar.Group': [],
            'Toolbar.Root': ['placement'],
            'Toolbar.Title': [],
            'Toolbar.Trailing': [],
            'Tooltip.Popup': [],
            'Tooltip.Portal': [],
            'Tooltip.Positioner': [],
            'Tooltip.Provider': [],
            'Tooltip.Root': [],
            'Tooltip.Trigger': ['aria-label', 'render'],
          },
          addLog,
        ),
      [addLog],
    ),
    { provided: useProvidedState('tooltip-composition-toolbar') },
  );

  return (
    <Component
      isCentered
      isInline
      baseUiId="tooltip"
      controls={[partControls]}
      id="tooltip-composition-toolbar"
      log={log}
      state={[partState]}
      title="Tooltips in a toolbar"
    >
      <div className="tooltip-demo-buttons">
        <div className="toolbar-demo-bar">
          <Tooltip.Provider {...partProps['Tooltip.Provider']}>
            <Toolbar.Root
              {...partProps['Toolbar.Root']}
              placement="block-start"
            >
              <Toolbar.Title {...partProps['Toolbar.Title']}>
                <span>Notes</span>
              </Toolbar.Title>
              <Toolbar.Trailing {...partProps['Toolbar.Trailing']}>
                <Toolbar.Group {...partProps['Toolbar.Group']}>
                  <Tooltip.Root {...partProps['Tooltip.Root']}>
                    <Tooltip.Trigger
                      {...partProps['Tooltip.Trigger']}
                      aria-label="Share"
                      render={
                        <Toolbar.Button
                          {...partProps['Toolbar.Button']}
                          shape="circle"
                          onClick={() => addLog('share clicked')}
                        />
                      }
                    >
                      <Button.Icon {...partProps['Button.Icon']}>
                        <Symbol
                          {...partProps.Symbol}
                          icon={sfSquareAndArrowUp}
                        />
                      </Button.Icon>
                    </Tooltip.Trigger>
                    <Tooltip.Portal {...partProps['Tooltip.Portal']}>
                      <Tooltip.Positioner {...partProps['Tooltip.Positioner']}>
                        <Tooltip.Popup {...partProps['Tooltip.Popup']}>
                          Share
                        </Tooltip.Popup>
                      </Tooltip.Positioner>
                    </Tooltip.Portal>
                  </Tooltip.Root>
                  <Tooltip.Root {...partProps['Tooltip.Root']}>
                    <Tooltip.Trigger
                      {...partProps['Tooltip.Trigger']}
                      aria-label="Duplicate"
                      render={
                        <Toolbar.Button
                          {...partProps['Toolbar.Button']}
                          shape="circle"
                          onClick={() => addLog('duplicate clicked')}
                        />
                      }
                    >
                      <Button.Icon {...partProps['Button.Icon']}>
                        <Symbol
                          {...partProps.Symbol}
                          icon={sfPlusSquareOnSquare}
                        />
                      </Button.Icon>
                    </Tooltip.Trigger>
                    <Tooltip.Portal {...partProps['Tooltip.Portal']}>
                      <Tooltip.Positioner {...partProps['Tooltip.Positioner']}>
                        <Tooltip.Popup {...partProps['Tooltip.Popup']}>
                          Duplicate
                        </Tooltip.Popup>
                      </Tooltip.Positioner>
                    </Tooltip.Portal>
                  </Tooltip.Root>
                  <Tooltip.Root {...partProps['Tooltip.Root']}>
                    <Tooltip.Trigger
                      {...partProps['Tooltip.Trigger']}
                      aria-label="Delete"
                      render={
                        <Toolbar.Button
                          {...partProps['Toolbar.Button']}
                          shape="circle"
                          onClick={() => addLog('delete clicked')}
                        />
                      }
                    >
                      <Button.Icon {...partProps['Button.Icon']}>
                        <Symbol
                          {...partProps.Symbol}
                          icon={sfTrash}
                        />
                      </Button.Icon>
                    </Tooltip.Trigger>
                    <Tooltip.Portal {...partProps['Tooltip.Portal']}>
                      <Tooltip.Positioner {...partProps['Tooltip.Positioner']}>
                        <Tooltip.Popup {...partProps['Tooltip.Popup']}>
                          Delete
                        </Tooltip.Popup>
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

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps({
          Symbol: ['icon'],
          'Tooltip.Popup': [],
          'Tooltip.Portal': [],
          'Tooltip.Positioner': ['anchor'],
          'Tooltip.Root': [],
        }),
      [],
    ),
    { provided: useProvidedState('tooltip-composition-held') },
  );

  return (
    <Component
      isCentered
      isInline
      baseUiId="tooltip"
      controls={[partControls]}
      id="tooltip-composition-held"
      state={[partState]}
      title="Tooltip held open"
    >
      <div className="tooltip-demo-buttons">
        <span
          ref={pin}
          className="tooltip-demo-pin"
        >
          <Symbol
            {...partProps.Symbol}
            icon={sfMappinAndEllipse}
          />
        </span>
        <Tooltip.Root
          {...partProps['Tooltip.Root']}
          open
        >
          <Tooltip.Portal {...partProps['Tooltip.Portal']}>
            <Tooltip.Positioner
              {...partProps['Tooltip.Positioner']}
              anchor={pin}
            >
              <Tooltip.Popup {...partProps['Tooltip.Popup']}>
                You Are Here
              </Tooltip.Popup>
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
        A <a href={publicUrl('toolbar')}>Toolbar</a>’s symbol buttons (
        <code>{'render={<Toolbar.Button />}'}</code>), each with a name (
        <code>aria-label</code>) and its own tooltip.
      </li>
      <li>
        They share one{' '}
        <PartLink
          component="tooltip"
          part="Tooltip.Provider"
        />
        : once one tooltip has shown, moving to the next button shows its
        tooltip at once.
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
        ) that shows the next one at once.
      </li>
      <li>
        <strong>Demo:</strong> the buttons, their names, and what each does
        (logged).
      </li>
    </ul>
    <CodeView code={inAToolbarCode} />
    <InAToolbar />

    <Heading
      id="held-open-at-an-element"
      level={2}
    >
      Held open at an element
    </Heading>
    <ul>
      <li>
        There’s no trigger. It’s held open (<code>open</code>) and placed at any
        element (the{' '}
        <PartLink
          component="tooltip"
          part="Tooltip.Positioner"
        />
        ’s <code>anchor</code>), as a lasting label that works on touch too.
      </li>
      <li>
        That’s how the value labels of a{' '}
        <a href={publicUrl('slider')}>Slider</a>, a{' '}
        <a href={publicUrl('progress')}>Progress</a> and a{' '}
        <a href={publicUrl('page-control')}>Page Control</a> work.
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
        <strong>Demo:</strong> the element it’s pinned to (a ref), and its
        label.
      </li>
    </ul>
    <CodeView code={heldOpenCode} />
    <HeldOpen />
  </>
);

/** Its live views, also on the component's page of demos (and `/all`). */
export const tooltipCompositionDemos = [InAToolbar, HeldOpen];
