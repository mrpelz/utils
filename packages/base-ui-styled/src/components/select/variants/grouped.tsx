import { Field as BaseField } from '@base-ui/react/field';
import { Select as BaseSelect } from '@base-ui/react/select';
import { styled } from 'goober';
import { forwardRef } from 'preact/compat';

import { CommonSelect } from '../common.js';

const FieldRoot = styled(BaseField.Root, forwardRef)`
  display: flex;
  flex-direction: column;
  align-items: start;
  gap: var(--space-1);
`;

const FieldLabel = styled(BaseField.Label, forwardRef)`
  color: var(--on-surface);
  cursor: default;
  font-size: var(--text-sm);
  font-weight: var(--font-bold);
  line-height: var(--leading-sm);
`;

const Trigger = styled(CommonSelect.Trigger, forwardRef)`
  min-width: 11rem;
`;

const Group = styled(BaseSelect.Group, forwardRef)`
  display: block;
  padding-bottom: var(--space-0-5);

  &:last-child {
    padding-bottom: 0;
  }
`;

const GroupLabel = styled(BaseSelect.GroupLabel, forwardRef)`
  box-sizing: border-box;
  padding-right: var(--space-4);
  padding-left: calc(var(--space-2-5) + var(--space-4) + var(--space-2));
  color: var(--subtle);
  font-size: var(--text-sm);
  line-height: var(--leading-sm);
  padding-block: var(--space-1-5);
  user-select: none;
`;

const Separator = styled(BaseSelect.Separator, forwardRef)`
  height: 1px;
  background-color: var(--border);
  margin-block: var(--space-1);
  margin-inline: var(--space-4);
`;

const ScrollArrow = styled(CommonSelect.ScrollArrow, forwardRef)`
  z-index: 2;
`;

export const grouped = {
  ...CommonSelect,
  FieldRoot,
  FieldLabel,
  Trigger,
  Group,
  GroupLabel,
  Separator,
  ScrollArrow,
};
