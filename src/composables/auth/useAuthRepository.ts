//@ts-ignore
import Cookies from 'js-cookie'
import { Portal } from '@/utils/portal'
const currentPortal = Portal.getInstance()

const prefix = currentPortal.getCookiePrefix()

const TokenKey = prefix + 'X-TOKEN'
const RefreshTokenKey = prefix + 'X-REFRESH-TOKEN'
const DeviceIdKey = 'DEVICE-ID'

/**
 * To get the Authentication token
 */
const getToken = () => {
    return Cookies.get(TokenKey)
}

/**
 * To Get the Refresh Token
 */
const getRefreshToken = () => {
    return Cookies.get(RefreshTokenKey)
}
/**
 * To get the device token
 */
const getDeviceId = () => {
    return Cookies.get(DeviceIdKey)
}

const setTokens = (token: any) => {
    const domain = currentPortal.getBaseUrl()
    removeToken()
    removeRefreshToken()
    setToken(token.access_token, '/', domain)
    setRefreshToken(token.refresh_token, '/', domain)
}

const removeTokens = () => {
    removeToken()
    removeRefreshToken()
}

const setToken = (token: string, path: string, domain: string) => {
    return Cookies.set(TokenKey, token, {
        expires: 30,
        path: path
    })
}

const setRefreshToken = (token: string, path: string, domain: string) => {
    return Cookies.set(RefreshTokenKey, token, {
        expires: 45,
        path: path
    })
}

const setDeviceId = (deviceId: string) => {
    return Cookies.set(DeviceIdKey, deviceId, { expires: 200000 })
}

const removeToken = () => {
    return Cookies.remove(TokenKey)
}

const removeRefreshToken = () => {
    return Cookies.remove(RefreshTokenKey)
}

const removeDeviceId = () => {
    return Cookies.remove(DeviceIdKey)
}

export {
    getToken,
    getRefreshToken,
    getDeviceId,
    setToken,
    setRefreshToken,
    setDeviceId,
    removeToken,
    removeRefreshToken,
    removeDeviceId,
    setTokens,
    removeTokens
}
