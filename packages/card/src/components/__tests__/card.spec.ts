import { mount, VueWrapper } from '@vue/test-utils';
import Card from '../Card';

describe('card.ts', () => {
  let mountFunc: (options?: object) => VueWrapper<any>;
  beforeEach(() => {
    mountFunc = (opts = {}) => mount(Card, opts);
  });
  it('should render card', () => {
    const wrapper = mountFunc({
      props: {
        width: '100%',
        height: '100%',
      },
    });

    expect(wrapper.classes()).toContain('card');
    expect(wrapper.classes()).toContain('elevation-xs');
    expect(wrapper.attributes('style')).toContain('width: 100%');
    expect(wrapper.attributes('style')).toContain('height: 100%');
    expect(wrapper.html()).toMatchSnapshot();
  });
});
