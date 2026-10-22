import { FunctionComponent, ReactNode } from 'react';

/** A prop: its name, type (code), default (or `undefined`: none) and use. */
export type PropRow = readonly [
  name: string,
  type: string,
  defaultValue: ReactNode,
  description: ReactNode,
];

/** A union of string literals, as a type: `'a' | 'b'`. */
export const union = (...values: readonly string[]): string =>
  values.map((value) => `'${value}'`).join(' | ');

/** A default value, as code. */
export const code = (value: string): ReactNode => <code>{value}</code>;

/**
 * The props of a part rendering an element of its own (not Base UI's): its
 * class name, style, ref, and the element's other attributes.
 */
export const elementRows = (
  element: string,
  refElement: string,
): readonly PropRow[] => [
  ['className', 'string', undefined, 'CSS class applied to the element.'],
  ['style', 'CSSProperties', undefined, 'Style applied to the element.'],
  ['ref', `Ref<${refElement}>`, undefined, 'The rendered element’s ref.'],
  [
    '…',
    `ComponentProps<'${element}'>`,
    undefined,
    <>
      Any other attribute or event handler of the rendered{' '}
      <code>{`<${element}>`}</code>.
    </>,
  ],
];

/**
 * The props every Base UI part takes (Base UI's descriptions), its ref, and
 * the attributes of the element it renders.
 */
export const baseUiRows = (
  element: string,
  refElement: string,
): readonly PropRow[] => [
  [
    'className',
    'string | ((state) => string | undefined)',
    undefined,
    'CSS class applied to the element, or a function that returns a class based on the component’s state.',
  ],
  [
    'style',
    'CSSProperties | ((state) => CSSProperties | undefined)',
    undefined,
    'Style applied to the element, or a function that returns a style object based on the component’s state.',
  ],
  [
    'render',
    'ReactElement | ((props, state) => ReactElement)',
    undefined,
    <>
      Allows you to replace the component’s HTML element with a different tag,
      or compose it with another component. Accepts a <code>ReactElement</code>{' '}
      or a function that returns the element to render.
    </>,
  ],
  ...elementRows(element, refElement).slice(2),
];

/**
 * The props of a part rendered by Base UI's `useRender` (not a Base UI
 * component, so without a state): its class name, style, `render`, ref,
 * and the element's other attributes.
 */
export const renderRows = (
  element: string,
  refElement: string,
): readonly PropRow[] => [
  ...elementRows(element, refElement).slice(0, 2),
  [
    'render',
    'ReactElement | ((props) => ReactElement)',
    undefined,
    <>
      Allows you to replace the component’s HTML element with a different tag,
      or compose it with another component. Accepts a <code>ReactElement</code>{' '}
      or a function that returns the element to render.
    </>,
  ],
  ...elementRows(element, refElement).slice(2),
];

/**
 * A positioner's props (Base UI's anchor positioning, its descriptions) but
 * its side, alignment, side offset and collision padding (each component's
 * own defaults).
 */
export const anchorPositioningRows: readonly PropRow[] = [
  [
    'alignOffset',
    'number | ((data) => number)',
    code('0'),
    'Additional offset along the alignment axis in pixels; or a function of the anchor’s and positioner’s dimensions, its side and alignment.',
  ],
  [
    'anchor',
    'Element | VirtualElement | RefObject<Element | null> | (() => …) | null',
    'its trigger',
    'An element to position the popup against.',
  ],
  [
    'arrowPadding',
    'number',
    code('5'),
    'Minimum distance to maintain between the arrow and the edges of the popup.',
  ],
  [
    'collisionAvoidance',
    '{ side?, align?, fallbackAxisSide? }',
    undefined,
    <>
      Determines how to handle collisions when positioning the popup:{' '}
      <code>side</code> (<code>flip</code>, <code>shift</code>,{' '}
      <code>none</code>) on the side’s axis, <code>align</code> (the same) on
      the alignment axis, <code>fallbackAxisSide</code> (<code>start</code>,{' '}
      <code>end</code>, <code>none</code>) to the perpendicular axis.
    </>,
  ],
  [
    'collisionBoundary',
    'Element | Element[] | Rect | ‘clipping-ancestors’',
    code(union('clipping-ancestors')),
    'An element or a rectangle that delimits the area that the popup is confined to.',
  ],
  [
    'disableAnchorTracking',
    'boolean',
    code('false'),
    'Whether to disable the popup from tracking any layout shift of its positioning anchor.',
  ],
  [
    'positionMethod',
    union('absolute', 'fixed'),
    code(union('absolute')),
    <>
      Determines which CSS <code>position</code> property to use.
    </>,
  ],
  [
    'sticky',
    'boolean',
    code('false'),
    'Whether to maintain the popup in the viewport after the anchor element was scrolled out of view.',
  ],
];

/** A secondary click (see `useSecondaryClick`), on buttons and rows. */
export const secondaryClickRow: PropRow = [
  'onSecondaryClick',
  'MouseEventHandler<HTMLElement>',
  undefined,
  'A secondary click: a right click (or Control-click: the contextmenu event, whose menu it replaces), or a touch held for 500ms (iOS: a long press), whose click then doesn’t follow. Not while disabled.',
];

/** Base UI's `nativeButton`, by whether the part renders a button. */
export const nativeButtonRow = (button: boolean): PropRow => [
  'nativeButton',
  'boolean',
  code(String(button)),
  <>
    Whether the component renders a native <code>{'<button>'}</code> element
    when replacing it via the <code>render</code> prop.{' '}
    {button ? (
      <>
        Set to <code>false</code> if the rendered element is not a button (for
        example, <code>{'<div>'}</code>).
      </>
    ) : (
      <>
        Set to <code>true</code> if the rendered element is a native button.
      </>
    )}
  </>,
];

/** An overview's table of props (Prop | Type | Default | Description). */
export const PropsTable: FunctionComponent<{ rows: readonly PropRow[] }> = ({
  rows,
}) => (
  <div className="demo-table">
    <table className="demo-props-table">
      <thead>
        <tr>
          <th>Prop</th>
          <th>Type</th>
          <th>Default</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        {rows.map(([name, type, defaultValue, description]) => (
          <tr key={name}>
            <td>
              <code>{name}</code>
            </td>
            <td>
              <code>{type}</code>
            </td>
            <td>{defaultValue === undefined ? '—' : defaultValue}</td>
            <td>{description}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

/** Some of a part's rows, by their props' names (in the order given). */
export const pickRows = (
  rows: readonly PropRow[],
  ...names: readonly string[]
): readonly PropRow[] =>
  names.map((name) => {
    const row = rows.find(([rowName]) => rowName === name);
    if (!row) throw new Error(`no prop ${name}`);
    return row;
  });

/**
 * An overview's table of a component's key props, across its parts (Part |
 * Prop | Type | Default | Description); every part's props are on its
 * parts page.
 */
export const KeyPropsTable: FunctionComponent<{
  parts: readonly (readonly [part: string, rows: readonly PropRow[]])[];
}> = ({ parts }) => (
  <div className="demo-table">
    <table className="demo-props-table demo-key-props-table">
      <thead>
        <tr>
          <th>Part</th>
          <th>Prop</th>
          <th>Type</th>
          <th>Default</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        {parts.flatMap(([part, rows]) =>
          rows.map(([name, type, defaultValue, description]) => (
            <tr key={`${part}.${name}`}>
              <td>
                <code>{part}</code>
              </td>
              <td>
                <code>{name}</code>
              </td>
              <td>
                <code>{type}</code>
              </td>
              <td>{defaultValue === undefined ? '—' : defaultValue}</td>
              <td>{description}</td>
            </tr>
          )),
        )}
      </tbody>
    </table>
  </div>
);
