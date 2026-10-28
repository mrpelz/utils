import { contacts } from '../list/content.js';

// Content for the viewport's pages (see overview.tsx, …): rows enough to
// scroll a phone's screen.

/** People, as a list's rows. */
export const names: readonly string[] = Object.values(contacts).flat();

/** The planets, a page each: its name and facts (as a list's rows). */
export const planets: readonly (readonly [string, readonly string[]])[] = [
  [
    'Mercury',
    [
      'Closest to the Sun',
      'A year of 88 days',
      'No moons',
      'Smallest of the eight',
      'From −180 °C to 430 °C',
    ],
  ],
  [
    'Venus',
    [
      'Hottest of the eight',
      'Turns backwards',
      'A day longer than its year',
      'Clouds of sulfuric acid',
      'Brightest in the night sky',
    ],
  ],
  [
    'Earth',
    [
      'Liquid water on its surface',
      'One moon',
      'A year of 365 days',
      'Densest of the eight',
      'The only one known with life',
    ],
  ],
  [
    'Mars',
    [
      'Two moons: Phobos and Deimos',
      'Olympus Mons, the tallest volcano',
      'A day of 24 h 37 min',
      'Red from iron oxide',
      'Polar caps of ice',
    ],
  ],
  [
    'Jupiter',
    [
      'Largest of the eight',
      'The Great Red Spot',
      'Ninety-odd moons',
      'A day under 10 hours',
      'Faint rings',
    ],
  ],
  [
    'Saturn',
    [
      'Rings of ice and rock',
      'Less dense than water',
      'Titan, with an atmosphere',
      'Winds of 1,800 km/h',
      'A year of 29 Earth years',
    ],
  ],
  [
    'Uranus',
    [
      'Rolls on its side',
      'Coldest atmosphere of the eight',
      'Moons named for Shakespeare’s characters',
      'Dark, faint rings',
      'A year of 84 Earth years',
    ],
  ],
  [
    'Neptune',
    [
      'Farthest from the Sun',
      'Fastest winds: 2,100 km/h',
      'Found by mathematics first',
      'Triton orbits it backwards',
      'A year of 165 Earth years',
    ],
  ],
  // (Not one of the eight since 2006: its page drawn otherwise.)
  [
    'Pluto',
    [
      'A dwarf planet since 2006',
      'A heart of nitrogen ice',
      'Charon, half its size',
      'Smaller than our Moon',
      'Not one orbit since its discovery',
    ],
  ],
];
