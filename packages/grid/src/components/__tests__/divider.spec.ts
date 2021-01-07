import { mount } from '@vue/test-utils';
import Divider from '../Divider';

describe('Divider.ts', () => {
  it('should render divider component', () => {
    const wrapper = mount(Divider);
    expect(wrapper.classes()).toContain('divider__wrapper');
    const divider = wrapper.find('.divider');
    expect(divider.exists()).toBeTruthy();
  });

  it('should render vertical divider', () => {
    const wrapper = mount(Divider, {
      props: {
        vertical: true,
      },
    });
    const divider = wrapper.find('.divider');
    expect(divider.exists()).toBeTruthy();
    expect(wrapper.classes()).toContain('divider--vertical');
  });
});
