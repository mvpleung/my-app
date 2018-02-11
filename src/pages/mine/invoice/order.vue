/*
 * 可开具发票订单
 * @Author: liangzc 
 * @Date: 2018-02-05 09:55:36 
 * @Last Modified by: liangzc
 * @Last Modified time: 2018-02-09 15:20:04
 */
<template>
  <div class="invoice-order">
    <div class="page-header">
      <h3 class="page-header-title">可开具发票订单</h3>
    </div>
    <div v-for="(order, index) in orders"
      :key="index"
      class="page-container">
      <label class="mint-checkbox">
        <input type="checkbox"
          class="mint-checkbox-input"
          :value="index">
        <span class="mint-checkbox-core" />
      </label>
      <div class="page-container-order">
        <mt-cell title="停车缴费"
          class="mint-cell--largetitle mint-cell--noborder" />
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
    <div class="page-bottom">
      <div class="page-bottom-left">
        <label class="mint-checkbox">
          <input type="checkbox"
            class="mint-checkbox-input"
            value="1">
          <span class="mint-checkbox-core" />
          <span class="mint-checkbox-label">全选</span>
        </label>
      </div>
      <div class="page-bottom-right"
        @click="$router.push('choicetitle')">
        下一步
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
    document.setTitle('可开具发票订单');
  }
};
</script>
<style lang="scss" scoped>
.invoice-order {
  .page-header {
    border-bottom: 1px solid #e8e8e8;
  }
  .page-container {
    width: 100%;
    display: inline-flex;
    border-bottom: 1px solid #e8e8e8;
    .mint-checkbox {
      line-height: 10;
      margin-left: 15px;
    }
    .page-container-order {
      flex: 1;
      margin: 0 5px;
      display: inline-block;
      .mint-cell {
        min-height: 30px;
      }
      .mint-cell:nth-child(5n) {
        min-height: 40px;
        .mint-cell-wrapper {
          padding-bottom: 10px;
        }
      }
      .mint-cell--largetitle {
        margin: 15px 0;
      }
    }
  }
  .page-bottom {
    .page-bottom-left {
      display: inline-block;
      text-align: left;
      padding-left: 15px;
    }
  }
}
</style>



