/*
 * 全局配置
 * @Author: liangzc 
 * @Date: 2017-07-20 
 * @Last Modified by: liangzc
 * @Last Modified time: 2018-03-29 16:34:53
 */

(function(window) {
  var global = {
    /**
     * 全局配置类
     */
    globalConfig: { navigator: {} },
    /**
     * 是否为有效环境(微信、支付宝)
     * @returns {Boolean}
     */
    isValidNavigator() {
      return (
        (this.globalConfig.navigator.isWechat ||
          this.globalConfig.navigator.isAlipay) === true
      );
    },
    /**
     * 限制打开环境
     */
    navigatorAgent() {
      if (!this.globalConfig.debug && !this.isValidNavigator()) {
        window.top.location.href =
          'https://open.weixin.qq.com/connect/oauth2/authorize?appid=XXX&connect_redirect=1#wechat_redirect';
      }
    },
    /**
     * 日志配置
     */
    logConfig() {
      if (this.globalConfig.console) {
        console.log(
          '%cNow You Can Console Log...',
          'color:red;font-size:18px;font-style:oblique;'
        );
        require('vconsole/dist/vconsole.min');
      } else {
        console.log = function() {
          return false;
        };
        console.error = function() {
          return false;
        };
      }
    },
    /**
     * 获取UA
     * @returns {String}
     */
    userAgent() {
      if (navigator.userAgent.match(/(MicroMessenger)\/([\d\.]+)/i) !== null) {
        return 'wechat';
      }
      if (navigator.userAgent.match(/(AlipayClient)\/([\d\.]+)/i) !== null) {
        return 'alipay';
      }
      if (/mobile|table|ip(ad|hone|od)|android/i.test(navigator.userAgent)) {
        return 'mobile';
      }
      return 'desktop';
    },
    /**
     * 桥接过渡函数
     */
    onBridgeReady() {
      return new Promise((resolve, reject) => {
        if (this.globalConfig.navigator.isWechat) {
          if (typeof window.WeixinJSBridge === 'undefined') {
            if (document.addEventListener) {
              document.addEventListener(
                'WeixinJSBridgeReady',
                () => resolve(window.WeixinJSBridge),
                false
              );
            } else if (document.attachEvent) {
              document.attachEvent('WeixinJSBridgeReady', () =>
                resolve(window.WeixinJSBridge)
              );
              document.attachEvent('onWeixinJSBridgeReady', () =>
                resolve(window.WeixinJSBridge)
              );
            }
          } else {
            resolve(window.WeixinJSBridge);
          }
        } else if (this.globalConfig.navigator.isAlipay) {
          if (window.AlipayJSBridge) {
            resolve(window.AlipayJSBridge);
          } else {
            document.addEventListener(
              'AlipayJSBridgeReady',
              () => resolve(window.AlipayJSBridge),
              false
            );
          }
        }
      });
    },
    /**
     * 初始化配置
     */
    initConfig() {
      const ua = this.userAgent();
      this.globalConfig.navigator = {
        ua: ua,
        [`is_${ua}`.replace(/[-|_](\w)/g, ($0, $1) => $1.toUpperCase())]: true
      };

      this.globalConfig[
        process.env.ENV_CONFIG === 'dev' ? 'debug' : process.env.ENV_CONFIG
      ] = true;

      const console =
        process.env.ENV_CONFIG === 'dev' || process.env.ENV_CONFIG === 'sit';
      console && (this.globalConfig.console = console);
      window.$OnBridgeReady = this.onBridgeReady();
      window.$OnBridgeReady.then(Bridge => {
        Bridge.call('hideOptionMenu');
      });
      this.logConfig();
      this.navigatorAgent();
    }
  };
  try {
    let sessionConfig = JSON.parse(sessionStorage.globalConfig || '{}');
    sessionConfig.console !== undefined &&
      (global.globalConfig.console = sessionConfig.console);
  } catch (error) {}
  global.initConfig();
  window.$globalConfig = Object.assign(
    {},
    window.$globalConfig || {},
    global.globalConfig
  );
})(window);
