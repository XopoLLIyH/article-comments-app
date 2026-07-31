import api from '../../services/api';

export default {
  namespaced: true,
  state: () => ({
    items: [],
    loading: false,
    error: null,
  }),
  mutations: {
    setItems(state, comments) {
      state.items = comments;
    },
    setLoading(state, loading) {
      state.loading = loading;
    },
    setError(state, error) {
      state.error = error;
    },
    addItem(state, comment) {
      state.items.push(comment);
    },
    replaceItem(state, comment) {
      const index = state.items.findIndex((item) => item.id === comment.id);
      if (index !== -1) state.items.splice(index, 1, comment);
    },
    removeItem(state, id) {
      state.items = state.items.filter((item) => item.id !== id);
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
    fetchComments({ dispatch, commit }, articleId) {
      return dispatch('runRequest', async () => {
        const { data } = await api.get(`/article/${articleId}/comments/`);
        commit('setItems', data);
        return data;
      });
    },
    addComment({ dispatch, commit }, { articleId, text }) {
      return dispatch('runRequest', async () => {
        const { data } = await api.post(`/article/${articleId}/comment/`, { text });
        commit('addItem', data);
        return data;
      });
    },
    updateComment({ dispatch, commit }, { articleId, id, text }) {
      return dispatch('runRequest', async () => {
        const { data } = await api.patch(`/article/${articleId}/comment/${id}/`, { text });
        commit('replaceItem', data);
        return data;
      });
    },
    deleteComment({ dispatch, commit }, { articleId, id }) {
      return dispatch('runRequest', async () => {
        await api.delete(`/article/${articleId}/comment/${id}/`);
        commit('removeItem', id);
      });
    },
  },
};

