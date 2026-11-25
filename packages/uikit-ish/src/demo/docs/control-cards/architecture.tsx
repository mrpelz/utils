import { FunctionComponent } from 'react';

import { CodeView } from '../../tooling/frame/code-view.js';
import {
  Contents,
  Heading,
  PartLink,
  type Section,
} from '../../tooling/guide/sections.js';
import { publicUrl } from '../../tooling/public-url.js';

// `/control-cards/architecture`: how ControlCards is built, and what flows
// into it.

/* eslint-disable unicorn/no-incorrect-template-string-interpolation -- JSX braces in code samples, not interpolations */
const switchCode = `// ControlCards.Switch, in short: a Card.Root and its parts, a switch
// among them; a press on the card is passed on to the switch.
<Card.Root
  active={isOn}                              // lit while on
  onClick={onClick ?? forwardClick('[role=switch]:not([disabled])')}
>
  <Card.Symbol tint={tint}>{symbolOf({ emphasizedIcon, icon })}</Card.Symbol>
  <Card.Title>{label}</Card.Title>
  <Card.Value>{isOn ? states[0] : states[1]}</Card.Value>
  <Card.Switch aria-label={label} checked={isOn} disabled={disabled} tint={tint} onCheckedChange={switchTo} />
  {children}                                 // e.g. a corner button
</Card.Root>`;

const lightCode = `// ControlCards.Light, in short: its channels are the app's children; it
// hears the light they make through a context Card.Channels reports to.
const [light, setLight] = useState({ brightness: 1, color: undefined });
<Card.Root onClick={forwardClick('[role=switch]:not([disabled])')}>
  <Card.Symbol style={{ color: isOn ? light.color : undefined }}>…</Card.Symbol>
  <Card.Switch aria-label={label} checked={isOn} tint={light.color} … />
  <Card.Title>{label}</Card.Title>
  <Card.Value>{getValueText(formatted(light.brightness), …)}</Card.Value>
  <ChannelsHostContext.Provider value={{ isShown: isLarge, onLightChange: setLight }}>
    {children}                               // <Card.Channels>…</Card.Channels>
  </ChannelsHostContext.Provider>
</Card.Root>`;
/* eslint-enable unicorn/no-incorrect-template-string-interpolation */

const sections: readonly Section[] = [
  ['cards-made-of-card-s-parts', 'Cards made of Card’s parts'],
  ['hearing-their-parts', 'Hearing their parts'],
  ['what-flows-in-and-out', 'What flows in and out'],
];

/** `/control-cards/architecture`: how it's built, and what flows into it. */
export const ControlCardsArchitecture: FunctionComponent = () => (
  <>
    <Contents sections={sections} />
    <ul className="demo-lead">
      <li>
        ControlCards is a set of ready-made cards for a home’s devices. It isn’t
        one component with parts. Each card is a{' '}
        <PartLink
          component="card"
          part="Card.Root"
        />{' '}
        with Card’s parts in it, composed for its kind. How those parts work (a
        slider filling a card, a progress, stages, channels, a choice, rows,
        corner buttons) is on Card’s{' '}
        <a href={publicUrl('card/architecture')}>architecture</a> page. To learn
        how to use the cards, see their{' '}
        <a href={publicUrl('control-cards/parts')}>parts</a>.
      </li>
    </ul>

    <Heading
      id="cards-made-of-card-s-parts"
      level={2}
    >
      Cards made of Card’s parts
    </Heading>
    <ul>
      <li>
        Every card renders a symbol (its <code>icon</code>, and its{' '}
        <code>emphasizedIcon</code> while it’s on) and a title (its{' '}
        <code>label</code>, also its controls’ accessible name). It takes the
        root’s other props, and adds its <code>children</code> after its parts.
      </li>
      <li>
        A card’s state is controlled or uncontrolled, as in Base UI, and which
        one is fixed as it mounts.
      </li>
      <li>
        <PartLink part="ControlCards.State" />,{' '}
        <PartLink part="ControlCards.Switch" />,{' '}
        <PartLink part="ControlCards.Value" />,{' '}
        <PartLink part="ControlCards.Slider" /> and{' '}
        <PartLink part="ControlCards.Button" /> render all their parts
        themselves. Their children are extras, for example a corner button.
      </li>
      <li>
        <PartLink part="ControlCards.Progress" />,{' '}
        <PartLink part="ControlCards.Stages" />,{' '}
        <PartLink part="ControlCards.Light" />,{' '}
        <PartLink part="ControlCards.List" /> and{' '}
        <PartLink part="ControlCards.Segmented" /> render their symbol, title
        and value, and take the rest as children: Card’s parts, as the app
        composes them.
      </li>
      <li>
        A press anywhere on a switching card is passed on to its switch with{' '}
        <PartLink
          component="list"
          part="forwardClick"
        />
        , which leaves presses on other controls in it to them (its channels,
        its choice, a row’s button).
      </li>
    </ul>
    <CodeView code={switchCode} />

    <Heading
      id="hearing-their-parts"
      level={2}
    >
      Hearing their parts
    </Heading>
    <ul>
      <li>
        A composed card shows what its parts hold, though the app composes them.
        Each listens through a context its parts know, internal to the library.
      </li>
      <li>
        <PartLink part="ControlCards.Light" /> provides its channels a host:
        whether they’re shown (only while it’s large; mounted all the same, so
        it still hears them), and where the light they make goes. Its symbol and
        switch take that light’s color, its value its brightness.
      </li>
      <li>
        <PartLink part="ControlCards.Segmented" /> provides its choice a host:
        its options register there too, and the choice reports its value and
        layout. So the card’s symbol, tint and value are the chosen option’s,
        it’s lit while that isn’t its <code>offValue</code>, and at 1x1 a press
        on it opens it above the page. It also tells a{' '}
        <PartLink
          component="card"
          part="Card.OpenButton"
        />{' '}
        in it to show only at 1x1, where its options are hidden.
      </li>
      <li>
        <PartLink part="ControlCards.Progress" /> and{' '}
        <PartLink part="ControlCards.Stages" /> pass their <code>tint</code> on
        through the stylesheet: a custom property on the card, which a bar or a
        list of stages uses unless it has a tint of its own.
      </li>
    </ul>
    <CodeView code={lightCode} />

    <Heading
      id="what-flows-in-and-out"
      level={2}
    >
      What flows in and out
    </Heading>
    <ul>
      <li>
        <strong>From Card:</strong> the root and all its parts, and the hosts
        its channels, its choice and its open button listen to.
      </li>
      <li>
        <strong>From Grid:</strong> each card’s tile size and open state (
        <PartLink
          component="grid"
          part="useGridItem"
        />
        ), for a light’s large layout and a choice’s 1x1.
      </li>
      <li>
        <strong>From List:</strong>{' '}
        <PartLink
          component="list"
          part="forwardClick"
        />
        . <strong>From Badge and Symbol:</strong> a button card’s badge, every
        card’s symbol.
      </li>
      <li>
        <strong>Out to the app:</strong> each card’s callbacks (
        <code>onCheckedChange</code>, <code>onValueChange</code>), and its{' '}
        <PartLink
          component="card"
          part="Card.Root"
        />
        ’s <code>actionsRef</code>.
      </li>
    </ul>
  </>
);
