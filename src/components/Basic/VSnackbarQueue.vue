<template>
    <div>
        <v-snackbar
            v-for="(item, i) in items"
            @update:model-value="removeItem"
            :key="item.id"
            :model-value="i === 0"
            :timeout="timeout"
            :color="item.color"
            :absolute="absolute"
            location="center top"
            :vertical="vertical"
            transition="scale-transition"
        >
            <template #default>
                <!-- <v-icon :icon="mdiInformation"></v-icon> -->
                {{ item.message }}
            </template>

            <template #actions>
                <v-btn color="white" variant="text" @click="removeItem(item.id)">
                    {{ items.length > 1 ? `Next(${items.length - 1})` : "Close" }}
                </v-btn>
            </template>
        </v-snackbar>
    </div>
</template>

<script>
import { defineComponent } from "vue";
import { mdiInformation } from "@mdi/js";

export default defineComponent({
    name: "VSnackbarQueue",
    emits: ["remove"],
    props: {
        items: {
            type: Array,
            required: true
        },

        value: {
            type: Boolean,
            default: false
        },
        timeout: {
            type: Number,
            default: 50000
        },
        color: {
            type: String,
            default: "success"
        },
        absolute: {
            type: Boolean,
            default: true
        },
        vertical: {
            type: Boolean,
            default: false
        }
    },
    setup(props, { emit }) {
        const removeItem = (p) => {
            emit("remove", p);
        };

        return { mdiInformation, removeItem };
    }
});
</script>
