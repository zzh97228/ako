import { deepEqual } from '@lagabu/shared';
import { mount, VueWrapper } from '@vue/test-utils';
import { computed, defineComponent, onBeforeUnmount, reactive, watch } from 'vue';
import Checkbox from '../Checkbox';
import CheckboxGroup from '../CheckboxGroup';
const template = defineComponent({
  name: 'temp',
  components: {
    CheckboxGroup,
    Checkbox,
  },
  setup() {
    const rawValue = [0, 1];
    const state = reactive({
      gValue: [...rawValue],
      cValue: true,
    });
    const indetermined = computed(() => {
      return state.gValue.length < rawValue.length && state.gValue.length > 0;
    });

    const checkboxStop = watch(
      () => state.cValue,
      (newVal, oldVal) => {
        if (newVal === oldVal) return;
        if (newVal === true) {
          state.gValue = [...rawValue];
        } else if (newVal === false) {
          state.gValue = [];
        }
      }
    );

    const groupStop = watch(
      () => state.gValue,
      (newVal, oldVal) => {
        if (newVal === oldVal) return;
        if (deepEqual(newVal, rawValue)) {
          state.cValue = true;
        } else if (newVal.length === 0) {
          state.cValue = false;
        }
      }
    );

    onBeforeUnmount(() => {
      checkboxStop();
      groupStop();
    });

    return {
      state,
      indetermined,
    };
  },
  template: `
  <checkbox id="g" :indetermined="indetermined" v-model="state.cValue"></checkbox>
  <checkbox-group multiple v-model="state.gValue">
    <checkbox id="c-1"></checkbox>
    <checkbox id="c-2"></checkbox>
  </checkbox-group>
  `,
});
describe('CheckboxGroup.ts', () => {
  let mountFunc: () => VueWrapper<any>;
  beforeEach(() => {
    mountFunc = () => {
      return mount(template);
    };
  });

  it('should render template', async () => {
    const activeClass = 'checkbox--active',
      indeterminedClass = 'checkbox--indetermined';
    const wrapper = mountFunc();
    const gCheckbox = wrapper.find('#g').find('.checkbox');
    const c1 = wrapper.find('#c-1').find('.checkbox');
    const c2 = wrapper.find('#c-2').find('.checkbox');
    await wrapper.vm.$nextTick();
    expect(gCheckbox).not.toBeUndefined();
    expect(c1).not.toBeUndefined();
    expect(c2).not.toBeUndefined();
    expect(gCheckbox.classes()).not.toContain(indeterminedClass);
    expect(gCheckbox.classes()).toContain(activeClass);
    expect(c1.classes()).toContain(activeClass);
    expect(c2.classes()).toContain(activeClass);

    await gCheckbox.trigger('click');
    expect(wrapper.vm.state.gValue).toEqual([]);
    expect(c1.classes()).not.toContain(activeClass);
    expect(c2.classes()).not.toContain(activeClass);

    await c1.trigger('click');
    expect(c1.classes()).toContain(activeClass);
    expect(wrapper.vm.state.gValue).toEqual([0]);
    expect(gCheckbox.classes()).toContain(indeterminedClass);

    await c2.trigger('click');
    expect(c2.classes()).toContain(activeClass);
    expect(wrapper.vm.state.gValue).toEqual([0, 1]);
    expect(wrapper.vm.state.cValue).toEqual(true);
    expect(gCheckbox.classes()).not.toContain(indeterminedClass);
    expect(gCheckbox.classes()).toContain(activeClass);

    await c1.trigger('click');
    await c2.trigger('click');
    expect(gCheckbox.classes()).not.toContain(activeClass);
    expect(gCheckbox.classes()).not.toContain(indeterminedClass);

    await c1.trigger('click');
    expect(gCheckbox.classes()).toContain(indeterminedClass);
    expect(gCheckbox.classes()).not.toContain(activeClass);

    await gCheckbox.trigger('click');
    expect(gCheckbox.classes()).toContain(activeClass);
    expect(gCheckbox.classes()).not.toContain(indeterminedClass);

    expect(c1.classes()).toContain(activeClass);
    expect(c2.classes()).toContain(activeClass);
  });
});
