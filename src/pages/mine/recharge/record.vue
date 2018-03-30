/*
 * 余额充值记录
 * @Author: liangzc 
 * @Date: 2018-02-05 09:55:36 
 * @Last Modified by: liangzc
 * @Last Modified time: 2018-03-15 09:57:50
 */
<template>
  <me-scroll ref="mescroll"
    class="recharge-record page-container"
    :opt-up="{ empty: { tip: '暂无充值记录' }}"
    :opt-down="{autoShowLoading:true}"
    :up-callback="() => getRechargeRecord(queryParams.currentPage+1)"
    :down-callback="() => getRechargeRecord(1)">
    <mt-cell v-for="(bill, index) in bills"
      :key="index"
      class="mint-cell--large">
      <template slot="title">
        <span class="mint-cell-text">{{ bill.reChargeTime }}</span>
        <span class="mint-cell-label">
          充值金额：{{ (bill.reChargeMoney /100).toFixed(2) }}元
        </span>
        <span class="mint-cell-label">
          赠送金额：{{ (bill.giveMoney /100).toFixed(2) }}元
        </span>
      </template>
    </mt-cell>
  </me-scroll>
</template>
<script>
import Mescroll from 'vue-mescroll/mescroll';
export default {
  data() {
    return {
      queryParams: {
        phone: this.$store.getters.user.mobile,
        currentPage: 0,
        pageSize: 20
      },
      bills: []
    };
  },
  created() {
    document.setTitle('余额充值记录');
  },
  methods: {
    /**
     * 根据手机号码获取充值记录
     * @param {Number} currentPage 当前页码
     */
    getRechargeRecord(currentPage) {
      this.queryParams.currentPage = currentPage || 1;
      this.axios
        .get('v1/phtons/rechargeRecord', {
          params: this.queryParams,
          silence: true
        })
        .then(resp => {
          let { datas, datasCount } = resp.result_data || {};
          datas = datas || [];
          if (this.queryParams.currentPage <= 1) {
            this.bills = datas;
          } else {
            this.bills = this.bills.concat(datas);
          }
          this.$refs.mescroll.instance.endBySize(datas.length, datasCount);
        })
        .catch(err => {
          this.$toast(err.message);
          this.$refs.mescroll.instance.endBySize(0);
          this.$refs.mescroll.instance.endErr();
        });
    }
  },
  components: {
    'me-scroll': Mescroll
  }
};
</script>
<style lang="scss" scoped>
.recharge-record {
  &.page-container {
    .mint-cell:first-child {
      border-top: none;
    }
  }
}
</style>



