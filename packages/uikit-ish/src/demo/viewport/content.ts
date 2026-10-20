import { contacts } from '../list/content.js';

// Content for the viewport's pages (see overview.tsx, …): rows enough to
// scroll a phone's screen.

/** People, as a list's rows. */
export const names: readonly string[] = Object.values(contacts).flat();
