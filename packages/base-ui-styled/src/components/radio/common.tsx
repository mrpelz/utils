import { Radio as BaseRadio } from '@base-ui/react/radio';
import { RadioGroup as BaseRadioGroup } from '@base-ui/react/radio-group';
import { styled } from 'goober';
import { forwardRef } from 'preact/compat';

const Root = styled(BaseRadio.Root, forwardRef)`
  display: flex;
  width: 1rem;
  height: 1rem;
  box-sizing: border-box;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: var(--border-width) solid var(--border);
  border-radius: 100%;
  margin: 0;
  background-color: var(--surface);
  color: var(--surface);

  &[data-checked] {
    background-color: var(--ink);
    color: var(--on-ink);
  }

  &:focus-visible {
    outline: var(--focus-ring-width) solid var(--focus-ring-color);
    outline-offset: 2px;
  }
`;

const Indicator = styled(BaseRadio.Indicator, forwardRef)`
  display: flex;
  align-items: center;
  justify-content: center;

  &[data-unchecked] {
    display: none;
  }

  &::before {
    width: var(--space-2);
    height: var(--space-2);
    border-radius: 100%;
    background-color: currentcolor;
    content: '';
  }
`;

export const CommonRadio = {
  ...BaseRadio,
  Root,
  Indicator,
};

const GroupRoot = styled(BaseRadioGroup, forwardRef)`
  display: flex;
  flex-direction: column;
  align-items: start;
  color: var(--on-surface);
  gap: var(--space-1);
`;

const Caption = styled('div', forwardRef)`
  font-size: var(--text-sm);
  font-weight: var(--font-bold);
  line-height: var(--leading-sm);
`;

const Item = styled('label', forwardRef)`
  display: flex;
  align-items: center;
  font-size: var(--text-sm);
  font-weight: var(--font-regular);
  gap: var(--space-2);
  line-height: var(--leading-sm);
`;

export const CommonRadioGroup = Object.assign(GroupRoot, {
  Caption,
  Item,
});
