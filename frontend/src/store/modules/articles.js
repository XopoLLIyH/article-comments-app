import api from '../../services/api';

export default {
  namespaced: true,
  state: () => ({
    items: [],
    current: null,
    loading: false,
    error: null,
  }),
  mutations: {
    setItems(state, articles) {
      state.items = articles;
    },
    setCurrent(state, article) {
      state.current = article;
    },
    setLoading(state, loading) {
      state.loading = loading;
    },
    setError(state, error) {
      state.error = error;
    },
    addItem(state, article) {
      state.items.unshift(article);
    },
    replaceItem(state, article) {
      const index = state.items.findIndex((item) => item.id === article.id);
      if (index !== -1) state.items.splice(index, 1, article);
      if (state.current?.id === article.id) state.current = article;
    },
    removeItem(state, id) {
      state.items = state.items.filter((item) => item.id !== id);
      if (state.current?.id === id) state.current = null;
    },
  },
  actions: {
    async runRequest({ commit }, request) {
      commit('setLoading', true);
      commit('setError', null);
      try {
        return await request();
      } catch (error) {
        commit('setError', error.response?.data?.message || error.message);
        throw error;
      } finally {
        commit('setLoading', false);
      }
    },
    fetchArticles({ dispatch, commit }) {
      return dispatch('runRequest', async () => {
        const { data } = await api.get('/articles/');
        commit('setItems', data);
        return data;
      });
    },
    fetchArticle({ dispatch, commit }, id) {
      return dispatch('runRequest', async () => {
        const { data } = await api.get(`/article/${id}/`);
        commit('setCurrent', data);
        return data;
      });
    },
    createArticle({ dispatch, commit }, payload) {
      return dispatch('runRequest', async () => {
        const { data } = await api.post('/article/', payload);
        commit('addItem', data);
        return data;
      });
    },
    updateArticle({ dispatch, commit }, { id, ...payload }) {
      return dispatch('runRequest', async () => {
        const { data } = await api.patch(`/article/${id}/`, payload);
        commit('replaceItem', data);
        return data;
      });
    },
    deleteArticle({ dispatch, commit }, id) {
      return dispatch('runRequest', async () => {
        await api.delete(`/article/${id}/`);
        commit('removeItem', Number(id));
      });
    },
  },
};

