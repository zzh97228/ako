# Message

<ac-btn @click="onClickBtn">button</ac-btn>

<script>
export default {
  methods: {
    onClickBtn() {
      this.$message()
    }
  }
}
</script>