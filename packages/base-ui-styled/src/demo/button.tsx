import { FunctionComponent } from 'preact';
import { useState } from 'preact/hooks';

import { Button } from '../components/index.js';
import { ComponentEntry, Story } from './utils.js';

const Simple: FunctionComponent = () => (
  <Story title="Simple">
    <Button>Simple</Button>
  </Story>
);

const Submit: FunctionComponent = () => (
  <Story title="Submit">
    <Button type="submit">Submit</Button>
  </Story>
);

const Disabled: FunctionComponent = () => (
  <Story title="Disabled">
    <Button disabled>Simple</Button>
  </Story>
);

const OverrideCursorAuto: FunctionComponent = () => (
  <Story title="Override Cursor 'auto'">
    <Button styled-cursor="auto">Simple</Button>
  </Story>
);

const OverrideCursorZoomIn: FunctionComponent = () => (
  <Story title="Override Cursor 'zoom-in'">
    <Button styled-cursor="zoom-in">Simple</Button>
  </Story>
);

const RenderingAnotherTag: FunctionComponent = () => (
  <Story title="Rendering as Another Tag">
    <Button
      nativeButton={false}
      render={<div />}
    >
      Button that can contain complex children
    </Button>
  </Story>
);

const LoadingStateWithoutLoosingFocus: FunctionComponent = () => {
  const [loading, setLoading] = useState(false);

  return (
    <Story title="Loading State Without Loosing Focus">
      <Button
        focusableWhenDisabled
        disabled={loading}
        onClick={() => {
          setLoading(true);
          setTimeout(() => {
            setLoading(false);
          }, 4000);
        }}
      >
        {loading ? 'Submitting' : 'Submit'}
      </Button>
    </Story>
  );
};

export const ButtonDemo: FunctionComponent = () => (
  <ComponentEntry
    id="button"
    name="Button"
  >
    <Simple />
    <Disabled />
    <Submit />
    <OverrideCursorAuto />
    <OverrideCursorZoomIn />
    <RenderingAnotherTag />
    <LoadingStateWithoutLoosingFocus />
  </ComponentEntry>
);
