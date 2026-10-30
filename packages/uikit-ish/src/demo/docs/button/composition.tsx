import { sfChevronUpChevronDown } from '@bradleyhodges/sfsymbols/sfChevronUpChevronDown';
import { sfEllipsis } from '@bradleyhodges/sfsymbols/sfEllipsis';
import { sfPlayFill } from '@bradleyhodges/sfsymbols/sfPlayFill';
import { sfPlus } from '@bradleyhodges/sfsymbols/sfPlus';
import { sfShuffle } from '@bradleyhodges/sfsymbols/sfShuffle';
import { sfTrash } from '@bradleyhodges/sfsymbols/sfTrash';
import { sfXmark } from '@bradleyhodges/sfsymbols/sfXmark';
import { FunctionComponent } from 'react';

import { Alert, Button, Symbol } from '../../../components/index.js';
import { CodeView } from '../../tooling/frame/code-view.js';
import { Component } from '../../tooling/frame/component.js';
import { useLog } from '../../tooling/frame/log.js';
import {
  Contents,
  Heading,
  PartLink,
  type Section,
} from '../../tooling/guide/sections.js';
import { GuideLink } from '../hig-guide/link.js';

/* eslint-disable unicorn/no-incorrect-template-string-interpolation -- JSX braces in code samples, not interpolations */

const symbolCode = `{/* A symbol, then a label. */}
<Button.Root variant="bordered" onClick={() => {…}}>
  <Button.Icon>
    <Symbol icon={sfPlus} />
  </Button.Icon>
  <Button.Label>Add</Button.Label>
</Button.Root>

{/* A pop-up button: the label, then the symbol. */}
<Button.Root onClick={() => {…}}>
  <Button.Label>Sort</Button.Label>
  <Button.Icon>
    <Symbol icon={sfChevronUpChevronDown} />
  </Button.Icon>
</Button.Root>

{/* A symbol alone: a circle, named. */}
<Button.Root aria-label="More" shape="circle" variant="bordered" onClick={() => {…}}>
  <Button.Icon>
    <Symbol icon={sfEllipsis} />
  </Button.Icon>
</Button.Root>`;

const pairsCode = `{/* Stacked: the likely action first. */}
<div className="stack">
  <Button.Root fill size="large" variant="bordered-prominent" onClick={() => {…}}>
    <Button.Label>Continue</Button.Label>
  </Button.Root>
  <Button.Root fill size="large" onClick={() => {…}}>
    <Button.Label>Not Now</Button.Label>
  </Button.Root>
</div>

{/* Side by side: sharing the row. */}
<div className="row">
  <Button.Root fill size="large" variant="bordered-secondary" onClick={() => {…}}>
    <Button.Label>Cancel</Button.Label>
  </Button.Root>
  <Button.Root fill size="large" variant="bordered-prominent" onClick={() => {…}}>
    <Button.Label>Save</Button.Label>
  </Button.Root>
</div>`;

const destructiveCode = `<Alert.Root>
  <Alert.Trigger
    render={<Button.Root destructive size="large" variant="bordered" />}
  >
    <Button.Icon>
      <Symbol icon={sfTrash} />
    </Button.Icon>
    <Button.Label>Delete Album</Button.Label>
  </Alert.Trigger>
  <Alert.Popup>
    <Alert.Header>
      <Alert.Title>Delete “Summer”?</Alert.Title>
      <Alert.Description>Its 42 photos stay in your library.</Alert.Description>
    </Alert.Header>
    <Alert.Actions>
      <Alert.Action>Cancel</Alert.Action>
      <Alert.Action variant="destructive" onClick={() => {…}}>
        Delete
      </Alert.Action>
    </Alert.Actions>
  </Alert.Popup>
</Alert.Root>`;

const glassCode = `<div className="cover">
  <Button.Root
    aria-label="Close"
    context="adaptive"
    shape="circle"
    variant="glass"
    onClick={() => {…}}
  >
    <Button.Icon>
      <Symbol icon={sfXmark} />
    </Button.Icon>
  </Button.Root>
  <div className="controls">
    <Button.Root context="adaptive" variant="glass-prominent" onClick={() => {…}}>
      <Button.Icon>
        <Symbol icon={sfPlayFill} />
      </Button.Icon>
      <Button.Label>Play</Button.Label>
    </Button.Root>
    <Button.Root context="adaptive" variant="glass" onClick={() => {…}}>…</Button.Root>
  </div>
</div>`;

/* eslint-enable unicorn/no-incorrect-template-string-interpolation */

/** A symbol and a label, a label and a symbol, a symbol alone. */
const SymbolAndLabel: FunctionComponent = () => {
  const [log, addLog] = useLog();

  return (
    <Component
      isCentered
      isInline
      id="button-composition-symbol"
      log={log}
      title="Symbols and labels"
    >
      <div className="button-demo-row">
        <Button.Root
          variant="bordered"
          onClick={() => addLog('Add clicked')}
        >
          <Button.Icon>
            <Symbol icon={sfPlus} />
          </Button.Icon>
          <Button.Label>Add</Button.Label>
        </Button.Root>
        <Button.Root onClick={() => addLog('Sort clicked')}>
          <Button.Label>Sort</Button.Label>
          <Button.Icon>
            <Symbol icon={sfChevronUpChevronDown} />
          </Button.Icon>
        </Button.Root>
        <Button.Root
          aria-label="More"
          shape="circle"
          variant="bordered"
          onClick={() => addLog('More clicked')}
        >
          <Button.Icon>
            <Symbol icon={sfEllipsis} />
          </Button.Icon>
        </Button.Root>
      </div>
    </Component>
  );
};

/** A prominent action with a secondary one: stacked, and side by side. */
const Pairs: FunctionComponent = () => {
  const [log, addLog] = useLog();

  return (
    <Component
      isCentered
      isInline
      id="button-composition-pairs"
      log={log}
      title="A primary and a secondary action"
    >
      <div className="button-demo-panel">
        <div className="button-demo-stack">
          <Button.Root
            fill
            size="large"
            variant="bordered-prominent"
            onClick={() => addLog('Continue clicked')}
          >
            <Button.Label>Continue</Button.Label>
          </Button.Root>
          <Button.Root
            fill
            size="large"
            onClick={() => addLog('Not Now clicked')}
          >
            <Button.Label>Not Now</Button.Label>
          </Button.Root>
        </div>
        <div className="button-demo-row">
          <Button.Root
            fill
            size="large"
            variant="bordered-secondary"
            onClick={() => addLog('Cancel clicked')}
          >
            <Button.Label>Cancel</Button.Label>
          </Button.Root>
          <Button.Root
            fill
            size="large"
            variant="bordered-prominent"
            onClick={() => addLog('Save clicked')}
          >
            <Button.Label>Save</Button.Label>
          </Button.Root>
        </div>
      </div>
    </Component>
  );
};

/** A destructive button, confirmed by an alert. */
const DestructiveConfirm: FunctionComponent = () => {
  const [log, addLog] = useLog();

  return (
    <Component
      isCentered
      isInline
      id="button-composition-destructive"
      log={log}
      title="A destructive action, confirmed"
    >
      <Alert.Root>
        <Alert.Trigger
          render={
            <Button.Root
              destructive
              size="large"
              variant="bordered"
            />
          }
        >
          <Button.Icon>
            <Symbol icon={sfTrash} />
          </Button.Icon>
          <Button.Label>Delete Album</Button.Label>
        </Alert.Trigger>
        <Alert.Popup>
          <Alert.Header>
            <Alert.Title>Delete “Summer”?</Alert.Title>
            <Alert.Description>
              Its 42 photos stay in your library.
            </Alert.Description>
          </Alert.Header>
          <Alert.Actions>
            <Alert.Action onClick={() => addLog('Cancel clicked')}>
              Cancel
            </Alert.Action>
            <Alert.Action
              variant="destructive"
              onClick={() => addLog('Delete clicked')}
            >
              Delete
            </Alert.Action>
          </Alert.Actions>
        </Alert.Popup>
      </Alert.Root>
    </Component>
  );
};

/** Glass buttons over a picture, their glass by what's behind them. */
const GlassOverContent: FunctionComponent = () => {
  const [log, addLog] = useLog();

  return (
    <Component
      isCentered
      isInline
      id="button-composition-glass"
      log={log}
      title="Glass buttons over a picture"
    >
      <div className="button-demo-cover">
        <Button.Root
          aria-label="Close"
          className="button-demo-close"
          context="adaptive"
          shape="circle"
          variant="glass"
          onClick={() => addLog('Close clicked')}
        >
          <Button.Icon>
            <Symbol icon={sfXmark} />
          </Button.Icon>
        </Button.Root>
        <div className="button-demo-controls">
          <Button.Root
            context="adaptive"
            variant="glass-prominent"
            onClick={() => addLog('Play clicked')}
          >
            <Button.Icon>
              <Symbol icon={sfPlayFill} />
            </Button.Icon>
            <Button.Label>Play</Button.Label>
          </Button.Root>
          <Button.Root
            context="adaptive"
            variant="glass"
            onClick={() => addLog('Shuffle clicked')}
          >
            <Button.Icon>
              <Symbol icon={sfShuffle} />
            </Button.Icon>
            <Button.Label>Shuffle</Button.Label>
          </Button.Root>
        </div>
      </div>
    </Component>
  );
};

/** The page's sections (its headings' ids), listed at its top. */
const sections: readonly Section[] = [
  ['symbols-and-labels', 'Symbols and labels'],
  ['a-primary-and-a-secondary-action', 'A primary and a secondary action'],
  ['a-destructive-action-confirmed', 'A destructive action, confirmed'],
  ['glass-over-content', 'Glass over content'],
];

/** `/button/composition`: buttons with their content, and each other. */
export const ButtonComposition: FunctionComponent = () => (
  <>
    <Contents sections={sections} />

    <Heading
      id="symbols-and-labels"
      level={2}
    >
      Symbols and labels
    </Heading>
    <ul>
      <li>
        A symbol before its label (Add); a label before its symbol, a pop-up
        button’s (Sort, its chevrons saying a menu opens).
      </li>
      <li>
        A symbol alone: <code>shape=&quot;circle&quot;</code>, and an{' '}
        <code>aria-label</code>, its only name.
      </li>
      <li>
        <strong>Library:</strong> the button (
        <PartLink
          component="button"
          part="Button.Root"
        />
        ) with its symbol (
        <PartLink
          component="button"
          part="Button.Icon"
        />
        ) and label (
        <PartLink
          component="button"
          part="Button.Label"
        />
        ) in either order, and its circle shape.
      </li>
      <li>
        <strong>Demo:</strong> the labels, the symbols and the{' '}
        <code>aria-label</code>s; what each does (logged).
      </li>
    </ul>
    <CodeView code={symbolCode} />
    <SymbolAndLabel />

    <Heading
      id="a-primary-and-a-secondary-action"
      level={2}
    >
      A primary and a secondary action
    </Heading>
    <ul>
      <li>
        One prominent button per view, the likely action (
        <code>bordered-prominent</code>); the other less so.
      </li>
      <li>
        Stacked (onboarding, a sheet’s bottom): the primary on top, the other
        borderless below; side by side: <code>fill</code> sharing the row, the
        primary at the end.
      </li>
      <li>
        Large (50px) buttons at a screen’s bottom, filling its width (HIG).
      </li>
      <li>
        <strong>Library:</strong> the variants (<code>bordered-prominent</code>,
        borderless), the large size and <code>fill</code>.
      </li>
      <li>
        <strong>Demo:</strong> the two actions, their order and layout, and what
        each does (logged).
      </li>
    </ul>
    <CodeView code={pairsCode} />
    <Pairs />

    <Heading
      id="a-destructive-action-confirmed"
      level={2}
    >
      A destructive action, confirmed
    </Heading>
    <ul>
      <li>
        <code>destructive</code>: red, named by what it destroys (Delete Album,
        not OK).
      </li>
      <li>
        Confirmed by an <a href="alert">Alert</a> (the button its trigger’s{' '}
        <code>render</code>), its own destructive action repeated; Cancel to
        keep it.
      </li>
      <li>
        An alert is a last resort (guide <GuideLink to="rule-g5">G5</GuideLink>
        ): for what can be undone, undo instead; for several choices, an{' '}
        <a href="action-sheet">Action sheet</a>.
      </li>
      <li>
        <strong>Library:</strong> the destructive button and the{' '}
        <PartLink
          component="alert"
          part="Alert.Root"
        />{' '}
        it triggers (rendered as its{' '}
        <PartLink
          component="alert"
          part="Alert.Trigger"
        />
        ), with its destructive and cancel actions.
      </li>
      <li>
        <strong>Demo:</strong> what’s deleted, and whether it was (logged).
      </li>
    </ul>
    <CodeView code={destructiveCode} />
    <DestructiveConfirm />

    <Heading
      id="glass-over-content"
      level={2}
    >
      Glass over content
    </Heading>
    <ul>
      <li>
        Glass buttons float over content, as a player’s or a map’s controls
        (glass, 48px high).
      </li>
      <li>
        <code>context=&quot;adaptive&quot;</code>: the glass by the brightness
        behind it, sampled (as it scrolls, or resizes); otherwise set its{' '}
        <code>context</code> by the picture’s.
      </li>
      <li>
        <code>glass-prominent</code>: the tint’s glass, for the likely action
        (Play).
      </li>
      <li>
        <strong>Library:</strong> the glass variants (<code>glass</code>,{' '}
        <code>glass-prominent</code>) and{' '}
        <code>context=&quot;adaptive&quot;</code>, sampling the brightness
        behind.
      </li>
      <li>
        <strong>Demo:</strong> the picture behind and the player’s actions
        (logged).
      </li>
    </ul>
    <CodeView code={glassCode} />
    <GlassOverContent />
  </>
);

/** Its live views, also on the component's page of demos (and `/all`). */
export const buttonCompositionDemos = [
  SymbolAndLabel,
  Pairs,
  DestructiveConfirm,
  GlassOverContent,
];
