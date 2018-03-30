/*
 * 全局配置Module
 * @Author: liangzc 
 * @Date: 2018-01-18 11:30:49 
 * @Last Modified by: liangzc
 * @Last Modified time: 2018-03-21 14:38:47
 */
import {
  UPDATE_CONFIG,
  ADD_ROUTE_CHAIN,
  POP_ROUTE_CHAIN,
  SAVE_HASH_SCROLL,
  SET_PAGE_DIRECTION,
  SHOW_LOADING,
  HIDE_LOADING
} from '@/store/types.js';
const global = {
  state: {
    //全局配置
    config: {
      appid: {
        wechat: 'wx838dfdda62928a01',
        alipay: ''
      }
    },
    scrollMap: {}, //滚动记录
    routeChain: [], //存储路由跳转信息，用于前进 or 后退识别
    pageDirection: 'fade', //路由切换动画（暂时屏蔽）
    globalLoading: false
  },
  getters: {
    url: state => state.config.url || {},
    appid: state => state.config.appid || {},
    chainLength: state => state.routeChain.length,
    scrollMap: state => state.scrollMap,
    routeChain: state => state.routeChain,
    pageDirection: state => state.pageDirection,
    globalLoading: state => state.globalLoading
  },
  mutations: {
    /**
     * 更新全局配置
     */
    [UPDATE_CONFIG]: (state, config) => {
      state.config = Object.assign(state.config, state.config, config || {});
    },
    /**
     * 增加路由记录缓存
     */
    [ADD_ROUTE_CHAIN]: (state, route) => {
      route = Array.isArray(route) ? route : [route];
      route.forEach(rt => {
        state.routeChain.push(rt);
      });
    },
    /**
     * 移除栈顶路由记录缓存
     */
    [POP_ROUTE_CHAIN]: state => {
      state.routeChain.pop();
    },
    /**
     * 缓存滚动记录
     */
    [SAVE_HASH_SCROLL]: (state, scroll) => {
      state.scrollMap[scroll.hash] = scroll.scroll;
    },
    /**
     * 设置当前路由页切换动画
     */
    [SET_PAGE_DIRECTION]: (state, pageDirection) => {
      state.pageDirection = pageDirection;
    },
    /**
     * 展示loading
     */
    [SHOW_LOADING]: state => {
      state.globalLoading = true;
    },
    /**
     * 隐藏loading
     */
    [HIDE_LOADING]: state => {
      state.globalLoading = false;
    }
  },
  actions: {
    /**
     * 更新全局配置
     * @param {Store} commit module
     * @param {Object} config 配置信息
     */
    [UPDATE_CONFIG]({ commit }, config) {
      commit(UPDATE_CONFIG, config);
    },
    /**
     * 增加路由记录
     * @param {Store} commit module
     * @param {Route} route 路由实例
     */
    [ADD_ROUTE_CHAIN]({ commit }, route) {
      commit(ADD_ROUTE_CHAIN, route);
    },
    /**
     * 删除栈顶路由记录
     * @param {Store} commit module
     * @param {Route} route 路由实例
     */
    [POP_ROUTE_CHAIN]({ commit }, route) {
      commit(POP_ROUTE_CHAIN, route);
    },
    /**
     * 缓存页面滚动距离，用于回退保持滚动位置
     * @param {Store} commit module
     * @param {Object} scroll 滚动记录对象{x:0,y:0}
     */
    [SAVE_HASH_SCROLL]({ commit }, scroll) {
      setTimeout(() => {
        commit(SAVE_HASH_SCROLL, scroll);
      }, 0);
    },
    /**
     * 设置路由切换动画
     * @param {Store} commit module
     * @param {String} pageDirection 动画class，参考 App.vue style
     */
    [SET_PAGE_DIRECTION]({ commit }, pageDirection) {
      commit(SET_PAGE_DIRECTION, pageDirection);
    },
    /**
     * 展示loading
     */
    [SHOW_LOADING]: ({ commit }) => {
      commit(SHOW_LOADING);
    },
    /**
     * 隐藏loading
     */
    [HIDE_LOADING]: ({ commit }) => {
      commit(HIDE_LOADING);
    }
  }
};

/**
 * 全局配置插件，用于缓存导航信息
 * @param {Object} store
 */
const plugin = store => {
  const savedState = JSON.parse(
    sessionStorage.getItem('vxGlobalState') || '{}'
  );
  const { global, user } = store.state;
  store.replaceState({
    global: Object.assign({}, global, savedState),
    user
  });
  store.subscribeAction((action, state) => {
    if (action.type === ADD_ROUTE_CHAIN || action.type === SAVE_HASH_SCROLL) {
      const { routeChain, scrollMap } = store.state.global;
      sessionStorage.setItem(
        'vxGlobalState',
        JSON.stringify(
          {
            routeChain,
            scrollMap
          },
          (key, value) => key === 'matched' ? null : value
        )
      );
    }
  });
};
export default global;
export { plugin };
