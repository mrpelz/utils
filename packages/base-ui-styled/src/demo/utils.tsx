/* eslint-disable @typescript-eslint/no-explicit-any */
import { isObject, objectKeys } from '@mrpelz/misc-utils/oop';
import { styled } from 'goober';
import {
  ComponentChild,
  ComponentChildren,
  CSSProperties,
  FunctionComponent,
  RenderableProps,
} from 'preact';
import { forwardRef } from 'preact/compat';
import {
  Dispatch,
  StateUpdater,
  useCallback,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'preact/hooks';

const ComponentSection = styled('section', forwardRef)`
  margin-bottom: var(--space-12);
  color: var(--on-surface);
`;

const ComponentHeading = styled('h2', forwardRef)`
  margin: 0 0 var(--space-1);
  font-size: var(--text-lg);
  font-weight: var(--font-bold);
`;

const ComponentDocsLink = styled('a', forwardRef)`
  display: inline-block;
  margin-bottom: var(--space-4);
  color: var(--muted);
  font-size: var(--text-sm);
`;

const VariantBlock = styled('div', forwardRef)`
  margin-bottom: var(--space-4);
`;

const VariantHeading = styled('h3', forwardRef)`
  margin: var(--space-2) 0 var(--space-1);
  color: var(--muted);
  font-family: monospace;
  font-size: var(--text-sm);
  font-weight: var(--font-regular);
`;

const Container = styled('div', forwardRef)`
  padding: var(--space-3);
  border: var(--border-width) dashed var(--border-muted);
  gap: var(--space-4);

  & + & {
    border-top: none;
  }
`;

const Stage = styled(Container, forwardRef)`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  padding: var(--space-6);
`;

const Fieldset = styled('fieldset', forwardRef)`
  display: grid;
  flex: 1;
  flex-basis: fit-content;
  padding: var(--space-1);
  border: var(--border-width) dashed var(--border-muted);
  font-family: monospace;
  grid-auto-flow: row;
  white-space: nowrap;

  & > legend:empty {
    padding: 0;

    &::before {
      display: inline-block;
      height: 1ch;
      content: '';
    }
  }
`;

const ResetButton = styled('button', forwardRef)`
  padding: var(--space-2);
  border: var(--border-width) solid var(--subtle);
  border-color: var(--subtle);
  margin: var(--space-6);
  background-color: var(--surface);
  color: var(--subtle);
  place-self: start center;

  &:not([disabled]) {
    border-color: var(--color-red);
    color: var(--color-red);
    cursor: pointer;
  }
`;

const RadioGroup = styled('section', forwardRef)`
  display: grid;
  align-content: start;
`;

const Input = styled('input', forwardRef)`
  width: calc(100% - var(--space-2));
  padding: var(--space-1);
  border: var(--border-width) solid var(--border-muted);
  margin: var(--space-1);
  background-color: var(--surface);
  color: var(--on-surface);
  font-family: monospace;
  place-self: end;

  &[active] {
    outline: var(--focus-ring-width) solid var(--focus-ring-color);
    outline-offset: var(--focus-ring-offset);
  }
`;

const Label = styled('label', forwardRef)`
  display: flex;
  align-items: center;
  padding: var(--space-1);
  cursor: pointer;
`;

export class MappedProp<T> {
  constructor(
    public readonly value: T,
    public readonly label: string,
  ) {}
}

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

export const useId = (): string => useMemo(() => self.crypto.randomUUID(), []);

const PropSelectorOption = <T,>({
  setValue,
  value,
  optionValue,
}: {
  optionValue: any;
  setValue: (value: T) => void;
  value: T;
}): ComponentChild => {
  const handleSet = useCallback(
    () => setValue(optionValue),
    [setValue, optionValue],
  );

  const displayValue = useMemo(() => {
    if (optionValue === undefined) return 'undefined';
    if (optionValue instanceof MappedProp) {
      return `→ \`${optionValue.label}\``;
    }

    return JSON.stringify(optionValue) || optionValue.toString();
  }, [optionValue]);

  return (
    <Label key={optionValue}>
      <input
        checked={value === optionValue}
        type="radio"
        value={displayValue}
        onClick={handleSet}
      />
      {displayValue}
    </Label>
  );
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
  const handleSet = useCallback(
    (value: T[keyof T][number]) => {
      setState((state_) => ({ ...state_, [objectKey]: value }));
    },
    [objectKey, setState],
  );

  const inputRef = useRef<HTMLInputElement>(null);

  const applyInput = useCallback(() => {
    const { current: currentTarget } = inputRef;
    if (!currentTarget) return;

    try {
      currentTarget.setCustomValidity('');

      if (currentTarget.value.length === 0) return;

      handleSet(JSON.parse(currentTarget.value));
    } catch {
      currentTarget.setCustomValidity('enter valid JSON string');
      currentTarget.reportValidity();
    }
  }, [handleSet]);

  const value = useMemo(() => state[objectKey], [objectKey, state]);

  const displayValue = useMemo(() => {
    if (value === undefined) return 'undefined';
    if (value === null) return 'null';
    if (isObject(value) && (value as any) instanceof MappedProp) {
      return '�';
    }

    return JSON.stringify(value) || (value.toString() as string);
  }, [value]);

  return (
    <Fieldset key={key}>
      <legend>{objectKey}</legend>
      <RadioGroup>
        {values.map((optionValue) => (
          <PropSelectorOption<T[keyof T][number]>
            key={optionValue}
            optionValue={optionValue}
            setValue={handleSet}
            value={value}
          />
        ))}
      </RadioGroup>
      <Input
        ref={inputRef}
        name={objectKey}
        placeholder={displayValue}
        onFocus={applyInput}
        onInput={applyInput}
      />
    </Fieldset>
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

  const propsStage = (
    <Stage key={0}>
      {Object.entries(propMapSorted).map(([key, values]) => (
        <PropSelector<T>
          key={key}
          objectKey={key as Extract<keyof T, string>}
          setState={setState}
          state={state}
          values={values}
        />
      ))}
      <Fieldset>
        <legend />
        <ResetButton
          disabled={!isModified}
          onClick={resetState}
        >
          reset all props
        </ResetButton>
      </Fieldset>
    </Stage>
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
    title ? (
      <Container>
        <VariantHeading>{title}</VariantHeading>
        {propsStage}
      </Container>
    ) : (
      propsStage
    ),
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

export const Story: FunctionComponent<{
  controls?: ComponentChildren;
  id?: string;
  title?: string;
}> = ({ controls: control, id, title, children }) => (
  <VariantBlock id={id}>
    {title ? <VariantHeading>{title}</VariantHeading> : null}
    <Stage>{children}</Stage>
    {control}
  </VariantBlock>
);

export const ComponentEntry: FunctionComponent<{
  id: string;
  name: string;
}> = ({ id, name, children }) => (
  <ComponentSection id={id}>
    <ComponentHeading>{name}</ComponentHeading>
    <ComponentDocsLink
      href={`https://base-ui.com/react/components/${id}`}
      rel="noreferrer"
      target="_blank"
    >
      base-ui.com/react/components/{id}
    </ComponentDocsLink>
    {children}
  </ComponentSection>
);
