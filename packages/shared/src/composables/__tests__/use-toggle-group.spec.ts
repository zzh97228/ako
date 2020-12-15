import { defineComponent, h, reactive, ref, VNodeArrayChildren } from 'vue';
import { genGroupProps, useGroupConsumer, useGroupProvider } from '../useToggleGroup';
import { genToggleProps, useToggle } from '../useToggle';
import { mount } from '@vue/test-utils';
describe('useToggleGroup', () => {
  let group: any;
  let item: any;
  beforeEach(() => {
    item = defineComponent({
      name: 'item',
      props: genToggleProps('active'),
      setup(props, context) {
        const { isActive, toggle, class: toggleClasses } = useToggle(props, context);
        const { onToggle, notAllowed } = useGroupConsumer(isActive, true);
        return {
          isActive,
          onToggle,
          toggle,
          toggleClasses,
          notAllowed,
        };
      },
      render() {
        return h(
          'div',
          {
            class: this.toggleClasses,
            onClick: () => {
              this.toggle(() => this.onToggle(), this.notAllowed);
            },
          },
          this.$slots.default && this.$slots.default()
        );
      },
    });
    group = defineComponent({
      name: 'group',
      props: genGroupProps(),
      setup(props, context) {
        const modelOptions = useGroupProvider(props, context);
        return modelOptions;
      },
      render() {
        const children: VNodeArrayChildren = [];
        for (let i = 0; i < 5; i++) {
          children.push(
            h(
              item,
              { key: 'item-' + i },
              {
                default: () => 'item-' + i,
              }
            )
          );
        }
        return h('div', { class: 'group' }, children);
      },
    });
  });

  it('should toggle item when not set multiple prop', async () => {
    const modelValue = ref<undefined | number | number[]>(void 0);

    const wrapper = mount(group, {
      props: {
        modelValue,
      },
    });
    const items = wrapper.findAllComponents({
      name: 'item',
    });
    await items[0].trigger('click');
    expect(items[0].classes()).toContain('active');
    expect(wrapper.emitted()).toHaveProperty('update:modelValue');
    expect(wrapper.emitted()['update:modelValue'][0]).toEqual([0]);
    await items[1].trigger('click');
    expect(items[0].classes()).not.toContain('active');
    expect(items[1].classes()).toContain('active');
    expect(wrapper.emitted()).toHaveProperty('update:modelValue');
    expect(wrapper.emitted()['update:modelValue'][1]).toEqual([1]);
    await items[1].trigger('click');
    expect(items[1].classes()).not.toContain('active');
    expect(wrapper.emitted()).toHaveProperty('update:modelValue');
    expect(wrapper.emitted()['update:modelValue'][2]).toEqual([undefined]);

    // test set value
    modelValue.value = 2;
    await wrapper.vm.$nextTick();
    expect(items[0].classes()).not.toContain('active');
    expect(items[1].classes()).not.toContain('active');
    expect(items[2].classes()).toContain('active');
    expect(items[2].vm.isActive).toBeTruthy();
    // test set value = [2]
    modelValue.value = [1];
    await wrapper.vm.$nextTick();
    expect(items[0].classes()).not.toContain('active');
    expect(items[1].classes()).toContain('active');
    expect(items[2].classes()).not.toContain('active');
    expect(items[1].vm.isActive).toBeTruthy();
    expect(items[2].vm.isActive).toBeFalsy();
    // test set value = undefined
    modelValue.value = undefined;
    await wrapper.vm.$nextTick();
    for (let i = 0; i < items.length; i++) {
      expect(items[i].classes()).not.toContain('active');
      expect(items[i].vm.isActive).toBeFalsy();
    }
  });

  it('should toggle items when set multiple prop', async () => {
    const modelValue = ref<undefined | number[] | number>(void 0);
    const wrapper = mount(group, {
      props: {
        multiple: true,
        modelValue,
      },
    });
    const items = wrapper.findAllComponents({
      name: 'item',
    });
    await items[0].trigger('click');
    await items[1].trigger('click');
    expect(items[0].classes()).toContain('active');
    expect(items[1].classes()).toContain('active');
    expect(wrapper.emitted()).toHaveProperty('update:modelValue');
    expect(wrapper.emitted()['update:modelValue'][1]).toEqual([[0, 1]]);
    await items[0].trigger('click');
    await items[1].trigger('click');
    expect(items[0].classes()).not.toContain('active');
    expect(items[1].classes()).not.toContain('active');
    expect(wrapper.emitted()).toHaveProperty('update:modelValue');
    expect(wrapper.emitted()['update:modelValue'][3]).toEqual([[]]);
    // test set value
    modelValue.value = [0, 1];
    await wrapper.vm.$nextTick();
    expect(items[0].classes()).toContain('active');
    expect(items[1].classes()).toContain('active');
    expect(items[0].vm.isActive).toBeTruthy();
    expect(items[1].vm.isActive).toBeTruthy();

    // test set value = 1
    modelValue.value = 1;
    await wrapper.vm.$nextTick();
    expect(items[0].classes()).not.toContain('active');
    expect(items[1].classes()).toContain('active');
    expect(items[0].vm.isActive).toBeFalsy();
    expect(items[1].vm.isActive).toBeTruthy();

    // test set value = undefined
    modelValue.value = undefined;
    await wrapper.vm.$nextTick();
    for (let i = 0; i < items.length; i++) {
      expect(items[i].classes()).not.toContain('active');
      expect(items[i].vm.isActive).toBeFalsy();
    }
  });

  it('should not emit value or change modelValue when set disabled', async () => {
    const state = ref<undefined | number>(undefined);
    const wrapper = mount(group, {
      props: {
        disabled: true,
        modelValue: state,
      },
    });
    const items = wrapper.findAllComponents({
      name: 'item',
    });
    await items[0].trigger('click');
    expect(items[0].classes()).not.toContain('active');
    expect(wrapper.emitted()).not.toHaveProperty('update:modelValue');
    state.value = 0;
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.lazyState.value).toBeUndefined();
  });

  it('should update toggle group when item unmounted', async () => {
    const state = ref<undefined | number | number[]>([0, 1]);
    const wrapper = mount(group, {
      props: {
        multiple: true,
        modelValue: state,
      },
    });
    await wrapper.unmount();
    expect(wrapper.emitted()).toHaveProperty('update:modelValue');
    expect(wrapper.emitted()['update:modelValue'][0]).toEqual([[]]);
  });
});
