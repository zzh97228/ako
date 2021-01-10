import { mount, VueWrapper } from '@vue/test-utils';
import Checkbox from '../Checkbox';
describe('checkbox.ts', () => {
  let mountFunc: (options?: object) => VueWrapper<any>;
  beforeEach(() => {
    mountFunc = (opts = {}) => {
      return mount(Checkbox, opts);
    };
  });
  it('should render checkbox with isActive false', () => {
    const wrapper = mountFunc({
      props: {
        modelValue: undefined,
      },
    });
    expect(wrapper.classes()).toContain('checkbox__wrapper');
    const checkbox = wrapper.find('.checkbox');
    expect(checkbox).not.toBeUndefined();
  });

  it('should be indetermined when set indetermined prop and set modelValue true on click', async () => {
    const wrapper = mountFunc({
      props: {
        indetermined: true,
        modelValue: undefined,
      },
    });
    const checkbox = wrapper.find('.checkbox');
    expect(checkbox.classes()).toContain('checkbox--indetermined');
    await wrapper.trigger('click');
    expect(checkbox.classes()).not.toContain('checkbox--indetermined');
    expect(checkbox.classes()).toContain('checkbox--active');
    await wrapper.trigger('click');
    expect(checkbox.classes()).not.toContain('checkbox--indetermined');
    expect(checkbox.classes()).not.toContain('checkbox--active');
  });

  it('should be active when modelValue is true', () => {
    const wrapper = mountFunc({
      props: {
        indetermined: true,
        modelValue: true,
      },
    });
    const checkbox = wrapper.find('.checkbox');
    expect(checkbox.classes()).not.toContain('checkbox--indetermined');
    expect(checkbox.classes()).toContain('checkbox--active');
  });

  it('should not render label when not set default slots', () => {
    const wrapper = mountFunc();
    const label = wrapper.find('.checkbox__label');
    expect(label.exists()).toBeFalsy();
  });

  it('should have switch class or radio class when set switch/radio prop', async () => {
    const wrapper = mountFunc({
      props: {
        switch: true,
      },
    });
    const checkbox = wrapper.find('.checkbox');
    expect(checkbox.exists()).toBeTruthy();
    expect(checkbox.classes()).toContain('checkbox--switch');
    await wrapper.setProps({
      radio: true,
    });
    expect(checkbox.classes()).toContain('checkbox--radio');
  });
});
