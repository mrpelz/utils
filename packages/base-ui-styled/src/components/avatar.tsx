import { Avatar as BaseAvatar } from '@base-ui/react/avatar';
import { Properties } from 'csstype';
import { styled } from 'goober';
import { forwardRef } from 'preact/compat';

export type AvatarRootProps = BaseAvatar.Root.Props & {
  size?: Properties['width'];
};

// eslint-disable-next-line prettier/prettier
const Root = styled<typeof BaseAvatar.Root, AvatarRootProps>(BaseAvatar.Root, forwardRef)`
  --styled-size: attr(size type(\<length\>), 2rem);

  display: inline-flex;
  overflow: hidden;
  width: var(--styled-size);
  height: var(--styled-size);
  align-items: center;
  justify-content: center;
  border-radius: 100%;
  background-color: oklch(92.2% 0 0deg);
  color: oklch(14.5% 0 0deg);
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1;
  user-select: none;
  vertical-align: middle;

  @media (prefers-color-scheme: dark) {
    background-color: oklch(26.9% 0 0deg);
    color: white;
  }
`;

const Image = styled(BaseAvatar.Image, forwardRef)`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const Fallback = styled(BaseAvatar.Fallback, forwardRef)`
  display: flex;
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
`;

export const Avatar = {
  ...BaseAvatar,
  Root,
  Image,
  Fallback,
};
