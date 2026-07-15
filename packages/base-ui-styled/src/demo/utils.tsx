import { isObject } from '@mrpelz/misc-utils/oop';
import { styled } from 'goober';
import { ComponentChild, FunctionComponent, RenderableProps } from 'preact';
import { forwardRef } from 'preact/compat';
import { Dispatch, StateUpdater, useCallback, useState } from 'preact/hooks';

const ComponentSection = styled('section', forwardRef)`
  margin-bottom: var(--space-12);
`;

const ComponentHeading = styled('h2', forwardRef)`
  margin: 0 0 var(--space-1);
  color: var(--on-surface);
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
  margin: 0 0 var(--space-2);
  color: var(--muted);
  font-family: monospace;
  font-size: var(--text-sm);
  font-weight: var(--font-regular);
`;

const Stage = styled('div', forwardRef)`
  display: flex;
  overflow: auto;
  flex-wrap: wrap;
  align-items: center;
  padding: var(--space-6);
  border: var(--border-width) dashed var(--border-muted);
  gap: var(--space-4);
`;

class PropLiteral {
  // render(): ComponentChild {}
}
export class PropLiteralString extends PropLiteral {}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type PropMap = Record<string, any[]>;

export type ControlledProps<T extends PropMap> = {
  [P in keyof T]: T[P][number];
};

const PropOption = <T extends PropMap>({
  objectKey,
  setState,
  state,
  value,
}: {
  objectKey: string;
  setState: Dispatch<StateUpdater<ControlledProps<T>>>;
  state: ControlledProps<T>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any;
}): ComponentChild => {
  const handleSet = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (setValue?: any) => {
      setState((state_) => ({ ...state_, [objectKey]: setValue ?? value }));
    },
    [objectKey, setState, value],
  );

  if (isObject(value)) {
    if (!(value instanceof PropLiteral)) return null;

    return null;
  }

  const displayValue =
    value === undefined ? 'undefined' : JSON.stringify(value);

  return (
    <label key={value}>
      <input
        checked={state[objectKey] === value}
        name={objectKey}
        type="radio"
        value={displayValue}
        onClick={() => handleSet()}
      />
      {displayValue}
    </label>
  );
};

const Prop = <T extends PropMap>({
  key,
  setState,
  state,
  values,
}: RenderableProps<{
  setState: Dispatch<StateUpdater<ControlledProps<T>>>;
  state: ControlledProps<T>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  values: any[];
}>): ComponentChild => (
  <fieldset key={key}>
    <legend>
      <pre>{key}</pre>
    </legend>
    {values.map((value) => (
      <PropOption<T>
        key={value}
        objectKey={key}
        setState={setState}
        state={state}
        value={value}
      />
    ))}
  </fieldset>
);

export const usePropControl = <T extends PropMap>(
  propMap: T,
): [ComponentChild, ControlledProps<T>] => {
  const [state, setState] = useState(
    () =>
      Object.fromEntries(
        Object.entries(propMap).map(
          ([key, [firstValue]]) => [key, firstValue] as const,
        ),
      ) as {
        [P in keyof T]: T[P][0];
      },
  );

  return [
    <section key={0}>
      {Object.entries(propMap).map(([key, values]) => (
        <Prop<T>
          key={key}
          setState={setState}
          state={state}
          values={values}
        />
      ))}
    </section>,
    state,
  ] as const;
};

export const Story: FunctionComponent<{ id?: string; title: string }> = ({
  id,
  title,
  children,
}) => (
  <VariantBlock id={id}>
    <VariantHeading>{title}</VariantHeading>
    <Stage>{children}</Stage>
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
