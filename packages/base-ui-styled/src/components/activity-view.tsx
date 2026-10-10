import { styled } from 'goober';
import {
  ComponentProps,
  forwardRef,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';

import { textStyle } from './typography.js';
import { fontWeight } from './utils.js';

// Source: Apple iOS 26 Figma (“Activity Views”, UIKit
// `UIActivityViewController`, a share sheet), in the app's sheet (iPhone)
// or popover (iPad), as parts:
// - a header (16px in, its parts 16px apart): a thumbnail (64px, its
//   corners 16px, a 0.5px border), its title (15px, medium) and subtitle
//   (13px, the secondary label color) 1px apart, then (12px below) e.g. a
//   menu (a `Button`) and a message (13px, the secondary label color);
// - rows scrolling sideways, 24px from their start, their items 14px apart:
//   people (an `Avatar` above their name, 12px, two lines; a group's count
//   below) and actions (a 70px circle on a fill, its symbol 25px, above its
//   label, 13px, two lines), 78px wide;
// - separators between them (0.5px, 16px in);
// - its actions as a list (a `List`).
//
// Deviations:
// - A group's name (with a count) is scaled down to fit one line (iOS'
//   behavior, at least 75%), its count below it.
// - The actions' symbols are light (user: thinner; Figma: regular).
// - Apps (Figma's app icon row, its people's app badges) aren't built: an
//   avatar takes a `Badge` instead.

const part = 'data-activity-view-part';

const StyledHeader = styled('div', forwardRef)`
  display: flex;
  align-items: flex-start;
  padding: 16px;
  gap: 16px;
`;

/** Its header: a thumbnail, and its heading (title, subtitle, more). */
const Header = forwardRef<HTMLDivElement, ComponentProps<'div'>>(
  (props, ref) => (
    <StyledHeader
      ref={ref}
      {...{ [part]: 'header' }}
      {...props}
    />
  ),
);

/** What's shared (64px, its corners 16px): an image, or content. */
const Thumbnail = styled('div', forwardRef)`
  overflow: hidden;
  width: 64px;
  height: 64px;
  box-sizing: border-box;
  flex: none;
  border: 0.5px solid rgb(0 0 0 / 15%);
  border-radius: 16px;
  margin-block-start: 14px;

  & > img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

/** Its title, subtitle, and what follows them (e.g. a menu, a message). */
const Heading = styled('div', forwardRef)`
  display: flex;
  min-width: 0;
  flex: 1 1 auto;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
  padding-block: 12px 2px;
`;

const Title = styled('div', forwardRef)`
  color: var(--color-ios-label);
  font-size: 15px;
  ${fontWeight(510)}
  letter-spacing: -0.23px;
  line-height: 20px;

  & + [${part}='subtitle'] {
    margin-block-start: -11px;
  }
`;

const StyledSubtitle = styled('div', forwardRef)`
  color: var(--color-ios-secondary-label);
  ${textStyle('footnote')}
`;

const Subtitle = forwardRef<HTMLDivElement, ComponentProps<'div'>>(
  (props, ref) => (
    <StyledSubtitle
      ref={ref}
      {...{ [part]: 'subtitle' }}
      {...props}
    />
  ),
);

/** A message (e.g. who can edit), in the secondary label color. */
const Message = styled('div', forwardRef)`
  color: var(--color-ios-secondary-label);
  ${textStyle('footnote')}
`;

// A row scrolling sideways (people, actions).
const Row = styled('div', forwardRef)`
  display: flex;
  overflow: auto hidden;
  padding: 14px 24px 20px;
  gap: 14px;
  overscroll-behavior-inline: contain;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;

/** Its people (`Person`s), scrolling sideways. */
const People = forwardRef<HTMLDivElement, ComponentProps<'div'>>(
  (props, ref) => (
    <Row
      ref={ref}
      role="list"
      {...{ [part]: 'people' }}
      {...props}
    />
  ),
);

/** Its actions (`Action`s), scrolling sideways. */
const Actions = forwardRef<HTMLDivElement, ComponentProps<'div'>>(
  (props, ref) => (
    <Row
      ref={ref}
      role="list"
      {...{ [part]: 'actions' }}
      {...props}
    />
  ),
);

// A person or an action: 78px wide, its picture above its name.
const item = `
  display: flex;
  width: 78px;
  flex: none;
  flex-direction: column;
  align-items: center;
  padding: 0;
  border: 0;
  margin: 0;
  background: none;
  color: var(--color-ios-label);
  cursor: pointer;
  font-family: inherit;
  gap: 5px;
  outline-offset: 2px;
  text-align: center;
`;

const StyledPerson = styled('button', forwardRef)`
  ${item}
`;

const Name = styled('span', forwardRef)`
  display: -webkit-box;
  overflow: hidden;
  -webkit-box-orient: vertical;
  font-size: 12px;
  letter-spacing: 0.06px;
  -webkit-line-clamp: 2;
  line-height: 15px;

  /* With a count (a group's): on one line, scaled down to fit it (see
     Person), truncated beyond. */
  &[data-fit] {
    display: block;
    max-width: 100%;
    font-size: calc(12px * var(--styled-activity-name-scale, 1));
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

/** The smallest a group's name scales down to (as UIKit's minimum). */
const minimumScale = 0.75;

const Count = styled('span')`
  color: var(--color-ios-secondary-label);
  font-size: 12px;
  letter-spacing: 0.06px;
  line-height: 15px;
  margin-block-start: -5px;
`;

export type ActivityViewPersonProps = ComponentProps<'button'> & {
  /** How many people (a group's): shown below its name (e.g. “2 People”). */
  count?: string;
  /** Its name (e.g. first and last name, wrapping). */
  name: string;
};

/** A person (or a group) to share with: its `Avatar` (the children). */
const Person = forwardRef<HTMLButtonElement, ActivityViewPersonProps>(
  ({ children, count, name, ...props }, ref) => {
    // With a count: its name scaled down to fit one line (iOS: a group's
    // name and count take two lines), measured at full size.
    const nameRef = useRef<HTMLSpanElement>(null);
    const [scale, setScale] = useState(1);
    useLayoutEffect(() => {
      const { current: element } = nameRef;
      if (!element || count === undefined) return;
      const property = '--styled-activity-name-scale';
      const previous = element.style.getPropertyValue(property);
      // Its text's width at full size (fractional: scrollWidth rounds),
      // with a pixel to spare.
      element.style.setProperty(property, '1');
      const range = document.createRange();
      range.selectNodeContents(element);
      const { width } = range.getBoundingClientRect();
      element.style.setProperty(property, previous);
      setScale(
        Math.max(
          minimumScale,
          Math.min(1, (element.clientWidth - 1) / Math.max(width, 1)),
        ),
      );
    }, [count, name]);

    return (
      <StyledPerson
        ref={ref}
        role="listitem"
        type="button"
        {...props}
      >
        {children}
        <Name
          ref={nameRef}
          data-fit={count === undefined ? undefined : ''}
          style={
            {
              '--styled-activity-name-scale': String(scale),
            } as React.CSSProperties
          }
        >
          {name}
        </Name>
        {count === undefined ? null : <Count>{count}</Count>}
      </StyledPerson>
    );
  },
);

const StyledAction = styled('button', forwardRef)`
  ${item}

  gap: 7px;

  & > [${part}='action-symbol'] {
    display: grid;
    width: 70px;
    height: 70px;
    border-radius: 50%;
    background-color: var(--color-ios-tertiary-system-fill);
    font-size: 25px;
    ${fontWeight(300)}
    place-items: center;
  }

  &:active > [${part}='action-symbol'] {
    filter: brightness(0.9);
  }

  & > span:last-child {
    display: -webkit-box;
    overflow: hidden;
    -webkit-box-orient: vertical;
    ${textStyle('footnote')}
    -webkit-line-clamp: 2;
    line-height: 15px;
  }
`;

export type ActivityViewActionProps = ComponentProps<'button'> & {
  /** Its label (e.g. “Add to Reading List”, wrapping). */
  label: string;
};

/** An action (Figma “Action”): its symbol (the children) in a circle. */
const Action = forwardRef<HTMLButtonElement, ActivityViewActionProps>(
  ({ children, label, ...props }, ref) => (
    <StyledAction
      ref={ref}
      role="listitem"
      type="button"
      {...props}
    >
      <span
        aria-hidden="true"
        {...{ [part]: 'action-symbol' }}
      >
        {children}
      </span>
      <span>{label}</span>
    </StyledAction>
  ),
);

/** Between its sections (0.5px, 16px in). */
const Separator = styled('hr', forwardRef)`
  height: 0;
  border: 0;
  margin: 0 16px;
  border-block-start: 0.5px solid var(--color-ios-separator);
`;

/**
 * An activity view (UIKit `UIActivityViewController`, a share sheet): what's
 * shared (`Header`), people and actions (`People`, `Actions`), and more
 * actions (a `List`), in the app's sheet or popover.
 */
export const ActivityView = {
  Header,
  Thumbnail,
  Heading,
  Title,
  Subtitle,
  Message,
  People,
  Person,
  Actions,
  Action,
  Separator,
};
