import { FunctionComponent, ReactNode } from 'react';

import { publicUrl } from '../../tooling/public-url.js';

/**
 * A top-level page of prose (getting started, the backstory and FAQ): its
 * breadcrumb and title, its content.
 */
export const PageShell: FunctionComponent<{
  children: ReactNode;
  title: string;
}> = ({ children, title }) => (
  <div className="demo-page demo-prose">
    <nav className="demo-page-nav">
      <a href={publicUrl('./')}>uikit-ish</a> › {title}
    </nav>
    <h1 className="demo-page-title">{title}</h1>
    {children}
  </div>
);
