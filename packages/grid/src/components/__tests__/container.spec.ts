import { mount, VueWrapper } from '@vue/test-utils';
import Container from '../container';

describe('container.ts', () => {
  let mountFunc: (opts?: object) => VueWrapper<any>;
  beforeEach(() => {
    mountFunc = (options = {}) => mount(Container, options);
  });
  it('should render container with customized tag and size', () => {
    const wrapper = mountFunc({
      props: {
        tag: 'main',
        height: '200px',
        width: '100px',
      },
      slots: {
        default: () => 'container',
      },
    });

    expect(wrapper.classes()).toContain('container');
    expect(wrapper.attributes('style')).toContain('width: 100px');
    expect(wrapper.attributes('style')).toContain('height: 200px');
    expect(wrapper.element.tagName).toEqual('MAIN');
    expect(wrapper.text()).toBe('container');
    expect(wrapper.html()).toMatchSnapshot();
  });
  it('should have fluid classes when set fluid props', () => {
    const wrapper = mountFunc({
      props: {
        fluid: true,
      },
    });

    expect(wrapper.classes()).toContain('container--fluid');
    expect(wrapper.html()).toMatchSnapshot();
  });
});
