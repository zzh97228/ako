import { isUndefined, isString } from './helpers';

export function clamp(num: number, min?: number | null, max?: number | null): number {
  min = isUndefined(min) || min === null ? num : min;
  max = isUndefined(max) || max === null ? num : max;
  if (min > max) [min, max] = [max, min];
  return Math.min(max, Math.max(min, num));
}

export function lerp(from: number, to: number, t: number | string) {
  t = isString(t) ? +t.replace(/(\%)/, '') : t || 0;
  const percent = t <= 100 && t > 1 ? t / 100 : t;
  return from + (to - from) * clamp(percent, 0, 1);
}
