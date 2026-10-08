import { styled } from 'goober';
import {
  forwardRef,
  FunctionComponent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { EditMenu, Menu } from '../../components/index.js';
import { useLog } from '../utils/log.js';
import { commonPropOptions, Component, usePropControl } from '../utils/main.js';
import {
  useCreateStateUrl,
  useProvidedState,
} from '../utils/options-context.js';
import {
  getPropOptionsItems,
  getPropOptionsRoot,
  propOptionsContent,
  propOptionsMore,
  propOptionsPopup,
  propOptionsPositioner,
} from './props.js';

const Text = styled('p', forwardRef)`
  max-width: 320px;
  margin: 80px 0 0;
  font-size: 17px;
  line-height: 22px;
  /* stylelint-disable-next-line property-no-vendor-prefix */
  -webkit-user-select: text;
  user-select: text;
`;

const actions = ['Cut', 'Copy', 'Paste', 'Delete', 'Replace…', 'AutoFill'];

type VirtualAnchor = { getBoundingClientRect: () => DOMRect };

export const EditMenuDemo: FunctionComponent = () => {
  const id = 'edit-menu';

  const [log, addLog] = useLog();

  const [
    externalContent,
    externalRoot,
    externalPositioner,
    externalPopup,
    externalItem,
    externalMore,
    externalSubmenuPositioner,
    externalSubmenuPopup,
  ] = useProvidedState(id);
  const [text, setText] = useState<HTMLElement | null>(null);
  const [selection, setSelection] = useState<VirtualAnchor | null>(null);

  // Opens the edit menu above a text selection in the paragraph once it's
  // made: when the pointer is released, or after a pause (keyboard, touch:
  // selecting by touch cancels the pointer, the selection handles don't use
  // it); hidden while selecting. Selection changes keeping the range (e.g.
  // restored after the menu's focusing cleared it, in WebKit) are ignored,
  // and so are presses not changing it (e.g. outside the text, on content
  // that can't be selected): they only close the menu.
  useEffect(() => {
    let selecting = false;
    let timeout: ReturnType<typeof setTimeout> | undefined;
    let shown: Range | null = null;
    let changed = false;

    const current = () => {
      const documentSelection = document.getSelection();
      const range =
        documentSelection && documentSelection.rangeCount > 0
          ? documentSelection.getRangeAt(0)
          : null;

      return range &&
        !range.collapsed &&
        text?.contains(range.commonAncestorContainer)
        ? range.cloneRange()
        : null;
    };

    const isShown = (range: Range | null) =>
      shown !== null &&
      range !== null &&
      range.compareBoundaryPoints(Range.START_TO_START, shown) === 0 &&
      range.compareBoundaryPoints(Range.END_TO_END, shown) === 0;

    const hide = () => {
      shown = null;
      setSelection(null);
    };

    const update = () => {
      const range = current();
      shown = range;
      setSelection(
        range
          ? { getBoundingClientRect: () => range.getBoundingClientRect() }
          : null,
      );
    };

    const onPointerDown = ({ target }: PointerEvent) => {
      // Pressing the menu itself keeps it.
      if (target instanceof Element && target.closest('[role=menu]')) return;

      selecting = true;
      changed = false;
      hide();
    };

    const onPointerUp = () => {
      if (!selecting) return;
      selecting = false;
      if (changed) update();
    };

    const onPointerCancel = () => {
      selecting = false;
    };

    const onSelectionChange = () => {
      if (selecting) changed = true;
      if (selecting || isShown(current())) return;

      clearTimeout(timeout);
      hide();
      timeout = setTimeout(update, 500);
    };

    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('pointerup', onPointerUp);
    document.addEventListener('pointercancel', onPointerCancel);
    document.addEventListener('selectionchange', onSelectionChange);
    return () => {
      clearTimeout(timeout);
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('pointerup', onPointerUp);
      document.removeEventListener('pointercancel', onPointerCancel);
      document.removeEventListener('selectionchange', onSelectionChange);
    };
  }, [text]);

  const [controlContent, content, stateContent] = usePropControl(
    propOptionsContent,
    '[content]',
    externalContent,
    true,
  );

  const [controlRoot, propsRoot, stateRoot, RemounterRoot] = usePropControl(
    useMemo(() => getPropOptionsRoot(addLog), [addLog]),
    'root',
    externalRoot,
    true,
  );

  const [controlPositioner, propsPositioner, statePositioner] = usePropControl(
    propOptionsPositioner,
    'positioner',
    externalPositioner,
  );

  const [controlPopup, propsPopup, statePopup] = usePropControl(
    propOptionsPopup,
    'popup',
    externalPopup,
  );

  const [controlItem, propsItem, stateItem] = usePropControl(
    useMemo(() => getPropOptionsItems(addLog), [addLog]),
    'items',
    externalItem,
  );

  const [controlMore, propsMore, stateMore] = usePropControl(
    propOptionsMore,
    'more',
    externalMore,
  );

  const [
    controlSubmenuPositioner,
    propsSubmenuPositioner,
    stateSubmenuPositioner,
  ] = usePropControl(
    propOptionsPositioner,
    'more positioner',
    externalSubmenuPositioner,
  );

  const [controlSubmenuPopup, propsSubmenuPopup, stateSubmenuPopup] =
    usePropControl(commonPropOptions, 'more popup', externalSubmenuPopup);

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
      id={id}
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
      stateUrl={useCreateStateUrl(id, [
        stateContent,
        stateRoot,
        statePositioner,
        statePopup,
        stateItem,
        stateMore,
        stateSubmenuPositioner,
        stateSubmenuPopup,
      ])}
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
