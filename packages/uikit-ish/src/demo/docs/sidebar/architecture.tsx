import { FunctionComponent } from 'react';

import { CodeView } from '../../tooling/frame/code-view.js';
import {
  Contents,
  Heading,
  PartLink,
  type Section,
} from '../../tooling/guide/sections.js';
import { publicUrl } from '../../tooling/public-url.js';

// `/sidebar/architecture`: how Sidebar is built, and what flows into it.

/* eslint-disable unicorn/no-incorrect-template-string-interpolation -- JSX braces in code samples, not interpolations */
const rootCode = `// Sidebar.Root, in short: a glass panel that is a screen of its own.
const scheme = useGlassScheme(ref, context);      // its glass's tone
const isRegular = useSizeClass() === 'regular';
const [scope] = useState(() => ({}));             // its bars' own scope

<ViewportScopeContext.Provider value={scope}>
  <ColorSchemeScope colorScheme={scheme}>
    <nav
      className="uikit-sidebar-root uikit-glass-medium uikit-glass-panel"
      data-color-scheme={scheme}
      data-regular={isRegular ? '' : undefined}
    />
  </ColorSchemeScope>
</ViewportScopeContext.Provider>`;
/* eslint-enable unicorn/no-incorrect-template-string-interpolation */

const sections: readonly Section[] = [
  ['a-panel-that-is-a-screen', 'A panel that is a screen'],
  ['its-glass-and-colors', 'Its glass and colors'],
  ['placed-by-its-column', 'Placed by its column'],
  ['the-toolbar', 'The toolbar'],
  ['what-flows-in-and-out', 'What flows in and out'],
];

/** `/sidebar/architecture`: how it's built, and what flows into it. */
export const SidebarArchitecture: FunctionComponent = () => (
  <>
    <Contents sections={sections} />
    <ul className="demo-lead">
      <li>
        A sidebar is a floating glass panel that behaves like a small screen.
        Its content is built from the same parts as a page: a header with a bar,
        and a page that scrolls. The sidebar itself adds the panel, its colors,
        and its own scope for bars. To learn how to use it, see its{' '}
        <a href={publicUrl('sidebar/parts')}>parts</a>.
      </li>
    </ul>

    <Heading
      id="a-panel-that-is-a-screen"
      level={2}
    >
      A panel that is a screen
    </Heading>
    <ul className="demo-tree">
      <li className="demo-tree-context">
        <PartLink
          component="layout"
          part="Layout.Column"
        />
        <ul>
          <li>
            <PartLink part="Sidebar.Root" />{' '}
            <span>(the panel, its bars’ scope)</span>
            <ul>
              <li>
                <PartLink
                  component="header"
                  part="Header.Root"
                />
                <ul>
                  <li>
                    <PartLink
                      component="viewport"
                      part="Viewport.BlockStart"
                    />
                    <ul>
                      <li>
                        <PartLink part="Sidebar.Toolbar" />
                      </li>
                    </ul>
                  </li>
                  <li>
                    <PartLink
                      component="page"
                      part="Page.Root"
                    />
                    <ul>
                      <li>
                        <PartLink
                          component="list"
                          part="List.Root"
                        />{' '}
                        <span>(style sidebar)</span>
                      </li>
                    </ul>
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
        The sidebar provides its own Viewport scope. Bars anchored inside it,
        such as a{' '}
        <PartLink
          component="viewport"
          part="Viewport.BlockStart"
        />
        , belong to the sidebar, not to the column or the screen. They’re fixed
        to the panel, and the room they take is the panel’s alone.
      </li>
      <li>
        The panel is the containing block for its content, and its padding is
        what that content takes as its safe area insets. That’s why a header and
        a page inside it work the way they do on a screen. The toolbar stays at
        the top, and the list scrolls under it.
      </li>
      <li>
        The panel is a <code>&lt;nav&gt;</code>, which makes it a navigation
        landmark.
      </li>
    </ul>
    <CodeView code={rootCode} />

    <Heading
      id="its-glass-and-colors"
      level={2}
    >
      Its glass and colors
    </Heading>
    <ul>
      <li>The panel uses the medium glass, the same material as menus.</li>
      <li>
        Its color scheme comes from what’s behind it (
        <code>useGlassScheme</code>, the{' '}
        <a href={publicUrl('glossary#backdrop-tone')}>backdrop tone</a>). The
        scheme is set on the panel and passed to its content. So the rows, the
        toolbar and the search field follow the panel, not the page.
      </li>
    </ul>

    <Heading
      id="placed-by-its-column"
      level={2}
    >
      Placed by its column
    </Heading>
    <ul>
      <li>
        The sidebar doesn’t place or size itself. A{' '}
        <PartLink
          component="layout"
          part="Layout.Column"
        />{' '}
        does that. In a regular width, the column floats over the other columns.
        In a compact width, the sidebar is a drawer that you swipe in.
      </li>
      <li>
        The sidebar only reads the size class (
        <PartLink
          component="viewport"
          part="useSizeClass"
        />
        ). In a regular width, it marks itself <code>data-regular</code>. Its
        stylesheet then lines its bottom up with the anchored bars and islands
        of the pages beside it, a little in from the screen’s edges.
      </li>
    </ul>

    <Heading
      id="the-toolbar"
      level={2}
    >
      The toolbar
    </Heading>
    <ul>
      <li>
        <PartLink part="Sidebar.Toolbar" /> and{' '}
        <PartLink part="Sidebar.ToolbarGroup" /> are plain elements. Their
        stylesheet places a group at each end, and spaces the buttons so their
        highlights sit evenly in from the panel’s corners.
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
        <strong>From Layout:</strong> its place and size, floating or as a
        drawer.
      </li>
      <li>
        <strong>From Viewport:</strong> the size class, and its own scope, which
        the header, the page and the anchors inside use as their screen.
      </li>
      <li>
        <strong>From Glass:</strong> its material and color scheme.
      </li>
      <li>
        <strong>Out:</strong> its color scheme and scope, to its content. A list
        inside it takes the sidebar style from{' '}
        <PartLink
          component="list"
          part="List.Root"
        />
        ’s own prop. The sidebar doesn’t set it.
      </li>
    </ul>
  </>
);
