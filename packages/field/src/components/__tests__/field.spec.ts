import { mount } from '@vue/test-utils';
import Field from '../Field';

describe('field.ts', () => {
  it('should render field', () => {
    // TODO test field component
    const wrapper = mount(Field, {});
    expect(wrapper.classes()).toContain('field__wrapper');
  });
});
