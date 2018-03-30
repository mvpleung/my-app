/*
 * 用户信息Module
 * @Author: liangzc 
 * @Date: 2018-01-18 11:30:31 
 * @Last Modified by: liangzc
 * @Last Modified time: 2018-03-19 14:03:28
 */
import {
  LOGOUT,
  INIT_USER,
  UPDATE_USER,
  UPDATE_MOBILE,
  UPDATE_ACCOUNT,
  RESET_ACCOUNT
} from '@/store/types.js';
const user = {
  state: {
    user: null, //用户信息
    account: null //账户信息
  },
  getters: {
    id: (state, getters) => (getters.user || {}).id, //授权身份标识（userId|openId）
    isLogin: (state, getters) => {
      //是否登录，校验本地存储的 id
      let user = getters.user;
      return user && !Vue.$utils.isEmpty(user.id);
    },
    /**
     * id: openId/userId
     * id_type: 公众号:wechat 生活号:alipay
     * nick_name: 昵称
     * avatar: 头像
     * mobile: 手机
     */
    user: state => state.user || {},
    account: state => state.account || {} //账户信息
  },
  mutations: {
    /**
     * 触发登出，暂时闲置
     */
    [LOGOUT]: state => {
      localStorage.removeItem('ht_u_info');
      state.user = null;
    },
    /**
     * 更新本地用户缓存(包含有效时间,默认7天)
     */
    [UPDATE_USER]: (state, userInfo) => {
      Vue.$utils.setLocalItem('ht_u_info', state.user = userInfo, {
        exp: 60 * 60 * 24,
        needCipher: true
      });
    },
    /**
     * 更新用户手机
     */
    [UPDATE_MOBILE]: (state, mobile) => {
      let userInfo =
        state.user || Vue.$utils.getLocalItem('ht_u_info', true) || {};
      userInfo.mobile = mobile;
      Vue.$utils.setLocalItem('ht_u_info', state.user = userInfo, {
        exp: 60 * 60 * 24,
        needCipher: true
      });
    },
    /**
     * 更新账户信息
     */
    [UPDATE_ACCOUNT]: (state, account) => {
      state.account = account;
    },
    /**
     * 重置账户信息
     */
    [RESET_ACCOUNT]: state => {
      state.account = null;
    }
  },
  actions: {
    /**
     * 登出事件
     */
    [LOGOUT]({ commit }) {
      commit(LOGOUT);
    },
    /**
     * 初始化用户信息
     */
    [INIT_USER](context) {
      !context.state.user &&
        context.commit(
          UPDATE_USER,
          Vue.$utils.getLocalItem('ht_u_info', true) || {}
        );
    },
    /**
     * 更新缓存用户信息
     * @param {*} commit module
     * @param {Object} userInfo 用户信息
     */
    [UPDATE_USER]({ commit }, userInfo) {
      commit(UPDATE_USER, userInfo);
    },
    /**
     * 更新用户手机
     */
    [UPDATE_MOBILE]({ commit }, mobile) {
      commit(UPDATE_MOBILE, mobile);
    },
    /**
     * 更新缓存用户账户信息
     * @param {Object} accountInfo 用户账户信息
     */
    [UPDATE_ACCOUNT]({ commit, getters }) {
      return new Promise((resolve, reject) => {
        let userInfo = getters.user;
        if (
          !Vue.$utils.isEmpty(userInfo.mobile) &&
          Vue.$utils.isEmptyObject(getters.account)
        ) {
          Vue.axios
            .get('v1/phtons/accountInfo', {
              params: { phone: userInfo.mobile },
              silence: true
            })
            .then(resp => {
              commit(UPDATE_ACCOUNT, resp.result_data || {});
              resolve();
            })
            .catch(err => reject(err));
        } else {
          resolve();
        }
      });
    },
    /**
     * 重置账户信息
     */
    [RESET_ACCOUNT]({ commit }) {
      commit(RESET_ACCOUNT);
    }
  }
};

export default user;
