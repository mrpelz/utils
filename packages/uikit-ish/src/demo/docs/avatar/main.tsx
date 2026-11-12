import { FunctionComponent, useMemo } from 'react';

import { Avatar, Badge } from '../../../components/index.js';
import { Component } from '../../tooling/frame/component.js';
import {
  usePartControls,
  usePropControl,
} from '../../tooling/frame/prop-control.js';
import { useProvidedState } from '../../tooling/frame/state.js';
import { partPropMaps } from '../part-options.js';
import {
  photo,
  propOptionsContent,
  propOptionsImage,
  propOptionsRoot,
} from './props.js';

/**
 * An avatar (Base UI's `Avatar`): a
 * person's photo, or their initials; several people in one circle; badged.
 */
export const AvatarDemo: FunctionComponent = () => {
  const id = 'avatar';

  const [externalContent, externalRoot, externalImage] = useProvidedState(id);

  const [controlContent, content, stateContent] = usePropControl(
    propOptionsContent,
    { external: externalContent, isOpen: true, title: '[content]' },
  );
  const [controlRoot, propsRoot, stateRoot] = usePropControl(propOptionsRoot, {
    external: externalRoot,
    title: 'root',
  });
  const [controlImage, propsImage, stateImage, keyImage] = usePropControl(
    propOptionsImage,
    { external: externalImage, title: 'image' },
  );

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps({
          'Avatar.Image': ['src'],
          'Avatar.Root': [],
          Badge: [],
          'Avatar.Fallback': [],
          'Avatar.Group': ['size'],
        }),
      [],
    ),
    { provided: useProvidedState(id) },
  );
  const badge = content.badge ? <Badge {...partProps.Badge}>3</Badge> : null;
  const person = (index: number) => (
    <Avatar.Root
      key={index}
      {...partProps['Avatar.Root']}
    >
      {index === 0 ? (
        <Avatar.Image {...propsImage} />
      ) : (
        <Avatar.Image
          {...partProps['Avatar.Image']}
          src={photo(index * 90)}
        />
      )}
      <Avatar.Fallback {...partProps['Avatar.Fallback']}>
        {content.initials}
      </Avatar.Fallback>
    </Avatar.Root>
  );

  return (
    <Component
      isCentered
      baseUiId="avatar"
      controls={[controlContent, controlRoot, controlImage, partControls]}
      id={id}
      state={[stateContent, stateRoot, stateImage, partState]}
      title="Avatar"
    >
      <div style={{ padding: 16 }}>
        {content.people === 1 ? (
          <Avatar.Root
            key={keyImage}
            {...propsRoot}
          >
            <Avatar.Image {...propsImage} />
            <Avatar.Fallback {...partProps['Avatar.Fallback']}>
              {content.initials}
            </Avatar.Fallback>
            {badge}
          </Avatar.Root>
        ) : (
          <Avatar.Group
            {...partProps['Avatar.Group']}
            size={propsRoot.size}
          >
            {Array.from({ length: content.people }, (_, index) =>
              person(index),
            )}
            {badge}
          </Avatar.Group>
        )}
      </div>
    </Component>
  );
};
