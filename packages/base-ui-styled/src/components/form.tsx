import { Fieldset as BaseFieldset } from '@base-ui/react/fieldset';
import { Form as BaseForm } from '@base-ui/react/form';
import { styled } from 'goober';
import { forwardRef } from 'react';

import { List, ListHeaderProps } from './list.js';

// Forms (Base UI `Form`, `Fieldset`), as iOS lays them out (Settings,
// Contacts): in a `List`, a fieldset is a section, its legend the section's
// header (`List.Header`), its fields rows (`TextField.Root` rendering a
// `List.Item`; `Checkbox`, `Radio`, `Switch`, `Stepper`, `Slider`, … in
// rows). A form submits with a `Button` of `type="submit"`.
// Source: behavior after Framework7 (`form.js`, `list.less`: inputs in list
// rows); Figma has no forms.

// The section, as a fieldset (its user agent box reset).
const FieldsetElement = styled('fieldset', forwardRef)`
  padding: 0;
  border: 0;
  margin-inline: 0;
  min-inline-size: 0;
`;

/**
 * A fieldset (Base UI): a list section (`List.Section`), disabling its
 * fields (`disabled`).
 */
const FieldsetRoot = forwardRef<
  HTMLElement,
  Omit<BaseFieldset.Root.Props, 'ref'>
>((props, ref) => (
  <BaseFieldset.Root
    ref={ref}
    {...props}
    render={props.render ?? <List.Section render={<FieldsetElement />} />}
  />
));

export type FieldsetLegendProps = Omit<BaseFieldset.Legend.Props, 'ref'> &
  Pick<ListHeaderProps, 'prominence'>;

/** A fieldset's legend (Base UI): its section's header (`List.Header`). */
const FieldsetLegend = forwardRef<HTMLDivElement, FieldsetLegendProps>(
  ({ children, prominence, ...props }, ref) => (
    <BaseFieldset.Legend
      ref={ref}
      {...props}
      render={props.render ?? <List.Header prominence={prominence} />}
    >
      <List.Title>{children}</List.Title>
    </BaseFieldset.Legend>
  ),
);

export const Fieldset = {
  ...BaseFieldset,
  Root: FieldsetRoot,
  Legend: FieldsetLegend,
};

/**
 * Base UI's form: it validates its fields (by `name`) and shows `errors`
 * (e.g. a server's) on them; `onFormSubmit` gets the values.
 */
export const Form = BaseForm;
