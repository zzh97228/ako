# Message

<ako-btn @click="onClickBtn">button</ako-btn>

<script>
export default {
  methods: {
    onClickBtn() {
      this.$message()
    }
  }
}
</script>