import Vue from 'vue'
import Vuex from 'vuex'
import 'babel-polyfill'
// import createPersistedState from 'vuex-persistedstate' //数据持久
import * as Type from '@/store/types.js'
Vue.use(Vuex);

/**Default Module */
const store = new Vuex.Store({
    // plugins: [createPersistedState()],
    state: {
        openId: null, //微信 openId
        model: null, //模式（山东(04:企业号)、青岛）
        token: null,
        user: null //代理人信息
    },
    getters: {
        openId: state => state.openId || (state.openId = sessionStorage.wp_openId), //微信openId
        model: state => { //渠道信息
            return state.model || (state.model = sessionStorage.wp_model);
        },
        isLogin: (state, getters) => { //是否登录，校验本地存储的 agentCode
            let user = getters.user;
            return user && user.agentCode && user.agentCode !== null && user.agentCode !== '';
        },
        user: state => { //本地存储的用户信息
            try {
                state.user = JSON.parse(localStorage.wp_userInfo);
            } catch (e) {}
            return state.user ? (state.user.data || {}) : {};
        }
    },
    mutations: {
        /**
         * 触发登录，暂时闲置
         */
        [Type.LOGIN]: (state, data) => {
            localStorage.token = data;
            state.token = data;
        },
        /**
         * 触发登出，暂时闲置
         */
        [Type.LOGOUT]: (state) => {
            localStorage.removeItem('token');
            state.token = null
        },
        /**
         * 更新本地用户缓存(包含有效时间,默认7天)
         */
        [Type.UPDATE_USER]: (state, data) => {
            (data.vm || this.default._vm).$utils.setLocalStorage('wp_userInfo', (state.user = data.data), 60 * 60 * 24 * 7);
        },
        /**
         * 更新OpenId
         */
        [Type.UPDATE_OPENID]: (state, data) => {
            state.openId = data;
            sessionStorage.wp_openId = state.openId;
        },
        /**
         * 更新缓存 model
         */
        [Type.SET_MODEL]: (state, model) => {
            if (model && model !== null && model !== '') {
                state.model = model;
                sessionStorage.wp_model = state.model;
            }
        }
    },
    actions: {
        /**
         * 登录事件
         * @param {Store*} commit module 
         * @param {String} token 登录令牌 
         */
        [Type.LOGIN]({ commit }, token) {
            commit(Type.LOGIN, token);
        },
        /**
         * 登出事件
         */
        [Type.LOGOUT]({ commit }) {
            commit(Type.LOGOUT);
        },
        /**
         * 更新缓存渠道信息
         * @param {Store*} commit module 
         * @param {String} model 渠道标识 
         */
        [Type.SET_MODEL]({ commit }, model) {
            commit(Type.SET_MODEL, model);
        },
        /**
         * 更新缓存 openId
         * @param {Store*} commit module 
         * @param {String} data openId 
         */
        [Type.UPDATE_OPENID]({ commit }, data) {
            commit(Type.UPDATE_OPENID, data);
        },
        /**
         * 更新缓存用户信息
         * @param {Store*} commit module 
         * @param {Object} data 用户信息 
         */
        [Type.UPDATE_USER]({ commit }, data) {
            commit(Type.UPDATE_USER, data);
        },
        /**
         * 检测本地用户信息是否已经过期（默认七天）
         * @param {Store} context store module
         * @param {Vue} vm Vue 实例 
         */
        [Type.CHECK_USER_INFO](context, vm) {
            return new Promise((resolve, reject) => {
                let userInfo = vm.$utils.getLocalStorage('userInfo', 60 * 60 * 24 * 7);
                if (userInfo && userInfo.expire) { //已过期，重新获取数据
                    context.dispatch(Type.GET_USER, {
                        vm: vm,
                        agentCode: (userInfo.data || {}).agentCode,
                        model: context.getters.model,
                        errorHandle: true
                    }).then(resp => {
                        resolve();
                    }).catch(err => {
                        data.vm.$messagebox(err);
                        reject(err);
                        console.error(err);
                    })
                } else {
                    resolve();
                }
            })
        },
        /**
         * 微信授权逻辑用于获取 openId or agentCode
         * @param {Store} context store module 
         * @param {Object} data 
         */
        [Type.WX_OAUTH](context, data) {
            data.query = data.query || {};
            let agentCode = data.query.agentCode,
                openId = data.query.openId || context.getters.openId,
                model = context.getters.model;
            return new Promise((resolve, reject) => {
                if (!model || model === '' || model === null) {
                    resolve({ name: 'error', params: { msg: '缺少Model参数' }})
                } else if ((!agentCode || agentCode === '') && (!openId || openId === '')) {
                    //解决企业微信浏览器 window.location.href 不能跳转的问题
                    let link = document.createElement('a');
                    link.href = `${context.getters.url.baseUrl}/${model === '04' ? 'oauthq' : 'oauth'}.html?redirect=${encodeURIComponent(data.redirect)}`;
                    link.click();
                    reject();
                } else {
                    context.dispatch(Type.UPDATE_OPENID, openId);
                    context.dispatch(Type.GET_USER, {
                        vm: data.vm,
                        agentCode: agentCode,
                        openId: openId,
                        model: model,
                        errorHandle: true
                    }).then(resp => {
                        data.vm.$indicator.close();
                        resolve({});
                    }).catch(err => {
                        data.vm.$indicator.close();
                        if (openId && openId !== null && openId !== '') { //openid 跳转
                            data.vm.$toast(err);
                            resolve({ path: '/register' })
                        } else {
                            data.vm.$messagebox('提示', err);
                            reject(err);
                        }
                        console.error(err);
                    })
                }
            })
        },
        /**
         * 获取用户信息
         * @param {Store} context module 
         * @param {Object} data agentCode/openId/vm
         */
        [Type.GET_USER](context, data) {
            return new Promise((resolve, reject) => {
                data.model = data.model || context.getters.model;
                let config = data.agentCode && data.model === '04' ? { //04: 企业号
                    url: '/invite/userInfo.do',
                    errorHandle: data.errorHandle,
                    data: {
                        agentCode: data.agentCode,
                        model: data.model
                    }
                } : {
                    url: '/invite/getByOpenId.do',
                    errorHandle: data.errorHandle,
                    data: {
                        openId: data.openId,
                        model: data.model
                    }
                }
                data.vm.axios(config).then(resp => {
                    context.dispatch(Type.UPDATE_USER, { data: resp.data, vm: data.vm });
                    resolve(resp);
                }).catch(err => {
                    reject(err);
                });
            })
        }
    }
});
/**
 * 全局配置
 */
store.registerModule('global', {
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
         * 微信桥接对象
         */
        [Type.WXJSBRIDGE]: (state, data) => {
            globalConfig.callWXJSBridge(data);
        },
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
         * 微信桥接对象
         * @param {Store} commit module 
         * @param {String} data 微信内置 js 方法 
         */
        [Type.WXJSBRIDGE]({ commit }, data) {
            commit(Type.WXJSBRIDGE, data);
        },
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
        },
        /**
         * 微信js-sdk获取签名
         * @param {Store} context module 
         * @param {Object} data.vm Vue实例 
         */
        [Type.WX_SIGNATURE](context, data) {
            return data.vm.axios({
                url: context.getters.model === '04' ? '/invite/getEtpSignature.do' : '/invite/getSignature.do',
                silence: true,
                data: {
                    url: location.href.split('#')[0]
                }
            });
        },
        /**
         * 微信分享按钮是否显示
         * @param {Store} commit module 
         * @param {String} data {vm:Vue, wxShare:Boolean} 
         */
        [Type.WX_SHARE_ENABLE]({ commit }, data) {
            typeof(wx) !== 'undefined' && (data.wxShare ? wx.showAllNonBaseMenuItem() : wx.hideAllNonBaseMenuItem());
        },
    }
})
export default store;