<template>
  <div>
    <ac-btn @click="onClick">button</ac-btn>
  </div>
</template>

<script>
export default {
  methods: {
    onClick() {
      this.$message('hello world');
    },
  },
};
</script>