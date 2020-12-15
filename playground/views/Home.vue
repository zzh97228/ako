<template>
  <div class="row row--wrap">
    <div class="col col-6 col-6-xs col-4-sm col-2-md" v-for="i in 4" :key="i">
      App
    </div>
    <input type="text" :value="txt" />
    <div @click="onClick">
      {{ state.m }}
    </div>
  </div>
</template>

<script>
import { reactive, ref, watch } from 'vue';
export default {
  name: 'Home',
  data() {
    return {
      txt: '',
    };
  },
  setup() {
    const m = [0, 1];
    const state = reactive({
      m,
    });
    watch(state.m, (newVal) => {
      console.log(newVal);
    });
    return {
      state,
    };
  },
  methods: {
    onClick() {
      this.state.m[0] += 1;
    },
  },
};
</script>