import { useState } from 'react';

// A row's swipe actions, by a handle (see `SwipeActions`): opened and closed
// from anywhere, e.g. by a `SwipeActionsTrigger` given it, as Base UI's
// handles link a trigger to its dialog. The actions attach to it while
// they're mounted.

/** What a row's swipe actions on one side do for their handle. */
export type SwipeActionsTarget = {
  close: () => void;
  isOpen: () => boolean;
  open: () => void;
};

/**
 * A row's swipe actions on one side, by a handle
 * (`List.createSwipeActionsHandle`, in a component
 * `useCreateSwipeActionsHandle`): given to them (`handle`), and to the
 * triggers opening them (`List.SwipeActionsTrigger`), or used imperatively.
 */
export class ListSwipeActionsHandle {
  #target: SwipeActionsTarget | undefined;

  /** Open (the row swiped to show them). */
  get isOpen(): boolean {
    return this.#target?.isOpen() ?? false;
  }

  /**
   * Attaches the actions (see `SwipeActions`); returns what detaches them.
   * @internal
   */
  attach(target: SwipeActionsTarget): () => void {
    this.#target = target;
    return () => {
      if (this.#target === target) this.#target = undefined;
    };
  }

  /** Closes them (the row swiped back). */
  close(): void {
    this.#target?.close();
  }

  /** Opens them (the row swiped to show them; another row's close). */
  open(): void {
    this.#target?.open();
  }
}

/** A handle to a row's swipe actions, made once (see above). */
export const createSwipeActionsHandle = (): ListSwipeActionsHandle =>
  new ListSwipeActionsHandle();

/**
 * `List.createSwipeActionsHandle`, in a component: made once, for its
 * lifetime.
 */
export const useCreateSwipeActionsHandle = (): ListSwipeActionsHandle => {
  const [handle] = useState(createSwipeActionsHandle);

  return handle;
};
