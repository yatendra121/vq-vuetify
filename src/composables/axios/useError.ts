import useAuthUserRepository from '@/composables/auth/useAuthUserRepository'

const unauthenticationError = async () => {
    const { logOutUser } = useAuthUserRepository()
    await logOutUser()
}

export { unauthenticationError }
