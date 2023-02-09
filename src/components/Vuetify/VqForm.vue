<!-- <template>
  <VeeForm submit="onSubmit" v-bind="$attrs"></VeeForm>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { objectToFormData } from '@qnx/composables/axios/formData'
import { Form as VeeForm, SubmissionHandler } from 'vee-validate'
import { _axios } from '@/plugins/axios'
import { ApiResponse } from '@/utils/response'
import { Method } from 'axios'

export type GenericFormValues = {
  [key: string]: any
}

export default defineComponent({
  name: 'VqFileInput',
  components: {
    VeeForm
  },
  props: {
    action: {
      type: String,
      required: true,
      default: () => ''
    },
    method: {
      type: String as PropType<Method>,
      default: () => 'POST'
    },
    formData: {
      type: Boolean,
      default: () => false
    }
  },
  emits: ['submitedSuccess', 'submitedError'],
  setup(props, { attrs, emit, slots }) {
    const onSubmit = (
      values: SubmissionHandler<GenericFormValues>,
      actions: any
    ) => {
      const postData = props.formData ? objectToFormData(values) : values

      _axios(props.action, { method: props.method, data: postData })
        .then((response: any) => {
          const apiResponse = new ApiResponse(response)
          emit('submitedSuccess', apiResponse)
        })
        .catch((response) => {
          const data = JSON.parse(response.request.response)
          const apiResponse = new ApiResponse(data)
          actions.setErrors(apiResponse.getErrors())
          emit('submitedError', apiResponse)
        })
    }

    return {}
  }
})
</script> -->
