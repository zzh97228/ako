import { mount, VueWrapper } from '@vue/test-utils';
import { defineComponent, h } from 'vue';
import { useToggle, genToggleProps } from '../useToggle';
describe('useToggle.ts', () => {
  let mountFunc: (opts?: object) => VueWrapper<any>;
  beforeEach(() => {
    mountFunc = (opts = {}) =>
      mount(
        defineComponent({
          props: {
            ...genToggleProps('active'),
          },
          setup(props, context) {
            const { isActive, class: toggleClasses, toggle } = useToggle(props, context);
            return {
              isActive,
              toggleClasses,
              toggle,
            };
          },
          render() {
            return h('div', {
              class: this.toggleClasses,
              onClick: this.toggle,
            });
          },
        }),
        opts
      );
  });

  it('should have active class when set active value', async () => {
    const wrapper = mountFunc();
    wrapper.vm.isActive = true;
    await wrapper.vm.$nextTick();
    expect(wrapper.classes()).toContain('active');
    await wrapper.trigger('click');
    expect(wrapper.vm.isActive).toBeFalsy();
    expect(wrapper.emitted()).toHaveProperty('update:active');
  });
  it('should have active class when set active prop', async () => {
    const wrapper = mountFunc({
      props: {
        active: true,
      },
    });
    expect(wrapper.classes()).toContain('active');
    await wrapper.trigger('click');
    expect(wrapper.vm.isActive).toBeTruthy();
  });
});
