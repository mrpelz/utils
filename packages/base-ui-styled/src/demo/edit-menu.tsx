import { Menu as BaseMenu } from '@base-ui/react/menu';
import { styled } from 'goober';
import {
  forwardRef,
  FunctionComponent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { EditMenu, Menu } from '../components/index.js';
import {
  commonPropOptions,
  Component,
  MappedProp,
  useLog,
  usePropControl,
} from './utils/main.js';

const Text = styled('p', forwardRef)`
  max-width: 320px;
  margin: 80px 0 0;
  font-size: 17px;
  line-height: 22px;
`;

const propOptionsContent = {
  actions: [6, 1, 2, 3, 4, 5] as const,
  more: [true, false] as const,
} as const;

const propOptionsPositioner = {
  ...commonPropOptions,
  side: [undefined, 'top', 'bottom'] as const,
  align: [undefined, 'start', 'center', 'end'] as const,
  sideOffset: [undefined, 0, 8, 16] as const,
};

const propOptionsItem = {
  ...commonPropOptions,
  disabled: [undefined, false, true] as const,
  destructive: [undefined, false, true] as const,
  cursor: [undefined, 'auto', 'pointer', 'copy'] as const,
  closeOnClick: [undefined, false, true] as const,
};

const actions = ['Cut', 'Copy', 'Paste', 'Delete', 'Replace…', 'AutoFill'];

type VirtualAnchor = { getBoundingClientRect: () => DOMRect };

export const EditMenuDemo: FunctionComponent = () => {
  const [log, addLog] = useLog();
  const [text, setText] = useState<HTMLElement | null>(null);
  const [selection, setSelection] = useState<VirtualAnchor | null>(null);

  // Opens the edit menu above a text selection in the paragraph.
  // Opens the edit menu above a text selection in the paragraph once it's
  // made: when the pointer is released, or after a pause (keyboard); hidden
  // while selecting.
  useEffect(() => {
    let selecting = false;
    let timeout: ReturnType<typeof setTimeout> | undefined;

    const update = () => {
      const current = document.getSelection();
      const range =
        current && current.rangeCount > 0 ? current.getRangeAt(0) : null;

      setSelection(
        range &&
          !range.collapsed &&
          text?.contains(range.commonAncestorContainer)
          ? { getBoundingClientRect: () => range.getBoundingClientRect() }
          : null,
      );
    };

    const onPointerDown = () => {
      selecting = true;
      setSelection(null);
    };

    const onPointerUp = () => {
      if (!selecting) return;
      selecting = false;
      update();
    };

    const onSelectionChange = () => {
      clearTimeout(timeout);
      if (selecting) return;
      setSelection(null);
      timeout = setTimeout(update, 500);
    };

    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('pointerup', onPointerUp);
    document.addEventListener('selectionchange', onSelectionChange);
    return () => {
      clearTimeout(timeout);
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('pointerup', onPointerUp);
      document.removeEventListener('selectionchange', onSelectionChange);
    };
  }, [text]);

  const [controlContent, content] = usePropControl(
    propOptionsContent,
    '[content]',
    true,
  );

  const [controlRoot, propsRoot, RemounterRoot] = usePropControl(
    useMemo(
      () => ({
        open: [undefined, true] as const,
        modal: [false, true, undefined] as const,
        loopFocus: [undefined, false, true] as const,
        onOpenChange: [
          new MappedProp(
            (open: boolean, { reason }: BaseMenu.Root.ChangeEventDetails) =>
              addLog(`open change: ${String(open)}/${reason}`),
            '[log change]',
          ),
          undefined,
        ] as const,
      }),
      [addLog],
    ),
    'root',
    true,
  );

  const [controlPositioner, propsPositioner] = usePropControl(
    propOptionsPositioner,
    'positioner',
  );

  const [controlPopup, propsPopup] = usePropControl(
    useMemo(
      () => ({
        ...commonPropOptions,
        finalFocus: [undefined, false, true] as const,
      }),
      [],
    ),
    'popup',
  );

  const [controlItem, propsItem] = usePropControl(
    useMemo(
      () => ({
        ...propOptionsItem,
        onClick: [
          new MappedProp(() => addLog('item clicked'), '[log click]'),
          undefined,
        ] as const,
      }),
      [addLog],
    ),
    'items',
  );

  const [controlMore, propsMore] = usePropControl(
    useMemo(
      () => ({
        ...commonPropOptions,
        disabled: [undefined, false, true] as const,
        openOnHover: [undefined, false, true] as const,
        cursor: [undefined, 'auto', 'pointer', 'copy'] as const,
      }),
      [],
    ),
    'more',
  );

  const [controlSubmenuPositioner, propsSubmenuPositioner] = usePropControl(
    propOptionsPositioner,
    'more positioner',
  );

  const [controlSubmenuPopup, propsSubmenuPopup] = usePropControl(
    commonPropOptions,
    'more popup',
  );

  const { onOpenChange, open, ...rootProps } = propsRoot;

  const handleOpenChange = useCallback(
    (...args: Parameters<NonNullable<typeof onOpenChange>>) => {
      onOpenChange?.(...args);
      if (!args[0]) setSelection(null);
    },
    [onOpenChange],
  );

  return (
    <Component
      center
      baseUiId="menu"
      id="edit-menu"
      log={log}
      title="Edit Menu"
      controls={[
        controlContent,
        controlRoot,
        controlPositioner,
        controlPopup,
        controlItem,
        controlMore,
        controlSubmenuPositioner,
        controlSubmenuPopup,
      ]}
    >
      <RemounterRoot>
        <EditMenu.Root
          {...rootProps}
          open={open ?? selection !== null}
          onOpenChange={handleOpenChange}
        >
          <Text ref={setText}>
            Select some of this text to show the edit menu above the selection.
            It holds the actions for the selection, and more of them behind the
            chevron.
          </Text>
          <EditMenu.Portal>
            <EditMenu.Positioner
              anchor={selection ?? text}
              {...propsPositioner}
            >
              <EditMenu.Popup {...propsPopup}>
                {actions.slice(0, content.actions).map((action) => (
                  <EditMenu.Item
                    key={action}
                    {...propsItem}
                    destructive={propsItem.destructive ?? action === 'Delete'}
                  >
                    {action}
                  </EditMenu.Item>
                ))}
                {content.more ? (
                  <Menu.SubmenuRoot>
                    <EditMenu.More {...propsMore} />
                    <Menu.Portal>
                      <Menu.Positioner {...propsSubmenuPositioner}>
                        <Menu.Popup {...propsSubmenuPopup}>
                          {['Look Up', 'Translate', 'Share…'].map((action) => (
                            <Menu.Item
                              key={action}
                              {...propsItem}
                            >
                              <Menu.Label>{action}</Menu.Label>
                            </Menu.Item>
                          ))}
                        </Menu.Popup>
                      </Menu.Positioner>
                    </Menu.Portal>
                  </Menu.SubmenuRoot>
                ) : null}
              </EditMenu.Popup>
            </EditMenu.Positioner>
          </EditMenu.Portal>
        </EditMenu.Root>
      </RemounterRoot>
    </Component>
  );
};
