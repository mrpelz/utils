import {
  Children,
  isValidElement,
  type ReactElement,
  type ReactNode,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';

import {
  gridIcons,
  reflowDuration,
  reflowEasing,
  startWithFrame,
  useGridItem,
} from '../grid/main.js';
import { List } from '../list/main.js';
import { Symbol } from '../symbol/main.js';
import { cn, reducedMotionOf } from '../utils/main.js';
import type { CardRowProps, CardRowsProps } from './props.js';
import { CornerButton } from './root.js';

// A card's rows (`Card.Rows` of `Card.Row`s): a glass list in a well at
// its bottom, as many rows as fit whole; its last row, while some are left
// out, counting them (expanding or opening its tile, by its grid item).

/**
 * How many rows of its list fit in it whole (its box filling its room in
 * the card, see Card; a row's height its `--uikit-list-row-min-height`, as
 * Card sets it, opened above the page too): by its height, at least one;
 * as the card's size changes too.
 */
const rowsIn = (list: HTMLElement) => {
  const row =
    Number.parseFloat(
      getComputedStyle(list).getPropertyValue('--uikit-list-row-min-height'),
    ) || 30;
  return Math.max(1, Math.floor(list.clientHeight / row));
};

/**
 * Reads to do once a commit's layout effects have all run (a microtask,
 * still before it's painted): together, so the page is styled and laid out
 * for them once, not once per card between other effects' changes (e.g.
 * a page of many cards with rows pushed).
 */
const pendingReads = new Set<() => void>();
const readTogether = (read: () => void) => {
  if (pendingReads.size === 0) {
    queueMicrotask(() => {
      const reads = [...pendingReads];
      pendingReads.clear();
      for (const each of reads) each();
    });
  }
  pendingReads.add(read);
};

const useRowsThatFit = () => {
  const [list, setList] = useState<HTMLElement | null>(null);
  const [count, setCount] = useState(1);
  useLayoutEffect(() => {
    if (!list) return undefined;
    const observer = new ResizeObserver(() => setCount(rowsIn(list)));
    observer.observe(list);
    return () => observer.disconnect();
  }, [list]);
  // (Also after each render, before it's painted: its tile resized in it
  // (e.g. collapsed), its rows counted at once, not a frame late (a frame
  // of the rows of the size it had, its last row a new one after).)
  // (Read with the others' (see `readTogether`): still before it's
  // painted.)
  useLayoutEffect(() => {
    if (!list) return undefined;
    const read = () => {
      if (list.isConnected) setCount(rowsIn(list));
    };
    readTogether(read);
    return () => {
      pendingReads.delete(read);
    };
  });
  return [setList, count, list] as const;
};

/** Its last row's height's animation (see `useLastRowHeight`). */
const lastRowId = 'uikit-card-rows-last-row';

/**
 * Its list's last row's height changing with how many rows there are (one
 * only: taller, see Card), as its tile reshapes (Grid's reflow: its
 * duration and easing): from the height it had, animated, started with
 * the frames (see Grid's `startWithFrame`: a long task laying the page out
 * anew, e.g. its tile expanding, not past it already, as a transition
 * would be).
 */
const useLastRowHeight = (list: HTMLElement | null, count: number): void => {
  const last = useRef<{ count: number; height: string } | undefined>(undefined);
  // (Read with the others' (see `readTogether`): still before it's
  // painted, its animation starting with its frame.)
  useLayoutEffect(() => {
    const measure = () => {
      const row = list?.isConnected
        ? list.querySelector<HTMLElement>(
            ':scope .uikit-list-item:last-child .uikit-list-row',
          )
        : null;
      if (!row) {
        last.current = undefined;
        return;
      }
      for (const animation of row.getAnimations()) {
        if (animation.id === lastRowId) animation.cancel();
      }
      const height = getComputedStyle(row).minHeight;
      const before = last.current;
      last.current = { count, height };
      if (
        !before ||
        before.count === count ||
        before.height === height ||
        reducedMotionOf(row).matches
      ) {
        return;
      }
      startWithFrame(
        row.animate([{ minHeight: before.height }, { minHeight: height }], {
          duration: reflowDuration,
          easing: reflowEasing,
          id: lastRowId,
        }),
      );
    };
    readTogether(measure);
    return () => {
      pendingReads.delete(measure);
    };
  }, [count, list]);
};

/** What its list's last row does, if anything (see `Rows`). */
type RowsAction =
  | { kind: 'expand' | 'less' | 'open'; onPress: () => void }
  | { kind: 'more'; onPress?: undefined };

const actionIcons = {
  expand: gridIcons.expand,
  less: gridIcons.collapse,
  more: undefined,
  open: gridIcons.open,
} as const;

/**
 * What its last row does (see `Rows`), by its grid item: open above the
 * page, none; expanded, making it small again; rows left out, expanding
 * it (only where that'd change its size, as `ExpandButton`), else opening
 * it (an item that opens), else only counting them; none.
 */
const useRowsAction = (isLeftOut: boolean): RowsAction | undefined => {
  const item = useGridItem();
  if (!item || item.open) return undefined;
  const { expandedSize } = item;
  const canExpand =
    expandedSize !== undefined &&
    item.sizeOf(item.requested).size !== item.sizeOf(expandedSize).size;
  if (canExpand && item.expanded) {
    return { kind: 'less', onPress: () => item.setExpanded(false) };
  }
  if (!isLeftOut) return undefined;
  if (canExpand) {
    return { kind: 'expand', onPress: () => item.setExpanded(true) };
  }
  return item.canOpen
    ? { kind: 'open', onPress: () => item.setOpen(true) }
    : { kind: 'more' };
};

/**
 * Its last row (see `Rows`): its label where its rows' are (after their
 * symbols' room, if they have them), pressed doing its action; the corner
 * symbol for it where a value is.
 */
const ActionRow = ({
  action,
  hasIcons,
  label,
}: {
  action: RowsAction;
  hasIcons: boolean;
  label: string;
}): ReactNode => {
  const icon = actionIcons[action.kind];
  const isExpanding = action.kind === 'expand' || action.kind === 'less';
  return (
    <List.Item data-card-part="rows-action">
      {hasIcons ? (
        <List.Leading>
          <List.Image variant="symbol" />
        </List.Leading>
      ) : null}
      <List.Content>
        <List.Title
          render={
            action.onPress ? (
              <button
                aria-expanded={isExpanding ? action.kind === 'less' : undefined}
                type="button"
                onClick={action.onPress}
              />
            ) : undefined
          }
        >
          {label}
        </List.Title>
      </List.Content>
      {icon ? (
        <List.Trailing>
          <List.Detail>
            <Symbol icon={icon} />
          </List.Detail>
        </List.Trailing>
      ) : null}
    </List.Item>
  );
};

/**
 * A card's row (in its `Rows`): its symbol (optional), its label (its
 * children), its value; pressed (`onClick`), its label a button, a
 * chevron after its value (List's `DrillIn`), its row its hit area.
 */
export const Row = ({
  children,
  icon,
  onClick,
  value,
  ...props
}: CardRowProps): ReactNode => (
  <List.Item
    {...props}
    data-card-part="row"
  >
    {icon ? (
      <List.Leading>
        <List.Image variant="symbol">
          <Symbol icon={icon} />
        </List.Image>
      </List.Leading>
    ) : null}
    <List.Content>
      <List.Title
        render={
          onClick ? (
            <button
              type="button"
              onClick={onClick}
            />
          ) : undefined
        }
      >
        {children}
      </List.Title>
    </List.Content>
    <List.Trailing>
      {value === undefined ? null : <List.Detail>{value}</List.Detail>}
      {onClick ? <List.DrillIn /> : null}
    </List.Trailing>
  </List.Item>
);

/**
 * A card's rows (e.g. a room's, a device's details): a glass list (inset
 * grouped, see Card) of its `Row`s in a well at its bottom, as many as fit
 * whole. Rows left out, its last row counts them (`getMoreLabel`),
 * expanding its tile (its grid item's `expandedSize`) or opening it (an
 * item with an `openSize`); expanded, it makes it small again
 * (`lessLabel`). Its last row's action is also a corner button over it, for
 * its large hit area. None, nothing.
 */
export const Rows = ({
  children,
  className,
  getMoreLabel = (count) => `${String(count)} more`,
  lessLabel = 'Less',
  ...props
}: CardRowsProps): ReactNode => {
  const rows = Children.toArray(children).filter((child) =>
    isValidElement(child),
  ) as ReactElement<CardRowProps>[];
  const [list, fit, listElement] = useRowsThatFit();
  const action = useRowsAction(rows.length > fit);
  // (Its last row the action's, if any: one row less.)
  const shown = action ? rows.slice(0, fit - 1) : rows.slice(0, fit);
  useLastRowHeight(listElement, shown.length + (action ? 1 : 0));
  if (rows.length === 0) return null;
  return (
    <>
      <List.Root
        {...props}
        ref={list}
        className={cn('uikit-card-rows', className)}
        data-card-part="rows"
      >
        <List.Section>
          <List.Group>
            {shown}
            {action ? (
              // (Keyed: the same row however many come before it, its
              // height animated, see `useLastRowHeight`.)
              <ActionRow
                key="action"
                action={action}
                hasIcons={rows.some((row) => row.props.icon !== undefined)}
                label={
                  action.kind === 'less'
                    ? lessLabel
                    : getMoreLabel(rows.length - shown.length)
                }
              />
            ) : null}
          </List.Group>
        </List.Section>
      </List.Root>
      {/* (Its last row's action, also a corner button over it, not drawn
          (its row draws its symbol there): a corner button's large hit
          area; for pointers only, the row's button for keys and assistive
          technology.) */}
      {action?.onPress ? (
        <CornerButton
          aria-hidden
          className="uikit-card-rows-hit-area"
          icon={actionIcons[action.kind] ?? gridIcons.open}
          tabIndex={-1}
          onClick={action.onPress}
        />
      ) : null}
    </>
  );
};
