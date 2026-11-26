import type { ReactNode } from 'react';

import { Button } from '../../../components/index.js';

/** A stack's example children: buttons, labeled. */
const labels = ['Share', 'Duplicate', 'Move', 'Rename', 'Archive', 'Delete'];

/** The first `count` example buttons. */
export const buttons = (count: number): ReactNode[] =>
  labels.slice(0, count).map((label) => (
    <Button.Root
      key={label}
      disabled={false}
      variant="bordered"
    >
      <Button.Label>{label}</Button.Label>
    </Button.Root>
  ));
