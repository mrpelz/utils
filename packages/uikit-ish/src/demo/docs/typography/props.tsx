import { TextSize, TextStyle } from '../../../components/index.js';
import {
  commonPropOptions,
  MappedProp,
} from '../../tooling/frame/prop-control.js';

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

export const textSizes: TextSize[] = [
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
  textSize: [undefined, ...textSizes] as const,
  render: [
    undefined,
    new MappedProp(<p />, '[<p />]'),
    new MappedProp(<h1 />, '[<h1 />]'),
  ] as const,
};

export const propOptionsMatrix = {
  color: ['primary', 'secondary', 'tertiary', 'quaternary'] as const,
  textSize: ['large', ...textSizes.filter((size) => size !== 'large')] as const,
};

export const propOptionsSizes = {
  color: ['primary', 'secondary', 'tertiary', 'quaternary'] as const,
};

// The guide pages' views (see overview.tsx, parts.tsx, composition.tsx).

/** The overview's: the style, its weight, its color. */
export const propOptionsOverview = {
  textStyle: propOptionsTypography.textStyle,
  emphasized: propOptionsTypography.emphasized,
  color: propOptionsTypography.color,
};

/** The composition's: the size of a list's text, set around it. */
export const propOptionsCompositionSize = {
  textSize: ['large', ...textSizes.filter((size) => size !== 'large')] as const,
};
