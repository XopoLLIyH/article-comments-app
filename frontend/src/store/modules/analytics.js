import api from '../../services/api';

export default {
  namespaced: true,
  state: () => ({
    groups: [],
    period: null,
    loading: false,
    error: null,
  }),
  mutations: {
    setResult(state, result) {
      state.groups = result.articles;
      state.period = { dateFrom: result.dateFrom, dateTo: result.dateTo };
    },
    setLoading(state, loading) {
      state.loading = loading;
    },
    setError(state, error) {
      state.error = error;
    },
  },
  actions: {
    async fetchComments({ commit }, { dateFrom, dateTo }) {
      commit('setLoading', true);
      commit('setError', null);
      try {
        const { data } = await api.get('/analytic/comments/', {
          params: { dateFrom, dateTo },
        });
        commit('setResult', data);
        return data;
      } catch (error) {
        commit('setError', error.response?.data?.message || error.message);
        throw error;
      } finally {
        commit('setLoading', false);
      }
    },
  },
};

