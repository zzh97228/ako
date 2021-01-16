import { mount, VueWrapper } from '@vue/test-utils';
import List from '../List';
describe('List.ts', () => {
  let mountFunc: (opts?: object) => VueWrapper<any>;
  beforeEach(() => {
    mountFunc = (options = {}) => mount(List, options);
  });
  it('should render list component', () => {
    const wrapper = mountFunc();
    expect(wrapper.element.tagName).toEqual('UL');
    expect(wrapper.classes()).toContain('list');
  });
  it('should change size and elevation', () => {
    const wrapper = mountFunc({
      props: {
        elevation: 'xs',
        height: '100px',
        width: '100px',
      },
    });
    expect(wrapper.classes()).toContain('elevation-xs');
    expect(wrapper.attributes('style')).toContain('width: 100px');
    expect(wrapper.attributes('style')).toContain('height: 100px');
  });
});
