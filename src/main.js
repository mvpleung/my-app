import Vue from 'vue';
import App from './App.vue';
import router from './router';
import MintUI from 'mint-ui';
import VueAMap from 'vue-amap';
import Axios from './axios';
import store from './store';
import { UniquePay, Verify, Utils, EventBus } from './plugins';
//import verify from 'verify-plugin'
//import utils from 'vue-utils-plugin'
//import UniquePay from 'unique-pay'
require('es6-promise').polyfill();
import './css/pageStyle.scss';
$globalConfig.debug && require('./mock/index');

Vue.use(Verify, {
  blur: true,
  msgbox: MintUI.Toast
});
Vue.use(Utils);
Vue.use(UniquePay);
Vue.use(EventBus);

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
  plugin: [
    'AMap.Autocomplete',
    'AMap.PlaceSearch',
    'AMap.Scale',
    'AMap.Geolocation',
    'AMap.OverView',
    'AMap.ToolBar',
    'AMap.MapType',
    'AMap.PolyEditor',
    'AMap.CircleEditor',
    'AMap.MarkerClusterer'
  ],
  v: '1.4.4'
});

Vue.config.errorHandler = function(err, vm, info) {
  console.error(info, '\n', err);
  MintUI.MessageBox(info, err.message);
};
window.Vue = Vue;
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
