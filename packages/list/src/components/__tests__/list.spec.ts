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
});
