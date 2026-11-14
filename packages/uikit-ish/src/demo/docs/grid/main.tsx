import './style.css';

import { FunctionComponent, useMemo, useState } from 'react';

import {
  Button,
  Grid,
  type GridSize,
  Page,
  Viewport,
} from '../../../components/index.js';
import { Component } from '../../tooling/frame/component.js';
import { useLog } from '../../tooling/frame/log.js';
import {
  usePartControls,
  usePropControl,
} from '../../tooling/frame/prop-control.js';
import { useProvidedState } from '../../tooling/frame/state.js';
import { partPropMaps } from '../part-options.js';
import { type Device, devices, deviceSizes, rooms } from './content.js';
import { propOptionsRoot } from './props.js';

/**
 * A phone: a home's devices by room, Edit and Done above them (and the
 * root's every prop); in edit mode, tiles moved within and between rooms
 * and resized (their sizes the app's, stored).
 */
export const GridDemo: FunctionComponent = () => {
  const id = 'grid';
  const [log, addLog] = useLog();
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(propOptionsRoot, {
    external,
    isOpen: true,
    title: 'Grid.Root',
  });
  const [editing, setEditing] = useState(false);
  const [byRoom, setByRoom] = useState<
    Readonly<Record<string, readonly Device[]>>
  >(() =>
    Object.fromEntries(
      rooms.map((room) => [
        room,
        devices.filter((device) => device.room === room),
      ]),
    ),
  );
  const handle = Grid.useCreateReorderHandle({
    onReorder: (change) => {
      addLog(
        `move ${String(change.items[0]?.name)} to ${String(change.target.name)}`,
      );
      setByRoom((current) => Grid.reorder(current, change, ({ name }) => name));
    },
  });
  const resize = (name: string, size: GridSize) => {
    addLog(`${name} size: ${size}`);
    setByRoom((current) =>
      Object.fromEntries(
        Object.entries(current).map(([room, list]) => [
          room,
          list.map((device) =>
            device.name === name ? { ...device, size } : device,
          ),
        ]),
      ),
    );
  };

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            'Button.Label': [],
            'Button.Root': ['onClick', 'variant'],
            'Grid.Header': [],
            'Grid.Item': [
              'dropName',
              'onSizeChange',
              'reorderHandle',
              'size',
              'supportedSizes',
            ],
            'Grid.ResizeHandle': [],
            'Grid.Section': ['dropName', 'reorderHandle'],
            'Page.Root': [],
            'Viewport.Content': [],
            'Viewport.Padding': ['edge'],
          },
          addLog,
        ),
      [addLog],
    ),
    { provided: useProvidedState(id) },
  );

  return (
    <Component
      controls={[control, partControls]}
      id={id}
      log={log}
      stage="phone"
      state={[state, partState]}
      title="Grid"
    >
      <Viewport.Content {...partProps['Viewport.Content']}>
        <Page.Root {...partProps['Page.Root']}>
          <Viewport.Padding
            {...partProps['Viewport.Padding']}
            edge="block-start"
          />
          <div className="grid-demo-content">
            <div className="grid-demo-actions">
              <Button.Root
                {...partProps['Button.Root']}
                variant="bordered"
                onClick={() => {
                  addLog(editing ? 'done' : 'edit');
                  setEditing(!editing);
                }}
              >
                <Button.Label {...partProps['Button.Label']}>
                  {editing ? 'Done' : 'Edit'}
                </Button.Label>
              </Button.Root>
            </div>
            <Grid.Root
              {...props}
              editing={editing}
            >
              {rooms.map((room) => (
                <Grid.Section
                  key={room}
                  {...partProps['Grid.Section']}
                  dropName={room}
                  reorderHandle={handle}
                >
                  <Grid.Header {...partProps['Grid.Header']}>
                    <h3 className="grid-demo-heading">{room}</h3>
                  </Grid.Header>
                  {(byRoom[room] ?? []).map(({ name, size }) => (
                    <Grid.Item
                      key={name}
                      {...partProps['Grid.Item']}
                      dropName={name}
                      reorderHandle={handle}
                      size={size}
                      supportedSizes={deviceSizes}
                      onSizeChange={(next) => resize(name, next)}
                    >
                      <div className="grid-demo-tile">{name}</div>
                      <Grid.ResizeHandle {...partProps['Grid.ResizeHandle']} />
                    </Grid.Item>
                  ))}
                </Grid.Section>
              ))}
            </Grid.Root>
          </div>
          <Viewport.Padding
            {...partProps['Viewport.Padding']}
            edge="block-end"
          />
        </Page.Root>
      </Viewport.Content>
    </Component>
  );
};
