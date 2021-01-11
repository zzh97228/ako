import { mount, VueWrapper } from '@vue/test-utils';
import Slider from '../Slider';
describe('Slider.ts', () => {
  let mountFunc: (opts?: object) => VueWrapper<any>;
  beforeEach(() => {
    mountFunc = (options = {}) => mount(Slider, options);
  });
  it('should change percent when change modelValue', () => {
    const wrapper = mountFunc({
      props: {
        modelValue: 10,
      },
    });

    const pointer = wrapper.find('.slider__pointer');
    expect(pointer).not.toBeUndefined();
    expect(pointer.attributes('style')).toContain('left: 10.00%');
  });

  it('should have some special classes when set corresponding props', () => {
    const wrapper = mountFunc({
      props: {
        tile: true,
        vertical: true,
        reverse: true,
      },
    });

    expect(wrapper.classes()).toContain('slider--vertical');
    const slider = wrapper.find('.slider');
    expect(slider.exists()).toBeTruthy();
    expect(slider.classes()).toContain('slider');
    expect(slider.classes()).toContain('slider--reverse');
    expect(slider.classes()).toContain('slider--tile');
  });
});
