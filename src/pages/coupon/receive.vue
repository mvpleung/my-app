/*
 * 领取优惠券
 * @Author: liangzc 
 * @Date: 2018-03-02 09:33:01 
 * @Last Modified by: liangzc
 * @Last Modified time: 2018-03-05 15:40:56
 */
<template>
  <div class="page-container">
    <span v-show="receiveFail !== null && !receiveFail && !redirect"
      class="mint-field-state is-success">
      <i class="mintui mintui-field-success" />
    </span>
    <span v-show="receiveFail !== null && receiveFail && !redirect"
      class="mint-field-state is-error">
      <i class="mintui mintui-field-error" />
    </span>
    <mt-spinner v-show="loading || redirect"
      type="triple-bounce"
      :size="60" />
    <p class="font16"
      v-show="loading">领取中...</p>
    <p class="font16"
      v-show="receiveFail">领取失败，请重试</p>
    <p v-show="receiveFail">
      <span class="font12">{{ errorMsg }}</span>
    </p>
    <p v-show="!receiveFail">
      <span class="font16">领取成功，即将跳转...({{ timeout }})</span>
    </p>
  </div>
</template>
<script>
export default {
  data() {
    return {
      query: {},
      errorMsg: '',
      timeout: 3,
      redirect: false,
      loading: false,
      receiveFail: null //领取失败
    };
  },
  created() {
    document.setTitle('领取中...');
    this.query = this.$utils.getUrlVars(location.hash);
    this.receive();
  },
  methods: {
    /**
     * 领取优惠券
     */
    receive() {
      this.loading = true;
      const { id_type: idType, id, mobile } = this.$store.getters.user;
      this.axios
        .get(
          // type (1-静态二维码; 2-动态二维码)
          this.query.type === '2' ?
            'v1/phtons/usersReleaseDiscountDynamic' :
            'v1/phtons/usersReleaseDiscount',
          {
            params: { ...this.query, id, idType, mobile },
            errorHandle: true
          }
        )
        .then(resp => {
          this.loading = false;
          this.errorMsg = '';
          this.receiveFail = false;
          let interval = setInterval(() => {
            if (this.timeout > 0) {
              this.timeout--;
            } else {
              clearInterval(interval);
              this.redirect = true;
              setTimeout(() => this.$router.replace('index'), 2000);
            }
          }, 1000);
        })
        .catch(error => {
          this.loading = false;
          this.receiveFail = true;
          this.errorMsg = error.message;
        });
    }
  }
};
</script>
<style lang="scss" scoped>
.page-container {
  width: 100%;
  font-size: 22px;
  text-align: center;
  color: black;
  top: 20%;
  position: fixed;
  .mint-field-state {
    margin-left: 0;
    i {
      font-size: 50px;
    }
  }
  p {
    margin-top: 20px;
  }
}
</style>
