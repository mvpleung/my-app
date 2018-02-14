/*
 * 全局配置
 * @Author: liangzc 
 * @Date: 2017-07-20 
 * @Last Modified by: liangzc
 * @Last Modified time: 2018-02-13 17:40:59
 */

(function(window) {
  var global = {
    /**
     * 全局配置类
     */
    globalConfig: {
      prod: process.env.ENV_CONFIG === 'prod', //生产模式
      uat: process.env.ENV_CONFIG === 'uat', //UAT模式
      debug: process.env.ENV_CONFIG === 'dev', //是否为debug模式（开发环境才打印日志）
      console: process.env.ENV_CONFIG === 'dev',
      navigator: {
        isWechat:
          navigator.userAgent.match(/(MicroMessenger)\/([\d\.]+)/i) !== null,
        isAlipay:
          navigator.userAgent.match(/(AlipayClient)\/([\d\.]+)/i) !== null,
        isMobile: /mobile|table|ip(ad|hone|od)|android/i.test(
          navigator.userAgent
        )
      },
      appid: {
        wechat: 'wx838dfdda62928a01',
        alipay: ''
      },
      requireAuth: true
    },
    /**
     * 是否为有效环境(微信、支付宝)
     * @returns {Boolean}
     */
    isValidNavigator() {
      return (
        this.globalConfig.navigator.isWechat ||
        this.globalConfig.navigator.isAlipay
      );
    },
    /**
     * 限制打开环境
     */
    navigatorAgent() {
      if (!this.globalConfig.debug && !this.isValidNavigator()) {
        // window.top.location.href = `${location.origin}/#/404`;
        window.top.location.href =
          'https://open.weixin.qq.com/connect/oauth2/authorize?appid=XXX&connect_redirect=1#wechat_redirect';
      }
    },
    /**
     * 日志配置
     */
    logConfig() {
      if (this.globalConfig.debug) {
        console.log(
          '%cNow You Can Console Log...',
          'color:red;font-size:18px;font-style:oblique;'
        );
      } else {
        console.log = function() {
          return false;
        };
        console.error = function() {
          return false;
        };
      }
      this.globalConfig.console && require('vconsole/dist/vconsole.min');
    },
    /**
     * 获取UA
     * @returns {String}
     */
    userAgent() {
      if (this.globalConfig.navigator.isWechat) {
        return 'wechat';
      }
      if (this.globalConfig.navigator.isAlipay) {
        return 'alipay';
      }
      if (this.globalConfig.navigator.isMobile) {
        return 'mobile';
      }
      return 'desktop';
    },
    /**
     * 初始化配置
     */
    initConfig() {
      this.globalConfig.requireAuth =
        this.globalConfig.requireAuth && this.isValidNavigator();
      this.globalConfig.navigator.ua = this.userAgent();
      this.logConfig();
      this.navigatorAgent();
    }
  };
  try {
    let sessionConfig = JSON.parse(sessionStorage.globalConfig || '{}');
    global.globalConfig.debug =
      sessionConfig.debug !== undefined ?
        sessionConfig.debug :
        global.globalConfig.debug;
    global.globalConfig.console =
      sessionConfig.console !== undefined ?
        sessionConfig.console :
        global.globalConfig.console;
  } catch (error) {}
  global.initConfig();
  window.$globalConfig = Object.assign(
    {},
    window.$globalConfig || {},
    global.globalConfig
  );
})(window);
