import { FunctionComponent } from 'react';

import { Avatar, Badge } from '../../components/index.js';
import { Component } from '../frame/component.js';
import { usePropControl } from '../frame/prop-control.js';
import { useProvidedState } from '../frame/state.js';
import {
  photo,
  propOptionsContent,
  propOptionsImage,
  propOptionsRoot,
} from './props.js';

/**
 * An avatar (Figma “Activity Views”: “Contact”, Base UI's `Avatar`): a
 * person's photo, or their initials; several people in one circle; badged.
 */
export const AvatarDemo: FunctionComponent = () => {
  const id = 'avatar';

  const [externalContent, externalRoot, externalImage] = useProvidedState(id);

  const [controlContent, content, stateContent] = usePropControl(
    propOptionsContent,
    { external: externalContent, open: true, title: '[content]' },
  );
  const [controlRoot, propsRoot, stateRoot] = usePropControl(propOptionsRoot, {
    external: externalRoot,
    title: 'root',
  });
  const [controlImage, propsImage, stateImage, keyImage] = usePropControl(
    propOptionsImage,
    { external: externalImage, title: 'image' },
  );

  const badge = content.badge ? <Badge>3</Badge> : null;
  const person = (index: number) => (
    <Avatar.Root key={index}>
      {index === 0 ? (
        <Avatar.Image {...propsImage} />
      ) : (
        <Avatar.Image src={photo(index * 90)} />
      )}
      <Avatar.Fallback>{content.initials}</Avatar.Fallback>
    </Avatar.Root>
  );

  return (
    <Component
      center
      baseUiId="avatar"
      controls={[controlContent, controlRoot, controlImage]}
      id={id}
      state={[stateContent, stateRoot, stateImage]}
      title="Avatar"
    >
      <div style={{ padding: 16 }}>
        {content.people === 1 ? (
          <Avatar.Root
            key={keyImage}
            {...propsRoot}
          >
            <Avatar.Image {...propsImage} />
            <Avatar.Fallback>{content.initials}</Avatar.Fallback>
            {badge}
          </Avatar.Root>
        ) : (
          <Avatar.Group size={propsRoot.size}>
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
