import { isUndefined, isString } from './helpers';
/**
 * @public limit number [min, max]
 * @param num - number
 * @param min - min number
 * @param max - max number
 */
export function clamp(num: number, min?: number | null, max?: number | null): number {
  min = isUndefined(min) || min === null ? -Infinity : min;
  max = isUndefined(max) || max === null ? Infinity : max;
  if (min > max) [min, max] = [max, min];
  return Math.min(max, Math.max(min, num));
}
/**
 * @public lerp number
 * @param from - start number
 * @param to - end number
 * @param t - percent
 */
export function lerp(from: number, to: number, t: number | string) {
  t = isString(t) ? +t.replace(/(\%)/, '') : t || 0;
  const percent = t <= 100 && t > 1 ? t / 100 : t;
  return from + (to - from) * clamp(percent, 0, 1);
}
