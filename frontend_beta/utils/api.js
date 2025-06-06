// api.js - This file will contain an axios interceptor that will inject appropriate tokens, 
// if they exist. Use this file for 
// reference: https://github.com/techwithtim/Django-React-Full-Stack-App/blob/main/frontend/src/api.js 

import axios from "axios";
import { getAccessToken } from "../storage/auth";

const api = axios.create({
    baseURL: 'http://127.0.0.1:8000'
})

// This interceptor injects the access token with every api request to the backend 
// So that the api call can simply request a certain url route without each of the request locations having to 
// explicitly know the token 
api.interceptors.request.use(
    async (config) => {
        const token = await getAccessToken()
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config
    },
    // This error will trigger if the access token does not exist or if there was an error retrieving the backend data
    (error) => {
        return Promise.reject(error)
    }
)

export default api