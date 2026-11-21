import { FunctionComponent } from 'react';

import { CodeView } from '../../tooling/frame/code-view.js';
import {
  Contents,
  Heading,
  PartLink,
  type Section,
} from '../../tooling/guide/sections.js';
import { publicUrl } from '../../tooling/public-url.js';

// `/card/architecture`: how Card is built inside, and what flows into it
// from Grid, Glass, Switch and ControlCards.

/* eslint-disable unicorn/no-incorrect-template-string-interpolation -- JSX braces in code samples, not interpolations */
const treeCode = `<div class="uikit-card-root uikit-glass-medium uikit-glass-panel"
     data-card-part="root" data-active data-color-scheme="light">
  <!-- ColorSchemeScope, CardBlendScope.Provider (no elements) -->
  <div class="uikit-card-frame">        <!-- its size container -->
    <div class="uikit-card-layout">     <!-- its parts' grid -->
      <span data-card-part="symbol">…</span>
      <span data-card-part="title">…</span>
      <span data-card-part="value">…</span>
      <!-- a switch, a slider, a list: styled by the card -->
      <button data-card-part="corner-button">…</button>
    </div>
  </div>
</div>`;

const stateCode = `// Card.Root, in short: its state, its color scheme, its marks.
const item = useGridItem();                 // in a grid's tile: its item
const isEditing = item?.editing === true;
const switchState = useSwitchState(ref);    // a switch in it: on, off, none
const state = active ?? switchState;        // given wins (e.g. never lit)
const toned = useGlassScheme(ref, context); // its glass's backdrop tone
const scheme = isEditing
  ? undefined                               // veiled: the page's
  : state === undefined
    ? toned                                 // not switchable: by its glass
    : state ? 'light' : 'dark';             // lit, or dark glass`;

const blendCode = `// ControlCards.SliderFill, in short: it registers a layer inside its
// fill; the card's parts draw a copy of themselves into it.
const setLayer = useContext(CardBlendScope)?.setLayer;

<Slider.Indicator>
  <span ref={setLayer} className="uikit-card-blend"
        data-color-scheme={fillScheme} />
</Slider.Indicator>

// Card.Symbol (and Card.CornerButton), in short:
const layer = useContext(CardBlendScope)?.layer;
<>
  <span className="uikit-card-symbol">{children}</span>
  {layer ? createPortal(<span data-card-copy>{children}</span>, layer) : null}
</>`;

const cornersCode = `// Card.Root, in short: its corner buttons keep to its corners as its tile
// changes its box (laid out at the new size at once, then moved there).
useGridItemLayout({
  onAfterChange: ({ duration, easing, from, to }) => {
    for (const button of cornerButtonsOf(root)) {
      // At its trailing or bottom edge: off by as much as that edge is.
      const [x, y] = offsetOf(button, from, to);
      startWithFrame(
        button.animate(
          [{ translate: \`\${x}px \${y}px\` }, { translate: '0 0' }],
          { composite: 'add', duration, easing },
        ),
      );
    }
  },
});`;
/* eslint-enable unicorn/no-incorrect-template-string-interpolation */

const sections: readonly Section[] = [
  ['the-element-tree', 'The element tree'],
  ['the-roots-state', 'The root’s state'],
  ['laid-out-by-its-size', 'Laid out by its size'],
  ['the-parts', 'The parts'],
  ['moving-with-its-tile', 'Moving with its tile'],
  ['drawing-over-a-fill', 'Drawing over a fill'],
  ['what-flows-in-and-out', 'What flows in and out'],
];

/** `/card/architecture`: how it's built, and what flows into it. */
export const CardArchitecture: FunctionComponent = () => (
  <>
    <Contents sections={sections} />
    <ul className="demo-lead">
      <li>
        How a card is built inside: what its root renders around its parts,
        where its state comes from, how it lays itself out by its size, and what
        it takes from the components around it. For using it, see its{' '}
        <a href={publicUrl('card/parts')}>parts</a> and{' '}
        <a href={publicUrl('card/composition')}>composition</a>.
      </li>
      <li>
        A card is one surface and a few plain parts. Most of what it does is the
        root’s: its state, its colors, its layout, its corners. The parts are
        spans and a button, laid out by the root’s stylesheet.
      </li>
    </ul>

    <Heading
      id="the-element-tree"
      level={2}
    >
      The element tree
    </Heading>
    <ul className="demo-tree">
      <li>
        <PartLink part="Card.Root" /> <span>(the glass, its state)</span>
        <ul>
          <li>
            <code>.uikit-card-frame</code>{' '}
            <span>(its size container, filling it)</span>
            <ul>
              <li>
                <code>.uikit-card-layout</code> <span>(its parts’ grid)</span>
                <ul>
                  <li>
                    <PartLink part="Card.Symbol" />,{' '}
                    <PartLink part="Card.Title" />,{' '}
                    <PartLink part="Card.Value" />
                  </li>
                  <li>
                    <span>a</span>{' '}
                    <PartLink
                      component="switch"
                      part="Switch.Root"
                    />
                    <span>, a</span>{' '}
                    <PartLink
                      component="slider"
                      part="Slider.Root"
                    />{' '}
                    <span>or a</span>{' '}
                    <PartLink
                      component="list"
                      part="List.Root"
                    />{' '}
                    <span>(styled by the card)</span>
                  </li>
                  <li>
                    <PartLink part="Card.CornerButton" />
                  </li>
                </ul>
              </li>
            </ul>
          </li>
        </ul>
      </li>
    </ul>
    <ul>
      <li>
        The root renders two elements of its own around what it’s given: a frame
        and a layout. Nothing else is added, so whatever you put in a card is a
        child of its layout, and the layout’s grid places it.
      </li>
      <li>
        The frame is there for size queries. A container can’t query its own
        size, so the root, which carries the glass, isn’t the container: the
        frame inside it is (see{' '}
        <a href="#laid-out-by-its-size">Laid out by its size</a>).
      </li>
      <li>
        The root also provides two contexts without elements: a color scheme for
        everything in it, and the layer its parts draw copies into over a
        slider’s fill (see{' '}
        <a href="#drawing-over-a-fill">Drawing over a fill</a>
        ).
      </li>
      <li>
        The root renders through Base UI’s <code>useRender</code>, so its{' '}
        <code>render</code> prop can swap its element, as Base UI parts’ can.
      </li>
    </ul>
    <CodeView code={treeCode} />

    <Heading
      id="the-roots-state"
      level={2}
    >
      The root’s state
    </Heading>
    <ul>
      <li>
        <strong>Lit or not.</strong> A card is lit (opaque, bright, its text
        dark) or not (its glass). Its <code>active</code> decides when it’s
        given. When it isn’t, a switch in it decides: the root watches its
        layout for a{' '}
        <PartLink
          component="switch"
          part="Switch.Root"
        />{' '}
        and its <code>data-checked</code> with a <code>MutationObserver</code>,
        and reads it before the card paints. Without either, the card isn’t
        switchable.
      </li>
      <li>
        <strong>Given wins.</strong> When <code>active</code> is given, the root
        also marks itself <code>data-active-given</code>, and the stylesheet
        then ignores a switch in it. That’s how a dimmer with a switch stays
        unlit while it’s on.
      </li>
      <li>
        <strong>Its color scheme.</strong> Lit, its scheme is light; unlit and
        switchable, dark, in either page scheme, so what’s on reads at a glance.
        A card that isn’t switchable takes the scheme its glass’s{' '}
        <a href={publicUrl('glossary#backdrop-tone')}>backdrop tone</a> calls
        for, which Glass samples from what’s behind it. The scheme goes on the
        root (<code>data-color-scheme</code>, and the <code>color-scheme</code>{' '}
        it implies) and into a scope for what’s in it, so the parts never sample
        anything themselves: their background is known.
      </li>
      <li>
        <strong>Editing.</strong> Inside a{' '}
        <PartLink
          component="grid"
          part="Grid.Item"
        />{' '}
        whose grid is editing (read with{' '}
        <PartLink
          component="grid"
          part="useGridItem"
        />
        ), the root is <code>inert</code>, so presses go to the grid, and its
        veil covers everything in it, its switch and corner buttons too. The
        color scheme falls back to the page’s.
      </li>
      <li>
        <strong>Pressable and momentary.</strong> With an <code>onClick</code>,
        the root marks itself pressable and shows hover and press feedback. A{' '}
        <code>momentary</code> card with an <code>onClick</code> flashes on each
        press: lit for a moment, then fading back, by two timers setting{' '}
        <code>data-flashing</code> and <code>data-fading</code>. Its{' '}
        <code>actionsRef</code> exposes the same <code>flash()</code> to the
        app.
      </li>
    </ul>
    <CodeView code={stateCode} />

    <Heading
      id="laid-out-by-its-size"
      level={2}
    >
      Laid out by its size
    </Heading>
    <ul>
      <li>
        The frame is a size container named <code>uikit-card</code>. The layout
        inside it is a grid with named areas: the symbol at the top leading
        corner, a control (a switch) at the top trailing one, the title right
        above the value at the bottom leading corner.
      </li>
      <li>
        Container queries on the frame change what that grid shows: from 180px
        each way, the value is large. A list or a slider in the card takes the
        room between the top row and the title, or the whole card.
      </li>
      <li>
        Because the layout follows the frame, not the grid it’s in, a card
        outside a grid works the same: it’s as large as its box, and lays out by
        that.
      </li>
      <li>
        <PartLink part="useCardOrientation" /> is the one size fact read in
        script: the tile’s shape from its item’s effective size, wide or tall. A
        slider filling the card uses it for its direction.
      </li>
    </ul>

    <Heading
      id="the-parts"
      level={2}
    >
      The parts
    </Heading>
    <ul>
      <li>
        <PartLink part="Card.Title" /> and <PartLink part="Card.Value" /> are
        spans with a part attribute. The value formats a number with{' '}
        <code>Intl.NumberFormat</code>, by the app’s options and the document’s
        language unless a locale is given.
      </li>
      <li>
        <PartLink part="Card.Symbol" /> is a span its{' '}
        <PartLink
          component="symbol"
          part="Symbol"
        />{' '}
        sits in. Its <code>active</code> (or a lit card) shows the symbol’s
        emphasized icon, in its tint, through the stylesheet.
      </li>
      <li>
        <PartLink part="Card.CornerButton" /> is a{' '}
        <PartLink
          component="grid"
          part="Grid.CornerButton"
        />
        . It hides while the grid is editing, and stops its click from reaching
        the card, so a press on it never toggles a switch the card passes its
        presses on to.
      </li>
      <li>
        <PartLink part="cardSizes" /> is plain data: the sizes each kind of card
        supports, for its item’s <code>supportedSizes</code>.
      </li>
    </ul>

    <Heading
      id="moving-with-its-tile"
      level={2}
    >
      Moving with its tile
    </Heading>
    <ul>
      <li>
        When its tile expands, opens above the page or closes, the grid moves
        and resizes the tile (see Grid’s{' '}
        <a href={publicUrl('grid/composition#expanding-in-place')}>
          Expanding in place
        </a>
        ). The card is laid out at the new size at once, and its glass is
        resized with the tile, clipping what’s in it.
      </li>
      <li>
        Its corner buttons would jump to their new corners. So the root listens
        with{' '}
        <PartLink
          component="grid"
          part="useGridItemLayout"
        />{' '}
        and, after each change, moves every corner button at the trailing or
        bottom edge from where that edge was, with the tile’s duration and
        easing. The animation is added to the button’s own transforms (
        <code>composite: &apos;add&apos;</code>) and starts on the tile’s first
        frame.
      </li>
      <li>
        Its other parts stay where they’re laid out. Moving them is the app’s,
        as the demos do with GSAP.
      </li>
    </ul>
    <CodeView code={cornersCode} />

    <Heading
      id="drawing-over-a-fill"
      level={2}
    >
      Drawing over a fill
    </Heading>
    <ul>
      <li>
        A slider filling the card (
        <PartLink
          component="control-cards"
          part="ControlCards.SliderFill"
        />
        ) has an opaque fill that moves across what’s over it. To keep that
        legible, what’s over the fill is drawn twice: once on the glass, once
        inside the fill in the fill’s colors, clipped by its edge.
      </li>
      <li>
        The root provides <code>CardBlendScope</code>, an internal context with
        a layer and its setter. The slider fill renders a layer inside its
        indicator and registers it. While a layer is registered, the root marks
        itself <code>data-card-blend</code>, and its own parts sit under the
        fill.
      </li>
      <li>
        <PartLink part="Card.Symbol" /> portals a copy of itself into the layer.{' '}
        <PartLink part="Card.CornerButton" /> draws two copies, one on the glass
        and one in the layer, and its real button stays on top, transparent, to
        take the press. The slider fill draws its own label, value and ticks
        into the same layer.
      </li>
      <li>
        A slider in the card has no other link to it: Slider itself knows
        nothing about cards. The fill and the layer are ControlCards’.
      </li>
    </ul>
    <CodeView code={blendCode} />

    <Heading
      id="what-flows-in-and-out"
      level={2}
    >
      What flows in and out
    </Heading>
    <ul>
      <li>
        <strong>From Grid:</strong>{' '}
        <PartLink
          component="grid"
          part="useGridItem"
        />{' '}
        (editing, its effective size for the orientation) and{' '}
        <PartLink
          component="grid"
          part="useGridItemLayout"
        />{' '}
        (its tile changing its box). The corner buttons are{' '}
        <PartLink
          component="grid"
          part="Grid.CornerButton"
        />
        s. Outside a grid, none of this applies: the card is never editing,
        horizontal, and still.
      </li>
      <li>
        <strong>From Glass:</strong> the medium material’s classes, and the
        backdrop tone of a card that isn’t switchable.
      </li>
      <li>
        <strong>From Settings:</strong> the color scheme scope the root sets for
        what’s in it, so portaled and nested parts follow the card, not the
        page.
      </li>
      <li>
        <strong>From a switch, a slider, a list:</strong> nothing in script but
        the switch’s state. The card’s stylesheet styles them by where they sit,
        as direct children of its layout.
      </li>
      <li>
        <strong>Out to ControlCards:</strong> <code>CardBlendScope</code> for
        the slider fill’s copies, <PartLink part="useCardOrientation" /> for its
        direction, and <PartLink part="cardSizes" /> for the ready-made cards’
        items. To the app: <code>actionsRef</code>’s <code>flash()</code>.
      </li>
    </ul>
  </>
);
