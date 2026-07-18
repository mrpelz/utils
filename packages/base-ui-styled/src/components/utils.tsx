import { FunctionComponent } from 'preact';
import { useMemo } from 'react-dom';

export const mergeClassNames = (
  ...classNames: (string | undefined)[]
): string | undefined => {
  const result = new Set<string>();

  for (const className of classNames) {
    if (!className?.length) continue;

    for (const singleCSSClass of className.split(' ')) {
      if (singleCSSClass.length === 0) continue;
      if (result.has(singleCSSClass)) continue;

      result.add(singleCSSClass);
    }
  }

  return result.size > 0 ? Array.from(result).join(' ') : undefined;
};

export const mergeProps = <T extends object, P extends object>(
  a: T,
  b: P,
): T & P => {
  const aClassName =
    ('className' in a && typeof a.className === 'string' && a.className) ||
    undefined;

  const bClassName =
    ('className' in b && typeof b.className === 'string' && b.className) ||
    undefined;

  const className = mergeClassNames(aClassName, bClassName);

  return { ...a, ...b, className };
};

export const addProps =
  <UpstreamProps extends object, AdditionalProps extends object>(
    additionalProps: AdditionalProps,
  ): ((props: UpstreamProps) => UpstreamProps & AdditionalProps) =>
  (props) =>
    mergeProps(props, additionalProps);

export type GetAdditionalProps<
  UpstreamProps extends object,
  DownstreamProps extends object,
> = (props: DownstreamProps) => UpstreamProps;

export const wrap = <
  UpstreamProps extends object,
  DownstreamProps extends object,
>(
  UpstreamComponent: FunctionComponent<UpstreamProps>,
  getAdditionalProps: GetAdditionalProps<UpstreamProps, DownstreamProps>,
): FunctionComponent<DownstreamProps> => {
  const DownstreamComponent: FunctionComponent<DownstreamProps> = (props) => {
    const upstreamProps = useMemo(() => getAdditionalProps(props), [props]);

    return <UpstreamComponent {...upstreamProps} />;
  };

  return DownstreamComponent;
};
