import { FunctionComponent } from 'preact';

import { Accordion } from '../components/index.js';
import {
  commonPropOptions,
  ComponentEntry,
  MappedProp,
  Story,
  usePropControl,
} from './utils.js';

const propOptions = {
  ...commonPropOptions,
  children: ['Label'] as const,
  disabled: [undefined, false, true] as const,
  // focusableWhenDisabled: [undefined, false, true] as const,
  nativeButton: [undefined, false, true] as const,
  'styled-cursor': [undefined, 'auto', 'pointer', 'copy'] as const,
  onClick: [
    // eslint-disable-next-line no-alert
    new MappedProp(() => alert('alert!'), 'alert!'),
    undefined,
  ] as const,
};

export const AccordionDemo: FunctionComponent = () => {
  const [control, props] = usePropControl(propOptions);

  return (
    <ComponentEntry
      id="accordion"
      name="Accordion"
    >
      <Story control={control}>
        <Accordion.Root {...props}>
          <Accordion.Item value="first">
            <Accordion.Header>
              <Accordion.Trigger>
                What is Base UI?
                <Accordion.Icon />
              </Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Panel>
              <Accordion.Content>
                Base UI is a library of high-quality unstyled React components
                for design systems and web apps.
              </Accordion.Content>
            </Accordion.Panel>
          </Accordion.Item>
          <Accordion.Item value="second">
            <Accordion.Header>
              <Accordion.Trigger>
                How do I get started?
                <Accordion.Icon />
              </Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Panel>
              <Accordion.Content>
                Head to the “Quick start” guide in the docs. If you’ve used
                unstyled libraries before, you’ll feel at home.
              </Accordion.Content>
            </Accordion.Panel>
          </Accordion.Item>
          <Accordion.Item value="third">
            <Accordion.Header>
              <Accordion.Trigger>
                Can I use it for my project?
                <Accordion.Icon />
              </Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Panel>
              <Accordion.Content>
                Of course! Base UI is free and open source.
              </Accordion.Content>
            </Accordion.Panel>
          </Accordion.Item>
        </Accordion.Root>
      </Story>
    </ComponentEntry>
  );
};
