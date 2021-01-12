import { mount, VueWrapper } from '@vue/test-utils';
import ListItem from '../ListItem';
describe('ListItem.ts', () => {
  let mountFunc: (opts?: object) => VueWrapper<any>;
  beforeEach(() => {
    mountFunc = (opts = {}) => mount(ListItem, opts);
  });
  it('should render list-item with active props', async () => {
    const wrapper = mountFunc();
    expect(wrapper.classes()).toContain('list-item');
    const content = wrapper.find('.list-item__content');
    expect(content.exists()).toBeTruthy();
    await wrapper.trigger('click');
    expect(wrapper.classes()).toContain('list-item--active');
    await wrapper.setProps({
      active: false,
    });
    await wrapper.vm.$nextTick();
    expect(wrapper.classes()).not.toContain('list-item--active');
  });

  it('should not toggle active when set `disabled`', async () => {
    const wrapper = mountFunc({
      props: {
        disabled: true,
      },
    });
    await wrapper.trigger('click');
    expect(wrapper.classes()).not.toContain('list-item--active');
    await wrapper.setProps({
      active: true,
    });
    expect(wrapper.classes()).not.toContain('list-item--active');
  });

  it('should render prefix and suffix element', () => {
    const wrapper = mountFunc({
        slots: {
          prefix: () => 'hello',
          suffix: () => 'world',
        },
      }),
      prefix = wrapper.find('.list-item__prefix'),
      suffix = wrapper.find('.list-item__suffix');
    expect(prefix.exists()).toBeTruthy();
    expect(suffix.exists()).toBeTruthy();
    expect(prefix.text()).toEqual('hello');
    expect(suffix.text()).toEqual('world');
  });
});
