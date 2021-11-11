import axios from "axios";

const session = axios.create({
    baseURL: process.env.VUE_APP_API_URL,
    timeout: 10000
});

// before a request is made.
session.interceptors.request.use(config => {
    return config;
});

// before a response is returned.
session.interceptors.response.use(response => {
    return response;
});

export default session;