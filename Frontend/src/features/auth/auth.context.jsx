import { useEffect, useState } from "react"
import { AuthContext } from "./authContext"
import { getMe } from "./services/auth.api"

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const loadUser = async () => {
            try {
                const data = await getMe()
                setUser(data.user)
            } catch {
                setUser(null)
            } finally {
                setLoading(false)
            }
        }
        loadUser()

        const onUnauthorized = () => setUser(null)
        window.addEventListener("auth:unauthorized", onUnauthorized)
        return () => window.removeEventListener("auth:unauthorized", onUnauthorized)
    }, [])

    return (
        <AuthContext.Provider value={{ user, setUser, loading, setLoading, error, setError }}>
            {children}
        </AuthContext.Provider>
    )
}