<template>
  <div class="row row--wrap">
    <div class="col col-6 col-6-xs col-4-sm col-2-md" v-for="i in 4" :key="i">
      App
    </div>
    <input type="text" :value="txt">
  </div>
</template>

<script>
export default {
  name: 'Home',
  data() {
    return {
      txt: ''
    }
  }
}
</script>