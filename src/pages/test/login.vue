/*
 * 模拟登录
 * @Author: liangzc 
 * @Date: 2018-02-06 14:39:44 
 * @Last Modified by: liangzc
 * @Last Modified time: 2018-03-22 10:40:35
 */
<template>
  <div class="login-test">
    <div class="page-container">
      <mt-field label="头像"
        placeholder="请输入头像地址"
        v-verify="{rule: 'required', error:['请输入头像地址'],blur: false}"
        v-model="userInfo.avatar" />
      <mt-field label="openid/userid"
        placeholder="请输入openid/userid"
        v-verify="{rule: 'required', error:['请输入openid/userid'],blur: false}"
        v-model="userInfo.id" />
      <mt-field label="昵称"
        placeholder="请输入昵称"
        v-verify="{rule: 'required', error:['请输入昵称'],blur: false}"
        v-model="userInfo.nick_name" />
      <mt-field label="手机号"
        placeholder="请输入手机"
        type="tel"
        :attr="{maxlength:11}"
        v-verify="{rule: 'phone', blur: false}"
        v-model="userInfo.mobile" />
    </div>
    <div class="page-bottom-area">
      <mt-button class="loginButton"
        type="primary"
        size="large"
        @click="next">确定</mt-button>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
export default {
  data() {
    return {
      exp: 60 * 60 * 24,
      userInfo: Object.assign({}, this.$store.getters.user)
    };
  },
  verify: {
    phone: [
      {
        test: 'required',
        message: '手机号码不能为空'
      },
      'mobile'
    ]
  },
  created() {
    document.setTitle('模拟登录');
    if (this.$utils.isEmptyObject(this.userInfo)) {
      let userInfo = JSON.parse(
        this.$utils.deCipher(
          '5ed7106b1f65154cb847a26b07b145981ac70e80a2b9bdd8dbd9713b9630bb1d93bce9ccdd960640e244f85875878cdfcbdbc82763106996e85d9cbaa514433ed164b4ff1fcd9453f88916e084af779892656d50da5bf1cd4ae5b6a9977187606abaa044abfb8e97140dfe69e362c6f76cc1207d076f6dd29119446cdf73896d5ceebc7208ac4a716d457c46b607a0515d4546ddfc3a17128c89968dea90a1e3f88e2e9967ff216f01cc8719293ea2472376cce2e40aaf959814bde30eeb69dee48d5a67cc55d633720b121bb1ad541a9f6c9ab5c4240833e7391929aebafac7cd876bd2a41080dff04df9e1e3e2b818a47d5cb65a9872a706b232bff92385de9db5a175893632e04e70253d4476d4495e16d36456d78c6173cacd727e65eca8d910d6b94b3fc3d87e8c8e87c8356c44'
        )
      );
      userInfo.time = Date.now();
      this.$utils.setLocalItem('ht_u_info', userInfo, {
        exp: 60 * 60 * 24 * 7,
        needCipher: true
      });
      this.updateUser(userInfo.data);
    }
  },
  watch: {
    '$store.getters.user': {
      handler(val, oldVal) {
        this.userInfo = Object.assign({}, val);
      },
      deep: true
    }
  },
  methods: {
    /**
     * 下一步
     */
    next() {
      if (this.$verify.check()) {
        this.updateUser(this.userInfo);
        if (this.$route.query.redirect) {
          this.$router.replace(this.$route.query.redirect);
        } else {
          this.$router.go(-1);
        }
        this.$bus.emit('bindSuccess', this.phone);
      }
    },
    ...mapActions(['updateUser'])
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
.login-test {
  padding-top: 20px;
  .page-container {
    .mint-field {
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
}
</style>