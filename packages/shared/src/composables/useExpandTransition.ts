import { convertToUnit, isNumber, isUndefined, upperFirst } from '../utils/helpers';

function setStyleProperty(el: Element, key: string, value: string) {
  (el as HTMLElement).style.setProperty(key, value);
}
export function useExpandTransition(expandWidth?: boolean, transitioDur: number = 150) {
  const propName = expandWidth ? 'width' : 'height';
  const offsetName = `offset${upperFirst(propName)}`;
  const onBefore = (el: Element) => {
    const curr = el as HTMLElement;
    el._expand_transition = {
      transition: curr.style.transition,
      [propName]: curr.style[propName],
      overflow: curr.style.overflow,
    };
  };
  const onEnter = (el: Element) => {
    const currOffset = (el as any)[offsetName];
    setStyleProperty(el, 'overflow', 'hidden');
    setStyleProperty(el, propName, '0px');
    // essential force reflow
    void (el as any)[offsetName];

    setStyleProperty(el, 'transition', `${propName} ${transitioDur}ms ease`);

    requestAnimationFrame(() => {
      setStyleProperty(el, propName, convertToUnit(currOffset) || '0');
    });
  };
  const onLeave = (el: Element) => {
    const currOffset = (el as any)[offsetName];
    setStyleProperty(el, 'overflow', 'hidden');
    setStyleProperty(el, propName, convertToUnit(currOffset) || '0');

    // essential force reflow
    void (el as any)[offsetName];

    setStyleProperty(el, 'transition', `${propName} ${transitioDur}ms ease`);

    requestAnimationFrame(() => {
      setStyleProperty(el, propName, '0px');
    });
  };
  const onAfter = (el: Element) => {
    if (isUndefined(el._expand_transition)) return;
    const size = el._expand_transition[propName] as string;
    setStyleProperty(el, 'overflow', el._expand_transition.overflow || '');
    setStyleProperty(el, 'transition', el._expand_transition.transition);
    if (size != null) setStyleProperty(el, propName, size);
    delete el._expand_transition;
  };

  return {
    onBeforeEnter: onBefore,
    onEnter,
    onAfterEnter: onAfter,
    onEnterCancelled: onAfter,
    onBeforeLeave: onBefore,
    onLeave,
    onAfterLeave: onAfter,
    onLeaveCancelled: onAfter,
  };
}
