import { sfChevronBackward } from '@bradleyhodges/sfsymbols/sfChevronBackward';
import { sfEllipsis } from '@bradleyhodges/sfsymbols/sfEllipsis';
import { sfFlag } from '@bradleyhodges/sfsymbols/sfFlag';
import { sfFolder } from '@bradleyhodges/sfsymbols/sfFolder';
import { sfSquareAndArrowUp } from '@bradleyhodges/sfsymbols/sfSquareAndArrowUp';
import { sfTrash } from '@bradleyhodges/sfsymbols/sfTrash';
import { FunctionComponent, useMemo } from 'react';

import {
  Button,
  Symbol,
  Toolbar,
  ToolbarButtonProps,
} from '../../../components/index.js';
import { Component } from '../../tooling/frame/component.js';
import { useLog } from '../../tooling/frame/log.js';
import { usePropControl } from '../../tooling/frame/prop-control.js';
import { useProvidedState } from '../../tooling/frame/state.js';
import { PropsTable } from '../../tooling/guide/props-table.js';
import { Heading, PartLink } from '../../tooling/guide/sections.js';
import {
  toolbarButtonRows,
  toolbarGroupRows,
  toolbarInputRows,
  toolbarLeadingRows,
  toolbarLinkRows,
  toolbarRootRows,
  toolbarSeparatorRows,
  toolbarSpacerRows,
  toolbarSubtitleRows,
  toolbarTitleRows,
  toolbarTrailingRows,
} from './docs.js';
import {
  getPropOptionsButton,
  propOptionsGroup,
  propOptionsInput,
  propOptionsLink,
  propOptionsRoot,
  propOptionsSeparator,
  propOptionsSide,
  propOptionsSpacer,
  propOptionsSubtitle,
  propOptionsTitle,
} from './props.js';

/** `Toolbar.Root`, outlined: a back button, a title, two actions. */
const RootPart: FunctionComponent = () => {
  const id = 'toolbar-parts-root';
  const [external] = useProvidedState(id);
  const [control, props, state, elementKey] = usePropControl(propOptionsRoot, {
    external,
    isOpen: true,
    emphasize: 'outline',
    title: 'Toolbar.Root',
  });

  return (
    <Component
      isCentered
      isInline
      controls={[control]}
      id={id}
      state={[state]}
      title="Toolbar.Root"
    >
      <div className="toolbar-demo-bar">
        <Toolbar.Root
          key={elementKey}
          {...props}
        >
          <Toolbar.Leading>
            <Toolbar.Button
              aria-label="Back"
              shape="circle"
            >
              <Button.Icon>
                <Symbol icon={sfChevronBackward} />
              </Button.Icon>
            </Toolbar.Button>
          </Toolbar.Leading>
          <Toolbar.Title>
            <span>Inbox</span>
          </Toolbar.Title>
          <Toolbar.Trailing>
            <Toolbar.Group>
              <Toolbar.Button
                aria-label="Share"
                shape="circle"
              >
                <Button.Icon>
                  <Symbol icon={sfSquareAndArrowUp} />
                </Button.Icon>
              </Toolbar.Button>
              <Toolbar.Button
                aria-label="More"
                shape="circle"
              >
                <Button.Icon>
                  <Symbol icon={sfEllipsis} />
                </Button.Icon>
              </Toolbar.Button>
            </Toolbar.Group>
          </Toolbar.Trailing>
        </Toolbar.Root>
      </div>
    </Component>
  );
};

/** `Toolbar.Leading`, outlined: two buttons at the bar's start. */
const LeadingPart: FunctionComponent = () => {
  const id = 'toolbar-parts-leading';
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(propOptionsSide, {
    external,
    isOpen: true,
    emphasize: 'outline',
    title: 'Toolbar.Leading',
  });

  return (
    <Component
      isCentered
      isInline
      controls={[control]}
      id={id}
      state={[state]}
      title="Toolbar.Leading"
    >
      <div className="toolbar-demo-bar">
        <Toolbar.Root>
          <Toolbar.Leading {...props}>
            <Toolbar.Button
              aria-label="Folders"
              shape="circle"
            >
              <Button.Icon>
                <Symbol icon={sfFolder} />
              </Button.Icon>
            </Toolbar.Button>
            <Toolbar.Button
              aria-label="Flag"
              shape="circle"
            >
              <Button.Icon>
                <Symbol icon={sfFlag} />
              </Button.Icon>
            </Toolbar.Button>
          </Toolbar.Leading>
          <Toolbar.Trailing>
            <Toolbar.Button
              aria-label="Delete"
              shape="circle"
            >
              <Button.Icon>
                <Symbol icon={sfTrash} />
              </Button.Icon>
            </Toolbar.Button>
          </Toolbar.Trailing>
        </Toolbar.Root>
      </div>
    </Component>
  );
};

/** `Toolbar.Trailing`, outlined: a capsule at the bar's end. */
const TrailingPart: FunctionComponent = () => {
  const id = 'toolbar-parts-trailing';
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(propOptionsSide, {
    external,
    isOpen: true,
    emphasize: 'outline',
    title: 'Toolbar.Trailing',
  });

  return (
    <Component
      isCentered
      isInline
      controls={[control]}
      id={id}
      state={[state]}
      title="Toolbar.Trailing"
    >
      <div className="toolbar-demo-bar">
        <Toolbar.Root>
          <Toolbar.Leading>
            <Toolbar.Button
              aria-label="Folders"
              shape="circle"
            >
              <Button.Icon>
                <Symbol icon={sfFolder} />
              </Button.Icon>
            </Toolbar.Button>
          </Toolbar.Leading>
          <Toolbar.Trailing {...props}>
            <Toolbar.Group>
              <Toolbar.Button
                aria-label="Flag"
                shape="circle"
              >
                <Button.Icon>
                  <Symbol icon={sfFlag} />
                </Button.Icon>
              </Toolbar.Button>
              <Toolbar.Button
                aria-label="Delete"
                shape="circle"
              >
                <Button.Icon>
                  <Symbol icon={sfTrash} />
                </Button.Icon>
              </Toolbar.Button>
            </Toolbar.Group>
          </Toolbar.Trailing>
        </Toolbar.Root>
      </div>
    </Component>
  );
};

/** `Toolbar.Spacer`, outlined: between two buttons, without sides. */
const SpacerPart: FunctionComponent = () => {
  const id = 'toolbar-parts-spacer';
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(propOptionsSpacer, {
    external,
    isOpen: true,
    emphasize: 'outline',
    title: 'Toolbar.Spacer',
  });

  return (
    <Component
      isCentered
      isInline
      controls={[control]}
      id={id}
      state={[state]}
      title="Toolbar.Spacer"
    >
      <div className="toolbar-demo-bar">
        <Toolbar.Root>
          <Toolbar.Button
            aria-label="Folders"
            shape="circle"
          >
            <Button.Icon>
              <Symbol icon={sfFolder} />
            </Button.Icon>
          </Toolbar.Button>
          <Toolbar.Spacer {...props} />
          <Toolbar.Button
            aria-label="Delete"
            shape="circle"
          >
            <Button.Icon>
              <Symbol icon={sfTrash} />
            </Button.Icon>
          </Toolbar.Button>
        </Toolbar.Root>
      </div>
    </Component>
  );
};

/** `Toolbar.Group`, outlined: a capsule of three symbols. */
const GroupPart: FunctionComponent = () => {
  const id = 'toolbar-parts-group';
  const [log, addLog] = useLog();
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(propOptionsGroup, {
    external,
    isOpen: true,
    emphasize: 'outline',
    title: 'Toolbar.Group',
  });

  return (
    <Component
      isCentered
      isInline
      controls={[control]}
      id={id}
      log={log}
      state={[state]}
      title="Toolbar.Group"
    >
      <div className="toolbar-demo-bar">
        <Toolbar.Root>
          <Toolbar.Trailing>
            <Toolbar.Group {...props}>
              <Toolbar.Button
                aria-label="Folders"
                shape="circle"
                onClick={() => addLog('Folders clicked')}
              >
                <Button.Icon>
                  <Symbol icon={sfFolder} />
                </Button.Icon>
              </Toolbar.Button>
              <Toolbar.Button
                aria-label="Flag"
                shape="circle"
                onClick={() => addLog('Flag clicked')}
              >
                <Button.Icon>
                  <Symbol icon={sfFlag} />
                </Button.Icon>
              </Toolbar.Button>
              <Toolbar.Button
                aria-label="Delete"
                shape="circle"
                onClick={() => addLog('Delete clicked')}
              >
                <Button.Icon>
                  <Symbol icon={sfTrash} />
                </Button.Icon>
              </Toolbar.Button>
            </Toolbar.Group>
          </Toolbar.Trailing>
        </Toolbar.Root>
      </div>
    </Component>
  );
};

/** `Toolbar.Button`, outlined: of its own (a glass `Button`). */
const ButtonPart: FunctionComponent = () => {
  const id = 'toolbar-parts-button';
  const [log, addLog] = useLog();
  const [external] = useProvidedState(id);
  const [control, buttonProps, state] = usePropControl(
    useMemo(() => getPropOptionsButton(addLog, true), [addLog]),
    { external, isOpen: true, emphasize: 'outline', title: 'Toolbar.Button' },
  );
  // (Of its own: `prominent`, too.)
  const props = buttonProps as ToolbarButtonProps;

  return (
    <Component
      isCentered
      isInline
      controls={[control]}
      id={id}
      log={log}
      state={[state]}
      title="Toolbar.Button"
    >
      <div className="toolbar-demo-bar">
        <Toolbar.Root>
          <Toolbar.Trailing>
            <Toolbar.Button {...props}>
              <Button.Label>Edit</Button.Label>
            </Toolbar.Button>
          </Toolbar.Trailing>
        </Toolbar.Root>
      </div>
    </Component>
  );
};

/** `Toolbar.Title`, outlined, between a back button and an action. */
const TitlePart: FunctionComponent = () => {
  const id = 'toolbar-parts-title';
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(propOptionsTitle, {
    external,
    isOpen: true,
    emphasize: 'outline',
    title: 'Toolbar.Title',
  });

  return (
    <Component
      isCentered
      isInline
      controls={[control]}
      id={id}
      state={[state]}
      title="Toolbar.Title"
    >
      <div className="toolbar-demo-bar">
        <Toolbar.Root placement="block-start">
          <Toolbar.Leading>
            <Toolbar.Button
              aria-label="Back"
              shape="circle"
            >
              <Button.Icon>
                <Symbol icon={sfChevronBackward} />
              </Button.Icon>
            </Toolbar.Button>
          </Toolbar.Leading>
          <Toolbar.Title {...props}>
            <span>Inbox</span>
          </Toolbar.Title>
          <Toolbar.Trailing>
            <Toolbar.Button
              aria-label="More"
              shape="circle"
            >
              <Button.Icon>
                <Symbol icon={sfEllipsis} />
              </Button.Icon>
            </Toolbar.Button>
          </Toolbar.Trailing>
        </Toolbar.Root>
      </div>
    </Component>
  );
};

/** `Toolbar.Subtitle`, outlined, below its title. */
const SubtitlePart: FunctionComponent = () => {
  const id = 'toolbar-parts-subtitle';
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(propOptionsSubtitle, {
    external,
    isOpen: true,
    emphasize: 'outline',
    title: 'Toolbar.Subtitle',
  });

  return (
    <Component
      isCentered
      isInline
      controls={[control]}
      id={id}
      state={[state]}
      title="Toolbar.Subtitle"
    >
      <div className="toolbar-demo-bar">
        <Toolbar.Root placement="block-start">
          <Toolbar.Leading>
            <Toolbar.Button
              aria-label="Back"
              shape="circle"
            >
              <Button.Icon>
                <Symbol icon={sfChevronBackward} />
              </Button.Icon>
            </Toolbar.Button>
          </Toolbar.Leading>
          <Toolbar.Title>
            <span>Inbox</span>
            <Toolbar.Subtitle {...props}>12 unread</Toolbar.Subtitle>
          </Toolbar.Title>
          <Toolbar.Trailing>
            <Toolbar.Button
              aria-label="More"
              shape="circle"
            >
              <Button.Icon>
                <Symbol icon={sfEllipsis} />
              </Button.Icon>
            </Toolbar.Button>
          </Toolbar.Trailing>
        </Toolbar.Root>
      </div>
    </Component>
  );
};

/** Base UI's `Toolbar.Separator`, outlined, between two capsules. */
const SeparatorPart: FunctionComponent = () => {
  const id = 'toolbar-parts-separator';
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(propOptionsSeparator, {
    external,
    isOpen: true,
    emphasize: 'outline',
    title: 'Toolbar.Separator',
  });

  return (
    <Component
      isCentered
      isInline
      controls={[control]}
      id={id}
      state={[state]}
      title="Toolbar.Separator"
    >
      <div className="toolbar-demo-bar">
        <Toolbar.Root>
          <Toolbar.Trailing>
            <Toolbar.Button
              aria-label="Folders"
              shape="circle"
            >
              <Button.Icon>
                <Symbol icon={sfFolder} />
              </Button.Icon>
            </Toolbar.Button>
            <Toolbar.Separator {...props} />
            <Toolbar.Button
              aria-label="Delete"
              shape="circle"
            >
              <Button.Icon>
                <Symbol icon={sfTrash} />
              </Button.Icon>
            </Toolbar.Button>
          </Toolbar.Trailing>
        </Toolbar.Root>
      </div>
    </Component>
  );
};

/** Base UI's `Toolbar.Link`, outlined, at the bar's start. */
const LinkPart: FunctionComponent = () => {
  const id = 'toolbar-parts-link';
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(propOptionsLink, {
    external,
    isOpen: true,
    emphasize: 'outline',
    title: 'Toolbar.Link',
  });

  return (
    <Component
      isCentered
      isInline
      controls={[control]}
      id={id}
      state={[state]}
      title="Toolbar.Link"
    >
      <div className="toolbar-demo-bar">
        <Toolbar.Root>
          <Toolbar.Leading>
            <Toolbar.Link {...props}>Help</Toolbar.Link>
          </Toolbar.Leading>
          <Toolbar.Trailing>
            <Toolbar.Button
              aria-label="Share"
              shape="circle"
            >
              <Button.Icon>
                <Symbol icon={sfSquareAndArrowUp} />
              </Button.Icon>
            </Toolbar.Button>
          </Toolbar.Trailing>
        </Toolbar.Root>
      </div>
    </Component>
  );
};

/** Base UI's `Toolbar.Input`, outlined, between the sides. */
const InputPart: FunctionComponent = () => {
  const id = 'toolbar-parts-input';
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(propOptionsInput, {
    external,
    isOpen: true,
    emphasize: 'outline',
    title: 'Toolbar.Input',
  });

  return (
    <Component
      hasInputGuards
      isCentered
      isInline
      controls={[control]}
      id={id}
      state={[state]}
      title="Toolbar.Input"
    >
      <div className="toolbar-demo-bar">
        <Toolbar.Root>
          <Toolbar.Leading>
            <Toolbar.Button
              aria-label="Folders"
              shape="circle"
            >
              <Button.Icon>
                <Symbol icon={sfFolder} />
              </Button.Icon>
            </Toolbar.Button>
          </Toolbar.Leading>
          <Toolbar.Input
            aria-label="Name"
            placeholder="Name"
            {...props}
          />
          <Toolbar.Trailing>
            <Toolbar.Button
              aria-label="Delete"
              shape="circle"
            >
              <Button.Icon>
                <Symbol icon={sfTrash} />
              </Button.Icon>
            </Toolbar.Button>
          </Toolbar.Trailing>
        </Toolbar.Root>
      </div>
    </Component>
  );
};

/** `/toolbar/parts`: the bar, its sides, capsules, buttons and titles. */
export const ToolbarParts: FunctionComponent = () => (
  <>
    <ul className="demo-lead">
      <li>Root: the bar, its placement and glass context.</li>
      <li>
        Leading and trailing sides holding capsules: buttons of their own, or
        groups of them; a title (or a control) between the sides.
      </li>
      <li>
        Base UI’s separator, link and input are re-exported, unstyled here.
      </li>
      <li>The views show each bar on a page’s background, as behind glass.</li>
    </ul>
    <ul>
      <li>
        <PartLink
          component="toolbar"
          part="Toolbar.Root"
        />
        <ul>
          <li>
            <PartLink
              component="toolbar"
              part="Toolbar.Leading"
            />{' '}
            (optional)
            <ul>
              <li>
                <PartLink
                  component="toolbar"
                  part="Toolbar.Button"
                />{' '}
                (of its own), or
              </li>
              <li>
                <PartLink
                  component="toolbar"
                  part="Toolbar.Group"
                />
                <ul>
                  <li>
                    <PartLink
                      component="toolbar"
                      part="Toolbar.Button"
                    />{' '}
                    (several)
                  </li>
                </ul>
              </li>
            </ul>
          </li>
          <li>
            <PartLink
              component="toolbar"
              part="Toolbar.Title"
            />{' '}
            (optional; or a control, e.g.{' '}
            <PartLink
              component="toolbar"
              part="Toolbar.Input"
            />
            )
            <ul>
              <li>
                <PartLink
                  component="toolbar"
                  part="Toolbar.Subtitle"
                />{' '}
                (optional)
              </li>
            </ul>
          </li>
          <li>
            <PartLink
              component="toolbar"
              part="Toolbar.Trailing"
            />{' '}
            (optional; as{' '}
            <PartLink
              component="toolbar"
              part="Toolbar.Leading"
            >
              Leading
            </PartLink>
            )
          </li>
          <li>
            Also:{' '}
            <PartLink
              component="toolbar"
              part="Toolbar.Spacer"
            />{' '}
            (optional) ,{' '}
            <PartLink
              component="toolbar"
              part="Toolbar.Separator"
            />{' '}
            (optional) ,{' '}
            <PartLink
              component="toolbar"
              part="Toolbar.Link"
            />{' '}
            (optional)
          </li>
        </ul>
      </li>
    </ul>

    <Heading
      id="toolbar-root"
      level={2}
    >
      <code>Toolbar.Root</code>
    </Heading>
    <ul>
      <li>
        The bar (Base UI’s{' '}
        <PartLink
          component="toolbar"
          part="Toolbar.Root"
        />
        , a <code>toolbar</code>): a row, its parts 12px apart (top: 10px).
      </li>
      <li>
        <code>placement</code>: at the bottom (48px capsules, padded for the
        home indicator) or the top (44px capsules, a navigation bar).
      </li>
      <li>
        <code>context</code>: the brightness behind its glass, for the capsules
        in it.
      </li>
      <li>
        Renders a <code>div</code>; placed by what it’s in (a viewport’s anchor,
        a header).
      </li>
    </ul>
    <RootPart />
    <h3>Props</h3>
    <PropsTable rows={toolbarRootRows} />

    <Heading
      id="toolbar-leading"
      level={2}
    >
      <code>Toolbar.Leading</code>
    </Heading>
    <ul>
      <li>
        The bar’s start: its capsules in a row, as wide as they are at least.
      </li>
      <li>
        Shares the free space equally with{' '}
        <PartLink
          component="toolbar"
          part="Toolbar.Trailing"
        >
          Trailing
        </PartLink>
        , so what’s between them is centered in the bar.
      </li>
      <li>
        Renders a <code>div</code> (<code>render</code>).
      </li>
    </ul>
    <LeadingPart />
    <h3>Props</h3>
    <PropsTable rows={toolbarLeadingRows} />

    <Heading
      id="toolbar-trailing"
      level={2}
    >
      <code>Toolbar.Trailing</code>
    </Heading>
    <ul>
      <li>The bar’s end: as Leading, its capsules aligned to the end.</li>
      <li>
        Renders a <code>div</code> (<code>render</code>).
      </li>
    </ul>
    <TrailingPart />
    <h3>Props</h3>
    <PropsTable rows={toolbarTrailingRows} />

    <Heading
      id="toolbar-spacer"
      level={2}
    >
      <code>Toolbar.Spacer</code>
    </Heading>
    <ul>
      <li>
        Free space between parts, e.g. a button at each end without sides (with
        sides, they take the free space).
      </li>
      <li>
        Renders an empty <code>div</code>.
      </li>
    </ul>
    <SpacerPart />
    <h3>Props</h3>
    <PropsTable rows={toolbarSpacerRows} />

    <Heading
      id="toolbar-group"
      level={2}
    >
      <code>Toolbar.Group</code>
    </Heading>
    <ul>
      <li>
        A glass capsule of several buttons (Figma “Button Group”), 6px in from
        its ends (top: 4px), its buttons 12px apart.
      </li>
      <li>
        Pressed, a glass lens (scaled by 1.05), the pressed button on the
        selection.
      </li>
      <li>
        Tinted with <code>prominent</code> or <code>tint</code>, its content
        white (or <code>textColor</code>).
      </li>
      <li>
        Renders a <code>div</code> (Base UI’s{' '}
        <PartLink
          component="toolbar"
          part="Toolbar.Group"
        />
        , a <code>group</code>).
      </li>
    </ul>
    <GroupPart />
    <h3>Props</h3>
    <PropsTable rows={toolbarGroupRows} />

    <Heading
      id="toolbar-button"
      level={2}
    >
      <code>Toolbar.Button</code>
    </Heading>
    <ul>
      <li>
        A <a href="button">Button</a> in the toolbar’s keyboard navigation, with{' '}
        <PartLink
          component="button"
          part="Button.Icon"
        />{' '}
        or{' '}
        <PartLink
          component="button"
          part="Button.Label"
        />{' '}
        content.
      </li>
      <li>
        Of its own: a glass button, as high as the bar’s capsules (a circle for
        a symbol, text 12px from its ends); <code>prominent</code>: tinted.
      </li>
      <li>
        In a{' '}
        <PartLink
          component="toolbar"
          part="Toolbar.Group"
        >
          Group
        </PartLink>
        : 36px, its content in the capsule’s color; the capsule’s glass, not its
        own.
      </li>
      <li>
        Renders a <code>button</code>.
      </li>
    </ul>
    <ButtonPart />
    <h3>Props</h3>
    <PropsTable rows={toolbarButtonRows} />

    <Heading
      id="toolbar-title"
      level={2}
    >
      <code>Toolbar.Title</code>
    </Heading>
    <ul>
      <li>
        The bar’s title (Body Emphasized), centered in the bar; truncated as it
        runs out of space.
      </li>
      <li>
        <code>alignStart</code>: at the bar’s start, taking its free space.
      </li>
      <li>
        Renders a <code>div</code> (<code>render</code>), not a heading.
      </li>
    </ul>
    <TitlePart />
    <h3>Props</h3>
    <PropsTable rows={toolbarTitleRows} />

    <Heading
      id="toolbar-subtitle"
      level={2}
    >
      <code>Toolbar.Subtitle</code>
    </Heading>
    <ul>
      <li>
        Below the title, inside it: 12px (510), the secondary label color.
      </li>
      <li>
        Renders a <code>span</code> (<code>render</code>).
      </li>
    </ul>
    <SubtitlePart />
    <h3>Props</h3>
    <PropsTable rows={toolbarSubtitleRows} />

    <Heading
      id="toolbar-separator"
      level={2}
    >
      <code>Toolbar.Separator</code>
    </Heading>
    <ul>
      <li>
        Base UI’s, re-exported: a <code>separator</code> between items (for
        assistive technology), vertical in a horizontal bar.
      </li>
      <li>
        No styles here (iOS’s bars separate by space): empty, as wide as styled.
      </li>
    </ul>
    <SeparatorPart />
    <h3>Props</h3>
    <PropsTable rows={toolbarSeparatorRows} />

    <Heading
      id="toolbar-link"
      level={2}
    >
      <code>Toolbar.Link</code>
    </Heading>
    <ul>
      <li>
        Base UI’s, re-exported: a link in the toolbar’s keyboard navigation.
      </li>
      <li>
        No styles here: for a button’s look, render a{' '}
        <PartLink
          component="toolbar"
          part="Toolbar.Button"
        />{' '}
        as a link (<code>render</code>,{' '}
        <code>nativeButton=&#123;false&#125;</code>).
      </li>
    </ul>
    <LinkPart />
    <h3>Props</h3>
    <PropsTable rows={toolbarLinkRows} />

    <Heading
      id="toolbar-input"
      level={2}
    >
      <code>Toolbar.Input</code>
    </Heading>
    <ul>
      <li>
        Base UI’s, re-exported: a native input in the toolbar’s keyboard
        navigation (the arrow keys move within its text first).
      </li>
      <li>
        No styles here: for iOS’s search field, a{' '}
        <a href="text-field">Text field</a>’s{' '}
        <PartLink
          component="text-field"
          part="TextField.Search"
        />{' '}
        between the sides (see <a href="toolbar/composition">Composition</a>).
      </li>
    </ul>
    <InputPart />
    <h3>Props</h3>
    <PropsTable rows={toolbarInputRows} />
  </>
);

/** Its live views, also on the component's page of demos (and `/all`). */
export const toolbarPartsDemos = [
  RootPart,
  LeadingPart,
  TrailingPart,
  SpacerPart,
  GroupPart,
  ButtonPart,
  TitlePart,
  SubtitlePart,
  SeparatorPart,
  LinkPart,
  InputPart,
];
