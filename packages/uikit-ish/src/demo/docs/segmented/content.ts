/**
 * The guide pages' items, periods (as Health's charts): value, label. Data
 * only: the views write out their controls, so their code shows as it'd be
 * used.
 */
export const periods = [
  ['day', 'Day'],
  ['week', 'Week'],
  ['month', 'Month'],
  ['year', 'Year'],
  ['all', 'All Time'],
] as const;

/** More periods than fit, in order: scrolled (`overflow`), e.g. a phone's. */
export const morePeriods = [
  ['hour', 'Hour'],
  ['day', 'Day'],
  ['week', 'Week'],
  ['month', 'Month'],
  ['quarter', 'Quarter'],
  ['half', '6 Months'],
  ['year', 'Year'],
  ['years', '5 Years'],
  ['decade', 'Decade'],
  ['all', 'All Time'],
] as const;
