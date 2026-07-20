/* eslint-disable @typescript-eslint/no-explicit-any */
import { isObject, objectKeys } from '@mrpelz/misc-utils/oop';
import { styled } from 'goober';
import {
  ComponentChild,
  ComponentChildren,
  createContext,
  CSSProperties,
  FunctionComponent,
  RenderableProps,
} from 'preact';
import { forwardRef } from 'preact/compat';
import {
  Dispatch,
  StateUpdater,
  useCallback,
  useContext,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'preact/hooks';

import { useLocalStorage } from './use-local-storage.js';

export type RemappedPropValue<T extends any> =
  T extends MappedProp<infer M> ? M : T;

export type RemappedProp<T extends readonly any[]> = {
  [P in keyof T]: RemappedPropValue<T[P]>;
}[number];

export type PropMap = Record<string, readonly any[]>;

export type PropMapState<T extends PropMap> = {
  [P in keyof T]: T[P][number];
};

export type ControlledProps<T extends PropMap> = {
  [P in keyof T]: RemappedProp<T[P]>;
};

const Container = styled('component')`
  position: relative;
  display: grid;
  width: 100svw;
  height: 100svh;
  padding: var(--space-4);
  gap: var(--space-4);
  grid-auto-columns: 1fr;
  grid-template: '. .' auto '. .' 1fr / 1fr 25rem;
  scroll-snap-align: start;
  scroll-snap-stop: always;

  & + & {
    border-top: var(--border-width) dashed var(--border-muted);
  }
`;

const ComponentHeader = styled('component-header')`
  position: sticky;
  z-index: 1;
  top: 0;
  display: block;
  width: stretch;
  padding: var(--space-4);
  margin: calc(var(--space-4) * -1);
  background-color: var(--surface);
  grid-column: 1 / 3;
`;

const ComponentHeading = styled('h2')`
  margin: 0 0 var(--space-1);
  font-size: var(--text-lg);
  font-weight: var(--font-bold);
`;

const ComponentDocsLink = styled('a')`
  display: inline-block;
  color: var(--muted);
  font-size: var(--text-sm);
`;

const Stage = styled('stage')`
  position: relative;
  display: grid;
  align-items: center;
`;

const StageBackground = styled('stage-background')`
  position: absolute;
  z-index: -1;
  background-image: radial-gradient(
    circle,
    var(--muted) 0.5px,
    transparent 0.5px
  );
  background-position: center center;
  background-repeat: repeat;
  background-size: 9px 9px;
  inset: 0;
  mask-image: radial-gradient(
    ellipse at center,
    rgb(0 0 0) 0%,
    rgb(0 0 0 / 0%) 90%
  );
  mask-repeat: no-repeat;
`;

const StageInner = styled('stage-inner')`
  display: block;

  & > * {
    position: relative;

    &::after {
      position: absolute;
      z-index: -1;
      background-color: var(--surface);
      content: '';
      inset: 0;
    }
  }
`;

const Config = styled('config' as 'section')`
  border: var(--border-width) dashed var(--border-muted);
  color: var(--muted);
  color-scheme: dark;
  font-family: monospace;
  font-size: var(--text-sm);
  overflow-y: auto;
  scroll-snap-type: y mandatory;
`;

const ConfigInner = styled(Config)`
  display: block;
  overflow: visible;
  padding: var(--space-2);
  border-right: none;
  border-left: none;
  scroll-snap-align: start;
  scroll-snap-stop: always;

  &[hidden] {
    display: none;
  }

  & + &,
  &:first-child {
    border-top: none;
  }

  &:last-child {
    border-bottom: none;
  }
`;

const ConfigHeading = styled('h3')`
  position: sticky;
  top: 0;
  padding: var(--space-2);
  margin: calc(var(--space-2) * -1);
  margin-bottom: var(--space-1);
  background-color: var(--surface);
  font-size: var(--text-sm);
  font-weight: var(--font-regular);
`;

const PropContainer = styled('prop-container')`
  display: grid;
  gap: var(--space-2);
  grid-template-columns: auto auto;
  margin-block: var(--space-4);
`;

const LogContainer = styled('log-container' as 'section', forwardRef)`
  display: block;
  margin-block: var(--space-4);
`;

export class MappedProp<T> {
  constructor(
    public readonly value: T,
    public readonly label: string,
  ) {}
}

export const useId = (): string => useMemo(() => self.crypto.randomUUID(), []);

const PropSelectorOption = <T,>({ value }: { value: T }): ComponentChild => {
  const displayValue = useMemo(() => {
    if (value === undefined) return 'undefined';
    if (value === null) return 'null';
    if (value instanceof MappedProp) {
      return value.label;
    }

    return JSON.stringify(value) || value.toString();
  }, [value]);

  return <option value={displayValue} />;
};

const PropSelector = <T extends PropMap>({
  key,
  objectKey,
  setState,
  state,
  values,
}: RenderableProps<{
  objectKey: Extract<keyof T, string>;
  setState: Dispatch<StateUpdater<PropMapState<T>>>;
  state: PropMapState<T>;
  values: readonly T[keyof T][number][];
}>): ComponentChild => {
  const inputId = useId();
  const datalistId = useId();

  const handleSet = useCallback(
    (value: T[keyof T][number]) => {
      setState((state_) => ({ ...state_, [objectKey]: value }));
    },
    [objectKey, setState],
  );

  const inputRef = useRef<HTMLInputElement>(null);

  const applyInput = useCallback(
    (force: boolean) => {
      const { current: input } = inputRef;
      if (!input) return;

      try {
        input.setCustomValidity('');

        if (input.value.length === 0) {
          if (force) {
            handleSet(undefined);
            input.blur();
          }

          return;
        }

        for (const value of values) {
          if (!isObject(value)) continue;
          if (!((value as any) instanceof MappedProp)) continue;
          if (value.label !== input.value) continue;

          handleSet(value);
          input.blur();
          return;
        }

        if (input.value === 'undefined') {
          handleSet(undefined);
          input.blur();
          return;
        }

        handleSet(JSON.parse(input.value));
        input.blur();
      } catch {
        input.setCustomValidity('enter valid JSON string');
      }
    },
    [handleSet, values],
  );

  const value: any = useMemo(() => state[objectKey], [objectKey, state]);

  const displayValue = useMemo(() => {
    if (value === undefined) return 'undefined';
    if (value === null) return 'null';
    if (value instanceof MappedProp) {
      return value.label;
    }

    return JSON.stringify(value) || value.toString();
  }, [value]);

  return (
    <>
      <label
        key={key}
        htmlFor={inputId}
      >
        {objectKey}
      </label>
      <input
        ref={inputRef}
        id={inputId}
        list={datalistId}
        name={objectKey}
        value={displayValue}
        onBlur={() => {
          applyInput(true);
          inputRef.current?.reportValidity();
        }}
        onFocus={() => {
          if (!inputRef.current) return;
          inputRef.current.value = '';
        }}
        onInput={() => {
          applyInput(false);
        }}
      />
      <datalist id={datalistId}>
        {values.map((optionValue) => (
          <PropSelectorOption<T[keyof T][number]>
            key={optionValue}
            value={optionValue}
          />
        ))}
      </datalist>
    </>
  );
};

export const isEqual = <A extends object, B extends A>(a: A, b: B): a is B => {
  for (const key of [objectKeys(a), objectKeys(b)].flat()) {
    if (!(key in a)) return false;
    if (!(key in b)) return false;

    if (a[key as keyof A] !== (b[key as keyof B] as unknown as A[keyof A])) {
      return false;
    }
  }

  return true;
};

export const usePropControl = <T extends PropMap>(
  propMap: T,
  title?: string,
): [ComponentChild, ControlledProps<T>, FunctionComponent] => {
  const propMapSorted = useMemo(
    () =>
      Object.fromEntries(
        Object.keys(propMap)
          .toSorted()
          .map((key) => [key, propMap[key]] as const),
      ) as T,
    [propMap],
  );

  const initialState = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(propMapSorted).map(
          ([key, [firstValue]]) => [key, firstValue] as const,
        ),
      ) as {
        [P in keyof T]: T[P][0];
      },
    [propMapSorted],
  );
  const [state, setState] = useState(initialState);

  const isModified = useMemo(
    () => !isEqual(initialState, state),
    [initialState, state],
  );

  const resetState = useCallback(() => setState(initialState), [initialState]);

  const mappedState = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(state).map(
          ([key, value]) =>
            [key, value instanceof MappedProp ? value.value : value] as const,
        ),
      ),
    [state],
  );

  const [mount, setMount] = useState(true);
  useLayoutEffect(() => {
    setMount(false);
    queueMicrotask(() => setMount(true));
  }, [state]);

  const Remounter: FunctionComponent = mount
    ? ({ children }) => <>{children}</>
    : () => null;

  return [
    <ConfigInner key={0}>
      <ConfigHeading>{title ?? 'Props'}</ConfigHeading>
      <PropContainer>
        {Object.entries(propMapSorted).map(([key, values]) => (
          <PropSelector<T>
            key={key}
            objectKey={key as Extract<keyof T, string>}
            setState={setState}
            state={state}
            values={values}
          />
        ))}
      </PropContainer>
      <button
        disabled={!isModified}
        onClick={resetState}
      >
        Reset
      </button>
    </ConfigInner>,
    mappedState as ControlledProps<T>,
    Remounter,
  ] as const;
};

export const commonPropOptions = {
  className: [undefined, 'some-custom--class'] as const,
  style: [
    undefined,
    new MappedProp<CSSProperties>(
      { outline: '5px dashed red' },
      'outline: 5px dashed red',
    ),
  ] as const,
  render: [undefined, new MappedProp(<main />, '<main />')] as const,
};

type TStageBackgroundContext = [
  boolean | undefined,
  Dispatch<StateUpdater<boolean | undefined>>,
];
const StageBackgroundContext = createContext(
  undefined as unknown as TStageBackgroundContext,
);
export const StageBackgroundProvider: FunctionComponent = ({ children }) => {
  const value = useLocalStorage('stage-background', true);

  return (
    <StageBackgroundContext.Provider value={value}>
      {children}
    </StageBackgroundContext.Provider>
  );
};

export const Component: FunctionComponent<{
  controls?: ComponentChildren;
  id: string;
  log?: ComponentChild;
  title: string;
}> = ({ children, controls, id, log, title }) => {
  const [stageBackground, setStageBackground] = useContext(
    StageBackgroundContext,
  );

  return (
    <Container>
      <ComponentHeader>
        <ComponentHeading>{title}</ComponentHeading>
        <ComponentDocsLink
          href={`https://base-ui.com/react/components/${id}`}
          rel="noreferrer"
          target="_blank"
        >
          base-ui.com/react/components/{id}
        </ComponentDocsLink>
      </ComponentHeader>
      <Stage>
        {stageBackground ? <StageBackground /> : null}
        <StageInner>{children}</StageInner>
      </Stage>
      <Config>
        <ConfigInner>
          <ConfigHeading>Config</ConfigHeading>
          <label>
            <input
              checked={stageBackground}
              name="stageBackground"
              type="checkbox"
              onClick={useCallback(
                () => setStageBackground(!stageBackground),
                [setStageBackground, stageBackground],
              )}
            />
            Stage Background
          </label>
        </ConfigInner>
        {log}
        {controls}
      </Config>
    </Container>
  );
};

export const useLog = (): [ComponentChild, (value: string) => void] => {
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
      <button
        ref={buttonRef}
        disabled
        onClick={resetLogs}
      >
        Reset
      </button>
    </ConfigInner>
  );

  return [log, addLog] as const;
};
