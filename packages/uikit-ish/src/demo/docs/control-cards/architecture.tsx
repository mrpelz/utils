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
  onClick={onClick ?? forwardClick('[role=switch]')}
>
  <Card.Symbol tint={tint}>{symbolOf({ emphasizedIcon, icon })}</Card.Symbol>
  <Card.Title>{name}</Card.Title>
  <Card.Value>{isOn ? states[0] : states[1]}</Card.Value>
  <Card.Switch aria-label={name} checked={isOn} tint={tint} onCheckedChange={switchTo} />
  {children}                                 // e.g. a corner button
</Card.Root>`;
/* eslint-enable unicorn/no-incorrect-template-string-interpolation */

const pressCode = `// pressProps, in short: every press on a slider card is held back, so
// the slider doesn't set its value as it's pressed, nor follow a scroll.
onPointerDownCapture: (event) => {
  event.stopPropagation();                   // the slider not told yet
  on('pointermove', (move) => {
    if (distance(move, event) < slop) return; // 4px, a touch's 8px
    stopListening();
    if (isTouch && movesAcross(move, event)) return; // a scroll: let go
    target.dispatchEvent(new PointerEvent('pointerdown', event)); // a drag
  });
  on('pointerup', () => {
    if (!onClick) return target.dispatchEvent(event); // a tap sets the value
    onClick();                               // a click: the value kept
    swallowNextClickElsewhere();             // a tap moved to the switch
  });
  on('pointercancel', stopListening);        // the browser scrolls
}`;

const sections: readonly Section[] = [
  ['cards-made-of-card-s-parts', 'Cards made of Card’s parts'],
  ['the-slider-cards', 'The slider cards'],
  ['a-light-s-channels', 'A light’s channels'],
  ['values-and-lists', 'Values and lists'],
  ['a-choice-of-modes', 'A choice of modes'],
  ['corner-buttons', 'Corner buttons'],
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
        with Card’s parts and the library’s controls in it. The general behavior
        comes from Card, which has its own{' '}
        <a href={publicUrl('card/architecture')}>architecture</a> page. To learn
        how to use these cards, see their{' '}
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
        Every card renders a symbol, a title and usually a value. It takes the
        root’s other props, and adds its <code>children</code> after its parts,
        for example a corner button.
      </li>
      <li>A card’s state can be controlled or uncontrolled, as in Base UI.</li>
      <li>
        <PartLink part="ControlCards.State" /> only displays a state. It’s lit
        by <code>active</code>, and its value says the state in words.
      </li>
      <li>
        <PartLink part="ControlCards.Switch" /> holds a{' '}
        <PartLink
          component="card"
          part="Card.Switch"
        />
        . Its <code>tint</code> colors both the symbol and the switch. The card
        is lit while the switch is on. A press anywhere on the card is passed on
        to the switch (<code>forwardClick</code>, from List).
      </li>
      <li>
        <PartLink part="ControlCards.Button" /> is momentary. It lights up for a
        moment when you press it, or when the app flashes it. It can show a{' '}
        <PartLink
          component="badge"
          part="Badge"
        />{' '}
        on its symbol.
      </li>
      <li>
        <PartLink part="ControlCards.Progress" /> is composed: its symbol and
        title are its own, and the app puts in what it shows. A{' '}
        <PartLink part="ControlCards.ProgressBar" /> is a pill at its bottom: a
        well like a list card’s, filling in its tint. It’s Base UI’s progress
        bar, so it’s announced as one. Its{' '}
        <PartLink part="ControlCards.ProgressLabel" /> and{' '}
        <PartLink part="ControlCards.ProgressDetail" /> are drawn twice, and the
        copy on the fill is clipped to it, so they read on both parts without
        laying anything out anew. On the fill they take dark or light text,
        whichever has more perceived contrast with the tint (APCA, not WCAG’s
        ratio, which picks dark text on mid blues), read once and again when the
        tint or the color scheme changes. The detail there is that text color,
        less strong, not the glass’s secondary gray.
      </li>
      <li>
        A <PartLink part="ControlCards.Subtitle" /> and a{' '}
        <PartLink part="ControlCards.ProgressValue" /> each have a row of their
        own under the title, so a large tile can show both. A tile a row tall
        has no room for them beside the bar, so they don’t show there.
      </li>
    </ul>
    <CodeView code={switchCode} />

    <Heading
      id="the-slider-cards"
      level={2}
    >
      The slider cards
    </Heading>
    <ul>
      <li>
        <PartLink part="ControlCards.SliderFill" /> is a{' '}
        <PartLink
          component="slider"
          part="Slider.Root"
        />{' '}
        whose fill is the card’s background. It fills from the leading edge, or
        from the bottom when the tile is upright (
        <code>useCardOrientation</code>). With a step, it shows a tick for each
        step.
      </li>
      <li>
        Everything that sits over the fill is drawn twice: once on the card, and
        once in a layer inside the fill, in the fill’s color scheme and clipped
        by its edge. The fill copies its own label, value and ticks into that
        layer. The card’s symbol and corner buttons portal their copies into it,
        as{' '}
        <a href={publicUrl('card/architecture#drawing-over-a-fill')}>
          Card’s architecture
        </a>{' '}
        describes.
      </li>
      <li>
        The fill’s tone is read from its color when its tint or the color scheme
        changes. It isn’t read while the fill moves.
      </li>
      <li>
        <PartLink part="ControlCards.Slider" /> is a card with a fill and its
        symbol. With <code>checked</code> or <code>defaultChecked</code>, it
        also has a switch. Then a click on the fill toggles the switch, while a
        drag still sets the value.
      </li>
      <li>
        Until a press turns out to be a drag or a click, the slider isn’t told
        about it, so it doesn’t jump to where you pressed. Once the press moves
        4px, it’s dispatched again at the place where it started.
      </li>
      <li>
        A touch waits for 8px, then looks at its direction. Along the fill, it’s
        a drag. Across it, it’s a scroll: the page scrolls and the value stays.
        Base UI’s slider follows a finger even while the page scrolls, so it
        never sees these touches.
      </li>
      <li>
        Without a click of its own, a press released before it moves is handed
        to the slider then, so a tap still sets the value where it lands.
      </li>
      <li>
        A vertical fill can’t tell a scroll from a drag, so the page doesn’t
        scroll from it, just like with any other vertical slider.
      </li>
      <li>
        On iOS, the browser can move a tap’s click to the switch nearby. That
        click is swallowed, so the switch doesn’t toggle twice.
      </li>
      <li>
        As a <code>brightness</code> card, it’s never lit. Its dark glass and
        its fill show how much light there is. Its symbol is on while the value
        is above the minimum.
      </li>
    </ul>
    <CodeView code={pressCode} />

    <Heading
      id="a-light-s-channels"
      level={2}
    >
      A light’s channels
    </Heading>
    <ul>
      <li>
        <PartLink part="ControlCards.Light" /> has a switch and a value, and its
        channels are composed in it: a <PartLink part="ControlCards.Channels" />{' '}
        of <PartLink part="ControlCards.Channel" />
        s, each controlled or uncontrolled on its own, as Base UI’s sliders are.
        Each channel tells the light, through context, the light it gives.
      </li>
      <li>
        Its symbol’s color adds up its amount channels in linear light, as light
        does, then tints them by any scale channel, and shows the result at full
        strength. Its value is its strongest amount channel’s share.
      </li>
      <li>
        In a large tile, at least two by two or open above the page, its
        channels show. In a small tile they stay mounted but hidden. A press on
        the card’s body toggles its switch, at any size, but not one on its
        channels. Its channels’ presses are their own: the card shows no press
        tint for them (<code>data-card-own-press</code>, see Card).
      </li>
      <li>
        A channel’s thumb is placed by Base UI, kept inside its well at both
        ends. Its fill and its labels are its own: the labels are placed after
        each change, and each takes dark or light text by what’s under its
        center, by the same contrast as a progress bar’s. The colors behind that
        are read once, and again when they or the color scheme change; moving
        the thumb only compares numbers.
      </li>
      <li>
        A press on a channel is held back as a slider card’s is, until it’s a
        drag along the well; a touch across it scrolls the page, the value
        untouched. Once it’s dragged, its touch doesn’t scroll the page.
      </li>
    </ul>

    <Heading
      id="values-and-lists"
      level={2}
    >
      Values and lists
    </Heading>
    <ul>
      <li>
        <PartLink part="ControlCards.Value" /> formats a number with{' '}
        <code>Intl.NumberFormat</code>, in the document’s language unless you
        give one.
      </li>
      <li>
        <PartLink part="ControlCards.Trend" /> is an arrow after the value,
        turned by its angle with a transition. For assistive technology, it’s
        named rising, falling or steady.
      </li>
      <li>
        <PartLink part="ControlCards.List" /> holds a glass{' '}
        <a href={publicUrl('list')}>List</a> of rows. A resize observer counts
        how many rows fit whole in its room, at least one, and only those
        render. A row is as tall as Card makes it: 30px in a tile, 44px open
        above the page. So the card’s size decides how many rows you see.
      </li>
      <li>
        When rows are left out, the last row counts them instead, and it’s a
        button that expands the card (where that would change its size) or opens
        it above the page. Expanded, it makes the card small again. Its corner
        symbol is the one the corner button would show. With no rows, the card
        falls back to those corner buttons. With rows, a corner button that
        draws nothing sits over the last row and does the same, for a large
        touch target; it’s hidden from assistive technology and the keyboard,
        which use the row.
      </li>
    </ul>

    <Heading
      id="a-choice-of-modes"
      level={2}
    >
      A choice of modes
    </Heading>
    <ul>
      <li>
        <PartLink part="ControlCards.Segmented" /> isn’t built on{' '}
        <a href={publicUrl('segmented')}>Segmented</a>, which only lays its
        items out side by side. It’s Base UI’s RadioGroup, its options as radios
        in a well, so it can stack them too. The arrow keys move between them,
        and there’s no lens.
      </li>
      <li>
        Dragging between options is its own, as Segmented’s is but without the
        lens: the thumb is what moves. A press waits until it moves 4px (a touch
        8px) and then looks at the direction. Along the options it’s a drag, and
        each option is chosen as the finger reaches it, the thumb going there. A
        touch across them is a scroll: it’s let go, as on the slider cards. Once
        dragging, a non-passive touchmove listener keeps the browser from
        panning as the finger strays across (React’s are passive). Upright cards
        don’t let the page scroll from them, as vertical sliders don’t; they’re
        slim, so there’s room beside them to scroll.
      </li>
      <li>
        What each segment shows is the app’s choice (<code>optionContent</code>
        ): symbol and label, symbol only (the label becomes its name), or label
        only. The layout only arranges them, beside each other across a row and
        stacked when taller.
      </li>
      <li>
        Its options are composed as Segmented’s items are: each a{' '}
        <PartLink part="ControlCards.SegmentedItem" /> in the card. Each item
        tells the card its symbol, words and tint through context, in a layout
        effect, so the card can show the chosen one’s as its own symbol and
        value. At 1x1, where no options show, the items stay mounted in a hidden
        group, so the card still knows them.
      </li>
      <li>
        A thumb sits under the chosen option. A layout effect measures that
        option’s box and moves the thumb there, again whenever the group
        resizes. It only transitions once it has been placed, so it doesn’t
        slide in when the card mounts.
      </li>
      <li>
        The layout comes from its grid item’s size (its open size while it’s
        open above the page) and its orientation, if the app gives one: a row,
        taller, stacked, or 1x1 without options. Stacked needs at least two
        rows, so a vertical card one row tall shows only its chosen option.
        Outside a grid, it’s a row, or stacked when vertical.
      </li>
      <li>
        The card is active while the chosen option isn’t its off option, so Card
        lights it. Its symbol and tint follow the chosen option.
      </li>
    </ul>

    <Heading
      id="corner-buttons"
      level={2}
    >
      Corner buttons
    </Heading>
    <ul>
      <li>
        <PartLink part="ControlCards.ExpandButton" /> is a corner button that
        switches its card between two sizes your app keeps. Each size is
        resolved the way the grid item would resolve it now (<code>sizeOf</code>
        ). If both come out the same, the button is hidden. Its icon shows which
        way it goes.
      </li>
      <li>
        <PartLink part="ControlCards.OpenButtons" /> are two corner buttons. One
        opens the card above the page through its grid item, and the other
        closes it again. Each shows only when it applies.
      </li>
    </ul>

    <Heading
      id="what-flows-in-and-out"
      level={2}
    >
      What flows in and out
    </Heading>
    <ul>
      <li>
        <strong>From Card:</strong> the root, its parts, its orientation and its
        copy layer.
      </li>
      <li>
        <strong>From Grid:</strong> each card’s tile size and open state (
        <code>useGridItem</code>), and its icons.
      </li>
      <li>
        <strong>From the controls:</strong> Switch, Slider, List, Badge and
        Symbol. From Base UI directly: its progress bar (a progress card’s bar),
        its slider (a channel) and its radio group (a segmented card).
      </li>
      <li>
        <strong>From Glass and Settings:</strong> the color scheme of what’s
        drawn on a fill, and the color scheme its color is read again for. From
        the color picker, its CSS color parser.
      </li>
    </ul>
  </>
);
