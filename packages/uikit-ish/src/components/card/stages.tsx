import { createContext, forwardRef, useContext } from 'react';

import { iconOf, polyline } from '../grid/icons.js';
import { Symbol } from '../symbol/main.js';
import { cn, withStyle } from '../utils/main.js';
import type { CardStageListProps, CardStageProps } from './props.js';
import { useCardTitleId } from './shared.js';

// A card's stages (`Card.StageList` of `Card.Stage`s): a run in order (e.g.
// a washer's program), shown, not chosen.

/** A done stage's check (see `Stage`), drawn as the corner symbols are. */
const stageDoneIcon = iconOf(
  'card.stage-done',
  // (Centered: its stroke's box about the origin.)
  polyline([-3.75, 0.25], [-1.25, 2.75], [3.75, -2.75]),
);

/** A stage list's current stage, for its stages. */
const StagesContext = createContext<{ value: string | undefined } | undefined>(
  undefined,
);

/**
 * A card's stages: an ordered list (named by its card's title, or its
 * `aria-label`), its `Stage`s along a line at the card's bottom as dots,
 * those done (before its `value`) checked, its current one in its tint,
 * those to come empty; their words under them.
 */
export const StageList = forwardRef<HTMLOListElement, CardStageListProps>(
  ({ children, className, style, tint, value, ...props }, ref) => {
    const titleId = useCardTitleId();
    return (
      <ol
        ref={ref}
        aria-labelledby={
          props['aria-label'] === undefined ? titleId : undefined
        }
        {...props}
        className={cn('uikit-card-stage-list', className)}
        data-card-part="stage-list"
        data-current={value === undefined ? undefined : ''}
        style={withStyle({ '--uikit-card-stages-tint': tint }, style)}
      >
        <StagesContext.Provider value={{ value }}>
          {children}
        </StagesContext.Provider>
      </ol>
    );
  },
);

/**
 * A stage (in a `StageList`): its dot and its words; done (before the
 * current one), current, or to come, by its place (see the CSS).
 */
export const Stage = forwardRef<HTMLLIElement, CardStageProps>(
  ({ children, className, value, ...props }, ref) => {
    const context = useContext(StagesContext);
    if (!context) {
      throw new Error('Card.Stage goes in a Card.StageList.');
    }
    const isCurrent = context.value === value;
    return (
      <li
        ref={ref}
        aria-current={isCurrent ? 'step' : undefined}
        {...props}
        className={cn('uikit-card-stage', className)}
        data-card-part="stage"
        data-current={isCurrent ? '' : undefined}
        data-value={value}
      >
        <span
          aria-hidden="true"
          className="uikit-card-stage-dot"
        >
          <Symbol
            baselineShift="none"
            box="square"
            className="uikit-card-stage-check"
            icon={stageDoneIcon}
          />
        </span>
        <span className="uikit-card-stage-label">{children}</span>
      </li>
    );
  },
);
