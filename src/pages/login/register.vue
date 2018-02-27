<template>
  <div class="register">
    <!-- <div class="register_logo">
			<img class="logo" src="../../assets/" />
		</div> -->
    <div class="register_container">
      <div class="register_container_shouji">
        <i class="iconfont icon-shouji"/>
        <input type="tel"
          name=""
          id=""
          value=""
          v-model="mobile"
          v-verify="mobile"
          maxlength="11" >
      </div>
      <div class="register_container_jianpan">
        <i class="iconfont icon-jianpan"/>
        <input type="tel"
          name=""
          id=""
          value=""
          v-model="identifyingCode"
          v-verify="identifyingCode"
          maxlength="4" >
        <button :disabled="!verificationDisabled || time > 0"
          @click.stop.prevent="getVerification">{{ verification }}</button>
      </div>
    </div>
    <div class="register_footer">
      <div class="register_footer_agreement">
        点击注册，即表示您同意
        <router-link to="/agreement">用户协议</router-link>
      </div>
      <mt-button class="registerButton"
        type="primary"
        size="large"
        :disabled="registerDisabled"
        @click="register">注册</mt-button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      mobile: '',
      time: 0,
      identifyingCode: '',
      openId: ''
    };
  },
  verify: {
    mobile: [
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
  computed: {
    verification() {
      return this.time > 0 ? this.time + 's后重新获取' : '获取验证码';
    },
    verificationDisabled() {
      return this.$verify.validate('mobile', true);
    },
    registerDisabled() {
      return !(
        this.verificationDisabled &&
        this.$verify.validate('identifyingCode', true)
      );
    }
  },
  created() {
    this.openId = this.$store.getters.openId;
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
        .post('/invite/sendMessage.do', {
          mobile: this.mobile
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
     * 注册
     */
    register() {
      if (this.$verify.check()) {
        this.axios
          .post('/invite/register.do', {
            mobile: this.mobile,
            identifyingCode: this.identifyingCode,
            openId: this.openId,
            model: this.$store.getters.model
          })
          .then(resp => {
            this.$router.replace({
              path: this.$route.query.redirect ?
                this.$route.query.redirect :
                '/homePage'
            });
          })
          .catch(err => {
            console.error(err);
          });
      }
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.register {
  padding-top: 20px;
  .register_logo {
    width: 200px;
    margin: 80px auto;
    .logo {
      width: 100%;
    }
  }
  .register_container {
    padding: 10px;
    input {
      border: none;
      /*border-left: 1px solid grey;*/
      margin-left: 10px;
    }
    input:focus {
      outline: none;
    }
    .register_container_shouji {
      padding: 10px;
      border-bottom: 1px solid rgb(245, 246, 245);
      .icon-shouji {
        font-size: 20px;
      }
      input {
        width: 80%;
      }
    }
    .register_container_jianpan {
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
  .register_footer {
    padding: 15px;
    .register_footer_agreement {
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
    }
    /*.center-link {
				margin-top:10px;
				text-align:center;
			}*/
    .registerButton {
      background: rgb(251, 0, 0);
    }
    .registerButton:disabled {
      background: rgba(251, 0, 0, 0.5);
    }
  }
}
</style>