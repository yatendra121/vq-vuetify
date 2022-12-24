import { computed, defineComponent } from 'vue'
import { useFormStore } from '../../store/reactivity/form'

export const VqSubmitBtn = defineComponent({
  name: 'VqSubmitButton',
  props: {
    id: {
      type: String,
      default: 'form'
    }
  },
  setup(props) {
    const formStore = useFormStore()
    const loading = computed(() => formStore.forms[props.id]?.busy ?? false)

    const submit = () => {
      const form = document.getElementById(props.id)
      // @ts-ignore
      if (form) form._vei.onSubmit(form)
    }

    return () => (
      <>
        <v-btn loading={loading.value} onClick={submit} color="primary">
          Submit
        </v-btn>
      </>
    )
  }
})
