/*
 * 开票记录
 * @Author: liangzc 
 * @Date: 2018-02-05 09:55:36 
 * @Last Modified by: liangzc
 * @Last Modified time: 2018-02-09 15:20:08
 */
<template>
  <div class="title-list">
    <div v-for="(monthly, index) in monthlyProducts"
      :key="index"
      class="page-container">
      <mt-cell class="mint-cell--largetitle"
        value="￥27.5"
        to="/mine/invoice/recorddetails"
        is-link>
        <template slot="title">
          <span class="mint-cell-text">2018-01-02 12:23</span>
          <span class="mint-cell-label">电子发票</span>
          <span class="mint-cell-label">优惠券</span>
        </template>
      </mt-cell>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      monthlyProducts: [{}, {}]
    };
  },
  created() {
    document.setTitle('管理发票抬头');
  }
};
</script>
<style lang="scss">
.title-list {
  .page-container {
    .mint-cell {
      .mint-cell-wrapper {
        padding: 10px;
      }
    }
  }
}
</style>



