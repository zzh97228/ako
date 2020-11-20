<template>
  <div>
    <ako-btn disabled @click="onclick">haha</ako-btn>
    <ako-btn>这是个按钮</ako-btn>
    <ako-btn round>hehehe</ako-btn>
    <ako-btn fab outlined>赞</ako-btn>
  </div>
</template>

<script>
export default {
  name: 'Button',
  methods: {
    onclick() {
      console.log('haha');
    },
  },
};
</script>