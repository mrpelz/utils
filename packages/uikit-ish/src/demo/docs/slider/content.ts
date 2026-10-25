import { sfHareFill } from '@bradleyhodges/sfsymbols/sfHareFill';
import { sfSunMax } from '@bradleyhodges/sfsymbols/sfSunMax';
import { sfSunMin } from '@bradleyhodges/sfsymbols/sfSunMin';
import { sfTortoiseFill } from '@bradleyhodges/sfsymbols/sfTortoiseFill';

/** What a slider sets, with its ends' symbols: name, min, max. */
export const symbolPairs = {
  brightness: ['Brightness', sfSunMin, sfSunMax],
  speed: ['Speed', sfTortoiseFill, sfHareFill],
} as const;

/** A time in seconds as m:ss. */
export const time = (seconds: number): string =>
  `${String(Math.floor(seconds / 60))}:${String(Math.floor(seconds % 60)).padStart(2, '0')}`;
