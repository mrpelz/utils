// A background's color at a point (see backdrop.ts): its layers (computed
// `background-image`, the topmost first) as gradients evaluated there,
// then its color. Linear gradients (any angle, `to` a side or corner) and
// radial ones (circles and ellipses, at a position) by their stops; a
// repeating one, its stops' average; anything else (an image, a conic
// gradient), unknown. Drawn over the whole box (its size, position and
// repeat not taken into account): what backgrounds behind glass mostly are.

/** A color: sRGB channels (0 to 255) and alpha (0 to 1). */
export type Rgba = [red: number, green: number, blue: number, alpha: number];

/** A box's point: its size, and the point's offset in it (px). */
type At = { height: number; width: number; x: number; y: number };

/** A string split at its top-level commas (not within parentheses). */
const splitTopLevel = (value: string) => {
  const parts: string[] = [];
  let depth = 0;
  let start = 0;
  for (let index = 0; index < value.length; index += 1) {
    const character = value[index];
    if (character === '(') depth += 1;
    else if (character === ')') depth -= 1;
    else if (character === ',' && depth === 0) {
      parts.push(value.slice(start, index).trim());
      start = index + 1;
    }
  }
  parts.push(value.slice(start).trim());
  return parts;
};

const colorPattern =
  /(?:rgba?|hsla?|hwb|lab|lch|oklab|oklch|color)\([^)]*\)|#[\da-f]{3,8}\b|\btransparent\b/iu;

type Stop = { color: Rgba; position: number | undefined };

/**
 * Stops' positions left out filled in: the first at 0, the last at the end
 * (`length`), those between spread evenly; none before an earlier one's.
 */
const spread = (stops: Stop[], length: number) => {
  const first = stops[0];
  const last = stops.at(-1);
  if (first && first.position === undefined) first.position = 0;
  if (last && last.position === undefined) last.position = length;
  for (let index = 0; index < stops.length; index += 1) {
    if (stops[index]?.position !== undefined) continue;
    const before = index - 1;
    let after = index;
    while (stops[after]?.position === undefined) after += 1;
    const from = stops[before]?.position ?? 0;
    const to = stops[after]?.position ?? length;
    for (let gap = index; gap < after; gap += 1) {
      const stop = stops[gap];
      if (stop) {
        stop.position =
          from + ((to - from) * (gap - before)) / (after - before);
      }
    }
  }
  let floor = -Infinity;
  for (const stop of stops) {
    stop.position = Math.max(stop.position ?? 0, floor);
    floor = stop.position;
  }
};

/**
 * A gradient's stops (`color [position [position]]`), their positions in px
 * along a line `length` long (percentages of it), in order; a stop with two
 * positions, two stops.
 */
const stopsOf = (
  parts: readonly string[],
  length: number,
  parse: (color: string) => Rgba | undefined,
): Stop[] | undefined => {
  const stops: Stop[] = [];
  for (const part of parts) {
    const match = colorPattern.exec(part);
    if (!match) return undefined;
    const color = parse(match[0]);
    if (!color) return undefined;
    const positions = part
      .replace(match[0], '')
      .trim()
      .split(/\s+/u)
      .filter(Boolean)
      .map((token) => {
        const value = Number.parseFloat(token);
        return token.endsWith('%') ? (value / 100) * length : value;
      });
    if (positions.length === 0) stops.push({ color, position: undefined });
    for (const position of positions) stops.push({ color, position });
  }
  spread(stops, length);
  return stops;
};

/** The color at `distance` along a gradient's stops (see `stopsOf`). */
const colorAlong = (stops: readonly Stop[], distance: number): Rgba => {
  const first = stops[0];
  if (!first) return [0, 0, 0, 0];
  if (distance <= (first.position ?? 0)) return first.color;
  for (let index = 1; index < stops.length; index += 1) {
    const from = stops[index - 1];
    const to = stops[index];
    if (!from || !to) continue;
    const start = from.position ?? 0;
    const end = to.position ?? 0;
    if (distance > end) continue;
    const t = end === start ? 1 : (distance - start) / (end - start);
    return from.color.map(
      (channel, channelIndex) =>
        channel + ((to.color[channelIndex] ?? 0) - channel) * t,
    ) as Rgba;
  }
  return stops.at(-1)?.color ?? first.color;
};

const sideAngles: Record<string, number> = {
  bottom: 180,
  left: 270,
  right: 90,
  top: 0,
};

const degreesPattern = /^(?<value>-?[\d.]+)deg$/u;
const turnPattern = /^(?<value>-?[\d.]+)turn$/u;

/** A linear gradient's angle (deg) from its first part, if it's one. */
const angleOf = (part: string, { height, width }: At) => {
  const degrees = degreesPattern.exec(part);
  if (degrees) return Number(degrees.groups?.value);
  const turn = turnPattern.exec(part);
  if (turn) return Number(turn.groups?.value) * 360;
  if (!part.startsWith('to ')) return undefined;
  const sides = part.slice(3).split(/\s+/u);
  if (sides.length === 1) return sideAngles[sides[0] ?? ''];
  // (A corner: the angle pointing at it, for the box's proportions.)
  const vertical = sides.includes('top') ? -1 : 1;
  const horizontal = sides.includes('left') ? -1 : 1;
  return (Math.atan2(horizontal * height, -vertical * width) * 180) / Math.PI;
};

const linearAt = (
  parts: readonly string[],
  at: At,
  parse: (color: string) => Rgba | undefined,
) => {
  const [head = ''] = parts;
  const given = angleOf(head, at);
  const angle = ((given ?? 180) * Math.PI) / 180;
  const sin = Math.sin(angle);
  const cos = Math.cos(angle);
  const length = Math.abs(at.width * sin) + Math.abs(at.height * cos);
  const stops = stopsOf(
    given === undefined ? parts : parts.slice(1),
    length,
    parse,
  );
  if (!stops) return undefined;
  const distance =
    length / 2 + (at.x - at.width / 2) * sin - (at.y - at.height / 2) * cos;
  return colorAlong(stops, distance);
};

/** A position's coordinate (`50%`, `12px`) in a box's side `size` long. */
const coordinate = (token: string | undefined, size: number) => {
  if (token === undefined) return size / 2;
  const keywords: Record<string, number> = {
    bottom: 1,
    center: 0.5,
    left: 0,
    right: 1,
    top: 0,
  };
  const keyword = keywords[token];
  if (keyword !== undefined) return keyword * size;
  const value = Number.parseFloat(token);
  return token.endsWith('%') ? (value / 100) * size : value;
};

const radialAt = (
  parts: readonly string[],
  at: At,
  parse: (color: string) => Rgba | undefined,
) => {
  const [head = ''] = parts;
  const hasShape = !colorPattern.test(head);
  const shape = hasShape ? head : '';
  const [, position = ''] = shape.split(/\bat\b/u);
  const [xToken, yToken] = position.trim().split(/\s+/u).filter(Boolean);
  const cx = coordinate(xToken, at.width);
  const cy = coordinate(yToken, at.height);
  // (Its size the farthest corner, as by default; an ellipse's radii in its
  // box's proportions.)
  const dx = Math.max(cx, at.width - cx);
  const dy = Math.max(cy, at.height - cy);
  const isCircle = shape.includes('circle');
  const rx = isCircle ? Math.hypot(dx, dy) : dx * Math.SQRT2;
  const ry = isCircle ? rx : dy * Math.SQRT2;
  const stops = stopsOf(hasShape ? parts.slice(1) : parts, rx, parse);
  if (!stops) return undefined;
  const distance = Math.hypot(at.x - cx, ((at.y - cy) * rx) / (ry || 1));
  return colorAlong(stops, distance);
};

/** A repeating gradient: its stops' colors' average. */
const averageOf = (
  parts: readonly string[],
  parse: (color: string) => Rgba | undefined,
) => {
  const colors = parts
    .map((part) => colorPattern.exec(part)?.[0])
    .filter((color): color is string => color !== undefined)
    .map((color) => parse(color))
    .filter((color): color is Rgba => color !== undefined);
  return colors.length === 0
    ? undefined
    : ([0, 1, 2, 3].map(
        (index) =>
          colors.reduce((sum, color) => sum + (color[index] ?? 0), 0) /
          colors.length,
      ) as Rgba);
};

/** One layer's color at the point (undefined: unknown). */
const layerAt = (
  layer: string,
  at: At,
  parse: (color: string) => Rgba | undefined,
): Rgba | undefined => {
  const open = layer.indexOf('(');
  if (open === -1 || !layer.endsWith(')')) return undefined;
  const kind = layer.slice(0, open);
  const parts = splitTopLevel(layer.slice(open + 1, -1));
  if (kind === 'linear-gradient') return linearAt(parts, at, parse);
  if (kind === 'radial-gradient') return radialAt(parts, at, parse);
  return kind.startsWith('repeating-') ? averageOf(parts, parse) : undefined;
};

/**
 * A background's color at a point (see the top): its topmost layer there
 * at least 30% opaque, else its color (null: none that opaque; undefined:
 * a layer unknown, e.g. an image).
 */
export const backgroundColorAt = (
  backgroundImage: string,
  backgroundColor: string,
  at: At,
  parse: (color: string) => Rgba | undefined,
): Rgba | null | undefined => {
  const layers =
    backgroundImage === 'none' ? [] : splitTopLevel(backgroundImage);
  for (const layer of layers) {
    const color = layerAt(layer, at, parse);
    if (color === undefined) return undefined;
    if (color[3] >= 0.3) return color;
  }
  const color = parse(backgroundColor);
  return color && color[3] >= 0.3 ? color : null;
};
