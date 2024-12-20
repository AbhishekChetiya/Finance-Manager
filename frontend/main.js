
import axios from "axios";
import { ACCESS_TOKEN } from "./constant";

const main = axios.create({
    baseURL: import.meta.env.VITE_MAIN_URL,
})

main.interceptors.request.use(  
    (config) => {
        const token = localStorage.getItem(ACCESS_TOKEN);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default main;