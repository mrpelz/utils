/* eslint-disable unicorn/prefer-ternary */
/* eslint-disable @typescript-eslint/no-explicit-any */
import './style.css';

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
  useMemo,
  useRef,
  useState,
} from 'react';

import { ColorScheme } from '../../components/utils/main.js';
import { renderCode } from './code.js';
import { CodeView } from './code-view.js';
import { Breadcrumb, Tabs, useEntry } from './entry.js';
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

export const useId = (): string => useMemo(() => crypto.randomUUID(), []);

export const isEqual = <A extends object, B extends A>(a: A, b: B): a is B => {
  if (a === b) return true;

  for (const key of [objectKeys(a), objectKeys(b)].flat()) {
    if (
      !(key in a) ||
      !(key in b) ||
      a[key as keyof A] !== (b[key as keyof B] as unknown as A[keyof A])
    ) {
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
          if (
            !isObject(value_) ||
            !((value_ as any) instanceof MappedProp) ||
            value_.label !== input.value
          ) {
            continue;
          }

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
      <button
        className="demo-button"
        disabled={!isModified}
        onClick={() => resetState()}
      >
        ×
      </button>
    </>
  );
};

const undefinedString = '$undefined';

export const usePropControl = <T extends PropMap>(
  propMap: T,
  title?: string,
  externalState?: unknown,
  open?: boolean,
  /** Outlined by default (e.g. the part a section is about). */
  outlined = false,
): [ReactNode, ControlledProps<T>, object, string] => {
  // With a `style` prop: an outline option, toggled by its checkbox, so
  // the part can be seen (red, as every demo's).
  const outline = useMemo(
    () =>
      'style' in propMap
        ? new MappedProp<CSSProperties>(
            { outline: '2px dashed red', outlineOffset: '2px' },
            '[outline]',
          )
        : undefined,
    [propMap],
  );

  const propMapSorted = useMemo(
    () =>
      Object.fromEntries(
        Object.keys(propMap)
          .toSorted()
          .map(
            (key) =>
              [
                key,
                key === 'style' && outline
                  ? [...(propMap[key] ?? []), outline]
                  : propMap[key],
              ] as const,
          ),
      ) as unknown as T,
    [outline, propMap],
  );

  const initialState = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(propMapSorted).map(
          ([key, [firstValue]]) =>
            [
              key,
              key === 'style' && outlined && outline ? outline : firstValue,
            ] as const,
        ),
      ) as {
        [P in keyof T]: T[P][0];
      },
    [outline, outlined, propMapSorted],
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

          const mappedProp = propMapSorted[key as keyof T]?.find(
            (candidate) => {
              if (
                !(candidate instanceof MappedProp) ||
                candidate.label !== value.slice(1)
              ) {
                return false;
              }

              return true;
            },
          ) as MappedProp<unknown> | undefined;

          return [key, mappedProp] as const;
        }

        return [key, value] as const;
      }),
    ) as {
      [P in keyof T]: T[P][number];
    };
  }, [externalState, initialState, propMapSorted]);

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

  const isOutlined = outline !== undefined && state.style === outline;

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

  // A key for the controlled element: changing with its props, so it
  // mounts anew (e.g. for a `defaultValue`, only read as it mounts).
  // eslint-disable-next-line react-hooks/exhaustive-deps -- new with the props
  const elementKey = useMemo(() => crypto.randomUUID(), [mappedState]);

  return [
    <section
      key={0}
      className="demo-config demo-config-section"
    >
      <details open={open ?? !title}>
        <summary className="demo-config-heading">
          {title ?? 'Props'}
          {outline ? (
            <label className="demo-outline-toggle">
              <input
                checked={isOutlined}
                name="outline"
                type="checkbox"
                onChange={() =>
                  setState((state_) => ({
                    ...state_,
                    style: isOutlined ? undefined : outline,
                  }))
                }
              />
              outline
            </label>
          ) : null}
        </summary>
        <div className="demo-props">
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
        </div>
        <button
          className="demo-button"
          disabled={!isModified}
          onClick={resetState}
        >
          Reset
        </button>
      </details>
    </section>,
    mappedState,
    toExternalState,
    elementKey,
  ] as const;
};

/**
 * A full-page demo's header (as a page's: where it is, its title, its
 * component's pages); hidden inline.
 */
const DemoHeader: FunctionComponent<{
  baseUiId?: string;
  hidden: boolean;
  id: string;
  showId?: string;
  stateUrl?: string;
  title: string;
}> = ({ baseUiId, hidden, id, showId, stateUrl, title }) => {
  const entry = useEntry();

  return (
    <header
      className="demo-header"
      hidden={hidden}
    >
      {entry ? (
        <Breadcrumb
          withComponent
          entry={entry}
        />
      ) : null}
      <h2 className="demo-heading">
        {title}
        {stateUrl ? (
          <a
            className="demo-id"
            href={stateUrl}
            rel="noreferrer"
            target="_blank"
          >
            [{id}]
          </a>
        ) : null}
        {showId ? (
          <>
            <a
              className="demo-id"
              href={`${stateUrl}&raw=true`}
              rel="noreferrer"
              target="_blank"
            >
              [raw]
            </a>
            <a
              className="demo-id"
              onClick={() =>
                setOptions({
                  id: undefined,
                  raw: undefined,
                  state: undefined,
                })
              }
            >
              [x]
            </a>
          </>
        ) : null}
      </h2>
      {entry ? (
        <Tabs
          baseUiId={baseUiId}
          entry={entry}
          tab="all"
        />
      ) : null}
      {!entry && baseUiId !== undefined ? (
        <a
          className="demo-docs-link"
          href={`${BASE_URL_DOC}/${baseUiId}`}
          rel="noreferrer"
          target="_blank"
        >
          base-ui.com/react/components/{baseUiId}
        </a>
      ) : null}
    </header>
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
  /**
   * In a page's flow (e.g. a component's overview), as a section's live
   * view: sized by its content, without a heading of its own.
   */
  inline?: boolean;
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
  inline = false,
  log,
  stateUrl,
  stretch = false,
  title,
}) => {
  const { id: showId, raw } = useOptions();
  // Its settings: its component's, shared by the component's demos on all
  // its pages (see entry.tsx); a demo's own outside of one.
  const entry = useEntry();
  const settings = entry?.id ?? id;
  const [colorScheme, setColorScheme] = useLocalStorage<
    ColorScheme | undefined
  >('colorScheme', undefined);
  const [stageBackground, setStageBackground] = useLocalStorage(
    `${settings}.stageBackground`,
    true,
  );
  const [isCentered, setIsCentered] = useLocalStorage(
    `${settings}.center`,
    center,
  );
  const [isStretched, setIsStretched] = useLocalStorage(
    `${settings}.stretch`,
    stretch,
  );
  const [hasBackdrop, setHasBackdrop] = useLocalStorage(
    `${settings}.backdrop`,
    backdrop,
  );
  const [codeOpen, setCodeOpen] = useLocalStorage(`${settings}.code`, false);
  // (After rendering: rendering to a string resets Preact's hooks state.)
  const [code, setCode] = useState('');
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCode(codeOpen && !raw ? renderCode(children) : '');
  }, [children, codeOpen, raw]);

  const isHidden = useMemo(() => {
    if (showId === undefined || showId === id) return false;

    return true;
  }, [id, showId]);

  if (isHidden) return null;
  if (raw) return children;

  return (
    <div
      className="demo-container"
      data-inline={inline ? '' : undefined}
    >
      <section className="demo-content">
        <DemoHeader
          baseUiId={baseUiId}
          hidden={inline}
          id={id}
          showId={showId}
          stateUrl={stateUrl}
          title={title}
        />
        <div className="demo-stage">
          {stageBackground ? <div className="demo-stage-background" /> : null}
          <div
            className="demo-stage-inner"
            data-backdrop={hasBackdrop ? '' : undefined}
            data-center={isCentered ? '' : undefined}
            data-stretch={isStretched ? '' : undefined}
          >
            {children}
          </div>
        </div>
      </section>
      <aside className="demo-config">
        <section className="demo-config demo-config-section">
          <summary className="demo-config-heading">Config</summary>
          <label style={{ display: 'block' }}>
            Color Scheme{' '}
            <select
              name="colorScheme"
              value={colorScheme}
              onChange={({ currentTarget }) =>
                setColorScheme(
                  (currentTarget.value as ColorScheme) || undefined,
                )
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
              name={`${settings}.stageBackground`}
              type="checkbox"
              onClick={() => setStageBackground(!stageBackground)}
            />
            Stage Background
          </label>
          <label style={{ display: 'block' }}>
            <input
              checked={hasBackdrop}
              name={`${settings}.backdrop`}
              type="checkbox"
              onClick={() => setHasBackdrop(!hasBackdrop)}
            />
            Backdrop
          </label>
          <label style={{ display: 'block' }}>
            <input
              checked={isCentered}
              name={`${settings}.center`}
              type="checkbox"
              onClick={() => setIsCentered(!isCentered)}
            />
            Center
          </label>
          <label style={{ display: 'block' }}>
            <input
              checked={isStretched}
              name={`${settings}.stretch`}
              type="checkbox"
              onClick={() => setIsStretched(!isStretched)}
            />
            Stretch
          </label>
        </section>
        {controls}
        <section className="demo-config demo-config-section">
          <details
            open={codeOpen}
            onToggle={({ currentTarget }) =>
              setCodeOpen((currentTarget as HTMLDetailsElement).open)
            }
          >
            <summary className="demo-config-heading">Code</summary>
            {codeOpen ? <CodeView code={code} /> : null}
          </details>
        </section>
        {log}
      </aside>
    </div>
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
