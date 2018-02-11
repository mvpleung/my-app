import Vue from 'vue';
import App from './App.vue';
import router from './router';
import MintUI from 'mint-ui';
import VueAMap from 'vue-amap';
import Axios from './axios';
import store from './store';
//import verify from 'verify-plugin'
import verify from './plugins/verify-plugin';
//import utils from 'vue-utils-plugin'
import utils from './plugins/utils';
import UniquePay from './plugins/pay';
require('es6-promise').polyfill();
import './css/pageStyle.scss';

Vue.use(verify, {
  blur: true,
  msgbox: MintUI.Toast
});
Vue.use(utils);
Vue.use(UniquePay);

//install axios
let installAxios = () => {
  Vue.axios = Axios;
  Object.defineProperties(Vue.prototype, {
    axios: {
      get() {
        return Axios;
      }
    }
  });
};
installAxios();

Vue.use(MintUI);
Vue.use(VueAMap);
VueAMap.initAMapApiLoader({
  key: '8e2319f84aab096dc2dab5745848ad78',
  plugin: ['AMap.Autocomplete', 'AMap.PlaceSearch', 'AMap.Scale', 'AMap.Geolocation', 'AMap.OverView', 'AMap.ToolBar', 'AMap.MapType', 'AMap.PolyEditor', 'AMap.CircleEditor']
});

Vue.config.productionTip = store.getters.debug;
Vue.config.errorHandler = function (err, vm, info) {
  console.error(info, '\n', err);
  MintUI.MessageBox(info, err.message);
};
window.Vue = Vue;
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');