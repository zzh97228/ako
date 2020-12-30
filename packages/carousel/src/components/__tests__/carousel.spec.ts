import { DOMWrapper, mount, VueWrapper } from '@vue/test-utils';
import { defineComponent, h, reactive } from 'vue';
import Carousel from '../Carousel';
import CarouselItem from '../CarouselItem';

describe('Carousel.ts', () => {
  let mountFunc: (options?: object) => VueWrapper<any>;
  beforeEach(() => {
    mountFunc = (props: Record<string, any> = {}) => {
      return mount(Carousel as any, {
        props,
        slots: {
          default: () => [
            h(CarouselItem, { key: 'c-0' }),
            h(CarouselItem, { key: 'c-1' }),
            h(CarouselItem, { key: 'c-2' }),
          ],
        },
      });
    };
  });

  it('should render carousel and its items', async () => {
    const wrapper = mountFunc();
    await wrapper.vm.$nextTick();
    expect(wrapper.classes()).toContain('carousel__wrapper');
    expect(wrapper.find('.carousel')).not.toBeUndefined();
    expect(wrapper.find('.carousel__activator-prev')).not.toBeUndefined();
    expect(wrapper.find('.carousel__activator-next')).not.toBeUndefined();
    const items = wrapper.findAll('.carousel-item');
    expect(items.length).toEqual(3);
    expect(items[0].classes()).toContain('carousel-item--active');
  });

  it('should change active item when press btn or change model', async () => {
    const activeClass = 'carousel-item--active';
    const wrapper = mountFunc();
    await wrapper.vm.$nextTick();

    let items = wrapper.findAll('.carousel-item');
    expect(items[0].classes()).toContain(activeClass);
    expect(items[1].classes()).not.toContain(activeClass);

    let prev: DOMWrapper<Element>, next: DOMWrapper<Element>;
    expect((prev = wrapper.find('.carousel__activator-prev'))).not.toBeUndefined();
    expect((next = wrapper.find('.carousel__activator-next'))).not.toBeUndefined();
    expect(items.length).toEqual(3);
    wrapper.vm.clickNext();
    await wrapper.vm.$nextTick();
    expect(items[0].classes()).not.toContain(activeClass);
    expect(items[1].classes()).toContain(activeClass);
    expect(items[2].classes()).not.toContain(activeClass);

    wrapper.vm.clickPrev();
    await wrapper.vm.$nextTick();
    items = wrapper.findAll('.carousel-item');
    expect(items[0].classes()).toContain(activeClass);
    expect(items[1].classes()).not.toContain(activeClass);

    await wrapper.setProps({
      modelValue: 2,
    });
    items = wrapper.findAll('.carousel-item');
    expect(items[0].classes()).not.toContain(activeClass);
    expect(items[1].classes()).not.toContain(activeClass);
    expect(items[2].classes()).toContain(activeClass);

    await wrapper.setProps({
      modelValue: '3',
    });
    items = wrapper.findAll('.carousel-item');
    expect(items[0].classes()).not.toContain(activeClass);
    expect(items[1].classes()).not.toContain(activeClass);
    expect(items[2].classes()).toContain(activeClass);

    wrapper.vm.clickNext();
    await wrapper.vm.$nextTick();
    items = wrapper.findAll('.carousel-item');
    expect(items[0].classes()).not.toContain(activeClass);
    expect(items[1].classes()).not.toContain(activeClass);
    expect(items[2].classes()).toContain(activeClass);
  });

  it('should be loop items when set loop', async () => {
    const activeClass = 'carousel-item--active';
    const wrapper = mountFunc({
      loop: true,
    });
    await wrapper.vm.$nextTick();

    let items = wrapper.findAll('.carousel-item');
    expect(items[0].classes()).toContain(activeClass);
    expect(items[1].classes()).not.toContain(activeClass);

    let prev: DOMWrapper<Element>, next: DOMWrapper<Element>;
    expect((prev = wrapper.find('.carousel__activator-prev'))).not.toBeUndefined();
    expect((next = wrapper.find('.carousel__activator-next'))).not.toBeUndefined();
    wrapper.vm.clickPrev();
    await wrapper.vm.$nextTick();
    items = wrapper.findAll('.carousel-item');
    expect(items[0].classes()).not.toContain(activeClass);
    expect(items[1].classes()).not.toContain(activeClass);
    expect(items[2].classes()).toContain(activeClass);

    wrapper.vm.clickNext();
    await wrapper.vm.$nextTick();
    items = wrapper.findAll('.carousel-item');
    expect(items[0].classes()).toContain(activeClass);
    expect(items[1].classes()).not.toContain(activeClass);
    expect(items[2].classes()).not.toContain(activeClass);

    await wrapper.setProps({
      modelValue: '4',
    });
    items = wrapper.findAll('.carousel-item');
    expect(items[0].classes()).not.toContain(activeClass);
    expect(items[1].classes()).toContain(activeClass);
    expect(items[2].classes()).not.toContain(activeClass);
  });

  it('should not change active item when disabled', async () => {
    const activeClass = 'carousel-item--active';
    const wrapper = mountFunc({
      disabled: true,
      modelValue: 1,
    });
    await wrapper.vm.$nextTick();

    let items = wrapper.findAll('.carousel-item');
    expect(items[0].classes()).not.toContain(activeClass);
    expect(items[1].classes()).toContain(activeClass);

    let prev: DOMWrapper<Element>, next: DOMWrapper<Element>;
    expect((prev = wrapper.find('.carousel__activator-prev'))).not.toBeUndefined();
    expect((next = wrapper.find('.carousel__activator-next'))).not.toBeUndefined();

    await next.trigger('click');
    items = wrapper.findAll('.carousel-item');
    expect(items[0].classes()).not.toContain(activeClass);
    expect(items[1].classes()).toContain(activeClass);
    expect(items[2].classes()).not.toContain(activeClass);

    await prev.trigger('click');
    items = wrapper.findAll('.carousel-item');
    expect(items[0].classes()).not.toContain(activeClass);
    expect(items[1].classes()).toContain(activeClass);
    expect(items[2].classes()).not.toContain(activeClass);

    await wrapper.setProps({
      modelValue: '2',
    });
    items = wrapper.findAll('.carousel-item');
    expect(items[0].classes()).not.toContain(activeClass);
    expect(items[1].classes()).toContain(activeClass);
    expect(items[2].classes()).not.toContain(activeClass);
  });
});
