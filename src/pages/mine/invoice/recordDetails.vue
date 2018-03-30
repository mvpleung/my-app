/*
 * 开票记录详情
 * @Author: liangzc 
 * @Date: 2018-02-07 17:58:31 
 * @Last Modified by: liangzc
 * @Last Modified time: 2018-03-05 10:26:05
 */
<template>
  <div class="record-details">
    <div class="page-header">
      <mt-cell title="电子发票已开票"
        label="2018-01-02 12:23"
        value="查看"
        is-link />
    </div>
    <div class="page-container">
      <mt-cell title="发票信息" />
      <mt-cell title="抬头名称"
        value="深圳智人数据有限公司" />
      <mt-cell title="企业税号"
        value="7894654513" />
      <mt-cell title="电子邮箱"
        value="123@163.com" />
      <mt-cell title="联系电话"
        value="0755-12345678" />
      <mt-cell title="订单信息" />
      <div v-for="(order, index) in orders"
        :key="index"
        class="page-container-order">
        <mt-cell title="停车缴费"
          class="mint-cell--noborder" />
        <mt-cell title="交易金额"
          value="￥35"
          class="mint-cell--noborder" />
        <mt-cell title="交易时间"
          value="2018/01/22 18：00"
          class="mint-cell--noborder" />
        <mt-cell title="支付方式"
          value="微信支付"
          class="mint-cell--noborder" />
        <mt-cell title="交易单号"
          value="123213213"
          class="mint-cell--noborder" />
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      orders: [{}, {}]
    };
  },
  created() {
    document.setTitle('发票详情');
  }
};
</script>
<style lang="scss" scoped>
.record-details {
  .page-container {
    .mint-cell:first-child:not(.mint-cell--noborder),
    .mint-cell:nth-child(6) {
      background: #e0dddd29;
    }
    .page-container-order {
      border-bottom: 1px solid #e8e8e8;
      .mint-cell {
        min-height: 30px;
      }
    }
  }
}
</style>


