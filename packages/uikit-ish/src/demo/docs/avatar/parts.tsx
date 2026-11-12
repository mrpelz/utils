import { FunctionComponent, useMemo } from 'react';

import { Avatar } from '../../../components/index.js';
import { Component } from '../../tooling/frame/component.js';
import { useLog } from '../../tooling/frame/log.js';
import {
  usePartControls,
  usePropControl,
} from '../../tooling/frame/prop-control.js';
import { useProvidedState } from '../../tooling/frame/state.js';
import { PropsTable } from '../../tooling/guide/props-table.js';
import { Heading, PartLink } from '../../tooling/guide/sections.js';
import { publicUrl } from '../../tooling/public-url.js';
import { partPropMaps } from '../part-options.js';
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
  const [control, props, state] = usePropControl(propOptionsRoot, {
    external,
    isOpen: true,
    emphasize: 'outline',
    title: 'Avatar.Root',
  });

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps({
          'Avatar.Fallback': [],
          'Avatar.Image': ['alt', 'src'],
        }),
      [],
    ),
    { provided: useProvidedState(id) },
  );

  return (
    <Component
      isCentered
      isInline
      baseUiId="avatar"
      controls={[control, partControls]}
      id={id}
      state={[state, partState]}
      title="Avatar.Root"
    >
      <Avatar.Root {...props}>
        <Avatar.Image
          {...partProps['Avatar.Image']}
          alt="Anna Hall"
          src={photo(200)}
        />
        <Avatar.Fallback {...partProps['Avatar.Fallback']}>AH</Avatar.Fallback>
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
    { external, isOpen: true, emphasize: 'outline', title: 'Avatar.Image' },
  );

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            'Avatar.Fallback': [],
            'Avatar.Root': [],
          },
          addLog,
        ),
      [addLog],
    ),
    { provided: useProvidedState(id) },
  );

  return (
    <Component
      isCentered
      isInline
      baseUiId="avatar"
      controls={[control, partControls]}
      id={id}
      log={log}
      state={[state, partState]}
      title="Avatar.Image"
    >
      <Avatar.Root
        key={elementKey}
        {...partProps['Avatar.Root']}
      >
        <Avatar.Image {...props} />
        <Avatar.Fallback {...partProps['Avatar.Fallback']}>AH</Avatar.Fallback>
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
    { external, isOpen: true, emphasize: 'outline', title: 'Avatar.Fallback' },
  );

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps({
          'Avatar.Root': [],
        }),
      [],
    ),
    { provided: useProvidedState(id) },
  );

  return (
    <Component
      isCentered
      isInline
      baseUiId="avatar"
      controls={[control, partControls]}
      id={id}
      state={[state, partState]}
      title="Avatar.Fallback"
    >
      <Avatar.Root
        key={elementKey}
        {...partProps['Avatar.Root']}
      >
        <Avatar.Fallback {...props}>AH</Avatar.Fallback>
      </Avatar.Root>
    </Component>
  );
};

/** `Avatar.Group`, outlined, with its props. */
const GroupPart: FunctionComponent = () => {
  const id = 'avatar-parts-group';
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(propOptionsGuideGroup, {
    external,
    isOpen: true,
    emphasize: 'outline',
    title: 'Avatar.Group',
  });

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps({
          'Avatar.Fallback': [],
          'Avatar.Image': ['alt', 'src'],
          'Avatar.Root': [],
        }),
      [],
    ),
    { provided: useProvidedState(id) },
  );

  return (
    <Component
      isCentered
      isInline
      baseUiId="avatar"
      controls={[control, partControls]}
      id={id}
      state={[state, partState]}
      title="Avatar.Group"
    >
      <Avatar.Group {...props}>
        <Avatar.Root {...partProps['Avatar.Root']}>
          <Avatar.Image
            {...partProps['Avatar.Image']}
            alt="Anna Hall"
            src={photo(200)}
          />
          <Avatar.Fallback {...partProps['Avatar.Fallback']}>
            AH
          </Avatar.Fallback>
        </Avatar.Root>
        <Avatar.Root {...partProps['Avatar.Root']}>
          <Avatar.Image
            {...partProps['Avatar.Image']}
            alt="Kate Brown"
            src={photo(290)}
          />
          <Avatar.Fallback {...partProps['Avatar.Fallback']}>
            KB
          </Avatar.Fallback>
        </Avatar.Root>
        <Avatar.Root {...partProps['Avatar.Root']}>
          <Avatar.Fallback {...partProps['Avatar.Fallback']}>
            JA
          </Avatar.Fallback>
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
    <ul className="demo-tree">
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
              <li className="demo-tree-context">
                <PartLink
                  component="badge"
                  part="Badge"
                />{' '}
                <span>(optional, on its corner)</span>
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
        A person, in a circle, with its <code>size</code> (70px by default).
      </li>
      <li>
        It doesn’t clip, so a <a href={publicUrl('badge')}>Badge</a> inside it
        hangs over its corner.
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
      <li>The photo, covering the circle once it has loaded.</li>
      <li>
        Renders an <code>img</code>, with the person’s name as its{' '}
        <code>alt</code>.
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
        Shows the initials when there’s no photo (none, still loading, or
        broken), at 40% of the circle, white on gray.
      </li>
      <li>
        It waits for its <code>delay</code>, so a photo that loads fast doesn’t
        flash it.
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
        Several people in one circle, on the system fill. The first takes 53% of
        it, the second 31%, and a third 26%.
      </li>
      <li>
        It sizes its people, and a <code>size</code> of their own would override
        that. From a fourth person on, they aren’t shown.
      </li>
      <li>
        Renders a <code>span</code> with the <code>group</code> role. Give it a
        name.
      </li>
    </ul>
    <GroupPart />
    <h3>Props</h3>
    <PropsTable rows={avatarGroupRows} />
  </>
);

/** Its live views, also on the component's page of demos (and `/all`). */
export const avatarPartsDemos = [RootPart, ImagePart, FallbackPart, GroupPart];
