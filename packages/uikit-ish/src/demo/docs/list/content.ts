import { sfAirplane, sfBellFill, sfWifi } from '../../tooling/icons.js';
// The List pages' content (data only), shared by its demos.

/** Settings rows: title, symbol, the image's color, detail, subtitle. */
export const settings = [
  {
    color: 'var(--color-ui-system-orange)',
    detail: 'Off',
    icon: sfAirplane,
    subtitle: 'Turns off radios',
    title: 'Airplane Mode',
  },
  {
    color: 'var(--color-ui-system-blue)',
    detail: 'Home',
    icon: sfWifi,
    subtitle: 'Connected',
    title: 'Wi-Fi',
  },
  {
    color: 'var(--color-ui-system-red)',
    detail: 'Immediate',
    icon: sfBellFill,
    subtitle: 'Banners, Sounds',
    title: 'Notifications',
  },
] as const;

/** Rows to edit: reordered, deleted, selected. */
export const planets = [
  'Mercury',
  'Venus',
  'Earth',
  'Mars',
  'Jupiter',
] as const;

/** Contacts by letter, for an index. */
export const contacts = {
  A: ['Aaron', 'Abigail', 'Adrian'],
  B: ['Bella', 'Benjamin'],
  C: ['Chloe'],
  D: ['Daniel', 'Dylan'],
  E: ['Ella', 'Emma'],
  F: ['Felix'],
  G: ['Grace'],
  H: ['Hannah', 'Henry'],
  I: ['Isaac'],
  J: ['Jack', 'Julia'],
  L: ['Leo', 'Lily'],
  M: ['Mia'],
  N: ['Noah'],
  O: ['Olivia', 'Oscar'],
  R: ['Ruby'],
  S: ['Samuel', 'Sophie'],
  T: ['Theo'],
  W: ['William'],
  Z: ['Zoe'],
};

/** An inbox's messages. */
export const messages = [
  {
    date: '10:00',
    from: 'Kate Brown',
    preview:
      'Hi! The photos from the weekend are finally in the shared album, have a look when you get a chance. Some of them turned out really well.',
    subject: 'Weekend photos',
  },
  {
    date: 'Yesterday',
    from: 'John Doe',
    preview:
      'Attached is the agenda for Thursday. Let me know if anything is missing before I send it to everyone else.',
    subject: 'Agenda for Thursday',
  },
  {
    date: 'Monday',
    from: 'Anna Hall',
    preview: 'Thanks, see you there!',
    subject: 'Re: Dinner',
  },
] as const;

/**
 * A settings app's pages, drilled into: their titles, and their rows
 * (title, the page it opens or its detail).
 */
export const settingsPages: Record<
  string,
  {
    rows: readonly (readonly [title: string, page?: string, detail?: string])[];
    title: string;
  }
> = {
  about: {
    rows: [
      ['Name', undefined, 'My Phone'],
      ['Software Version', undefined, '26.0'],
      ['Model Name', undefined, 'Phone Pro'],
    ],
    title: 'About',
  },
  general: {
    rows: [
      ['About', 'about'],
      ['Software Update', 'update'],
      ['Storage', 'storage'],
    ],
    title: 'General',
  },
  privacy: {
    rows: [
      ['Location Services', undefined, 'On'],
      ['Tracking', undefined, 'Off'],
    ],
    title: 'Privacy & Security',
  },
  settings: {
    rows: [
      ['General', 'general'],
      ['Privacy & Security', 'privacy'],
    ],
    title: 'Settings',
  },
  storage: {
    rows: [
      ['Photos', undefined, '12.4 GB'],
      ['Music', undefined, '3.1 GB'],
    ],
    title: 'Storage',
  },
  update: {
    rows: [['Automatic Updates', undefined, 'On']],
    title: 'Software Update',
  },
};
