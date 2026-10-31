import type { SymbolIcon } from '../../components/index.js';

// The demos' icons: SF Symbols, Apple's, not this library's (it ships no
// icons; `Symbol` draws any icon of `SymbolIcon`'s shape). Neither bundled
// nor installed: each loaded from unpkg on demand, a module of the package
// `@bradleyhodges/sfsymbols` (at a fixed version), the demos' ones before
// the demo renders (also when prerendering, in Node; see `iconsLoaded`).

/** The icons' package, as imported (e.g. as a symbol's import is copied). */
export const iconPackage = '@bradleyhodges/sfsymbols';

const iconBase = `https://unpkg.com/${iconPackage}@8.1.3/dist/module`;

/** An icon, as its module has it: also its export's name (e.g. `sfBell`). */
export type LoadedIcon = SymbolIcon & { iconName: string };

/**
 * The package's every icon's name (e.g. `sfBell`): read off its index (not
 * imported: that would load each icon's module).
 */
export const loadIconNames = async (): Promise<readonly string[]> => {
  const response = await fetch(`${iconBase}/index.js`);
  if (!response.ok) throw new Error(`index.js: ${String(response.status)}`);

  const index = await response.text();
  return [
    ...new Set(
      Array.from(
        index.matchAll(/"\.\/(?<name>sf\w+)\.js"/gu),
        ({ groups }) => groups?.name,
      ),
    ),
  ].filter((name) => name !== undefined);
};

/**
 * One of the package's modules (one importing nothing, e.g. an icon's):
 * fetched, then imported as a data URL (Node imports no https URLs).
 */
const importModule = async (file: string) => {
  const response = await fetch(`${iconBase}/${file}`);
  if (!response.ok) throw new Error(`${file}: ${String(response.status)}`);

  return (await import(
    /* webpackIgnore: true */ `data:text/javascript;charset=utf-8,${encodeURIComponent(await response.text())}`
  )) as Record<string, unknown>;
};

/** The package's categories: each its name, and its icons' names. */
export const loadIconCategories = async (): Promise<
  ReadonlyMap<string, readonly string[]>
> => {
  const { categoryMappings, uniqueCategories } = (await importModule(
    '_categories.js',
  )) as {
    categoryMappings: Record<string, readonly string[]>;
    uniqueCategories: readonly { key: string; name: string }[];
  };

  return new Map(
    uniqueCategories.map(({ key, name }) => [
      name,
      categoryMappings[key] ?? [],
    ]),
  );
};

const loading = new Map<string, Promise<LoadedIcon>>();

/** An icon by its name (e.g. `sfBell`), loaded once. */
export const loadIcon = (name: string): Promise<LoadedIcon> => {
  const known = loading.get(name);
  if (known) return known;

  const icon = importModule(`${name}.js`).then(({ [name]: loaded }) => {
    if (!loaded) throw new Error(`${name}: not exported`);
    return loaded as LoadedIcon;
  });

  loading.set(name, icon);
  return icon;
};

const names = [
  'sfAirplane',
  'sfArchivebox',
  'sfArchiveboxFill',
  'sfArrowDown',
  'sfArrowshapeTurnUpLeft',
  'sfArrowUp',
  'sfBackwardFill',
  'sfBell',
  'sfBellFill',
  'sfBold',
  'sfBook',
  'sfCalendar',
  'sfCheckmark',
  'sfCheckmarkCircleFill',
  'sfChevronBackward',
  'sfChevronRight',
  'sfChevronUpChevronDown',
  'sfCircleFill',
  'sfClock',
  'sfClockFill',
  'sfCloudFill',
  'sfDocument',
  'sfDocumentOnDocument',
  'sfEllipsis',
  'sfEnvelope',
  'sfEnvelopeBadgeFill',
  'sfEnvelopeFill',
  'sfEnvelopeOpenFill',
  'sfEye',
  'sfEyedropper',
  'sfEyeglasses',
  'sfFlag',
  'sfFlagFill',
  'sfFolder',
  'sfFolderBadgePlus',
  'sfFolderFill',
  'sfForwardFill',
  'sfGearshape',
  'sfGearshapeFill',
  'sfHareFill',
  'sfHeart',
  'sfHeartFill',
  'sfICircle',
  'sfIcloudSlash',
  'sfItalic',
  'sfLine3HorizontalDecreaseCircle',
  'sfLink',
  'sfListBullet',
  'sfLocationFill',
  'sfLockFill',
  'sfMagnifyingglass',
  'sfMap',
  'sfMappinAndEllipse',
  'sfMinus',
  'sfOpticaldisc',
  'sfPauseFill',
  'sfPencil',
  'sfPencilTipCropCircle',
  'sfPerson2',
  'sfPerson2Fill',
  'sfPersonCropCircle',
  'sfPersonCropCircleFill',
  'sfPersonFill',
  'sfPhoto',
  'sfPinFill',
  'sfPlayFill',
  'sfPlus',
  'sfPlusCircle',
  'sfPlusSquare',
  'sfPlusSquareOnSquare',
  'sfPrinter',
  'sfRecordingtape',
  'sfShuffle',
  'sfSpeakerFill',
  'sfSpeakerWave3Fill',
  'sfSquare',
  'sfSquareAndArrowUp',
  'sfSquareAndPencil',
  'sfSunMax',
  'sfSunMin',
  'sfTagFill',
  'sfTextBadgePlus',
  'sfTextformat',
  'sfTortoiseFill',
  'sfTrash',
  'sfTrashFill',
  'sfTray',
  'sfTrayFill',
  'sfUnderline',
  'sfWifi',
  'sfXmark',
] as const;

// The demos' icons: each an empty square (an em wide) until loaded, then
// filled in place (see `iconsLoaded`); unloaded (e.g. offline), it stays so.
const icons = Object.fromEntries(
  names.map((name): [string, SymbolIcon] => [
    name,
    { svgPathData: [], viewBox: '0 0 20 20' },
  ]),
) as Record<(typeof names)[number], SymbolIcon>;

/** The demos' icons loaded: awaited before the demo renders (see demo.tsx). */
export const iconsLoaded = Promise.all(
  names.map(async (name) => {
    const loaded = await loadIcon(name).catch(() => undefined);
    if (loaded) Object.assign(icons[name], loaded);
  }),
);

export const {
  sfAirplane,
  sfArchivebox,
  sfArchiveboxFill,
  sfArrowDown,
  sfArrowshapeTurnUpLeft,
  sfArrowUp,
  sfBackwardFill,
  sfBell,
  sfBellFill,
  sfBold,
  sfBook,
  sfCalendar,
  sfCheckmark,
  sfCheckmarkCircleFill,
  sfChevronBackward,
  sfChevronRight,
  sfChevronUpChevronDown,
  sfCircleFill,
  sfClock,
  sfClockFill,
  sfCloudFill,
  sfDocument,
  sfDocumentOnDocument,
  sfEllipsis,
  sfEnvelope,
  sfEnvelopeBadgeFill,
  sfEnvelopeFill,
  sfEnvelopeOpenFill,
  sfEye,
  sfEyedropper,
  sfEyeglasses,
  sfFlag,
  sfFlagFill,
  sfFolder,
  sfFolderBadgePlus,
  sfFolderFill,
  sfForwardFill,
  sfGearshape,
  sfGearshapeFill,
  sfHareFill,
  sfHeart,
  sfHeartFill,
  sfICircle,
  sfIcloudSlash,
  sfItalic,
  sfLine3HorizontalDecreaseCircle,
  sfLink,
  sfListBullet,
  sfLocationFill,
  sfLockFill,
  sfMagnifyingglass,
  sfMap,
  sfMappinAndEllipse,
  sfMinus,
  sfOpticaldisc,
  sfPauseFill,
  sfPencil,
  sfPencilTipCropCircle,
  sfPerson2,
  sfPerson2Fill,
  sfPersonCropCircle,
  sfPersonCropCircleFill,
  sfPersonFill,
  sfPhoto,
  sfPinFill,
  sfPlayFill,
  sfPlus,
  sfPlusCircle,
  sfPlusSquare,
  sfPlusSquareOnSquare,
  sfPrinter,
  sfRecordingtape,
  sfShuffle,
  sfSpeakerFill,
  sfSpeakerWave3Fill,
  sfSquare,
  sfSquareAndArrowUp,
  sfSquareAndPencil,
  sfSunMax,
  sfSunMin,
  sfTagFill,
  sfTextBadgePlus,
  sfTextformat,
  sfTortoiseFill,
  sfTrash,
  sfTrashFill,
  sfTray,
  sfTrayFill,
  sfUnderline,
  sfWifi,
  sfXmark,
} = icons;
