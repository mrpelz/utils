import { code, PropRow, union } from '../tooling/guide/props-table.js';
import { publicUrl } from '../tooling/public-url.js';

/**
 * A scroll container's `glass` prop (Page, the content parts), its row:
 * the same everywhere.
 */
export const glassModeRow: PropRow = [
  'glass',
  union('auto', 'flat', 'live'),
  code(union('auto')),
  <>
    The glass in it, such as glass buttons and text fields. <code>live</code>{' '}
    blurs what’s behind it. <code>flat</code> draws it opaque, over this
    container’s background, looking as the live glass would there, without
    backdrop filters, isolation or blend modes. <code>auto</code> is flat while
    the container can scroll (its content is larger than it, or it bounces
    anyway, with <code>alwaysBounce</code>), and live otherwise. Flat glass is
    for content that scrolls: on iOS, live glass there ends the scroll’s glides
    (see <a href={publicUrl('ios-quirks#layers-under-a-scroll')}>iOS Quirks</a>
    ). A <code>live</code> container inside a <code>flat</code> one is live
    again. The background flat glass is drawn over is{' '}
    <code>--uikit-glass-backdrop</code>: pages and list groups set it to their
    own; set it on a container of your own that draws a different one.
  </>,
];
