import { mount } from '@vue/test-utils';
import { defineComponent, h } from 'vue';
import { genElevationProp, useElevation } from '../useElevation';

describe('useElevation.ts', () => {
  const component = defineComponent({
    name: 'temp',
    props: {
      ...genElevationProp(),
    },
    setup(props, { slots }) {
      const elevation = useElevation(props);
      return () =>
        h(
          'div',
          {
            class: elevation.class.value,
            style: elevation.style.value,
          },
          slots.default && slots.default()
        );
    },
  });
  it('should use elevation', async () => {
    const wrapper = mount(component, {
      props: {
        elevation: 'xs',
      },
    });

    expect(wrapper.classes()).toContain('elevation-xs');
    const elevationStr = '2px 2px 2px -2px rgba(0, 0, 0, 1)';
    await wrapper.setProps({
      elevation: elevationStr,
    });
    expect(wrapper.attributes('style')).toContain(`box-shadow: ${elevationStr}`);
    await wrapper.setProps({
      elevation: null,
    });
    expect(wrapper.classes().length).toEqual(0);
    expect(wrapper.attributes('style')).toEqual('');
  });
});
