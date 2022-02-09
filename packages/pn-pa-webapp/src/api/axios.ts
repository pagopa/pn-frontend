import axios from "axios";

export const authClient = axios.create({
    baseURL: process.env.REACT_APP_AUTH_BASE_URL
});

export const apiClient = axios.create({
    baseURL: process.env.REACT_APP_URL_API
});

apiClient.interceptors.request.use(function (config) {
    /* eslint-disable functional/immutable-data */
    const token = JSON.parse(localStorage.getItem("user") || '');
    if (token && config.headers) {
        config.headers.Authorization = 'Bearer ' + (token.sessionToken as string);
    }
    return config;
},
    function (error) {
        return Promise.reject(error);
    }
);
