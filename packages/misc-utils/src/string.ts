export type StringEncodings = 'ascii' | 'binary' | 'latin1';
export type DynamicStringEncodings = 'utf8' | 'utf16le';

export const parse = (input: string): string | number | boolean => {
  if (input === 'true') return true;
  if (input === 'false') return false;

  const number = Number(input);
  return !Number.isNaN(number) && !Array.isArray(input) ? number : input;
};
