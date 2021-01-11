import { onMounted, reactive, Ref } from 'vue';
import { hasWindow } from '../utils/helpers';
function calculateElm(el: HTMLElement) {
  // TODO calculate element
  const { left, top, width, height } = el.getBoundingClientRect();
  const [windowX, windowY] = [window.scrollX, window.scrollY];
}

export function usePosition(elRef: Ref<HTMLElement | null>) {
  const state = reactive({});

  onMounted(() => {
    if (!elRef.value || !hasWindow()) return;
    calculateElm(elRef.value);
  });
}
