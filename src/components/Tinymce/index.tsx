import { defineComponent, toRef } from 'vue'
import { useField } from 'vee-validate'
import TinyEditor from '@tinymce/tinymce-vue'
import plugins from './plugins'
import toolbar from './toolbar'

export const VqTextEditor = defineComponent({
  name: 'VqTextEditor',
  components: {
    TinyEditor
  },
  props: {
    name: {
      type: String,
      required: true
    },
    label: {
      type: String,
      default: () => ''
    },
    placeholder: {
      type: String,
      default: () => ''
    },
    height: {
      type: Number,
      default: () => 250
    },
    isDark: {
      type: Boolean,
      default: () => true
    },
    baseUrl: {
      type: String,
      default: () => 'http://localhost:3000/'
    },
    filesPath: {
      type: String,
      default: () => 'static/tinymce/tinymce.min.js'
    }
  },
  setup(props) {
    const { errorMessage, value } = useField(toRef(props, 'name'), [], {
      validateOnValueUpdate: false
    })

    const updateModelValue = (val: string) => {
      console.log(val)
      value.value = val
    }

    return () => (
      <>
        <TinyEditor
          initial-value={value.value}
          onChange={(_event: any, editor: any) =>
            updateModelValue(editor.getContent())
          }
          onKeyUp={(_event: any, editor: any) =>
            updateModelValue(editor.getContent())
          }
          init={{
            height: props.height,
            menubar: true,
            plugins,
            toolbar,
            skin: props.isDark ? 'oxide' : 'oxide-dark',
            content_css: props.isDark ? 'default' : 'dark'
          }}
          tinymce-script-src={props.baseUrl + props.filesPath}
        ></TinyEditor>
        <div>
          <p style="color: red;padding:4px 0px 0px 10px;font-size:12px">
            {errorMessage.value}
          </p>
        </div>
      </>
    )
  }
})

export type VqTextEditor = typeof TinyEditor & typeof VqTextEditor
