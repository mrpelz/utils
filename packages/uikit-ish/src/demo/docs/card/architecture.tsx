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
        This page shows how a card is built inside. It covers what the root
        renders around its parts, where its state comes from, how it lays itself
        out by its size, and what it takes from the components around it. To
        learn how to use it, see its <a href={publicUrl('card/parts')}>parts</a>{' '}
        and <a href={publicUrl('card/composition')}>composition</a>.
      </li>
      <li>
        A card is one surface with a few plain parts. Most of what it does is
        the root’s job: its state, its colors, its layout and its corners. The
        parts are spans and a button, and the root’s stylesheet lays them out.
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
                    <PartLink part="Card.Value" />,{' '}
                    <PartLink part="Card.Switch" />
                  </li>
                  <li>
                    <span>a</span>{' '}
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
        The root renders two elements of its own around what you give it: a
        frame and a layout. Nothing else is added. So whatever you put in a card
        is a child of its layout, and the layout’s grid places it.
      </li>
      <li>
        The frame is there for size queries. A container can’t query its own
        size. So the root, which carries the glass, isn’t the container. The
        frame inside it is (see{' '}
        <a href="#laid-out-by-its-size">Laid out by its size</a>).
      </li>
      <li>
        The root also provides two contexts, without elements. One is a color
        scheme for everything in the card. The other is the layer its parts draw
        copies into over a slider’s fill (see{' '}
        <a href="#drawing-over-a-fill">Drawing over a fill</a>).
      </li>
      <li>
        The root renders through Base UI’s <code>useRender</code>. So its{' '}
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
        <strong>Lit or not.</strong> A card is either lit, which makes it opaque
        and bright with dark text, or it isn’t, and shows its glass.
      </li>
      <li>
        When you give <code>active</code>, it decides. When you don’t, a switch
        in the card decides. The root watches its layout for a{' '}
        <PartLink
          component="switch"
          part="Switch.Root"
        />{' '}
        and its <code>data-checked</code> with a <code>MutationObserver</code>.
        It reads the switch before the card paints. With neither, the card isn’t
        switchable.
      </li>
      <li>
        A <PartLink part="Card.Switch" /> sets its <code>tint</code> as a custom
        property, and the stylesheet makes it the switch’s on color. Over a
        slider’s fill, the stylesheet uses darker shades instead, of the tint
        when on and of the fill’s gray when off, so the switch stays set apart
        from the fill. A card that’s never lit (<code>active</code> given as{' '}
        <code>false</code>) uses them at every size, so its switch doesn’t
        change as the card expands.
      </li>
      <li>
        <strong>Given wins.</strong> When <code>active</code> is given, the root
        also marks itself <code>data-active-given</code>. The stylesheet then
        ignores a switch in it. That’s how a dimmer with a switch stays unlit
        while it’s on.
      </li>
      <li>
        <strong>Its color scheme.</strong> A lit card’s scheme is light. An
        unlit, switchable card’s scheme is dark, in either page scheme. So you
        can tell what’s on at a glance.
      </li>
      <li>
        A card that isn’t switchable takes the scheme that its glass’s{' '}
        <a href={publicUrl('glossary#backdrop-tone')}>backdrop tone</a> calls
        for. Glass samples that tone from what’s behind the card.
      </li>
      <li>
        The scheme is set on the root, as <code>data-color-scheme</code> and the{' '}
        <code>color-scheme</code> it implies. It also goes into a scope for the
        card’s content. So the parts never sample anything themselves, because
        their background is already known.
      </li>
      <li>
        <strong>Editing.</strong> Inside a{' '}
        <PartLink
          component="grid"
          part="Grid.Item"
        />{' '}
        whose grid is editing, read with{' '}
        <PartLink
          component="grid"
          part="useGridItem"
        />
        , the root is <code>inert</code>. So presses go to the grid. The card’s
        veil covers everything in it, including its switch and corner buttons.
        The color scheme falls back to the page’s.
      </li>
      <li>
        <strong>Pressable and momentary.</strong> With an <code>onClick</code>,
        the root marks itself as pressable, and shows hover and press feedback.
      </li>
      <li>
        A <code>momentary</code> card with an <code>onClick</code> flashes on
        each press. It lights up for a moment, then fades back. Two timers do
        this, by setting <code>data-flashing</code> and <code>data-fading</code>
        . Its <code>actionsRef</code> gives your app the same{' '}
        <code>flash()</code>.
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
        The frame is a size container named <code>uikit-card</code>.
      </li>
      <li>
        The layout inside it is a grid with named areas. The symbol sits at the
        top leading corner, and a control, such as a switch, at the top trailing
        corner. The title sits right above the value, at the bottom leading
        corner.
      </li>
      <li>
        Container queries on the frame change what that grid shows. From 180px
        in each direction, the value is large. A list or a slider in the card
        takes the room between the top row and the title, or the whole card.
      </li>
      <li>
        The layout follows the frame, not the grid the card is in. So a card
        outside a grid works the same way. It’s as large as its box, and lays
        out by that.
      </li>
      <li>
        <PartLink part="useCardOrientation" /> is the one size fact read in
        script. It’s the tile’s shape, wide or tall, from its item’s effective
        size. A slider that fills the card uses it for its direction.
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
        spans with a part attribute.
      </li>
      <li>
        The value formats a number with <code>Intl.NumberFormat</code>, using
        your options. It uses the document’s language, unless you give a locale.
      </li>
      <li>
        <PartLink part="Card.Symbol" /> is a span that its{' '}
        <PartLink
          component="symbol"
          part="Symbol"
        />{' '}
        sits in. When it’s <code>active</code>, or the card is lit, the
        stylesheet shows the symbol’s emphasized icon in its tint.
      </li>
      <li>
        <PartLink part="Card.CornerButton" /> is a{' '}
        <PartLink
          component="grid"
          part="Grid.CornerButton"
        />
        . It hides while the grid is editing.
      </li>
      <li>
        The corner button stops its click from reaching the card. So a press on
        it never toggles a switch that the card passes its presses on to.
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
        ).
      </li>
      <li>
        The card is laid out at the new size at once. Its glass is resized along
        with the tile, and clips what’s in it.
      </li>
      <li>
        Its corner buttons would jump to their new corners. So the root listens
        with{' '}
        <PartLink
          component="grid"
          part="useGridItemLayout"
        />
        . After each change, it moves every corner button at the trailing or
        bottom edge from where that edge was, with the tile’s duration and
        easing.
      </li>
      <li>
        That animation is added on top of the button’s own transforms (
        <code>composite: &apos;add&apos;</code>), and starts on the tile’s first
        frame.
      </li>
      <li>
        The card’s other parts stay where they’re laid out. Moving them is up to
        your app, as the demos do with GSAP.
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
        A slider can fill the card (
        <PartLink
          component="control-cards"
          part="ControlCards.SliderFill"
        />
        ). Its fill is opaque, and it moves across whatever is over it.
      </li>
      <li>
        To keep that readable, what’s over the fill is drawn twice. It’s drawn
        once on the glass, and once inside the fill in the fill’s colors,
        clipped by the fill’s edge.
      </li>
      <li>
        The root provides <code>CardBlendScope</code>, an internal context with
        a layer and its setter. The slider fill renders a layer inside its
        indicator, and registers it.
      </li>
      <li>
        While a layer is registered, the root marks itself{' '}
        <code>data-card-blend</code>, and its own parts sit under the fill.
      </li>
      <li>
        <PartLink part="Card.Symbol" /> portals a copy of itself into the layer.
      </li>
      <li>
        <PartLink part="Card.CornerButton" /> draws two copies, one on the glass
        and one in the layer. Its real button stays on top, transparent, to take
        the press.
      </li>
      <li>
        The slider fill draws its own label, value and ticks into the same
        layer.
      </li>
      <li>
        A slider in the card has no other link to it. Slider itself knows
        nothing about cards. The fill and the layer belong to ControlCards.
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
        gives it the editing state, and the effective size for its orientation.{' '}
        <PartLink
          component="grid"
          part="useGridItemLayout"
        />{' '}
        tells it when its tile changes its box. Its corner buttons are{' '}
        <PartLink
          component="grid"
          part="Grid.CornerButton"
        />
        s. Outside a grid, none of this applies. The card is then never editing,
        always horizontal, and never moves.
      </li>
      <li>
        <strong>From Glass:</strong> the medium material’s classes, and the
        backdrop tone of a card that isn’t switchable.
      </li>
      <li>
        <strong>From Settings:</strong> the color scheme scope that the root
        sets for its content. So portaled and nested parts follow the card, not
        the page.
      </li>
      <li>
        <strong>From a switch, a slider or a list:</strong> nothing in script
        except the switch’s state. The card’s stylesheet styles them by where
        they sit, as direct children of its layout.
      </li>
      <li>
        <strong>Out to ControlCards:</strong> <code>CardBlendScope</code> for
        the slider fill’s copies, <PartLink part="useCardOrientation" /> for its
        direction, and <PartLink part="cardSizes" /> for the items of the
        ready-made cards.
      </li>
      <li>
        <strong>Out to the app:</strong> <code>actionsRef</code>’s{' '}
        <code>flash()</code>.
      </li>
    </ul>
  </>
);
