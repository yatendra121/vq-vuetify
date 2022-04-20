import { ApiResponse } from '@/utils/response'
import { useMessage } from '../message'
import { useRouter } from 'vue-router'

const router = useRouter()

export default function useFormRepository(routeName: string, options = {}) {
    const useFormSuccess = async (response: ApiResponse) => {
        useMessage.success(response.getMessage() ?? '')
        router.push({ name: routeName, ...options })
    }

    return { useFormSuccess }
}

export const useFormSuccess = async (response: ApiResponse) => {
    useMessage.success(response.getMessage() ?? '')
    if (window.history.length > 2) {
        router.back()
    } else {
        router.push({ name: 'dashboard' })
    }
}

export const useFormSuccessOnlyMessage = async (response: ApiResponse) => {
    useMessage.success(response.getMessage() ?? '')
}

export const useFormError = async (response: ApiResponse) => {
    useMessage.error(response.getMessage() ?? '')
}
