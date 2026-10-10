/* eslint-disable @typescript-eslint/no-explicit-any */
import { isObject, objectKeys } from '@mrpelz/misc-utils/oop';
import {
  CSSProperties,
  Dispatch,
  FunctionComponent,
  KeyboardEventHandler,
  PropsWithChildren,
  ReactNode,
  SetStateAction,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { ColorScheme } from '../../components/utils.js';
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
  PropContainer,
  Stage,
  StageBackground,
  StageInner,
} from './components.js';
import { setOptions, useOptions } from './options-context.js';
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
  if (a === b) return true;

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
  initialState,
  objectKey,
  setState,
  state,
  values,
}: PropsWithChildren<{
  initialState: PropMapState<T>;
  objectKey: Extract<keyof T, string>;
  setState: Dispatch<SetStateAction<PropMapState<T>>>;
  state: PropMapState<T>;
  values: readonly T[keyof T][number][];
}>): ReactNode => {
  const inputId = useId();
  const datalistId = useId();

  const initialValue = initialState[objectKey];

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

const undefinedString = '$undefined';

export const usePropControl = <T extends PropMap>(
  propMap: T,
  title?: string,
  externalState?: unknown,
  open?: boolean,
): [ReactNode, ControlledProps<T>, object, FunctionComponent] => {
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

  const fromExternalState = useMemo(() => {
    if (!externalState) return undefined;
    if (!isObject(externalState)) return undefined;

    const { $rest, ...externalState_ } = externalState as object & {
      $rest?: true;
    };
    const externalState__ = $rest
      ? { ...initialState, ...externalState_ }
      : externalState_;

    return Object.fromEntries(
      Object.entries(externalState__).map(([key, value]) => {
        if (typeof value !== 'string') {
          return [key, value] as const;
        }

        if (value.startsWith('$')) {
          if (value === undefinedString) {
            return [key, undefined] as const;
          }

          const mappedProp = propMap[key as keyof T]?.find((candidate) => {
            if (!(candidate instanceof MappedProp)) return false;
            if (candidate.label !== value.slice(1)) return false;

            return true;
          }) as MappedProp<unknown> | undefined;

          return [key, mappedProp] as const;
        }

        return [key, value] as const;
      }),
    ) as {
      [P in keyof T]: T[P][number];
    };
  }, [externalState, initialState, propMap]);

  const [state, setState] = useState(fromExternalState ?? initialState);

  useEffect(() => {
    /**
     * legal here because prop control needs to
     * maintain its own state for interactive input
     *
     * externalState is expected to only change when when
     * triggering manual URL fragment updates for test purposes
     */
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setState(fromExternalState ?? initialState);
  }, [fromExternalState, initialState]);

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

  const toExternalState = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(state).map(([key, value]) => {
          if (value === undefined) {
            return [key, undefinedString] as const;
          }

          if (value instanceof MappedProp) {
            return [key, `$${value.label}`] as const;
          }

          return [key, value] as const;
        }),
      ),
    [state],
  ) as object;

  const [mount, setMount] = useState(true);
  useLayoutEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
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
              initialState={initialState}
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
    toExternalState,
    Remounter,
  ] as const;
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
  stateUrl?: string;
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
  stateUrl,
  stretch = false,
  title,
}) => {
  const { colorScheme, id: showId, raw, stageBackground } = useOptions();
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
    if (showId === undefined) return false;
    if (showId === id) return false;

    return true;
  }, [id, showId]);

  if (isHidden) return null;
  if (raw) return children;

  return (
    <Container>
      <Content>
        <ComponentHeader>
          <ComponentHeading>
            {title}
            {stateUrl ? (
              <ComponentId
                href={stateUrl}
                target="_blank"
              >
                [{id}]
              </ComponentId>
            ) : null}
            {showId ? (
              <>
                <ComponentId onClick={() => setOptions({ id, raw: true })}>
                  [raw]
                </ComponentId>
                <ComponentId
                  onClick={() =>
                    setOptions({
                      id: undefined,
                      raw: undefined,
                      state: undefined,
                    })
                  }
                >
                  [x]
                </ComponentId>
              </>
            ) : null}
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
      <Config>
        <ConfigInner>
          <ConfigHeading>Config</ConfigHeading>
          <label style={{ display: 'block' }}>
            Color Scheme{' '}
            <select
              name="colorScheme"
              value={colorScheme ?? ''}
              onChange={({ currentTarget }) =>
                setOptions({
                  colorScheme:
                    (currentTarget.value as ColorScheme | '') || undefined,
                })
              }
            >
              <option value="">[auto]</option>
              <option value="light">light</option>
              <option value="dark">dark</option>
            </select>
          </label>
          <label style={{ display: 'block' }}>
            <input
              checked={stageBackground}
              name="stageBackground"
              type="checkbox"
              onClick={() =>
                setOptions(
                  stageBackground
                    ? { stageBackground: false }
                    : { stageBackground: undefined },
                )
              }
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

/**
 * Remounters of several parts (see `usePropControl`), nested: their
 * children remount when any of the parts' props change (e.g. a part's
 * `defaultValue`, only read as it mounts).
 */
export const Remounters: FunctionComponent<
  PropsWithChildren<{ remounters: FunctionComponent<PropsWithChildren>[] }>
> = ({ children, remounters }) => {
  let nested: ReactNode = children;
  for (const Remounter of remounters.toReversed()) {
    nested = <Remounter>{nested}</Remounter>;
  }

  return nested;
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
