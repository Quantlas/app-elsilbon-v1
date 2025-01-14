import api from './ConfigServices';

const getTemplates = async () => {
    return api.v1
        .get('templates/by-owner')
        .then((resp) => {
            return resp;
        })
        .catch((error) => {
            api.checkResponse(error.response.status);
        });
};

const createTemplate = async (data) => {
    return api.v1
        .post('templates/create', {
            name: data.name,
            description: data.description,
            body: data.body
        })
        .then((resp) => {
            return resp;
        })
        .catch((error) => {
            api.checkResponse(error.response.status);
        });
};

const updateTemplate = async (data) => {
    return api.v1
        .put('templates/update/' + data.id, {
            name: data.name,
            description: data.description,
            body: data.body
        })
        .then((resp) => {
            return resp;
        })
        .catch((error) => {
            api.checkResponse(error.response.status);
        });
};

const deleteTemplate = async (data) => {
    return api.v1
        .delete('templates/delete/' + data.id)
        .then((resp) => {
            return resp;
        })
        .catch((error) => {
            api.checkResponse(error.response.status);
        });
};

export default {
    getTemplates,
    createTemplate,
    updateTemplate,
    deleteTemplate
};
