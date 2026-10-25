import { sfEnvelope } from '@bradleyhodges/sfsymbols/sfEnvelope';
import { sfGearshape } from '@bradleyhodges/sfsymbols/sfGearshape';

// Content for the navigation's demos (see main.tsx, overview.tsx, …).

/** The demos' pages: their titles and the pages they drill into. */
export const pages: Record<string, { children: string[]; title: string }> = {
  about: { children: [], title: 'About' },
  general: { children: ['about', 'update'], title: 'General' },
  inbox: { children: ['message'], title: 'Inbox' },
  location: { children: [], title: 'Location Services' },
  mail: { children: ['inbox', 'sent'], title: 'Mailboxes' },
  message: { children: [], title: 'Message' },
  privacy: { children: ['location'], title: 'Privacy & Security' },
  sent: { children: [], title: 'Sent' },
  settings: { children: ['general', 'privacy'], title: 'Settings' },
  update: { children: [], title: 'Software Update' },
};

/**
 * The apps' sections, each a stack of its own (from its root page, see
 * `pages`): value, label, symbol.
 */
export const sections = [
  ['settings', 'Settings', sfGearshape],
  ['mail', 'Mail', sfEnvelope],
] as const;

export type SectionValue = (typeof sections)[number][0];
