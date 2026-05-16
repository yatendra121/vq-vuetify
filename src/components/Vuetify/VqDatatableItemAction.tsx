import { defineComponent, PropType, ref } from "vue";
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

export const VqDatatableItemAction = defineComponent({
    name: "VqDatatableItemAction",
    props: {
        title: {
            type: String as PropType<string>,
            default: () => "Confirmation"
        },
        description: {
            type: String as PropType<string>,
            default: () => "Are you sure to want delete this record?"
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

        const dialog = ref(false);
        const loading = ref(false);

        const onConfirm = () => {
            loading.value = true;
            useAsyncAxios<ApiResponseValue>(`${props.action}/${props.itemId}`, {
                method: props.method
            })
                .then((res) => {
                    const apiRes = new ApiResponse(res);
                    useMessage.success(apiRes.getMessage() ?? "");
                    dialog.value = false;
                    reload();
                })
                .catch(() => {
                    useMessage.error("Please check input values.");
                })
                .finally(() => {
                    loading.value = false;
                });
        };

        return () => (
            <>
                <VTooltip text="Change Status">
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
                        <VCardTitle>{props.title}</VCardTitle>
                        <VCardText>{props.description}</VCardText>
                        <VCardActions>
                            <VSpacer />
                            <VBtn
                                variant="text"
                                disabled={loading.value}
                                /* @ts-ignore Vuetify VBtn types omit onClick */
                                onClick={() => (dialog.value = false)}
                            >
                                Cancel
                            </VBtn>
                            <VBtn
                                color="primary"
                                loading={loading.value}
                                /* @ts-ignore Vuetify VBtn types omit onClick */
                                onClick={onConfirm}
                            >
                                Confirm
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
