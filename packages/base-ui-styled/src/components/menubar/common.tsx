import { Menubar as BaseMenubar } from '@base-ui/react/menubar';
import { styled } from 'goober';
import { forwardRef } from 'preact/compat';

export const CommonMenubar = styled(BaseMenubar, forwardRef)`
  display: flex;
  align-items: center;
`;
