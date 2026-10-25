/* eslint-disable unicorn/prefer-ternary */
/* eslint-disable @typescript-eslint/no-explicit-any */

// A demo's prop controls (see `usePropControl`): their state, the
// controlled props, and the controls in its config column.
import { isObject, objectKeys } from '@mrpelz/misc-utils/oop';
import {
  CSSProperties,
  Dispatch,
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

import { overlayProperty, useOverlay } from './overlay.js';

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

const useId = (): string => useMemo(() => crypto.randomUUID(), []);

const isEqual = <A extends object, B extends A>(a: A, b: B): a is B => {
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

export class MappedProp<T> {
  constructor(
    public readonly value: T,
    public readonly label: string,
  ) {}
}

/** A value's display: its label (a mapped prop's), or as JSON. */
const display = (value: unknown): string => {
  if (value === undefined) return 'undefined';
  if (value === null) return 'null';
  if (value instanceof MappedProp) return value.label;

  return JSON.stringify(value) || String(value);
};

/** A JSON string (as typed in a field). */
const jsonString = /^".*"$/;

/** The select's option for a value of one's own (see PropSelector). */
const customOption = '[custom…]';

/**
 * A prop's control: its values listed (a select), or one of one's own
 * (`[custom…]`: a field below it, its value as JSON, or a mapped prop's
 * label), and its reset.
 */
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

  const initialValue = initialState[objectKey];

  const handleSet = useCallback(
    (value: T[keyof T][number]) => {
      setState((state_) => ({ ...state_, [objectKey]: value }));
    },
    [objectKey, setState],
  );

  const value: any = useMemo(() => state[objectKey], [objectKey, state]);

  const isModified = value !== initialValue;
  const index = values.indexOf(value);
  const displayValue = display(value);

  // A value of one's own: its field shown (also when chosen, before it's
  // entered).
  const [isCustom, setIsCustom] = useState(index === -1);
  const isCustomShown = isCustom || index === -1;

  const inputRef = useRef<HTMLInputElement>(null);

  // The field follows the value, unless it's being edited (its JSON as
  // typed, not as reformatted).
  useEffect(() => {
    const { current: input } = inputRef;
    if (!input || input === document.activeElement) return;
    input.value = displayValue;
  }, [displayValue, isCustomShown]);

  const applyInput = useCallback(() => {
    const { current: input } = inputRef;
    if (!input) return;

    try {
      input.setCustomValidity('');

      if (input.value.length === 0) return;

      const mapped = values.find(
        (value_) =>
          (value_ as any) instanceof MappedProp &&
          (value_ as MappedProp<unknown>).label === input.value,
      );
      if (mapped !== undefined) {
        handleSet(mapped);
        return;
      }

      if (input.value === 'undefined') {
        handleSet(undefined);
        return;
      }

      handleSet(JSON.parse(input.value));
    } catch {
      input.setCustomValidity('enter valid JSON string');
    }
  }, [handleSet, values]);

  const onBlur = useCallback(() => {
    const { current: input } = inputRef;
    if (!input) return;
    input.reportValidity();
    if (input.validity.valid) input.value = displayValue;
  }, [displayValue]);

  const onKeyDown = useCallback<KeyboardEventHandler<HTMLInputElement>>(
    (event) => {
      const { currentTarget } = event;

      if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) {
        return;
      }

      // In a JSON string: a line break escaped.
      if (event.key === 'Enter' && jsonString.test(currentTarget.value)) {
        const cursor = currentTarget.selectionEnd || 1;
        const preCursorValue = currentTarget.value.slice(0, cursor);
        const postCursorValue = currentTarget.value.slice(cursor);

        currentTarget.value = String.raw`${preCursorValue}\n${postCursorValue}`;
        currentTarget.selectionEnd = cursor + 2;
        applyInput();
      }
    },
    [applyInput],
  );

  return (
    <>
      <label htmlFor={inputId}>
        {objectKey}
        {index === -1 ? '*' : null}
      </label>
      <select
        id={inputId}
        name={objectKey}
        value={isCustomShown ? customOption : String(index)}
        onChange={({ currentTarget }) => {
          if (currentTarget.value === customOption) {
            setIsCustom(true);
            // (Its text selected, to be typed over.)
            requestAnimationFrame(() => {
              inputRef.current?.focus();
              inputRef.current?.select();
            });
            return;
          }

          setIsCustom(false);
          handleSet(values[Number(currentTarget.value)]);
        }}
      >
        {values.map((optionValue, optionIndex) => (
          <option
            key={display(optionValue)}
            value={String(optionIndex)}
          >
            {display(optionValue)}
          </option>
        ))}
        <option value={customOption}>{customOption}</option>
      </select>
      <button
        className="demo-button"
        disabled={!isModified && !isCustom}
        onClick={() => {
          setIsCustom(false);
          handleSet(initialValue);
        }}
      >
        ×
      </button>
      {isCustomShown ? (
        <input
          ref={inputRef}
          aria-label={`${objectKey} (JSON)`}
          autoComplete="off"
          className="demo-props-custom"
          defaultValue={displayValue}
          name={`${objectKey}.custom`}
          onBlur={onBlur}
          onInput={applyInput}
          onKeyDown={onKeyDown}
        />
      ) : null}
    </>
  );
};

const undefinedString = '$undefined';

export const usePropControl = <T extends PropMap>(
  propMap: T,
  {
    emphasize,
    external: externalState,
    isOpen,
    title,
  }: {
    /**
     * Its part emphasized by default (its `style`'s `[outline]` or
     * `[overlay]`, see below): e.g. the part a section is about; overlaid,
     * a part showing nothing of its own (e.g. a swipe area).
     */
    emphasize?: 'outline' | 'overlay';
    /** Its state from the URL (see `useProvidedState`). */
    external?: unknown;
    /**
     * Open at first (the demo's subject, e.g. the part a section is
     * about); untitled (a demo's only control), it is.
     */
    isOpen?: boolean;
    title?: string;
  } = {},
): [ReactNode, ControlledProps<T>, object, string] => {
  // With a `style` prop: an outline option and an overlay option (the
  // part's box hatched over it, see overlay.ts), each toggled by its
  // checkbox (one at a time), so the part can be seen (red, as every
  // demo's).
  const [outline, overlay] = useMemo(
    () =>
      'style' in propMap
        ? [
            new MappedProp<CSSProperties>(
              { outline: '2px dashed red', outlineOffset: '2px' },
              '[outline]',
            ),
            new MappedProp<CSSProperties>(
              { [overlayProperty]: '1' } as CSSProperties,
              '[overlay]',
            ),
          ]
        : [undefined, undefined],
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
                key === 'style' && outline && overlay
                  ? [...(propMap[key] ?? []), outline, overlay]
                  : propMap[key],
              ] as const,
          ),
      ) as unknown as T,
    [outline, overlay, propMap],
  );

  const initialState = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(propMapSorted).map(
          ([key, [firstValue]]) =>
            [
              key,
              key === 'style' && emphasize
                ? ({ outline, overlay }[emphasize] ?? firstValue)
                : firstValue,
            ] as const,
        ),
      ) as {
        [P in keyof T]: T[P][0];
      },
    [emphasize, outline, overlay, propMapSorted],
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
  const isOverlaid = overlay !== undefined && state.style === overlay;
  useOverlay(isOverlaid);

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
      className="demo-config-section"
    >
      <details open={isOpen ?? !title}>
        <summary className="demo-config-heading">
          {title ?? 'Props'}
          {overlay ? (
            <label className="demo-outline-toggle">
              <input
                checked={isOverlaid}
                name="overlay"
                type="checkbox"
                onChange={() =>
                  setState((state_) => ({
                    ...state_,
                    style: isOverlaid ? undefined : overlay,
                  }))
                }
              />
              overlay
            </label>
          ) : null}
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
