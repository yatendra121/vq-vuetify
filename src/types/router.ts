export type Meta = {
    title?: string | null | undefined
    heading?: string
    isPublic?: boolean
    icon?: string
    type?: string
    permission?: Array<string> | string | undefined | null
    [key: string]: any
}
