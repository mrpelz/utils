import { sfArchivebox } from '@bradleyhodges/sfsymbols/sfArchivebox';
import { sfArrowshapeTurnUpLeft } from '@bradleyhodges/sfsymbols/sfArrowshapeTurnUpLeft';
import { sfFlag } from '@bradleyhodges/sfsymbols/sfFlag';
import { sfFolder } from '@bradleyhodges/sfsymbols/sfFolder';
import { sfSquareAndArrowUp } from '@bradleyhodges/sfsymbols/sfSquareAndArrowUp';
import { sfSquareAndPencil } from '@bradleyhodges/sfsymbols/sfSquareAndPencil';
import { sfTrash } from '@bradleyhodges/sfsymbols/sfTrash';
import { FunctionComponent, useMemo } from 'react';

import {
  Button,
  PageControl,
  Symbol,
  Toolbar,
  ToolbarButtonProps,
} from '../../components/index.js';
import { Component } from '../frame/component.js';
import { useLog } from '../frame/log.js';
import { usePropControl } from '../frame/prop-control.js';
import { useProvidedState } from '../frame/state.js';
import {
  getPropOptionsButton,
  getPropOptionsPageControl,
  propOptionsGroup,
  propOptionsPageDotsContent,
  propOptionsRoot,
  propOptionsSymbolsContent,
} from './props.js';

/**
 * A toolbar (UIKit `UIToolbar`, Figma “Toolbar - Bottom”, Type=Buttons):
 * three glass buttons at each side.
 */
export const ToolbarDemo: FunctionComponent = () => {
  const id = 'toolbar';

  const [log, addLog] = useLog();
  const [externalRoot, externalButton] = useProvidedState(id);

  const [controlRoot, propsRoot, stateRoot, elementKey] = usePropControl(
    propOptionsRoot,
    'root',
    externalRoot,
    true,
  );
  const [controlButton, buttonProps, stateButton] = usePropControl(
    useMemo(() => getPropOptionsButton(addLog, true), [addLog]),
    'button (first)',
    externalButton,
  );
  // (Of its own: `prominent`, too.)
  const propsButton = buttonProps as ToolbarButtonProps;

  return (
    <Component
      stretch
      baseUiId="toolbar"
      controls={[controlRoot, controlButton]}
      id={id}
      log={log}
      state={[stateRoot, stateButton]}
      title="Toolbar"
    >
      <Toolbar.Root
        key={elementKey}
        {...propsRoot}
      >
        <Toolbar.Leading>
          <Toolbar.Button
            aria-label="Action 1"
            {...propsButton}
            shape={propsButton.shape ?? 'circle'}
          >
            <Button.Icon>
              <Symbol icon={sfFolder} />
            </Button.Icon>
          </Toolbar.Button>
          <Toolbar.Button
            aria-label="Action 2"
            shape="circle"
            onClick={() => addLog('Action 2 clicked')}
          >
            <Button.Icon>
              <Symbol icon={sfFlag} />
            </Button.Icon>
          </Toolbar.Button>
          <Toolbar.Button
            aria-label="Action 3"
            shape="circle"
            onClick={() => addLog('Action 3 clicked')}
          >
            <Button.Icon>
              <Symbol icon={sfArchivebox} />
            </Button.Icon>
          </Toolbar.Button>
        </Toolbar.Leading>
        <Toolbar.Trailing>
          <Toolbar.Button
            aria-label="Action 4"
            shape="circle"
            onClick={() => addLog('Action 4 clicked')}
          >
            <Button.Icon>
              <Symbol icon={sfArrowshapeTurnUpLeft} />
            </Button.Icon>
          </Toolbar.Button>
          <Toolbar.Button
            aria-label="Action 5"
            shape="circle"
            onClick={() => addLog('Action 5 clicked')}
          >
            <Button.Icon>
              <Symbol icon={sfSquareAndPencil} />
            </Button.Icon>
          </Toolbar.Button>
          <Toolbar.Button
            aria-label="Action 6"
            shape="circle"
            onClick={() => addLog('Action 6 clicked')}
          >
            <Button.Icon>
              <Symbol icon={sfTrash} />
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
    '[content]',
    externalContent,
    true,
  );
  const [controlRoot, propsRoot, stateRoot, elementKey] = usePropControl(
    propOptionsRoot,
    'root',
    externalRoot,
    true,
  );
  const [controlButton, buttonProps, stateButton] = usePropControl(
    useMemo(() => getPropOptionsButton(addLog, true), [addLog]),
    'button (first)',
    externalButton,
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
    'page control',
    externalPageControl,
  );

  return (
    <Component
      stretch
      baseUiId="toolbar"
      id={id}
      log={log}
      state={[stateContent, stateRoot, stateButton, statePageControl]}
      title="Toolbar (Page Dots)"
      controls={[
        controlContent,
        controlRoot,
        controlButton,
        controlPageControl,
      ]}
    >
      <Toolbar.Root
        key={elementKey}
        {...propsRoot}
      >
        <Toolbar.Leading>
          <Toolbar.Button
            aria-label="Folders"
            {...propsButton}
            shape={propsButton.shape ?? 'circle'}
          >
            <Button.Icon>
              <Symbol icon={sfFolder} />
            </Button.Icon>
          </Toolbar.Button>
        </Toolbar.Leading>
        <PageControl
          key={keyPageControl}
          count={content.pages}
          {...propsPageControl}
        />
        <Toolbar.Trailing>
          <Toolbar.Button
            aria-label="Share"
            shape="circle"
            onClick={() => addLog('Share clicked')}
          >
            <Button.Icon>
              <Symbol icon={sfSquareAndArrowUp} />
            </Button.Icon>
          </Toolbar.Button>
        </Toolbar.Trailing>
      </Toolbar.Root>
    </Component>
  );
};

/** A capsule of 2 to 6 symbols (Figma “_Button - Bottom”). */
export const ToolbarSymbolsDemo: FunctionComponent = () => {
  const id = 'toolbar-symbols';

  const [log, addLog] = useLog();
  const [externalContent, externalRoot, externalGroup, externalButton] =
    useProvidedState(id);

  const [controlContent, content, stateContent] = usePropControl(
    propOptionsSymbolsContent,
    '[content]',
    externalContent,
    true,
  );
  const [controlRoot, propsRoot, stateRoot, elementKey] = usePropControl(
    propOptionsRoot,
    'root',
    externalRoot,
    true,
  );
  const [controlGroup, propsGroup, stateGroup] = usePropControl(
    propOptionsGroup,
    'group',
    externalGroup,
    true,
  );
  // (In the capsule: what applies there.)
  const [controlButton, propsButton, stateButton] = usePropControl(
    useMemo(() => getPropOptionsButton(addLog, false), [addLog]),
    'button (first)',
    externalButton,
  );

  return (
    <Component
      stretch
      baseUiId="toolbar"
      controls={[controlContent, controlRoot, controlGroup, controlButton]}
      id={id}
      log={log}
      state={[stateContent, stateRoot, stateGroup, stateButton]}
      title="Toolbar (Symbols)"
    >
      <Toolbar.Root
        key={elementKey}
        {...propsRoot}
      >
        <Toolbar.Trailing>
          <Toolbar.Group {...propsGroup}>
            <Toolbar.Button
              aria-label="Action 1"
              {...propsButton}
              shape={propsButton.shape ?? 'circle'}
            >
              <Button.Icon>
                <Symbol icon={sfFolder} />
              </Button.Icon>
            </Toolbar.Button>
            <Toolbar.Button
              aria-label="Action 2"
              shape="circle"
              onClick={() => addLog('Action 2 clicked')}
            >
              <Button.Icon>
                <Symbol icon={sfFlag} />
              </Button.Icon>
            </Toolbar.Button>
            {content.symbols >= 3 ? (
              <Toolbar.Button
                aria-label="Action 3"
                shape="circle"
                onClick={() => addLog('Action 3 clicked')}
              >
                <Button.Icon>
                  <Symbol icon={sfArchivebox} />
                </Button.Icon>
              </Toolbar.Button>
            ) : null}
            {content.symbols >= 4 ? (
              <Toolbar.Button
                aria-label="Action 4"
                shape="circle"
                onClick={() => addLog('Action 4 clicked')}
              >
                <Button.Icon>
                  <Symbol icon={sfArrowshapeTurnUpLeft} />
                </Button.Icon>
              </Toolbar.Button>
            ) : null}
            {content.symbols >= 5 ? (
              <Toolbar.Button
                aria-label="Action 5"
                shape="circle"
                onClick={() => addLog('Action 5 clicked')}
              >
                <Button.Icon>
                  <Symbol icon={sfSquareAndPencil} />
                </Button.Icon>
              </Toolbar.Button>
            ) : null}
            {content.symbols >= 6 ? (
              <Toolbar.Button
                aria-label="Action 6"
                shape="circle"
                onClick={() => addLog('Action 6 clicked')}
              >
                <Button.Icon>
                  <Symbol icon={sfTrash} />
                </Button.Icon>
              </Toolbar.Button>
            ) : null}
          </Toolbar.Group>
        </Toolbar.Trailing>
      </Toolbar.Root>
    </Component>
  );
};

/** Text buttons (Figma Text and Text - Primary). */
export const ToolbarTextDemo: FunctionComponent = () => {
  const id = 'toolbar-text';

  const [log, addLog] = useLog();
  const [externalRoot, externalButton] = useProvidedState(id);

  const [controlRoot, propsRoot, stateRoot, elementKey] = usePropControl(
    propOptionsRoot,
    'root',
    externalRoot,
    true,
  );
  const [controlButton, buttonProps, stateButton] = usePropControl(
    useMemo(() => getPropOptionsButton(addLog, true), [addLog]),
    'button (first)',
    externalButton,
  );
  // (Of its own: `prominent`, too.)
  const propsButton = buttonProps as ToolbarButtonProps;

  return (
    <Component
      stretch
      baseUiId="toolbar"
      controls={[controlRoot, controlButton]}
      id={id}
      log={log}
      state={[stateRoot, stateButton]}
      title="Toolbar (Text)"
    >
      <Toolbar.Root
        key={elementKey}
        {...propsRoot}
      >
        <Toolbar.Leading>
          <Toolbar.Button {...propsButton}>
            <Button.Label>Edit</Button.Label>
          </Toolbar.Button>
        </Toolbar.Leading>
        <Toolbar.Trailing>
          <Toolbar.Button
            prominent
            onClick={() => addLog('Done clicked')}
          >
            <Button.Label>Done</Button.Label>
          </Toolbar.Button>
        </Toolbar.Trailing>
      </Toolbar.Root>
    </Component>
  );
};
