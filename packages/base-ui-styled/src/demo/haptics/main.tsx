import { styled } from 'goober';
import { FunctionComponent } from 'react';

import { Button, haptics } from '../../components/index.js';
import { useLog } from '../utils/log.js';
import { Component } from '../utils/main.js';
import { kinds } from './props.js';

const Buttons = styled('div')`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 12px;
`;

/**
 * Haptic feedback (`haptics`): taps on iOS (Safari 18 and later, on a
 * user's action) and vibrations on Android.
 */
export const HapticsDemo: FunctionComponent = () => {
  const [log, addLog] = useLog();

  return (
    <Component
      center
      id="haptics"
      log={log}
      title="Haptics"
    >
      <Buttons>
        {kinds.map((kind) => (
          <Button.Root
            key={kind}
            variant="bordered"
            onClick={() => {
              addLog(kind);
              haptics[kind]();
            }}
          >
            <Button.Label>{kind}</Button.Label>
          </Button.Root>
        ))}
      </Buttons>
    </Component>
  );
};
