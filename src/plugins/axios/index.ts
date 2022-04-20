import axios from 'axios'

//@ts-ignore
//import { getTimeOffset } from "@/utils";
import { Portal } from '@/utils/portal'
const currentPortal = Portal.getInstance()

const CancelToken = axios.CancelToken

axios.defaults.headers.post['Content-Type'] =
    'application/x-www-form-urlencoded'
const config = {
    baseURL: currentPortal.getApiBaseUrl() // api Base URl
}

const _axios = axios.create(config)
_axios.defaults.headers.common['client-id'] = currentPortal.getClientId()
_axios.defaults.headers.common.Accept = 'application/json, text/plain, */*'

_axios.interceptors.request.use(
    (config: any) => {
        const authToken = ''
        if (authToken) {
            config.headers.Authorization = 'Bearer ' + authToken
        }
        config.headers['device-id'] = 'getDeviceId()'
        config.headers['time-offset'] = 'test' // getTimeOffset();
        // Do something before request is sent
        return config
    },
    (error) => {
        // Do something with request error
        return Promise.reject(error)
    }
)

// Add a response interceptor
_axios.interceptors.response.use(
    (response) => {
        // Do something with response data
        return response.data
    },
    (error) => {
        // Do something with response error
        // if (error)
        // console.log(error.status, error.request, 'Error')
        if (error && error.request && error.request.status === 401) {
           
            // logOutUser();
        }
        return Promise.reject(error)
    }
)

export default {
    install: (app: any): void => {
        app.config.globalProperties.$axios = _axios
        app.config.globalProperties.$_axios = _axios
    }
}

export { _axios, CancelToken }
