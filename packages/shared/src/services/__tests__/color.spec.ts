import { ColorService, defaultBaseColors, defaultThemeColors } from '../color';

describe('color.ts', () => {
  it('should generate styleString', () => {
    const service = new ColorService();
    const styleStr = service.genStyleString();
    for (let key in defaultBaseColors) {
      expect(styleStr).toContain(`--${key}: ${(defaultBaseColors as any)[key]}`);
      expect(styleStr).toContain(service.genColorClasses(key, false));
    }
    for (let key in defaultThemeColors) {
      expect(styleStr).toContain(`--${key}-color: ${(defaultThemeColors as any)[key]}`);
      expect(styleStr).toContain(service.genColorClasses(key, true));
    }
  });

  it('should append styleString to document', () => {
    const s1 = new ColorService();
    s1.appendStyle();
    const dom = document.head.querySelector('#ako-style');
    expect(dom).not.toBeNull();
    const s2 = new ColorService({
      color: {
        theme: {
          primary: '#000',
        },
      },
    });
    s2.appendStyle();
    expect(dom?.innerHTML).toContain('--primary-color: #000');
  });
});
