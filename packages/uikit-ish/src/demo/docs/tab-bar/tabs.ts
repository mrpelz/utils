import {
  sfClockFill,
  sfHeartFill,
  sfPersonCropCircleFill,
  sfRecordingtape,
} from '../../tooling/icons.js';

/**
 * The guide pages' tabs, Phone's: value, label, symbol. Data only:
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
