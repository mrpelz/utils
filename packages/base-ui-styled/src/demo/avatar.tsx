import { ImageLoadingStatus } from '@base-ui/react';
import { FunctionComponent } from 'preact';
import { useMemo } from 'preact/hooks';

import { Avatar } from '../components/index.js';
import {
  commonPropOptions,
  Component,
  MappedProp,
  useLog,
  usePropControl,
} from '../demo-utils/main.js';
import avatar from './avatar.png';

const propOptionsParts = {
  fallback: [true, false],
  img: [true, false],
  initials: [false, true],
} as const;

const propOptionsRoot = {
  ...commonPropOptions,
  size: [undefined, '144px', '30rem'],
} as const;

const propOptionsImage = {
  ...commonPropOptions,
  alt: [
    'shirtless black person with short, green hair, standing in front of a tiled wall, covering their face with their left hand, pointer finger bandaged',
    undefined,
  ],
  src: [new MappedProp(avatar, '[demo avatar]'), undefined],
} as const;

const propOptionsFallback = {
  ...commonPropOptions,
  children: ['FB', undefined] as const,
  delay: [undefined, 0, 5000],
} as const;

export const AvatarDemo: FunctionComponent = () => {
  const [log, addLog] = useLog();

  const [controlParts, { img, fallback, initials }] = usePropControl(
    propOptionsParts,
    '[parts]',
    true,
  );

  const [controlRoot, propsRoot] = usePropControl(
    propOptionsRoot,
    'root',
    true,
  );

  const [controlImage, propsImage] = usePropControl(
    useMemo(
      () => ({
        ...propOptionsImage,
        onLoadingStatusChange: [
          new MappedProp(
            (status: ImageLoadingStatus) => addLog(`loading state: ${status}`),
            '[log status]',
          ),
          undefined,
        ] as const,
      }),
      [addLog],
    ),
    'image',
  );

  const [controlFallback, propsFallback] = usePropControl(
    propOptionsFallback,
    'fallback',
  );

  return (
    <Component
      backdrop
      center
      controls={[controlParts, controlRoot, controlImage, controlFallback]}
      id="avatar"
      log={log}
      title="Avatar"
    >
      <Avatar.Root {...propsRoot}>
        {!initials && img ? <Avatar.Image {...propsImage} /> : null}
        {!initials && fallback ? <Avatar.Fallback {...propsFallback} /> : null}
        {initials ? propsFallback.children : null}
      </Avatar.Root>
    </Component>
  );
};
