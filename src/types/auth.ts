export type AuthStatus = 'pending' | 'authenticated' | 'unauthenticated'

export type UserProfile = {
    id: number
    email: string
    name: string
    [key: string]: any
}
