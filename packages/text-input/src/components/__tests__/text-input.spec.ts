import { mount, VueWrapper } from '@vue/test-utils';
import { defineComponent } from 'vue';
import TextInput from '../TextInput';
describe('input.ts', () => {
  let mountFunc: (options?: object) => VueWrapper<any>;
  beforeEach(() => {
    mountFunc = (opts = {}) => mount(TextInput, opts);
  });
  it('should render input component', () => {
    const wrapper = mountFunc({
      props: {
        modelValue: 'hello world',
      },
    });
    expect(wrapper.classes()).toContain('text-input__wrapper');
    expect(wrapper.find('input').classes()).toContain('text-input__content');
    const inputElm = wrapper.find('input').element;
    expect(inputElm.getAttribute('type')).toBe('text');
    expect(inputElm.value).toBe('hello world');
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('should change its value when change `v-model` value', async () => {
    const wrapper = mount(
      defineComponent({
        components: {
          TempInput: TextInput,
        },
        data() {
          return {
            txt: 'hello',
          };
        },
        template: `<temp-input v-model="txt"></temp-input>`,
      })
    );
    await wrapper.setData({
      txt: 'world',
    });
    expect(wrapper.find('input').element.value).toBe('world');
  });
});
