import { sfClockFill } from '@bradleyhodges/sfsymbols/sfClockFill';
import { sfHeartFill } from '@bradleyhodges/sfsymbols/sfHeartFill';
import { sfPersonCropCircleFill } from '@bradleyhodges/sfsymbols/sfPersonCropCircleFill';
import { sfRecordingtape } from '@bradleyhodges/sfsymbols/sfRecordingtape';

/**
 * The guide pages' tabs, Phone's: value, label, symbol (Figma's `star.fill`
 * for Favorites isn't in the symbols' catalogue: `heart.fill`). Data only:
 * the views write out their tab bars, so their code shows as it'd be used.
 */
export const phoneTabs = [
  ['favorites', 'Favorites', sfHeartFill],
  ['recents', 'Recents', sfClockFill],
  ['contacts', 'Contacts', sfPersonCropCircleFill],
  ['voicemail', 'Voicemail', sfRecordingtape],
] as const;

export const phoneTabValues: readonly string[] = phoneTabs.map(
  ([value]) => value,
);
