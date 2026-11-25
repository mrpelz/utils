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
// from Grid, Glass, Switch and Slider.

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

const blendCode = `// Card.Slider, in short: it registers a layer inside its
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

const pressCode = `// pressProps, in short: every press on what a card drags is held back, so
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
  ['the-element-tree', 'The element tree'],
  ['the-roots-state', 'The root’s state'],
  ['laid-out-by-its-size', 'Laid out by its size'],
  ['the-parts', 'The parts'],
  ['moving-with-its-tile', 'Moving with its tile'],
  ['drawing-over-a-fill', 'Drawing over a fill'],
  ['presses-on-what-it-drags', 'Presses on what it drags'],
  ['progress-and-stages', 'Progress and stages'],
  ['channels', 'Channels'],
  ['a-choice-of-a-few', 'A choice of a few'],
  ['rows', 'Rows'],
  ['corner-buttons-by-its-tile', 'Corner buttons by its tile'],
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
        The frame also lets the browser skip what’s in a card while it’s off
        screen (<code>content-visibility: auto</code>). Its content isn’t
        styled, laid out, painted or hit-tested then, so a page of many cards
        scrolls smoothly. The root’s glass and shadow are drawn as usual.
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
        slider’s fill, the stylesheet uses a darker shade of the tint, so the
        switch stays set apart from the fill. Off, the fill isn’t drawn, so the
        switch keeps its own off color. A card that’s never lit (
        <code>active</code> given as <code>false</code>) uses them at every
        size, so its switch doesn’t change as the card expands.
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
        <PartLink part="Card.Title" />, <PartLink part="Card.Subtitle" /> and{' '}
        <PartLink part="Card.Value" /> are spans with a part attribute, each
        replaceable through <code>render</code>.
      </li>
      <li>
        The title tells the card its id in a layout effect (its own, or a
        generated one). The parts that are named by it, a progress bar, stages
        and a choice, read it from the card’s context, so they need no name of
        their own.
      </li>
      <li>
        The value formats a number with <code>Intl.NumberFormat</code>, using
        your options. It uses the document’s language, unless you give a locale.
        Its children follow the number, for example a{' '}
        <PartLink part="Card.Trend" />; without a number, they’re shown instead.
      </li>
      <li>
        <PartLink part="Card.Trend" /> is an arrow turned by its angle with a
        transition. For assistive technology, it’s named rising, falling or
        steady.
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
          component="card"
          part="Card.Slider"
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
        nothing about cards. The fill and the layer belong to Card.Slider.
      </li>
    </ul>
    <CodeView code={blendCode} />

    <Heading
      id="presses-on-what-it-drags"
      level={2}
    >
      Presses on what it drags
    </Heading>
    <ul>
      <li>
        <PartLink part="Card.Slider" />, <PartLink part="Card.Channel" /> and{' '}
        <PartLink part="Card.Segmented" /> are dragged. Until a press turns out
        to be a drag or a click, the slider isn’t told about it, so it doesn’t
        jump to where you pressed. Once the press moves 4px, it’s dispatched
        again at the place where it started.
      </li>
      <li>
        A touch waits for 8px, then looks at its direction. Along the control,
        it’s a drag. Across it, it’s a scroll: the page scrolls and the value
        stays. Base UI’s slider follows a finger even while the page scrolls, so
        it never sees these touches.
      </li>
      <li>
        Without a click of its own (the slider’s <code>onPress</code>), a press
        released before it moves is handed to the slider then, so a tap still
        sets the value where it lands. With one, the value is kept, and if the
        browser moves the tap’s click to a switch nearby (as on iOS), that click
        is swallowed, so the switch doesn’t toggle twice.
      </li>
      <li>
        Once dragged, a non-passive touchmove listener keeps the page from
        panning (React’s are passive). An upright slider can’t tell a scroll
        from a drag, so the page doesn’t scroll from it, as with any vertical
        slider.
      </li>
      <li>
        Channels and a choice are marked <code>data-card-own-press</code>: the
        card shows no press tint for them, and{' '}
        <PartLink
          component="list"
          part="forwardClick"
        />{' '}
        doesn’t pass their presses on to the card’s switch.
      </li>
    </ul>
    <CodeView code={pressCode} />

    <Heading
      id="progress-and-stages"
      level={2}
    >
      Progress and stages
    </Heading>
    <ul>
      <li>
        <PartLink part="Card.Progress" /> renders no element: it holds its
        value, range and format in a context, as Base UI’s Progress.Root does,
        so its value (<PartLink part="Card.ProgressValue" />) and its bar can
        sit in different places of the card’s layout.
      </li>
      <li>
        <PartLink part="Card.ProgressBar" /> is a pill at the card’s bottom
        holding Base UI’s progress bar, so it’s announced as one. Its{' '}
        <PartLink part="Card.ProgressLabel" /> and{' '}
        <PartLink part="Card.ProgressDetail" /> are drawn twice, and the copy on
        the fill is clipped to it, so they read on both parts without laying
        anything out anew. On the fill they take dark or light text, whichever
        has more perceived contrast with the tint (APCA, not WCAG’s ratio, which
        picks dark text on mid blues), read once and again when the tint or the
        color scheme changes.
      </li>
      <li>
        <PartLink part="Card.StageList" /> is an ordered list. Each{' '}
        <PartLink part="Card.Stage" /> compares its value with the list’s; done,
        current and to come follow from the stylesheet (those before the current
        one).
      </li>
      <li>
        A <PartLink part="Card.Subtitle" /> and a progress value each have a row
        of their own under the title. A tile a row tall has no room for them
        beside a bar, stages or channels, so they don’t show there.
      </li>
    </ul>

    <Heading
      id="channels"
      level={2}
    >
      Channels
    </Heading>
    <ul>
      <li>
        Each <PartLink part="Card.Channel" /> is Base UI’s slider, controlled or
        uncontrolled on its own. It tells its <PartLink part="Card.Channels" />,
        through context, the light it gives: an amount, its tint by its share; a
        scale, its color at its value.
      </li>
      <li>
        The channels add their amounts up in linear light, as light does, then
        tint them by any scale, and report the result at full strength with its
        brightness (its strongest amount’s share) through{' '}
        <code>onLightChange</code>.
      </li>
      <li>
        A channel’s thumb is placed by Base UI, kept inside its well at both
        ends. Its fill and its labels are its own: the labels are placed after
        each change, and each takes dark or light text by what’s under its
        center, by the same contrast as a progress bar’s. The colors behind that
        are read once, and again when they or the color scheme change; moving
        the thumb only compares numbers.
      </li>
    </ul>

    <Heading
      id="a-choice-of-a-few"
      level={2}
    >
      A choice of a few
    </Heading>
    <ul>
      <li>
        <PartLink part="Card.Segmented" /> isn’t built on{' '}
        <a href={publicUrl('segmented')}>Segmented</a>, which only lays its
        items out side by side. It’s Base UI’s RadioGroup, its options as radios
        in a well, so it can stack them too. The arrow keys move between them,
        and there’s no lens: dragging moves its thumb, choosing each option as
        the finger reaches it.
      </li>
      <li>
        Each <PartLink part="Card.SegmentedItem" /> tells its choice its symbol,
        words and tint, in a layout effect. At 1x1, where no options show, the
        items stay mounted in a hidden group, so a ready-made card still knows
        them.
      </li>
      <li>
        A thumb sits under the chosen option. A layout effect measures that
        option’s box and moves the thumb there, again whenever the group
        resizes. It only transitions once it has been placed, so it doesn’t
        slide in when the card mounts.
      </li>
      <li>
        Its layout comes from its grid item’s size (its open size while it’s
        open above the page) and its orientation, if the app gives one: a row,
        taller, stacked, or 1x1 without options. The card’s layout follows it
        through the stylesheet (<code>:has()</code>), so it works in any card.
      </li>
    </ul>

    <Heading
      id="rows"
      level={2}
    >
      Rows
    </Heading>
    <ul>
      <li>
        <PartLink part="Card.Rows" /> is a glass{' '}
        <a href={publicUrl('list')}>List</a> of its <PartLink part="Card.Row" />
        s. A resize observer counts how many rows fit whole in its room, at
        least one, and only those render. A row is as tall as Card makes it:
        30px in a tile, 44px open above the page.
      </li>
      <li>
        When rows are left out, the last row counts them instead, and it’s a
        button that expands the tile (its item’s expanded size, where that would
        change its size) or opens it above the page (an item with an open size).
        Expanded, it makes the tile small again. A corner button that draws
        nothing sits over the last row and does the same, for a large touch
        target; it’s hidden from assistive technology and the keyboard, which
        use the row.
      </li>
    </ul>

    <Heading
      id="corner-buttons-by-its-tile"
      level={2}
    >
      Corner buttons by its tile
    </Heading>
    <ul>
      <li>
        <PartLink part="Card.ExpandButton" />,{' '}
        <PartLink part="Card.OpenButton" /> and{' '}
        <PartLink part="Card.CloseButton" /> are corner buttons acting on their
        grid item, through{' '}
        <PartLink
          component="grid"
          part="useGridItem"
        />
        : its expansion (<code>setExpanded</code>) and its <code>open</code> (
        <code>setOpen</code>). They hold no state of their own.
      </li>
      <li>
        The expand button resolves both sizes the way the item would resolve
        them now (<code>sizeOf</code>). If both come out the same, for example
        with too few columns, it’s hidden. Its icon shows which way it goes.
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
        <strong>From Base UI directly:</strong> its slider (
        <PartLink part="Card.Channel" />
        ), its progress bar (<PartLink part="Card.ProgressBar" />) and its radio
        group (<PartLink part="Card.Segmented" />
        ). From the color picker, its CSS color parser.
      </li>
      <li>
        <strong>Out to ControlCards:</strong> its parts; the contexts a
        ready-made card hears its channels and its choice through, and tells its
        open button whether to show (see{' '}
        <a href={publicUrl('control-cards/architecture')}>
          ControlCards’ architecture
        </a>
        ); <PartLink part="cardSizes" /> for the items of the ready-made cards.
      </li>
      <li>
        <strong>Out to the app:</strong> <code>actionsRef</code>’s{' '}
        <code>flash()</code>.
      </li>
    </ul>
  </>
);
