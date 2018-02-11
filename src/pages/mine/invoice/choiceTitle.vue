/*
 * 选择发票抬头
 * @Author: liangzc 
 * @Date: 2018-02-05 09:55:36 
 * @Last Modified by: liangzc
 * @Last Modified time: 2018-02-09 15:16:18
 */
<template>
  <div class="invoice-title">
    <div class="page-header">
      <h3 class="page-header-title">请选择发票抬头</h3>
      <router-link class="page-header-link"
        to="titlelist">管理抬头>></router-link>
    </div>
    <div class="page-container">
      <mt-cell v-for="(monthly, index) in monthlyProducts"
        :key="index"
        title="张三"
        label="123@163.com"
        to="/mine/invoice/invoice"
        is-link
        class="mint-cell--largetitle" />
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
    document.setTitle('选择发票抬头');
  }
};
</script>
<style lang="scss" scoped>
.invoice-title {
  .page-header {
    width: 100%;
    display: inline-flex;
    margin-top: 20px;
    border-bottom: 1px solid #e8e8e8;
    .page-header-title {
      flex: 2.5;
    }
    .page-header-link {
      flex: 1;
      margin-right: 15px;
      padding: 15px 0;
    }
  }
  .mint-cell--largetitle {
    margin: 10px 0;
  }
}
</style>



