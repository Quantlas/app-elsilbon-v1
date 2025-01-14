import api from './ConfigServices';

const getUsers = async () => {
    return api.v1
        .get('users')
        .then((resp) => {
            return resp;
        })
        .catch((error) => {
            api.checkResponse(error.response.status);
        });
};

const createUser = async (data) => {
    return api.v1
        .post('register', data)
        .then((resp) => {
            return resp;
        })
        .catch((error) => {
            api.checkResponse(error.response.status);
        });
};

const updateUser = async (data) => {
    console.log(data);
    return api.v1
        .post('users/update', data)
        .then((resp) => {
            return resp;
        })
        .catch((error) => {
            api.checkResponse(error.response.status);
        });
};

const deleteUser = async (data) => {
    return api.v1
        .delete('users/delete/' + data.id)
        .then((resp) => {
            return resp;
        })
        .catch((error) => {
            api.checkResponse(error.response.status);
        });
};

export default {
    getUsers,
    createUser,
    updateUser,
    deleteUser
};
