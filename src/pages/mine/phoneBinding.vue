/*
 * 绑定手机号
 * @Author: liangzc 
 * @Date: 2018-02-06 14:39:44 
 * @Last Modified by: liangzc
 * @Last Modified time: 2018-02-27 11:41:09
 */
<template>
  <div class="phone-binding">
    <div class="phone_container">
      <div class="phone_container_shouji">
        <i class="iconfont icon-shouji" />
        <input type="tel"
          v-model="phone"
          v-verify="phone"
          maxlength="11">
      </div>
      <div class="phone_container_jianpan">
        <i class="iconfont icon-jianpan" />
        <input type="tel"
          v-model="identifyingCode"
          v-verify="identifyingCode"
          maxlength="4">
        <button :disabled="!verificationDisabled || time > 0"
          @click.stop.prevent="getVerification">{{ verification }}</button>
      </div>
    </div>
    <div class="phone_footer">
      <div class="phone_footer_agreement">
        点击注册，即表示您同意
        <router-link to="#">用户协议</router-link>
      </div>
      <mt-button class="registerButton"
        type="primary"
        size="large"
        :disabled="registerDisabled"
        @click="next">下一步</mt-button>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
export default {
  data() {
    return {
      phone: '',
      time: 0,
      identifyingCode: ''
    };
  },
  verify: {
    phone: [
      {
        test: 'required',
        message: '手机号码不能为空'
      },
      'mobile'
    ],
    identifyingCode: [
      {
        test: 'required',
        message: '验证码不能为空'
      },
      {
        test: /^(\+|-)?\d+($|\.\d+$)/,
        message: '请正确输入验证码'
      },
      {
        minLength: 4
      }
    ]
  },
  created() {
    document.setTitle('绑定手机');
  },
  computed: {
    verification() {
      return this.time > 0 ? this.time + 's后重新获取' : '获取验证码';
    },
    verificationDisabled() {
      return this.$verify.validate('phone', true);
    },
    registerDisabled() {
      return !(
        this.verificationDisabled &&
        this.$verify.validate('identifyingCode', true)
      );
    }
  },
  methods: {
    /**
     * 倒计时
     */
    timer() {
      if (this.time > 0) {
        this.time--;
        setTimeout(this.timer, 1000);
      }
    },
    /**
     * 获取验证码
     */
    getVerification() {
      this.axios
        .post('', {
          phone: this.phone
        })
        .then(resp => {
          this.time = 60;
          this.timer();
        })
        .catch(err => {
          console.error(err);
        });
    },
    /**
     * 下一步
     */
    next() {
      if (this.$verify.check()) {
        let userInfo = this.$store.getters.user;
        userInfo.phone = this.phone;
        this.updateUser(userInfo);
        this.$router.replace({
          path: this.$route.query.redirect ?
            this.$route.query.redirect :
            '/homePage'
        });
      }
    },
    ...mapActions(['updateUser'])
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.phone-binding {
  padding-top: 20px;
  .phone_container {
    padding: 10px;
    input {
      border: none;
      /*border-left: 1px solid grey;*/
      margin-left: 10px;
    }
    input:focus {
      outline: none;
    }
    .phone_container_shouji {
      padding: 10px;
      border-bottom: 1px solid rgb(245, 246, 245);
      .icon-shouji {
        font-size: 20px;
      }
      input {
        width: 80%;
      }
    }
    .phone_container_jianpan {
      padding: 10px;
      border-bottom: 1px solid rgb(245, 246, 245);
      .icon-jianpan {
        font-size: 20px;
      }
      button {
        color: rgb(251, 0, 0);
        border: none;
        background-color: inherit;
        float: right;
      }
      button:disabled {
        color: rgba(251, 0, 0, 0.5);
      }
    }
  }
  .phone_footer {
    padding: 15px;
    .phone_footer_agreement {
      text-align: center;
      font-size: 12px;
      color: grey;
      a {
        color: rgb(251, 0, 0);
        text-decoration: none;
      }
    }
    .mint-button {
      margin-top: 15px;
      background: rgb(251, 0, 0);
    }
    .mint-button:disabled {
      background: rgba(251, 0, 0, 0.5);
    }
  }
}
</style>