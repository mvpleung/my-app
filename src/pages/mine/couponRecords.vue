/*
 * 停车券购买记录
 * @Author: liangzc 
 * @Date: 2018-02-05 09:55:36 
 * @Last Modified by: liangzc
 * @Last Modified time: 2018-02-09 15:20:23
 */
<template>
  <div class="coupon-record">
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
      bills: [{}, {}]
    };
  },
  created() {
    document.setTitle('购买记录');
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



