import { genModelProps, useModel } from '@lagabu/shared';
import { mount } from '@vue/test-utils';
import { defineComponent, h } from 'vue';
import { useFieldInjector, useFieldProvider } from '../useField';

describe('useField.ts', () => {
  let childComponent: any, parentComponent: any;
  beforeEach(() => {
    parentComponent = defineComponent({
      props: {
        ...genModelProps([String]),
      },
      setup(props, context) {
        const modelOptions = useModel(props, context);
        useFieldProvider(modelOptions);
        return () => h('div', context.slots.default && context.slots.default());
      },
    });
    childComponent = defineComponent({
      props: {
        ...genModelProps([String]),
      },
      setup(props, context) {
        const modelOptions = useModel(props, context);
        useFieldInjector(modelOptions);
        return modelOptions;
      },
      render() {
        return h('div', this.lazyState.value);
      },
    });
  });
  it('should use field provider', () => {
    // TODO use Field
    const wrapper = mount(parentComponent, {
      props: {
        modelValue: 'hello',
      },
      slots: {
        default: () => h(childComponent),
      },
    });
    expect(wrapper.text()).toBe('hello');
  });
});
