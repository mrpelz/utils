import { FunctionComponent, useMemo } from 'react';

import {
  Button,
  Symbol,
  Toolbar,
  ToolbarButtonProps,
} from '../../../components/index.js';
import { Component } from '../../tooling/frame/component.js';
import { useLog } from '../../tooling/frame/log.js';
import {
  usePartControls,
  usePropControl,
} from '../../tooling/frame/prop-control.js';
import { useProvidedState } from '../../tooling/frame/state.js';
import { PropsTable } from '../../tooling/guide/props-table.js';
import { Heading, PartLink } from '../../tooling/guide/sections.js';
import {
  sfChevronBackward,
  sfEllipsis,
  sfFlag,
  sfFolder,
  sfSquareAndArrowUp,
  sfTrash,
} from '../../tooling/icons.js';
import { publicUrl } from '../../tooling/public-url.js';
import { partPropMaps } from '../part-options.js';
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

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps({
          Symbol: ['icon'],
          'Button.Icon': [],
          'Toolbar.Button': ['aria-label', 'shape'],
          'Toolbar.Group': [],
          'Toolbar.Leading': [],
          'Toolbar.Title': [],
          'Toolbar.Trailing': [],
        }),
      [],
    ),
    { provided: useProvidedState(id) },
  );

  return (
    <Component
      isCentered
      isInline
      controls={[control, partControls]}
      id={id}
      state={[state, partState]}
      title="Toolbar.Root"
    >
      <div className="toolbar-demo-bar">
        <Toolbar.Root
          key={elementKey}
          {...props}
        >
          <Toolbar.Leading {...partProps['Toolbar.Leading']}>
            <Toolbar.Button
              {...partProps['Toolbar.Button']}
              aria-label="Back"
              shape="circle"
            >
              <Button.Icon {...partProps['Button.Icon']}>
                <Symbol
                  {...partProps.Symbol}
                  icon={sfChevronBackward}
                />
              </Button.Icon>
            </Toolbar.Button>
          </Toolbar.Leading>
          <Toolbar.Title {...partProps['Toolbar.Title']}>
            <span>Inbox</span>
          </Toolbar.Title>
          <Toolbar.Trailing {...partProps['Toolbar.Trailing']}>
            <Toolbar.Group {...partProps['Toolbar.Group']}>
              <Toolbar.Button
                {...partProps['Toolbar.Button']}
                aria-label="Share"
                shape="circle"
              >
                <Button.Icon {...partProps['Button.Icon']}>
                  <Symbol
                    {...partProps.Symbol}
                    icon={sfSquareAndArrowUp}
                  />
                </Button.Icon>
              </Toolbar.Button>
              <Toolbar.Button
                {...partProps['Toolbar.Button']}
                aria-label="More"
                shape="circle"
              >
                <Button.Icon {...partProps['Button.Icon']}>
                  <Symbol
                    {...partProps.Symbol}
                    icon={sfEllipsis}
                  />
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

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps({
          Symbol: ['icon'],
          'Button.Icon': [],
          'Toolbar.Button': ['aria-label', 'shape'],
          'Toolbar.Root': [],
          'Toolbar.Trailing': [],
        }),
      [],
    ),
    { provided: useProvidedState(id) },
  );

  return (
    <Component
      isCentered
      isInline
      controls={[control, partControls]}
      id={id}
      state={[state, partState]}
      title="Toolbar.Leading"
    >
      <div className="toolbar-demo-bar">
        <Toolbar.Root {...partProps['Toolbar.Root']}>
          <Toolbar.Leading {...props}>
            <Toolbar.Button
              {...partProps['Toolbar.Button']}
              aria-label="Folders"
              shape="circle"
            >
              <Button.Icon {...partProps['Button.Icon']}>
                <Symbol
                  {...partProps.Symbol}
                  icon={sfFolder}
                />
              </Button.Icon>
            </Toolbar.Button>
            <Toolbar.Button
              {...partProps['Toolbar.Button']}
              aria-label="Flag"
              shape="circle"
            >
              <Button.Icon {...partProps['Button.Icon']}>
                <Symbol
                  {...partProps.Symbol}
                  icon={sfFlag}
                />
              </Button.Icon>
            </Toolbar.Button>
          </Toolbar.Leading>
          <Toolbar.Trailing {...partProps['Toolbar.Trailing']}>
            <Toolbar.Button
              {...partProps['Toolbar.Button']}
              aria-label="Delete"
              shape="circle"
            >
              <Button.Icon {...partProps['Button.Icon']}>
                <Symbol
                  {...partProps.Symbol}
                  icon={sfTrash}
                />
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

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps({
          Symbol: ['icon'],
          'Button.Icon': [],
          'Toolbar.Button': ['aria-label', 'shape'],
          'Toolbar.Group': [],
          'Toolbar.Leading': [],
          'Toolbar.Root': [],
        }),
      [],
    ),
    { provided: useProvidedState(id) },
  );

  return (
    <Component
      isCentered
      isInline
      controls={[control, partControls]}
      id={id}
      state={[state, partState]}
      title="Toolbar.Trailing"
    >
      <div className="toolbar-demo-bar">
        <Toolbar.Root {...partProps['Toolbar.Root']}>
          <Toolbar.Leading {...partProps['Toolbar.Leading']}>
            <Toolbar.Button
              {...partProps['Toolbar.Button']}
              aria-label="Folders"
              shape="circle"
            >
              <Button.Icon {...partProps['Button.Icon']}>
                <Symbol
                  {...partProps.Symbol}
                  icon={sfFolder}
                />
              </Button.Icon>
            </Toolbar.Button>
          </Toolbar.Leading>
          <Toolbar.Trailing {...props}>
            <Toolbar.Group {...partProps['Toolbar.Group']}>
              <Toolbar.Button
                {...partProps['Toolbar.Button']}
                aria-label="Flag"
                shape="circle"
              >
                <Button.Icon {...partProps['Button.Icon']}>
                  <Symbol
                    {...partProps.Symbol}
                    icon={sfFlag}
                  />
                </Button.Icon>
              </Toolbar.Button>
              <Toolbar.Button
                {...partProps['Toolbar.Button']}
                aria-label="Delete"
                shape="circle"
              >
                <Button.Icon {...partProps['Button.Icon']}>
                  <Symbol
                    {...partProps.Symbol}
                    icon={sfTrash}
                  />
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

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps({
          Symbol: ['icon'],
          'Button.Icon': [],
          'Toolbar.Button': ['aria-label', 'shape'],
          'Toolbar.Root': [],
        }),
      [],
    ),
    { provided: useProvidedState(id) },
  );

  return (
    <Component
      isCentered
      isInline
      controls={[control, partControls]}
      id={id}
      state={[state, partState]}
      title="Toolbar.Spacer"
    >
      <div className="toolbar-demo-bar">
        <Toolbar.Root {...partProps['Toolbar.Root']}>
          <Toolbar.Button
            {...partProps['Toolbar.Button']}
            aria-label="Folders"
            shape="circle"
          >
            <Button.Icon {...partProps['Button.Icon']}>
              <Symbol
                {...partProps.Symbol}
                icon={sfFolder}
              />
            </Button.Icon>
          </Toolbar.Button>
          <Toolbar.Spacer {...props} />
          <Toolbar.Button
            {...partProps['Toolbar.Button']}
            aria-label="Delete"
            shape="circle"
          >
            <Button.Icon {...partProps['Button.Icon']}>
              <Symbol
                {...partProps.Symbol}
                icon={sfTrash}
              />
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

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            Symbol: ['icon'],
            'Button.Icon': [],
            'Toolbar.Button': ['aria-label', 'onClick', 'shape'],
            'Toolbar.Root': [],
            'Toolbar.Trailing': [],
          },
          addLog,
        ),
      [addLog],
    ),
    { provided: useProvidedState(id) },
  );

  return (
    <Component
      isCentered
      isInline
      controls={[control, partControls]}
      id={id}
      log={log}
      state={[state, partState]}
      title="Toolbar.Group"
    >
      <div className="toolbar-demo-bar">
        <Toolbar.Root {...partProps['Toolbar.Root']}>
          <Toolbar.Trailing {...partProps['Toolbar.Trailing']}>
            <Toolbar.Group {...props}>
              <Toolbar.Button
                {...partProps['Toolbar.Button']}
                aria-label="Folders"
                shape="circle"
                onClick={() => addLog('Folders clicked')}
              >
                <Button.Icon {...partProps['Button.Icon']}>
                  <Symbol
                    {...partProps.Symbol}
                    icon={sfFolder}
                  />
                </Button.Icon>
              </Toolbar.Button>
              <Toolbar.Button
                {...partProps['Toolbar.Button']}
                aria-label="Flag"
                shape="circle"
                onClick={() => addLog('Flag clicked')}
              >
                <Button.Icon {...partProps['Button.Icon']}>
                  <Symbol
                    {...partProps.Symbol}
                    icon={sfFlag}
                  />
                </Button.Icon>
              </Toolbar.Button>
              <Toolbar.Button
                {...partProps['Toolbar.Button']}
                aria-label="Delete"
                shape="circle"
                onClick={() => addLog('Delete clicked')}
              >
                <Button.Icon {...partProps['Button.Icon']}>
                  <Symbol
                    {...partProps.Symbol}
                    icon={sfTrash}
                  />
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

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            'Button.Label': [],
            'Toolbar.Root': [],
            'Toolbar.Trailing': [],
          },
          addLog,
        ),
      [addLog],
    ),
    { provided: useProvidedState(id) },
  );

  return (
    <Component
      isCentered
      isInline
      controls={[control, partControls]}
      id={id}
      log={log}
      state={[state, partState]}
      title="Toolbar.Button"
    >
      <div className="toolbar-demo-bar">
        <Toolbar.Root {...partProps['Toolbar.Root']}>
          <Toolbar.Trailing {...partProps['Toolbar.Trailing']}>
            <Toolbar.Button {...props}>
              <Button.Label {...partProps['Button.Label']}>Edit</Button.Label>
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

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps({
          Symbol: ['icon'],
          'Button.Icon': [],
          'Toolbar.Button': ['aria-label', 'shape'],
          'Toolbar.Leading': [],
          'Toolbar.Root': ['placement'],
          'Toolbar.Trailing': [],
        }),
      [],
    ),
    { provided: useProvidedState(id) },
  );

  return (
    <Component
      isCentered
      isInline
      controls={[control, partControls]}
      id={id}
      state={[state, partState]}
      title="Toolbar.Title"
    >
      <div className="toolbar-demo-bar">
        <Toolbar.Root
          {...partProps['Toolbar.Root']}
          placement="block-start"
        >
          <Toolbar.Leading {...partProps['Toolbar.Leading']}>
            <Toolbar.Button
              {...partProps['Toolbar.Button']}
              aria-label="Back"
              shape="circle"
            >
              <Button.Icon {...partProps['Button.Icon']}>
                <Symbol
                  {...partProps.Symbol}
                  icon={sfChevronBackward}
                />
              </Button.Icon>
            </Toolbar.Button>
          </Toolbar.Leading>
          <Toolbar.Title {...props}>
            <span>Inbox</span>
          </Toolbar.Title>
          <Toolbar.Trailing {...partProps['Toolbar.Trailing']}>
            <Toolbar.Button
              {...partProps['Toolbar.Button']}
              aria-label="More"
              shape="circle"
            >
              <Button.Icon {...partProps['Button.Icon']}>
                <Symbol
                  {...partProps.Symbol}
                  icon={sfEllipsis}
                />
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

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps({
          Symbol: ['icon'],
          'Button.Icon': [],
          'Toolbar.Button': ['aria-label', 'shape'],
          'Toolbar.Leading': [],
          'Toolbar.Root': ['placement'],
          'Toolbar.Title': [],
          'Toolbar.Trailing': [],
        }),
      [],
    ),
    { provided: useProvidedState(id) },
  );

  return (
    <Component
      isCentered
      isInline
      controls={[control, partControls]}
      id={id}
      state={[state, partState]}
      title="Toolbar.Subtitle"
    >
      <div className="toolbar-demo-bar">
        <Toolbar.Root
          {...partProps['Toolbar.Root']}
          placement="block-start"
        >
          <Toolbar.Leading {...partProps['Toolbar.Leading']}>
            <Toolbar.Button
              {...partProps['Toolbar.Button']}
              aria-label="Back"
              shape="circle"
            >
              <Button.Icon {...partProps['Button.Icon']}>
                <Symbol
                  {...partProps.Symbol}
                  icon={sfChevronBackward}
                />
              </Button.Icon>
            </Toolbar.Button>
          </Toolbar.Leading>
          <Toolbar.Title {...partProps['Toolbar.Title']}>
            <span>Inbox</span>
            <Toolbar.Subtitle {...props}>12 unread</Toolbar.Subtitle>
          </Toolbar.Title>
          <Toolbar.Trailing {...partProps['Toolbar.Trailing']}>
            <Toolbar.Button
              {...partProps['Toolbar.Button']}
              aria-label="More"
              shape="circle"
            >
              <Button.Icon {...partProps['Button.Icon']}>
                <Symbol
                  {...partProps.Symbol}
                  icon={sfEllipsis}
                />
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

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps({
          Symbol: ['icon'],
          'Button.Icon': [],
          'Toolbar.Button': ['aria-label', 'shape'],
          'Toolbar.Root': [],
          'Toolbar.Trailing': [],
        }),
      [],
    ),
    { provided: useProvidedState(id) },
  );

  return (
    <Component
      isCentered
      isInline
      controls={[control, partControls]}
      id={id}
      state={[state, partState]}
      title="Toolbar.Separator"
    >
      <div className="toolbar-demo-bar">
        <Toolbar.Root {...partProps['Toolbar.Root']}>
          <Toolbar.Trailing {...partProps['Toolbar.Trailing']}>
            <Toolbar.Button
              {...partProps['Toolbar.Button']}
              aria-label="Folders"
              shape="circle"
            >
              <Button.Icon {...partProps['Button.Icon']}>
                <Symbol
                  {...partProps.Symbol}
                  icon={sfFolder}
                />
              </Button.Icon>
            </Toolbar.Button>
            <Toolbar.Separator {...props} />
            <Toolbar.Button
              {...partProps['Toolbar.Button']}
              aria-label="Delete"
              shape="circle"
            >
              <Button.Icon {...partProps['Button.Icon']}>
                <Symbol
                  {...partProps.Symbol}
                  icon={sfTrash}
                />
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

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps({
          Symbol: ['icon'],
          'Button.Icon': [],
          'Toolbar.Button': ['aria-label', 'shape'],
          'Toolbar.Leading': [],
          'Toolbar.Root': [],
          'Toolbar.Trailing': [],
        }),
      [],
    ),
    { provided: useProvidedState(id) },
  );

  return (
    <Component
      isCentered
      isInline
      controls={[control, partControls]}
      id={id}
      state={[state, partState]}
      title="Toolbar.Link"
    >
      <div className="toolbar-demo-bar">
        <Toolbar.Root {...partProps['Toolbar.Root']}>
          <Toolbar.Leading {...partProps['Toolbar.Leading']}>
            <Toolbar.Link {...props}>Help</Toolbar.Link>
          </Toolbar.Leading>
          <Toolbar.Trailing {...partProps['Toolbar.Trailing']}>
            <Toolbar.Button
              {...partProps['Toolbar.Button']}
              aria-label="Share"
              shape="circle"
            >
              <Button.Icon {...partProps['Button.Icon']}>
                <Symbol
                  {...partProps.Symbol}
                  icon={sfSquareAndArrowUp}
                />
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

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps({
          Symbol: ['icon'],
          'Button.Icon': [],
          'Toolbar.Button': ['aria-label', 'shape'],
          'Toolbar.Leading': [],
          'Toolbar.Root': [],
          'Toolbar.Trailing': [],
        }),
      [],
    ),
    { provided: useProvidedState(id) },
  );

  return (
    <Component
      hasInputGuards
      isCentered
      isInline
      controls={[control, partControls]}
      id={id}
      state={[state, partState]}
      title="Toolbar.Input"
    >
      <div className="toolbar-demo-bar">
        <Toolbar.Root {...partProps['Toolbar.Root']}>
          <Toolbar.Leading {...partProps['Toolbar.Leading']}>
            <Toolbar.Button
              {...partProps['Toolbar.Button']}
              aria-label="Folders"
              shape="circle"
            >
              <Button.Icon {...partProps['Button.Icon']}>
                <Symbol
                  {...partProps.Symbol}
                  icon={sfFolder}
                />
              </Button.Icon>
            </Toolbar.Button>
          </Toolbar.Leading>
          <Toolbar.Input
            aria-label="Name"
            placeholder="Name"
            {...props}
          />
          <Toolbar.Trailing {...partProps['Toolbar.Trailing']}>
            <Toolbar.Button
              {...partProps['Toolbar.Button']}
              aria-label="Delete"
              shape="circle"
            >
              <Button.Icon {...partProps['Button.Icon']}>
                <Symbol
                  {...partProps.Symbol}
                  icon={sfTrash}
                />
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
      <li>Root: the bar, with its placement and glass context.</li>
      <li>
        Leading and trailing sides hold capsules: buttons on their own, or
        groups of them. A title, or a control, goes between the sides.
      </li>
      <li>
        Base UI’s separator, link and input are re-exported, without styles of
        their own here.
      </li>
      <li>
        The views show each bar over a page’s background, so you can see the
        glass.
      </li>
    </ul>
    <ul className="demo-tree">
      <li className="demo-tree-context">
        <PartLink
          component="viewport"
          part="Viewport.BlockEnd"
        />{' '}
        <span>or</span>{' '}
        <PartLink
          component="viewport"
          part="Viewport.BlockStart"
        />{' '}
        <span>(in a</span>{' '}
        <PartLink
          component="header"
          part="Header.Root"
        />
        <span>)</span>
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
                    (on its own), or
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
                (optional; or a control, for example a{' '}
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
                (optional; like{' '}
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
                />
                ,{' '}
                <PartLink
                  component="toolbar"
                  part="Toolbar.Separator"
                />{' '}
                and{' '}
                <PartLink
                  component="toolbar"
                  part="Toolbar.Link"
                />{' '}
                (all optional)
              </li>
            </ul>
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
        , a <code>toolbar</code>): a row with its parts 12px apart (10px at the
        top).
      </li>
      <li>
        A{' '}
        <PartLink
          component="text-field"
          part="TextField.Root"
        />{' '}
        inside it (for example a search or message field) takes its free space,
        between its buttons. Other controls (for example a{' '}
        <PartLink
          component="segmented"
          part="Segmented.Root"
        />
        ) fill it on their own.
      </li>
      <li>
        <code>placement</code>: at the bottom (48px capsules, padded for the
        home indicator), or at the top (44px capsules, as a navigation bar).
      </li>
      <li>
        <code>context</code>: how bright it is behind its glass, for the
        capsules inside.
      </li>
      <li>
        Renders a <code>div</code>. What it’s in places it: a viewport’s anchor,
        or a header.
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
        The bar’s start: its capsules in a row, at least as wide as they are.
      </li>
      <li>
        It shares the free space equally with{' '}
        <PartLink
          component="toolbar"
          part="Toolbar.Trailing"
        >
          Trailing
        </PartLink>
        , so what’s between them stays centered in the bar.
      </li>
      <li>
        Renders a <code>div</code>, or another element through{' '}
        <code>render</code>.
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
      <li>
        The bar’s end. It works like Leading, with its capsules aligned to the
        end.
      </li>
      <li>
        Renders a <code>div</code>, or another element through{' '}
        <code>render</code>.
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
        Free space between parts, for example to put a button at each end
        without sides. With sides, the sides take the free space.
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
        A glass capsule of several buttons, 6px in from its ends (4px at the
        top), with its buttons 12px apart.
      </li>
      <li>
        When pressed, it turns into a glass lens (scaled by 1.05), with the
        pressed button on the selection.
      </li>
      <li>
        Tinted with <code>prominent</code> or <code>tint</code>, its content
        turns white (or <code>textColor</code>).
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
        A <a href={publicUrl('button')}>Button</a> that takes part in the
        toolbar’s keyboard navigation, with{' '}
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
        On its own, it’s a glass button as tall as the bar’s capsules: a circle
        for a symbol, with text 12px from its ends. <code>prominent</code> tints
        it.
      </li>
      <li>
        In a{' '}
        <PartLink
          component="toolbar"
          part="Toolbar.Group"
        >
          Group
        </PartLink>
        , it’s 36px, with its content in the capsule’s color, on the capsule’s
        glass rather than its own.
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
        The bar’s title (Body Emphasized), centered in the bar. It truncates
        when it runs out of space.
      </li>
      <li>
        <code>alignStart</code> puts it at the bar’s start, taking its free
        space.
      </li>
      <li>
        Renders a <code>div</code>, or another element through{' '}
        <code>render</code>. It’s not a heading.
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
        Sits below the title, inside it: 12px (510), in the secondary label
        color.
      </li>
      <li>
        Renders a <code>span</code>, or another element through{' '}
        <code>render</code>.
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
        Base UI’s, re-exported: a <code>separator</code> between items, for
        assistive technology. It’s vertical in a horizontal bar.
      </li>
      <li>
        It has no styles here, because the bars separate by space. It’s empty,
        and as wide as you style it.
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
        Base UI’s, re-exported: a link that takes part in the toolbar’s keyboard
        navigation.
      </li>
      <li>
        It has no styles here. For a button’s look, render a{' '}
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
        Base UI’s, re-exported: a native input that takes part in the toolbar’s
        keyboard navigation. The arrow keys move within its text first.
      </li>
      <li>
        It has no styles here. For a search field, put a{' '}
        <a href={publicUrl('text-field')}>Text Field</a>’s{' '}
        <PartLink
          component="text-field"
          part="TextField.Frame"
        />{' '}
        between the sides (see{' '}
        <a href={publicUrl('toolbar/composition')}>Composition</a>).
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
