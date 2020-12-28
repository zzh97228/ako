import { mount, VueWrapper } from '@vue/test-utils';
import FileInput from '../FileInput';
// TODO test file-input file
describe('FileInput.ts', () => {
  let mountFunc: (opts?: object) => VueWrapper<any>;
  beforeEach(() => {
    mountFunc = (opts = {}) => mount(FileInput, opts);
  });
  it('should render file-input component', () => {
    const wrapper = mountFunc();
    expect(wrapper.classes()).toContain('file-input__wrapper');
    expect(wrapper.find('input').exists()).toBeTruthy();
  });
});
