import axios from "axios"

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || `http://${window.location.hostname || "localhost"}:3000`,
    withCredentials: true
})

const AUTH_PATHS = ["/api/auth/login", "/api/auth/register", "/api/auth/get-me"]

api.interceptors.response.use(
    (res) => res,
    (err) => {
        const url = err.config?.url || ""
        if (err.response?.status === 401 && !AUTH_PATHS.some((p) => url.includes(p))) {
            window.dispatchEvent(new Event("auth:unauthorized"))
        }
        return Promise.reject(err)
    }
)
