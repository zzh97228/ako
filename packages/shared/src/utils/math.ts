import { isNumber, isString } from './helpers';

export function clamp(num: number, min?: number | null, max?: number | null) {
  if (isNumber(min) && isNumber(max)) return Math.max(min, Math.min(max, num));
  else if (isNumber(min) && !isNumber(max)) return Math.max(num, min);
  else if (isNumber(max) && !isNumber(min)) return Math.min(num, max);
  else return num;
}

export function lerp(from: number, to: number, t: number | string) {
  t = isString(t) ? +t.replace(/(\%)/, '') : t || 0;
  const percent = t <= 100 && t > 1 ? t / 100 : t;
  return from + (to - from) * clamp(percent, 0, 1);
}
