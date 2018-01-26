<template>
  <div class="page-container">
    <img v-show="authFail" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAMAAAD04JH5AAAANlBMVEUAAADPz8/Nzc3Nzc3Nzc3Pz8/Nzc3Pz8/Pz8/MzMzNzc3Nzc3Nzc3MzMzMzMzNzc3Nzc3Nzc3HjkhBAAAAEXRSTlMAQPB/wBBgMCCg4FCQz7DQcPxCA0wAAANNSURBVHja7ZrZcuQgDEXFvnrh/392ZlKVkZO0bUAQpVI+z9C6fZEAA/Dw8PDQjUhKqVX/JSulrIAK7BoS0DEpa1m+ELWyBq7I5S870Eh5KRcsysEZvrwBBFyW5ZYYTjSI8obodn6PpZLFjhdglCwNyOyHCvBn3ket5YkEZcYJ+PLvpc678NjACRW2LxL2QQLEp7Ffd3eSo/snETENEGDWj9HTdWv7sXk2VAFCFiRaU5Ou8dhF0ASogujqrnYriCII8LotPCIOEhbTK8Ch/dJCI7tEBb5PgJPHXGrGBJTvegRYTCQHXQiJBrYLwPirgU4M5pBFAa3xdyCgcBTaBLhDR4QyDNK1CHCyOf79T+31Avx7p80AGSymegELxh+A21oF5HfTDAzByDYB6Wb8iaMgahMA49OxLQJWnDrGsdcKwAEI/YarF8haASZSCyCUa0Td3NmdAKKQBHjcxnSiCALQv2jmCTA1BiToxstyyVpjgCbOvBdkUzNnCmBCoQE8RGYDBLcBARcBHiTuAlhIuArxkAmT0MAakMCFx6mSB0v4EBpZhB640OUfEdjgTgGPWyEeBPc8jN+uTCjcsTGAAoAN/TMEbMCGbtwNPQJ+q4AFGvhlZcg+EbELYF+M2Jdj9g0J+5aMf1PKvi23PyQLA0zGwBlxbhLgfeYqLpNAwETS1RGA/YYxCFcCjJx8QIAheA6p7k1O04/pFhwBloNKUW4KLU+2QN8dwni8LpmBuL+ODFOXRH1f575MzIJUKpa7cJcm9LP4QLi0IqEqDMBCkB4G4yr/mpFlzifSgiVQd8+cYSih/j5OY9Nx2IIFznF97ySmVr1a6UfHL6ltvJZRTziWxrwyGyoYGX9rt2wxI+LjkHIowPiurWywGzX/MAH7FCRS/f+Pb/tf3mTSTSDG71ew+E77F4xPs08q4mMOS36BFQXhPbZ0I15jrB46HwRvnlDEoeths9AFCQaIdYRoW9UFw2MV9+N0OSCDu2keZDmg0X6iCUgM1p8MmMXo+Jx4ACaXT8RVJQEHhFBrvHkzRMGH8gqp31jKKwL6NEUCMjc84nMslUTlYQqpyoY1wTyMDZc+xJAMzMbbsJUXbME6+Da8UCrod9QuHDw8PDx08QfhmY4ZLaEeLwAAAABJRU5ErkJggg==" width="10%" />
    <p class="font18" v-show="!authFail">正在跳转...</p>
    <p class="font16" v-show="authFail">授权失败，轻触屏幕重新加载</p>
    <p v-show="authFail"><span class="font12">{{errorMsg}}</span></p>
  </div>
</template>
<script>
import { mapActions } from 'vuex';
export default {
  data() {
    return {
      query: {},
      errorMsg: '',
      authFail: false //授权失败
    };
  },
  created() {
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
        this.authFail = false;
        //code、state都不为空，授权成功
        this.axios
          .get('v1/wx/userinfo', { params: this.query, errorHandle: true })
          .then(resp => {
            this.errorMsg = '';
            if (!this.$utils.isEmpty(this.query.redirectUri)) {
              let userInfo = resp.user_info || {};
              this.updateUser({ data: userInfo, vm: this });
              let redirectUri = this.$utils.setUrlParams(
                { openId: userInfo.openid },
                this.query.redirectUri
              );
              if (redirectUri) {
                //兼容外链
                if (redirectUri.startWith('http')) {
                  window.top.location.href = redirectUri;
                } else {
                  this.$router.replace(redirectUri);
                }
              }
            } else {
              self.location = document.referrer;
            }
          })
          .catch(error => {
            this.authFail = true;
            this.errorMsg = error.message;
          });
      } else {
        //重定向授权页
        const oatuhUri = {
          wechat: `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${
            globalConfig.appid.wechat
          }&redirect_uri={0}&response_type=code&scope=snsapi_userinfo&state=vueapp#wechat_redirect`,
          alipay: `https://openauth.alipay.com/oauth2/publicAppAuthorize.htm?app_id=${
            globalConfig.appid.alipay
          }&scope=auth_user&redirect_uri={0}`
        };
        var authUri = oatuhUri[globalConfig.navigator.ua];
        authUri &&
          (window.top.location.href = authUri.format(
            encodeURIComponent(
              `${location.origin}/#/oauth?redirectUri=${encodeURIComponent(
                decodeURIComponent(this.query.redirectUri)
              )}`
            )
          ));
      }
    },
    /**
     * 重试
     */
    retry(e) {
      if (this.authFail) {
        window.removeEventListener('touchstart', this.retry);
        //授权失败，轻触重试
        let link = document.createElement('a');
        link.href = `/#/oauth?redirectUri=${encodeURIComponent(
          decodeURIComponent(this.query.redirectUri)
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
  color: rgb(192, 204, 218);
  top: 35%;
  position: fixed;
  p {
    margin-top: 20px;
  }
}
</style>
