import { mount, VueWrapper } from '@vue/test-utils';
import { defineComponent, h } from 'vue';
import { genColorProp, useColor } from '../useColor';

describe('useColor.ts', () => {
  let mountFunc: (options?: object, isTextColor?: boolean) => VueWrapper<any>;
  beforeEach(() => {
    mountFunc = (opts = {}, isTextColor?: boolean) => {
      return mount(
        defineComponent({
          props: {
            ...genColorProp(),
          },
          setup(props) {
            const color = useColor(props, isTextColor);
            return () =>
              h('div', {
                class: color.class.value,
                style: color.style.value,
              });
          },
        }),
        opts
      );
    };
  });
  it('should use color classes or styles', async () => {
    const wrapper = mountFunc({
      props: {
        color: 'primary',
      },
    });

    expect(wrapper.classes()).toContain('primary-color');
    await wrapper.setProps({
      color: 'red-5',
    });
    expect(wrapper.classes()).toContain('red-5');

    await wrapper.setProps({
      color: '#000',
    });
    expect(wrapper.attributes('style')).toContain('background-color: rgb(0, 0, 0)');
    expect(wrapper.attributes('style')).toContain('border-color: #000');
  });

  it('should use color--text classes or styles', async () => {
    const wrapper = mountFunc(
      {
        props: {
          color: 'primary',
        },
      },
      true
    );
    expect(wrapper.classes()).toContain('primary-color--text');
    await wrapper.setProps({
      color: 'red-5',
    });
    expect(wrapper.classes()).toContain('red-5--text');

    await wrapper.setProps({
      color: '#000',
    });
    expect(wrapper.attributes('style')).toContain('color: rgb(0, 0, 0)');
    expect(wrapper.attributes('style')).toContain('caret-color: #000');
  });
});
