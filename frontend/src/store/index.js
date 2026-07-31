import { createStore } from 'vuex';
import articles from './modules/articles';

export default createStore({
  strict: import.meta.env.DEV,
  modules: { articles },
});

