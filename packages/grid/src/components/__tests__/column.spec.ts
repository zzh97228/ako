import { mount, VueWrapper } from '@vue/test-utils';
import { computed, reactive } from 'vue';
import { GridSymbol } from '../../composables/useGrid';
import Column from '../column';

describe('column.ts', () => {
  let mountFunc: (options?: object, column?: boolean) => VueWrapper<any>;
  beforeEach(() => {
    mountFunc = (options = {}, column?: boolean) => {
      const state = reactive({
        xs: false,
        sm: false,
        md: true,
        lg: true,
        xl: true,
      });
      return mount(Column, {
        global: {
          mocks: {
            $ako: {
              $breakpoints: state,
            },
          },
          provide: {
            [GridSymbol as symbol]: {
              gutter: computed(() => '4px'),
              column: computed(() => column),
            },
          },
        },
        ...options,
      });
    };
  });
  it('should render column component with default props', async () => {
    const wrapper = mountFunc({
      props: {
        cols: 6,
        grow: true,
      },
    });

    expect(wrapper.classes()).toContain('col');
    expect(wrapper.classes()).toContain('col-6');
    expect(wrapper.classes()).toContain('col--grow');

    await wrapper.setProps({
      xs: 6,
      md: 4,
    });
    expect(wrapper.classes()).toContain('col-4');
    expect(wrapper.attributes('style')).toContain('padding-left: 4px');
    expect(wrapper.attributes('style')).toContain('padding-right: 4px');
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('should have vertical padding when row provide column props', () => {
    const wrapper = mountFunc(
      {
        props: {
          cols: 10,
          shrink: true,
        },
      },
      true
    );
    expect(wrapper.classes()).toContain('col--shrink');
    expect(wrapper.attributes('style')).toContain('padding-top: 4px');
    expect(wrapper.attributes('style')).toContain('padding-bottom: 4px');
    expect(wrapper.html()).toMatchSnapshot();
  });
});
