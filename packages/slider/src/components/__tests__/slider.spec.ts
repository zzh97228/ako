import { mount, VueWrapper } from '@vue/test-utils';
import Slider from '../Slider';
describe('Slider.ts', () => {
  let mountFunc: (opts?: object) => VueWrapper<any>;
  // TODO test slider
  beforeEach(() => {
    mountFunc = (options = {}) => mount(Slider, options);
  });
  it('should change percent when change modelValue', () => {
    const wrapper = mountFunc({
      props: {
        modelValue: 10
      }
    })

    const pointer = wrapper.find('.slider__pointer');
    expect(pointer).not.toBeUndefined();
    expect(pointer.attributes('style')).toContain('left: 10.00%')
  })
});
