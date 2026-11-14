import type { GridSize } from '../../../components/index.js';

// The guide pages' content: a home's devices, as tiles of a grid, each its
// name (its `dropName`), its size and its room.

export type Device = {
  readonly name: string;
  readonly room: 'Garden' | 'Kitchen' | 'Living Room';
  readonly size: GridSize;
};

export const devices: readonly Device[] = [
  { name: 'Lamp', room: 'Living Room', size: '1x1' },
  { name: 'Thermostat', room: 'Living Room', size: '2x2' },
  { name: 'Blinds', room: 'Living Room', size: '1x1' },
  { name: 'Speaker', room: 'Living Room', size: '2x1' },
  { name: 'Kettle', room: 'Kitchen', size: '1x1' },
  { name: 'Oven', room: 'Kitchen', size: '2x1' },
  { name: 'Fridge', room: 'Kitchen', size: '1x2' },
  { name: 'Lights', room: 'Kitchen', size: '1x1' },
  { name: 'Camera', room: 'Garden', size: '3x2' },
  { name: 'Sprinkler', room: 'Garden', size: '1x1' },
  { name: 'Gate', room: 'Garden', size: '1x1' },
];

/** The sizes the devices support (their content's, a constant). */
export const deviceSizes: readonly GridSize[] = [
  '1x1',
  '2x1',
  '1x2',
  '2x2',
  '3x2',
];

/** The rooms, in order. */
export const rooms = ['Living Room', 'Kitchen', 'Garden'] as const;

/** What the add tile offers. */
export const deviceKinds = ['Lamp', 'Switch', 'Sensor'] as const;
