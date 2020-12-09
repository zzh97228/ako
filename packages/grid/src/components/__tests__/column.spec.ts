import { mount, VueWrapper } from '@vue/test-utils';
import { computed } from 'vue';
import { GridSymbol } from '../../composables/useGrid';
import Column from '../column';

describe('column.ts', () => {
  let mountFunc: (options?: object, column?: boolean) => VueWrapper<any>;
  beforeEach(() => {
    mountFunc = (options = {}, column?: boolean) => {
      return mount(Column, {
        global: {
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
    expect(wrapper.classes()).toContain('col-6-xs');
    expect(wrapper.classes()).toContain('col-4-md');
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
