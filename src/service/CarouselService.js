import api from './ConfigServices';

const getContent = async () => {
    return api.v1.get('post/get').then((resp) => {
        return resp;
    });
};

const getBySlug = async (slug) => {
    console.log(slug);
    return api.v1.get('post/get-by-slug/' + slug).then((resp) => {
        return resp;
    });
};

const createContent = async (data) => {
    return api.v1.post('post/create', data);
};

const updateContent = async (data, id) => {
    console.log(data);
    return api.v1.post('post/update/' + id, data);
};

const deleteContent = async (data) => {
    return api.v1.delete('post/delete/' + data.id);
};

export default {
    getContent,
    createContent,
    updateContent,
    deleteContent,
    getBySlug
};
