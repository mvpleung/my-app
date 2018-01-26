/**
 * 登录
 */
export const LOGIN = 'login';
/**
 * 登出
 */
export const LOGOUT = 'logout';
/**
 * 更新全局配置
 */
export const UPDATE_CONFIG = 'updateConfig';
/**
 * 更新用户信息
 */
export const UPDATE_USER = 'updateUser';
/**更新 openId */
export const UPDATE_OPENID = 'updateOpenId';
/**
 * 更新 userId
 */
export const UPDATE_USERID = 'updateUserId';
/**
 * 获取用户信息
 */
export const GET_USER = 'getUserInfo';
/**
 * 检测用户信息是否已过期
 */
export const CHECK_USER_INFO = 'checkUserInfo';
/**
 * 缓存路由信息
 */
export const ADD_ROUTE_CHAIN = 'addRouteChain';
/**
 * 移除缓存路由信息
 */
export const POP_ROUTE_CHAIN = 'popRouteChain';
/**
 * 缓存滚动位置
 */
export const SAVE_HASH_SCROLL = 'saveHashScroll';
/**
 * 页面切换动画
 */
export const SET_PAGE_DIRECTION = 'setPageDirection';
/**
 * 微信/支付宝网页授权
 */
export const WAP_OAUTH = 'wapOAuth';