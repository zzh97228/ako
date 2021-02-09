import { mount, VueWrapper } from '@vue/test-utils';
import { defineComponent, h } from 'vue';
import { genModelProps, useModel } from '../useModel';
import { genValidationProps, useValidation } from '../useValidation';

const compo = defineComponent({
  name: 'temp',
  props: {
    ...genModelProps([String, Number]),
    ...genValidationProps(),
  },
  setup(props, context) {
    const { lazyState, model } = useModel(props);
    const { errors } = useValidation(props, lazyState);
    return {
      errors,
      lazyState,
      model,
    };
  },
  render() {
    return h('div', this.model);
  },
});

describe('useValidation.ts', () => {
  let mountFunc: (options?: object) => VueWrapper<any>;
  beforeEach(() => {
    mountFunc = (opts = {}) => mount(compo, opts);
  });
  it('should validate rules', async () => {
    let msg = 'value should not larger than 0';
    const wrapper = mountFunc({
      props: {
        modelValue: 0,
        rules: [
          (v: any) => {
            return v > 0 && msg;
          },
        ],
      },
    });

    await wrapper.setProps({
      modelValue: 1,
    });
    expect(wrapper.emitted()).toHaveProperty('update:errors');
    expect(wrapper.vm.errors.length).toEqual(1);
    expect(wrapper.vm.errors[0].error).toEqual(msg);

    await wrapper.setProps({
      modelValue: -1,
    });
    expect(wrapper.vm.errors).toEqual([]);
    msg = 'value should not less than 0';
    await wrapper.setProps({
      rules: [(v: any) => v < 0 && msg],
    });
    expect(wrapper.vm.errors.length).toEqual(1);
    expect(wrapper.vm.errors[0].error).toEqual(msg);
  });

  it('should validate immediately', async () => {
    let msg = 'value should not larger than 0';
    const wrapper = mountFunc({
      props: {
        modelValue: 1,
        rules: [
          (v: any) => {
            return v > 0 && msg;
          },
        ],
        validateImmediate: true,
      },
    });

    await wrapper.vm.$nextTick();

    expect(wrapper.emitted()).toHaveProperty('update:errors');
    expect(wrapper.vm.errors.length).toEqual(1);
    expect(wrapper.vm.errors[0].error).toEqual(msg);
  });
});
