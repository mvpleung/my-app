/*
 * 支付聚合
 * @Author: liangzc 
 * @Date: 2018-01-12
 * @Last Modified by:   liangzc 
 * @Last Modified time: 2018-01-15 11:02:55 
 */
class UnionPay {
    constructor() {
        this.init();
    }

    /**
     * 初始化
     */
    init() {
        if (process.env.ENV_CONFIG == 'dev') {
            this.loadJS(globalConfig.wechat.isWechat ? '//res.wx.qq.com/open/js/jweixin-1.2.0.js' : '//a.alipayobjects.com/g/component/antbridge/1.1.4/antbridge.min.js');
        }
    }

    /**
     * 加载 js 文件
     * @param {String} path js相对路径 
     */
    loadJS(path) {
        if (!path || path === '') {
            console.error('UnionPay init fail , path : null');
            return;
        }
        let a = document.createElement("script");
        a.src = location.protocol + path;
        a.onload = () => {
            console.log('UnionPay init success !!! ');
        }
        a.onerror = () => {
            console.error('UnionPay init fail , path : ', path);
        }
        let c = document.getElementsByTagName("script")[0];
        c.parentNode.insertBefore(a, c);
    }

    /**
     * 唤起支付
     * @param {Object} options 支付参数
     */
    pay(options) {
        return globalConfig.wechat.isWechat ? this.wechatPay(options) : this.aliPay(options);
    }

    /**
     * 调起微信支付
     * @param {Object} options
     * @{options}  timestamp 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
     * @{options}  nonceStr 支付签名随机串，不长于 32 位
     * @{options}  package 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=\*\*\*）
     * @{options}  signType 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
     * @{options}  paySign 支付签名
     */
    wechatPay(options) {
        return new Promise((resolve, reject) => {
            if (!options || Object.prototype.toString.call(options) !== ("[object Object]")) {
                reject('唤起微信支付参数错误，参数[options]：' + JSON.stringify(options));
                return;
            }
            options.success = (res) => {
                if (res.err_msg == "get_brand_wcpay_request:ok") { //支付成功
                    resolve(res);
                }
            };
            wx.chooseWXPay(options);
        })
    }

    /**
     * 调起支付宝支付
     * @param {Object} options
     * @{options} tradeNO 交易号
     */
    aliPay(options) {
        return new Promise((resolve, reject) => {
            if (!options || Object.prototype.toString.call(options) !== ("[object Object]")) {
                reject('唤起支付宝参数错误，参数[options]：' + JSON.stringify(options));
                return;
            }
            AlipayJSBridge.call('tradePay', options, result => {
                switch (result.resultCode) {
                    case '9000': //支付成功
                        resolve(result);
                        break;
                    case '8000':
                        AlipayJSBridge.call('alert', {
                            title: '系统提示',
                            message: '支付处理中，请稍后在您的订单中查看',
                            button: '确定'
                        }, e => AlipayJSBridge.call('popWindow'));
                        break;
                    case '6001':
                    case '99':
                        break;
                    default:
                        AlipayJSBridge.call('alert', {
                            title: '系统提示',
                            message: '支付异常,请关闭页面后重试',
                            button: '确定'
                        });
                        break;
                }
            });
        })
    }
}

module.exports = new UnionPay();