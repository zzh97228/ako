import { mount, VueWrapper } from '@vue/test-utils';
import { defineComponent, h } from 'vue';
import { usePercent, genPercentProps } from '../usePercent';

const compo = defineComponent({
  props: genPercentProps(),
  setup(props, context) {
    const { model, percent, start, end } = usePercent(props);
    return {
      model,
      percent,
    };
  },
  render() {
    return h('div', this.model);
  },
});
describe('usePercent.ts', () => {
  let mountFunc: (opts?: object) => VueWrapper<any>;
  beforeEach(() => {
    mountFunc = (options = {}) => mount(compo, options);
  });
  it('should change percent when change model', async () => {
    const wrapper = mountFunc({
      props: {
        modelValue: 50,
        start: 0,
        end: 100,
      },
    });

    expect((wrapper.vm.percent as number).toFixed(1)).toEqual('0.5');
    wrapper.vm.model = 20;
    await wrapper.vm.$nextTick();
    expect((wrapper.vm.percent as number).toFixed(1)).toEqual('0.2');
  });

  it('should change percent when change modelValue', async () => {
    const wrapper = mountFunc({
      props: {
        modelValue: 50,
        start: -50,
        end: 50,
      },
    });
    expect((wrapper.vm.percent as number).toFixed(1)).toEqual('1.0');
    await wrapper.setProps({
      modelValue: 0,
    });
    expect((wrapper.vm.percent as number).toFixed(1)).toEqual('0.5');
  });

  it('should change model when change percent', async () => {
    const wrapper = mountFunc({
      props: {
        modelValue: 50,
        start: 50,
        end: -50,
      },
    });
    expect((wrapper.vm.model as number).toFixed(1)).toEqual('50.0');
    wrapper.vm.percent = 0.2;
    expect((wrapper.vm.model as number).toFixed(1)).toEqual('30.0');
    expect(wrapper.emitted()).toHaveProperty('update:modelValue');
    expect(wrapper.emitted()['update:modelValue'][0]).toEqual([30]);
  });

  it('should be apart with partition prop', async () => {
    const wrapper = mountFunc({
      props: {
        modelValue: 53,
        partition: 5,
      },
    });

    expect(wrapper.vm.percent as number).toEqual(0.6);
    expect(wrapper.vm.model as number).toEqual(60);
    await wrapper.setProps({
      modelValue: 92,
    });
    expect(wrapper.vm.percent as number).toEqual(1);
    expect(wrapper.vm.model as number).toEqual(100);
  });
});
