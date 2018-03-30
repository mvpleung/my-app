import Vue from 'vue';
import Vuex from 'vuex';
import global, { plugin } from './modules/global';
import user from './modules/user';
Vue.use(Vuex);

/**Default Module */
const store = new Vuex.Store({
  plugins: [plugin],
  modules: {
    global,
    user
  },
  strict: process.env.NODE_ENV !== 'production'
});
export default store;
