import { DynamicTypeSize, TextStyle } from '../../components/index.js';
import { commonPropOptions } from '../utils/main.js';

export const textStyles: [TextStyle, string][] = [
  ['largeTitle', 'Large Title'],
  ['title1', 'Title 1'],
  ['title2', 'Title 2'],
  ['title3', 'Title 3'],
  ['headline', 'Headline'],
  ['body', 'Body'],
  ['callout', 'Callout'],
  ['subheadline', 'Subheadline'],
  ['footnote', 'Footnote'],
  ['caption1', 'Caption 1'],
  ['caption2', 'Caption 2'],
];

export const dynamicTypeSizes: DynamicTypeSize[] = [
  'xSmall',
  'small',
  'medium',
  'large',
  'xLarge',
  'xxLarge',
  'xxxLarge',
  'ax1',
  'ax2',
  'ax3',
  'ax4',
  'ax5',
];

export const propOptionsContent = {
  text: ['The quick brown fox jumps over the lazy dog', 'Label'] as const,
} as const;

export const propOptionsTypography = {
  ...commonPropOptions,
  textStyle: [
    undefined,
    ...textStyles.map(([textStyle]) => textStyle),
  ] as const,
  emphasized: [undefined, false, true] as const,
  italic: [undefined, false, true] as const,
  color: [undefined, 'primary', 'secondary', 'tertiary', 'quaternary'] as const,
  dynamicTypeSize: [undefined, ...dynamicTypeSizes] as const,
  as: [undefined, 'span', 'p', 'h1', 'label'] as const,
};

export const propOptionsMatrix = {
  color: ['primary', 'secondary', 'tertiary', 'quaternary'] as const,
  dynamicTypeSize: [
    'large',
    ...dynamicTypeSizes.filter((size) => size !== 'large'),
  ] as const,
};

export const propOptionsSizes = {
  color: ['primary', 'secondary', 'tertiary', 'quaternary'] as const,
};
