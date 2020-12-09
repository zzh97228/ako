import { GridService } from '..';
import { styleId } from '@lagabu/shared';
describe('GridService', () => {
  it('should change the gutter & breakpoints value and append classes to the head', () => {
    const s1 = new GridService({
      grid: {
        columns: 14,
        gutters: {
          xs: '5px',
        },
      },
    });
    s1.appendStyle();
    let dom = document.head.querySelector('#' + styleId);
    expect(dom).not.toBeNull();
    let html = dom!.innerHTML;
    expect(html).toContain('--gutter-xs: 5px');
    expect(html).toContain('--gutter-xs-reverse: -5px');
    expect(html).toContain('.col-14');
    expect(html).toContain('--columns: 14');
  });
});
