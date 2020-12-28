import { mount, VueWrapper } from '@vue/test-utils';
import { defineComponent } from 'vue';
import BtnToggleGroup from '../BtnToggleGroup';
import Btn from '../Btn';
describe('BtnToggleGroup.ts', () => {
  let mountFunc: (options?: object) => VueWrapper<any>;
  beforeEach(() => {
    mountFunc = (opts = {}) =>
      mount(
        defineComponent({
          props: {
            multiple: Boolean,
            disabled: Boolean,
          },
          components: {
            BtnToggleGroup,
            Btn,
          },
          data() {
            return {
              v: undefined,
            };
          },
          template: `
          <btn-toggle-group :disabled="disabled" :multiple="multiple" v-model="v">
            <btn toggleable v-for="i in 5" :key="'button' + i">button-{{ i }}</btn>
          </btn-toggle-group>`,
        }),
        opts
      );
  });
  it('should toggle single btn', async () => {
    const wrapper = mountFunc();
    const buttons = wrapper.findAllComponents({
      name: 'btn',
    });
    expect(wrapper.classes()).toContain('btn-toggle-group');
    await buttons[0].trigger('click');
    expect(buttons[0].classes()).toContain('btn--active');
    expect(wrapper.vm.v).toEqual(0);
    await buttons[1].trigger('click');
    expect(wrapper.vm.v).toEqual(1);
    expect(buttons[0].classes()).not.toContain('btn--active');
    expect(buttons[1].classes()).toContain('btn--active');
    expect(wrapper.html()).toMatchSnapshot();
    wrapper.vm.v = 2;
    await wrapper.vm.$nextTick();
    expect(buttons[0].classes()).not.toContain('btn--active');
    expect(buttons[1].classes()).not.toContain('btn--active');
    expect(buttons[2].classes()).toContain('btn--active');
  });

  it('should toggle multiple btn', async () => {
    const wrapper = mountFunc({
      props: {
        multiple: true,
      },
    });
    const buttons = wrapper.findAllComponents({
      name: 'btn',
    });
    expect(wrapper.classes()).toContain('btn-toggle-group');
    await buttons[0].trigger('click');
    expect(buttons[0].classes()).toContain('btn--active');
    expect(wrapper.vm.v).toEqual([0]);
    await buttons[1].trigger('click');
    expect(wrapper.vm.v).toEqual([0, 1]);
    expect(buttons[0].classes()).toContain('btn--active');
    expect(buttons[1].classes()).toContain('btn--active');
    expect(wrapper.html()).toMatchSnapshot();
    wrapper.vm.v = [1, 2, 3];
    await wrapper.vm.$nextTick();
    expect(buttons[0].classes()).not.toContain('btn--active');
    expect(buttons[1].classes()).toContain('btn--active');
    expect(buttons[2].classes()).toContain('btn--active');
    expect(buttons[3].classes()).toContain('btn--active');
  });

  it('should not toggle when group disabled', async () => {
    const wrapper = mountFunc({
      props: {
        disabled: true,
      },
    });

    const buttons = wrapper.findAllComponents({
      name: 'btn',
    });
    expect(wrapper.classes()).toContain('btn-toggle-group');
    await buttons[0].trigger('click');
    expect(buttons[0].classes()).not.toContain('btn--active');
    wrapper.vm.v = 0;
    await wrapper.vm.$nextTick();
    expect(buttons[0].classes()).not.toContain('btn--active');
  });
});
