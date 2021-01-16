import { mount, VueWrapper } from '@vue/test-utils';
import { h } from 'vue';
import Dropdown from '../Dropdown';

describe('Dropdown.ts', () => {
  let mountFunc: (opts?: object) => VueWrapper<any>;
  beforeEach(() => {
    mountFunc = (options = {}) =>
      mount(Dropdown, {
        slots: {
          activator: () => h('div', { style: 'width: 100px' }, 'button'),
          default: () => h('div', { style: 'width: 200px' }),
        },
        ...options,
      });
  });
  it('should show on appear', () => {
    const wrapper = mountFunc({
      props: {
        showOnAppear: true,
      },
    });
    expect(wrapper.classes()).toContain('dropdown__wrapper');
    expect(wrapper.vm.isActive).toBeTruthy();
    const content = document.body.querySelector('.dropdown__content');
    expect(content).not.toBeNull();
    expect(content?.getAttribute('style')).toContain('position: absolute');
  });

  it('should show active activator when click activator', async () => {
    const wrapper = mountFunc();
    const activator = wrapper.find('.dropdown__activator');
    expect(activator.exists()).toBeTruthy();
    await activator.trigger('click');
    expect(activator.classes()).toContain('dropdown__activator--active');
  });

  it('should close when click activator', async () => {
    const wrapper = mountFunc({
      props: {
        showOnAppear: true,
      },
    });
    const activator = wrapper.find('.dropdown__activator');
    expect(activator.exists()).toBeTruthy();
    await activator.trigger('click');
    expect(wrapper.vm.isActive).toBeFalsy();
  });

  it('should not be active when trigger click', async () => {
    const wrapper = mountFunc({
      props: {
        showOnAppear: true,
        disabled: true,
      },
    });
    expect(wrapper.vm.isActive).toBeFalsy();
    const activator = wrapper.find('.dropdown__activator');
    expect(activator.exists()).toBeTruthy();
    await activator.trigger('click');
    expect(wrapper.vm.isActive).toBeFalsy();
  });
});
