import api from './ConfigServices';

const computedSubscription = () => {
    if (localStorage.scopes) {
        let subscription = JSON.parse(localStorage.scopes);
        switch (subscription.subscription) {
            case 'free':
                const free_logic = {
                    permitted_communities: 1,
                    permitted_documents: 100,
                    permitted_dues: false,
                    permitted_records: false,
                    permitted_democracy: false
                };
                return free_logic;
                break;

            case 'silver':
                const silver_logic = {
                    permitted_communities: 10,
                    permitted_documents: 500,
                    permitted_dues: true,
                    permitted_records: false,
                    permitted_democracy: false
                };
                return silver_logic;
                break;

            case 'gold':
                const gold_logic = {
                    permitted_communities: 20,
                    permitted_documents: 5000,
                    permitted_dues: true,
                    permitted_records: true,
                    permitted_democracy: 1
                };
                return gold_logic;
                break;

            case 'premium':
                const premium_logic = {
                    permitted_communities: 'unlimited',
                    permitted_documents: 'unlimited',
                    permitted_dues: true,
                    permitted_records: true,
                    permitted_democracy: 'unlimited'
                };
                return premium_logic;
                break;
        }
    }
};

const sleep = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
};

const searchCitizens = async (data) => {
    return api.v1
        .post('citizens/search', {
            search: data
        })
        .then((resp) => {
            return resp;
        })
        .catch((error) => {
            api.checkResponse(error.response.status);
        });
};

const formatDate = (date) => {
    let newDate = date.split('-');
    let day = newDate[2].split('T');
    return `${day[0]}-${newDate[1]}-${newDate[0]}`;
};

const getScopes = () => {
    const scopesString = localStorage.getItem('scopes');
    const scopes = JSON.parse(scopesString) || [];
    return scopes;
}

export default {
    computedSubscription,
    sleep,
    searchCitizens,
    formatDate,
    getScopes
};
