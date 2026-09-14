import axios from "axios"

const apiHost = window.location.hostname || "localhost"

export const api = axios.create({
    baseURL: `http://${apiHost}:3000`,
    withCredentials: true
})
