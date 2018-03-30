/*
 * 发票
 * @Author: liangzc 
 * @Date: 2018-02-05 09:55:36 
 * @Last Modified by: liangzc
 * @Last Modified time: 2018-03-28 16:34:32
 */
<template>
  <div class="page-container">
    <mt-cell title="开具发票"
      to="/mine/invoice/order"
      is-link />
    <mt-cell title="开票记录"
      to="/mine/invoice/record"
      is-link />
  </div>
</template>
<script>
export default {
  data() {
    return {};
  },
  created() {
    document.setTitle('发票');
  }
};
</script>



