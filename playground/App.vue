<template>
  <ako-container max-width="768px">
    <router-link
      v-for="(t, i) in to"
      :key="i"
      :to="t"
      custom
      v-slot="{ navigate, href, isActive }"
    >
      <ako-btn link large tag="a" :href="href" :active="isActive" @click="navigate">
        <span style="font-size: 14px">这是首页</span>
      </ako-btn>
    </router-link>
    <router-view></router-view>
  </ako-container>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      to: ['/', '/test'],
    };
  },
};
</script>