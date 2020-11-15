import { mount, VueWrapper } from '@vue/test-utils';
import { defineComponent, h } from 'vue';
import { sizeProps, useSize } from '../useSize';
const wrapperComponent = defineComponent({
  name: 'temp',
  props: {
    ...sizeProps,
  },
  setup(props, { slots }) {
    const { sizeStyle } = useSize(props);
    return () =>
      h(
        'div',
        {
          style: sizeStyle.value,
        },
        slots.default && slots.default()
      );
  },
});
describe('useSize.ts', () => {
  let mountFunc: (options?: object) => VueWrapper<any>;
  beforeEach(() => {
    mountFunc = (options = {}) => {
      return mount(wrapperComponent, options);
    };
  });
  it('should useSize props', async () => {
    const wrapper = mountFunc({
      props: {
        height: 100,
        width: 100,
      },
    });
    expect(wrapper.attributes('style')).toContain('width: 100px');
    expect(wrapper.attributes('style')).toContain('height: 100px');
    await wrapper.setProps({
      width: '200px',
      height: '200px',
    });
    expect(wrapper.attributes('style')).toContain('width: 200px');
    expect(wrapper.attributes('style')).toContain('height: 200px');
    await wrapper.setProps({
      width: undefined,
      height: undefined,
    });
    expect(wrapper.attributes('style')).toBe('');
  });
});
