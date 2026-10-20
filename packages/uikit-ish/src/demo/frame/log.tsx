import { ComponentChild as ReactNode } from 'preact';
import { useCallback, useRef } from 'react-dom';

import { Tail } from './tail.js';

/** Adds a line to a demo's log. */
export type AddLog = (value: string) => void;

export const useLog = (): [ReactNode, AddLog] => {
  const logContainerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const addLog = useCallback((value: string) => {
    // Also where the log isn't shown (raw demos), e.g. for tests.
    dispatchEvent(new CustomEvent('demo-log', { detail: value }));

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
    <section className="demo-config demo-config-section">
      <summary className="demo-config-heading">Log</summary>
      {/* (Following its last line, see Tail.) */}
      <Tail
        className="demo-log"
        contentRef={logContainerRef}
      />
      <button
        ref={buttonRef}
        disabled
        className="demo-button"
        onClick={resetLogs}
      >
        Clear
      </button>
    </section>
  );

  return [log, addLog] as const;
};
