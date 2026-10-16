import type { ComponentProps } from 'react';

export type ActivityViewPersonProps = ComponentProps<'button'> & {
  /** How many people (a group's): shown below its name (e.g. “2 People”). */
  count?: string;
  /** Its name (e.g. first and last name, wrapping). */
  name: string;
};

export type ActivityViewActionProps = ComponentProps<'button'> & {
  /** Its label (e.g. “Add to Reading List”, wrapping). */
  label: string;
};
