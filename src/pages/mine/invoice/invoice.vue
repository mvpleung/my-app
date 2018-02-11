/*
 * 开具发票
 * @Author: liangzc 
 * @Date: 2018-02-05 09:55:36 
 * @Last Modified by: liangzc
 * @Last Modified time: 2018-02-09 15:20:02
 */
<template>
  <div class="stagger-buy">
    <div class="page-container">
      <mt-cell title="抬头名称"
        value="深圳智人数据有限公司" />
      <mt-cell title="企业税号"
        value="1231321321321321321" />
      <mt-cell title="电子邮箱"
        value="123@163.com" />
      <mt-cell title="联系电话"
        value="10755-12345678" />
      <mt-cell title="发票类型"
        value="电子发票" />
    </div>
    <div class="page-bottom-area">
      <mt-button type="primary"
        size="large">确定</mt-button>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {};
  },
  created() {
    document.setTitle('开具发票');
  },
  methods: {}
};
</script>
<style lang="scss" scoped>

</style>


