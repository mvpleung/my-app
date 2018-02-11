/*
 * 账单
 * @Author: liangzc 
 * @Date: 2018-02-05 09:55:36 
 * @Last Modified by: liangzc
 * @Last Modified time: 2018-02-09 15:20:13
 */
<template>
  <div class="bill-mine">
    <div class="page-container">
      <mt-cell v-for="(bill, index) in bills"
        :key="index"
        title="停车缴费"
        label="2018/01/19 14：20"
        value="￥1"
        to="/mine/billDetails"
        is-link
        class="mint-cell--largetitle" />
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
    document.setTitle('账单');
  }
};
</script>
<style lang="scss" scoped>
.bill-mine {
  .page-container {
    .mint-cell--largetitle {
      margin: 10px 0;
    }
  }
}
</style>



