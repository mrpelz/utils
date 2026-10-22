import { elementRows, PropRow } from '../guide/props-table.js';

// Its props, for the parts page (all) and the overview (its key ones).

export const symbolRows: readonly PropRow[] = [
  [
    'icon',
    'IconDefinition',
    undefined,
    <>
      The SF Symbol (required): from <code>@bradleyhodges/sfsymbols</code>, e.g.{' '}
      <code>sfBell</code> (a peer dependency; mind Apple’s terms for SF
      Symbols).
    </>,
  ],
  [
    'children',
    'ReactNode',
    undefined,
    <>
      What sits on it, e.g. a <a href="badge">Badge</a> (
      <code>placement=&quot;symbol&quot;</code>): neither blended nor scaled
      with the glyph.
    </>,
  ],
  ...elementRows('span', 'HTMLSpanElement'),
];
