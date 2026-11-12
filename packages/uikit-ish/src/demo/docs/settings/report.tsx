import { FunctionComponent, useLayoutEffect } from 'react';

import { type SettingsValues, useSettings } from '../../../components/index.js';
import { hideFromCode } from '../../tooling/frame/render-code.js';

/** Reports the settings where it's rendered (for a demo's diagnostics). */
export const SettingsReport: FunctionComponent<{
  onReport: (values: SettingsValues) => void;
}> = ({ onReport }) => {
  const values = useSettings();
  useLayoutEffect(() => onReport(values), [onReport, values]);

  return null;
};

// (A readout, for the diagnostics: no part of the code shown.)
hideFromCode(SettingsReport);

/** Settings, resolved, side by side (a column each, by its title). */
export const SettingsTable: FunctionComponent<{
  columns: readonly (readonly [title: string, values?: SettingsValues])[];
}> = ({ columns }) => {
  const names = Object.keys(columns.find(([, values]) => values)?.[1] ?? {});

  return (
    <table className="settings-demo-table">
      <thead>
        <tr>
          <th />
          {columns.map(([title]) => (
            <th key={title}>{title}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {names.map((name) => (
          <tr key={name}>
            <th>{name}</th>
            {columns.map(([title, values]) => (
              <td key={title}>
                {String(values?.[name as keyof SettingsValues] ?? '')}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};
