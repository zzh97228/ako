import { mount, VueWrapper } from '@vue/test-utils';
import { defineComponent, ExtractPropTypes, FunctionalComponent, h } from 'vue';
import { useGridProvider, useGridConsumer, gridProps } from '../useGrid';

describe('useGrid.ts', () => {
  let parentComponent: any, childComponent: any, mountFunc: () => VueWrapper<any>;
  beforeEach(() => {
    parentComponent = defineComponent({
      name: 'parent',
      props: {
        ...gridProps,
      },
      setup(props, { slots }) {
        const gridResult = useGridProvider(props);
        return () =>
          h(
            'div',
            {
              class: gridResult.class.value,
              style: gridResult.style.value,
            },
            slots.default && slots.default()
          );
      },
    });
    childComponent = defineComponent({
      name: 'child',
      setup() {
        const { style } = useGridConsumer();
        return () => h('div', { style: style.value, id: 'child' }, 'child');
      },
    });
    mountFunc = () =>
      mount(parentComponent, {
        props: {
          gutter: 'xs',
          column: false,
        },
        slots: {
          default: () => h(childComponent),
        },
      });
  });
  it('should use grid provider and consumer when not column', async () => {
    const wrapper = mountFunc();
    expect(wrapper.classes()).toContain('row--gutter-xs');
    expect(wrapper.attributes('style')).toBeUndefined();
    await wrapper.setProps({
      gutter: '4px',
    });
    expect(wrapper.attributes('style')).toContain('margin-left: -4px');
    expect(wrapper.attributes('style')).toContain('margin-right: -4px');
    let child = wrapper.getComponent({
      name: 'child',
    });
    expect(child.attributes('style')).toContain('padding-left: 4px');
    expect(child.attributes('style')).toContain('padding-right: 4px');
  });

  it("should change consumer's style when set column", async () => {
    const wrapper = mountFunc();
    await wrapper.setProps({
      column: true,
      gutter: '8px',
    });
    expect(wrapper.attributes('style')).toContain('margin-top: -8px');
    expect(wrapper.attributes('style')).toContain('margin-bottom: -8px');
    let child = wrapper.getComponent({
      name: 'child',
    });
    expect(child.attributes('style')).toContain('padding-top: 8px');
    expect(child.attributes('style')).toContain('padding-bottom: 8px');
  });
});
