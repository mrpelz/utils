import './style.css';

import { FunctionComponent, useMemo } from 'react';

import {
  Button,
  PageControl,
  Symbol,
  Toolbar,
  ToolbarButtonProps,
} from '../../../components/index.js';
import { Component } from '../../tooling/frame/component.js';
import { useLog } from '../../tooling/frame/log.js';
import {
  usePartControls,
  usePropControl,
} from '../../tooling/frame/prop-control.js';
import { useProvidedState } from '../../tooling/frame/state.js';
import {
  sfArchivebox,
  sfArrowshapeTurnUpLeft,
  sfFlag,
  sfFolder,
  sfSquareAndArrowUp,
  sfSquareAndPencil,
  sfTrash,
} from '../../tooling/icons.js';
import { partPropMaps } from '../part-options.js';
import {
  getPropOptionsButton,
  getPropOptionsPageControl,
  propOptionsGroup,
  propOptionsPageDotsContent,
  propOptionsRoot,
  propOptionsSymbolsContent,
} from './props.js';

/**
 * A toolbar:
 * three glass buttons at each side.
 */
export const ToolbarDemo: FunctionComponent = () => {
  const id = 'toolbar';

  const [log, addLog] = useLog();
  const [externalRoot, externalButton] = useProvidedState(id);

  const [controlRoot, propsRoot, stateRoot, elementKey] = usePropControl(
    propOptionsRoot,
    { external: externalRoot, isOpen: true, title: 'root' },
  );
  const [controlButton, buttonProps, stateButton] = usePropControl(
    useMemo(() => getPropOptionsButton(addLog, true), [addLog]),
    { external: externalButton, title: 'button (first)' },
  );
  // (Of its own: `prominent`, too.)
  const propsButton = buttonProps as ToolbarButtonProps;

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            'Toolbar.Button': ['aria-label', 'onClick', 'shape'],
            Symbol: ['icon'],
            'Button.Icon': [],
            'Toolbar.Leading': [],
            'Toolbar.Trailing': [],
          },
          addLog,
        ),
      [addLog],
    ),
    { provided: useProvidedState(id) },
  );

  return (
    <Component
      isStretched
      baseUiId="toolbar"
      controls={[controlRoot, controlButton, partControls]}
      id={id}
      log={log}
      state={[stateRoot, stateButton, partState]}
      title="Toolbar"
    >
      <Toolbar.Root
        key={elementKey}
        {...propsRoot}
      >
        <Toolbar.Leading {...partProps['Toolbar.Leading']}>
          <Toolbar.Button
            aria-label="Action 1"
            {...propsButton}
            shape={propsButton.shape ?? 'circle'}
          >
            <Button.Icon {...partProps['Button.Icon']}>
              <Symbol
                {...partProps.Symbol}
                icon={sfFolder}
              />
            </Button.Icon>
          </Toolbar.Button>
          <Toolbar.Button
            {...partProps['Toolbar.Button']}
            aria-label="Action 2"
            shape="circle"
            onClick={() => addLog('Action 2 clicked')}
          >
            <Button.Icon {...partProps['Button.Icon']}>
              <Symbol
                {...partProps.Symbol}
                icon={sfFlag}
              />
            </Button.Icon>
          </Toolbar.Button>
          <Toolbar.Button
            {...partProps['Toolbar.Button']}
            aria-label="Action 3"
            shape="circle"
            onClick={() => addLog('Action 3 clicked')}
          >
            <Button.Icon {...partProps['Button.Icon']}>
              <Symbol
                {...partProps.Symbol}
                icon={sfArchivebox}
              />
            </Button.Icon>
          </Toolbar.Button>
        </Toolbar.Leading>
        <Toolbar.Trailing {...partProps['Toolbar.Trailing']}>
          <Toolbar.Button
            {...partProps['Toolbar.Button']}
            aria-label="Action 4"
            shape="circle"
            onClick={() => addLog('Action 4 clicked')}
          >
            <Button.Icon {...partProps['Button.Icon']}>
              <Symbol
                {...partProps.Symbol}
                icon={sfArrowshapeTurnUpLeft}
              />
            </Button.Icon>
          </Toolbar.Button>
          <Toolbar.Button
            {...partProps['Toolbar.Button']}
            aria-label="Action 5"
            shape="circle"
            onClick={() => addLog('Action 5 clicked')}
          >
            <Button.Icon {...partProps['Button.Icon']}>
              <Symbol
                {...partProps.Symbol}
                icon={sfSquareAndPencil}
              />
            </Button.Icon>
          </Toolbar.Button>
          <Toolbar.Button
            {...partProps['Toolbar.Button']}
            aria-label="Action 6"
            shape="circle"
            onClick={() => addLog('Action 6 clicked')}
          >
            <Button.Icon {...partProps['Button.Icon']}>
              <Symbol
                {...partProps.Symbol}
                icon={sfTrash}
              />
            </Button.Icon>
          </Toolbar.Button>
        </Toolbar.Trailing>
      </Toolbar.Root>
    </Component>
  );
};

/** A toolbar with page dots between its buttons (Type=Buttons + Page Dots). */
export const ToolbarPageDotsDemo: FunctionComponent = () => {
  const id = 'toolbar-page-dots';

  const [log, addLog] = useLog();
  const [externalContent, externalRoot, externalButton, externalPageControl] =
    useProvidedState(id);

  const [controlContent, content, stateContent] = usePropControl(
    propOptionsPageDotsContent,
    { external: externalContent, isOpen: true, title: '[content]' },
  );
  const [controlRoot, propsRoot, stateRoot, elementKey] = usePropControl(
    propOptionsRoot,
    { external: externalRoot, isOpen: true, title: 'root' },
  );
  const [controlButton, buttonProps, stateButton] = usePropControl(
    useMemo(() => getPropOptionsButton(addLog, true), [addLog]),
    { external: externalButton, title: 'button (first)' },
  );
  // (Of its own: `prominent`, too.)
  const propsButton = buttonProps as ToolbarButtonProps;
  const [
    controlPageControl,
    propsPageControl,
    statePageControl,
    keyPageControl,
  ] = usePropControl(
    useMemo(() => getPropOptionsPageControl(addLog), [addLog]),
    { external: externalPageControl, title: 'page control' },
  );

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            'Toolbar.Button': ['aria-label', 'onClick', 'shape'],
            Symbol: ['icon'],
            'Button.Icon': [],
            'Toolbar.Leading': [],
            'Toolbar.Trailing': [],
          },
          addLog,
        ),
      [addLog],
    ),
    { provided: useProvidedState(id) },
  );

  return (
    <Component
      isStretched
      baseUiId="toolbar"
      id={id}
      log={log}
      title="Toolbar (Page Dots)"
      controls={[
        controlContent,
        controlRoot,
        controlButton,
        controlPageControl,
        partControls,
      ]}
      state={[
        stateContent,
        stateRoot,
        stateButton,
        statePageControl,
        partState,
      ]}
    >
      <Toolbar.Root
        key={elementKey}
        {...propsRoot}
      >
        <Toolbar.Leading {...partProps['Toolbar.Leading']}>
          <Toolbar.Button
            aria-label="Folders"
            {...propsButton}
            shape={propsButton.shape ?? 'circle'}
          >
            <Button.Icon {...partProps['Button.Icon']}>
              <Symbol
                {...partProps.Symbol}
                icon={sfFolder}
              />
            </Button.Icon>
          </Toolbar.Button>
        </Toolbar.Leading>
        <PageControl
          key={keyPageControl}
          count={content.pages}
          {...propsPageControl}
        />
        <Toolbar.Trailing {...partProps['Toolbar.Trailing']}>
          <Toolbar.Button
            {...partProps['Toolbar.Button']}
            aria-label="Share"
            shape="circle"
            onClick={() => addLog('Share clicked')}
          >
            <Button.Icon {...partProps['Button.Icon']}>
              <Symbol
                {...partProps.Symbol}
                icon={sfSquareAndArrowUp}
              />
            </Button.Icon>
          </Toolbar.Button>
        </Toolbar.Trailing>
      </Toolbar.Root>
    </Component>
  );
};

/** A capsule of 2 to 6 symbols. */
export const ToolbarSymbolsDemo: FunctionComponent = () => {
  const id = 'toolbar-symbols';

  const [log, addLog] = useLog();
  const [externalContent, externalRoot, externalGroup, externalButton] =
    useProvidedState(id);

  const [controlContent, content, stateContent] = usePropControl(
    propOptionsSymbolsContent,
    { external: externalContent, isOpen: true, title: '[content]' },
  );
  const [controlRoot, propsRoot, stateRoot, elementKey] = usePropControl(
    propOptionsRoot,
    { external: externalRoot, isOpen: true, title: 'root' },
  );
  const [controlGroup, propsGroup, stateGroup] = usePropControl(
    propOptionsGroup,
    { external: externalGroup, isOpen: true, title: 'group' },
  );
  // (In the capsule: what applies there.)
  const [controlButton, propsButton, stateButton] = usePropControl(
    useMemo(() => getPropOptionsButton(addLog, false), [addLog]),
    { external: externalButton, title: 'button (first)' },
  );

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            'Toolbar.Button': ['aria-label', 'onClick', 'shape'],
            Symbol: ['icon'],
            'Button.Icon': [],
            'Toolbar.Trailing': [],
          },
          addLog,
        ),
      [addLog],
    ),
    { provided: useProvidedState(id) },
  );

  return (
    <Component
      isStretched
      baseUiId="toolbar"
      id={id}
      log={log}
      state={[stateContent, stateRoot, stateGroup, stateButton, partState]}
      title="Toolbar (Symbols)"
      controls={[
        controlContent,
        controlRoot,
        controlGroup,
        controlButton,
        partControls,
      ]}
    >
      <Toolbar.Root
        key={elementKey}
        {...propsRoot}
      >
        <Toolbar.Trailing {...partProps['Toolbar.Trailing']}>
          <Toolbar.Group {...propsGroup}>
            <Toolbar.Button
              aria-label="Action 1"
              {...propsButton}
              shape={propsButton.shape ?? 'circle'}
            >
              <Button.Icon {...partProps['Button.Icon']}>
                <Symbol
                  {...partProps.Symbol}
                  icon={sfFolder}
                />
              </Button.Icon>
            </Toolbar.Button>
            <Toolbar.Button
              {...partProps['Toolbar.Button']}
              aria-label="Action 2"
              shape="circle"
              onClick={() => addLog('Action 2 clicked')}
            >
              <Button.Icon {...partProps['Button.Icon']}>
                <Symbol
                  {...partProps.Symbol}
                  icon={sfFlag}
                />
              </Button.Icon>
            </Toolbar.Button>
            {content.symbols >= 3 ? (
              <Toolbar.Button
                {...partProps['Toolbar.Button']}
                aria-label="Action 3"
                shape="circle"
                onClick={() => addLog('Action 3 clicked')}
              >
                <Button.Icon {...partProps['Button.Icon']}>
                  <Symbol
                    {...partProps.Symbol}
                    icon={sfArchivebox}
                  />
                </Button.Icon>
              </Toolbar.Button>
            ) : null}
            {content.symbols >= 4 ? (
              <Toolbar.Button
                {...partProps['Toolbar.Button']}
                aria-label="Action 4"
                shape="circle"
                onClick={() => addLog('Action 4 clicked')}
              >
                <Button.Icon {...partProps['Button.Icon']}>
                  <Symbol
                    {...partProps.Symbol}
                    icon={sfArrowshapeTurnUpLeft}
                  />
                </Button.Icon>
              </Toolbar.Button>
            ) : null}
            {content.symbols >= 5 ? (
              <Toolbar.Button
                {...partProps['Toolbar.Button']}
                aria-label="Action 5"
                shape="circle"
                onClick={() => addLog('Action 5 clicked')}
              >
                <Button.Icon {...partProps['Button.Icon']}>
                  <Symbol
                    {...partProps.Symbol}
                    icon={sfSquareAndPencil}
                  />
                </Button.Icon>
              </Toolbar.Button>
            ) : null}
            {content.symbols >= 6 ? (
              <Toolbar.Button
                {...partProps['Toolbar.Button']}
                aria-label="Action 6"
                shape="circle"
                onClick={() => addLog('Action 6 clicked')}
              >
                <Button.Icon {...partProps['Button.Icon']}>
                  <Symbol
                    {...partProps.Symbol}
                    icon={sfTrash}
                  />
                </Button.Icon>
              </Toolbar.Button>
            ) : null}
          </Toolbar.Group>
        </Toolbar.Trailing>
      </Toolbar.Root>
    </Component>
  );
};

/** Text buttons (plain and tinted). */
export const ToolbarTextDemo: FunctionComponent = () => {
  const id = 'toolbar-text';

  const [log, addLog] = useLog();
  const [externalRoot, externalButton] = useProvidedState(id);

  const [controlRoot, propsRoot, stateRoot, elementKey] = usePropControl(
    propOptionsRoot,
    { external: externalRoot, isOpen: true, title: 'root' },
  );
  const [controlButton, buttonProps, stateButton] = usePropControl(
    useMemo(() => getPropOptionsButton(addLog, true), [addLog]),
    { external: externalButton, title: 'button (first)' },
  );
  // (Of its own: `prominent`, too.)
  const propsButton = buttonProps as ToolbarButtonProps;

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            'Toolbar.Button': ['onClick', 'prominent'],
            'Button.Label': [],
            'Toolbar.Leading': [],
            'Toolbar.Trailing': [],
          },
          addLog,
        ),
      [addLog],
    ),
    { provided: useProvidedState(id) },
  );

  return (
    <Component
      isStretched
      baseUiId="toolbar"
      controls={[controlRoot, controlButton, partControls]}
      id={id}
      log={log}
      state={[stateRoot, stateButton, partState]}
      title="Toolbar (Text)"
    >
      <Toolbar.Root
        key={elementKey}
        {...propsRoot}
      >
        <Toolbar.Leading {...partProps['Toolbar.Leading']}>
          <Toolbar.Button {...propsButton}>
            <Button.Label {...partProps['Button.Label']}>Edit</Button.Label>
          </Toolbar.Button>
        </Toolbar.Leading>
        <Toolbar.Trailing {...partProps['Toolbar.Trailing']}>
          <Toolbar.Button
            {...partProps['Toolbar.Button']}
            prominent
            onClick={() => addLog('Done clicked')}
          >
            <Button.Label {...partProps['Button.Label']}>Done</Button.Label>
          </Toolbar.Button>
        </Toolbar.Trailing>
      </Toolbar.Root>
    </Component>
  );
};
