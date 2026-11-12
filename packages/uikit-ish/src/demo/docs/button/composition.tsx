import { FunctionComponent, useMemo } from 'react';

import { Alert, Button, Symbol } from '../../../components/index.js';
import { CodeView } from '../../tooling/frame/code-view.js';
import { Component } from '../../tooling/frame/component.js';
import { useLog } from '../../tooling/frame/log.js';
import { usePartControls } from '../../tooling/frame/prop-control.js';
import { useProvidedState } from '../../tooling/frame/state.js';
import {
  Contents,
  Heading,
  PartLink,
  type Section,
} from '../../tooling/guide/sections.js';
import {
  sfChevronUpChevronDown,
  sfEllipsis,
  sfPlayFill,
  sfPlus,
  sfShuffle,
  sfTrash,
  sfXmark,
} from '../../tooling/icons.js';
import { publicUrl } from '../../tooling/public-url.js';
import { partPropMaps } from '../part-options.js';

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

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            Symbol: ['icon'],
            'Button.Icon': [],
            'Button.Label': [],
            'Button.Root': ['aria-label', 'onClick', 'shape', 'variant'],
          },
          addLog,
        ),
      [addLog],
    ),
    { provided: useProvidedState('button-composition-symbol') },
  );

  return (
    <Component
      isCentered
      isInline
      controls={[partControls]}
      id="button-composition-symbol"
      log={log}
      state={[partState]}
      title="Symbols and labels"
    >
      <div className="button-demo-row">
        <Button.Root
          {...partProps['Button.Root']}
          variant="bordered"
          onClick={() => addLog('Add clicked')}
        >
          <Button.Icon {...partProps['Button.Icon']}>
            <Symbol
              {...partProps.Symbol}
              icon={sfPlus}
            />
          </Button.Icon>
          <Button.Label {...partProps['Button.Label']}>Add</Button.Label>
        </Button.Root>
        <Button.Root
          {...partProps['Button.Root']}
          onClick={() => addLog('Sort clicked')}
        >
          <Button.Label {...partProps['Button.Label']}>Sort</Button.Label>
          <Button.Icon {...partProps['Button.Icon']}>
            <Symbol
              {...partProps.Symbol}
              icon={sfChevronUpChevronDown}
            />
          </Button.Icon>
        </Button.Root>
        <Button.Root
          {...partProps['Button.Root']}
          aria-label="More"
          shape="circle"
          variant="bordered"
          onClick={() => addLog('More clicked')}
        >
          <Button.Icon {...partProps['Button.Icon']}>
            <Symbol
              {...partProps.Symbol}
              icon={sfEllipsis}
            />
          </Button.Icon>
        </Button.Root>
      </div>
    </Component>
  );
};

/** A prominent action with a secondary one: stacked, and side by side. */
const Pairs: FunctionComponent = () => {
  const [log, addLog] = useLog();

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            'Button.Label': [],
            'Button.Root': ['fill', 'onClick', 'size', 'variant'],
          },
          addLog,
        ),
      [addLog],
    ),
    { provided: useProvidedState('button-composition-pairs') },
  );

  return (
    <Component
      isCentered
      isInline
      controls={[partControls]}
      id="button-composition-pairs"
      log={log}
      state={[partState]}
      title="A primary and a secondary action"
    >
      <div className="button-demo-panel">
        <div className="button-demo-stack">
          <Button.Root
            {...partProps['Button.Root']}
            fill
            size="large"
            variant="bordered-prominent"
            onClick={() => addLog('Continue clicked')}
          >
            <Button.Label {...partProps['Button.Label']}>Continue</Button.Label>
          </Button.Root>
          <Button.Root
            {...partProps['Button.Root']}
            fill
            size="large"
            onClick={() => addLog('Not Now clicked')}
          >
            <Button.Label {...partProps['Button.Label']}>Not Now</Button.Label>
          </Button.Root>
        </div>
        <div className="button-demo-row">
          <Button.Root
            {...partProps['Button.Root']}
            fill
            size="large"
            variant="bordered-secondary"
            onClick={() => addLog('Cancel clicked')}
          >
            <Button.Label {...partProps['Button.Label']}>Cancel</Button.Label>
          </Button.Root>
          <Button.Root
            {...partProps['Button.Root']}
            fill
            size="large"
            variant="bordered-prominent"
            onClick={() => addLog('Save clicked')}
          >
            <Button.Label {...partProps['Button.Label']}>Save</Button.Label>
          </Button.Root>
        </div>
      </div>
    </Component>
  );
};

/** A destructive button, confirmed by an alert. */
const DestructiveConfirm: FunctionComponent = () => {
  const [log, addLog] = useLog();

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            Symbol: ['icon'],
            'Alert.Action': ['onClick', 'variant'],
            'Alert.Actions': [],
            'Alert.Description': [],
            'Alert.Header': [],
            'Alert.Popup': [],
            'Alert.Root': [],
            'Alert.Title': [],
            'Alert.Trigger': ['render'],
            'Button.Icon': [],
            'Button.Label': [],
            'Button.Root': ['destructive', 'size', 'variant'],
          },
          addLog,
        ),
      [addLog],
    ),
    { provided: useProvidedState('button-composition-destructive') },
  );

  return (
    <Component
      isCentered
      isInline
      controls={[partControls]}
      id="button-composition-destructive"
      log={log}
      state={[partState]}
      title="A destructive action, confirmed"
    >
      <Alert.Root {...partProps['Alert.Root']}>
        <Alert.Trigger
          {...partProps['Alert.Trigger']}
          render={
            <Button.Root
              {...partProps['Button.Root']}
              destructive
              size="large"
              variant="bordered"
            />
          }
        >
          <Button.Icon {...partProps['Button.Icon']}>
            <Symbol
              {...partProps.Symbol}
              icon={sfTrash}
            />
          </Button.Icon>
          <Button.Label {...partProps['Button.Label']}>
            Delete Album
          </Button.Label>
        </Alert.Trigger>
        <Alert.Popup {...partProps['Alert.Popup']}>
          <Alert.Header {...partProps['Alert.Header']}>
            <Alert.Title {...partProps['Alert.Title']}>
              Delete “Summer”?
            </Alert.Title>
            <Alert.Description {...partProps['Alert.Description']}>
              Its 42 photos stay in your library.
            </Alert.Description>
          </Alert.Header>
          <Alert.Actions {...partProps['Alert.Actions']}>
            <Alert.Action
              {...partProps['Alert.Action']}
              onClick={() => addLog('Cancel clicked')}
            >
              Cancel
            </Alert.Action>
            <Alert.Action
              {...partProps['Alert.Action']}
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

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            Symbol: ['icon'],
            'Button.Icon': [],
            'Button.Label': [],
            'Button.Root': [
              'aria-label',
              'className',
              'context',
              'onClick',
              'shape',
              'variant',
            ],
          },
          addLog,
        ),
      [addLog],
    ),
    { provided: useProvidedState('button-composition-glass') },
  );

  return (
    <Component
      isCentered
      isInline
      controls={[partControls]}
      id="button-composition-glass"
      log={log}
      state={[partState]}
      title="Glass buttons over a picture"
    >
      <div className="button-demo-cover">
        <Button.Root
          {...partProps['Button.Root']}
          aria-label="Close"
          className="button-demo-close"
          context="adaptive"
          shape="circle"
          variant="glass"
          onClick={() => addLog('Close clicked')}
        >
          <Button.Icon {...partProps['Button.Icon']}>
            <Symbol
              {...partProps.Symbol}
              icon={sfXmark}
            />
          </Button.Icon>
        </Button.Root>
        <div className="button-demo-controls">
          <Button.Root
            {...partProps['Button.Root']}
            context="adaptive"
            variant="glass-prominent"
            onClick={() => addLog('Play clicked')}
          >
            <Button.Icon {...partProps['Button.Icon']}>
              <Symbol
                {...partProps.Symbol}
                icon={sfPlayFill}
              />
            </Button.Icon>
            <Button.Label {...partProps['Button.Label']}>Play</Button.Label>
          </Button.Root>
          <Button.Root
            {...partProps['Button.Root']}
            context="adaptive"
            variant="glass"
            onClick={() => addLog('Shuffle clicked')}
          >
            <Button.Icon {...partProps['Button.Icon']}>
              <Symbol
                {...partProps.Symbol}
                icon={sfShuffle}
              />
            </Button.Icon>
            <Button.Label {...partProps['Button.Label']}>Shuffle</Button.Label>
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
        A symbol before its label (Add), or a label before its symbol, as on a
        pop-up button (Sort, whose chevrons say that a menu opens).
      </li>
      <li>
        A symbol on its own: <code>shape=&quot;circle&quot;</code>, with an{' '}
        <code>aria-label</code> as its only name.
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
        <code>aria-label</code>s, and what each does (logged).
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
        There’s one prominent button per view, for the likely action (
        <code>bordered-prominent</code>). The other is less prominent.
      </li>
      <li>
        Stacked (in onboarding, or at a sheet’s bottom), the primary goes on top
        and the other below it, borderless. Side by side, both use{' '}
        <code>fill</code> to share the row, with the primary at the end.
      </li>
      <li>Large (50px) buttons sit at a screen’s bottom, filling its width.</li>
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
        <code>destructive</code> turns it red. Name it by what it destroys
        (Delete Album, not OK).
      </li>
      <li>
        An <a href={publicUrl('alert')}>Alert</a> confirms it (the button is its
        trigger’s <code>render</code>), repeating the destructive action, with
        Cancel to keep things as they are.
      </li>
      <li>
        An alert is a last resort. For what can be undone, offer undo instead.
        For several choices, use an{' '}
        <a href={publicUrl('action-sheet')}>Action Sheet</a>.
      </li>
      <li>
        <strong>Library:</strong> the destructive button, and the{' '}
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
        Glass buttons float above content, like a player’s or a map’s controls
        (48px tall).
      </li>
      <li>
        With <code>context=&quot;adaptive&quot;</code>, the glass follows the
        brightness behind it, sampled as it scrolls or resizes. Otherwise, set
        its <code>context</code> to match the picture.
      </li>
      <li>
        <code>glass-prominent</code> gives the tint’s glass, for the likely
        action (Play).
      </li>
      <li>
        <strong>Library:</strong> the glass variants (<code>glass</code>,{' '}
        <code>glass-prominent</code>) and{' '}
        <code>context=&quot;adaptive&quot;</code>, which samples the brightness
        behind.
      </li>
      <li>
        <strong>Demo:</strong> the picture behind, and the player’s actions
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
