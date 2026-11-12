import { FunctionComponent, useMemo } from 'react';

import { Button, Symbol } from '../../../components/index.js';
import { Component } from '../../tooling/frame/component.js';
import { useLog } from '../../tooling/frame/log.js';
import {
  usePartControls,
  usePropControl,
} from '../../tooling/frame/prop-control.js';
import { useProvidedState } from '../../tooling/frame/state.js';
import { PropsTable } from '../../tooling/guide/props-table.js';
import { Heading, PartLink } from '../../tooling/guide/sections.js';
import { sfHeartFill } from '../../tooling/icons.js';
import { publicUrl } from '../../tooling/public-url.js';
import { partPropMaps } from '../part-options.js';
import { buttonIconRows, buttonLabelRows, buttonRootRows } from './docs.js';
import { getPropOptionsRoot, propOptionsPart } from './props.js';

/** `Button.Root`, outlined, with its props. */
const RootPart: FunctionComponent = () => {
  const id = 'button-parts-root';
  const [log, addLog] = useLog();
  const [external] = useProvidedState(id);
  const [control, props, state, elementKey] = usePropControl(
    useMemo(() => getPropOptionsRoot(addLog), [addLog]),
    { external, isOpen: true, emphasize: 'outline', title: 'Button.Root' },
  );

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            Symbol: ['icon'],
            'Button.Icon': [],
            'Button.Label': [],
          },
          addLog,
        ),
      [addLog],
    ),
    { provided: useProvidedState(id) },
  );

  return (
    <Component
      isCentered
      isInline
      controls={[control, partControls]}
      id={id}
      log={log}
      state={[state, partState]}
      title="Button.Root"
    >
      <Button.Root
        key={elementKey}
        {...props}
      >
        <Button.Icon {...partProps['Button.Icon']}>
          <Symbol
            {...partProps.Symbol}
            icon={sfHeartFill}
          />
        </Button.Icon>
        <Button.Label {...partProps['Button.Label']}>Like</Button.Label>
      </Button.Root>
    </Component>
  );
};

/** `Button.Icon`, outlined: the symbol before a label. */
const IconPart: FunctionComponent = () => {
  const id = 'button-parts-icon';
  const [log, addLog] = useLog();
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(propOptionsPart, {
    external,
    isOpen: true,
    emphasize: 'outline',
    title: 'Button.Icon',
  });

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            Symbol: ['icon'],
            'Button.Label': [],
            'Button.Root': ['onClick', 'variant'],
          },
          addLog,
        ),
      [addLog],
    ),
    { provided: useProvidedState(id) },
  );

  return (
    <Component
      isCentered
      isInline
      controls={[control, partControls]}
      id={id}
      log={log}
      state={[state, partState]}
      title="Button.Icon"
    >
      <Button.Root
        {...partProps['Button.Root']}
        variant="bordered"
        onClick={() => addLog('Like clicked')}
      >
        <Button.Icon {...props}>
          <Symbol
            {...partProps.Symbol}
            icon={sfHeartFill}
          />
        </Button.Icon>
        <Button.Label {...partProps['Button.Label']}>Like</Button.Label>
      </Button.Root>
    </Component>
  );
};

/** `Button.Label`, outlined: the label after a symbol. */
const LabelPart: FunctionComponent = () => {
  const id = 'button-parts-label';
  const [log, addLog] = useLog();
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(propOptionsPart, {
    external,
    isOpen: true,
    emphasize: 'outline',
    title: 'Button.Label',
  });

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            Symbol: ['icon'],
            'Button.Icon': [],
            'Button.Root': ['onClick', 'variant'],
          },
          addLog,
        ),
      [addLog],
    ),
    { provided: useProvidedState(id) },
  );

  return (
    <Component
      isCentered
      isInline
      controls={[control, partControls]}
      id={id}
      log={log}
      state={[state, partState]}
      title="Button.Label"
    >
      <Button.Root
        {...partProps['Button.Root']}
        variant="bordered"
        onClick={() => addLog('Like clicked')}
      >
        <Button.Icon {...partProps['Button.Icon']}>
          <Symbol
            {...partProps.Symbol}
            icon={sfHeartFill}
          />
        </Button.Icon>
        <Button.Label {...props}>Like</Button.Label>
      </Button.Root>
    </Component>
  );
};

/** `/button/parts`: the root, its symbol and its label. */
export const ButtonParts: FunctionComponent = () => (
  <>
    <ul className="demo-lead">
      <li>Root: the button, the control people press.</li>
      <li>Its content: a symbol, a label, or both, in their order.</li>
    </ul>
    <ul className="demo-tree">
      <li>
        <PartLink
          component="button"
          part="Button.Root"
        />
        <ul>
          <li>
            <PartLink
              component="button"
              part="Button.Icon"
            />{' '}
            (optional)
            <ul>
              <li className="demo-tree-context">
                <PartLink
                  component="symbol"
                  part="Symbol"
                />
              </li>
            </ul>
          </li>
          <li>
            <PartLink
              component="button"
              part="Button.Label"
            />{' '}
            (optional)
          </li>
        </ul>
      </li>
    </ul>

    <Heading
      id="button-root"
      level={2}
    >
      <code>Button.Root</code>
    </Heading>
    <ul>
      <li>
        Its look: <code>variant</code>, <code>size</code>, <code>shape</code>,{' '}
        <code>tint</code>, <code>textColor</code>, <code>destructive</code> and{' '}
        <code>fill</code>, and for glass, <code>context</code>.
      </li>
      <li>
        Its action: <code>onClick</code> (without one, it’s disabled), and{' '}
        <code>onSecondaryClick</code>.
      </li>
      <li>
        Renders a <code>button</code> (Base UI’s <code>Button</code>). For
        glass, its glass and a content <code>span</code> go inside.
      </li>
    </ul>
    <RootPart />
    <h3>Props</h3>
    <PropsTable rows={buttonRootRows} />

    <Heading
      id="button-icon"
      level={2}
    >
      <code>Button.Icon</code>
    </Heading>
    <ul>
      <li>
        A symbol (a <a href={publicUrl('symbol')}>Symbol</a>), in the label’s
        text style (19px Semibold on glass).
      </li>
      <li>
        Renders a <code>span</code>.
      </li>
    </ul>
    <IconPart />
    <h3>Props</h3>
    <PropsTable rows={buttonIconRows} />

    <Heading
      id="button-label"
      level={2}
    >
      <code>Button.Label</code>
    </Heading>
    <ul>
      <li>The label, which truncates when the button is narrower than it.</li>
      <li>
        Renders a <code>span</code>.
      </li>
    </ul>
    <LabelPart />
    <h3>Props</h3>
    <PropsTable rows={buttonLabelRows} />
  </>
);

/** Its live views, also on the component's page of demos (and `/all`). */
export const buttonPartsDemos = [RootPart, IconPart, LabelPart];
