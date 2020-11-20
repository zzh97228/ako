import { defaultElevation, VariableService } from '../variable';

describe('variable.ts', () => {
  it('should test varibale rootStr', () => {
    const service = new VariableService();
    service.appendStyle();
    const dom = document.head.querySelector('#ako-style');
    for (let key in defaultElevation) {
      expect(dom?.innerHTML).toContain(`--elevation-${key}: ${(defaultElevation as Record<string, string>)[key]}`);
    }
  });
});
