import { FunctionComponent } from 'react';

import { CodeView } from '../../tooling/frame/code-view.js';
import {
  Contents,
  Heading,
  PartLink,
  type Section,
} from '../../tooling/guide/sections.js';
import { publicUrl } from '../../tooling/public-url.js';

// `/avatar/architecture`: how Avatar is built, and what flows into it.

const groupCode = `/* A group: its avatars placed by their order among avatars only (its
   badges are its children too, and don't count). */
.uikit-avatar-group {
  & > :nth-child(1 of [data-avatar-part='root']) { /* large, top start */ }
  & > :nth-child(2 of [data-avatar-part='root']) { /* small, bottom end */ }
  & > :nth-child(3 of [data-avatar-part='root']) { /* smaller, top end */ }
  & > :nth-child(n + 4 of [data-avatar-part='root']) { display: none; }
}`;

const sections: readonly Section[] = [
  ['base-ui-s-avatar', 'Base UI’s avatar'],
  ['sized-by-one-property', 'Sized by one property'],
  ['a-group', 'A group'],
  ['what-flows-in-and-out', 'What flows in and out'],
];

/** `/avatar/architecture`: how it's built, and what flows into it. */
export const AvatarArchitecture: FunctionComponent = () => (
  <>
    <Contents sections={sections} />
    <ul className="demo-lead">
      <li>
        Avatar is Base UI’s, with a size and a stylesheet, plus a group of its
        own for several people in one circle. For using it, see its{' '}
        <a href={publicUrl('avatar/parts')}>parts</a>.
      </li>
    </ul>

    <Heading
      id="base-ui-s-avatar"
      level={2}
    >
      Base UI’s avatar
    </Heading>
    <ul>
      <li>
        <PartLink part="Avatar.Root" />, <PartLink part="Avatar.Image" /> and{' '}
        <PartLink part="Avatar.Fallback" /> are Base UI’s, each with a part
        attribute and a class. Base UI decides what shows: the image once it has
        loaded, the fallback until then or if it fails.
      </li>
      <li>
        The root doesn’t clip, so a{' '}
        <PartLink
          component="badge"
          part="Badge"
        />{' '}
        placed in it can overhang its corner. The image and the fallback are
        round themselves. The root is positioned, so it’s the badge’s containing
        block.
      </li>
    </ul>

    <Heading
      id="sized-by-one-property"
      level={2}
    >
      Sized by one property
    </Heading>
    <ul>
      <li>
        A <code>size</code> becomes <code>--uikit-avatar-size</code>. Every
        other measure derives from it in the stylesheet: the fallback’s text is
        40% of it, and a group’s avatars are fractions of it. Without a size,
        it’s 70px.
      </li>
      <li>
        The app’s <code>style</code> is merged after the size, so it can set the
        property itself.
      </li>
    </ul>

    <Heading
      id="a-group"
      level={2}
    >
      A group
    </Heading>
    <ul>
      <li>
        <PartLink part="Avatar.Group" /> is the library’s own: a span with{' '}
        <code>role=&quot;group&quot;</code> on the system fill, holding up to
        three <PartLink part="Avatar.Root" />
        s. It has no script: the first is large at the top start, the second
        small at the bottom end, a third smaller at the top end, and any more
        are hidden.
      </li>
      <li>
        They’re picked by their order among avatars only (
        <code>:nth-child(… of …)</code>), so badges in the group, which are its
        children too, don’t shift them.
      </li>
    </ul>
    <CodeView code={groupCode} />

    <Heading
      id="what-flows-in-and-out"
      level={2}
    >
      What flows in and out
    </Heading>
    <ul>
      <li>
        <strong>From Base UI:</strong> the image’s loading state, and the
        fallback’s timing.
      </li>
      <li>
        <strong>From the tokens:</strong> the group’s system fill. The
        fallback’s gray gradient is fixed, the same in both color schemes.
      </li>
      <li>
        <strong>Out:</strong> a containing block for badges.
      </li>
    </ul>
  </>
);
