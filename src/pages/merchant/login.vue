/*
 * 商户登录
 * @Author: liangzc 
 * @Date: 2018-02-28 10:46:51 
 * @Last Modified by: liangzc
 * @Last Modified time: 2018-03-15 11:28:28
 */
<template>
  <div class="merchant-login">
    <div class="page-container">
      <mt-field label="用户名"
        placeholder="请输入用户名"
        v-verify="{rule: 'required', error: ['用户名不能为空']}"
        v-model="userName" />
      <mt-field label="密码"
        placeholder="请输入密码"
        type="password"
        v-verify="{rule: 'required', error: ['密码不能为空']}"
        v-model="password" />
    </div>
    <div class="page-bottom-area">
      <mt-button class="loginButton"
        type="primary"
        size="large"
        :disabled="loginDisabled"
        @click="login">登录</mt-button>
    </div>
  </div>
</template>

<script type="application/ecmascript">
export default {
  name: '',
  data() {
    return {
      userName: '',
      password: ''
    };
  },
  computed: {
    loginDisabled() {
      return !(
        this.$verify.validate('userName', true) &&
        this.$verify.validate('password', true)
      );
    }
  },
  methods: {
    login() {
      if (this.$verify.check()) {
        this.axios
          .get('v1/phtons/couponMerLogin', {
            params: {
              userName: this.userName,
              password: this.password
            }
          })
          .then(resp => {
            this.$router.replace(
              `/merchant/coupon/${resp.groupId}/${resp.token}`
            );
          });
      }
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
.merchant-login {
  padding-top: 20px;
  .page-container {
    .mint-cell-wrapper {
      padding-left: 20px;
      .mint-cell-value {
        .mint-field-core {
          text-align: left;
        }
      }
    }
  }
}
</style>