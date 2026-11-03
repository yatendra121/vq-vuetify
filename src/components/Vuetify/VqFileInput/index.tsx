import { computed, defineComponent, inject, watch } from "vue";
import { FormContextKey } from "vee-validate";
import { VFileInput } from "vuetify/components";
import { useVqField } from "../../../composables/field";

export const VqFileInput = defineComponent({
    name: "VqFileInput",
    props: {
        name: {
            type: String,
            required: true
        },
        /**
         * Store the value at `name` itself. By default it is stored under the literal
         * key `name[file]`, so a schema must use that exact key: one on `name` or
         * `name.file` never sees the value and can't pass.
         */
        rawName: {
            type: Boolean,
            default: false
        }
    },
    setup(props, { attrs, slots }) {
        const name = computed(() => (props.rawName ? props.name : `${props.name}[file]`));
        const { value, errorMessage } = useVqField(name);

        // Schemas and servers report errors against `name` or `name.file` (Laravel
        // turns `name[file]` into `name.file`), which no field would otherwise display.
        const form = inject(FormContextKey, undefined);
        const aliasPaths = computed(() => [props.name, `${props.name}.file`]);
        const displayError = computed(() => {
            if (errorMessage.value) return errorMessage.value;
            const errors = form?.errors.value as Record<string, string | undefined> | undefined;
            return aliasPaths.value.map((path) => errors?.[path]).find(Boolean);
        });

        watch(value, () => {
            if (!form) return;
            const hadAliasError = aliasPaths.value.some(
                (path) => (form.errors.value as Record<string, unknown>)[path]
            );
            if (!hadAliasError) return;
            aliasPaths.value.forEach((path) => form.setFieldError(path, undefined));
            // A schema may still reject the new value.
            form.validateSchema?.("validated-only");
        });

        return () => (
            <>
                <VFileInput
                    multiple={false}
                    error={!!displayError.value}
                    v-model={value.value}
                    error-messages={displayError.value}
                    messages={displayError.value}
                    v-slots={slots}
                    {...attrs}
                ></VFileInput>
            </>
        );
    }
});

export type VqFileInput = typeof VFileInput & typeof VqFileInput;
