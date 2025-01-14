import api from '../../service/ConfigServices';
import GlobalServices from '../GlobalServices';
import axios from 'axios';
import router from '../../router';

const authenticate = async (code) => {
    return api.v1.post('/auth', {
        code: code
    });
};

const login = async (data) => {
    api.v1Public
        .post('login', {
            email: data.email,
            password: data.password
        })
        .then((resp) => {
            if (resp.data.data.token) {
                localStorage.setItem('token', resp.data.data.token);
                localStorage.setItem('scopes', JSON.stringify(resp.data.data.scopes, null, 2));
                localStorage.setItem('name', resp.data.data.name);
            }
        });
        return localStorage.getItem('scopes');
};

const ckeckSession = () => {
    if (localStorage.token == undefined) {
        GlobalServices.sleep(500);
        router.replace('/');
        router.push('/');
    }
};

const unauthenticate = async () => {
    localStorage.clear();
    api.v1.post('logout').then((resp) => {
        if (resp.status == 200) {
            return resp;
        }
    });
};

export default {
    authenticate,
    unauthenticate,
    login,
    ckeckSession
};
