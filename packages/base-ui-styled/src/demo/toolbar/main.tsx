import { sfArchivebox } from '@bradleyhodges/sfsymbols/sfArchivebox';
import { sfArrowshapeTurnUpLeft } from '@bradleyhodges/sfsymbols/sfArrowshapeTurnUpLeft';
import { sfFlag } from '@bradleyhodges/sfsymbols/sfFlag';
import { sfFolder } from '@bradleyhodges/sfsymbols/sfFolder';
import { sfSquareAndArrowUp } from '@bradleyhodges/sfsymbols/sfSquareAndArrowUp';
import { sfSquareAndPencil } from '@bradleyhodges/sfsymbols/sfSquareAndPencil';
import { sfTrash } from '@bradleyhodges/sfsymbols/sfTrash';
import { IconDefinition } from '@bradleyhodges/sfsymbols-react/types';
import { FunctionComponent, ReactNode, useMemo } from 'react';

import {
  Button,
  PageControl,
  Toolbar,
  ToolbarButtonProps,
} from '../../components/index.js';
import { useLog } from '../utils/log.js';
import { Component, usePropControl } from '../utils/main.js';
import {
  useCreateStateUrl,
  useProvidedState,
} from '../utils/options-context.js';
import { SFSymbol } from '../utils/symbol.js';
import {
  getPropOptionsButton,
  getPropOptionsPageControl,
  Layout,
  propOptionsContent,
  propOptionsGroup,
  propOptionsRoot,
} from './props.js';

const symbols = [
  sfFolder,
  sfFlag,
  sfArchivebox,
  sfArrowshapeTurnUpLeft,
  sfSquareAndPencil,
  sfTrash,
];

type Preset = { id: string; layout: Layout; title: string };

/**
 * A toolbar (UIKit `UIToolbar`, Figma “Toolbar - Bottom”) in one of its
 * layouts: glass buttons at its sides, page dots between them, or a capsule
 * of buttons. The button control applies to the first button.
 */
const ToolbarDemoBase: FunctionComponent<{ preset: Preset }> = ({ preset }) => {
  const { id, layout } = preset;
  const [log, addLog] = useLog();

  const [
    externalContent,
    externalRoot,
    externalGroup,
    externalButton,
    externalPageControl,
  ] = useProvidedState(id);

  const [controlContent, content, stateContent] = usePropControl(
    propOptionsContent[layout],
    '[content]',
    externalContent,
    true,
  );

  const [controlRoot, propsRoot, stateRoot, RemounterRoot] = usePropControl(
    propOptionsRoot,
    'root',
    externalRoot,
    true,
  );

  const [controlGroup, propsGroup, stateGroup] = usePropControl(
    propOptionsGroup,
    'group',
    externalGroup,
  );

  // Of its own in all but the symbols' capsule.
  const [controlButton, propsButtonControlled, stateButton] = usePropControl(
    useMemo(
      () => getPropOptionsButton(addLog, layout !== 'symbols'),
      [addLog, layout],
    ),
    'button (first)',
    externalButton,
  );
  // `prominent` only of its own (see `getPropOptionsButton`).
  const propsButton = propsButtonControlled as ToolbarButtonProps;

  const [controlPageControl, propsPageControl, statePageControl] =
    usePropControl(
      useMemo(() => getPropOptionsPageControl(addLog), [addLog]),
      'page control',
      externalPageControl,
    );

  const symbolButton = (
    icon: IconDefinition,
    label: string,
    props?: ToolbarButtonProps,
  ) => (
    <Toolbar.Button
      key={label}
      aria-label={label}
      shape="circle"
      onClick={() => addLog(`${label} clicked`)}
      {...props}
    >
      <Button.Symbol>
        <SFSymbol icon={icon} />
      </Button.Symbol>
    </Toolbar.Button>
  );

  const { pages = 5, symbols: count = 3 } = content as {
    pages?: number;
    symbols?: number;
  };

  const layouts: Record<Layout, () => ReactNode> = {
    // Figma Type=Buttons: three glass buttons at each side.
    buttons: () => (
      <>
        <Toolbar.Leading>
          {symbols
            .slice(0, 3)
            .map((icon, index) =>
              symbolButton(
                icon,
                `Action ${index + 1}`,
                index === 0 ? propsButton : undefined,
              ),
            )}
        </Toolbar.Leading>
        <Toolbar.Trailing>
          {symbols
            .slice(3)
            .map((icon, index) => symbolButton(icon, `Action ${index + 4}`))}
        </Toolbar.Trailing>
      </>
    ),
    // Figma Type=Buttons + Page Dots.
    pageDots: () => (
      <>
        <Toolbar.Leading>
          {symbolButton(sfFolder, 'Folders', propsButton)}
        </Toolbar.Leading>
        <PageControl
          count={pages}
          {...propsPageControl}
        />
        <Toolbar.Trailing>
          {symbolButton(sfSquareAndArrowUp, 'Share')}
        </Toolbar.Trailing>
      </>
    ),
    // Figma “_Button - Bottom”, 2 to 6 Symbols: one capsule.
    symbols: () => (
      <Toolbar.Trailing>
        <Toolbar.Group {...propsGroup}>
          {symbols
            .slice(0, count)
            .map((icon, index) =>
              symbolButton(
                icon,
                `Action ${index + 1}`,
                index === 0 ? propsButton : undefined,
              ),
            )}
        </Toolbar.Group>
      </Toolbar.Trailing>
    ),
    // Figma Text and Text - Primary.
    text: () => (
      <>
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
      </>
    ),
  };

  // Controls only for the parts the layout has.
  const parts = {
    group: layout === 'symbols',
    pageControl: layout === 'pageDots',
  };

  return (
    <Component
      stretch
      baseUiId="toolbar"
      id={id}
      log={log}
      title={preset.title}
      controls={[
        controlContent,
        controlRoot,
        parts.group ? controlGroup : null,
        controlButton,
        parts.pageControl ? controlPageControl : null,
      ]}
      stateUrl={useCreateStateUrl(id, [
        stateContent,
        stateRoot,
        stateGroup,
        stateButton,
        statePageControl,
      ])}
    >
      <RemounterRoot>
        <Toolbar.Root {...propsRoot}>{layouts[layout]()}</Toolbar.Root>
      </RemounterRoot>
    </Component>
  );
};

export const ToolbarDemo: FunctionComponent = () => (
  <ToolbarDemoBase
    preset={{ id: 'toolbar', layout: 'buttons', title: 'Toolbar' }}
  />
);

export const ToolbarPageDotsDemo: FunctionComponent = () => (
  <ToolbarDemoBase
    preset={{
      id: 'toolbar-page-dots',
      layout: 'pageDots',
      title: 'Toolbar (Page Dots)',
    }}
  />
);

export const ToolbarSymbolsDemo: FunctionComponent = () => (
  <ToolbarDemoBase
    preset={{
      id: 'toolbar-symbols',
      layout: 'symbols',
      title: 'Toolbar (Symbols)',
    }}
  />
);

export const ToolbarTextDemo: FunctionComponent = () => (
  <ToolbarDemoBase
    preset={{ id: 'toolbar-text', layout: 'text', title: 'Toolbar (Text)' }}
  />
);
