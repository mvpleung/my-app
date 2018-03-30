/*
 * 绑定手机号
 * @Author: liangzc 
 * @Date: 2018-02-06 14:39:44 
 * @Last Modified by: liangzc
 * @Last Modified time: 2018-03-16 16:37:44
 */
<template>
  <div class="phone-binding">
    <div class="page-container">
      <mt-field label="手机号"
        placeholder="请输入手机"
        type="tel"
        :attr="{maxlength:11}"
        v-verify="{rule: 'phone', blur: false}"
        v-model="phone" />
      <mt-field label="验证码"
        placeholder="请输入验证码"
        type="tel"
        v-verify="{rule: 'verificationCode', blur: false}"
        :attr="{ maxlength: 4 }"
        v-model="verificationCode">
        <button :disabled="!verificationDisabled || time > 0"
          @click.stop.prevent="getVerification">{{ verification }}</button>
      </mt-field>
    </div>
    <div class="page-bottom-area">
      <mt-button class="loginButton"
        type="primary"
        size="large"
        :disabled="registerDisabled"
        @click="next">绑定</mt-button>
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
      verificationCode: ''
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
    verificationCode: [
      {
        test: 'required',
        message: '验证码不能为空'
      },
      {
        test: 'integer',
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
        this.$verify.validate('verificationCode', true)
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
        .get('v1/phtons/verificationCode', {
          params: { phone: this.phone }
        })
        .then(resp => {
          this.time = 60;
          this.timer();
          this.$toast('验证码已发送到您的手机，请注意查收');
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
        const { id_type: idType, id } = this.$store.getters.user;
        this.axios
          .get('v1/phtons/bindMobile', {
            params: {
              phone: this.phone,
              verificationCode: this.verificationCode,
              idType,
              id
            }
          })
          .then(resp => {
            this.updateMobile(this.phone);
            if (this.$route.query.redirect) {
              this.$router.replace(this.$route.query.redirect);
            } else {
              this.$router.go(-1);
            }
            this.$bus.emit('bindSuccess', this.phone);
          });
      }
    },
    ...mapActions(['updateMobile'])
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
.phone-binding {
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
        button {
          outline: none;
          color: rgb(251, 0, 0);
          border: none;
          background-color: inherit;
          float: right;
          &:disabled {
            color: rgba(251, 0, 0, 0.5);
          }
        }
      }
    }
  }
}
</style>