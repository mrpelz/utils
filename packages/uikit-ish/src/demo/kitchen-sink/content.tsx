import { CSSProperties, FunctionComponent } from 'react';

import {
  Avatar,
  Badge,
  List,
  Symbol,
  type TextColor,
  type TextSize,
  type TextStyle,
  Typography,
} from '../../components/index.js';
import { photo } from '../docs/avatar/props.js';
import { Catalog } from '../docs/symbol/catalog.js';
import {
  demoIcons,
  sfBell,
  sfBellFill,
  sfHeart,
  sfHeartFill,
  sfStar,
} from '../tooling/icons.js';
import { listPages } from './list.js';
import {
  DrillRow,
  Row,
  Rows,
  Showcase,
  type SinkPages,
  usePush,
} from './shared.js';
import { Screen, TopBar } from './viewport.js';

// Content: Typography, Avatar, Symbol (List: see list.tsx).

const textStyles: readonly TextStyle[] = [
  'largeTitle',
  'title1',
  'title2',
  'title3',
  'headline',
  'body',
  'callout',
  'subheadline',
  'footnote',
  'caption1',
  'caption2',
];

const textSizes: readonly TextSize[] = [
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

const textColors: readonly TextColor[] = [
  'primary',
  'secondary',
  'tertiary',
  'quaternary',
];

const TypographyContent: FunctionComponent = () => {
  const push = usePush();

  return (
    <List.Root>
      <Rows>
        <List.Item>
          <List.Content>
            <List.Title
              render={<button type="button" />}
              onClick={() => push('typography/sizes')}
            >
              Text Sizes
            </List.Title>
          </List.Content>
          <List.Trailing>
            <List.DrillIn />
          </List.Trailing>
        </List.Item>
      </Rows>
      {textStyles.map((textStyle) => (
        <Showcase
          key={textStyle}
          isStacked
          title={textStyle}
        >
          <Typography textStyle={textStyle}>Regular</Typography>
          <Typography
            emphasized
            textStyle={textStyle}
          >
            Emphasized
          </Typography>
          <Typography
            italic
            textStyle={textStyle}
          >
            Italic
          </Typography>
          <Typography
            emphasized
            italic
            textStyle={textStyle}
          >
            Emphasized Italic
          </Typography>
        </Showcase>
      ))}
      <Showcase
        isStacked
        title="Colors"
      >
        {textColors.map((color) => (
          <Typography
            key={color}
            color={color}
            textStyle="headline"
          >
            {color}
          </Typography>
        ))}
      </Showcase>
      <Showcase
        isStacked
        title="Nested"
      >
        <Typography textStyle="body">
          Body text with{' '}
          <Typography
            emphasized
            textStyle="body"
          >
            an emphasized
          </Typography>{' '}
          and{' '}
          <Typography
            color="secondary"
            textStyle="footnote"
          >
            a secondary footnote
          </Typography>{' '}
          inside it.
        </Typography>
      </Showcase>
    </List.Root>
  );
};

/** Every text style at each text size. */
const TypographySizesContent: FunctionComponent = () => (
  <List.Root>
    {textSizes.map((textSize) => (
      <Showcase
        key={textSize}
        isStacked
        title={textSize}
      >
        {textStyles.map((textStyle) => (
          <Typography
            key={textStyle}
            textSize={textSize}
            textStyle={textStyle}
          >
            {textStyle}
          </Typography>
        ))}
      </Showcase>
    ))}
  </List.Root>
);

const people = [
  ['Anna Hall', 'AH', 200],
  ['Kate Brown', 'KB', 290],
  ['Jon Adams', 'JA', 20],
  ['Mia Chen', 'MC', 110],
] as const;

const AvatarContent: FunctionComponent = () => (
  <List.Root>
    <Showcase title="Photo">
      {people.map(([name, , hue]) => (
        <Avatar.Root key={name}>
          <Avatar.Image
            alt={name}
            src={photo(hue)}
          />
        </Avatar.Root>
      ))}
    </Showcase>
    <Showcase title="Initials">
      {people.map(([name, initials]) => (
        <Avatar.Root
          key={name}
          aria-label={name}
        >
          <Avatar.Fallback>{initials}</Avatar.Fallback>
        </Avatar.Root>
      ))}
      <Avatar.Root aria-label="Sam">
        <Avatar.Fallback>S</Avatar.Fallback>
      </Avatar.Root>
    </Showcase>
    <Showcase title="Broken Photo (Initials)">
      <Avatar.Root>
        <Avatar.Image
          alt="Gina Foster"
          src="broken.png"
        />
        <Avatar.Fallback>GF</Avatar.Fallback>
      </Avatar.Root>
    </Showcase>
    <Showcase title="Sizes">
      {[24, 32, 40, 50, 70, 100].map((size) => (
        <Avatar.Root
          key={size}
          aria-label={`${String(size)}px`}
          size={size}
        >
          <Avatar.Image
            alt=""
            src={photo(size * 3)}
          />
        </Avatar.Root>
      ))}
    </Showcase>
    <Showcase title="Groups">
      {[2, 3, 4].map((count) => (
        <Avatar.Group
          key={count}
          aria-label={`${String(count)} people`}
        >
          {people.slice(0, count).map(([name, initials, hue], index) => (
            <Avatar.Root key={name}>
              {index % 2 === 0 ? (
                <Avatar.Image
                  alt=""
                  src={photo(hue)}
                />
              ) : null}
              <Avatar.Fallback>{initials}</Avatar.Fallback>
            </Avatar.Root>
          ))}
        </Avatar.Group>
      ))}
      <Avatar.Group
        aria-label="3 people, 2 new"
        size={50}
      >
        {people.slice(0, 3).map(([name, initials]) => (
          <Avatar.Root key={name}>
            <Avatar.Fallback>{initials}</Avatar.Fallback>
          </Avatar.Root>
        ))}
        <Badge>2</Badge>
      </Avatar.Group>
    </Showcase>
    <Showcase title="Badged">
      <Avatar.Root aria-label="Anna Hall, 3 unread">
        <Avatar.Image
          alt=""
          src={photo(200)}
        />
        <Badge>3</Badge>
      </Avatar.Root>
      <Avatar.Root aria-label="Kate Brown, unread">
        <Avatar.Fallback>KB</Avatar.Fallback>
        <Badge tint="var(--color-ui-system-blue)" />
      </Avatar.Root>
    </Showcase>
    <Rows title="In Rows">
      {people.map(([name, initials, hue], index) => (
        <Row
          key={name}
          subtitle={index % 2 === 0 ? 'Photo' : 'Initials'}
          title={name}
          leading={
            <Avatar.Root size={40}>
              {index % 2 === 0 ? (
                <Avatar.Image
                  alt=""
                  src={photo(hue)}
                />
              ) : null}
              <Avatar.Fallback>{initials}</Avatar.Fallback>
            </Avatar.Root>
          }
        />
      ))}
    </Rows>
  </List.Root>
);

/** The icons with layers of their own (hierarchical, SF Symbols'). */
const layered = Object.entries(demoIcons).filter(([, icon]) =>
  icon.svgPathData.some(
    ({ fillOpacity }) => fillOpacity !== undefined && fillOpacity < 1,
  ),
);

const tints = [
  'var(--color-ui-system-blue)',
  'var(--color-ui-system-red)',
  'var(--color-ui-system-green)',
  'var(--color-ui-system-orange)',
  'var(--color-ui-secondary-label)',
];

const SymbolContent: FunctionComponent = () => (
  <List.Root>
    <Showcase
      isStacked
      title="By Text Style"
    >
      {textStyles.map((textStyle) => (
        <Typography
          key={textStyle}
          textStyle={textStyle}
        >
          <Symbol icon={sfBell} /> {textStyle}
        </Typography>
      ))}
    </Showcase>
    <Showcase
      isStacked
      title="Baseline"
    >
      {(['optical', 'none'] as const).map((baselineShift) => (
        <Typography
          key={baselineShift}
          textStyle="title2"
        >
          <Symbol
            baselineShift={baselineShift}
            icon={sfHeart}
          />{' '}
          Hxg {baselineShift}{' '}
          <Symbol
            baselineShift={baselineShift}
            icon={sfStar}
          />
        </Typography>
      ))}
    </Showcase>
    <Showcase title="Emphasis">
      {[0, 0.25, 0.5, 0.75, 1].map((emphasis) => (
        <Typography
          key={emphasis}
          style={{ '--uikit-symbol-emphasis': emphasis } as CSSProperties}
          textStyle="title1"
        >
          <Symbol
            emphasizedIcon={sfBellFill}
            icon={sfBell}
          />
          <Symbol
            emphasizedIcon={sfHeartFill}
            icon={sfHeart}
          />
        </Typography>
      ))}
    </Showcase>
    <Showcase title="Colors">
      {tints.map((tint) => (
        <Typography
          key={tint}
          style={{ color: tint }}
          textStyle="title1"
        >
          <Symbol icon={sfHeartFill} />
        </Typography>
      ))}
    </Showcase>
    {layered.length > 0 ? (
      <Showcase title="Layered">
        {layered.map(([name, icon]) => (
          <Typography
            key={name}
            aria-label={name}
            style={{ color: 'var(--color-ui-system-blue)' }}
            textStyle="title1"
          >
            <Symbol icon={icon} />
          </Typography>
        ))}
      </Showcase>
    ) : null}
    <Rows title="SF Symbols">
      <DrillRow
        pageKey="symbol/catalog"
        title="All of Them (Searchable)"
      />
    </Rows>
  </List.Root>
);

/**
 * Every SF Symbol (a screen of its own: see `isBare`): the grid filling it
 * above the keyboard, the search below it, on the keyboard.
 */
const SymbolCatalogScreen: FunctionComponent = () => (
  <Screen
    render={(contentRef) => (
      <>
        <Catalog
          boxRef={contentRef}
          look="screen"
        />
        <TopBar title="SF Symbols" />
      </>
    )}
  />
);

export const contentPages: SinkPages = {
  avatar: { Content: AvatarContent, title: 'Avatar' },
  symbol: { Content: SymbolContent, title: 'Symbol' },
  'symbol/catalog': {
    Content: SymbolCatalogScreen,
    isBare: true,
    title: 'SF Symbols',
  },
  typography: { Content: TypographyContent, title: 'Typography' },
  'typography/sizes': {
    Content: TypographySizesContent,
    title: 'Text Sizes',
  },
  ...listPages,
};
