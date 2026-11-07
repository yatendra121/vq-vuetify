import { computed, defineComponent, onBeforeUnmount, PropType, ref } from "vue";
import {
    VBtn,
    VCard,
    VCardActions,
    VCardText,
    VCardTitle,
    VDialog,
    VSpacer,
    VTooltip
} from "vuetify/components";
import { useAsyncAxios } from "@qnx/composables/axios";
import { ApiResponse } from "@qnx/composables";
import type { ApiResponseValue } from "@qnx/composables";
import { useMessageInstance } from "../../composables/message";
import { useFormFilterRepository } from "../../composables/form";
import { useVqLocale } from "../../config/locale";

// The mdiDelete path, inlined so the component doesn't need @mdi/js installed.
const DELETE_ICON =
    "M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z";

export const VqDatatableItemAction = defineComponent({
    name: "VqDatatableItemAction",
    // Attrs go to the trigger button, which renders inside the tooltip's slot.
    inheritAttrs: false,
    props: {
        title: {
            type: String as PropType<string | undefined>,
            default: () => undefined
        },
        description: {
            type: String as PropType<string | undefined>,
            default: () => undefined
        },
        action: {
            type: String as PropType<string>,
            default: () => "user/change-status"
        },
        method: {
            type: String as PropType<string>,
            default: () => "PUT"
        },
        icon: {
            type: String as PropType<string>,
            default: () => DELETE_ICON
        },
        itemId: {
            type: [String, Number] as PropType<string | number>,
            default: () => "0"
        },
        tooltip: {
            type: String as PropType<string | undefined>,
            default: () => undefined
        },
        id: {
            type: String as PropType<string>,
            required: true
        }
    },
    setup(props, { attrs }) {
        const { reload } = useFormFilterRepository(`${props.id}_filter`);
        const useMessage = useMessageInstance();
        const locale = useVqLocale();

        const dialog = ref(false);
        const loading = ref(false);
        let abortController: AbortController | undefined;
        onBeforeUnmount(() => abortController?.abort());

        const dialogTitle = computed(() => props.title ?? locale.confirmTitle);
        const dialogDescription = computed(
            () => props.description ?? locale.confirmDeleteDescription
        );
        const tooltipText = computed(() => props.tooltip ?? locale.changeStatusTooltip);

        const onConfirm = () => {
            // VBtn's loading state doesn't block clicks; don't repeat the request.
            if (loading.value) return;
            loading.value = true;
            abortController = new AbortController();
            useAsyncAxios<ApiResponseValue>(`${props.action}/${props.itemId}`, {
                method: props.method,
                signal: abortController.signal
            })
                .then((res) => {
                    const apiRes = new ApiResponse(res);
                    const message = apiRes.getMessage();
                    if (message) useMessage.success(message);
                    dialog.value = false;
                    reload();
                })
                .catch((err) => {
                    if (err?.name !== "CanceledError") useMessage.error(locale.submitErrorMessage);
                })
                .finally(() => {
                    loading.value = false;
                });
        };

        return () => (
            <>
                <VTooltip text={tooltipText.value}>
                    {{
                        activator: ({ props: tooltipProps }: { props: Record<string, unknown> }) => (
                            <VBtn
                                {...tooltipProps}
                                variant="text"
                                color="primary"
                                icon={props.icon}
                                aria-label={tooltipText.value}
                                {...{ onClick: () => (dialog.value = true) }}
                                {...attrs}
                            />
                        )
                    }}
                </VTooltip>
                <VDialog v-model={dialog.value} maxWidth="400" persistent={loading.value}>
                    <VCard>
                        <VCardTitle>{dialogTitle.value}</VCardTitle>
                        <VCardText>{dialogDescription.value}</VCardText>
                        <VCardActions>
                            <VSpacer />
                            <VBtn
                                variant="text"
                                disabled={loading.value}
                                {...{ onClick: () => (dialog.value = false) }}
                            >
                                {locale.cancel}
                            </VBtn>
                            <VBtn
                                color="primary"
                                loading={loading.value}
                                {...{ onClick: onConfirm }}
                            >
                                {locale.confirm}
                            </VBtn>
                        </VCardActions>
                    </VCard>
                </VDialog>
            </>
        );
    }
});

 
export type VqDatatableItemAction = typeof VqDatatableItemAction;
