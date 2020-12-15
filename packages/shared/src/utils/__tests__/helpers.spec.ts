import { mount } from '@vue/test-utils';
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
  genFunctionalComponent,
  deepEqual,
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

  it('should generate functional component', () => {
    const name = 'tempComponent';
    const wrapper = mount(genFunctionalComponent(name, 'main'), {
      slots: {
        default: name,
      },
    });
    expect(wrapper.classes()).toContain('temp-component');
    expect(wrapper.element.tagName).toEqual('MAIN');
    expect(wrapper.text()).toEqual(name);
  });

  it('should deep equal two value', () => {
    // basic type test
    let left: any, right: any;
    left = 1;
    right = 1;
    expect(deepEqual(left, right)).toBeTruthy();
    // different type test
    left = '1';
    expect(deepEqual(left, right)).toBeFalsy();
    // shallow object test
    left = {
      k: 1,
    };
    right = {
      k: 2,
    };
    expect(deepEqual(left, right)).toBeFalsy();
    // object test
    left = {
      k: {
        a: 1,
      },
    };
    right = {
      k: {
        a: 1,
      },
    };
    expect(deepEqual(left, right)).toBeTruthy();
    // function test
    let tempFunc = function () {};
    left = {
      a: tempFunc,
    };
    right = {
      a: tempFunc,
    };
    expect(deepEqual(left, right)).toBeTruthy();
    // same value map test
    let tempMap1 = new Map<number, number>();
    let tempMap2 = new Map<number, number>();
    tempMap1.set(1, 2);
    tempMap2.set(1, 2);
    left = {
      a: tempMap1,
    };
    right = {
      a: tempMap2,
    };
    expect(deepEqual(left, right)).toBeTruthy();
    left = [1, [2, 3]];
    right = [1, [2, 3]];
    expect(deepEqual(left, right)).toBeTruthy();
    left = [1, [2, 3]];
    right = [1, [2, 4]];
    expect(deepEqual(left, right)).toBeFalsy();
  });
});
