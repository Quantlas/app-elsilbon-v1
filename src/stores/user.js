import authApi from '@/service/auth/auth';

const store = {
    namespaced: true,
    state() {
        return {
            user: null,
            scopes: localStorage.getItem('scopes')?.split(',') || [],
            token: localStorage.getItem('token') || null
        };
    },
    mutations: {
        setUser(state, user) {
            //console.log(user);
            state.user = user;
            state.scopes = state.scopes;

            localStorage.setItem('scopes', user.scopes);
        },
        setAccessToken(state, accessToken) {
            state.token = accessToken;
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + accessToken;

            localStorage.setItem('token', accessToken);
        },
        deleteAccessToken(state) {
            delete axios.defaults.headers.common['Authorization'];

            state.accessToken = null;
            state.user = null;
            state.abilities = [];

            localStorage.removeItem('token');
            localStorage.removeItem('scopes');
        }
    },
    actions: {
        setAccessToken(context, accessToken) {
            context.commit('setAccessToken', accessToken);
        },
        setUser(context) {
            return authApi.getUser().then((response) => {
                //console.log('este token ' + response);
                context.commit('setUser', response.data.data);
            });
        }
    },
    getters: {
        isAuthenticated(state) {
            return state.accessToken !== null;
        }
    }
};

export default store;
