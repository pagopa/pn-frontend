import axios from "axios";

export const authClient = axios.create({
    baseURL: process.env.REACT_APP_AUTH_BASE_URL
});