/* eslint-disable @typescript-eslint/no-explicit-any */
import { isObject, objectKeys } from '@mrpelz/misc-utils/oop';
import {
  createContext,
  CSSProperties,
  Dispatch,
  FunctionComponent,
  KeyboardEventHandler,
  PropsWithChildren,
  ReactNode,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import {
  Button,
  ComponentDocsLink,
  ComponentHeader,
  ComponentHeading,
  ComponentId,
  Config,
  ConfigHeading,
  ConfigInner,
  Container,
  Content,
  LogContainer,
  PropContainer,
  Stage,
  StageBackground,
  StageInner,
} from './components.js';
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

const BASE_URL_DOC = 'https://base-ui.com/react/components';

export const useId = (): string => useMemo(() => self.crypto.randomUUID(), []);

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

export const html = String.raw;

export class MappedProp<T> {
  constructor(
    public readonly value: T,
    public readonly label: string,
  ) {}
}

const PropSelectorOption = <T,>({ value }: { value: T }): ReactNode => {
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
  objectKey,
  setState,
  state,
  values,
}: PropsWithChildren<{
  objectKey: Extract<keyof T, string>;
  setState: Dispatch<SetStateAction<PropMapState<T>>>;
  state: PropMapState<T>;
  values: readonly T[keyof T][number][];
}>): ReactNode => {
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
      } catch {
        input.setCustomValidity('enter valid JSON string');
      }
    },
    [displayValue, handleSet, values],
  );

  const onBlur = useCallback(() => {
    applyInput(true);
    inputRef.current?.reportValidity();
  }, [applyInput]);

  const onFocus = useCallback(() => {
    if (!inputRef.current || isCustomValue) return;
    inputRef.current.value = '';
  }, [isCustomValue]);

  const onInput = useCallback(() => {
    applyInput(false);
  }, [applyInput]);

  const onKeyDown = useCallback<KeyboardEventHandler<HTMLInputElement>>(
    (event) => {
      const { currentTarget } = event;

      if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) {
        return;
      }

      const isJsonString = Boolean(displayValue.match(/^".*"$/));

      switch (event.key) {
        case 'Tab': {
          if (currentTarget.value.length > 0) break;

          event.preventDefault();
          currentTarget.value = displayValue;

          if (isJsonString) {
            currentTarget.setSelectionRange(1, displayValue.length - 1);

            break;
          }

          currentTarget.setSelectionRange(0, displayValue.length);
          break;
        }

        case 'Enter': {
          if (!isJsonString) break;

          const cursor = currentTarget.selectionEnd || 1;
          const preCursorValue = currentTarget.value.slice(0, cursor);
          const postCursorValue = currentTarget.value.slice(cursor);

          currentTarget.value = String.raw`${preCursorValue}\n${postCursorValue}`;
          currentTarget.selectionEnd = cursor + 2;
          applyInput(false);

          break;
        }

        default:
      }
    },
    [applyInput, displayValue],
  );

  return (
    <>
      <label htmlFor={inputId}>
        {objectKey}
        {isCustomValue ? '*' : null}
      </label>
      <input
        ref={inputRef}
        autoComplete="off"
        id={inputId}
        list={datalistId}
        name={objectKey}
        value={displayValue}
        onBlur={onBlur}
        onFocus={onFocus}
        onInput={onInput}
        onKeyDown={onKeyDown}
      />
      <datalist id={datalistId}>
        {values.map((optionValue) => (
          <PropSelectorOption<T[keyof T][number]>
            key={optionValue}
            value={optionValue}
          />
        ))}
      </datalist>
      <Button
        disabled={!isModified}
        onClick={() => resetState()}
      >
        ×
      </Button>
    </>
  );
};

export const usePropControl = <T extends PropMap>(
  propMap: T,
  title?: string,
  open?: boolean,
): [ReactNode, ControlledProps<T>, FunctionComponent] => {
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
  ) as ControlledProps<T>;

  const [mount, setMount] = useState(true);
  useLayoutEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- unmounts the demo for one tick to remount it with the new props
    setMount(false);
    queueMicrotask(() => setMount(true));
  }, [mappedState]);

  const Remounter = useCallback<FunctionComponent>(
    ({ children }) => (mount ? children : null),
    [mount],
  );

  return [
    <ConfigInner key={0}>
      <details open={open ?? !title}>
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
        <Button
          disabled={!isModified}
          onClick={resetState}
        >
          Reset
        </Button>
      </details>
    </ConfigInner>,
    mappedState,
    Remounter,
  ] as const;
};

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

type TOptionsContext = {
  id?: string | string[];
  raw?: boolean;
};
const OptionsContext = createContext(undefined as unknown as TOptionsContext);
export const OptionsProvider: FunctionComponent = ({ children }) => {
  const getFragementOptions = useCallback(() => {
    const fragment = new URLSearchParams(location.hash.slice(1));
    const result = {} as any;

    for (const key of fragment.keys()) {
      const values = fragment.getAll(key);
      if (values.length === 0) continue;

      const parsed = values
        .map((value) => {
          try {
            return JSON.parse(value);
          } catch {
            return undefined;
          }
        })
        .filter((value) => value !== undefined);

      result[key] = parsed.length === 1 ? parsed.at(0) : parsed;
    }

    return result as TOptionsContext;
  }, []);

  const [params, setParams] = useState(getFragementOptions);

  useEffect(() => {
    const abort = new AbortController();

    addEventListener(
      'hashchange',
      () => {
        setParams(getFragementOptions());
      },
      { signal: abort.signal },
    );

    return () => abort.abort();
  }, [getFragementOptions]);

  return (
    <OptionsContext.Provider value={params}>{children}</OptionsContext.Provider>
  );
};

type TStageBackgroundContext = [boolean, Dispatch<SetStateAction<boolean>>];
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
  backdrop?: boolean;
  /** Base UI component the demo is built on, for the docs link (if any). */
  baseUiId?: string;
  center?: boolean;
  controls?: ReactNode;
  /** Unique demo id, used for selecting demos (`#id=…`) and storing config. */
  id: string;
  log?: ReactNode;
  stretch?: boolean;
  title: string;
}> = ({
  backdrop = false,
  baseUiId,
  center = false,
  children,
  controls,
  id,
  log,
  stretch = false,
  title,
}) => {
  const options = useContext(OptionsContext);
  const [stageBackground, setStageBackground] = useContext(
    StageBackgroundContext,
  );
  const [isCentered, setIsCentered] = useLocalStorage(`${id}.center`, center);
  const [isStretched, setIsStretched] = useLocalStorage(
    `${id}.stretch`,
    stretch,
  );
  const [hasBackdrop, setHasBackdrop] = useLocalStorage(
    `${id}.backdrop`,
    backdrop,
  );

  const isHidden = useMemo(() => {
    const ids = [options.id].flat().filter((value) => value !== undefined);
    if (ids.length === 0) return false;
    if (ids.includes(id)) return false;

    return true;
  }, [id, options.id]);

  const isRaw = useMemo(() => Boolean(options.raw), [options.raw]);

  if (isHidden) return null;
  if (isRaw) return children;

  return (
    <Container>
      {isRaw ? (
        children
      ) : (
        <Content>
          <ComponentHeader>
            <ComponentHeading>
              {title}
              <ComponentId
                href={`#id=${encodeURIComponent(JSON.stringify(id))}`}
              >
                {id}
              </ComponentId>
            </ComponentHeading>
            {baseUiId === undefined ? null : (
              <ComponentDocsLink
                href={`${BASE_URL_DOC}/${baseUiId}`}
                rel="noreferrer"
                target="_blank"
              >
                base-ui.com/react/components/{baseUiId}
              </ComponentDocsLink>
            )}
          </ComponentHeader>
          <Stage>
            {stageBackground ? <StageBackground /> : null}
            <StageInner
              center={isCentered}
              drawBackdrop={hasBackdrop}
              stretch={isStretched}
            >
              {children}
            </StageInner>
          </Stage>
        </Content>
      )}
      <Config hidden={isRaw}>
        <ConfigInner>
          <ConfigHeading>Config</ConfigHeading>
          <label style={{ display: 'block' }}>
            <input
              checked={stageBackground}
              name="stageBackground"
              type="checkbox"
              onClick={() => setStageBackground(!stageBackground)}
            />
            Stage Background
          </label>
          <label style={{ display: 'block' }}>
            <input
              checked={hasBackdrop}
              name={`${id}.backdrop`}
              type="checkbox"
              onClick={() => setHasBackdrop(!hasBackdrop)}
            />
            Backdrop
          </label>
          <label style={{ display: 'block' }}>
            <input
              checked={isCentered}
              name={`${id}.center`}
              type="checkbox"
              onClick={() => setIsCentered(!isCentered)}
            />
            Center
          </label>
          <label style={{ display: 'block' }}>
            <input
              checked={isStretched}
              name={`${id}.stretch`}
              type="checkbox"
              onClick={() => setIsStretched(!isStretched)}
            />
            Stretch
          </label>
        </ConfigInner>
        {controls}
        {log}
      </Config>
    </Container>
  );
};

export const commonPropOptions = {
  className: [undefined, 'some-custom--class'] as const,
  style: [
    undefined,
    new MappedProp<CSSProperties>(
      { outline: '5px dashed red' },
      '[outline: 5px dashed red]',
    ),
  ] as const,
  render: [undefined, new MappedProp(<main />, '[<main />]')] as const,
};
