import api from './ConfigServices';

const generateDocument = async (citizen_id, template_id, community_id) => {
    return api.v1
        .post('documents/create', {
            citizen_id: citizen_id,
            template_id: template_id,
            community_id: community_id
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

const getDocuments = async () => {
    return api.v1
        .get('documents')
        .then((resp) => {
            return resp;
        })
        .catch((error) => {
            api.checkResponse(error.response.status);
        });
};

export default {
    generateDocument,
    createTemplate,
    getDocuments
};
