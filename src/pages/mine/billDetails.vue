/*
 * 账单明细
 * @Author: liangzc 
 * @Date: 2018-02-05 09:55:36 
 * @Last Modified by: liangzc
 * @Last Modified time: 2018-03-01 15:18:00
 */
<template>
  <div class="bill-details">
    <div class="page-header">
      <h3 class="page-header-title">金运世纪大厦停车场</h3>
      <h3 class="page-header-title">￥5</h3>
    </div>
    <div class="page-container">
      <mt-cell title="类别"
        value="停车缴费" />
      <mt-cell title="交易时间"
        value="2018/01/19 14：20" />
      <mt-cell title="支付方式"
        value="停车券" />
      <mt-cell title="交易单号"
        value="123131231313" />
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {};
  },
  created() {
    document.setTitle('账单明细');
  },
  methods: {}
};
</script>
<style lang="scss" scoped>
.bill-details {
  .page-header {
    margin-top: 20%;
    text-align: center;
  }
}
</style>


