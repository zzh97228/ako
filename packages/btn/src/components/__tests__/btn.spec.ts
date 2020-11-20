import { mount, VueWrapper } from '@vue/test-utils';
import { defineComponent, h } from 'vue';
import { Btn } from '../btn';

describe('btn.ts', () => {
  let mountFunc: (opts?: object) => VueWrapper<any>;
  beforeEach(() => {
    mountFunc = (opts = {}) => {
      return mount(Btn, opts);
    };
  });
  it('should render btn with default props', async () => {
    const wrapper = mountFunc({
      props: {
        outlined: true,
        color: 'primary',
        flat: true,
        small: true,
        large: true,
        block: true,
        round: true,
      },
    });

    expect(wrapper.classes()).toContain('elevation-xs');
    expect(wrapper.classes()).toContain('btn');
    expect(wrapper.classes()).toContain('btn--outlined');
    expect(wrapper.classes()).toContain('btn--flat');
    expect(wrapper.classes()).toContain('primary-color--text');
    expect(wrapper.classes()).toContain('btn--small');
    expect(wrapper.classes()).toContain('btn--large');
    expect(wrapper.classes()).toContain('btn--block');
    expect(wrapper.classes()).toContain('btn--round');
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('should not be called when set disabled props', async () => {
    const click = jest.fn();
    const wrapper = mount(() =>
      h(
        Btn,
        {
          disabled: true,
          onClick: click,
        },
        () => 'button'
      )
    );
    await wrapper.trigger('click');
    expect(click).not.toHaveBeenCalled();
  });
});
