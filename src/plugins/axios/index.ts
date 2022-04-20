import axios from 'axios'
import type {  AxiosInstance} from 'axios'

const cancelToken = axios.CancelToken

let _axios = axios.create({})

const setAxiosInstance = (instance:AxiosInstance) => {
    _axios = instance
}

export { _axios, cancelToken }

export default setAxiosInstance
