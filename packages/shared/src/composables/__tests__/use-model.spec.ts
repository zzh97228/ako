import { mount } from '@vue/test-utils';
import { defineComponent, h, SetupContext } from 'vue';
import { genModelProps, useModel } from '../useModel';

describe('useModel.ts', () => {
  let tempComponent: any;
  beforeEach(() => {
    const stringOrNumberModel = genModelProps([String, Number]);
    tempComponent = defineComponent({
      props: {
        ...stringOrNumberModel,
      },
      setup(props, context) {
        const { model, lazyState } = useModel(props, context);
        return {
          model,
          lazyState,
        };
      },
      render() {
        return h('div', {}, this.lazyState.value);
      },
    });
  });
  it("should have emit value when set model's value", () => {
    let emittedValue = '';
    const emitFn = jest.fn((emitStr, emitVal) => {
      emittedValue = emitVal;
    });
    const ctx = {
      emit: emitFn,
      attrs: {},
      slots: {},
    } as SetupContext;
    const { model, lazyState } = useModel(
      {
        modelValue: '',
      },
      ctx
    );
    model.value = 'hello';
    expect(lazyState.value).toEqual('hello');
    expect(emittedValue).toEqual('hello');
    expect(emitFn).toHaveBeenCalled();
  });

  it('should change and emit value when set modelValue', async () => {
    const wrapper = mount(tempComponent, {
      props: {
        modelValue: 'hello',
      },
    });
    let emittedObj: any;
    // test initial value
    expect(wrapper.text()).toEqual('hello');
    // test change v-model value
    await wrapper.setProps({
      modelValue: 'world',
    });
    expect(wrapper.vm.lazyState.value).toBe('world');
    expect(wrapper.text()).toEqual('world');
    // test set model
    wrapper.vm.model = 'model';
    expect(wrapper.emitted()).toHaveProperty('update:modelValue');
    emittedObj = wrapper.emitted()['update:modelValue'];
    expect(emittedObj.length).toBe(1);
    expect(emittedObj[0]).toEqual(['model']);
    await wrapper.vm.$nextTick();
    expect(wrapper.text()).toEqual('model');
  });

  it('should change value when `v-model` value set', async () => {
    const emitFunc = jest.fn();
    const wrapper = mount(
      defineComponent({
        components: {
          'temp-compo': tempComponent,
        },
        data() {
          return {
            txt: 'my-hello',
          };
        },
        methods: {
          onChange: emitFunc,
          onClick() {
            const temp = this.$refs['temp'] as any;
            temp && (temp.model = 'clicked');
          },
        },
        template: `<temp-compo ref="temp" v-model="txt" @update:modelValue="onChange" @click="onClick"></temp-compo>`,
      })
    );

    expect(wrapper.text()).toBe('my-hello');
    await wrapper.setData({
      txt: 'my-world',
    });
    expect(wrapper.text()).toBe('my-world');
    await wrapper.trigger('click');
    expect(emitFunc).toHaveBeenCalled();
    expect(wrapper.text()).toBe('clicked');
    expect(wrapper.vm.$data.txt).toBe('clicked');
  });
});
