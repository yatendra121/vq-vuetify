export type PortalConfig = {
    VUE_APP_BASE_URL?: string | undefined;
    VUE_APP_DOMAIN_PREFIX?: string | undefined;
    VUE_APP_OUTPUT_DIR?: string | undefined;
    VUE_APP_API_BASE_URL?: string | undefined;
    VUE_APP_WEB_BASE_URL?: string | undefined;
    VUE_APP_PORT?: number | undefined;
    VUE_APP_CLIENT_ID?: string | undefined;
    VUE_APP_CHECK_ESLINT?: string | undefined;
    VUE_APP_ADD_PWA?: string | undefined;
    VUE_APP_SOCKET_URL?: string | undefined;
    VUE_APP_GRAPH_QL_URL?: string | undefined;
};
/**
 * Class for interacting with portal
 *
 * @portal 'admin/front'
 *
 * @remarks
 */
export declare class Portal {
    /**
     * @ignore
     */
    portalConfig: PortalConfig;
    static instance: Portal;
    private constructor();
    static getInstance(portal?: string): Portal;
    /**
     * Gets the base url.
     * @returns url
     */
    getBaseUrl: () => string;
    /**
     * Gets the asset url.
     * @returns url
     */
    getAssetsUrl: () => string | undefined;
    /**
     * Gets the domain prifix.
     * @returns string
     */
    getDomianPrefix: () => string | undefined;
    /**
     * Gets the output dir.
     * @returns string
     */
    getOutputDir: () => string | undefined;
    /**
     * Gets the api base url.
     * @returns url
     */
    getApiBaseUrl: () => string | undefined;
    /**
     * Gets the web base url.
     * @returns url
     */
    getWebBaseUrl: () => string | undefined;
    /**
     * Gets the base url.
     * @returns url
     */
    getPort: () => number | undefined;
    /**
     * Gets the client id.
     * @returns string
     */
    getClientId: () => string;
    /**
     * Gets the client id.
     * @returns string
     */
    getRouteBaseUrl: () => string | undefined;
    /**
     * Get the cookie prefix.
     * @returns string
     */
    getCookiePrefix: () => string;
    /**
     * Get the check eslint.
     * @returns string
     */
    getCheckESlint: () => boolean;
    /**
     * Get the check eslint.
     * @returns string
     */
    getAddPWA: () => boolean;
    /**
     * Get the Socket Url.
     * @returns string
     */
    getSocketUrl: () => string;
    /**
     * Get the Graph QL API URL.
     * @returns string
     */
    getGraphQLUrl: () => string;
}
