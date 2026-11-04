import { FunctionComponent } from 'react';

import { Button } from '../../../components/index.js';
import { CodeView } from '../../tooling/frame/code-view.js';
import { Component } from '../../tooling/frame/component.js';
import { useLog } from '../../tooling/frame/log.js';
import {
  Contents,
  Heading,
  PartLink,
  type Section,
} from '../../tooling/guide/sections.js';
import { PageShell } from './shell.js';

// A skeleton, to be written: each building block of a prose page once
// (headings, paragraphs, part links, inline code, external links, a code
// block, a live demo), as placeholders.

const sections: readonly Section[] = [
  ['backstory', 'Backstory'],
  ['faq', 'FAQ'],
];

const exampleCode = `import { Button } from '@mrpelz/uikit-ish';

export const Example = () => (
  <Button.Root onClick={() => console.log('pressed')}>
    <Button.Label>Press me</Button.Label>
  </Button.Root>
);`;

/** A placeholder demo: one button, its presses logged. */
const ExampleDemo: FunctionComponent = () => {
  const [log, addLog] = useLog();

  return (
    <Component
      isCentered
      isInline
      id="backstory-example"
      log={log}
      title="Example"
    >
      <Button.Root
        variant="bordered-prominent"
        onClick={() => addLog('pressed')}
      >
        <Button.Label>Press me</Button.Label>
      </Button.Root>
    </Component>
  );
};

/** `/backstory-and-faq`: why this exists, and questions people ask. */
export const BackstoryAndFaqPage: FunctionComponent = () => (
  <PageShell title="Backstory & FAQ">
    <p className="demo-lead">
      Placeholder lead: one or two sentences on what this page is about.
    </p>
    <Contents sections={sections} />

    <Heading
      id="backstory"
      level={2}
    >
      Backstory
    </Heading>
    <p>
      Placeholder paragraph. A sentence with a part link (
      <PartLink
        component="list"
        part="List.Item"
      />
      ), one with <code>inline code</code>, and one with an external link (
      <a href="https://base-ui.com">Base UI</a>).
    </p>
    <h3>A Subheading</h3>
    <p>Placeholder paragraph under a subheading.</p>
    <ul>
      <li>A placeholder list item.</li>
      <li>Another one.</li>
    </ul>
    <CodeView code={exampleCode} />
    <ExampleDemo />

    <Heading
      id="faq"
      level={2}
    >
      FAQ
    </Heading>
    <h3>A Question?</h3>
    <p>Placeholder answer.</p>
    <h3>Another Question?</h3>
    <p>Placeholder answer.</p>
  </PageShell>
);
