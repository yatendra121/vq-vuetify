import { computed, defineComponent, onBeforeUnmount, PropType, ref } from "vue";
import { mdiDelete } from "@mdi/js";
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

export const VqDatatableItemAction = defineComponent({
    name: "VqDatatableItemAction",
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
            default: () => mdiDelete
        },
        itemId: {
            type: String as PropType<string>,
            default: () => "0"
        },
        id: {
            type: String as PropType<string>,
            required: true
        }
    },
    setup(props) {
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

        const onConfirm = () => {
            loading.value = true;
            abortController?.abort();
            abortController = new AbortController();
            useAsyncAxios<ApiResponseValue>(`${props.action}/${props.itemId}`, {
                method: props.method,
                signal: abortController.signal
            })
                .then((res) => {
                    const apiRes = new ApiResponse(res);
                    useMessage.success(apiRes.getMessage() ?? "");
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
                <VTooltip text={locale.changeStatusTooltip}>
                    {{
                        activator: ({ props: tooltipProps }: any) => (
                            <VBtn
                                {...tooltipProps}
                                variant="text"
                                color="primary"
                                icon={props.icon}
                                onClick={() => (dialog.value = true)}
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
                                /* @ts-ignore Vuetify VBtn types omit onClick */
                                onClick={() => (dialog.value = false)}
                            >
                                {locale.cancel}
                            </VBtn>
                            <VBtn
                                color="primary"
                                loading={loading.value}
                                /* @ts-ignore Vuetify VBtn types omit onClick */
                                onClick={onConfirm}
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

// eslint-disable-next-line no-redeclare
export type VqDatatableItemAction = typeof VqDatatableItemAction;
