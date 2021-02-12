# Field

<ako-field v-model="word" label-col="6" input-col="6" :rules="rules"><ako-text-input></ako-text-input></ako-field>

<p>{{ word }}</p>

<script>
export default {
  data() {
    return {
      word: 'hello world'
    }
  },
  computed: {
    rules() {
      return [(val) => val.length > 0 && 'hhahahaha']
    }
  }
}
</script>
