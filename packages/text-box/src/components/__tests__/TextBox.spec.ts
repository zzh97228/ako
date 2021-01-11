import { mount, VueWrapper } from '@vue/test-utils';
import TextBox from '../TextBox';
describe('TexyBox.ts', () => {
  let mountFunc: (opts?: object) => VueWrapper<any>;
  beforeEach(() => {
    mountFunc = (options = {}) => mount(TextBox, options);
  });

  it('should render TextBox with basic props', () => {
    const options = {
      autofocus: true,
      maxlength: 20,
      placeholder: 'hello world',
      spellcheck: false,
      autocomplete: true,
      rows: 20,
      cols: 50,
    };
    const wrapper = mountFunc({
      props: options,
    });

    expect(wrapper.classes()).toContain('text-box__wrapper');
    const textarea = wrapper.find('textarea');
    expect(textarea.exists()).toBeTruthy();
    expect(textarea.classes()).toContain('text-box');
    expect(textarea.attributes('autofocus')).not.toBeUndefined();
    expect(textarea.attributes('maxlength')).toBe(String(options.maxlength));
    expect(textarea.attributes('placeholder')).toBe(options.placeholder);
    expect(textarea.attributes('spellcheck')).not.toBeUndefined();
    expect(textarea.attributes('autocomplete')).toBe('on');
    expect(textarea.attributes('rows')).toBe(String(options.rows));
    expect(textarea.attributes('cols')).toBe(String(options.cols));
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('should render count attributes when set `showCount` prop', async () => {
    const word = 'hello world';
    const wrapper = mountFunc({
      props: {
        showCount: true,
        modelValue: word,
      },
    });
    expect(wrapper.attributes('data-text-count')).toEqual('11');
    await wrapper.setProps({
      maxlength: 12,
    });
    expect(wrapper.attributes('data-text-count')).toEqual('11 / 12');
  });

  it('should not set value when `disabled` prop set', async () => {
    const wrapper = mountFunc({
      props: {
        modelValue: 'hello world',
        disabled: true,
      },
    });
    expect(wrapper.vm.lazyState.value).toBe('hello world');
    wrapper.vm.model = 'hello there';
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.lazyState.value).toBe('hello world');
    await wrapper.setProps({
      modelValue: 'disabled',
    });
    expect(wrapper.vm.lazyState.value).toBe('hello world');
  });
});
