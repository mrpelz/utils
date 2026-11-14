import { FunctionComponent, ReactNode } from 'react';

import {
  Contents,
  Heading,
  PartLink,
  type Section,
  sectionId,
} from '../../tooling/guide/sections.js';
import { publicUrl } from '../../tooling/public-url.js';
import { PageShell } from './shell.js';

// The words these docs use, for web developers new to iOS: by theme, each
// term linkable (its id from its name), linking to the components, parts,
// demos and other terms it touches.

const sections: readonly Section[] = [
  ['reading-these-docs', 'Reading these docs'],
  ['building-blocks', 'Building blocks'],
  ['the-screen-and-the-system', 'The screen and the system'],
  ['layers-and-layout', 'Layers and layout'],
  ['surfaces-above-the-page', 'Surfaces above the page'],
  ['stops-and-snapping', 'Stops and snapping'],
  ['the-keyboard', 'The keyboard'],
  ['touch-and-gestures', 'Touch and gestures'],
  ['grids-and-tiles', 'Grids and tiles'],
  ['look-and-feel', 'Look and feel'],
];

/** A term and its definition, linkable by its name. */
const Term: FunctionComponent<{
  /** Other names it goes by. */
  also?: string;
  children: ReactNode;
  term: string;
}> = ({ also, children, term }) => (
  <>
    <dt id={sectionId(term)}>
      {term}
      {also === undefined ? null : (
        <span className="demo-glossary-also"> ({also})</span>
      )}
    </dt>
    <dd>{children}</dd>
  </>
);

/** A link to another term on this page. */
const See: FunctionComponent<{ children?: ReactNode; term: string }> = ({
  children,
  term,
}) => <a href={publicUrl(`glossary#${sectionId(term)}`)}>{children ?? term}</a>;

/** A link to a component's overview (or one of its sections). */
const Docs: FunctionComponent<{ children: ReactNode; to: string }> = ({
  children,
  to,
}) => <a href={publicUrl(to)}>{children}</a>;

/** `/glossary`: the words these docs use. */
export const GlossaryPage: FunctionComponent = () => (
  <PageShell
    path="glossary"
    title="Glossary"
  >
    <p className="demo-lead">
      The words these docs use, explained for web developers who know their way
      around HTML, CSS and React, but not around iOS. Terms are grouped by
      theme. Each one links to the components, parts and demos it touches, and
      to related terms.
    </p>
    <Contents sections={sections} />

    <Heading
      id="reading-these-docs"
      level={2}
    >
      Reading these docs
    </Heading>
    <dl className="demo-glossary">
      <Term term="Guide">
        This documentation site. Every component has up to three pages: an{' '}
        <See term="Overview page" />, a <See term="Parts page" /> and a{' '}
        <See term="Composition page" />. On top of that come a few pages of{' '}
        <See term="Prose" />, the <See term="Kitchen sink" /> and{' '}
        <a href={publicUrl('all')}>All Demos</a>.
      </Term>
      <Term term="Prose">
        The written parts of the guide, as opposed to the live{' '}
        <See term="Demo">demos</See>. Every component page has prose around its
        demos. Some pages are nothing but prose:{' '}
        <a href={publicUrl('getting-started')}>Getting Started</a>,{' '}
        <a href={publicUrl('backstory-and-faq')}>Backstory &amp; FAQ</a>,{' '}
        <a href={publicUrl('ios-quirks')}>iOS Quirks</a> and this glossary.
      </Term>
      <Term term="Overview page">
        A component’s first page, at its plain address (for example{' '}
        <code>/sheet</code>). It says what the component is for, how it behaves,
        and lists the props of its root part.
      </Term>
      <Term term="Parts page">
        A component’s parts, one section each (for example{' '}
        <code>/sheet/parts</code>). It starts with a{' '}
        <See term="Structure tree" />, and every part gets its own props table
        and a demo.
      </Term>
      <Term term="Composition page">
        How a component works together with others (for example a sheet that
        holds a navigation stack). Each section ends with two bullets.{' '}
        <strong>Library</strong> lists what the library provides.{' '}
        <strong>Demo</strong> lists what the example app adds itself, such as
        its state and its content.
      </Term>
      <Term term="Structure tree">
        The nested list at the top of a parts page. It shows how a component’s
        parts nest, starting at the app’s root. The outer levels are greyed out,
        because they belong to other components.
      </Term>
      <Term term="Part">
        One piece of a component, rendered by you, for example{' '}
        <PartLink
          component="sheet"
          part="Sheet.Popup"
        />
        . Components here are compound components, like <See term="Base UI" />
        ’s: you put the parts together yourself, instead of passing one
        component a big config object.
      </Term>
      <Term term="Demo">
        A live example running in a frame, with its code beside it. You can
        change its props with <See term="Prop controls" /> and see the result
        right away.
      </Term>
      <Term term="Inline demo">
        A demo inside a page of prose. It’s compact and has no header of its
        own. The <See term="Full-page demo">Fullscreen</See> link below its
        frame opens the same demo, in the same state, on a page of its own.
      </Term>
      <Term
        also="Fullscreen"
        term="Full-page demo"
      >
        A demo on a page of its own, with a header and the whole{' '}
        <See term="Config column" />. A component’s full-page demos all live on
        its <code>/all</code> page (for example <code>/sheet/all</code>), and{' '}
        <a href={publicUrl('all')}>All Demos</a> shows every component’s, one
        after another.
      </Term>
      <Term term="Raw demo">
        A demo with nothing around it: no frame, no controls, no stage. It
        renders as the page itself, the way your app would. The{' '}
        <code>[raw]</code> link in a demo’s header opens it (the URL gets{' '}
        <code>raw=true</code>). It’s handy on a real device, and for automated
        tests.
      </Term>
      <Term term="Kitchen sink">
        A separate app built only from the library, at{' '}
        <a
          href={publicUrl('kitchen-sink')}
          target="_top"
        >
          /kitchen-sink
        </a>
        . Every component has a page there, in all its looks and states, with no
        prose and no controls. The name comes from the saying “everything but
        the kitchen sink”: this one includes the sink too. It behaves like a
        real app: a stack you drill into on a phone, a sidebar beside it on a
        tablet. Add it to the Home Screen to try the library the way users will
        (see <See term="Home Screen app" />
        ).
      </Term>
      <Term term="Stage">
        The area a demo renders in. It comes in three types. <em>Phone</em>{' '}
        (402px wide) and <em>tablet</em> (820px wide) draw a device frame, with
        a status bar and <See term="Safe area inset">safe area insets</See>.{' '}
        <em>Simple</em> is a plain box, for components that don’t need a screen.
        The type is labelled in the stage’s top left corner.
      </Term>
      <Term term="Config column">
        The column beside a demo’s stage. It holds the{' '}
        <See term="Stage settings" />, the <See term="Diagnostics" />, the{' '}
        <See term="Prop controls" />, the <See term="Live code" /> and the{' '}
        <See term="Log" />.
      </Term>
      <Term
        also="the Stage panel"
        term="Stage settings"
      >
        The first panel in the config column. Its options change the stage, not
        the component:
        <ul>
          <li>
            <em>Color Scheme</em> forces light or dark on the stage, and on the
            popups the demo opens. <em>[auto]</em> follows your system.
          </li>
          <li>
            <em>Stage Background</em> shows a dotted background behind the demo.
          </li>
          <li>
            <em>Backdrop</em>, <em>Center</em> and <em>Stretch</em> apply to a
            simple stage: an app’s page background behind the component,
            centering it, or stretching it to the stage’s width.
          </li>
          <li>
            <em>Safe Area Insets</em> applies to a device stage. It hatches the
            <See term="Safe area inset">safe area insets</See>: the parts of the
            screen the system covers.
          </li>
          <li>
            <em>Expand</em> lets an inline demo grow wider than the text column,
            when there’s room.
          </li>
        </ul>
        Options that don’t apply to the stage type are greyed out.{' '}
        <em>Reset</em> goes back to the demo’s defaults. The settings belong to
        that one demo. They aren’t remembered, but they do travel in the{' '}
        <See term="State URL" />.
      </Term>
      <Term term="Prop controls">
        One group per part a demo uses, with an input for each of the part’s
        props. Pick a value from the list, or type any value as JSON. A group
        named in brackets, like <code>[content]</code>, controls the demo itself
        (for example how many rows a list shows) rather than a prop.
      </Term>
      <Term term="Emphasize">
        Each prop control group can highlight its part on the stage.{' '}
        <em>Outline</em> draws a line around the part’s box. <em>Overlay</em>{' '}
        hatches the whole box, which helps with parts you can’t see, such as a
        swipe area or a{' '}
        <PartLink
          component="viewport"
          part="Viewport.Padding"
        />
        .
      </Term>
      <Term term="Diagnostics">
        A panel in the config column with technical readouts, such as a measured
        size or a hook’s current value. They live there, so the demo’s screen
        can show realistic app content instead.
      </Term>
      <Term term="Live code">
        The Code panel in a demo’s config column. It stays closed until you open
        it. The code is generated from the demo as it runs, so it follows the
        prop controls: change a prop, and the code changes with it. It’s the
        whole example, state wiring such as <code>useState</code> included,
        ready to copy into an app.
      </Term>
      <Term term="Code sample">
        A block of code inside the prose, such as a setup step in{' '}
        <a href={publicUrl('getting-started')}>Getting Started</a>. Unlike{' '}
        <See term="Live code" />, it’s written by hand and never changes. It
        shows one idea, not a whole demo. Both appear in the same read-only
        viewer, with a button that copies the code.
      </Term>
      <Term term="Log">
        A list of what the demo’s handlers reported, newest last: presses, value
        changes, opens and closes.
      </Term>
      <Term term="State URL">
        A demo’s settings and prop values are kept in the URL. Copy the address
        to share the demo exactly as you see it.
      </Term>
      <Term term="Design tokens">
        The library’s named values for colors, text styles and materials, as CSS
        custom properties. The <a href={publicUrl('tokens')}>Design Tokens</a>{' '}
        page shows them live.
      </Term>
    </dl>

    <Heading
      id="building-blocks"
      level={2}
    >
      Building blocks
    </Heading>
    <dl className="demo-glossary">
      <Term term="Base UI">
        The headless React component library underneath this one (
        <a href="https://base-ui.com">base-ui.com</a>). Headless means it brings
        behavior and accessibility, but no styles. Most components here wrap a
        Base UI component, keep its parts and props, and add the styling and the
        touch behavior. Their pages link to Base UI’s docs.
      </Term>
      <Term term="Framework7">
        An open-source framework for mobile web apps (
        <a href="https://framework7.io">framework7.io</a>). It served as a
        reference for touch behavior and for how things move.
      </Term>
      <Term term="Preact">
        A small React-compatible library. The library imports from{' '}
        <code>react</code>, and works with React or with Preact through{' '}
        <code>preact/compat</code> (see{' '}
        <a href={publicUrl('getting-started#react-or-preact')}>
          Getting Started
        </a>
        ). The docs themselves run on Preact.
      </Term>
      <Term term="Controlled and uncontrolled">
        Two ways to hold a component’s state, as in React’s form inputs.
        Controlled: you pass the value (<code>value</code>, <code>open</code>)
        and update it in a handler (<code>onValueChange</code>,{' '}
        <code>onOpenChange</code>). Uncontrolled: you pass only a starting value
        (<code>defaultValue</code>, <code>defaultOpen</code>) and the component
        keeps the rest to itself. Pick one per component, never both.
      </Term>
      <Term term="Handle">
        An object that lets one place open a component that’s rendered somewhere
        else, for example a button in a toolbar opening a sheet. You make one
        with <code>createXHandle()</code> at module level, or with{' '}
        <code>useCreateXHandle()</code> inside a component (see{' '}
        <PartLink
          component="sheet"
          part="Sheet.createHandle"
        />
        ). The shape is Base UI’s.
      </Term>
      <Term term="Provider">
        A component that holds shared state for everything inside it. Two matter
        most here.{' '}
        <PartLink
          component="viewport"
          part="Viewport.Provider"
        />{' '}
        tracks the screen, its scrolling and the keyboard.{' '}
        <PartLink
          component="settings"
          part="Settings.Provider"
        />{' '}
        overrides the system’s <See term="Settings" />.
      </Term>
      <Term term="Settings">
        The user’s system preferences the components follow: color scheme (light
        or dark), contrast, reduced motion, reduced transparency and text size.
        A{' '}
        <PartLink
          component="settings"
          part="Settings.Provider"
        />{' '}
        can override them for whatever is inside it (see{' '}
        <Docs to="settings">Settings</Docs>).
      </Term>
      <Term term="Portal">
        A popup rendered somewhere else in the DOM than where you wrote it,
        usually at the end of <code>body</code>, so nothing clips it. Popups do
        this through Base UI. A <code>PortalContainerContext</code> can point
        them at another element instead, which is how the demos keep popups
        inside a device frame.
      </Term>
      <Term term="Home Screen app">
        A website added to the home screen, for example with Safari’s{' '}
        <em>Share › Add to Home Screen</em> on iOS, or by installing it on
        Android. It opens without the browser’s bars, like an app, and is also
        called a standalone web app or PWA. A few things work only there, or
        only behave right there. See{' '}
        <a href={publicUrl('getting-started#as-a-pwa')}>Getting Started</a>.
      </Term>
      <Term term="WebKit">
        Safari’s browser engine. On iOS and iPadOS every browser uses it, so a
        quirk there is a quirk in every browser there. Many of the library’s
        workarounds exist for WebKit alone (see{' '}
        <a href={publicUrl('ios-quirks')}>iOS Quirks</a>).
      </Term>
    </dl>

    <Heading
      id="the-screen-and-the-system"
      level={2}
    >
      The screen and the system
    </Heading>
    <dl className="demo-glossary">
      <Term term="Safe area">
        The part of the screen that isn’t covered by hardware or by the system:
        not under the rounded corners, the camera cutout, the status bar or the
        home indicator. Browsers report the covered edges as{' '}
        <code>env(safe-area-inset-*)</code>, the{' '}
        <See term="Safe area inset">safe area insets</See>.
      </Term>
      <Term term="Safe area inset">
        How far the system covers the screen at one edge, from that edge to the{' '}
        <See term="Safe area" />: <code>env(safe-area-inset-top)</code> and so
        on. The library keeps content clear of the insets, and its bars extend
        into them so they reach the screen’s edge.
      </Term>
      <Term term="Status bar">
        The strip at the top of the screen with the time, signal and battery. In
        an iOS <See term="Home Screen app" />, the page can either draw under it
        (<code>black-translucent</code>) or start below it (<code>default</code>
        ). See{' '}
        <a href={publicUrl('ios-quirks#the-status-bar-blur')}>
          the status bar blur
        </a>{' '}
        for why that choice matters on iOS 27.
      </Term>
      <Term term="Status bar tap">
        Tapping the status bar scrolls an iOS app back to its top. A web page
        never sees that tap, so the library keeps the document scrolled down by
        1px (it “parks” it there). A tap scrolls it back to 0, and that scroll
        is how the tap gets noticed. See{' '}
        <a href={publicUrl('ios-quirks#status-bar-taps')}>Status bar taps</a>{' '}
        and{' '}
        <PartLink
          component="viewport"
          part="trackStatusBarTaps"
        />
        .
      </Term>
      <Term term="Home indicator">
        The thin bar at the bottom of a phone or tablet without a home button.
        Content keeps clear of it by the bottom safe area inset. Floating
        surfaces such as an island or a medium sheet let it sit over their 8px
        margin.
      </Term>
      <Term term="Dynamic Island">
        The pill-shaped camera cutout at the top of some recent phones. It has
        nothing to do with the library’s <See term="Island" />, apart from the
        name.
      </Term>
      <Term term="Size class">
        A rough measure of available width, from iOS: <em>compact</em> (a phone,
        or a narrow window on a tablet) or <em>regular</em> (a tablet). Here
        it’s regular from 768px. Components switch presentation by it. A sheet
        shows as a form sheet on regular, for example. See{' '}
        <PartLink
          component="viewport"
          part="useSizeClass"
        />
        .
      </Term>
      <Term term="Layout viewport">
        The rectangle the page is laid out in. Fixed elements are positioned
        against it. On a desktop it’s simply the window.
      </Term>
      <Term term="Visual viewport">
        The part of the layout viewport you can actually see right now. It gets
        smaller when the on-screen keyboard appears, and it moves when you zoom.
        The library reads it to find the keyboard’s height (see{' '}
        <PartLink
          component="viewport"
          part="useVisualViewport"
        />
        ).
      </Term>
      <Term term="App switcher snapshots">
        When the app switcher opens, iPadOS may briefly resize the app’s window
        to take its pictures while the page is still showing. Read naively, the
        size class flips back and forth. The library ignores those resizes (see{' '}
        <a href={publicUrl('ios-quirks#app-switcher-snapshots')}>
          App switcher snapshots
        </a>
        ).
      </Term>
      <Term term="Hide key">
        The key in the corner of iPadOS’s on-screen keyboard that hides it. The
        text field stays focused. Afterwards, the system only shows the keyboard
        again when it handles a tap on the field itself (see{' '}
        <PartLink
          component="viewport"
          part="preventFocusShift"
        />
        ).
      </Term>
    </dl>

    <Heading
      id="layers-and-layout"
      level={2}
    >
      Layers and layout
    </Heading>
    <dl className="demo-glossary">
      <Term term="Layer">
        Something stacked on the screen at its own depth. An app built with{' '}
        <Docs to="viewport">Viewport</Docs> has a background, a{' '}
        <See term="Content layer" />, <See term="Anchor">anchors</See> above it
        holding bars, and popups above everything. The document itself doesn’t
        scroll. The content layer does.
      </Term>
      <Term term="Content layer">
        The main layer that scrolls your app’s content, below the bars (
        <PartLink
          component="viewport"
          part="Viewport.Content"
        />
        ). It fills the screen, and can shrink above the keyboard (see{' '}
        <See term="Resize" />
        ).
      </Term>
      <Term term="Anchor">
        A layer fixed to one edge of the screen, holding bars that float above
        the content (
        <PartLink
          component="viewport"
          part="Viewport.Anchor"
        />
        ,{' '}
        <PartLink
          component="viewport"
          part="Viewport.BlockStart"
        />{' '}
        for the top,{' '}
        <PartLink
          component="viewport"
          part="Viewport.BlockEnd"
        />{' '}
        for the bottom). Content scrolls underneath it.
      </Term>
      <Term term="Bar">
        A strip of controls at an edge of the screen. At the top that’s the
        navigation bar (a <Docs to="header">Header</Docs>, built on a{' '}
        <Docs to="toolbar">Toolbar</Docs>), at the bottom a toolbar or a{' '}
        <Docs to="tab-bar">Tab Bar</Docs>.
      </Term>
      <Term
        also="block-start, block-end, inline-start, inline-end"
        term="Logical sides"
      >
        CSS’s writing-direction names for edges, used for every side and
        placement prop here. Block-start is the top and block-end the bottom.
        Inline-start is the left in left-to-right languages and the right in
        right-to-left ones. Inline-end is the opposite.
      </Term>
      <Term term="Leading and trailing">
        The usual names in app design for inline-start and inline-end: the side
        where reading starts, and the side where it ends.
      </Term>
      <Term term="Scroller">
        An element that scrolls its own content (CSS <code>overflow: auto</code>
        ), also called a scroll container. The content layer, a{' '}
        <PartLink
          component="page"
          part="Page.Root"
        />{' '}
        and a sheet’s content are scrollers. Each registers itself, so bars know
        what scrolls under them.
      </Term>
      <Term term="Viewport padding">
        Room at a scroller’s start or end (
        <PartLink
          component="viewport"
          part="Viewport.Padding"
        />
        ), as tall as the bars at that edge plus the{' '}
        <See term="Content margin" />. Your content starts below the top bar,
        yet still scrolls under it.
      </Term>
      <Term term="Content margin">
        The 16px gap between content and the edge of what holds it. It comes
        from the library, not from each app (as{' '}
        <PartLink
          component="viewport"
          part="Viewport.Padding"
        />
        ). Components never add gaps around themselves.
      </Term>
      <Term term="Scope">
        The set of anchors a viewport padding makes room for. By default it’s
        the screen. A column, a sheet or an island makes its own scope, so its
        bars only push its own content (see{' '}
        <PartLink
          component="viewport"
          part="ViewportScopeContext"
        />
        ).
      </Term>
      <Term term="Containing block">
        The CSS term for the box an element is positioned against. For fixed
        layers that’s normally the window. Inside a{' '}
        <PartLink
          component="layout"
          part="Layout.Column"
        />{' '}
        it’s the column (it sets <code>contain: layout</code>), so bars span the
        column instead of the whole screen.
      </Term>
      <Term term="Edge effect">
        What appears where content scrolls under a bar. A <em>soft</em> edge
        blurs the content and fades it out toward the bar. A <em>hard</em> edge
        puts a solid backing with a line behind the bar. Set it on an anchor
        with <code>edgeEffect</code>.
      </Term>
      <Term term="Page">
        A scroller with a page background (
        <PartLink
          component="page"
          part="Page.Root"
        />
        ). In a navigation stack, each screen you push is a page.
      </Term>
      <Term term="Column">
        One side-by-side region of a <Docs to="layout">Layout</Docs>: a sidebar,
        a list, a detail view. Each one scrolls on its own. A <em>floating</em>{' '}
        column hovers over the others, as a sidebar often does on a tablet.
      </Term>
      <Term term="Navigation stack">
        Screens stacked on top of each other, as in a phone’s settings app (
        <Docs to="navigation">Navigation</Docs>). <em>Pushing</em> slides a new
        screen in from the trailing edge. <em>Popping</em> slides it back out,
        and so does an edge swipe from the leading edge (see{' '}
        <See term="Swipe back" />
        ).
      </Term>
      <Term term="Large title">
        The big, bold page title below the navigation bar that shrinks into the
        bar as you scroll (
        <PartLink
          component="header"
          part="Header.LargeTitle"
        />
        ).
      </Term>
    </dl>

    <Heading
      id="surfaces-above-the-page"
      level={2}
    >
      Surfaces above the page
    </Heading>
    <dl className="demo-glossary">
      <Term term="Popup">
        Anything that appears above the page for a while: a{' '}
        <Docs to="sheet">Sheet</Docs>, a <Docs to="popover">Popover</Docs>, an{' '}
        <Docs to="alert">Alert</Docs>, a <Docs to="menu">Menu</Docs>, a{' '}
        <Docs to="tooltip">Tooltip</Docs>. Popups are rendered through a{' '}
        <See term="Portal" />.
      </Term>
      <Term term="Modal">
        A popup that blocks the page behind it until it closes. The page can’t
        be scrolled or focused meanwhile, and a backdrop dims it. Sheets and
        alerts are modal. Popovers are not, by default.
      </Term>
      <Term term="Sheet">
        A surface that slides up from the bottom of the screen for a focused
        task or more detail (<Docs to="sheet">Sheet</Docs>). It’s dismissed by
        swiping it down or by a close button.
      </Term>
      <Term term="Detent">
        The common word for a height a sheet rests at. A <em>large</em> sheet
        reaches almost to the top of the screen. A <em>medium</em> one is as
        tall as its content, floats 8px from the screen’s edges, and is made of{' '}
        <See term="Glass">glass</See>. A sheet with <See term="Stop">stops</See>{' '}
        rests at several heights.
      </Term>
      <Term term="Form sheet">
        On a regular-width screen, a sheet shown as a centered card instead of
        from the bottom. It’s meant for tasks such as filling in a form.
      </Term>
      <Term term="Card">
        On a regular-width screen, a sheet anchored at the leading bottom corner
        (<code>regular=&quot;card&quot;</code>). It keeps its detents and stops,
        like an island does.
      </Term>
      <Term term="Grabber">
        The small horizontal bar at the top of a sheet or island. It shows that
        the surface can be dragged (
        <PartLink
          component="sheet"
          part="Sheet.Grabber"
        />
        ,{' '}
        <PartLink
          component="island"
          part="Island.Grabber"
        />
        ).
      </Term>
      <Term term="Island">
        A floating panel that rests at the bottom of a screen and never closes (
        <Docs to="island">Island</Docs>). Think of the search panel of a maps
        app: it sits over the map and is swiped up to show more. Not to be
        confused with the camera cutout called the <See term="Dynamic Island" />
        .
      </Term>
      <Term term="Popover">
        A small surface that points at the control that opened it, with an arrow
        (<Docs to="popover">Popover</Docs>). Common on tablets. On a phone, many
        apps show a sheet instead.
      </Term>
      <Term term="Action sheet">
        A short list of choices about something the user just did, such as
        “Delete Photo” and “Cancel” (<Docs to="action-sheet">Action Sheet</Docs>
        ).
      </Term>
      <Term term="Drawer">
        A panel that slides in from the side of the screen, usually holding
        navigation (<Docs to="drawer">Drawer</Docs>).
      </Term>
    </dl>

    <Heading
      id="stops-and-snapping"
      level={2}
    >
      Stops and snapping
    </Heading>
    <dl className="demo-glossary">
      <Term term="Stop">
        A height a sheet or island snaps to and rests at, also called a snap
        point. Swipe it, and it comes to rest at the nearest stop, or at the
        next one if you flung it. The library uses the browser’s own CSS scroll
        snapping, so it feels native.
      </Term>
      <Term term="Snap group">
        A group of content that defines a stop (
        <PartLink
          component="sheet"
          part="Sheet.SnapGroup"
        />
        ,{' '}
        <PartLink
          component="island"
          part="Island.SnapGroup"
        />
        ). The stop is reached when everything up to the group’s end shows. The
        stops follow the content, so they never cut a group in half.
      </Term>
      <Term term="Header stop">
        A stop that shows the header alone: the grabber and the bar, centered in
        the space. An empty snap group at the start of the content creates it.
      </Term>
      <Term term="Lowest stop and top stop">
        The shortest and the tallest height of a sheet or island. Its content
        only scrolls at the top stop. Below it, swiping moves the whole surface.
      </Term>
      <Term term="Sliver">
        An island’s lowest stop showing nothing but its grabber, small and right
        by the home indicator.
      </Term>
      <Term term="Peek">
        In the demos, the first stop below the header that shows a little
        content. It’s a demo name, not an API.
      </Term>
      <Term term="Content scrolled">
        Once the content inside a sheet or island has been scrolled away from
        its start, the stops defined by its content groups are switched off.
        Dragging the surface down then skips them. It goes straight to the{' '}
        <See term="Header stop" />, or, without one, closes a sheet. The content
        doesn’t scroll back first.
      </Term>
      <Term
        also="at rest"
        term="Settle"
      >
        The moment a scroll or a swipe has come to a stop. The library waits for
        it before choosing a stop or changing what can be snapped to. Change
        snapping in the middle of a scroll, and some browsers jump to a
        different stop.
      </Term>
    </dl>

    <Heading
      id="the-keyboard"
      level={2}
    >
      The keyboard
    </Heading>
    <dl className="demo-glossary">
      <Term term="On-screen keyboard">
        The software keyboard a phone or tablet slides up when a text field gets
        focus. It covers the bottom of the page. Browsers on iOS report it only
        through the <See term="Visual viewport" />. Android’s browsers may
        shrink the whole page instead. Each layer decides how it reacts:{' '}
        <See term="Push" />, <See term="Resize" />, <See term="Lift" />, or it
        stays covered.
      </Term>
      <Term term="Push">
        A bottom anchor rises with the keyboard and sits right on top of it (
        <code>keyboard=&quot;push&quot;</code>, the default for{' '}
        <PartLink
          component="viewport"
          part="Viewport.Anchor"
        />
        ). A message field at the bottom of a chat works this way. An island in
        such an anchor rises too.
      </Term>
      <Term term="Resize">
        The content layer shrinks to the space above the keyboard (
        <code>keyboard=&quot;resize&quot;</code>, the default for{' '}
        <PartLink
          component="viewport"
          part="Viewport.Content"
        />
        ). Nothing is hidden behind the keyboard. Everything can still be
        scrolled into view. A sheet shrinks the same way.
      </Term>
      <Term term="Lift">
        Moving one element up just far enough to clear the keyboard, with its
        place in the layout kept (
        <PartLink
          component="viewport"
          part="Viewport.KeyboardAccessory"
        />
        ). Alerts, popovers and the color picker’s rows lift this way. When
        accessories are nested, the innermost one around the focused field
        lifts.
      </Term>
      <Term term="Keyboard accessory">
        An element that is lifted above the keyboard, together with the text
        field inside it (
        <PartLink
          component="viewport"
          part="Viewport.KeyboardAccessory"
        />
        ). It suits UI that has to stay visible as a whole, such as an alert
        with its buttons.
      </Term>
      <Term term="Focus scroll">
        Scrolling a focused text field into view once the keyboard is up. Its
        nearest marked scroller does the scrolling, and nothing else moves (
        <PartLink
          component="viewport"
          part="useFocusScroll"
        />
        ). The content layer, pages, and a sheet’s or island’s content are
        marked already.
      </Term>
      <Term term="Focus shift">
        The browser scrolling the whole page to reveal a text field when it’s
        focused, as iOS Safari does. In an app made of layers, that shifts every
        fixed bar out of place. On iOS, the library focuses fields without
        scrolling, and puts back any shift the system makes anyway (
        <PartLink
          component="viewport"
          part="preventFocusShift"
        />
        ).
      </Term>
      <Term term="Input zoom">
        iOS Safari zooms the page in when a text field with a font smaller than
        16px gets focus.{' '}
        <PartLink
          component="viewport"
          part="preventInputZoom"
        />{' '}
        stops that.
      </Term>
    </dl>

    <Heading
      id="touch-and-gestures"
      level={2}
    >
      Touch and gestures
    </Heading>
    <dl className="demo-glossary">
      <Term term="Swipe back">
        Dragging from the leading edge of the screen to go back one screen in a
        navigation stack (see{' '}
        <PartLink
          component="navigation"
          part="Navigation.SwipeArea"
        />
        ).
      </Term>
      <Term term="Swipe actions">
        Buttons revealed by swiping a list row sideways, such as Delete or
        Archive (
        <PartLink
          component="list"
          part="List.SwipeActions"
        />
        ). An <em>overswipe</em> swipes all the way across and runs the
        outermost action without a tap.
      </Term>
      <Term term="Long press">
        Touching and holding for about half a second. It opens a context menu or
        a tooltip. The library treats it like a right click, and calls both a{' '}
        <em>secondary click</em>.
      </Term>
      <Term
        also="bounce, rubber banding"
        term="Overscroll"
      >
        Pulling a scroller past its end. On iOS the content bounces back, and
        Android stretches it. What shows in the gap can be a layer behind the
        content, such as a pull-to-refresh indicator (
        <PartLink
          component="viewport"
          part="Viewport.Overscroll"
        />
        ).
      </Term>
      <Term term="Fling">
        A swipe that lets go while still moving fast. A flung sheet or island
        goes on to the next stop in that direction, instead of settling at the
        nearest one.
      </Term>
    </dl>

    <Heading
      id="grids-and-tiles"
      level={2}
    >
      Grids and tiles
    </Heading>
    <dl className="demo-glossary">
      <Term term="Tile">
        Anything in a <Docs to="grid">Grid</Docs>: an item, a{' '}
        <See term="Spacer" />, a <See term="Break" /> or an{' '}
        <See term="Add tile" />. Each takes its place in the order the app
        stores. Where it lands on screen follows from that order and the grid’s
        width.
      </Term>
      <Term term="Unit">
        One square of a grid, a column wide and a row tall. A grid gets as many
        columns as fit its width (3 on a phone) and stretches its units to fill
        it. An item spans 1 to 3 units each way, written as columns by rows:{' '}
        <code>2x1</code> is wide and one row tall.
      </Term>
      <Term term="Effective size">
        The size an item is shown at: the size the user chose, snapped to the
        sizes its content supports, then fitted to the columns (
        <PartLink
          component="grid"
          part="useGridItem"
        />
        ). The chosen size is what the app stores. A narrower grid never changes
        it.
      </Term>
      <Term term="Spacer">
        A deliberate hole in a grid, as big as an item of its size (
        <PartLink
          component="grid"
          part="Grid.Spacer"
        />
        ). It shows nothing outside <See term="Edit mode" />.
      </Term>
      <Term term="Break">
        A line break in a grid: the next tile starts a new row (
        <PartLink
          component="grid"
          part="Grid.Break"
        />
        ). A break of more rows keeps the rows below empty too. Like a newline
        in text, it belongs to the row it ends.
      </Term>
      <Term
        also="spawn"
        term="Add tile"
      >
        A dashed tile that adds something when pressed (
        <PartLink
          component="grid"
          part="Grid.Spawn"
        />
        ). What it adds, and where, is up to the app.
      </Term>
      <Term term="Edit mode">
        The state where tiles are rearranged (a grid’s <code>editing</code>, a
        list’s too). Tiles are dragged after a <See term="Long press" />, edit
        controls such as resize handles appear, and taps on what’s in a tile are
        held back.
      </Term>
      <Term term="Reorder handle">
        An object the app makes to move rows of a <Docs to="list">List</Docs> or
        tiles of a <Docs to="grid">Grid</Docs> (
        <PartLink
          component="grid"
          part="Grid.createReorderHandle"
        />
        ). It goes on what can be moved and on where it can be dropped. When
        something is dropped, its <code>onReorder</code> gets the change, and
        the app moves it in its data. Unlike a <See term="Handle" />, it doesn’t
        open anything.
      </Term>
      <Term term="Stand-in">
        A spacer or break shown while a tile is dragged, which the drop would
        add so the tile lands right there. It shows the app’s offer sign. When a
        resize would take a spacer in (merge it), that spacer shows the merge
        sign.
      </Term>
      <Term term="Row bands">
        The outlines a grid draws around each section’s rows in{' '}
        <See term="Edit mode" />. They run in from the page’s leading edge and
        out at its trailing edge, to show that the tiles are one line read row
        by row, as text is.
      </Term>
    </dl>

    <Heading
      id="look-and-feel"
      level={2}
    >
      Look and feel
    </Heading>
    <dl className="demo-glossary">
      <Term
        also="Liquid Glass"
        term="Glass"
      >
        A translucent material for surfaces that float above content: bars,
        sidebars, islands, popovers. It blurs and tints what’s behind it. Here
        it comes in materials of different strength, as{' '}
        <a href={publicUrl('tokens')}>design tokens</a>.
      </Term>
      <Term term="Flat glass">
        <See term="Glass" /> drawn without backdrop filters, isolation or blend
        modes: opaque, over its container’s background, looking as the live
        glass would there. It doesn’t blur what’s behind it, so content doesn’t
        show through. A scroll container’s glass is flat while it can scroll
        (its <code>glass</code> prop, <code>auto</code> by default, set to{' '}
        <code>flat</code> or <code>live</code> to override it:{' '}
        <PartLink
          component="page"
          part="Page.Root"
        />{' '}
        and the content parts). It’s for glass in content that scrolls: on iOS,
        live glass there ends the page’s glides (see{' '}
        <Docs to="ios-quirks#layers-under-a-scroll">iOS Quirks</Docs>).
      </Term>
      <Term term="Semantic colors">
        Colors named by their role instead of their hue: <code>label</code> for
        text, <code>secondaryLabel</code> for quieter text,{' '}
        <code>systemBackground</code> for a page. Each has values for light and
        dark mode and for higher contrast, so components adapt by themselves.
      </Term>
      <Term term="Tint">
        An app’s accent color, used for buttons, links and selections. Many
        components take a <code>tint</code> prop.
      </Term>
      <Term term="Grouped background">
        The light gray (or black, in dark mode) page background behind lists of
        rounded groups, as in a phone’s settings app. The groups themselves are
        white (or dark gray). Pages, sheets and lists take{' '}
        <code>background=&quot;grouped&quot;</code>.
      </Term>
      <Term term="Text styles">
        Named type sizes, such as Large Title, Body and Caption 1. Each sets a
        size, line height, tracking and weight (see{' '}
        <Docs to="typography">Typography</Docs>). <em>Dynamic Type</em> is the
        iOS setting that scales them all.
      </Term>
      <Term term="SF Symbols">
        Apple’s icon set. The demos use them, but the library ships no icons:
        they’re licensed for Apple platforms only, so the demos load each one as
        it’s shown. <Docs to="symbol">Symbol</Docs> draws any icon you give it.
      </Term>
      <Term term="Reduced motion">
        A system setting for people who are bothered by movement. With it on,
        the library shortens or drops its animations, such as the keyboard lifts
        and the sheet slides.
      </Term>
    </dl>
  </PageShell>
);
