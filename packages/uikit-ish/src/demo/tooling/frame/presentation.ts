import { isObject } from '@mrpelz/misc-utils/oop';
import { type ReactNode, useMemo } from 'react';

import { usePropControl } from './prop-control.js';
import { useProvidedState } from './state.js';

// A demo's device (its `[content]` group's `presentation`): a tablet by
// default, or a phone, e.g. a grid's items constrained to its few columns.

/** Its options: a tablet first, the default. */
const presentationOptions = {
  presentation: ['tablet', 'phone'] as const,
};

/** A demo's device (see above). */
export type Presentation = (typeof presentationOptions.presentation)[number];

/**
 * A demo's presentation control: its section (shown first among the
 * demo's), its device (the stage's), its state for the URL (found there by
 * its key, wherever it is: its state added last, the others' places
 * kept). Open on overview pages.
 */
export const usePresentation = (
  id: string,
  isOpen = false,
): readonly [ReactNode, Presentation, unknown] => {
  const provided = useProvidedState(id);
  const external = useMemo(
    () => provided.find((state) => isObject(state) && 'presentation' in state),
    [provided],
  );
  const [control, props, state] = usePropControl(presentationOptions, {
    external,
    isOpen,
    title: '[content]',
  });
  return [control, props.presentation ?? 'tablet', state] as const;
};
