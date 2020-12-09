import { ColorService } from '../color';
import { styleId } from '../base';
describe('color.ts', () => {
  it('should append styleString to document', () => {
    const s1 = new ColorService();
    s1.appendStyle();
    let dom = document.head.querySelector('#' + styleId);
    expect(dom).toBeNull();
    const s2 = new ColorService({
      color: {
        theme: {
          primary: '#000',
        },
        basic: {
          'red-0': '#fff',
        },
      },
    });
    s2.appendStyle();
    dom = document.head.querySelector('#' + styleId);
    expect(dom).not.toBeNull();
    expect(dom?.innerHTML).toContain('--primary-color: #000');
    expect(dom?.innerHTML).toContain('.primary-color');
    expect(dom?.innerHTML).toContain('.primary-color--text');
    expect(dom?.innerHTML).toContain('--red-0: #fff');
    expect(dom?.innerHTML).toContain('.red-0');
    expect(dom?.innerHTML).toContain('.red-0--text');
  });
});
