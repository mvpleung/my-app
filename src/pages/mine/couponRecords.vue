/*
 * 停车券购买记录
 * @Author: liangzc 
 * @Date: 2018-02-05 09:55:36 
 * @Last Modified by: liangzc
 * @Last Modified time: 2018-02-27 10:39:27
 */
<template>
  <div class="coupon-record"
    v-infinite-scroll="() => getRechargeRecord(params.currentPage++)"
    :infinite-scroll-disabled="hasMore"
    infinite-scroll-distance="50">
    <div v-for="(bill, index) in bills"
      :key="index"
      class="page-container"
      @click="$router.push('billDetails')">
      <mt-cell title="2018-01-12"
        class="mint-cell--noborder" />
      <mt-cell title="停车券面额：100元"
        class="mint-cell--noborder" />
      <mt-cell title="赠送金额：15元" />
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      params: {
        phone: this.$store.getters.user.phone,
        currentPage: 1,
        pageSize: 10
      },
      hasMore: true, //是否还有更多
      bills: [{}, {}]
    };
  },
  created() {
    document.setTitle('购买记录');
  },
  methods: {
    /**
     * 根据手机号码获取充值记录
     * @param {Number} currentPage 当前页码
     */
    getRechargeRecord(currentPage) {
      this.params.currentPage = currentPage || 1;
      this.axios
        .get('v1/', {
          params: this.params
        })
        .then(resp => {
          let resultData = resp.result_data || {};
          if (this.params.currentPage <= 1) {
            this.bills = resultData.datas;
          } else {
            this.bills = this.bills.concat(resultData.datas);
          }
          this.hasMore = resultData.datasCount >= this.params.pageSize;
        });
    }
  }
};
</script>
<style lang="scss">
.coupon-record {
  .page-container {
    .mint-cell {
      min-height: 30px;
    }
    .mint-cell:nth-child(3n) {
      .mint-cell-wrapper {
        padding-bottom: 10px;
      }
    }
  }
  .page-container:nth-child(2n) {
    margin: 5px 0;
  }
}
</style>



