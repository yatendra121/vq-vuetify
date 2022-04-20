/* eslint-disable no-undef */
/**
 * To Convert the Object into formData.
 * @param {Object} obj
 * @param {FormData} form
 * @param {String} namespace
 */
export const objectToFormData = (
    obj: any,
    form?: FormData,
    namespace?: string
) => {
    const fd = form || new FormData()
    let formKey

    for (const property in obj) {
        // eslint-disable-next-line no-prototype-builtins
        if (obj.hasOwnProperty(property)) {
            if (namespace) {
                formKey = namespace + '[' + property + ']'
            } else {
                formKey = property
            }

            // if the property is an object, but not a File, use recursivity.
            if (obj[property] instanceof Date) {
                fd.append(formKey, obj[property].toISOString())
            } else if (
                typeof obj[property] === 'object' &&
                !(obj[property] instanceof File) &&
                !(obj[property] instanceof Blob)
            ) {
                objectToFormData(obj[property], fd, formKey)
            } else {
                // if it's a string or a File object
                if (obj[property] instanceof Blob && obj[property]) {
                    fd.append(formKey, obj[property], obj[property].name)
                } else if (obj[property]) {
                    fd.append(formKey, obj[property])
                }
            }
        }
    }

    return fd
}

/**
 * Convert Query Object to Query String
 * @param obj
 * @param prefix
 */
export const objectToQueryString = (obj: any, prefix: string): string => {
    const str = []
    let p

    for (p in obj) {
        // eslint-disable-next-line no-prototype-builtins
        if (obj.hasOwnProperty(p)) {
            const k = prefix ? prefix + '[' + p + ']' : p
            const v = obj[p]
            const value =
                v !== null && typeof v === 'object'
                    ? objectToQueryString(v, k)
                    : encodeURIComponent(k) + '=' + encodeURIComponent(v || '')
            if (value) {
                str.push(value)
            }
        }
    }
    return str.join('&')
}
