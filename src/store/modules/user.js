/*
 * 用户信息Module
 * @Author: liangzc 
 * @Date: 2018-01-18 11:30:31 
 * @Last Modified by: liangzc
 * @Last Modified time: 2018-01-26 15:37:05
 */
import * as Type from '@/store/types.js'
const user = {
    state: {
        openId: null, //微信 openId
        userId: null, //支付宝userId
        user: null //用户信息
    },
    getters: {
        openId: state => state.openId || (state.openId = sessionStorage.ht_u_openId), //微信openId
        userId: state => state.userId || (state.userId = sessionStorage.ht_u_userId), //微信openId
        isLogin: (state, getters) => { //是否登录，校验本地存储的 openid
            let user = getters.user;
            return user && !Vue.$utils.isEmpty(user.openid);
        },
        user: state => state.user || (state.user = Vue.$utils.getLocalStorage('ht_u_info', { exp: 60 * 60 * 24 * 7, force: true, needDecipher: true })) || {}
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
            Vue.$utils.setLocalStorage('ht_u_info', (state.user = data.data), { exp: 60 * 60 * 24 * 7, needCipher: true });
        },
        /**
         * 更新微信OpenId
         */
        [Type.UPDATE_OPENID]: (state, openId) => {
            state.openId = openId;
            sessionStorage.ht_u_openId = state.openId;
        },
        /**
         * 更新支付宝userId
         */
        [Type.UPDATE_USERID]: (state, userId) => {
            state.userId = userId;
            sessionStorage.ht_u_userId = state.userId;
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
         * 更新缓存 openId
         * @param {Store*} commit module 
         * @param {String} openId openId 
         */
        [Type.UPDATE_OPENID]({ commit }, openId) {
            commit(Type.UPDATE_OPENID, openId);
        },
        /**
         * 更新缓存 userId
         * @param {Store*} commit module 
         * @param {String} userId userId 
         */
        [Type.UPDATE_USERID]({ commit }, userId) {
            commit(Type.UPDATE_USERID, userId);
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
         */
        [Type.CHECK_USER_INFO](context) {
            return new Promise((resolve, reject) => {
                let userInfo = Vue.$utils.getLocalStorage('userInfo', { exp: 60 * 60 * 24 * 7, needDecipher: true });
                if (userInfo && userInfo.expire) { //已过期，重新获取数据
                    context.dispatch(Type.GET_USER, {
                        agentCode: (userInfo.data || {}).agentCode,
                        model: context.getters.model,
                        errorHandle: true
                    }).then(resp => {
                        resolve();
                    }).catch(err => {
                        Vue.$messagebox(err);
                        reject(err);
                        console.error(err);
                    })
                } else {
                    resolve();
                }
            })
        },
        /**
         * 授权逻辑用于获取 openId or userId
         * @param {Store} context store module 
         * @param {Object} data 
         */
        [Type.WAP_OAUTH](context, data) {
            data.query = data.query || {};
            let openId = data.query.openId || context.getters.openId,
                userId = data.query.userId || context.getters.userId;
            return new Promise((resolve, reject) => {
                if (!openId || openId === '' || !userId || userId === '') {
                    resolve({ path: '/oauth' });
                } else {
                    //更新缓存数据
                    context.dispatch(Type.UPDATE_OPENID, openId);
                    context.dispatch(Type.UPDATE_USERID, userId);
                    context.dispatch(Type.GET_USER, {
                        openId: openId,
                        userId: userId,
                        errorHandle: true
                    }).then(resp => {
                        Vue.$indicator.close();
                        resolve({});
                    }).catch(err => {
                        Vue.$indicator.close();
                        Vue.$toast(err);
                        resolve({ path: '/' })
                        console.error(err);
                    })
                }
            })
        },
        /**
         * 获取用户信息
         * @param {Store} context module 
         * @param {Object} data userId/openId
         */
        [Type.GET_USER](context, data) {
            return new Promise((resolve, reject) => {
                let config = {
                    errorHandle: data.errorHandle,
                    params: {
                        openId: data.openId,
                        userId: data.userId
                    }
                }
                Vue.axios.get('/invite/getByOpenId.do', config).then(resp => {
                    context.dispatch(Type.UPDATE_USER, { data: resp.data });
                    resolve(resp);
                }).catch(err => {
                    reject(err);
                });
            })
        }
    }
}

export default user