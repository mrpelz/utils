import { FunctionComponent, useMemo } from 'react';

import { Avatar } from '../../components/index.js';
import { Component } from '../frame/component.js';
import { useLog } from '../frame/log.js';
import { usePropControl } from '../frame/prop-control.js';
import { useProvidedState } from '../frame/state.js';
import { PropsTable } from '../guide/props-table.js';
import { Heading, PartLink } from '../guide/sections.js';
import {
  avatarFallbackRows,
  avatarGroupRows,
  avatarImageRows,
  avatarRootRows,
} from './docs.js';
import {
  getPropOptionsGuideImage,
  photo,
  propOptionsGuideFallback,
  propOptionsGuideGroup,
  propOptionsRoot,
} from './props.js';

/** `Avatar.Root`, outlined, with its props. */
const RootPart: FunctionComponent = () => {
  const id = 'avatar-parts-root';
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(
    propOptionsRoot,
    'Avatar.Root',
    external,
    true,
    true,
  );

  return (
    <Component
      center
      inline
      baseUiId="avatar"
      controls={[control]}
      id={id}
      state={[state]}
      title="Avatar.Root"
    >
      <Avatar.Root {...props}>
        <Avatar.Image
          alt="Anna Haro"
          src={photo(200)}
        />
        <Avatar.Fallback>AH</Avatar.Fallback>
      </Avatar.Root>
    </Component>
  );
};

/** `Avatar.Image`, outlined, with its props. */
const ImagePart: FunctionComponent = () => {
  const id = 'avatar-parts-image';
  const [log, addLog] = useLog();
  const [external] = useProvidedState(id);
  const [control, props, state, elementKey] = usePropControl(
    useMemo(() => getPropOptionsGuideImage(addLog), [addLog]),
    'Avatar.Image',
    external,
    true,
    true,
  );

  return (
    <Component
      center
      inline
      baseUiId="avatar"
      controls={[control]}
      id={id}
      log={log}
      state={[state]}
      title="Avatar.Image"
    >
      <Avatar.Root key={elementKey}>
        <Avatar.Image {...props} />
        <Avatar.Fallback>AH</Avatar.Fallback>
      </Avatar.Root>
    </Component>
  );
};

/** `Avatar.Fallback`, outlined, with its props (no image: it shows). */
const FallbackPart: FunctionComponent = () => {
  const id = 'avatar-parts-fallback';
  const [external] = useProvidedState(id);
  const [control, props, state, elementKey] = usePropControl(
    propOptionsGuideFallback,
    'Avatar.Fallback',
    external,
    true,
    true,
  );

  return (
    <Component
      center
      inline
      baseUiId="avatar"
      controls={[control]}
      id={id}
      state={[state]}
      title="Avatar.Fallback"
    >
      <Avatar.Root key={elementKey}>
        <Avatar.Fallback {...props}>AH</Avatar.Fallback>
      </Avatar.Root>
    </Component>
  );
};

/** `Avatar.Group`, outlined, with its props. */
const GroupPart: FunctionComponent = () => {
  const id = 'avatar-parts-group';
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(
    propOptionsGuideGroup,
    'Avatar.Group',
    external,
    true,
    true,
  );

  return (
    <Component
      center
      inline
      baseUiId="avatar"
      controls={[control]}
      id={id}
      state={[state]}
      title="Avatar.Group"
    >
      <Avatar.Group {...props}>
        <Avatar.Root>
          <Avatar.Image
            alt="Anna Haro"
            src={photo(200)}
          />
          <Avatar.Fallback>AH</Avatar.Fallback>
        </Avatar.Root>
        <Avatar.Root>
          <Avatar.Image
            alt="Kate Bell"
            src={photo(290)}
          />
          <Avatar.Fallback>KB</Avatar.Fallback>
        </Avatar.Root>
        <Avatar.Root>
          <Avatar.Fallback>JA</Avatar.Fallback>
        </Avatar.Root>
      </Avatar.Group>
    </Component>
  );
};

/** `/avatar/parts`: a person's root, image and fallback; a group of them. */
export const AvatarParts: FunctionComponent = () => (
  <>
    <ul className="demo-lead">
      <li>
        A person: a root with an image and a fallback (Base UI’s), one showing
        at a time.
      </li>
      <li>Several people: a group of roots.</li>
    </ul>
    <ul>
      <li>
        <PartLink
          component="avatar"
          part="Avatar.Group"
        />{' '}
        (optional: several people)
        <ul>
          <li>
            <PartLink
              component="avatar"
              part="Avatar.Root"
            />
            <ul>
              <li>
                <PartLink
                  component="avatar"
                  part="Avatar.Image"
                />{' '}
                (optional)
              </li>
              <li>
                <PartLink
                  component="avatar"
                  part="Avatar.Fallback"
                />
              </li>
            </ul>
          </li>
        </ul>
      </li>
    </ul>

    <Heading
      id="avatar-root"
      level={2}
    >
      <code>Avatar.Root</code>
    </Heading>
    <ul>
      <li>
        A person, in a circle: <code>size</code> (70px by default).
      </li>
      <li>
        Not clipping: a <a href="badge">Badge</a> in it overhangs its corner.
      </li>
      <li>
        Renders a <code>span</code>.
      </li>
    </ul>
    <RootPart />
    <h3>Props</h3>
    <PropsTable rows={avatarRootRows} />

    <Heading
      id="avatar-image"
      level={2}
    >
      <code>Avatar.Image</code>
    </Heading>
    <ul>
      <li>The photo, covering the circle, once it has loaded.</li>
      <li>
        Renders an <code>img</code>: its <code>alt</code> the person’s name.
      </li>
    </ul>
    <ImagePart />
    <h3>Props</h3>
    <PropsTable rows={avatarImageRows} />

    <Heading
      id="avatar-fallback"
      level={2}
    >
      <code>Avatar.Fallback</code>
    </Heading>
    <ul>
      <li>
        Without a photo (none, loading, broken): the initials, 40% of the
        circle, white on gray.
      </li>
      <li>
        Not before its <code>delay</code> (so a fast photo doesn’t flash it).
      </li>
    </ul>
    <FallbackPart />
    <h3>Props</h3>
    <PropsTable rows={avatarFallbackRows} />

    <Heading
      id="avatar-group"
      level={2}
    >
      <code>Avatar.Group</code>
    </Heading>
    <ul>
      <li>
        Several people in one circle on the system fill (Figma “Group”): the
        first at 53% of it, the second 31%, a third 26%.
      </li>
      <li>
        It sizes its people: theirs (<code>size</code>) would override it. From
        a fourth on, they aren’t shown.
      </li>
      <li>
        Renders a <code>span</code> with the <code>group</code> role: name it.
      </li>
    </ul>
    <GroupPart />
    <h3>Props</h3>
    <PropsTable rows={avatarGroupRows} />
  </>
);

/** Its live views, also on the component's page of demos (and `/all`). */
export const avatarPartsDemos = [RootPart, ImagePart, FallbackPart, GroupPart];
