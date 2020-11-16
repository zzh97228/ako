import { mount, VueWrapper } from '@vue/test-utils';
import { Row } from '../row';

describe('row.ts', () => {
  let mountFunc: (options?: object) => VueWrapper<any>;
  beforeEach(() => {
    mountFunc = (options = {}) => {
      return mount(Row, options);
    };
  });

  it('should render row component with customized justify & align props', () => {
    const wrapper = mountFunc({
      props: {
        justify: 'center',
        align: 'end',
      },
    });
    expect(wrapper.classes()).toContain('row');
    expect(wrapper.classes()).toContain('row--justify-content-center');
    expect(wrapper.classes()).toContain('row--align-items-end');
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('should render row component with customized gutter', async () => {
    const wrapper = mountFunc({
      props: {
        gutter: 'xs',
      },
    });
    expect(wrapper.classes()).toContain('row--gutter-xs');
    expect(wrapper.html()).toMatchSnapshot();

    await wrapper.setProps({
      gutter: '4px',
    });
    expect(wrapper.attributes('style')).toContain('margin-left: -4px');
    expect(wrapper.attributes('style')).toContain('margin-right: -4px');
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('should have vertical margin when set \"column\" props', () => {
    const wrapper = mountFunc({
      props: {
        gutter: '8px',
        column: true,
      },
    });
    expect(wrapper.classes()).toContain('row--column');
    expect(wrapper.attributes('style')).toContain('margin-top: -8px');
    expect(wrapper.attributes('style')).toContain('margin-bottom: -8px');
    expect(wrapper.html()).toMatchSnapshot();
  });
});
