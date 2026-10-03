import { ComponentChild as ReactNode } from 'preact';
import { useCallback, useRef } from 'react-dom';

import {
  Button,
  ConfigHeading,
  ConfigInner,
  LogContainer,
} from './components.js';

export const useLog = (): [ReactNode, (value: string) => void] => {
  const logContainerRef = useRef<HTMLElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const addLog = useCallback((value: string) => {
    const { current: logContainer } = logContainerRef;
    if (!logContainer) return;

    buttonRef.current?.removeAttribute('disabled');

    const date = new Date();

    const line = document.createElement('pre');
    line.append(
      `${date.toLocaleTimeString(undefined, { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })} | ${value}`,
    );

    logContainer.append(line);
  }, []);

  const resetLogs = useCallback(() => {
    const { current: logContainer } = logContainerRef;
    if (!logContainer) return;

    buttonRef.current?.setAttribute('disabled', '');

    const range = document.createRange();
    range.selectNodeContents(logContainer);
    range.deleteContents();
  }, []);

  const log = (
    <ConfigInner>
      <ConfigHeading>Log</ConfigHeading>
      <LogContainer ref={logContainerRef} />
      <Button
        ref={buttonRef}
        disabled
        onClick={resetLogs}
      >
        Clear
      </Button>
    </ConfigInner>
  );

  return [log, addLog] as const;
};
