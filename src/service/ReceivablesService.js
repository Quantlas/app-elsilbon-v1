import api from './ConfigServices';

const createAutomation = async (params) => {
    console.log(params);
    return api.v1
        .post('receivables/create-payment-template', {
            name: params.name,
            description: params.description,
            payment_gateway_id: params.payment_gateway_id.code,
            description: params.description,
            payment_type: params.payment_type.code,
            custom_payment: params.custom_payment,
            start_date: params.start_date,
            end_date: params.end_date,
            amount: params.amount,
            target: params.target
        })
        .catch((error) => {
            api.checkResponse(error.response.status);
        });
};

const updateAutomation = async (params) => {
    return api.v1
        .put('receivables/update-payment-template', {
            id: params.id,
            name: params.name,
            description: params.description,
            payment_gateway_id: params.payment_gateway_id.code,
            description: params.description,
            payment_type: params.payment_type.code,
            custom_payment: params.custom_payment,
            start_date: params.start_date,
            end_date: params.end_date,
            amount: params.amount,
            target: params.target
        })
        .catch((error) => {
            api.checkResponse(error.response.status);
        });
};

const startOrPaused = async (params) => {
    return api.v1
        .put('receivables/startorpaused-payment-template', {
            id: params.id,
            status: params.status == 'Active' ? 'Paused' : 'Active'
        })
        .catch((error) => {
            api.checkResponse(error.response.status);
        });
};

const deleteAutomation = async (params) => {
    return api.v1
        .delete('receivables/delete-payment-template/' + params.id, {
            id: params.id
        })
        .catch((error) => {
            api.checkResponse(error.response.status);
        });
};

const getPaymentTemplates = async () => {
    return api.v1
        .get('receivables/payment-templates')
        .then((resp) => {
            return resp;
        })
        .catch((error) => {
            api.checkResponse(error.response.status);
        });
};

export default {
    getPaymentTemplates,
    createAutomation,
    updateAutomation,
    startOrPaused,
    deleteAutomation
};
