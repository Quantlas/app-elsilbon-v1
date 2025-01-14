import axios from 'axios';
import router from '../router';

const v1 = axios.create({
    baseURL: import.meta.env.VITE_BASE_API_URL + 'api/',
    withCredentials: false,
    headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
        'Content-Type': 'multipart/form-data',
        Authorization: 'Bearer ' + localStorage.token
    }
});

const v1Public = axios.create({
    baseURL: import.meta.env.VITE_BASE_API_URL + 'api/',
    withCredentials: false,
    headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS'
    }
});

const checkResponse = (code) => {
    if (code === 401) {
        localStorage.clear();
        router.push('/');
    }

    if (code === 403) {
        localStorage.clear();
        router.push('/');
    }
};

export default {
    v1,
    checkResponse,
    v1Public
};
