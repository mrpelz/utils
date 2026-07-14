import { styled } from 'goober';
import {
  ComponentChildren,
  ComponentType,
  Fragment,
  FunctionComponent,
} from 'preact';
import { forwardRef } from 'preact/compat';
import { useRef, useState } from 'preact/hooks';

import { IndeterminateIcon } from '../components/checkbox-group/variants/parent-checkbox.js';
import {
  Button as FormButton,
  FieldError as FormFieldError,
  FieldLabel as FormFieldLabel,
  FieldRoot as FormFieldRoot,
  Input as FormInput,
} from '../components/form/variants/main.js';
import {
  Accordion,
  AlertDialog,
  Autocomplete,
  Avatar,
  Button,
  Checkbox,
  CheckboxGroup,
  Collapsible,
  Combobox,
  ContextMenu,
  Dialog,
  Drawer,
  Field,
  Fieldset,
  Form,
  Input,
  Menu,
  Menubar,
  Meter,
  NavigationMenu,
  NumberField,
  OTPField,
  Popover,
  PreviewCard,
  Progress,
  Radio,
  RadioGroup,
  ScrollArea,
  Select,
  Separator,
  Slider,
  Switch,
  Tabs,
  Toast,
  Toggle,
  ToggleGroup,
  Toolbar,
  Tooltip,
} from '../components/index.js';
import {
  HeartFilledIcon,
  HeartOutlineIcon,
} from '../components/toggle/variants/main.js';
import {
  AlignCenterIcon,
  AlignLeftIcon,
  AlignRightIcon,
  Button as ToggleGroupButton,
} from '../components/toggle-group/variants/main.js';
import {
  BoldIcon as ToggleGroupBoldIcon,
  Button as ToggleGroupMultipleButton,
  ItalicIcon as ToggleGroupItalicIcon,
  UnderlineIcon as ToggleGroupUnderlineIcon,
} from '../components/toggle-group/variants/multiple.js';
import { ComponentEntry, Story } from './utils.js';

export const Page = styled('div', forwardRef)`
  display: grid;
  min-height: 100vh;
  grid-template-columns: 16rem minmax(0, 1fr);

  @media (width < 48rem) {
    grid-template-columns: 1fr;
  }
`;

export const Sidebar = styled('nav', forwardRef)`
  position: sticky;
  top: 0;
  height: 100vh;
  box-sizing: border-box;
  padding: var(--space-4);
  border-right: var(--border-width) solid var(--border);
  background-color: var(--surface);
  color: var(--on-surface);
  font-size: var(--text-sm);
  overflow-y: auto;

  @media (width < 48rem) {
    position: static;
    height: auto;
    border-right: 0;
    border-bottom: var(--border-width) solid var(--border);
  }
`;

export const SidebarTitle = styled('div', forwardRef)`
  margin-bottom: var(--space-6);
  font-size: var(--text-md);
  font-weight: var(--font-bold);
`;

export const SidebarCategory = styled('div', forwardRef)`
  margin-top: var(--space-4);
  color: var(--subtle);
  font-size: var(--text-xs);
  font-weight: var(--font-bold);
  text-transform: uppercase;

  &:first-of-type {
    margin-top: 0;
  }
`;

export const SidebarLink = styled('a', forwardRef)`
  display: block;
  overflow: hidden;
  padding: var(--space-1) 0;
  color: var(--muted);
  text-decoration: none;
  text-overflow: ellipsis;
  white-space: nowrap;

  &:hover {
    color: var(--on-surface);
    text-decoration: underline;
  }
`;

export const Main = styled('main', forwardRef)`
  min-width: 0;
  box-sizing: border-box;
  padding: var(--space-8);
`;

export const CategoryHeading = styled('h1', forwardRef)`
  padding-bottom: var(--space-2);
  border-bottom: var(--border-width) solid var(--border);
  margin: var(--space-12) 0 var(--space-6);
  color: var(--on-surface);
  font-size: var(--text-xl);
  font-weight: var(--font-bold);

  &:first-of-type {
    margin-top: 0;
  }
`;

/* ---------------------------------------------------------------------- */
/* Shared sample content — reused across many stories for consistency.    */
/* ---------------------------------------------------------------------- */

const FRUITS = ['Apple', 'Banana', 'Cherry', 'Date', 'Elderberry', 'Fig'];

/* ---------------------------------------------------------------------- */
/* NAV_START                                                              */
/* ---------------------------------------------------------------------- */

const NAV: { category: string; items: { id: string; name: string }[] }[] = [
  {
    category: 'Disclosure',
    items: [
      { id: 'accordion', name: 'Accordion' },
      { id: 'collapsible', name: 'Collapsible' },
    ],
  },
  {
    category: 'Data display',
    items: [{ id: 'avatar', name: 'Avatar' }],
  },
  {
    category: 'Buttons & inputs',
    items: [
      { id: 'button', name: 'Button' },
      { id: 'checkbox', name: 'Checkbox' },
      { id: 'checkbox-group', name: 'CheckboxGroup' },
      { id: 'input', name: 'Input' },
      { id: 'number-field', name: 'NumberField' },
      { id: 'otp-field', name: 'OTPField' },
      { id: 'radio', name: 'Radio / RadioGroup' },
      { id: 'slider', name: 'Slider' },
      { id: 'switch', name: 'Switch' },
      { id: 'toggle', name: 'Toggle' },
      { id: 'toggle-group', name: 'ToggleGroup' },
    ],
  },
  {
    category: 'Forms',
    items: [
      { id: 'field', name: 'Field' },
      { id: 'fieldset', name: 'Fieldset' },
      { id: 'form', name: 'Form' },
    ],
  },
  {
    category: 'Selection / pickers',
    items: [
      { id: 'autocomplete', name: 'Autocomplete' },
      { id: 'combobox', name: 'Combobox' },
      { id: 'select', name: 'Select' },
    ],
  },
  {
    category: 'Navigation & menus',
    items: [
      { id: 'menu', name: 'Menu' },
      { id: 'menubar', name: 'Menubar' },
      { id: 'context-menu', name: 'ContextMenu' },
      { id: 'navigation-menu', name: 'NavigationMenu' },
      { id: 'toolbar', name: 'Toolbar' },
    ],
  },
  {
    category: 'Layout',
    items: [
      { id: 'scroll-area', name: 'ScrollArea' },
      { id: 'separator', name: 'Separator' },
      { id: 'tabs', name: 'Tabs' },
    ],
  },
  {
    category: 'Feedback & status',
    items: [
      { id: 'meter', name: 'Meter' },
      { id: 'progress', name: 'Progress' },
      { id: 'toast', name: 'Toast' },
    ],
  },
  {
    category: 'Overlays',
    items: [
      { id: 'alert-dialog', name: 'AlertDialog' },
      { id: 'dialog', name: 'Dialog' },
      { id: 'drawer', name: 'Drawer' },
      { id: 'popover', name: 'Popover' },
      { id: 'preview-card', name: 'PreviewCard' },
      { id: 'tooltip', name: 'Tooltip' },
    ],
  },
];

/* ---------------------------------------------------------------------- */
/* SECTIONS_START                                                         */
/* ---------------------------------------------------------------------- */

/* ---- Disclosure -------------------------------------------------------- */

const AccordionDemo: FunctionComponent = () => {
  const panels = (parts: typeof Accordion) =>
    ['First', 'Second', 'Third'].map((label, index) => (
      <parts.Item
        key={label}
        value={String(index)}
      >
        <parts.Header>
          <parts.Trigger>
            {label}
            <parts.Icon />
          </parts.Trigger>
        </parts.Header>
        <parts.Panel>
          <parts.Content>Panel content for {label}.</parts.Content>
        </parts.Panel>
      </parts.Item>
    ));

  return (
    <ComponentEntry
      id="accordion"
      name="Accordion"
    >
      <Story
        id="accordion-main"
        title="main"
      >
        <Accordion.Root defaultValue={['0']}>
          {panels(Accordion)}
        </Accordion.Root>
      </Story>
      <Story
        id="accordion-open-multiple"
        title="openMultiple"
      >
        <Accordion.Root
          multiple
          defaultValue={['0', '1']}
        >
          {panels(Accordion)}
        </Accordion.Root>
      </Story>
    </ComponentEntry>
  );
};

const CollapsibleDemo: FunctionComponent = () => (
  <ComponentEntry
    id="collapsible"
    name="Collapsible"
  >
    <Story
      id="collapsible-main"
      title="main"
    >
      <Collapsible.Root defaultOpen>
        <Collapsible.Trigger>
          Notifications
          <Collapsible.Icon />
        </Collapsible.Trigger>
        <Collapsible.Panel>
          <Collapsible.Content>
            <div>You are all caught up.</div>
            <div>No new notifications at this time.</div>
          </Collapsible.Content>
        </Collapsible.Panel>
      </Collapsible.Root>
    </Story>
  </ComponentEntry>
);

/* ---- Data display ------------------------------------------------------- */

const AvatarDemo: FunctionComponent = () => {
  const { main } = Avatar.variants;
  return (
    <ComponentEntry
      id="avatar"
      name="Avatar"
    >
      <Story
        id="avatar-main"
        title="main"
      >
        <main.Root>
          <main.Fallback>LT</main.Fallback>
        </main.Root>
        <main.Root>
          <main.Fallback>JD</main.Fallback>
        </main.Root>
      </Story>
    </ComponentEntry>
  );
};

/* ---- Buttons & inputs --------------------------------------------------- */

const ButtonDemo: FunctionComponent = () => {
  const [loading, setLoading] = useState(false);
  return (
    <ComponentEntry
      id="button"
      name="Button"
    >
      <Story
        id="button-main"
        title="main"
      >
        <Button>Add to cart</Button>
      </Story>
      <Story
        id="button-loading-states"
        title="loadingStates"
      >
        <Button
          focusableWhenDisabled
          disabled={loading}
          onClick={() => {
            setLoading(true);
            setTimeout(() => setLoading(false), 1000);
          }}
        >
          {loading ? 'Loading…' : 'Click me'}
        </Button>
      </Story>
    </ComponentEntry>
  );
};

const CheckboxDemo: FunctionComponent = () => {
  const { main } = Checkbox.variants;
  return (
    <ComponentEntry
      id="checkbox"
      name="Checkbox"
    >
      <Story
        id="checkbox-main"
        title="main"
      >
        <main.Label>
          <main.Root defaultChecked>
            <main.Indicator>
              <main.Icon />
            </main.Indicator>
          </main.Root>
          Subscribe to newsletter
        </main.Label>
      </Story>
    </ComponentEntry>
  );
};

const CheckboxGroupDemo: FunctionComponent = () => {
  const CheckboxGroupMain = CheckboxGroup.variants.main;
  const CheckboxGroupParentCheckbox = CheckboxGroup.variants.parentCheckbox;
  const CheckboxGroupNestedParentCheckbox =
    CheckboxGroup.variants.nestedParentCheckbox;

  return (
    <ComponentEntry
      id="checkbox-group"
      name="CheckboxGroup"
    >
      <Story
        id="checkbox-group-main"
        title="main"
      >
        <CheckboxGroupMain defaultValue={['a']}>
          <CheckboxGroupMain.Caption>Notifications</CheckboxGroupMain.Caption>
          {['a', 'b', 'c'].map((value) => (
            <CheckboxGroupMain.Item key={value}>
              <CheckboxGroupMain.CheckboxRoot value={value}>
                <CheckboxGroupMain.CheckboxIndicator>
                  <CheckboxGroupMain.Icon />
                </CheckboxGroupMain.CheckboxIndicator>
              </CheckboxGroupMain.CheckboxRoot>
              Option {value.toUpperCase()}
            </CheckboxGroupMain.Item>
          ))}
        </CheckboxGroupMain>
      </Story>
      <Story
        id="checkbox-group-parent-checkbox"
        title="parentCheckbox"
      >
        <CheckboxGroupParentCheckbox
          allValues={['a', 'b']}
          defaultValue={['a']}
        >
          <CheckboxGroupParentCheckbox.Item>
            <CheckboxGroupParentCheckbox.CheckboxRoot parent>
              <CheckboxGroupParentCheckbox.CheckboxIndicator>
                <IndeterminateIcon />
              </CheckboxGroupParentCheckbox.CheckboxIndicator>
            </CheckboxGroupParentCheckbox.CheckboxRoot>
            Select all
          </CheckboxGroupParentCheckbox.Item>
          {['a', 'b'].map((value) => (
            <CheckboxGroupParentCheckbox.Item key={value}>
              <CheckboxGroupParentCheckbox.CheckboxRoot value={value}>
                <CheckboxGroupParentCheckbox.CheckboxIndicator>
                  <CheckboxGroupParentCheckbox.Icon />
                </CheckboxGroupParentCheckbox.CheckboxIndicator>
              </CheckboxGroupParentCheckbox.CheckboxRoot>
              Option {value.toUpperCase()}
            </CheckboxGroupParentCheckbox.Item>
          ))}
        </CheckboxGroupParentCheckbox>
      </Story>
      <Story
        id="checkbox-group-nested-parent-checkbox"
        title="nestedParentCheckbox"
      >
        <CheckboxGroupNestedParentCheckbox
          allValues={['a', 'b', 'c']}
          defaultValue={['a']}
        >
          <CheckboxGroupNestedParentCheckbox.Item>
            <CheckboxGroupNestedParentCheckbox.CheckboxRoot parent>
              <CheckboxGroupNestedParentCheckbox.CheckboxIndicator>
                <IndeterminateIcon />
              </CheckboxGroupNestedParentCheckbox.CheckboxIndicator>
            </CheckboxGroupNestedParentCheckbox.CheckboxRoot>
            Select all
          </CheckboxGroupNestedParentCheckbox.Item>
          {['a', 'b'].map((value) => (
            <CheckboxGroupNestedParentCheckbox.Item key={value}>
              <CheckboxGroupNestedParentCheckbox.CheckboxRoot value={value}>
                <CheckboxGroupNestedParentCheckbox.CheckboxIndicator>
                  <CheckboxGroupNestedParentCheckbox.Icon />
                </CheckboxGroupNestedParentCheckbox.CheckboxIndicator>
              </CheckboxGroupNestedParentCheckbox.CheckboxRoot>
              Option {value.toUpperCase()}
            </CheckboxGroupNestedParentCheckbox.Item>
          ))}
        </CheckboxGroupNestedParentCheckbox>
      </Story>
    </ComponentEntry>
  );
};

const InputDemo: FunctionComponent = () => (
  <ComponentEntry
    id="input"
    name="Input"
  >
    <Story
      id="input-main"
      title="main"
    >
      <Input.Label>
        Name
        <Input placeholder="Jane Doe" />
      </Input.Label>
    </Story>
  </ComponentEntry>
);

const NumberFieldDemo: FunctionComponent = () => {
  const { main } = NumberField.variants;
  return (
    <ComponentEntry
      id="number-field"
      name="NumberField"
    >
      <Story
        id="number-field-main"
        title="main"
      >
        <main.Root defaultValue={10}>
          <main.ScrubArea>
            <main.Label>Quantity</main.Label>
            <main.ScrubAreaCursor>
              <main.CursorGrowIcon />
            </main.ScrubAreaCursor>
          </main.ScrubArea>
          <main.Group>
            <main.Decrement>
              <main.MinusIcon />
            </main.Decrement>
            <main.Input />
            <main.Increment>
              <main.PlusIcon />
            </main.Increment>
          </main.Group>
        </main.Root>
      </Story>
    </ComponentEntry>
  );
};

const OTPFieldDemo: FunctionComponent = () => {
  const {
    main,
    groupedLayouts,
    placeholderHints,
    maskedEntry,
    alphanumericVerificationCodes,
    customNormalization,
  } = OTPField.variants;
  const slots = [0, 1, 2, 3, 4, 5];

  return (
    <ComponentEntry
      id="otp-field"
      name="OTPField"
    >
      <Story
        id="otp-field-main"
        title="main"
      >
        <main.Field>
          <main.Label>One-time code</main.Label>
          <main.Root length={6}>
            {slots.map((slot) => (
              <main.Input key={slot} />
            ))}
          </main.Root>
          <main.Description>
            Enter the 6-digit code sent to your device.
          </main.Description>
        </main.Field>
      </Story>
      <Story
        id="otp-field-grouped-layouts"
        title="groupedLayouts"
      >
        <groupedLayouts.Field>
          <groupedLayouts.Label>Code</groupedLayouts.Label>
          <groupedLayouts.Root length={6}>
            <groupedLayouts.Group>
              {slots.slice(0, 3).map((slot) => (
                <groupedLayouts.Input key={slot} />
              ))}
            </groupedLayouts.Group>
            <groupedLayouts.Separator />
            <groupedLayouts.Group>
              {slots.slice(3, 6).map((slot) => (
                <groupedLayouts.Input key={slot} />
              ))}
            </groupedLayouts.Group>
          </groupedLayouts.Root>
        </groupedLayouts.Field>
      </Story>
      <Story
        id="otp-field-placeholder-hints"
        title="placeholderHints"
      >
        <placeholderHints.Field>
          <placeholderHints.Label>Code</placeholderHints.Label>
          <placeholderHints.Root length={6}>
            {slots.map((slot) => (
              <placeholderHints.Input
                key={slot}
                placeholder="•"
              />
            ))}
          </placeholderHints.Root>
        </placeholderHints.Field>
      </Story>
      <Story
        id="otp-field-masked-entry"
        title="maskedEntry"
      >
        <maskedEntry.Field>
          <maskedEntry.Label>Code</maskedEntry.Label>
          <maskedEntry.Root
            mask
            length={6}
          >
            {slots.map((slot) => (
              <maskedEntry.Input key={slot} />
            ))}
          </maskedEntry.Root>
          <maskedEntry.Description>
            Pass <maskedEntry.Code>mask</maskedEntry.Code> to obscure the code
            on shared screens.
          </maskedEntry.Description>
        </maskedEntry.Field>
      </Story>
      <Story
        id="otp-field-alphanumeric-verification-codes"
        title="alphanumericVerificationCodes"
      >
        <alphanumericVerificationCodes.Field>
          <alphanumericVerificationCodes.Label>
            Code
          </alphanumericVerificationCodes.Label>
          <alphanumericVerificationCodes.Root
            length={6}
            validationType="alphanumeric"
          >
            {slots.map((slot) => (
              <alphanumericVerificationCodes.Input key={slot} />
            ))}
          </alphanumericVerificationCodes.Root>
        </alphanumericVerificationCodes.Field>
      </Story>
      <Story
        id="otp-field-custom-normalization"
        title="customNormalization"
      >
        <customNormalization.Field>
          <customNormalization.Label>Code</customNormalization.Label>
          <customNormalization.Root length={6}>
            {slots.map((slot) => (
              <customNormalization.Input key={slot} />
            ))}
          </customNormalization.Root>
        </customNormalization.Field>
      </Story>
    </ComponentEntry>
  );
};

const RadioDemo: FunctionComponent = () => {
  const { main } = Radio.variants;
  const RadioGroupMain = RadioGroup.variants.main;

  return (
    <ComponentEntry
      id="radio"
      name="Radio / RadioGroup"
    >
      <Story
        id="radio-group-main"
        title="RadioGroup groupMain + Radio main"
      >
        <RadioGroupMain defaultValue="a">
          <RadioGroupMain.Caption>Notifications</RadioGroupMain.Caption>
          {['a', 'b', 'c'].map((value) => (
            <RadioGroupMain.Item key={value}>
              <main.Root value={value}>
                <main.Indicator />
              </main.Root>
              Option {value.toUpperCase()}
            </RadioGroupMain.Item>
          ))}
        </RadioGroupMain>
      </Story>
    </ComponentEntry>
  );
};

const SliderDemo: FunctionComponent = () => {
  const { main, rangeSlider, thumbAlignment, vertical } = Slider.variants;
  return (
    <ComponentEntry
      id="slider"
      name="Slider"
    >
      <Story
        id="slider-main"
        title="main"
      >
        <main.Root defaultValue={25}>
          <main.Value />
          <main.Control>
            <main.Track>
              <main.Indicator />
              <main.Thumb />
            </main.Track>
          </main.Control>
        </main.Root>
      </Story>
      <Story
        id="slider-range-slider"
        title="rangeSlider"
      >
        <rangeSlider.Root defaultValue={[25, 75]}>
          <rangeSlider.Value />
          <rangeSlider.Control>
            <rangeSlider.Track>
              <rangeSlider.Indicator />
              <rangeSlider.Thumb />
              <rangeSlider.Thumb />
            </rangeSlider.Track>
          </rangeSlider.Control>
        </rangeSlider.Root>
      </Story>
      <Story
        id="slider-thumb-alignment"
        title="thumbAlignment"
      >
        <thumbAlignment.Root
          defaultValue={25}
          thumbAlignment="edge"
        >
          <thumbAlignment.Control>
            <thumbAlignment.Track>
              <thumbAlignment.Indicator />
              <thumbAlignment.Thumb />
            </thumbAlignment.Track>
          </thumbAlignment.Control>
        </thumbAlignment.Root>
      </Story>
      <Story
        id="slider-vertical"
        title="vertical"
      >
        <vertical.Root
          defaultValue={25}
          orientation="vertical"
        >
          <vertical.Control>
            <vertical.Track>
              <vertical.Indicator />
              <vertical.Thumb />
            </vertical.Track>
          </vertical.Control>
        </vertical.Root>
      </Story>
    </ComponentEntry>
  );
};

const SwitchDemo: FunctionComponent = () => {
  const { main } = Switch.variants;
  return (
    <ComponentEntry
      id="switch"
      name="Switch"
    >
      <Story
        id="switch-main"
        title="main"
      >
        <main.Label>
          <main.Root defaultChecked>
            <main.Thumb />
          </main.Root>
          Notifications
        </main.Label>
      </Story>
    </ComponentEntry>
  );
};

const ToggleDemo: FunctionComponent = () => {
  const ToggleMain = Toggle.variants.main;
  const [pressed, setPressed] = useState(false);
  return (
    <ComponentEntry
      id="toggle"
      name="Toggle"
    >
      <Story
        id="toggle-main"
        title="main"
      >
        <ToggleMain
          aria-label="Favorite"
          pressed={pressed}
          onPressedChange={setPressed}
        >
          {pressed ? <HeartFilledIcon /> : <HeartOutlineIcon />}
        </ToggleMain>
      </Story>
    </ComponentEntry>
  );
};

const ToggleGroupDemo: FunctionComponent = () => {
  const ToggleGroupMain = ToggleGroup.variants.main;
  const ToggleGroupMultiple = ToggleGroup.variants.multiple;

  return (
    <ComponentEntry
      id="toggle-group"
      name="ToggleGroup"
    >
      <Story
        id="toggle-group-main"
        title="main"
      >
        <ToggleGroupMain
          aria-label="Text alignment"
          defaultValue={['left']}
        >
          <ToggleGroupButton
            aria-label="Align left"
            value="left"
          >
            <AlignLeftIcon />
          </ToggleGroupButton>
          <ToggleGroupButton
            aria-label="Align center"
            value="center"
          >
            <AlignCenterIcon />
          </ToggleGroupButton>
          <ToggleGroupButton
            aria-label="Align right"
            value="right"
          >
            <AlignRightIcon />
          </ToggleGroupButton>
        </ToggleGroupMain>
      </Story>
      <Story
        id="toggle-group-multiple"
        title="multiple"
      >
        <ToggleGroupMultiple
          aria-label="Text formatting"
          defaultValue={['bold']}
        >
          <ToggleGroupMultipleButton
            aria-label="Bold"
            value="bold"
          >
            <ToggleGroupBoldIcon />
          </ToggleGroupMultipleButton>
          <ToggleGroupMultipleButton
            aria-label="Italic"
            value="italic"
          >
            <ToggleGroupItalicIcon />
          </ToggleGroupMultipleButton>
          <ToggleGroupMultipleButton
            aria-label="Underline"
            value="underline"
          >
            <ToggleGroupUnderlineIcon />
          </ToggleGroupMultipleButton>
        </ToggleGroupMultiple>
      </Story>
    </ComponentEntry>
  );
};

/* ---- Forms --------------------------------------------------------------- */

const FieldDemo: FunctionComponent = () => {
  const { main } = Field.variants;
  return (
    <ComponentEntry
      id="field"
      name="Field"
    >
      <Story
        id="field-main"
        title="main"
      >
        <main.Root>
          <main.Label>Email</main.Label>
          <main.Control placeholder="you@example.com" />
          <main.Description>
            We&rsquo;ll never share your email.
          </main.Description>
        </main.Root>
      </Story>
    </ComponentEntry>
  );
};

const FieldsetDemo: FunctionComponent = () => {
  const { main } = Fieldset.variants;
  return (
    <ComponentEntry
      id="fieldset"
      name="Fieldset"
    >
      <Story
        id="fieldset-main"
        title="main"
      >
        <main.Root>
          <main.Legend>Shipping address</main.Legend>
          <main.FieldRoot>
            <main.FieldLabel>Street</main.FieldLabel>
            <main.Input />
          </main.FieldRoot>
          <main.FieldRoot>
            <main.FieldLabel>City</main.FieldLabel>
            <main.Input />
          </main.FieldRoot>
        </main.Root>
      </Story>
    </ComponentEntry>
  );
};

const FormDemo: FunctionComponent = () => {
  const FormMain = Form.variants.main;
  const FormUsingWithZod = Form.variants.usingWithZod;
  const FormSubmitWithAServerFunction = Form.variants.submitWithAServerFunction;

  return (
    <ComponentEntry
      id="form"
      name="Form"
    >
      <Story
        id="form-main"
        title="main"
      >
        <FormMain>
          <FormFieldRoot name="name">
            <FormFieldLabel>Name</FormFieldLabel>
            <FormInput required />
            <FormFieldError />
          </FormFieldRoot>
          <FormButton type="submit">Submit</FormButton>
        </FormMain>
      </Story>
      <Story
        id="form-using-with-zod"
        title="usingWithZod"
      >
        <FormUsingWithZod>
          <FormFieldRoot name="email">
            <FormFieldLabel>Email</FormFieldLabel>
            <FormInput required />
            <FormFieldError />
          </FormFieldRoot>
          <FormFieldRoot name="age">
            <FormFieldLabel>Age</FormFieldLabel>
            <FormInput required />
            <FormFieldError />
          </FormFieldRoot>
          <FormButton type="submit">Submit</FormButton>
        </FormUsingWithZod>
      </Story>
      <Story
        id="form-submit-with-a-server-function"
        title="submitWithAServerFunction"
      >
        <FormSubmitWithAServerFunction>
          <FormFieldRoot name="name">
            <FormFieldLabel>Name</FormFieldLabel>
            <FormInput required />
            <FormFieldError />
          </FormFieldRoot>
          <FormButton type="submit">Submit</FormButton>
        </FormSubmitWithAServerFunction>
      </Story>
    </ComponentEntry>
  );
};

/* ---- Selection / pickers ------------------------------------------------- */

const SHIPPING_METHODS = [
  { value: 'standard', label: 'Standard', description: '5-7 business days' },
  { value: 'express', label: 'Express', description: '2-3 business days' },
  { value: 'overnight', label: 'Overnight', description: 'Next business day' },
];

const SelectDemo: FunctionComponent = () => {
  const { main, grouped, multipleSelection, objectValues } = Select.variants;
  return (
    <ComponentEntry
      id="select"
      name="Select"
    >
      <Story
        id="select-main"
        title="main"
      >
        <main.Root defaultValue="apple">
          <main.Trigger>
            <main.Value placeholder="Select a fruit" />
            <main.CaretUpDownIcon />
          </main.Trigger>
          <main.Portal>
            <main.Positioner>
              <main.Popup>
                <main.List>
                  {FRUITS.map((fruit) => (
                    <main.Item
                      key={fruit}
                      value={fruit.toLowerCase()}
                    >
                      <main.ItemIndicator>
                        <main.CheckIcon />
                      </main.ItemIndicator>
                      <main.ItemText>{fruit}</main.ItemText>
                    </main.Item>
                  ))}
                </main.List>
              </main.Popup>
            </main.Positioner>
          </main.Portal>
        </main.Root>
      </Story>
      <Story
        id="select-grouped"
        title="grouped"
      >
        <grouped.Root defaultValue="orange">
          <grouped.FieldRoot>
            <grouped.FieldLabel>Fruit</grouped.FieldLabel>
            <grouped.Trigger>
              <grouped.Value placeholder="Select a fruit" />
              <grouped.CaretUpDownIcon />
            </grouped.Trigger>
          </grouped.FieldRoot>
          <grouped.Portal>
            <grouped.Positioner>
              <grouped.Popup>
                <grouped.List>
                  <grouped.Group>
                    <grouped.GroupLabel>Citrus</grouped.GroupLabel>
                    {['Orange', 'Lemon'].map((fruit) => (
                      <grouped.Item
                        key={fruit}
                        value={fruit.toLowerCase()}
                      >
                        <grouped.ItemIndicator>
                          <grouped.CheckIcon />
                        </grouped.ItemIndicator>
                        <grouped.ItemText>{fruit}</grouped.ItemText>
                      </grouped.Item>
                    ))}
                  </grouped.Group>
                  <grouped.Separator />
                  <grouped.Group>
                    <grouped.GroupLabel>Berries</grouped.GroupLabel>
                    {['Strawberry', 'Blueberry'].map((fruit) => (
                      <grouped.Item
                        key={fruit}
                        value={fruit.toLowerCase()}
                      >
                        <grouped.ItemIndicator>
                          <grouped.CheckIcon />
                        </grouped.ItemIndicator>
                        <grouped.ItemText>{fruit}</grouped.ItemText>
                      </grouped.Item>
                    ))}
                  </grouped.Group>
                </grouped.List>
              </grouped.Popup>
            </grouped.Positioner>
          </grouped.Portal>
        </grouped.Root>
      </Story>
      <Story
        id="select-multiple-selection"
        title="multipleSelection"
      >
        <multipleSelection.Root
          multiple
          defaultValue={['apple', 'banana']}
        >
          <multipleSelection.Trigger>
            <multipleSelection.Value placeholder="Select fruits" />
            <multipleSelection.CaretUpDownIcon />
          </multipleSelection.Trigger>
          <multipleSelection.Portal>
            <multipleSelection.Positioner>
              <multipleSelection.Popup>
                {FRUITS.map((fruit) => (
                  <multipleSelection.Item
                    key={fruit}
                    value={fruit.toLowerCase()}
                  >
                    <multipleSelection.ItemIndicator>
                      <multipleSelection.CheckIcon />
                    </multipleSelection.ItemIndicator>
                    <multipleSelection.ItemText>
                      {fruit}
                    </multipleSelection.ItemText>
                  </multipleSelection.Item>
                ))}
              </multipleSelection.Popup>
            </multipleSelection.Positioner>
          </multipleSelection.Portal>
        </multipleSelection.Root>
      </Story>
      <Story
        id="select-object-values"
        title="objectValues"
      >
        <objectValues.Root defaultValue={SHIPPING_METHODS[0]}>
          <objectValues.Trigger>
            <objectValues.Value>
              {(value: (typeof SHIPPING_METHODS)[number] | null) => (
                <objectValues.ValueText>
                  <objectValues.ValuePrimary>
                    {value ? value.label : 'Select a method'}
                  </objectValues.ValuePrimary>
                  {value ? (
                    <objectValues.ValueSecondary>
                      {value.description}
                    </objectValues.ValueSecondary>
                  ) : null}
                </objectValues.ValueText>
              )}
            </objectValues.Value>
            <objectValues.CaretUpDownIcon />
          </objectValues.Trigger>
          <objectValues.Portal>
            <objectValues.Positioner>
              <objectValues.Popup>
                <objectValues.List>
                  {SHIPPING_METHODS.map((option) => (
                    <objectValues.Item
                      key={option.value}
                      value={option}
                    >
                      <objectValues.ItemIndicator>
                        <objectValues.CheckIcon />
                      </objectValues.ItemIndicator>
                      <objectValues.ItemText>
                        <objectValues.ItemLabel>
                          {option.label}
                        </objectValues.ItemLabel>
                        <objectValues.ItemDescription>
                          {option.description}
                        </objectValues.ItemDescription>
                      </objectValues.ItemText>
                    </objectValues.Item>
                  ))}
                </objectValues.List>
              </objectValues.Popup>
            </objectValues.Positioner>
          </objectValues.Portal>
        </objectValues.Root>
      </Story>
    </ComponentEntry>
  );
};

const ComboboxDemo: FunctionComponent = () => {
  const {
    main,
    grouped,
    multipleSelect,
    inputInsidePopup,
    asyncSearchSingle,
    asyncSearchMultiple,
    creatable,
    virtualized,
  } = Combobox.variants;

  return (
    <ComponentEntry
      id="combobox"
      name="Combobox"
    >
      <Story
        id="combobox-main"
        title="main"
      >
        <main.Root>
          <main.Label>
            Fruit
            <main.InputGroup>
              <main.Input placeholder="Search fruits" />
              <main.ActionButtons>
                <main.Clear>
                  <main.XIcon />
                </main.Clear>
                <main.Trigger>
                  <main.CaretDownIcon />
                </main.Trigger>
              </main.ActionButtons>
            </main.InputGroup>
          </main.Label>
          <main.Portal>
            <main.Positioner>
              <main.Popup>
                <main.List>
                  {FRUITS.map((fruit) => (
                    <main.Item
                      key={fruit}
                      value={fruit}
                    >
                      {fruit}
                    </main.Item>
                  ))}
                </main.List>
              </main.Popup>
            </main.Positioner>
          </main.Portal>
        </main.Root>
      </Story>
      <Story
        id="combobox-grouped"
        title="grouped"
      >
        <grouped.Root>
          <grouped.Label>
            Fruit
            <grouped.InputGroup>
              <grouped.Input placeholder="Search fruits" />
            </grouped.InputGroup>
          </grouped.Label>
          <grouped.Portal>
            <grouped.Positioner>
              <grouped.Popup>
                <grouped.List>
                  <grouped.Group>
                    <grouped.GroupLabel>Citrus</grouped.GroupLabel>
                    {['Orange', 'Lemon'].map((fruit) => (
                      <grouped.Item
                        key={fruit}
                        value={fruit}
                      >
                        {fruit}
                      </grouped.Item>
                    ))}
                  </grouped.Group>
                  <grouped.Group>
                    <grouped.GroupLabel>Berries</grouped.GroupLabel>
                    {['Strawberry', 'Blueberry'].map((fruit) => (
                      <grouped.Item
                        key={fruit}
                        value={fruit}
                      >
                        {fruit}
                      </grouped.Item>
                    ))}
                  </grouped.Group>
                </grouped.List>
              </grouped.Popup>
            </grouped.Positioner>
          </grouped.Portal>
        </grouped.Root>
      </Story>
      <Story
        id="combobox-multiple-select"
        title="multipleSelect"
      >
        <multipleSelect.Root>
          <multipleSelect.Container>
            <multipleSelect.Label>
              Fruits
              <multipleSelect.InputGroup>
                <multipleSelect.Chips>
                  <multipleSelect.Chip>
                    Apple
                    <multipleSelect.ChipRemove>×</multipleSelect.ChipRemove>
                  </multipleSelect.Chip>
                  <multipleSelect.Input placeholder="Add fruit" />
                </multipleSelect.Chips>
              </multipleSelect.InputGroup>
            </multipleSelect.Label>
            <multipleSelect.Portal>
              <multipleSelect.Positioner>
                <multipleSelect.Popup>
                  {FRUITS.map((fruit) => (
                    <multipleSelect.Item
                      key={fruit}
                      value={fruit}
                    >
                      {fruit}
                    </multipleSelect.Item>
                  ))}
                </multipleSelect.Popup>
              </multipleSelect.Positioner>
            </multipleSelect.Portal>
          </multipleSelect.Container>
        </multipleSelect.Root>
      </Story>
      <Story
        id="combobox-input-inside-popup"
        title="inputInsidePopup"
      >
        <inputInsidePopup.Root>
          <inputInsidePopup.Field>
            <inputInsidePopup.Label>Fruit</inputInsidePopup.Label>
            <inputInsidePopup.Trigger>
              <inputInsidePopup.TriggerIcon />
            </inputInsidePopup.Trigger>
          </inputInsidePopup.Field>
          <inputInsidePopup.Portal>
            <inputInsidePopup.Positioner>
              <inputInsidePopup.Popup>
                <inputInsidePopup.Input placeholder="Search fruits" />
                <inputInsidePopup.Viewport>
                  <inputInsidePopup.List>
                    {FRUITS.map((fruit) => (
                      <inputInsidePopup.Item
                        key={fruit}
                        value={fruit}
                      >
                        {fruit}
                      </inputInsidePopup.Item>
                    ))}
                  </inputInsidePopup.List>
                </inputInsidePopup.Viewport>
              </inputInsidePopup.Popup>
            </inputInsidePopup.Positioner>
          </inputInsidePopup.Portal>
        </inputInsidePopup.Root>
      </Story>
      <Story
        id="combobox-async-search-single"
        title="asyncSearchSingle"
      >
        <asyncSearchSingle.Root>
          <asyncSearchSingle.Label>
            Contact
            <asyncSearchSingle.InputGroup>
              <asyncSearchSingle.Input placeholder="Search contacts" />
            </asyncSearchSingle.InputGroup>
          </asyncSearchSingle.Label>
          <asyncSearchSingle.Portal>
            <asyncSearchSingle.Positioner>
              <asyncSearchSingle.Popup>
                <asyncSearchSingle.Viewport>
                  {['Ada Lovelace', 'Grace Hopper', 'Alan Turing'].map(
                    (name) => (
                      <asyncSearchSingle.Item
                        key={name}
                        value={name}
                      >
                        <asyncSearchSingle.ItemText>
                          <asyncSearchSingle.ItemTitle>
                            {name}
                          </asyncSearchSingle.ItemTitle>
                          <asyncSearchSingle.ItemSubtitle>
                            <asyncSearchSingle.ItemEmail>
                              {name.toLowerCase().replace(' ', '.')}
                              @example.com
                            </asyncSearchSingle.ItemEmail>
                          </asyncSearchSingle.ItemSubtitle>
                        </asyncSearchSingle.ItemText>
                      </asyncSearchSingle.Item>
                    ),
                  )}
                </asyncSearchSingle.Viewport>
              </asyncSearchSingle.Popup>
            </asyncSearchSingle.Positioner>
          </asyncSearchSingle.Portal>
        </asyncSearchSingle.Root>
      </Story>
      <Story
        id="combobox-async-search-multiple"
        title="asyncSearchMultiple"
      >
        <asyncSearchMultiple.Root>
          <asyncSearchMultiple.Label>
            Contacts
            <asyncSearchMultiple.InputGroup>
              <asyncSearchMultiple.Chips>
                <asyncSearchMultiple.Input placeholder="Search contacts" />
              </asyncSearchMultiple.Chips>
            </asyncSearchMultiple.InputGroup>
          </asyncSearchMultiple.Label>
          <asyncSearchMultiple.Portal>
            <asyncSearchMultiple.Positioner>
              <asyncSearchMultiple.Popup>
                {['Ada Lovelace', 'Grace Hopper', 'Alan Turing'].map((name) => (
                  <asyncSearchMultiple.Item
                    key={name}
                    value={name}
                  >
                    <asyncSearchMultiple.ItemText>
                      <asyncSearchMultiple.ItemTitle>
                        {name}
                      </asyncSearchMultiple.ItemTitle>
                    </asyncSearchMultiple.ItemText>
                  </asyncSearchMultiple.Item>
                ))}
              </asyncSearchMultiple.Popup>
            </asyncSearchMultiple.Positioner>
          </asyncSearchMultiple.Portal>
        </asyncSearchMultiple.Root>
      </Story>
      <Story
        id="combobox-creatable"
        title="creatable"
      >
        <creatable.Root>
          <creatable.Container>
            <creatable.Label>
              Labels
              <creatable.InputGroup>
                <creatable.Chips>
                  <creatable.Chip>
                    urgent
                    <creatable.ChipRemove>×</creatable.ChipRemove>
                  </creatable.Chip>
                  <creatable.Input placeholder="Add label" />
                </creatable.Chips>
              </creatable.InputGroup>
            </creatable.Label>
            <creatable.Portal>
              <creatable.Positioner>
                <creatable.Popup>
                  {['bug', 'feature', 'question'].map((label) => (
                    <creatable.Item
                      key={label}
                      value={label}
                    >
                      {label}
                    </creatable.Item>
                  ))}
                  <creatable.CreateButton>
                    <creatable.CreateText>
                      Create &ldquo;new&rdquo;
                    </creatable.CreateText>
                  </creatable.CreateButton>
                </creatable.Popup>
              </creatable.Positioner>
            </creatable.Portal>
          </creatable.Container>
        </creatable.Root>
      </Story>
      <Story
        id="combobox-virtualized"
        title="virtualized"
      >
        <virtualized.Root>
          <virtualized.Label>
            Item
            <virtualized.Input placeholder="Search 10,000 items" />
          </virtualized.Label>
          <virtualized.Portal>
            <virtualized.Positioner>
              <virtualized.Popup>
                <virtualized.Scroller>
                  <virtualized.VirtualizedPlaceholder>
                    <virtualized.List>
                      {FRUITS.map((fruit) => (
                        <virtualized.Item
                          key={fruit}
                          value={fruit}
                        >
                          {fruit}
                        </virtualized.Item>
                      ))}
                    </virtualized.List>
                  </virtualized.VirtualizedPlaceholder>
                </virtualized.Scroller>
              </virtualized.Popup>
            </virtualized.Positioner>
          </virtualized.Portal>
        </virtualized.Root>
      </Story>
    </ComponentEntry>
  );
};

const AutocompleteDemo: FunctionComponent = () => {
  const {
    main,
    grouped,
    autoHighlight,
    inlineAutocomplete,
    limitResults,
    fuzzyMatching,
    gridLayout,
    commandPalette,
    asyncSearch,
    virtualized,
  } = Autocomplete.variants;

  return (
    <ComponentEntry
      id="autocomplete"
      name="Autocomplete"
    >
      <Story
        id="autocomplete-main"
        title="main"
      >
        <main.Root>
          <main.Label>
            Fruit
            <main.Input placeholder="Search fruits" />
          </main.Label>
          <main.Portal>
            <main.Positioner>
              <main.Popup>
                <main.List>
                  {FRUITS.map((fruit) => (
                    <main.Item
                      key={fruit}
                      value={fruit}
                    >
                      {fruit}
                    </main.Item>
                  ))}
                </main.List>
              </main.Popup>
            </main.Positioner>
          </main.Portal>
        </main.Root>
      </Story>
      <Story
        id="autocomplete-grouped"
        title="grouped"
      >
        <grouped.Root>
          <grouped.Label>
            Fruit
            <grouped.Input placeholder="Search fruits" />
          </grouped.Label>
          <grouped.Portal>
            <grouped.Positioner>
              <grouped.Popup>
                <grouped.List>
                  <grouped.Group>
                    <grouped.GroupLabel>Citrus</grouped.GroupLabel>
                    {['Orange', 'Lemon'].map((fruit) => (
                      <grouped.Item
                        key={fruit}
                        value={fruit}
                      >
                        {fruit}
                      </grouped.Item>
                    ))}
                  </grouped.Group>
                </grouped.List>
              </grouped.Popup>
            </grouped.Positioner>
          </grouped.Portal>
        </grouped.Root>
      </Story>
      <Story
        id="autocomplete-auto-highlight"
        title="autoHighlight"
      >
        <autoHighlight.Root autoHighlight>
          <autoHighlight.Label>
            Fruit
            <autoHighlight.Input placeholder="Search fruits" />
          </autoHighlight.Label>
          <autoHighlight.Portal>
            <autoHighlight.Positioner>
              <autoHighlight.Popup>
                <autoHighlight.List>
                  {FRUITS.map((fruit) => (
                    <autoHighlight.Item
                      key={fruit}
                      value={fruit}
                    >
                      {fruit}
                    </autoHighlight.Item>
                  ))}
                </autoHighlight.List>
              </autoHighlight.Popup>
            </autoHighlight.Positioner>
          </autoHighlight.Portal>
        </autoHighlight.Root>
      </Story>
      <Story
        id="autocomplete-inline-autocomplete"
        title="inlineAutocomplete"
      >
        <inlineAutocomplete.Root mode="both">
          <inlineAutocomplete.Container>
            <inlineAutocomplete.Label>
              Fruit
              <inlineAutocomplete.Input placeholder="Search fruits" />
            </inlineAutocomplete.Label>
            <inlineAutocomplete.Portal>
              <inlineAutocomplete.Positioner>
                <inlineAutocomplete.Popup>
                  <inlineAutocomplete.List>
                    {FRUITS.map((fruit) => (
                      <inlineAutocomplete.Item
                        key={fruit}
                        value={fruit}
                      >
                        {fruit}
                      </inlineAutocomplete.Item>
                    ))}
                  </inlineAutocomplete.List>
                </inlineAutocomplete.Popup>
              </inlineAutocomplete.Positioner>
            </inlineAutocomplete.Portal>
          </inlineAutocomplete.Container>
        </inlineAutocomplete.Root>
      </Story>
      <Story
        id="autocomplete-limit-results"
        title="limitResults"
      >
        <limitResults.Root>
          <limitResults.Label>
            Fruit
            <limitResults.Input placeholder="Search fruits" />
          </limitResults.Label>
          <limitResults.Portal>
            <limitResults.Positioner>
              <limitResults.Popup>
                {FRUITS.slice(0, 3).map((fruit) => (
                  <limitResults.Item
                    key={fruit}
                    value={fruit}
                  >
                    {fruit}
                  </limitResults.Item>
                ))}
                <limitResults.Status>
                  {FRUITS.length - 3} more results
                </limitResults.Status>
              </limitResults.Popup>
            </limitResults.Positioner>
          </limitResults.Portal>
        </limitResults.Root>
      </Story>
      <Story
        id="autocomplete-fuzzy-matching"
        title="fuzzyMatching"
      >
        <fuzzyMatching.Root>
          <fuzzyMatching.Label>
            Docs
            <fuzzyMatching.Input placeholder="Search documentation" />
          </fuzzyMatching.Label>
          <fuzzyMatching.Portal>
            <fuzzyMatching.Positioner>
              <fuzzyMatching.Popup>
                <fuzzyMatching.List>
                  {['Accordion', 'Autocomplete', 'Avatar'].map((title) => (
                    <fuzzyMatching.Item
                      key={title}
                      value={title}
                    >
                      <fuzzyMatching.ItemContent>
                        <fuzzyMatching.ItemHeader>
                          <fuzzyMatching.ItemTitle>
                            {title}
                          </fuzzyMatching.ItemTitle>
                        </fuzzyMatching.ItemHeader>
                        <fuzzyMatching.ItemDescription>
                          Component documentation
                        </fuzzyMatching.ItemDescription>
                      </fuzzyMatching.ItemContent>
                    </fuzzyMatching.Item>
                  ))}
                </fuzzyMatching.List>
              </fuzzyMatching.Popup>
            </fuzzyMatching.Positioner>
          </fuzzyMatching.Portal>
        </fuzzyMatching.Root>
      </Story>
      <Story
        id="autocomplete-grid-layout"
        title="gridLayout"
      >
        <gridLayout.Root>
          <gridLayout.Container>
            <gridLayout.InputGroup>
              <gridLayout.TextInput placeholder="iMessage" />
              <gridLayout.EmojiButton aria-label="Emoji">
                🙂
              </gridLayout.EmojiButton>
            </gridLayout.InputGroup>
            <gridLayout.Portal>
              <gridLayout.Positioner>
                <gridLayout.Popup>
                  <gridLayout.Input placeholder="Search emoji" />
                  <gridLayout.Viewport>
                    <gridLayout.List>
                      <gridLayout.Group>
                        <gridLayout.Grid>
                          <gridLayout.Row>
                            {['🙂', '😂', '😍', '👍', '🎉'].map((emoji) => (
                              <gridLayout.Item
                                key={emoji}
                                value={emoji}
                              >
                                <gridLayout.Emoji>{emoji}</gridLayout.Emoji>
                              </gridLayout.Item>
                            ))}
                          </gridLayout.Row>
                        </gridLayout.Grid>
                      </gridLayout.Group>
                    </gridLayout.List>
                  </gridLayout.Viewport>
                </gridLayout.Popup>
              </gridLayout.Positioner>
            </gridLayout.Portal>
          </gridLayout.Container>
        </gridLayout.Root>
      </Story>
      <Story
        id="autocomplete-command-palette"
        title="commandPalette"
      >
        <Dialog.Root>
          <commandPalette.Button>Search…</commandPalette.Button>
          <Dialog.Portal>
            <commandPalette.Backdrop />
            <commandPalette.Viewport>
              <commandPalette.Popup>
                <Dialog.Title render={<commandPalette.VisuallyHidden />}>
                  Command palette
                </Dialog.Title>
                <commandPalette.DialogClose />
                <Autocomplete.Root
                  inline
                  items={FRUITS}
                >
                  <commandPalette.Input placeholder="Type a command" />
                  <commandPalette.List>
                    {FRUITS.map((fruit) => (
                      <commandPalette.Item
                        key={fruit}
                        value={fruit}
                      >
                        <commandPalette.ItemLabel>
                          {fruit}
                        </commandPalette.ItemLabel>
                      </commandPalette.Item>
                    ))}
                  </commandPalette.List>
                </Autocomplete.Root>
              </commandPalette.Popup>
            </commandPalette.Viewport>
          </Dialog.Portal>
        </Dialog.Root>
      </Story>
      <Story
        id="autocomplete-async-search"
        title="asyncSearch"
      >
        <asyncSearch.Root>
          <asyncSearch.Label>
            Movie
            <asyncSearch.Input placeholder="Search movies" />
          </asyncSearch.Label>
          <asyncSearch.Portal>
            <asyncSearch.Positioner>
              <asyncSearch.Popup>
                <asyncSearch.Viewport>
                  {[
                    ['Blade Runner', '1982'],
                    ['The Matrix', '1999'],
                  ].map(([title, year]) => (
                    <asyncSearch.Item
                      key={title}
                      value={title}
                    >
                      <asyncSearch.MovieItem>
                        <asyncSearch.MovieName>{title}</asyncSearch.MovieName>
                        <asyncSearch.MovieYear>{year}</asyncSearch.MovieYear>
                      </asyncSearch.MovieItem>
                    </asyncSearch.Item>
                  ))}
                </asyncSearch.Viewport>
              </asyncSearch.Popup>
            </asyncSearch.Positioner>
          </asyncSearch.Portal>
        </asyncSearch.Root>
      </Story>
      <Story
        id="autocomplete-virtualized"
        title="virtualized"
      >
        <virtualized.Root>
          <virtualized.Label>
            Item
            <virtualized.Input placeholder="Search 10,000 items" />
          </virtualized.Label>
          <virtualized.Portal>
            <virtualized.Positioner>
              <virtualized.Popup>
                <virtualized.Scroller>
                  <virtualized.VirtualizedPlaceholder>
                    <virtualized.List>
                      {FRUITS.map((fruit) => (
                        <virtualized.Item
                          key={fruit}
                          value={fruit}
                        >
                          {fruit}
                        </virtualized.Item>
                      ))}
                    </virtualized.List>
                  </virtualized.VirtualizedPlaceholder>
                </virtualized.Scroller>
              </virtualized.Popup>
            </virtualized.Positioner>
          </virtualized.Portal>
        </virtualized.Root>
      </Story>
    </ComponentEntry>
  );
};

/* ---- Navigation & menus --------------------------------------------------- */

const MenuDemo: FunctionComponent = () => {
  const {
    main,
    arrow,
    checkboxItems,
    radioItems,
    groupLabels,
    nestedMenu,
    detachedTriggers,
    controlledModeWithMultipleTriggers,
    openOnHover,
    animatingTheMenu,
  } = Menu.variants;

  return (
    <ComponentEntry
      id="menu"
      name="Menu"
    >
      <Story
        id="menu-main"
        title="main"
      >
        <main.Root>
          <main.Trigger>File</main.Trigger>
          <main.Portal>
            <main.Positioner>
              <main.Popup>
                <main.Item>New file</main.Item>
                <main.Item>Open…</main.Item>
                <main.Separator />
                <main.Item>Save</main.Item>
              </main.Popup>
            </main.Positioner>
          </main.Portal>
        </main.Root>
      </Story>
      <Story
        id="menu-arrow"
        title="arrow"
      >
        <arrow.Root>
          <arrow.Trigger>File</arrow.Trigger>
          <arrow.Portal>
            <arrow.Positioner>
              <arrow.Popup>
                <arrow.Arrow />
                <arrow.Item>New file</arrow.Item>
                <arrow.Item>Open…</arrow.Item>
              </arrow.Popup>
            </arrow.Positioner>
          </arrow.Portal>
        </arrow.Root>
      </Story>
      <Story
        id="menu-checkbox-items"
        title="checkboxItems"
      >
        <checkboxItems.Root>
          <checkboxItems.Trigger>View</checkboxItems.Trigger>
          <checkboxItems.Portal>
            <checkboxItems.Positioner>
              <checkboxItems.Popup>
                {['Bookmarks bar', 'Full URLs'].map((label) => (
                  <checkboxItems.CheckboxItem
                    key={label}
                    defaultChecked
                  >
                    <checkboxItems.CheckboxItemIndicator>
                      <checkboxItems.CheckIcon />
                    </checkboxItems.CheckboxItemIndicator>
                    <checkboxItems.CheckboxItemText>
                      {label}
                    </checkboxItems.CheckboxItemText>
                  </checkboxItems.CheckboxItem>
                ))}
              </checkboxItems.Popup>
            </checkboxItems.Positioner>
          </checkboxItems.Portal>
        </checkboxItems.Root>
      </Story>
      <Story
        id="menu-radio-items"
        title="radioItems"
      >
        <radioItems.Root>
          <radioItems.Trigger>Zoom</radioItems.Trigger>
          <radioItems.Portal>
            <radioItems.Positioner>
              <radioItems.Popup>
                <Menu.RadioGroup defaultValue="100">
                  {['50', '100', '150'].map((value) => (
                    <radioItems.RadioItem
                      key={value}
                      value={value}
                    >
                      <radioItems.RadioItemIndicator>
                        <radioItems.CheckIcon />
                      </radioItems.RadioItemIndicator>
                      <radioItems.RadioItemText>
                        {value}%
                      </radioItems.RadioItemText>
                    </radioItems.RadioItem>
                  ))}
                </Menu.RadioGroup>
              </radioItems.Popup>
            </radioItems.Positioner>
          </radioItems.Portal>
        </radioItems.Root>
      </Story>
      <Story
        id="menu-group-labels"
        title="groupLabels"
      >
        <groupLabels.Root>
          <groupLabels.Trigger>Options</groupLabels.Trigger>
          <groupLabels.Portal>
            <groupLabels.Positioner>
              <groupLabels.Popup>
                <Menu.Group>
                  <groupLabels.GroupLabel>Font</groupLabels.GroupLabel>
                  <groupLabels.Item>Sans-serif</groupLabels.Item>
                  <groupLabels.Item>Serif</groupLabels.Item>
                </Menu.Group>
              </groupLabels.Popup>
            </groupLabels.Positioner>
          </groupLabels.Portal>
        </groupLabels.Root>
      </Story>
      <Story
        id="menu-nested-menu"
        title="nestedMenu"
      >
        <nestedMenu.Root>
          <nestedMenu.Trigger>File</nestedMenu.Trigger>
          <nestedMenu.Portal>
            <nestedMenu.Positioner>
              <nestedMenu.Popup>
                <nestedMenu.Item>New file</nestedMenu.Item>
                <Menu.SubmenuRoot>
                  <nestedMenu.SubmenuTrigger>
                    Add to Playlist
                    <nestedMenu.CaretRightIcon />
                  </nestedMenu.SubmenuTrigger>
                  <nestedMenu.Portal>
                    <nestedMenu.Positioner>
                      <nestedMenu.Popup>
                        <nestedMenu.Item>Recently added</nestedMenu.Item>
                        <nestedMenu.Item>Favorites</nestedMenu.Item>
                      </nestedMenu.Popup>
                    </nestedMenu.Positioner>
                  </nestedMenu.Portal>
                </Menu.SubmenuRoot>
              </nestedMenu.Popup>
            </nestedMenu.Positioner>
          </nestedMenu.Portal>
        </nestedMenu.Root>
      </Story>
      <Story
        id="menu-detached-triggers"
        title="detachedTriggers"
      >
        <detachedTriggers.Root>
          <detachedTriggers.IconButton aria-label="More actions">
            <detachedTriggers.EllipsisHorizontalIcon />
          </detachedTriggers.IconButton>
          <detachedTriggers.Portal>
            <detachedTriggers.Positioner>
              <detachedTriggers.Popup>
                <detachedTriggers.Item>Rename</detachedTriggers.Item>
                <detachedTriggers.Item>Delete</detachedTriggers.Item>
              </detachedTriggers.Popup>
            </detachedTriggers.Positioner>
          </detachedTriggers.Portal>
        </detachedTriggers.Root>
      </Story>
      <Story
        id="menu-controlled-mode-with-multiple-triggers"
        title="controlledModeWithMultipleTriggers"
      >
        <controlledModeWithMultipleTriggers.Root>
          <controlledModeWithMultipleTriggers.Container>
            <controlledModeWithMultipleTriggers.Button>
              Edit
            </controlledModeWithMultipleTriggers.Button>
          </controlledModeWithMultipleTriggers.Container>
          <controlledModeWithMultipleTriggers.Portal>
            <controlledModeWithMultipleTriggers.Positioner>
              <controlledModeWithMultipleTriggers.Popup>
                <controlledModeWithMultipleTriggers.Item>
                  Cut
                </controlledModeWithMultipleTriggers.Item>
                <controlledModeWithMultipleTriggers.Item>
                  Copy
                </controlledModeWithMultipleTriggers.Item>
              </controlledModeWithMultipleTriggers.Popup>
            </controlledModeWithMultipleTriggers.Positioner>
          </controlledModeWithMultipleTriggers.Portal>
        </controlledModeWithMultipleTriggers.Root>
      </Story>
      <Story
        id="menu-open-on-hover"
        title="openOnHover"
      >
        <openOnHover.Root>
          <openOnHover.Trigger delay={0}>File</openOnHover.Trigger>
          <openOnHover.Portal>
            <openOnHover.Positioner>
              <openOnHover.Popup>
                <openOnHover.Item>New file</openOnHover.Item>
                <openOnHover.Item>Open…</openOnHover.Item>
              </openOnHover.Popup>
            </openOnHover.Positioner>
          </openOnHover.Portal>
        </openOnHover.Root>
      </Story>
      <Story
        id="menu-animating-the-menu"
        title="animatingTheMenu"
      >
        <animatingTheMenu.Root>
          <animatingTheMenu.Container>
            <animatingTheMenu.Button>File</animatingTheMenu.Button>
          </animatingTheMenu.Container>
          <animatingTheMenu.Portal>
            <animatingTheMenu.Positioner>
              <animatingTheMenu.Popup>
                <animatingTheMenu.Viewport>
                  <animatingTheMenu.Item>New file</animatingTheMenu.Item>
                  <animatingTheMenu.Item>Open…</animatingTheMenu.Item>
                </animatingTheMenu.Viewport>
              </animatingTheMenu.Popup>
            </animatingTheMenu.Positioner>
          </animatingTheMenu.Portal>
        </animatingTheMenu.Root>
      </Story>
    </ComponentEntry>
  );
};

const MenubarDemo: FunctionComponent = () => {
  const { main } = Menubar.variants;
  return (
    <ComponentEntry
      id="menubar"
      name="Menubar"
    >
      <Story
        id="menubar-main"
        title="main"
      >
        <Menubar.variants.main>
          <Menu.Root>
            <main.MenuTrigger>File</main.MenuTrigger>
            <Menu.Portal>
              <main.MenuPositioner>
                <main.MenuPopup>
                  <main.MenuItem>New</main.MenuItem>
                  <main.MenuItem>Open…</main.MenuItem>
                  <main.MenuSeparator />
                  <Menu.SubmenuRoot>
                    <main.SubmenuTrigger>
                      Share
                      <main.CaretRightIcon />
                    </main.SubmenuTrigger>
                    <Menu.Portal>
                      <main.MenuPositioner>
                        <main.MenuPopup>
                          <main.MenuItem>Email</main.MenuItem>
                        </main.MenuPopup>
                      </main.MenuPositioner>
                    </Menu.Portal>
                  </Menu.SubmenuRoot>
                </main.MenuPopup>
              </main.MenuPositioner>
            </Menu.Portal>
          </Menu.Root>
          <Menu.Root>
            <main.MenuTrigger>Edit</main.MenuTrigger>
            <Menu.Portal>
              <main.MenuPositioner>
                <main.MenuPopup>
                  <main.MenuItem>Cut</main.MenuItem>
                  <main.MenuItem>Copy</main.MenuItem>
                  <main.MenuItem>Paste</main.MenuItem>
                </main.MenuPopup>
              </main.MenuPositioner>
            </Menu.Portal>
          </Menu.Root>
        </Menubar.variants.main>
      </Story>
    </ComponentEntry>
  );
};

const ContextMenuDemo: FunctionComponent = () => {
  const { main, nestedMenu } = ContextMenu.variants;
  return (
    <ComponentEntry
      id="context-menu"
      name="ContextMenu"
    >
      <Story
        id="context-menu-main"
        title="main"
      >
        <main.Root>
          <main.Trigger>Right click here</main.Trigger>
          <main.Portal>
            <main.Positioner>
              <main.Popup>
                <main.Item>Back</main.Item>
                <main.Item>Forward</main.Item>
                <main.Separator />
                <main.Item>Reload</main.Item>
              </main.Popup>
            </main.Positioner>
          </main.Portal>
        </main.Root>
      </Story>
      <Story
        id="context-menu-nested-menu"
        title="nestedMenu"
      >
        <nestedMenu.Root>
          <nestedMenu.Trigger>Right click here</nestedMenu.Trigger>
          <nestedMenu.Portal>
            <nestedMenu.Positioner>
              <nestedMenu.Popup>
                <nestedMenu.Item>Back</nestedMenu.Item>
                <ContextMenu.SubmenuRoot>
                  <nestedMenu.SubmenuTrigger>
                    More Tools
                    <nestedMenu.CaretRightIcon />
                  </nestedMenu.SubmenuTrigger>
                  <nestedMenu.Portal>
                    <nestedMenu.Positioner>
                      <nestedMenu.Popup>
                        <nestedMenu.Item>Developer Tools</nestedMenu.Item>
                      </nestedMenu.Popup>
                    </nestedMenu.Positioner>
                  </nestedMenu.Portal>
                </ContextMenu.SubmenuRoot>
              </nestedMenu.Popup>
            </nestedMenu.Positioner>
          </nestedMenu.Portal>
        </nestedMenu.Root>
      </Story>
    </ComponentEntry>
  );
};

const NavigationMenuDemo: FunctionComponent = () => {
  const { main } = NavigationMenu.variants;
  return (
    <ComponentEntry
      id="navigation-menu"
      name="NavigationMenu"
    >
      <Story
        id="navigation-menu-main"
        title="main"
      >
        <main.Root>
          <main.List>
            <main.Item>
              <main.Trigger>
                Overview
                <main.Icon />
              </main.Trigger>
              <main.Content>
                <main.GridLinkList>
                  {['Introduction', 'Quick start'].map((title) => (
                    <li key={title}>
                      <main.LinkCard href="#">
                        <main.LinkTitle>{title}</main.LinkTitle>
                        <main.LinkDescription>
                          Learn the basics.
                        </main.LinkDescription>
                      </main.LinkCard>
                    </li>
                  ))}
                </main.GridLinkList>
              </main.Content>
            </main.Item>
            <main.Item>
              <main.Trigger>
                Handbook
                <main.Icon />
              </main.Trigger>
              <main.Content>
                <main.FlexLinkList>
                  {['Accessibility', 'Styling'].map((title) => (
                    <li key={title}>
                      <main.LinkCard href="#">
                        <main.LinkTitle>{title}</main.LinkTitle>
                      </main.LinkCard>
                    </li>
                  ))}
                </main.FlexLinkList>
              </main.Content>
            </main.Item>
          </main.List>
          <main.Portal>
            <main.Positioner>
              <main.Popup>
                <main.Viewport />
              </main.Popup>
            </main.Positioner>
          </main.Portal>
        </main.Root>
      </Story>
    </ComponentEntry>
  );
};

const ToolbarDemo: FunctionComponent = () => {
  const { main } = Toolbar.variants;
  return (
    <ComponentEntry
      id="toolbar"
      name="Toolbar"
    >
      <Story
        id="toolbar-main"
        title="main"
      >
        <main.Root aria-label="Formatting">
          <main.Group aria-label="History">
            <main.Button>Undo</main.Button>
            <main.Button>Redo</main.Button>
          </main.Group>
          <main.Separator />
          <main.Group aria-label="Font">
            <Select.Root defaultValue="sans">
              <main.Button render={<Select.Trigger />}>
                <Select.Value />
                <main.CaretUpDownIcon />
              </main.Button>
              <Select.Portal>
                <main.SelectPositioner>
                  <main.SelectPopup>
                    {[
                      { value: 'sans', label: 'Sans-serif' },
                      { value: 'serif', label: 'Serif' },
                    ].map((option) => (
                      <main.SelectItem
                        key={option.value}
                        value={option.value}
                      >
                        <main.SelectItemIndicator>
                          <main.CheckIcon />
                        </main.SelectItemIndicator>
                        <main.SelectItemText>
                          {option.label}
                        </main.SelectItemText>
                      </main.SelectItem>
                    ))}
                  </main.SelectPopup>
                </main.SelectPositioner>
              </Select.Portal>
            </Select.Root>
          </main.Group>
          <main.Separator />
          <main.ToggleGroup
            aria-label="Text style"
            defaultValue={['bold']}
          >
            <main.Button render={<Toggle value="bold" />}>Bold</main.Button>
            <main.Button render={<Toggle value="italic" />}>Italic</main.Button>
          </main.ToggleGroup>
        </main.Root>
      </Story>
    </ComponentEntry>
  );
};

/* ---- Layout --------------------------------------------------------------- */

const ScrollAreaDemo: FunctionComponent = () => {
  const { main, bothScrollbars, gradientScrollFade } = ScrollArea.variants;
  const paragraphs = Array.from(
    { length: 6 },
    (_, index) => `Paragraph ${index + 1} of scrollable content.`,
  );

  return (
    <ComponentEntry
      id="scroll-area"
      name="ScrollArea"
    >
      <Story
        id="scroll-area-main"
        title="main"
      >
        <main.Root>
          <main.Viewport>
            <main.Content>
              {paragraphs.map((text) => (
                <main.Paragraph key={text}>{text}</main.Paragraph>
              ))}
            </main.Content>
          </main.Viewport>
          <main.Scrollbar>
            <main.Thumb />
          </main.Scrollbar>
        </main.Root>
      </Story>
      <Story
        id="scroll-area-both-scrollbars"
        title="bothScrollbars"
      >
        <bothScrollbars.Root>
          <bothScrollbars.Viewport>
            <bothScrollbars.Content>
              <bothScrollbars.Grid>
                {Array.from({ length: 20 }, (_, index) => (
                  <bothScrollbars.Item key={index}>
                    {index + 1}
                  </bothScrollbars.Item>
                ))}
              </bothScrollbars.Grid>
            </bothScrollbars.Content>
          </bothScrollbars.Viewport>
          <bothScrollbars.Scrollbar orientation="vertical">
            <bothScrollbars.Thumb />
          </bothScrollbars.Scrollbar>
          <bothScrollbars.Scrollbar orientation="horizontal">
            <bothScrollbars.Thumb />
          </bothScrollbars.Scrollbar>
        </bothScrollbars.Root>
      </Story>
      <Story
        id="scroll-area-gradient-scroll-fade"
        title="gradientScrollFade"
      >
        <gradientScrollFade.Root>
          <gradientScrollFade.Viewport>
            <gradientScrollFade.Content>
              {paragraphs.map((text) => (
                <gradientScrollFade.Paragraph key={text}>
                  {text}
                </gradientScrollFade.Paragraph>
              ))}
            </gradientScrollFade.Content>
          </gradientScrollFade.Viewport>
          <gradientScrollFade.Scrollbar>
            <gradientScrollFade.Thumb />
          </gradientScrollFade.Scrollbar>
        </gradientScrollFade.Root>
      </Story>
    </ComponentEntry>
  );
};

const SeparatorDemo: FunctionComponent = () => (
  <ComponentEntry
    id="separator"
    name="Separator"
  >
    <Story
      id="separator-main"
      title="main"
    >
      <span>Home</span>
      <Separator.variants.main />
      <span>Docs</span>
      <Separator.variants.main />
      <span>About</span>
    </Story>
  </ComponentEntry>
);

const TabsDemo: FunctionComponent = () => {
  const { main } = Tabs.variants;
  return (
    <ComponentEntry
      id="tabs"
      name="Tabs"
    >
      <Story
        id="tabs-main"
        title="main"
      >
        <main.Root defaultValue="overview">
          <main.List>
            {['overview', 'projects', 'account'].map((tab) => (
              <main.Tab
                key={tab}
                value={tab}
              >
                {tab[0]?.toUpperCase()}
                {tab.slice(1)}
              </main.Tab>
            ))}
            <main.Indicator />
          </main.List>
          <main.PanelViewport>
            {['overview', 'projects', 'account'].map((tab) => (
              <main.Panel
                key={tab}
                value={tab}
              >
                <main.Paragraph>{tab} panel content.</main.Paragraph>
              </main.Panel>
            ))}
          </main.PanelViewport>
        </main.Root>
      </Story>
    </ComponentEntry>
  );
};

/* ---- Feedback & status ------------------------------------------------ */

const MeterDemo: FunctionComponent = () => {
  const { main } = Meter.variants;
  return (
    <ComponentEntry
      id="meter"
      name="Meter"
    >
      <Story
        id="meter-main"
        title="main"
      >
        <main.Root value={72}>
          <main.Label>Disk usage</main.Label>
          <main.Value />
          <main.Track>
            <main.Indicator />
          </main.Track>
        </main.Root>
      </Story>
    </ComponentEntry>
  );
};

const ProgressDemo: FunctionComponent = () => {
  const { main } = Progress.variants;
  return (
    <ComponentEntry
      id="progress"
      name="Progress"
    >
      <Story
        id="progress-main"
        title="main"
      >
        <main.Root value={40}>
          <main.Label>Exporting…</main.Label>
          <main.Value />
          <main.Track>
            <main.Indicator />
          </main.Track>
        </main.Root>
      </Story>
    </ComponentEntry>
  );
};

/* eslint-disable @typescript-eslint/no-explicit-any -- heterogeneous styled
   components passed in from every Toast variant don't share a single prop
   type; these two helpers are demo-only wiring, not public API. */
const ToastTriggerButton: FunctionComponent<{
  Button: ComponentType<any>;
  label: string;
  onTrigger: (manager: ReturnType<typeof Toast.useToastManager>) => void;
}> = ({ Button: TriggerButton, label, onTrigger }) => {
  const manager = Toast.useToastManager();
  return (
    <TriggerButton onClick={() => onTrigger(manager)}>{label}</TriggerButton>
  );
};

const ToastRenderList: FunctionComponent<{
  Root: ComponentType<any>;
  renderToast: (
    toast: ReturnType<typeof Toast.useToastManager>['toasts'][number],
  ) => ComponentChildren;
}> = ({ Root, renderToast }) => {
  const { toasts } = Toast.useToastManager();
  return (
    <Fragment>
      {toasts.map((toast) => (
        <Root
          key={toast.id}
          toast={toast}
        >
          {renderToast(toast)}
        </Root>
      ))}
    </Fragment>
  );
};
/* eslint-enable @typescript-eslint/no-explicit-any */

const AnchoredToastDemo: FunctionComponent = () => {
  const { anchoredToasts } = Toast.variants;
  const anchorRef = useRef<HTMLButtonElement>(null);

  return (
    <Toast.Provider>
      <Tooltip.Root>
        <anchoredToasts.ButtonGroup>
          <Tooltip.Trigger
            ref={anchorRef}
            render={<anchoredToasts.CopyButton />}
          >
            <anchoredToasts.ClipboardIcon />
          </Tooltip.Trigger>
          <ToastTriggerButton
            Button={anchoredToasts.Button}
            label="Copy link"
            onTrigger={(manager) =>
              manager.add({
                title: 'Copied to clipboard',
                positionerProps: { anchor: anchorRef.current },
              })
            }
          />
        </anchoredToasts.ButtonGroup>
        <Tooltip.Portal>
          <Tooltip.Positioner>
            <anchoredToasts.TooltipPopup>Copy</anchoredToasts.TooltipPopup>
          </Tooltip.Positioner>
        </Tooltip.Portal>
      </Tooltip.Root>
      <Toast.Portal>
        <anchoredToasts.AnchoredViewport>
          <ToastRenderList
            Root={anchoredToasts.AnchoredRoot}
            renderToast={(toast) => (
              <anchoredToasts.AnchoredDescription>
                {toast.title}
              </anchoredToasts.AnchoredDescription>
            )}
          />
        </anchoredToasts.AnchoredViewport>
      </Toast.Portal>
    </Toast.Provider>
  );
};

const ToastDemo: FunctionComponent = () => {
  const {
    main,
    customPosition,
    undoAction,
    promise,
    custom,
    deduplicatedToast,
    varyingHeights,
  } = Toast.variants;

  return (
    <ComponentEntry
      id="toast"
      name="Toast"
    >
      <Story
        id="toast-main"
        title="main"
      >
        <Toast.Provider>
          <ToastTriggerButton
            Button={main.Button}
            label="Create toast"
            onTrigger={(manager) =>
              manager.add({
                title: 'Event created',
                description: 'Saturday at 3:00 PM',
              })
            }
          />
          <Toast.Portal>
            <main.Viewport>
              <ToastRenderList
                Root={main.Root}
                renderToast={(toast) => (
                  <main.Content>
                    <main.Text>
                      <main.Title>{toast.title}</main.Title>
                      <main.Description>{toast.description}</main.Description>
                    </main.Text>
                    <main.Close aria-label="Close">×</main.Close>
                  </main.Content>
                )}
              />
            </main.Viewport>
          </Toast.Portal>
        </Toast.Provider>
      </Story>
      <Story
        id="toast-custom-position"
        title="customPosition"
      >
        <Toast.Provider>
          <ToastTriggerButton
            Button={main.Button}
            label="Create toast"
            onTrigger={(manager) =>
              manager.add({ title: 'Copied to clipboard' })
            }
          />
          <Toast.Portal>
            <customPosition.Viewport>
              <ToastRenderList
                Root={customPosition.Root}
                renderToast={(toast) => (
                  <customPosition.Content>
                    <customPosition.Text>
                      <customPosition.Title>{toast.title}</customPosition.Title>
                    </customPosition.Text>
                    <customPosition.Close aria-label="Close">
                      ×
                    </customPosition.Close>
                  </customPosition.Content>
                )}
              />
            </customPosition.Viewport>
          </Toast.Portal>
        </Toast.Provider>
      </Story>
      <Story
        id="toast-undo-action"
        title="undoAction"
      >
        <Toast.Provider>
          <ToastTriggerButton
            Button={undoAction.Button}
            label="Delete message"
            onTrigger={(manager) => manager.add({ title: 'Message deleted' })}
          />
          <Toast.Portal>
            <undoAction.Viewport>
              <ToastRenderList
                Root={undoAction.Root}
                renderToast={(toast) => (
                  <undoAction.Content>
                    <undoAction.Text>
                      <undoAction.Message>
                        <undoAction.Title>{toast.title}</undoAction.Title>
                      </undoAction.Message>
                    </undoAction.Text>
                    <undoAction.UndoButton>Undo</undoAction.UndoButton>
                  </undoAction.Content>
                )}
              />
            </undoAction.Viewport>
          </Toast.Portal>
        </Toast.Provider>
      </Story>
      <Story
        id="toast-promise"
        title="promise"
      >
        <Toast.Provider>
          <ToastTriggerButton
            Button={main.Button}
            label="Save"
            onTrigger={(manager) =>
              manager.promise(
                new Promise<void>((resolve) => {
                  setTimeout(resolve, 1000);
                }),
                {
                  loading: 'Saving…',
                  success: 'Saved!',
                  error: 'Something went wrong',
                },
              )
            }
          />
          <Toast.Portal>
            <main.Viewport>
              <ToastRenderList
                Root={promise.Root}
                renderToast={(toast) => (
                  <main.Content>
                    <main.Text>
                      <main.Title>{toast.title}</main.Title>
                    </main.Text>
                  </main.Content>
                )}
              />
            </main.Viewport>
          </Toast.Portal>
        </Toast.Provider>
      </Story>
      <Story
        id="toast-custom"
        title="custom"
      >
        <Toast.Provider>
          <ToastTriggerButton
            Button={custom.Button}
            label="Create toast"
            onTrigger={(manager) =>
              manager.add({ title: 'With custom data', data: { pinned: true } })
            }
          />
          <Toast.Portal>
            <custom.Viewport>
              <ToastRenderList
                Root={custom.Root}
                renderToast={(toast) => (
                  <custom.Content>
                    <custom.Text>
                      <custom.Title>{toast.title}</custom.Title>
                    </custom.Text>
                  </custom.Content>
                )}
              />
            </custom.Viewport>
          </Toast.Portal>
        </Toast.Provider>
      </Story>
      <Story
        id="toast-deduplicated-toast"
        title="deduplicatedToast"
      >
        <Toast.Provider>
          <ToastTriggerButton
            Button={deduplicatedToast.Button}
            label="Sync"
            onTrigger={(manager) =>
              manager.add({ id: 'dedupe-demo', title: 'Synced just now' })
            }
          />
          <Toast.Portal>
            <deduplicatedToast.Viewport>
              <ToastRenderList
                Root={deduplicatedToast.Root}
                renderToast={(toast) => (
                  <deduplicatedToast.Content>
                    <deduplicatedToast.Text>
                      <deduplicatedToast.Title>
                        {toast.title}
                      </deduplicatedToast.Title>
                    </deduplicatedToast.Text>
                  </deduplicatedToast.Content>
                )}
              />
            </deduplicatedToast.Viewport>
          </Toast.Portal>
        </Toast.Provider>
      </Story>
      <Story
        id="toast-varying-heights"
        title="varyingHeights"
      >
        <Toast.Provider>
          <ToastTriggerButton
            Button={varyingHeights.Button}
            label="Short toast"
            onTrigger={(manager) => manager.add({ title: 'Saved' })}
          />
          <ToastTriggerButton
            Button={varyingHeights.Button}
            label="Long toast"
            onTrigger={(manager) =>
              manager.add({
                title: 'Saved',
                description:
                  'Your changes have been saved and synced across every device linked to this account.',
              })
            }
          />
          <Toast.Portal>
            <varyingHeights.Viewport>
              <ToastRenderList
                Root={varyingHeights.Root}
                renderToast={(toast) => (
                  <varyingHeights.Content>
                    <varyingHeights.Text>
                      <varyingHeights.Title>{toast.title}</varyingHeights.Title>
                      <varyingHeights.Description>
                        {toast.description}
                      </varyingHeights.Description>
                    </varyingHeights.Text>
                  </varyingHeights.Content>
                )}
              />
            </varyingHeights.Viewport>
          </Toast.Portal>
        </Toast.Provider>
      </Story>
      <Story
        id="toast-anchored-toasts"
        title="anchoredToasts"
      >
        <AnchoredToastDemo />
      </Story>
    </ComponentEntry>
  );
};

/* ---- Overlays ----------------------------------------------------------- */

const PopoverDemo: FunctionComponent = () => {
  const {
    main,
    detachedTriggers,
    controlledModeWithMultipleTriggers,
    openingOnHover,
    animatingThePopover,
  } = Popover.variants;

  return (
    <ComponentEntry
      id="popover"
      name="Popover"
    >
      <Story
        id="popover-main"
        title="main"
      >
        <main.Root>
          <main.Trigger>Notifications</main.Trigger>
          <main.Portal>
            <main.Positioner>
              <main.Popup>
                <main.Title>Notifications</main.Title>
                <main.Description>You are all caught up.</main.Description>
              </main.Popup>
            </main.Positioner>
          </main.Portal>
        </main.Root>
      </Story>
      <Story
        id="popover-detached-triggers"
        title="detachedTriggers"
      >
        <detachedTriggers.Root>
          <detachedTriggers.Trigger>Notifications</detachedTriggers.Trigger>
          <detachedTriggers.Portal>
            <detachedTriggers.Positioner>
              <detachedTriggers.Popup>
                <detachedTriggers.Title>Notifications</detachedTriggers.Title>
                <detachedTriggers.Description>
                  You are all caught up.
                </detachedTriggers.Description>
              </detachedTriggers.Popup>
            </detachedTriggers.Positioner>
          </detachedTriggers.Portal>
        </detachedTriggers.Root>
      </Story>
      <Story
        id="popover-controlled-mode-with-multiple-triggers"
        title="controlledModeWithMultipleTriggers"
      >
        <controlledModeWithMultipleTriggers.Root>
          <controlledModeWithMultipleTriggers.Container>
            <controlledModeWithMultipleTriggers.Trigger>
              Account
            </controlledModeWithMultipleTriggers.Trigger>
          </controlledModeWithMultipleTriggers.Container>
          <controlledModeWithMultipleTriggers.Portal>
            <controlledModeWithMultipleTriggers.Positioner>
              <controlledModeWithMultipleTriggers.Popup>
                <controlledModeWithMultipleTriggers.Title>
                  Account
                </controlledModeWithMultipleTriggers.Title>
              </controlledModeWithMultipleTriggers.Popup>
            </controlledModeWithMultipleTriggers.Positioner>
          </controlledModeWithMultipleTriggers.Portal>
        </controlledModeWithMultipleTriggers.Root>
      </Story>
      <Story
        id="popover-opening-on-hover"
        title="openingOnHover"
      >
        <openingOnHover.Root>
          <openingOnHover.Trigger openOnHover>Hover me</openingOnHover.Trigger>
          <openingOnHover.Portal>
            <openingOnHover.Positioner>
              <openingOnHover.Popup>
                <openingOnHover.Title>Preview</openingOnHover.Title>
              </openingOnHover.Popup>
            </openingOnHover.Positioner>
          </openingOnHover.Portal>
        </openingOnHover.Root>
      </Story>
      <Story
        id="popover-animating-the-popover"
        title="animatingThePopover"
      >
        <animatingThePopover.Root>
          <animatingThePopover.Container>
            <animatingThePopover.Trigger>Profile</animatingThePopover.Trigger>
          </animatingThePopover.Container>
          <animatingThePopover.Portal>
            <animatingThePopover.Positioner>
              <animatingThePopover.Popup>
                <animatingThePopover.Viewport>
                  <animatingThePopover.ProfilePanel>
                    <animatingThePopover.ProfileAvatar>
                      <animatingThePopover.ProfileAvatarImage />
                    </animatingThePopover.ProfileAvatar>
                    <animatingThePopover.ProfileTitle>
                      Jane Doe
                    </animatingThePopover.ProfileTitle>
                    <animatingThePopover.ProfilePlan>
                      Pro plan
                    </animatingThePopover.ProfilePlan>
                    <animatingThePopover.ProfileActions>
                      <animatingThePopover.ProfileLink href="#">
                        View profile
                      </animatingThePopover.ProfileLink>
                    </animatingThePopover.ProfileActions>
                  </animatingThePopover.ProfilePanel>
                </animatingThePopover.Viewport>
              </animatingThePopover.Popup>
            </animatingThePopover.Positioner>
          </animatingThePopover.Portal>
        </animatingThePopover.Root>
      </Story>
    </ComponentEntry>
  );
};

const PreviewCardDemo: FunctionComponent = () => {
  const {
    main,
    detachedTriggers,
    controlledModeWithMultipleTriggers,
    animatingThePreviewCard,
  } = PreviewCard.variants;

  return (
    <ComponentEntry
      id="preview-card"
      name="PreviewCard"
    >
      <Story
        id="preview-card-main"
        title="main"
      >
        <main.Root>
          <main.Trigger href="#">Base UI</main.Trigger>
          <main.Portal>
            <main.Positioner>
              <main.Popup>
                <main.Arrow />
                <main.PopupContent>
                  <main.Summary>
                    An unstyled, accessible UI component library.
                  </main.Summary>
                </main.PopupContent>
              </main.Popup>
            </main.Positioner>
          </main.Portal>
        </main.Root>
      </Story>
      <Story
        id="preview-card-detached-triggers"
        title="detachedTriggers"
      >
        <detachedTriggers.Root>
          <detachedTriggers.Trigger href="#">Base UI</detachedTriggers.Trigger>
          <detachedTriggers.Portal>
            <detachedTriggers.Positioner>
              <detachedTriggers.Popup>
                <detachedTriggers.PopupContent>
                  <detachedTriggers.Summary>
                    An unstyled, accessible UI component library.
                  </detachedTriggers.Summary>
                </detachedTriggers.PopupContent>
              </detachedTriggers.Popup>
            </detachedTriggers.Positioner>
          </detachedTriggers.Portal>
        </detachedTriggers.Root>
      </Story>
      <Story
        id="preview-card-controlled-mode-with-multiple-triggers"
        title="controlledModeWithMultipleTriggers"
      >
        <controlledModeWithMultipleTriggers.Root>
          <controlledModeWithMultipleTriggers.Container>
            <controlledModeWithMultipleTriggers.Trigger href="#">
              Base UI
            </controlledModeWithMultipleTriggers.Trigger>
          </controlledModeWithMultipleTriggers.Container>
          <controlledModeWithMultipleTriggers.Portal>
            <controlledModeWithMultipleTriggers.Positioner>
              <controlledModeWithMultipleTriggers.Popup>
                <controlledModeWithMultipleTriggers.PopupContent>
                  <controlledModeWithMultipleTriggers.Summary>
                    An unstyled, accessible UI component library.
                  </controlledModeWithMultipleTriggers.Summary>
                </controlledModeWithMultipleTriggers.PopupContent>
              </controlledModeWithMultipleTriggers.Popup>
            </controlledModeWithMultipleTriggers.Positioner>
          </controlledModeWithMultipleTriggers.Portal>
        </controlledModeWithMultipleTriggers.Root>
      </Story>
      <Story
        id="preview-card-animating-the-preview-card"
        title="animatingThePreviewCard"
      >
        <animatingThePreviewCard.Root>
          <animatingThePreviewCard.Trigger href="#">
            Base UI
          </animatingThePreviewCard.Trigger>
          <animatingThePreviewCard.Portal>
            <animatingThePreviewCard.Positioner>
              <animatingThePreviewCard.Popup>
                <animatingThePreviewCard.Viewport>
                  <animatingThePreviewCard.PopupContent>
                    <animatingThePreviewCard.Summary>
                      An unstyled, accessible UI component library.
                    </animatingThePreviewCard.Summary>
                  </animatingThePreviewCard.PopupContent>
                </animatingThePreviewCard.Viewport>
              </animatingThePreviewCard.Popup>
            </animatingThePreviewCard.Positioner>
          </animatingThePreviewCard.Portal>
        </animatingThePreviewCard.Root>
      </Story>
    </ComponentEntry>
  );
};

const TooltipDemo: FunctionComponent = () => {
  const {
    main,
    detachedTriggers,
    controlledModeWithMultipleTriggers,
    animatingTheTooltip,
  } = Tooltip.variants;

  return (
    <ComponentEntry
      id="tooltip"
      name="Tooltip"
    >
      <Story
        id="tooltip-main"
        title="main"
      >
        <main.Panel>
          {(
            [
              ['Bold', main.BoldIcon],
              ['Italic', main.ItalicIcon],
              ['Underline', main.UnderlineIcon],
            ] as const
          ).map(([label, Icon]) => (
            <main.Root key={label}>
              <main.Trigger aria-label={label}>
                <Icon />
              </main.Trigger>
              <main.Portal>
                <main.Positioner>
                  <main.Popup>
                    <main.Arrow />
                    {label}
                  </main.Popup>
                </main.Positioner>
              </main.Portal>
            </main.Root>
          ))}
        </main.Panel>
      </Story>
      <Story
        id="tooltip-detached-triggers"
        title="detachedTriggers"
      >
        <detachedTriggers.Root>
          <detachedTriggers.Trigger aria-label="Delete">
            <detachedTriggers.TrashIcon />
          </detachedTriggers.Trigger>
          <detachedTriggers.Portal>
            <detachedTriggers.Positioner>
              <detachedTriggers.Popup>
                <detachedTriggers.Arrow />
                Delete
              </detachedTriggers.Popup>
            </detachedTriggers.Positioner>
          </detachedTriggers.Portal>
        </detachedTriggers.Root>
      </Story>
      <Story
        id="tooltip-controlled-mode-with-multiple-triggers"
        title="controlledModeWithMultipleTriggers"
      >
        <controlledModeWithMultipleTriggers.Container>
          <controlledModeWithMultipleTriggers.ButtonGroup>
            <controlledModeWithMultipleTriggers.Root>
              <controlledModeWithMultipleTriggers.Trigger aria-label="Audio">
                <controlledModeWithMultipleTriggers.HeadphonesIcon />
              </controlledModeWithMultipleTriggers.Trigger>
              <controlledModeWithMultipleTriggers.Portal>
                <controlledModeWithMultipleTriggers.Positioner>
                  <controlledModeWithMultipleTriggers.Popup>
                    <controlledModeWithMultipleTriggers.Arrow />
                    Audio
                  </controlledModeWithMultipleTriggers.Popup>
                </controlledModeWithMultipleTriggers.Positioner>
              </controlledModeWithMultipleTriggers.Portal>
            </controlledModeWithMultipleTriggers.Root>
            <controlledModeWithMultipleTriggers.Root>
              <controlledModeWithMultipleTriggers.Trigger aria-label="History">
                <controlledModeWithMultipleTriggers.StopwatchIcon />
              </controlledModeWithMultipleTriggers.Trigger>
              <controlledModeWithMultipleTriggers.Portal>
                <controlledModeWithMultipleTriggers.Positioner>
                  <controlledModeWithMultipleTriggers.Popup>
                    <controlledModeWithMultipleTriggers.Arrow />
                    History
                  </controlledModeWithMultipleTriggers.Popup>
                </controlledModeWithMultipleTriggers.Positioner>
              </controlledModeWithMultipleTriggers.Portal>
            </controlledModeWithMultipleTriggers.Root>
          </controlledModeWithMultipleTriggers.ButtonGroup>
          <controlledModeWithMultipleTriggers.Button>
            Open programmatically
          </controlledModeWithMultipleTriggers.Button>
        </controlledModeWithMultipleTriggers.Container>
      </Story>
      <Story
        id="tooltip-animating-the-tooltip"
        title="animatingTheTooltip"
      >
        <animatingTheTooltip.ButtonGroup>
          <animatingTheTooltip.Root>
            <animatingTheTooltip.Trigger aria-label="Audio">
              <animatingTheTooltip.HeadphonesIcon />
            </animatingTheTooltip.Trigger>
            <animatingTheTooltip.Portal>
              <animatingTheTooltip.Positioner>
                <animatingTheTooltip.Popup>
                  <animatingTheTooltip.Viewport>
                    Audio
                  </animatingTheTooltip.Viewport>
                </animatingTheTooltip.Popup>
              </animatingTheTooltip.Positioner>
            </animatingTheTooltip.Portal>
          </animatingTheTooltip.Root>
        </animatingTheTooltip.ButtonGroup>
      </Story>
    </ComponentEntry>
  );
};

const AlertDialogDemo: FunctionComponent = () => {
  const {
    main,
    closeConfirmation,
    detachedTriggers,
    controlledModeWithMultipleTriggers,
  } = AlertDialog.variants;

  return (
    <ComponentEntry
      id="alert-dialog"
      name="AlertDialog"
    >
      <Story
        id="alert-dialog-main"
        title="main"
      >
        <main.Root>
          <main.Trigger data-color="red">Delete</main.Trigger>
          <main.Portal>
            <main.Backdrop />
            <main.Popup>
              <main.Intro>
                <main.Title>Discard draft?</main.Title>
                <main.Description>
                  You can&rsquo;t undo this action.
                </main.Description>
              </main.Intro>
              <main.Actions>
                <main.Close>Cancel</main.Close>
                <main.Close data-color="red">Discard</main.Close>
              </main.Actions>
            </main.Popup>
          </main.Portal>
        </main.Root>
      </Story>
      <Story
        id="alert-dialog-close-confirmation"
        title="closeConfirmation"
      >
        <Dialog.Root>
          <closeConfirmation.DialogTrigger>
            Compose
          </closeConfirmation.DialogTrigger>
          <Dialog.Portal>
            <closeConfirmation.DialogBackdrop />
            <closeConfirmation.DialogPopup>
              <closeConfirmation.PopupBody>
                <closeConfirmation.DialogTitle>
                  New tweet
                </closeConfirmation.DialogTitle>
                <closeConfirmation.TextareaContainer>
                  <closeConfirmation.Textarea placeholder="What's happening?" />
                </closeConfirmation.TextareaContainer>
              </closeConfirmation.PopupBody>
              <AlertDialog.Root>
                <closeConfirmation.Trigger data-color="red">
                  Discard
                </closeConfirmation.Trigger>
                <closeConfirmation.Portal>
                  <closeConfirmation.Backdrop />
                  <closeConfirmation.Popup>
                    <closeConfirmation.Intro>
                      <closeConfirmation.Title>
                        Discard draft?
                      </closeConfirmation.Title>
                      <closeConfirmation.Description>
                        You can&rsquo;t undo this action.
                      </closeConfirmation.Description>
                    </closeConfirmation.Intro>
                    <closeConfirmation.Actions>
                      <closeConfirmation.Close>Cancel</closeConfirmation.Close>
                      <closeConfirmation.Close data-color="red">
                        Discard
                      </closeConfirmation.Close>
                    </closeConfirmation.Actions>
                  </closeConfirmation.Popup>
                </closeConfirmation.Portal>
              </AlertDialog.Root>
            </closeConfirmation.DialogPopup>
          </Dialog.Portal>
        </Dialog.Root>
      </Story>
      <Story
        id="alert-dialog-detached-triggers"
        title="detachedTriggers"
      >
        <detachedTriggers.Root>
          <detachedTriggers.Container>
            <detachedTriggers.Trigger data-color="red">
              Delete account
            </detachedTriggers.Trigger>
          </detachedTriggers.Container>
          <detachedTriggers.Portal>
            <detachedTriggers.Backdrop />
            <detachedTriggers.Popup>
              <detachedTriggers.Intro>
                <detachedTriggers.Title>Delete account?</detachedTriggers.Title>
                <detachedTriggers.Description>
                  This action is permanent.
                </detachedTriggers.Description>
              </detachedTriggers.Intro>
              <detachedTriggers.Actions>
                <detachedTriggers.Close>Cancel</detachedTriggers.Close>
                <detachedTriggers.Close data-color="red">
                  Delete
                </detachedTriggers.Close>
              </detachedTriggers.Actions>
            </detachedTriggers.Popup>
          </detachedTriggers.Portal>
        </detachedTriggers.Root>
      </Story>
      <Story
        id="alert-dialog-controlled-mode-with-multiple-triggers"
        title="controlledModeWithMultipleTriggers"
      >
        <controlledModeWithMultipleTriggers.Root>
          <controlledModeWithMultipleTriggers.Container>
            <controlledModeWithMultipleTriggers.Trigger data-color="red">
              Delete post
            </controlledModeWithMultipleTriggers.Trigger>
            <controlledModeWithMultipleTriggers.Trigger data-color="red">
              Delete comment
            </controlledModeWithMultipleTriggers.Trigger>
          </controlledModeWithMultipleTriggers.Container>
          <controlledModeWithMultipleTriggers.Portal>
            <controlledModeWithMultipleTriggers.Backdrop />
            <controlledModeWithMultipleTriggers.Popup>
              <controlledModeWithMultipleTriggers.Intro>
                <controlledModeWithMultipleTriggers.Title>
                  Are you sure?
                </controlledModeWithMultipleTriggers.Title>
              </controlledModeWithMultipleTriggers.Intro>
              <controlledModeWithMultipleTriggers.Actions>
                <controlledModeWithMultipleTriggers.Close>
                  Cancel
                </controlledModeWithMultipleTriggers.Close>
                <controlledModeWithMultipleTriggers.Close data-color="red">
                  Delete
                </controlledModeWithMultipleTriggers.Close>
              </controlledModeWithMultipleTriggers.Actions>
            </controlledModeWithMultipleTriggers.Popup>
          </controlledModeWithMultipleTriggers.Portal>
        </controlledModeWithMultipleTriggers.Root>
      </Story>
    </ComponentEntry>
  );
};

const DialogDemo: FunctionComponent = () => {
  const {
    main,
    closeConfirmation,
    detachedTriggers,
    controlledModeWithMultipleTriggers,
    insideScrollDialog,
    nestedDialogs,
    placingElementsOutsideThePopup,
  } = Dialog.variants;

  return (
    <ComponentEntry
      id="dialog"
      name="Dialog"
    >
      <Story
        id="dialog-main"
        title="main"
      >
        <main.Root>
          <main.Trigger>Notifications</main.Trigger>
          <main.Portal>
            <main.Backdrop />
            <main.Popup>
              <main.Intro>
                <main.Title>Notifications</main.Title>
                <main.Description>You are all caught up.</main.Description>
              </main.Intro>
              <main.Actions>
                <main.Close>Close</main.Close>
              </main.Actions>
            </main.Popup>
          </main.Portal>
        </main.Root>
      </Story>
      <Story
        id="dialog-close-confirmation"
        title="closeConfirmation"
      >
        <closeConfirmation.Root>
          <closeConfirmation.Trigger>Compose</closeConfirmation.Trigger>
          <closeConfirmation.Portal>
            <closeConfirmation.Backdrop />
            <closeConfirmation.Popup>
              <closeConfirmation.PopupBody>
                <closeConfirmation.Title>New tweet</closeConfirmation.Title>
                <closeConfirmation.TextareaContainer>
                  <closeConfirmation.Textarea placeholder="What's happening?" />
                </closeConfirmation.TextareaContainer>
              </closeConfirmation.PopupBody>
              <closeConfirmation.AlertDialogRoot>
                <closeConfirmation.Close data-color="red">
                  Discard
                </closeConfirmation.Close>
                <closeConfirmation.AlertDialogPortal>
                  <closeConfirmation.AlertDialogPopup>
                    <closeConfirmation.AlertDialogIntro>
                      <closeConfirmation.AlertDialogTitle>
                        Discard draft?
                      </closeConfirmation.AlertDialogTitle>
                      <closeConfirmation.AlertDialogDescription>
                        You can&rsquo;t undo this action.
                      </closeConfirmation.AlertDialogDescription>
                    </closeConfirmation.AlertDialogIntro>
                    <closeConfirmation.AlertDialogClose>
                      Cancel
                    </closeConfirmation.AlertDialogClose>
                  </closeConfirmation.AlertDialogPopup>
                </closeConfirmation.AlertDialogPortal>
              </closeConfirmation.AlertDialogRoot>
            </closeConfirmation.Popup>
          </closeConfirmation.Portal>
        </closeConfirmation.Root>
      </Story>
      <Story
        id="dialog-detached-triggers"
        title="detachedTriggers"
      >
        <detachedTriggers.Root>
          <detachedTriggers.Container>
            <detachedTriggers.Trigger>Notifications</detachedTriggers.Trigger>
          </detachedTriggers.Container>
          <detachedTriggers.Portal>
            <detachedTriggers.Backdrop />
            <detachedTriggers.Popup>
              <detachedTriggers.Intro>
                <detachedTriggers.Title>Notifications</detachedTriggers.Title>
              </detachedTriggers.Intro>
              <detachedTriggers.Actions>
                <detachedTriggers.Close>Close</detachedTriggers.Close>
              </detachedTriggers.Actions>
            </detachedTriggers.Popup>
          </detachedTriggers.Portal>
        </detachedTriggers.Root>
      </Story>
      <Story
        id="dialog-controlled-mode-with-multiple-triggers"
        title="controlledModeWithMultipleTriggers"
      >
        <controlledModeWithMultipleTriggers.Root>
          <controlledModeWithMultipleTriggers.Container>
            <controlledModeWithMultipleTriggers.Trigger>
              Edit profile
            </controlledModeWithMultipleTriggers.Trigger>
          </controlledModeWithMultipleTriggers.Container>
          <controlledModeWithMultipleTriggers.Portal>
            <controlledModeWithMultipleTriggers.Backdrop />
            <controlledModeWithMultipleTriggers.Popup>
              <controlledModeWithMultipleTriggers.Intro>
                <controlledModeWithMultipleTriggers.Title>
                  Edit profile
                </controlledModeWithMultipleTriggers.Title>
              </controlledModeWithMultipleTriggers.Intro>
              <controlledModeWithMultipleTriggers.Actions>
                <controlledModeWithMultipleTriggers.Close>
                  Save
                </controlledModeWithMultipleTriggers.Close>
              </controlledModeWithMultipleTriggers.Actions>
            </controlledModeWithMultipleTriggers.Popup>
          </controlledModeWithMultipleTriggers.Portal>
        </controlledModeWithMultipleTriggers.Root>
      </Story>
      <Story
        id="dialog-inside-scroll-dialog"
        title="insideScrollDialog"
      >
        <insideScrollDialog.Root>
          <insideScrollDialog.Trigger>
            Terms of service
          </insideScrollDialog.Trigger>
          <insideScrollDialog.Portal>
            <insideScrollDialog.Backdrop />
            <insideScrollDialog.Viewport>
              <insideScrollDialog.Popup>
                <insideScrollDialog.Header>
                  <insideScrollDialog.Title>
                    Terms of service
                  </insideScrollDialog.Title>
                </insideScrollDialog.Header>
                <insideScrollDialog.Body>
                  <insideScrollDialog.BodyViewport>
                    <insideScrollDialog.BodyContent>
                      {Array.from({ length: 4 }, (_, index) => (
                        <insideScrollDialog.Section key={index}>
                          <insideScrollDialog.SectionTitle>
                            Section {index + 1}
                          </insideScrollDialog.SectionTitle>
                          <insideScrollDialog.SectionBody>
                            Terms and conditions apply.
                          </insideScrollDialog.SectionBody>
                        </insideScrollDialog.Section>
                      ))}
                    </insideScrollDialog.BodyContent>
                  </insideScrollDialog.BodyViewport>
                  <insideScrollDialog.Scrollbar>
                    <insideScrollDialog.ScrollbarThumb />
                  </insideScrollDialog.Scrollbar>
                </insideScrollDialog.Body>
                <insideScrollDialog.Actions>
                  <insideScrollDialog.Close>Decline</insideScrollDialog.Close>
                  <insideScrollDialog.Close>Accept</insideScrollDialog.Close>
                </insideScrollDialog.Actions>
              </insideScrollDialog.Popup>
            </insideScrollDialog.Viewport>
          </insideScrollDialog.Portal>
        </insideScrollDialog.Root>
      </Story>
      <Story
        id="dialog-nested-dialogs"
        title="nestedDialogs"
      >
        <nestedDialogs.Root>
          <nestedDialogs.Trigger>Notifications</nestedDialogs.Trigger>
          <nestedDialogs.Portal>
            <nestedDialogs.Backdrop />
            <nestedDialogs.Popup>
              <nestedDialogs.Intro>
                <nestedDialogs.Title>Notifications</nestedDialogs.Title>
              </nestedDialogs.Intro>
              <nestedDialogs.Actions>
                <Dialog.Root>
                  <nestedDialogs.GhostButton>
                    Customize
                  </nestedDialogs.GhostButton>
                  <nestedDialogs.Portal>
                    <nestedDialogs.Backdrop />
                    <nestedDialogs.Popup>
                      <nestedDialogs.Intro>
                        <nestedDialogs.Title>Customize</nestedDialogs.Title>
                      </nestedDialogs.Intro>
                      <nestedDialogs.EndActions>
                        <nestedDialogs.Close>Done</nestedDialogs.Close>
                      </nestedDialogs.EndActions>
                    </nestedDialogs.Popup>
                  </nestedDialogs.Portal>
                </Dialog.Root>
              </nestedDialogs.Actions>
            </nestedDialogs.Popup>
          </nestedDialogs.Portal>
        </nestedDialogs.Root>
      </Story>
      <Story
        id="dialog-placing-elements-outside-the-popup"
        title="placingElementsOutsideThePopup"
      >
        <placingElementsOutsideThePopup.Root>
          <placingElementsOutsideThePopup.Trigger>
            View image
          </placingElementsOutsideThePopup.Trigger>
          <placingElementsOutsideThePopup.Portal>
            <placingElementsOutsideThePopup.Backdrop />
            <placingElementsOutsideThePopup.Viewport>
              <placingElementsOutsideThePopup.PopupRoot>
                <placingElementsOutsideThePopup.PopupSurface>
                  <placingElementsOutsideThePopup.Title>
                    Photo
                  </placingElementsOutsideThePopup.Title>
                </placingElementsOutsideThePopup.PopupSurface>
                <placingElementsOutsideThePopup.Close aria-label="Close">
                  <placingElementsOutsideThePopup.XIcon />
                </placingElementsOutsideThePopup.Close>
              </placingElementsOutsideThePopup.PopupRoot>
            </placingElementsOutsideThePopup.Viewport>
          </placingElementsOutsideThePopup.Portal>
        </placingElementsOutsideThePopup.Root>
      </Story>
    </ComponentEntry>
  );
};

const DrawerDemo: FunctionComponent = () => {
  const {
    main,
    position,
    nested,
    snapPoints,
    virtualKeyboardAware,
    // indentEffect,
    nonModal,
    mobileNavigation,
    swipeToOpen,
    closeConfirmation,
    actionSheetWithSeparateDestructiveAction: actionSheet,
  } = Drawer.variants;

  return (
    <ComponentEntry
      id="drawer"
      name="Drawer"
    >
      <Story
        id="drawer-main"
        title="main"
      >
        <main.Root>
          <main.Trigger>Open drawer</main.Trigger>
          <main.Portal>
            <main.Backdrop />
            <main.Viewport>
              <main.Popup>
                <main.Content>
                  <main.Title>Settings</main.Title>
                  <main.Description>Manage your preferences.</main.Description>
                  <main.Actions>
                    <main.Close>Close</main.Close>
                  </main.Actions>
                </main.Content>
              </main.Popup>
            </main.Viewport>
          </main.Portal>
        </main.Root>
      </Story>
      <Story
        id="drawer-position"
        title="position"
      >
        <position.Root>
          <position.Trigger>Open drawer</position.Trigger>
          <position.Portal>
            <position.Backdrop />
            <position.Viewport>
              <position.Popup>
                <position.Handle />
                <position.Title>Settings</position.Title>
                <position.Description>
                  Manage your preferences.
                </position.Description>
                <position.Actions>
                  <position.Close>Close</position.Close>
                </position.Actions>
              </position.Popup>
            </position.Viewport>
          </position.Portal>
        </position.Root>
      </Story>
      <Story
        id="drawer-nested"
        title="nested"
      >
        <nested.Root>
          <nested.Trigger>Open drawer</nested.Trigger>
          <nested.Portal>
            <nested.Backdrop />
            <nested.Viewport>
              <nested.Popup>
                <nested.Handle />
                <nested.Title>Account</nested.Title>
                <nested.Description>Manage your account.</nested.Description>
                <nested.Actions>
                  <nested.ActionsLeft>
                    <Drawer.Root>
                      <nested.Trigger>Security settings</nested.Trigger>
                      <nested.Backdrop />
                      <nested.Viewport>
                        <nested.Popup>
                          <nested.Handle />
                          <nested.Title>Security settings</nested.Title>
                          <nested.List>
                            <li>Two-factor authentication</li>
                            <li>Recovery codes</li>
                          </nested.List>
                        </nested.Popup>
                      </nested.Viewport>
                    </Drawer.Root>
                  </nested.ActionsLeft>
                  <nested.Close>Close</nested.Close>
                </nested.Actions>
              </nested.Popup>
            </nested.Viewport>
          </nested.Portal>
        </nested.Root>
      </Story>
      <Story
        id="drawer-snap-points"
        title="snapPoints"
      >
        <snapPoints.Root>
          <snapPoints.Trigger>Open drawer</snapPoints.Trigger>
          <snapPoints.Portal>
            <snapPoints.Backdrop />
            <snapPoints.Viewport>
              <snapPoints.Popup>
                <snapPoints.DragArea>
                  <snapPoints.Handle />
                  <snapPoints.Title>Playlist</snapPoints.Title>
                </snapPoints.DragArea>
                <snapPoints.Scroll>
                  <snapPoints.Content>
                    <snapPoints.Cards>
                      {[1, 2, 3].map((n) => (
                        <snapPoints.Card key={n} />
                      ))}
                    </snapPoints.Cards>
                  </snapPoints.Content>
                </snapPoints.Scroll>
              </snapPoints.Popup>
            </snapPoints.Viewport>
          </snapPoints.Portal>
        </snapPoints.Root>
      </Story>
      <Story
        id="drawer-virtual-keyboard-aware"
        title="virtualKeyboardAware"
      >
        <virtualKeyboardAware.Provider>
          <virtualKeyboardAware.Root>
            <virtualKeyboardAware.Trigger>
              Open drawer
            </virtualKeyboardAware.Trigger>
            <virtualKeyboardAware.Portal>
              <virtualKeyboardAware.Backdrop />
              <virtualKeyboardAware.Viewport>
                <virtualKeyboardAware.Popup>
                  <virtualKeyboardAware.Header>
                    <virtualKeyboardAware.HeaderActions>
                      <virtualKeyboardAware.HeaderButton>
                        <virtualKeyboardAware.Handle />
                      </virtualKeyboardAware.HeaderButton>
                    </virtualKeyboardAware.HeaderActions>
                    <virtualKeyboardAware.Title>
                      Message
                    </virtualKeyboardAware.Title>
                  </virtualKeyboardAware.Header>
                  <virtualKeyboardAware.Scroll>
                    <virtualKeyboardAware.Form>
                      <virtualKeyboardAware.Field>
                        <virtualKeyboardAware.FieldLabel>
                          To
                        </virtualKeyboardAware.FieldLabel>
                        <virtualKeyboardAware.Input />
                      </virtualKeyboardAware.Field>
                    </virtualKeyboardAware.Form>
                  </virtualKeyboardAware.Scroll>
                  <virtualKeyboardAware.FooterSlot>
                    <virtualKeyboardAware.StickyFooter>
                      <virtualKeyboardAware.Composer>
                        <virtualKeyboardAware.ComposerInput placeholder="Message" />
                      </virtualKeyboardAware.Composer>
                    </virtualKeyboardAware.StickyFooter>
                  </virtualKeyboardAware.FooterSlot>
                </virtualKeyboardAware.Popup>
              </virtualKeyboardAware.Viewport>
            </virtualKeyboardAware.Portal>
          </virtualKeyboardAware.Root>
        </virtualKeyboardAware.Provider>
      </Story>
      {/* <Story
        id="drawer-indent-effect"
        title="indentEffect"
      >
        <indentEffect.Provider>
          <indentEffect.Root>
            <indentEffect.IndentBackground />
            <indentEffect.Indent>
              <indentEffect.Center>
                <indentEffect.Trigger>Open drawer</indentEffect.Trigger>
              </indentEffect.Center>
            </indentEffect.Indent>
            <indentEffect.Portal>
              <indentEffect.Backdrop />
              <indentEffect.Viewport>
                <indentEffect.Popup>
                  <indentEffect.Handle />
                  <indentEffect.Title>Settings</indentEffect.Title>
                  <indentEffect.Description>
                    Manage your preferences.
                  </indentEffect.Description>
                  <indentEffect.Actions>
                    <indentEffect.Close>Close</indentEffect.Close>
                  </indentEffect.Actions>
                </indentEffect.Popup>
              </indentEffect.Viewport>
            </indentEffect.Portal>
          </indentEffect.Root>
        </indentEffect.Provider>
      </Story> */}
      <Story
        id="drawer-non-modal"
        title="nonModal"
      >
        <nonModal.Root modal={false}>
          <nonModal.Trigger>Open drawer</nonModal.Trigger>
          <nonModal.Portal>
            <nonModal.Backdrop />
            <nonModal.Viewport>
              <nonModal.Popup>
                <nonModal.Content>
                  <nonModal.Title>Settings</nonModal.Title>
                  <nonModal.Description>
                    Manage your preferences.
                  </nonModal.Description>
                  <nonModal.Actions>
                    <nonModal.Close>Close</nonModal.Close>
                  </nonModal.Actions>
                </nonModal.Content>
              </nonModal.Popup>
            </nonModal.Viewport>
          </nonModal.Portal>
        </nonModal.Root>
      </Story>
      <Story
        id="drawer-mobile-navigation"
        title="mobileNavigation"
      >
        <mobileNavigation.Root>
          <mobileNavigation.Trigger>Open menu</mobileNavigation.Trigger>
          <mobileNavigation.Portal>
            <mobileNavigation.Backdrop />
            <mobileNavigation.Viewport>
              <mobileNavigation.Popup>
                <mobileNavigation.ScrollAreaRoot>
                  <mobileNavigation.ScrollAreaViewport>
                    <mobileNavigation.ScrollContent>
                      <mobileNavigation.Content>
                        <mobileNavigation.Panel>
                          <mobileNavigation.Header>
                            <mobileNavigation.HeaderSpacer />
                            <mobileNavigation.Handle />
                            <mobileNavigation.CloseButton>
                              <mobileNavigation.XIcon />
                            </mobileNavigation.CloseButton>
                          </mobileNavigation.Header>
                          <mobileNavigation.Title>Menu</mobileNavigation.Title>
                          <mobileNavigation.Description>
                            Browse the site.
                          </mobileNavigation.Description>
                          <mobileNavigation.List>
                            {['Home', 'About', 'Contact'].map((label) => (
                              <mobileNavigation.Item key={label}>
                                <mobileNavigation.Link href="#">
                                  {label}
                                </mobileNavigation.Link>
                              </mobileNavigation.Item>
                            ))}
                          </mobileNavigation.List>
                        </mobileNavigation.Panel>
                      </mobileNavigation.Content>
                    </mobileNavigation.ScrollContent>
                  </mobileNavigation.ScrollAreaViewport>
                  <mobileNavigation.Scrollbar>
                    <mobileNavigation.ScrollbarThumb />
                  </mobileNavigation.Scrollbar>
                </mobileNavigation.ScrollAreaRoot>
              </mobileNavigation.Popup>
            </mobileNavigation.Viewport>
          </mobileNavigation.Portal>
        </mobileNavigation.Root>
      </Story>
      <Story
        id="drawer-swipe-to-open"
        title="swipeToOpen"
      >
        <swipeToOpen.Root>
          <Drawer.Root modal={false}>
            <swipeToOpen.Center>
              <swipeToOpen.Instructions>
                <span>Swipe from the edge</span>
                <swipeToOpen.Hint>
                  Swipe from the right edge to open the drawer.
                </swipeToOpen.Hint>
              </swipeToOpen.Instructions>
            </swipeToOpen.Center>
            <swipeToOpen.SwipeArea>
              <swipeToOpen.SwipeLabel>Swipe</swipeToOpen.SwipeLabel>
            </swipeToOpen.SwipeArea>
            <swipeToOpen.Portal>
              <swipeToOpen.Backdrop />
              <swipeToOpen.Viewport>
                <swipeToOpen.Popup>
                  <swipeToOpen.Content>
                    <swipeToOpen.Title>Settings</swipeToOpen.Title>
                    <swipeToOpen.Description>
                      Manage your preferences.
                    </swipeToOpen.Description>
                    <swipeToOpen.Actions>
                      <swipeToOpen.Close>Close</swipeToOpen.Close>
                    </swipeToOpen.Actions>
                  </swipeToOpen.Content>
                </swipeToOpen.Popup>
              </swipeToOpen.Viewport>
            </swipeToOpen.Portal>
          </Drawer.Root>
        </swipeToOpen.Root>
      </Story>
      <Story
        id="drawer-close-confirmation"
        title="closeConfirmation"
      >
        <closeConfirmation.Root>
          <closeConfirmation.Trigger>Compose</closeConfirmation.Trigger>
          <closeConfirmation.Portal>
            <closeConfirmation.Backdrop />
            <closeConfirmation.Viewport>
              <closeConfirmation.Popup>
                <closeConfirmation.Content>
                  <closeConfirmation.Title>New message</closeConfirmation.Title>
                  <closeConfirmation.TextareaContainer>
                    <closeConfirmation.Textarea placeholder="Write something…" />
                  </closeConfirmation.TextareaContainer>
                  <AlertDialog.Root>
                    <closeConfirmation.Actions>
                      <AlertDialog.Trigger render={<Button />}>
                        Discard
                      </AlertDialog.Trigger>
                    </closeConfirmation.Actions>
                    <closeConfirmation.AlertPopup>
                      <closeConfirmation.Intro>
                        <closeConfirmation.Title>
                          Discard message?
                        </closeConfirmation.Title>
                        <closeConfirmation.Description>
                          You can&rsquo;t undo this action.
                        </closeConfirmation.Description>
                      </closeConfirmation.Intro>
                      <closeConfirmation.Actions>
                        <AlertDialog.Close render={<Button />}>
                          Cancel
                        </AlertDialog.Close>
                        <AlertDialog.Close render={<Button />}>
                          Discard
                        </AlertDialog.Close>
                      </closeConfirmation.Actions>
                    </closeConfirmation.AlertPopup>
                  </AlertDialog.Root>
                </closeConfirmation.Content>
              </closeConfirmation.Popup>
            </closeConfirmation.Viewport>
          </closeConfirmation.Portal>
        </closeConfirmation.Root>
      </Story>
      <Story
        id="drawer-action-sheet-with-separate-destructive-action"
        title="actionSheetWithSeparateDestructiveAction"
      >
        <actionSheet.Root>
          <actionSheet.Trigger>Open</actionSheet.Trigger>
          <actionSheet.Portal>
            <actionSheet.Backdrop />
            <actionSheet.Viewport>
              <actionSheet.Popup>
                <actionSheet.Title>Actions</actionSheet.Title>
                <actionSheet.Description>
                  Choose an action
                </actionSheet.Description>
                <actionSheet.Surface>
                  <actionSheet.Actions>
                    {['Save', 'Duplicate'].map((label) => (
                      <actionSheet.Action key={label}>
                        <actionSheet.ActionButton>
                          {label}
                        </actionSheet.ActionButton>
                      </actionSheet.Action>
                    ))}
                  </actionSheet.Actions>
                </actionSheet.Surface>
                <actionSheet.DangerSurface>
                  <actionSheet.DangerButton>Delete</actionSheet.DangerButton>
                </actionSheet.DangerSurface>
                <actionSheet.Close>Cancel</actionSheet.Close>
              </actionSheet.Popup>
            </actionSheet.Viewport>
          </actionSheet.Portal>
        </actionSheet.Root>
      </Story>
    </ComponentEntry>
  );
};

/* ---------------------------------------------------------------------- */
/* Root                                                                    */
/* ---------------------------------------------------------------------- */

export const DemoFull: FunctionComponent = () => (
  <Page>
    <Sidebar>
      <SidebarTitle>base-ui-styled</SidebarTitle>
      {NAV.map(({ category, items }) => (
        <Fragment key={category}>
          <SidebarCategory>{category}</SidebarCategory>
          {items.map((item) => (
            <SidebarLink
              key={item.id}
              href={`#${item.id}`}
            >
              {item.name}
            </SidebarLink>
          ))}
        </Fragment>
      ))}
    </Sidebar>
    <Main>
      {/* SECTIONS_RENDER_START */}
      <CategoryHeading>Disclosure</CategoryHeading>
      <AccordionDemo />
      <CollapsibleDemo />

      <CategoryHeading>Data display</CategoryHeading>
      <AvatarDemo />

      <CategoryHeading>Buttons &amp; inputs</CategoryHeading>
      <ButtonDemo />
      <CheckboxDemo />
      <CheckboxGroupDemo />
      <InputDemo />
      <NumberFieldDemo />
      <OTPFieldDemo />
      <RadioDemo />
      <SliderDemo />
      <SwitchDemo />
      <ToggleDemo />
      <ToggleGroupDemo />

      <CategoryHeading>Forms</CategoryHeading>
      <FieldDemo />
      <FieldsetDemo />
      <FormDemo />

      <CategoryHeading>Selection / pickers</CategoryHeading>
      <AutocompleteDemo />
      <ComboboxDemo />
      <SelectDemo />

      <CategoryHeading>Navigation &amp; menus</CategoryHeading>
      <MenuDemo />
      <MenubarDemo />
      <ContextMenuDemo />
      <NavigationMenuDemo />
      <ToolbarDemo />

      <CategoryHeading>Layout</CategoryHeading>
      <ScrollAreaDemo />
      <SeparatorDemo />
      <TabsDemo />

      <CategoryHeading>Feedback &amp; status</CategoryHeading>
      <MeterDemo />
      <ProgressDemo />
      <ToastDemo />

      <CategoryHeading>Overlays</CategoryHeading>
      <AlertDialogDemo />
      <DialogDemo />
      <DrawerDemo />
      <PopoverDemo />
      <PreviewCardDemo />
      <TooltipDemo />
      {/* SECTIONS_RENDER_END */}
    </Main>
  </Page>
);
