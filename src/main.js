import Vue from 'vue'
import App from './App.vue'
import router from './router'
import MintUI from 'mint-ui'
import Axios from './axios'
import store from './store'
import 'babel-polyfill'
//import verify from 'verify-plugin'
import verify from './plugins/verify-plugin'
//import utils from 'vue-utils-plugin'
import utils from './plugins/utils'

Vue.use(verify, {
    blur: true,
    msgbox: MintUI.Toast
});
Vue.use(utils);

//install axios
let installAxios = () => {
    Vue.axios = Axios
    Object.defineProperties(Vue.prototype, {
        axios: {
            get() {
                return Axios
            }
        }
    });
}
installAxios();

Vue.use(MintUI);
Vue.config.productionTip = store.getters.debug;
Vue.config.errorHandler = function (err, vm, info) {
    console.error(err, info);
    MintUI.MessageBox(info, err.message);
};
window.Vue = Vue;
new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')