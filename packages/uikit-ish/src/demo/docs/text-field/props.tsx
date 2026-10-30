/* eslint-disable @typescript-eslint/explicit-module-boundary-types -- prop control options, typed by inference */

import { List } from '../../../components/index.js';
import { AddLog } from '../../tooling/frame/log.js';
import {
  commonPropOptions,
  MappedProp,
} from '../../tooling/frame/prop-control.js';

export const propOptionsRoot = {
  ...commonPropOptions,
  disabled: [undefined, false, true] as const,
  invalid: [undefined, false, true] as const,
  validationMode: [undefined, 'onSubmit', 'onBlur', 'onChange'] as const,
  validationDebounceTime: [undefined, 0, 500] as const,
  validate: [
    undefined,
    new MappedProp(
      (value: unknown = '') =>
        String(value).length >= 3 ? null : 'At least 3 characters.',
      '[at least 3 characters]',
    ),
  ] as const,
};

/** The id of the demo's `<datalist>` (suggestions, see `list`). */
export const suggestionsId = 'text-field-suggestions';

export const propOptionsControl = {
  ...commonPropOptions,
  placeholder: ['Name', undefined, 'A longer placeholder'] as const,
  defaultValue: [undefined, 'Kate Brown'] as const,
  value: [undefined, 'Kate Brown'] as const,
  // The input types (MDN `<input>`): their keyboards and validation (email,
  // url: `typeMismatch`; number, dates: `rangeUnderflow`, `rangeOverflow`,
  // `stepMismatch`), native pickers for dates and times.
  type: [
    undefined,
    'text',
    'email',
    'tel',
    'url',
    'search',
    'password',
    'number',
    'date',
    'time',
    'datetime-local',
    'month',
    'week',
  ] as const,
  // Keyboard hints (iOS: the keyboard's layout, its return key).
  inputMode: [
    undefined,
    'none',
    'text',
    'decimal',
    'numeric',
    'tel',
    'search',
    'email',
    'url',
  ] as const,
  enterKeyHint: [
    undefined,
    'enter',
    'done',
    'go',
    'next',
    'previous',
    'search',
    'send',
  ] as const,
  autoComplete: [
    undefined,
    'off',
    'name',
    'email',
    'tel',
    'url',
    'username',
    'current-password',
    'new-password',
    'one-time-code',
    'street-address',
    'postal-code',
    'bday',
  ] as const,
  autoCapitalize: [
    undefined,
    'none',
    'sentences',
    'words',
    'characters',
  ] as const,
  autoCorrect: [undefined, 'on', 'off'] as const,
  spellCheck: [undefined, false, true] as const,
  // Ranges and constraints (validity: `valueMissing`, `tooShort`, `tooLong`,
  // `patternMismatch`, `rangeUnderflow`, `rangeOverflow`, `stepMismatch`).
  required: [undefined, false, true] as const,
  readOnly: [undefined, false, true] as const,
  minLength: [undefined, 3] as const,
  maxLength: [undefined, 10] as const,
  pattern: [undefined, '[A-Za-z ]+', String.raw`\d{5}`] as const,
  min: [undefined, 1, '2026-01-01'] as const,
  max: [undefined, 10, '2026-12-31'] as const,
  step: [undefined, 1, 0.5, 'any'] as const,
  // Suggestions (a `<datalist>`).
  list: [undefined, suggestionsId] as const,
  render: [undefined, new MappedProp(<textarea />, '[<textarea />]')] as const,
};

export const getPropOptionsControl = (addLog: AddLog) => ({
  ...propOptionsControl,
  onValueChange: [
    undefined,
    new MappedProp(
      (value: string) => addLog(`value change: ${value}`),
      '[log change]',
    ),
  ] as const,
});

export const propOptionsError = {
  ...commonPropOptions,
  match: [
    undefined,
    true,
    'valueMissing',
    'typeMismatch',
    'tooShort',
    'tooLong',
    'patternMismatch',
    'rangeUnderflow',
    'rangeOverflow',
    'stepMismatch',
    'badInput',
    'customError',
  ] as const,
};

export const getPropOptionsClear = (addLog: AddLog) => ({
  // (Its own element: no `render`.)
  className: commonPropOptions.className,
  style: commonPropOptions.style,
  mode: [undefined, 'always', 'unlessEditing', 'whileEditing'] as const,
  'aria-label': [undefined, 'Clear Name'] as const,
  onClick: [
    undefined,
    new MappedProp(() => addLog('clear clicked'), '[log click]'),
  ] as const,
});

/** The overview's content: a label, a description. */
export const propOptionsOverviewContent = {
  label: [true, false] as const,
  description: [false, true] as const,
};

/** The overview's few: its states, not its plumbing. */
export const propOptionsOverviewRoot = {
  disabled: [undefined, true] as const,
  invalid: [undefined, true] as const,
};

export const propOptionsOverviewControl = {
  placeholder: ['Required', undefined] as const,
  type: [undefined, 'email', 'tel', 'password', 'number'] as const,
  defaultValue: [undefined, 'Kate Brown'] as const,
};

export const propOptionsPart = {
  ...commonPropOptions,
};

/** The root's options as a list row (its `render` the row's, or none). */
export const propOptionsGuideRoot = {
  ...propOptionsRoot,
  render: [
    new MappedProp(<List.Item />, '[<List.Item />]'),
    undefined,
  ] as const,
  dirty: [undefined, false, true] as const,
  touched: [undefined, false, true] as const,
};

export const propOptionsGuideLabel = {
  ...propOptionsPart,
  nativeLabel: [undefined, false, true] as const,
};

export const propOptionsGuideSearch = {
  ...propOptionsPart,
  disabled: [undefined, false, true] as const,
};
