import {
  convertToUnit,
  convertToNumber,
  hyphenate,
  isArray,
  isBool,
  isNumber,
  isObject,
  isString,
  isUndefined,
} from '../helpers';

describe('helpers.ts', () => {
  it('should judge str type', () => {
    expect(isString('hello')).toBeTruthy();
    expect(isString(undefined)).toBeFalsy();
    expect(isNumber(1)).toBeTruthy();
    expect(isNumber(undefined)).toBeFalsy();
    expect(isUndefined(undefined)).toBeTruthy();
    expect(isUndefined(1)).toBeFalsy();
    expect(isArray([1, 2])).toBeTruthy();
    expect(isArray(undefined)).toBeFalsy();
    expect(isObject({})).toBeTruthy();
    expect(isObject(undefined)).toBeFalsy();
    expect(isBool(true)).toBeTruthy();
    expect(isBool(undefined)).toBeFalsy();
  });

  it('should convert string to unit-string', () => {
    expect(convertToUnit(100)).toEqual('100px');
    expect(convertToUnit('100')).toEqual('100px');
    expect(convertToUnit(null)).toBeUndefined();
    expect(convertToUnit()).toBeUndefined();
    expect(convertToUnit('100vh')).toEqual('100vh');
    expect(convertToUnit(100, 'vw')).toEqual('100vw');
  });

  it('should hyphenate string', () => {
    const helloWolrd = 'hello-world';
    expect(hyphenate('HelloWorld')).toEqual(helloWolrd);
    expect(hyphenate('hello-world')).toEqual(helloWolrd);
    expect(hyphenate('helloWorld')).toEqual(helloWolrd);
  });

  it('should convert string to number', () => {
    expect(convertToNumber('11px')).toEqual(11);
    expect(convertToNumber('11.2px')).toEqual(11.2);
    expect(convertToNumber('1e-1')).toEqual(0.1);
    expect(convertToNumber('11.1.1')).toBeNaN();
    expect(convertToNumber('-11.2vw')).toEqual(-11.2);
    expect(convertToNumber(11)).toEqual(11);
  });
});
