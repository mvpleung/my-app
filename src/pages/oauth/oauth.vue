/*
 * 公共授权页
 * @Author: liangzc 
 * @Date: 2018-01-10 09:28:33 
 * @Last Modified by: liangzc
 * @Last Modified time: 2018-03-19 17:04:17
 */
<template>
  <div class="page-container">
    <img v-show="oauthFail"
      src="../../assets/refresh.png"
      width="10%">
    <mt-spinner v-show="!oauthFail"
      type="triple-bounce"
      :size="60" />
    <p class="font18"
      v-show="!oauthFail">正在跳转...</p>
    <p class="font16"
      v-show="oauthFail">授权失败，轻触屏幕重新加载</p>
    <p v-show="oauthFail">
      <span class="font12">{{ errorMsg }}</span>
    </p>
  </div>
</template>
<script>
import { mapActions } from 'vuex';
export default {
  data() {
    return {
      query: {},
      errorMsg: '',
      oauthFail: false //授权失败
    };
  },
  created() {
    document.setTitle('加载中...');
    this.query = this.$utils.getUrlVars();
    window.addEventListener('touchstart', this.retry);
    this.init();
  },
  methods: {
    /**
     * 初始化
     */
    init() {
      //code: 微信code, auth_code:支付宝code
      if (
        (!this.$utils.isEmpty(this.query.code) ||
          !this.$utils.isEmpty(this.query.auth_code)) &&
        !this.$utils.isEmpty(this.query.state)
      ) {
        this.oauthFail = false;
        //code、state都不为空，授权成功
        const requestUri = {
          wechat: 'v1/wx/userinfo',
          alipay: 'v1/alipay/userinfo'
        };
        this.axios
          .get(requestUri[$globalConfig.navigator.ua], {
            params: this.query,
            errorHandle: true
          })
          .then(resp => {
            this.errorMsg = '';
            if (!this.$utils.isEmpty(this.query.redirect)) {
              this.updateUser(resp.user_info || {});
              const redirectUri = decodeURIComponent(this.query.redirect);
              if (redirectUri) {
                //兼容外链
                if (redirectUri.startWith('http')) {
                  window.top.location.replace(redirectUri);
                } else {
                  window.top.location.replace(
                    `${location.origin}/#${redirectUri}`
                  );
                  // this.$router.replace(redirectUri);
                }
              }
            } else {
              self.location = document.referrer;
            }
          })
          .catch(error => {
            this.oauthFail = true;
            this.errorMsg = error.message;
          });
      } else {
        //重定向授权页
        const { wechat, alipay } = this.$store.getters.appid;
        const oatuhUri = {
          wechat: `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${wechat}&redirect_uri={0}&response_type=code&scope=snsapi_userinfo&state=vueapp#wechat_redirect`,
          alipay: `https://openauth.alipay.com/oauth2/publicAppAuthorize.htm?app_id=${alipay}&scope=auth_user&redirect_uri={0}`
        };
        var authUri = oatuhUri[$globalConfig.navigator.ua];
        authUri &&
          window.top.location.replace(
            authUri.format(
              encodeURIComponent(
                `${location.origin}/#/oauth?redirect=${encodeURIComponent(
                  decodeURIComponent(this.query.redirect)
                )}`
              )
            )
          );
      }
    },
    /**
     * 重试
     */
    retry(e) {
      if (this.oauthFail) {
        window.removeEventListener('touchstart', this.retry);
        //授权失败，轻触重试
        let link = document.createElement('a');
        link.href = `/#/oauth?redirect=${encodeURIComponent(
          decodeURIComponent(this.query.redirect)
        )}`;
        link.click();
        link.remove();
      }
    },
    ...mapActions(['updateUser'])
  }
};
</script>
<style lang="scss" scoped>
.page-container {
  width: 100%;
  font-size: 20px;
  text-align: center;
  color: #8c95a0;
  top: 35%;
  position: fixed;
  p {
    margin-top: 20px;
  }
}
</style>
