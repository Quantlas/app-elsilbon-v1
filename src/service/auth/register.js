import api from '../../service/ConfigServices';

const register = async (data) => {
    return api.v1
        .post('register', {
            name: data.name,
            email: data.email,
            password: data.password,
            c_password: data.password_confirmation
        })
        .then((resp) => {
            localStorage.setItem('token', resp.data.data.token);
            localStorage.setItem('scopes', JSON.stringify(resp.data.data.scopes, null, 2));
            localStorage.setItem('name', resp.data.data.name);
            return resp;
        })
        .catch((e) => e.response.data.message);
};

export default {
    register
};
