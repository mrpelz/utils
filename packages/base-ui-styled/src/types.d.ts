declare module '*.png' {
  const content: string;
  export default content;
}

declare module 'framework7-icons/react/esm/*.js' {
  import { FunctionComponent, SVGAttributes } from 'react';

  const Icon: FunctionComponent<SVGAttributes<SVGSVGElement>>;
  export default Icon;
}
