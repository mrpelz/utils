import './style.css';

import { FunctionComponent, useMemo } from 'react';

import { Pager } from '../../../components/index.js';
import { Component } from '../../tooling/frame/component.js';
import { useLog } from '../../tooling/frame/log.js';
import { usePropControl } from '../../tooling/frame/prop-control.js';
import { useProvidedState } from '../../tooling/frame/state.js';
import { PropsTable } from '../../tooling/guide/props-table.js';
import { Heading, PartLink } from '../../tooling/guide/sections.js';
import { pages } from './content.js';
import { pagerPageRows, pagerRootRows } from './docs.js';
import { getPropOptionsRoot, propOptionsPage } from './props.js';

/** `Pager.Root`, outlined, with its props. */
const RootPart: FunctionComponent = () => {
  const id = 'pager-parts-root';
  const [log, addLog] = useLog();
  const [external] = useProvidedState(id);
  const [control, props, state, key] = usePropControl(
    useMemo(() => getPropOptionsRoot(addLog), [addLog]),
    { external, isOpen: true, emphasize: 'outline', title: 'Pager.Root' },
  );

  return (
    <Component
      isCentered
      isInline
      controls={[control]}
      id={id}
      log={log}
      state={[state]}
      title="Pager.Root"
    >
      <div className="pager-demo-frame">
        <Pager.Root
          key={key}
          {...props}
        >
          {pages()}
        </Pager.Root>
      </div>
    </Component>
  );
};

/** `Pager.Page`, outlined (each), with its props. */
const PagePart: FunctionComponent = () => {
  const id = 'pager-parts-page';
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(propOptionsPage, {
    external,
    isOpen: true,
    emphasize: 'outline',
    title: 'Pager.Page',
  });

  return (
    <Component
      isCentered
      isInline
      controls={[control]}
      id={id}
      state={[state]}
      title="Pager.Page"
    >
      <div className="pager-demo-frame">
        <Pager.Root aria-label="Onboarding">{pages(5, props)}</Pager.Root>
      </div>
    </Component>
  );
};

/** `/pager/parts`: the pager and its pages. */
export const PagerParts: FunctionComponent = () => (
  <>
    <ul className="demo-lead">
      <li>Two parts: the pager, and a page for each of its pages.</li>
    </ul>
    <ul className="demo-tree">
      <li>
        <PartLink
          component="pager"
          part="Pager.Root"
        />
        <ul>
          <li>
            <PartLink
              component="pager"
              part="Pager.Page"
            />{' '}
            <span>(one per page)</span>
            <ul>
              <li className="demo-tree-context">
                <span>Any components</span>
              </li>
            </ul>
          </li>
        </ul>
      </li>
    </ul>

    <Heading
      id="pager-root"
      level={2}
    >
      <code>Pager.Root</code>
    </Heading>
    <ul>
      <li>
        The strip of pages, scrolling along its <code>orientation</code> and
        snapping a page at a time.
      </li>
      <li>
        Its state: <code>value</code> or <code>defaultValue</code>, and{' '}
        <code>onValueChange</code> (the page mostly in view, as it’s scrolled).
      </li>
      <li>
        Renders a <code>div</code>: a region, read as a carousel.
      </li>
    </ul>
    <RootPart />
    <h3>Props</h3>
    <PropsTable rows={pagerRootRows} />

    <Heading
      id="pager-page"
      level={2}
    >
      <code>Pager.Page</code>
    </Heading>
    <ul>
      <li>
        One page, as large as the pager. Out of view once the pager is at rest,
        it’s inert.
      </li>
      <li>
        Renders a <code>div</code>: a group read as a slide, named by its place
        (“2 of 5”) unless it has an <code>aria-label</code>.
      </li>
    </ul>
    <PagePart />
    <h3>Props</h3>
    <PropsTable rows={pagerPageRows} />
  </>
);

/** Its live views, also on the component's page of demos (and `/all`). */
export const pagerPartsDemos = [RootPart, PagePart];
