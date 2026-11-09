import { FunctionComponent, ReactNode } from 'react';

import { PagePathContext } from '../../tooling/guide/sections.js';
import { publicUrl } from '../../tooling/public-url.js';

/**
 * A top-level page of prose (getting started, the backstory and FAQ): its
 * breadcrumb and title, its content.
 */
export const PageShell: FunctionComponent<{
  children: ReactNode;
  /** Its path (e.g. `backstory-and-faq`): its demos inline, as a guide page's. */
  path: string;
  title: string;
}> = ({ children, path, title }) => (
  <div className="demo-page demo-prose">
    <nav className="demo-page-nav">
      <a href={publicUrl('./')}>uikit-ish</a> › {title}
    </nav>
    <h1 className="demo-page-title">{title}</h1>
    <PagePathContext.Provider value={path}>{children}</PagePathContext.Provider>
  </div>
);
