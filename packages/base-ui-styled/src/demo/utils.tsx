/* ---------------------------------------------------------------------- */
/* Page chrome — demo-only layout, not part of the library's public API.  */
/* ---------------------------------------------------------------------- */

import { styled } from 'goober';
import { FunctionComponent } from 'preact';
import { forwardRef } from 'preact/compat';

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
