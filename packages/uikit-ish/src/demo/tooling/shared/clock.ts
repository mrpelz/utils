/**
 * The devices' status bars' time (see style.css): the current time, as the
 * browser's locale writes it (without a day period, as iOS' status bar),
 * kept on the root element (`--demo-time`) from the next minute on; else
 * (server-side, prerendered) 9:41.
 */
export const startClock = (): void => {
  if (typeof document === 'undefined') return;

  const format = new Intl.DateTimeFormat(undefined, {
    hour: 'numeric',
    minute: '2-digit',
  });

  const tick = () => {
    const now = new Date();
    const time = format
      .formatToParts(now)
      .filter(({ type }) => ['hour', 'literal', 'minute'].includes(type))
      .map(({ value }) => value)
      .join('')
      .trim();

    document.documentElement.style.setProperty(
      '--demo-time',
      JSON.stringify(time),
    );

    setTimeout(
      tick,
      60_000 - (now.getSeconds() * 1000 + now.getMilliseconds()),
    );
  };

  tick();
};
