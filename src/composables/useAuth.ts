import { ref } from 'vue'

const getSessionUser = () => localStorage.getItem('app_session_user')
const getUserDB = () => JSON.parse(localStorage.getItem('app_users_db') || '{}')

const sessionUser = ref<string | null>(getSessionUser())
// const userDB = ref<Record<string, string>>(getUserDB()) // Removed unused ref

export function useAuth() {
    const error = ref('')

    const login = (username: string, password: string): boolean => {
        if (!username || !password) {
            error.value = 'Please enter both username and password.'
            return false
        }

        const db = getUserDB() // Refresh from storage

        if (db[username]) {
            // Login existing
            if (db[username] === password) {
                localStorage.setItem('app_session_user', username)
                sessionUser.value = username
                window.location.reload()
                return true
            } else {
                error.value = 'Invalid password.'
                return false
            }
        } else {
            // Register new
            db[username] = password
            localStorage.setItem('app_users_db', JSON.stringify(db))
            localStorage.setItem('app_session_user', username)
            sessionUser.value = username
            window.location.reload()
            return true
        }
    }

    const logout = () => {
        localStorage.removeItem('app_session_user')
        sessionUser.value = null
        window.location.reload()
    }

    const isAuthenticated = () => !!sessionUser.value
    const currentUser = () => sessionUser.value

    return {
        sessionUser,
        login,
        logout,
        isAuthenticated,
        currentUser,
        error
    }
}
