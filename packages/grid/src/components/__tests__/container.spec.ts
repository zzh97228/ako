import { mount } from '@vue/test-utils';
import Container from '../container';

describe('container.ts', () => {
  it('should render container with customized tag and size', () => {
    const container = mount(Container, {
      props: {
        tag: 'main',
        height: '200px',
        width: '100px',
      },
    });

    expect(container.classes()).toContain('container');
    expect(container.attributes('style')).toContain('width: 100px');
    expect(container.attributes('style')).toContain('height: 200px');
    expect(container.element.tagName).toEqual('MAIN');
    expect(container.html()).toMatchSnapshot();
  });
});
