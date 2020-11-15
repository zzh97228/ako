import { GridProps, GridService } from '..';

describe('grid.service', () => {
  let mountFunc: (opts?: GridProps) => GridService;
  beforeEach(() => {
    mountFunc = (options = {}) => {
      return new GridService(options);
    };
  });
  it('should append grid style to document', () => {
    let gridInstance = mountFunc({
      grid: {
        columns: 6,
        padding: '12px',
      },
    });
    gridInstance.appendStyle();
    const dom = document.head.querySelector('#ako-style');
    expect(dom).not.toBeNull();
    expect(dom?.innerHTML).toContain('--grid-columns: 6');
    expect(dom?.innerHTML).toContain('--grid-padding: 12px');
    gridInstance = mountFunc({
      grid: {
        columns: 7,
      },
    });
    gridInstance.appendStyle();
    expect(dom?.innerHTML).toContain('--grid-columns: 8');
  });
});
