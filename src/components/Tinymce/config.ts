import { reactive } from 'vue'

export const config = reactive({
    baseUrl: 'http://localhost:3000/'
})

export const setConfig = (obj: { baseUrl: string }) => {
    if (obj.baseUrl) config.baseUrl = obj.baseUrl
}
