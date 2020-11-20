import { clamp, lerp } from '../math';

describe('math.ts', () => {
  it('should clamp number', () => {
    expect(clamp(4, -1, 2)).toEqual(2);
    expect(clamp(4, null, 2)).toEqual(2);
    expect(clamp(-2, -1, 2)).toEqual(-1);
    expect(clamp(-2, -1)).toEqual(-1);
    expect(clamp(-1)).toEqual(-1);
  });

  it('should lerp number', () => {
    expect(Math.round(lerp(1, 3, 0.5))).toEqual(2);
    expect(Math.round(lerp(-1, -3, 0.5))).toEqual(-2);
    expect(Math.round(lerp(-1, 3, 50))).toEqual(1);
  });
});
