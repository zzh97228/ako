import { mount, VueWrapper } from '@vue/test-utils';
import { Ripple } from '../ripple';
describe('ripple.ts', () => {
  const component = {
    template: `<div v-ripple style="position: fixed; width: 100px; height: 200px">Ripple</div>`,
  };
  it('should generate ripple wrapper when mousedown', async () => {
    const wrapper = mount(component, {
      global: {
        directives: {
          Ripple,
        },
      },
    });;
    await wrapper.trigger('mousedown');
    expect(wrapper.attributes('style')).toContain('position: relative');
    const rippleWrapper = wrapper.find('.ripple__wrapper');
    expect(rippleWrapper).not.toBeUndefined();
    expect(rippleWrapper.attributes('style')).toContain('position: absolute');
    expect(rippleWrapper.attributes('style')).toContain('top: 0px; left: 0px; bottom: 0px; right: 0px;');
    const ripple = rippleWrapper.find('.ripple');
    expect(ripple).not.toBeUndefined();
    expect(ripple.attributes('style')).toContain('margin-left: 0px');
    expect(ripple.attributes('style')).toContain('margin-top: 0px');
  });
});
