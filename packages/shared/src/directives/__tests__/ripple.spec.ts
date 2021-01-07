import { mount, VueWrapper } from '@vue/test-utils';
import { Ripple } from '../ripple';
describe('ripple.ts', () => {
  it('should generate ripple wrapper when mousedown', async () => {
    const wrapper = mount(
      {
        template: `<div v-ripple style="position: fixed; width: 100px; height: 200px">Ripple</div>`,
      },
      {
        global: {
          directives: {
            Ripple,
          },
        },
      }
    );
    await wrapper.trigger('pointerdown');
    expect(wrapper.attributes('style')).toContain('position: relative');
    const rippleWrapper = wrapper.find('.ripple__wrapper');
    expect(rippleWrapper.exists()).toBeTruthy();
    expect(rippleWrapper.attributes('style')).toContain('position: absolute');
    expect(rippleWrapper.attributes('style')).toContain('top: 0px; left: 0px; bottom: 0px; right: 0px;');
    const ripple = rippleWrapper.find('.ripple');
    expect(ripple).not.toBeUndefined();
    expect(ripple.attributes('style')).toContain('margin-left: 0px');
    expect(ripple.attributes('style')).toContain('margin-top: 0px');
  });

  it('should not generate ripple when disabled', async () => {
    const wrapper = mount(
      {
        template: `<div v-ripple="{disabled: true}" style="position: fixed; width: 100px; height: 200px">Ripple</div>`,
      },
      {
        global: {
          directives: {
            Ripple,
          },
        },
      }
    );

    await wrapper.trigger('pointerdown');
    const rippleWrapper = wrapper.find('.ripple__wrapper');
    expect(rippleWrapper.exists()).toBeFalsy();
  });

  it('should customize trigger event', async () => {
    const eventName = 'keydown';
    const wrapper = mount(
      {
        template: `<div v-ripple="{eventName: '${eventName}'}" style="position: fixed; width: 100px; height: 200px">Ripple</div>`,
      },
      {
        global: {
          directives: {
            Ripple,
          },
        },
      }
    );

    await wrapper.trigger(eventName);
    const rippleWrapper = wrapper.find('.ripple__wrapper');
    expect(rippleWrapper.exists()).toBeTruthy();
  });

  it('should have no border-raius when set tile arg', async () => {
    const wrapper = mount(
      {
        template: `<div v-ripple:tile style="position: fixed; width: 100px; height: 200px">Ripple</div>`,
      },
      {
        global: {
          directives: {
            Ripple,
          },
        },
      }
    );
    await wrapper.trigger('pointerdown');
    const rippleWrapper = wrapper.find('.ripple');
    expect(rippleWrapper.exists()).toBeTruthy();
    expect(rippleWrapper.attributes('style')).toContain('border-radius: 0');
  });
});
