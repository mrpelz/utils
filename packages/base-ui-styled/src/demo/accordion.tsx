import { FunctionComponent } from 'preact';

import { Accordion } from '../components/index.js';
import { ComponentEntry, Story } from './utils.js';

const Simple: FunctionComponent = () => (
  <Story title="Simple">
    <Accordion.Root>
      <Accordion.Item value="first">
        <Accordion.Header>
          <Accordion.Trigger>
            What is Base UI?
            <Accordion.Icon />
          </Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Panel>
          <Accordion.Content>
            Base UI is a library of high-quality unstyled React components for
            design systems and web apps.
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
            Head to the “Quick start” guide in the docs. If you’ve used unstyled
            libraries before, you’ll feel at home.
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
);

const Disabled: FunctionComponent = () => (
  <Story title="Disabled">
    <Accordion.Root disabled>
      <Accordion.Item value="first">
        <Accordion.Header>
          <Accordion.Trigger>
            What is Base UI?
            <Accordion.Icon />
          </Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Panel>
          <Accordion.Content>
            Base UI is a library of high-quality unstyled React components for
            design systems and web apps.
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
            Head to the “Quick start” guide in the docs. If you’ve used unstyled
            libraries before, you’ll feel at home.
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
);

const MaxWidth: FunctionComponent = () => (
  <Story title="Max Width">
    <Accordion.Root styled-max-width="20rem">
      <Accordion.Item value="first">
        <Accordion.Header>
          <Accordion.Trigger>
            What is Base UI?
            <Accordion.Icon />
          </Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Panel>
          <Accordion.Content>
            Base UI is a library of high-quality unstyled React components for
            design systems and web apps.
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
            Head to the “Quick start” guide in the docs. If you’ve used unstyled
            libraries before, you’ll feel at home.
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
);

const InitiallyOpen: FunctionComponent = () => (
  <Story title="Initially Open">
    <Accordion.Root defaultValue={['third']}>
      <Accordion.Item value="first">
        <Accordion.Header>
          <Accordion.Trigger>
            What is Base UI?
            <Accordion.Icon />
          </Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Panel>
          <Accordion.Content>
            Base UI is a library of high-quality unstyled React components for
            design systems and web apps.
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
            Head to the “Quick start” guide in the docs. If you’ve used unstyled
            libraries before, you’ll feel at home.
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
);

const Multiple: FunctionComponent = () => (
  <Story title="Multiple and Initially Open">
    <Accordion.Root
      multiple
      defaultValue={['first', 'second']}
    >
      <Accordion.Item value="first">
        <Accordion.Header>
          <Accordion.Trigger>
            What is Base UI?
            <Accordion.Icon />
          </Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Panel>
          <Accordion.Content>
            Base UI is a library of high-quality unstyled React components for
            design systems and web apps.
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
            Head to the “Quick start” guide in the docs. If you’ve used unstyled
            libraries before, you’ll feel at home.
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
);

const CursorOverride: FunctionComponent = () => (
  <Story title="Cursor Override on Last Item">
    <Accordion.Root>
      <Accordion.Item value="first">
        <Accordion.Header>
          <Accordion.Trigger>
            What is Base UI?
            <Accordion.Icon />
          </Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Panel>
          <Accordion.Content>
            Base UI is a library of high-quality unstyled React components for
            design systems and web apps.
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
            Head to the “Quick start” guide in the docs. If you’ve used unstyled
            libraries before, you’ll feel at home.
          </Accordion.Content>
        </Accordion.Panel>
      </Accordion.Item>
      <Accordion.Item value="third">
        <Accordion.Header
          styled-cursor-closed="grab"
          styled-cursor-open="crosshair"
        >
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
);

export const AccordionDemo: FunctionComponent = () => (
  <ComponentEntry
    id="accordion"
    name="Accordion"
  >
    <Simple />
    <Disabled />
    <MaxWidth />
    <InitiallyOpen />
    <Multiple />
    <CursorOverride />
  </ComponentEntry>
);
