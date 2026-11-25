import { createContext, forwardRef, type MouseEvent, useContext } from 'react';

import { measureOf } from '../grid/handle.js';
import { gridIcons, useGridItem } from '../grid/main.js';
import type {
  CardCloseButtonProps,
  CardExpandButtonProps,
  CardOpenButtonProps,
} from './props.js';
import { CornerButton } from './root.js';

// Corner buttons for what's more to a card: expanding its tile in place,
// opening it above the page, closing it there; each by its grid item's
// state (its `expanded`, its `open`), shown as it applies.

/**
 * A corner button expanding its card's tile in place and making it small
 * again (bottom trailing): its grid item's expansion (see `Grid.Item`'s
 * `expanded`, `expandedSize`). Its icon by where it goes (larger,
 * expanding; smaller, collapsing). Hidden where expanding changes nothing
 * (as its item would be either size now, the same; e.g. too few columns),
 * or outside an item with an expanded size.
 */
export const ExpandButton = forwardRef<
  HTMLButtonElement,
  CardExpandButtonProps
>(({ onClick, ...props }, ref) => {
  const item = useGridItem();
  const expandedSize = item?.expandedSize;
  const small = item?.sizeOf(item.requested).size;
  const large = expandedSize ? item?.sizeOf(expandedSize).size : undefined;
  const isExpanded = item?.expanded === true;
  const [from, to] = isExpanded ? [large, small] : [small, large];
  const isGrowing =
    from !== undefined && to !== undefined && measureOf(to) > measureOf(from);
  return (
    <CornerButton
      ref={ref}
      mirrored
      aria-expanded={isExpanded}
      icon={isGrowing ? gridIcons.expand : gridIcons.collapse}
      visible={large !== undefined && small !== large}
      {...props}
      onClick={(event: MouseEvent<HTMLButtonElement>) => {
        item?.setExpanded(!isExpanded);
        onClick?.(event);
      }}
    />
  );
});

/**
 * Whether a ready-made card holding an open button wants it shown (see
 * ControlCards' `Segmented`: only at its 1x1 size, its options hidden).
 * Internal.
 */
export const OpenButtonHintContext = createContext(true);

/**
 * A corner button opening its card's tile above the page (bottom
 * trailing): its grid item's `open` (see `Grid.Item`). Hidden while it's
 * open (and in a ready-made segmented card, while its options show).
 */
export const OpenButton = forwardRef<HTMLButtonElement, CardOpenButtonProps>(
  ({ onClick, ...props }, ref) => {
    const item = useGridItem();
    return (
      <CornerButton
        ref={ref}
        icon={gridIcons.open}
        visible={useContext(OpenButtonHintContext) && item?.open !== true}
        {...props}
        onClick={(event: MouseEvent<HTMLButtonElement>) => {
          item?.setOpen(true);
          onClick?.(event);
        }}
      />
    );
  },
);

/**
 * A corner button closing its card's tile opened above the page (top
 * trailing, clear of its symbol): its grid item's `open`. Shown only while
 * it's open.
 */
export const CloseButton = forwardRef<HTMLButtonElement, CardCloseButtonProps>(
  ({ onClick, ...props }, ref) => {
    const item = useGridItem();
    return (
      <CornerButton
        ref={ref}
        corner="top-trailing"
        icon={gridIcons.close}
        visible={item?.open === true}
        {...props}
        onClick={(event: MouseEvent<HTMLButtonElement>) => {
          item?.setOpen(false);
          onClick?.(event);
        }}
      />
    );
  },
);
