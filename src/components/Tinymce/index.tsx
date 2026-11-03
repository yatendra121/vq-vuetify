import { computed, defineComponent, PropType, toRef } from "vue";
import TinyEditor from "@tinymce/tinymce-vue";
import plugins from "./plugins";
import toolbar from "./toolbar";
import { config } from "./config";
import { useVqField } from "../../composables/field";

export const VqTextEditor = defineComponent({
    name: "VqTextEditor",
    props: {
        name: {
            type: String,
            required: true
        },
        label: {
            type: String,
            default: () => ""
        },
        placeholder: {
            type: String,
            default: () => ""
        },
        height: {
            type: Number,
            default: () => 250
        },
        isDark: {
            type: Boolean,
            default: () => false
        },
        baseUrl: {
            type: String,
            default: () => config.baseUrl
        },
        filesPath: {
            type: String,
            default: () => "static/tinymce/tinymce.min.js"
        },
        /** Extra TinyMCE options, merged over the defaults. */
        init: {
            type: Object as PropType<Record<string, unknown>>,
            default: undefined
        }
    },
    setup(props, { attrs }) {
        const { errorMessage, value } = useVqField<string | undefined>(toRef(props, "name"));

        const updateModelValue = (val: string) => {
            value.value = val;
        };

        const scriptSrc = computed(
            () => `${props.baseUrl.replace(/\/+$/, "")}/${props.filesPath.replace(/^\/+/, "")}`
        );

        return () => (
            <>
                {/* @ts-ignore */}
                {props.label && <label style="display:block;margin-bottom:4px">{props.label}</label>}
                <TinyEditor
                    model-value={value.value}
                    /* @ts-ignore */
                    onUpdate:modelValue={updateModelValue}
                    init={{
                        height: props.height,
                        menubar: true,
                        plugins,
                        toolbar,
                        placeholder: props.placeholder,
                        skin: props.isDark ? "oxide-dark" : "oxide",
                        content_css: props.isDark ? "dark" : "default",
                        ...props.init
                    }}
                    tinymce-script-src={scriptSrc.value}
                    {...attrs}
                ></TinyEditor>
                {errorMessage.value && (
                    /* @ts-ignore */
                    <p role="alert" style="color:rgb(var(--v-theme-error));padding:4px 0px 0px 10px;font-size:12px">
                        {errorMessage.value}
                    </p>
                )}
            </>
        );
    }
});

export type VqTextEditor = typeof TinyEditor & typeof VqTextEditor;
