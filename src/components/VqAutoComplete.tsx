
import { defineComponent, ref } from 'vue'
import { useField } from 'vee-validate'
export default defineComponent({
  name: 'VqAutoComplete',
  props: {
    name: {
      type: String,
      required: true
    }
  },
  setup(props, { attrs, slots }) {
    const { errorMessage, value } = useField(props.name, undefined)

    const items = ref(['foo', 'bar', 'fizz', 'buzz'])

    return () => (
      <>
          <v-autocomplete
            item-text="name"
            item-value="name"
            items={items.value}
            error={!!errorMessage.value}
            v-model={value.value}
            error-messages={errorMessage.value}
            messages={errorMessage.value}
            v-slots={ slots }
            { ...attrs }
          >
          </v-autocomplete>
      </>
    )
  }
})
