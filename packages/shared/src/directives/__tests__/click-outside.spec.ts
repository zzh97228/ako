import { nextTick } from 'vue';
import { ClickOutside, ClickoutsideBinding } from '../clickOutside';
function bootstrap(obj?: object) {
  let handler: any;
  const el = document.createElement('div');
  const binding = {
    value: {
      callback: jest.fn() as any,
      ...obj,
    },
  };
  jest.spyOn(document.documentElement, 'addEventListener').mockImplementation((e, callback, options) => {
    handler = callback;
  });
  jest.spyOn(document.documentElement, 'removeEventListener');

  (ClickOutside as any).mounted(el, binding as ClickoutsideBinding, {} as any, null);

  return {
    callback: binding.value.callback,
    el: el as HTMLElement,
    registeredHandler: handler,
  };
}

function wait() {
  return new Promise((resolve) => setTimeout(resolve, 0));
}

describe('clickOutside.ts', () => {
  it('should register and unregister handler', () => {
    const { registeredHandler, el } = bootstrap();
    expect(document.documentElement.addEventListener).toHaveBeenCalledWith('click', registeredHandler, true);

    (ClickOutside as any).beforeUnmount(el, {} as any, {} as any, null);
    expect(document.documentElement.removeEventListener).toHaveBeenCalledWith('click', registeredHandler, true);
  });

  it('should call the callback when not disabled', async () => {
    const { registeredHandler, callback } = bootstrap({ disabled: false });
    const event = { target: document.createElement('div') };

    registeredHandler(event);
    await wait();
    expect(callback).toHaveBeenCalledWith(event);
  });

  it('should not call the callback when disabled', async () => {
    const { registeredHandler, callback, el } = bootstrap({ disabled: true });
    const event = { target: el };

    registeredHandler(event);
    await wait();
    expect(callback).not.toHaveBeenCalled();
  });

  it('should not call callback when click in element', async () => {
    const { registeredHandler, callback, el } = bootstrap();
    const event = { target: el };

    registeredHandler(event);
    await wait();
    expect(callback).not.toHaveBeenCalled();
  });

  it('should not call callback when click in element and element include', async () => {
    const el = document.createElement('div');
    const { registeredHandler, callback } = bootstrap({
      include: () => [el],
    });
    const event = { target: el };

    registeredHandler(event);
    await wait();
    expect(callback).not.toHaveBeenCalled();
  });

  it('should not call callback when click in element and string element include', async () => {
    const el = document.createElement('div');
    el.setAttribute('id', 'elm');
    document.documentElement.appendChild(el);
    const { registeredHandler, callback } = bootstrap({
      include: () => ['#elm'],
    });
    const event = { target: el };

    registeredHandler(event);
    await wait();
    expect(callback).not.toHaveBeenCalled();
  });
});
