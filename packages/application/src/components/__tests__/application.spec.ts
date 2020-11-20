import { mount } from '@vue/test-utils';
import { Application } from '../application';

describe('application.ts', () => {
  it('should render application component', () => {
    const wrapper = mount(Application, {
      slots: {
        default: 'app',
      },
      props: {
        tag: 'main',
      },
    });

    expect(wrapper.classes()).toContain('application');
    expect(wrapper.text()).toBe('app');
    expect(wrapper.element.tagName).toEqual('MAIN');
  });
});
