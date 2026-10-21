import { FunctionComponent } from 'react';

import {
  Contents,
  Heading,
  PartLink,
  type Section,
} from '../guide/sections.js';
import { GuideLink } from '../hig-guide/link.js';

const HIG = 'https://developer.apple.com/design/human-interface-guidelines';

/** The page's sections (its headings' ids), listed at its top. */
const sections: readonly Section[] = [
  ['primitive-collection', 'Primitive: Collection'],
  ['its-parts-as-primitives', 'Its parts as primitives'],
  ['traits', 'Traits'],
  ['where-it-sits', 'Where it sits'],
];

/**
 * `/list/information-architecture`: where a list sits, after the
 * HIG-composition guide (“Apple HIG Components — Composition, Shared Traits
 * & a Re-Slicing”).
 */
export const ListInformationArchitecture: FunctionComponent = () => (
  <>
    <Contents sections={sections} />
    <ul className="demo-lead">
      <li>
        Apple’s catalog:{' '}
        <a
          href={`${HIG}/lists-and-tables`}
          rel="noreferrer"
          target="_blank"
        >
          lists and tables
        </a>
        , under “Layout and organization”.
      </li>
      <li>
        As primitives (
        <GuideLink to="section-5">HIG composition guide</GuideLink>): a{' '}
        <em>Collection</em> projected as rows (
        <GuideLink to="section-5-mapping">§5, mapping</GuideLink>: flat or
        sectioned, rows).
      </li>
      <li>
        Its sections <em>Groups</em>, its rows <em>Items</em>.
      </li>
    </ul>

    <Heading
      id="primitive-collection"
      level={2}
    >
      Primitive: Collection
    </Heading>
    <ul>
      <li>
        Collection: a set of items with a data shape and a projection (guide,{' '}
        <GuideLink to="primitive-collection">§5</GuideLink>).
      </li>
      <li>
        Parameters: shape (flat, sectioned, tree), projection (rows, grid,
        columns, breadcrumb, pages), selection (none, one, many), editability
        (reorder, delete).
      </li>
    </ul>
    <ul>
      <li>
        <strong>Shape:</strong> sectioned (
        <PartLink
          component="list"
          part="List.Section"
        />
        s); flat with one section. Trees (outline views) aren’t built in: a
        row’s <code>level</code> indents it, e.g. in a sidebar.
      </li>
      <li>
        <strong>Projection:</strong> rows; <code>listStyle</code> renders them
        inset grouped, grouped, plain, or as a sidebar’s.
      </li>
      <li>
        <strong>Selection:</strong> none (pressable rows act or drill in), one (
        <PartLink
          component="list"
          part="List.Radio"
        />
        s, or a{' '}
        <PartLink
          component="list"
          part="List.Checkmark"
        />{' '}
        on the chosen row), many (
        <PartLink
          component="list"
          part="List.Checkbox"
        />
        es).
      </li>
      <li>
        <strong>Editability:</strong> reordering (
        <PartLink
          component="list"
          part="List.Grabber"
        />
        , the group’s <code>onReorder</code>), deleting and inserting (
        <PartLink
          component="list"
          part="List.EditButton"
        />
        , swipe actions).
      </li>
    </ul>

    <Heading
      id="its-parts-as-primitives"
      level={2}
    >
      Its parts as primitives
    </Heading>
    <ul>
      <li>
        <strong>Group:</strong> a section bundles its rows, optionally
        collapsible (guide, <GuideLink to="primitive-group">§5</GuideLink>,
        which lists list sections; here, a Base UI Collapsible with a{' '}
        <PartLink
          component="list"
          part="List.Disclosure"
        />
        ).
      </li>
      <li>
        <strong>Item:</strong> a row with fixed slots: leading visual, title,
        subtitle, trailing accessory, badge, inline control (guide,{' '}
        <GuideLink to="primitive-item">§5</GuideLink>, which lists table rows).
        This library’s slots: an edit control and a{' '}
        <PartLink
          component="list"
          part="List.Image"
        />
        ; <code>Title</code>, <code>Subtitle</code>, <code>Text</code>; trailing{' '}
        <code>Detail</code>, <code>Accessory</code>, <code>Checkmark</code>,{' '}
        <code>DrillIn</code>, <code>Grabber</code> or a control.
      </li>
      <li>
        <strong>Commands:</strong> swipe actions and header actions are Commands
        on an Item or a Group (guide,{' '}
        <GuideLink to="primitive-command">§5</GuideLink>).
      </li>
    </ul>

    <Heading
      id="traits"
      level={2}
    >
      Traits
    </Heading>
    <ul>
      <li>
        The row of “Lists and tables” in the guide’s trait matrix (
        <GuideLink to="trait-matrix">§4</GuideLink>).
      </li>
    </ul>
    <table>
      <tbody>
        <tr>
          <th>Intent</th>
          <td>Display / Navigate</td>
        </tr>
        <tr>
          <th>Data shape</th>
          <td>Sequence / Set</td>
        </tr>
        <tr>
          <th>Selection</th>
          <td>None / One / Many</td>
        </tr>
        <tr>
          <th>Lifetime</th>
          <td>Persistent</td>
        </tr>
        <tr>
          <th>Anchor</th>
          <td>Content</td>
        </tr>
        <tr>
          <th>Layer</th>
          <td>Content</td>
        </tr>
        <tr>
          <th>Capacity</th>
          <td>Unbounded</td>
        </tr>
      </tbody>
    </table>

    <Heading
      id="where-it-sits"
      level={2}
    >
      Where it sits
    </Heading>
    <ul>
      <li>
        <strong>Containment:</strong> a Surface holds a Collection; a Collection
        holds Groups of Items; an Item holds a viewer (a thumbnail), an
        indicator, a Command, a Choice or a Value input (guide,{' '}
        <GuideLink to="section-6-containment">§6</GuideLink>): here, a{' '}
        <a href="page">Page</a> holds the list, rows hold switches, segmented
        controls, steppers, sliders.
      </li>
      <li>
        <strong>Layer:</strong> the content layer, scrolling beneath the glass
        bars (guide <GuideLink to="layers">§2</GuideLink>,{' '}
        <GuideLink to="rule-g9">G9</GuideLink>). A sidebar’s list is the
        exception that sits on a glass panel (see <a href="sidebar">Sidebar</a>
        ).
      </li>
      <li>
        <strong>Navigation:</strong> drilling in is a Collection’s selection
        leading to the next Surface or column (guide,{' '}
        <GuideLink to="move-drill">§7.2, Drill</GuideLink>): a row with a{' '}
        <PartLink
          component="list"
          part="List.DrillIn"
        />{' '}
        pushing a page in a <a href="navigation">Navigation</a>.
      </li>
      <li>
        <strong>Selection and actions:</strong> the list owns the selection;
        toolbars and command sets read it (
        <GuideLink to="rule-g7">G7</GuideLink>), as the edit mode’s toolbar does
        (see <a href="list/composition">Composition</a>).
      </li>
      <li>
        <strong>Forms:</strong> a form is Groups of Items whose trailing slot
        holds a Choice, a Value input or a Text input (
        <GuideLink to="section-8-2">§8.2</GuideLink>); settings commit at once,
        per field (<GuideLink to="commit-model">commit model</GuideLink>).
      </li>
      <li>
        <strong>Status:</strong> status attaches to the narrowest scope it
        describes (<GuideLink to="rule-g8">G8</GuideLink>): an item’s, in its
        trailing slot (e.g. a{' '}
        <PartLink
          component="list"
          part="List.Detail"
        />
        ).
      </li>
    </ul>
  </>
);
