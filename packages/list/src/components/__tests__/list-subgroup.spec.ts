import { mount, VueWrapper } from '@vue/test-utils';
import { h } from 'vue';
import ListItem from '../ListItem';
import ListSubgroup from '../ListSubgroup';
function wait(timeout = 0) {
  return new Promise((resolve) => setTimeout(resolve, timeout));
}
describe('ListSubgroup.ts', () => {
  let mountFunc: (opts?: object) => VueWrapper<any>;
  beforeEach(() => {
    mountFunc = (opts = {}) =>
      mount(ListSubgroup, {
        slots: {
          activator: () => h(ListItem, { default: 'activator' }),
          default: () => [h(ListItem, { default: 'hello' })],
        },
        ...opts,
      });
  });
  it('should display items when click activator', async () => {
    const wrapper = mountFunc();

    expect(wrapper.classes()).toContain('list-subgroup');
    const activator = wrapper.find('.list-subgroup__activator');
    expect(activator.exists()).toBeTruthy();
    const content = wrapper.find('.list-subgroup__content');
    expect(content.exists()).toBeTruthy();
    expect(content.attributes('style')).toContain('display: none');

    await activator.trigger('click');
    expect(wrapper.classes()).toContain('list-subgroup--active');
  });

  it('should not display items when set disabled property', async () => {
    const wrapper = mountFunc({
      props: {
        disabled: true,
      },
    });
    expect(wrapper.classes()).toContain('list-subgroup');
    const activator = wrapper.find('.list-subgroup__activator');
    expect(activator.exists()).toBeTruthy();
    const content = wrapper.find('.list-subgroup__content');
    expect(content.exists()).toBeTruthy();
    expect(content.attributes('style')).toContain('display: none');

    await activator.trigger('click');
    expect(wrapper.classes()).toContain('list-subgroup--disabled');
  });

  it('should have active class when set `showOnAppear` prop in subgroup component', () => {
    const wrapper = mountFunc({
      props: {
        showOnAppear: true,
      },
    });

    expect(wrapper.classes()).toContain('list-subgroup--active');
  });
});
