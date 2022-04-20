
import { defineComponent } from 'vue'
import { useField } from 'vee-validate'
export default defineComponent({
  name: 'VqTextField',
  props: {
    name: {
      type: String,
      required: true
    }
  },
  setup(props, { attrs, slots }) {
    const { errorMessage, value } = useField(props.name, undefined)

    return () => (
      <>
          <v-text-field
            error={!!errorMessage.value}
            v-model={value.value}
            error-messages={errorMessage.value}
            messages={errorMessage.value}
            v-slots={ slots }
            { ...attrs }
          >
          </v-text-field>
      </>
    )
  }
})
