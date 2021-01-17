# Field

<ac-field v-model="word" label-col="6" input-col="6" :rules="rules"><ac-text-input></ac-text-input></ac-field>

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
