import axios from "axios";

export const authClient = axios.create({
    baseURL: process.env.REACT_APP_AUTH_BASE_URL
});

export const apiClient = axios.create({
    baseURL: process.env.REACT_APP_URL_API
});

apiClient.interceptors.request.use(function (config) {
    // TODO add authorization token as soon as API are ready
    // const token = localStorage.getItem("user");
    // if (token && config.headers) {
    //     config.headers["Authorization"] = 'Bearer ' + token;
    // }
    /* eslint-disable functional/immutable-data */
    if (config.headers) {
        config.headers['X-PagoPA-PN-PA'] = '';
    }
    return config;
},
    function (error) {
        return Promise.reject(error);
    }
);
