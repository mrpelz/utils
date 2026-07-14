import { Avatar as BaseAvatar } from '@base-ui/react/avatar';
import { styled } from 'goober';
import { forwardRef } from 'preact/compat';

const Root = styled(BaseAvatar.Root, forwardRef)`
  display: inline-flex;
  overflow: hidden;
  width: var(--space-8);
  height: var(--space-8);
  box-sizing: border-box;
  align-items: center;
  justify-content: center;
  border-radius: 100%;
  background-color: var(--active-wash);
  color: var(--on-surface);
  font-size: var(--text-sm);
  font-weight: var(--font-regular);
  line-height: var(--leading-none);
  user-select: none;
  vertical-align: middle;
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
  font-size: var(--text-sm);
`;

export const CommonAvatar = {
  ...BaseAvatar,
  Root,
  Image,
  Fallback,
};
