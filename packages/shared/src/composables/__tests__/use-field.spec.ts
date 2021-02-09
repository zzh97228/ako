import { mount, VueWrapper } from '@vue/test-utils';
import { defineComponent, h } from 'vue';
import { useFieldConsumer, useFieldProvider } from '../useField';
import { genModelProps, useModel } from '../useModel';

describe('useField.ts', () => {
  let childComponent: any, parentComponent: any;
  beforeEach(() => {
    parentComponent = defineComponent({
      name: 'parent',
      props: {
        ...genModelProps([String]),
      },
      setup(props, context) {
        const modelOptions = useModel(props);
        useFieldProvider(modelOptions);
        return modelOptions;
      },
      render() {
        return h('div', this.$slots.default && this.$slots.default());
      },
    });
    childComponent = defineComponent({
      name: 'child',
      props: {
        ...genModelProps([String]),
      },
      setup(props, context) {
        const modelOptions = useModel(props);
        useFieldConsumer(modelOptions);
        return modelOptions;
      },
      render() {
        return h('div', this.lazyState.value);
      },
    });
  });
  it('should use field provider', async () => {
    const wrapper = mount(parentComponent, {
      props: {
        modelValue: 'hello',
      },
      slots: {
        default: () => h(childComponent),
      },
    });
    expect(wrapper.text()).toBe('hello');
    await wrapper.setProps({
      modelValue: 'world',
    });
    expect(wrapper.text()).toBe('world');
    const child = wrapper.getComponent({ name: 'child' }) as VueWrapper<any>;
    child.vm.model = 'and';
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.lazyState.value).toBe('and');
  });
});
