function initialState() {
    return {
        item: {
            id: null,
            name: null,
            json_name: null,
            type: 0,
            min_value: null,
            max_value: null,
            step: null,
            answer_cnt: null,
            created_at: null,
            updated_at: null,
        },
        languages: [],
        locale: 'en',
        exceptField: ['created_at', 'updated_at'],
        loading: false,
        langLoading: false,
        dataLoading: false,
    }
}

const getters = {
    item: state => state.item,
    loading: state => state.loading,
    languages: state => state.languages,
    locale: state => state.locale,
}

const actions = {
    storeData({ commit, state, dispatch }) {
        commit('setLoading', true)

        dispatch('Alert/resetState', null, { root: true });

        return new Promise((resolve, reject) => {
            let params = new FormData();
            if (state.item.name == null) {
                var errorMsg = 'You have to set name!';
                dispatch(
                    'Alert/setAlert', { message: errorMsg, errors: null, color: 'danger' }, { root: true })
                commit('setLoading', false);
                reject(errorMsg);
                return;
            }


            for (let fieldName in state.item) {
                if (state.exceptField.indexOf(fieldName) != -1) {
                    continue;
                }
                let fieldValue = state.item[fieldName];
                if (typeof fieldValue !== 'object') {
                    params.set(fieldName, fieldValue);
                } else {
                    if (fieldValue && typeof fieldValue[0] !== 'object') {
                        params.set(fieldName, fieldValue);
                    } else {
                        for (let index in fieldValue) {
                            params.set(fieldName + '[' + index + ']', fieldValue[index]);
                        }
                    }
                }
            }



            axios.post('/api/v1/filter-keys', params)
                .then(response => {
                    commit('resetState')
                    resolve()
                })
                .catch(error => {
                    let message = error.response.data.message || error.message
                    let errors = error.response.data.errors
                    dispatch(
                        'Alert/setAlert', { message: message, errors: errors, color: 'danger' }, { root: true })

                    reject(error)
                })
                .finally(() => {
                    commit('setLoading', false)
                })
        })
    },
    updateData({ commit, state, dispatch }) {
        commit('setLoading', true)
        dispatch('Alert/resetState', null, { root: true })

        return new Promise((resolve, reject) => {
            let params = new FormData();
            params.set('_method', 'PUT')
            if (state.item.name == null) {
                var errorMsg = 'You have to set name!';
                dispatch(
                    'Alert/setAlert', { message: errorMsg, errors: null, color: 'danger' }, { root: true })
                commit('setLoading', false);
                reject(errorMsg);
                return;
            }

            for (let fieldName in state.item) {
                if (state.exceptField.indexOf(fieldName) != -1) {
                    continue;
                }

                let fieldValue = state.item[fieldName];
                if (typeof fieldValue !== 'object') {
                    params.set(fieldName, fieldValue);
                } else {
                    if (fieldValue && typeof fieldValue[0] !== 'object') {
                        params.set(fieldName, fieldValue);
                    } else {
                        for (let index in fieldValue) {
                            params.set(fieldName + '[' + index + ']', fieldValue[index]);
                        }
                    }
                }
            }

            params.set('locale', state.locale);

            axios.post('/api/v1/filter-keys/' + state.item.id, params)
                .then(response => {
                    commit('setItem', response.data.data)
                    resolve()
                })
                .catch(error => {
                    let message = error.response.data.message || error.message
                    let errors = error.response.data.errors

                    dispatch(
                        'Alert/setAlert', { message: message, errors: errors, color: 'danger' }, { root: true })
                    reject(error)
                })
                .finally(() => {
                    commit('setLoading', false)
                })
        })
    },
    fetchData({ commit, dispatch, state }, id) {
        commit('setDataLoading', true)
        return new Promise((resolve, reject) => {
            axios.get('/api/v1/filter-keys/' + id + '?locale=' + state.locale)
                .then(response => {
                    commit('setItem', response.data.data)
                    resolve()
                })
                .catch(error => {
                    let message = error.response.data.message || error.message
                    let errors = error.response.data.errors

                    dispatch('Alert/setAlert', { message: message, errors: errors, color: 'danger' }, { root: true })
                    reject(error)
                })
                .finally(() => {
                    commit('setDataLoading', false)
                })
        });

    },
    fetchLanguageData({ commit, state }) {
        commit('setLangLoading', true)
        axios.get('/api/v1/languages')
            .then(response => {
                commit('setLanguages', response.data.data)
            })
            .finally(() => {
                commit('setLangLoading', false);
            })
    },

    setName({ commit }, value) {
        commit('setName', value);
    },
    setJSONName({ commit }, value) {
        commit('setJSONName', value);
    },
    setType({ commit }, value) {
        commit('setType', value);
    },
    setMinValue({ commit }, value) {
        commit('setMinValue', value);
    },
    setMaxValue({ commit }, value) {
        commit('setMaxValue', value);
    },
    setStep({ commit }, value) {
        commit('setStep', value);
    },
    setLocale({ commit }, value) {
        commit('setLocale', value)
    },
    resetState({ commit }) {
        commit('resetState')
    },


}

const mutations = {
    setItem(state, item) {
        state.item = item;
    },

    setName(state, value) {
        state.item.name = value;
    },
    setJSONName(state, value) {
        state.item.json_name = value;
    },

    setType(state, value) {
        state.item.type = value;
    },
    setMinValue(state, value) {
        state.item.min_value = value;
    },
    setMaxValue(state, value) {
        state.item.max_value = value;
    },
    setStep(state, value) {
        state.item.step = value;
    },
    setLoading(state, loading) {
        state.loading = loading
    },
    resetState(state) {
        state = Object.assign(state, initialState())
    },
    setLangLoading(state, loading) {
        if (loading) {
            state.loading = true;
        }
        state.langLoading = loading;
        if (state.langLoading == false && state.dataLoading == false) {
            state.loading = false;
        }
    },
    setDataLoading(state, loading) {
        if (loading) {
            state.loading = true;
        }
        state.dataLoading = loading;
        if (state.langLoading == false && state.dataLoading == false) {
            state.loading = false;
        }
    },
    setLanguages(state, value) {
        state.languages = value;
    },
    setLocale(state, value) {
        state.locale = value;
    },
}

export default {
    namespaced: true,
    state: initialState,
    getters,
    actions,
    mutations
}