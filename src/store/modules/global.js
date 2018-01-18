/*
 * 全局配置Module
 * @Author: liangzc 
 * @Date: 2018-01-18 11:30:49 
 * @Last Modified by: liangzc
 * @Last Modified time: 2018-01-18 11:33:53
 */
import * as Type from '@/store/types.js'
const global = {
    state: {
        debug: globalConfig.debug,
        config: globalConfig, //全局配置
        scrollMap: {}, //滚动记录
        routeChain: [], //存储路由跳转信息，用于前进 or 后退识别
        pageDirection: 'fade' //路由切换动画（暂时屏蔽）
    },
    getters: {
        url: state => state.config.url || {},
        debug: state => state.debug,
        chainLength: state => state.routeChain.length,
        scrollMap: state => state.scrollMap,
        routeChain: state => state.routeChain,
        pageDirection: state => state.pageDirection
    },
    mutations: {
        /**
         * 更新全局配置
         */
        [Type.UPDATE_CONFIG]: (state, config) => {
            Object.assign(globalConfig, globalConfig, config || {});
            state.config = globalConfig;
        },
        /**
         * 增加路由记录缓存
         */
        [Type.ADD_ROUTE_CHAIN]: (state, route) => {
            route = Array.isArray(route) ? route : [route];
            route.forEach(rt => {
                state.routeChain.push(rt);
            })
        },
        /**
         * 移除栈顶路由记录缓存
         */
        [Type.POP_ROUTE_CHAIN]: (state) => {
            state.routeChain.pop();
        },
        /**
         * 缓存滚动记录
         */
        [Type.SAVE_HASH_SCROLL]: (state, scroll) => {
            state.scrollMap[scroll.hash] = scroll.scroll;
        },
        /**
         * 设置当前路由页切换动画
         */
        [Type.SET_PAGE_DIRECTION]: (state, pageDirection) => {
            state.pageDirection = pageDirection;
        }
    },
    actions: {
        /**
         * 更新全局配置
         * @param {Store} commit module 
         * @param {Object} config 配置信息 
         */
        [Type.UPDATE_CONFIG]({ commit }, config) {
            commit(Type.UPDATE_CONFIG, config);
        },
        /**
         * 增加路由记录
         * @param {Store} commit module 
         * @param {Route} route 路由实例 
         */
        [Type.ADD_ROUTE_CHAIN]({ commit }, route) {
            commit(Type.ADD_ROUTE_CHAIN, route);
        },
        /**
         * 删除栈顶路由记录
         * @param {Store} commit module 
         * @param {Route} route 路由实例 
         */
        [Type.POP_ROUTE_CHAIN]({ commit }, route) {
            commit(Type.POP_ROUTE_CHAIN, route);
        },
        /**
         * 缓存页面滚动距离，用于回退保持滚动位置
         * @param {Store} commit module 
         * @param {Object} scroll 滚动记录对象{x:0,y:0} 
         */
        [Type.SAVE_HASH_SCROLL]({ commit }, scroll) {
            setTimeout(() => {
                commit(Type.SAVE_HASH_SCROLL, scroll);
            }, 0);
        },
        /**
         * 设置路由切换动画
         * @param {Store} commit module 
         * @param {String} pageDirection 动画class，参考 App.vue style 
         */
        [Type.SET_PAGE_DIRECTION]({ commit }, pageDirection) {
            commit(Type.SET_PAGE_DIRECTION, pageDirection);
        }
    }
}

export default global