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
  min-height: 100svh;
  padding: var(--space-4);
  gap: var(--space-4);
  grid-auto-columns: 1fr;
  grid-template: 'content config' 1fr / 1fr 25em;
  scroll-snap-align: start;
  scroll-snap-stop: always;
`;

const Content = styled('section')`
  position: sticky;
  top: 0;
  display: grid;
  height: 100svh;
  padding: var(--space-4);
  margin: calc(var(--space-4) * -1);
  gap: var(--space-4);
  grid-area: content;
  grid-template: 'head' auto 'stage' 1fr / 1fr;
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
  grid-area: head;
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
  grid-area: stage;
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

const StageInner = styled<{ center: boolean }>('stage-inner')`
  display: block;
  margin: ${({ center }) => (center ? '0 auto' : undefined)};

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
  display: flex;
  flex-direction: column;
  border: var(--border-width) dashed var(--border-muted);
  color: var(--muted);
  color-scheme: dark;
  font-family: monospace;
  font-size: var(--text-sm);
  grid-area: config;
`;

const ConfigInner = styled(Config)`
  display: block;
  padding: var(--space-2);
  border-right: none !important;
  border-left: none !important;

  &[hidden] {
    display: none;
  }

  & + &,
  &:first-child {
    border-top: none;
  }

  &:last-child {
    flex-grow: 1;
    border-bottom: none;
  }
`;

const ConfigHeading = styled('summary')`
  position: sticky;
  top: 0;
  padding: var(--space-2);
  margin: calc(var(--space-2) * -1);
  margin-bottom: var(--space-1);
  background-color: var(--surface);
`;

const PropContainer = styled('prop-container')`
  display: grid;
  gap: var(--space-2);
  grid-template-columns: auto auto min-content;
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

  const [initialValue] = useState(state[objectKey]);

  const handleSet = useCallback(
    (value: T[keyof T][number]) => {
      setState((state_) => ({ ...state_, [objectKey]: value }));
    },
    [objectKey, setState],
  );

  const resetState = useCallback(
    () => handleSet(initialValue),
    [handleSet, initialValue],
  );

  const value: any = useMemo(() => state[objectKey], [objectKey, state]);

  const isModified = useMemo(
    () => value !== initialValue,
    [initialValue, value],
  );
  const isCustomValue = useMemo(() => !values.includes(value), [value, values]);

  const displayValue = useMemo(() => {
    if (value === undefined) return 'undefined';
    if (value === null) return 'null';
    if (value instanceof MappedProp) {
      return value.label;
    }

    return JSON.stringify(value) || value.toString();
  }, [value]);

  const inputRef = useRef<HTMLInputElement>(null);

  const applyInput = useCallback(
    (force: boolean) => {
      const { current: input } = inputRef;
      if (!input) return;

      try {
        input.setCustomValidity('');

        if (input.value.length === 0) {
          if (force) {
            input.value = displayValue;
            input.blur();
          }

          return;
        }

        for (const value_ of values) {
          if (!isObject(value_)) continue;
          if (!((value_ as any) instanceof MappedProp)) continue;
          if (value_.label !== input.value) continue;

          handleSet(value_);
          input.blur();
          return;
        }

        if (input.value === 'undefined') {
          handleSet(undefined);
          input.blur();
          return;
        }

        handleSet(JSON.parse(input.value));
        if (!isCustomValue) input.blur();
      } catch {
        input.setCustomValidity('enter valid JSON string');
      }
    },
    [displayValue, handleSet, isCustomValue, values],
  );

  return (
    <>
      <label
        key={key}
        htmlFor={inputId}
      >
        {objectKey}
        {isCustomValue ? '*' : null}
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
          if (!inputRef.current || isCustomValue) return;
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
      <button
        disabled={!isModified}
        onClick={() => resetState()}
      >
        ×
      </button>
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
      <details>
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
      </details>
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

type TStageBackgroundContext = [boolean, Dispatch<StateUpdater<boolean>>];
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
  center?: boolean;
  controls?: ComponentChildren;
  id: string;
  log?: ComponentChild;
  title: string;
}> = ({ center = false, children, controls, id, log, title }) => {
  const [stageBackground, setStageBackground] = useContext(
    StageBackgroundContext,
  );
  const [isCentered, setIsCentered] = useLocalStorage(`${id}.center`, center);

  return (
    <Container>
      <Content>
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
          <StageInner center={isCentered}>{children}</StageInner>
        </Stage>
      </Content>
      <Config>
        <ConfigInner>
          <ConfigHeading>Config</ConfigHeading>
          <label style={{ display: 'block' }}>
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
          <label style={{ display: 'block' }}>
            <input
              checked={isCentered}
              name={`${id}.center`}
              type="checkbox"
              onClick={useCallback(
                () => setIsCentered(!isCentered),
                [isCentered, setIsCentered],
              )}
            />
            Center
          </label>
        </ConfigInner>
        {controls}
        {log}
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
        Clear
      </button>
    </ConfigInner>
  );

  return [log, addLog] as const;
};
