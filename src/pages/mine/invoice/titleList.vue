/*
 * 管理发票抬头
 * @Author: liangzc 
 * @Date: 2018-02-05 09:55:36 
 * @Last Modified by: liangzc
 * @Last Modified time: 2018-02-09 15:20:09
 */
<template>
  <div class="title-list">
    <div v-for="(monthly, index) in monthlyProducts"
      :key="index"
      class="page-container">
      <mt-cell title="张三"
        label="123@163.com"
        class="mint-cell--largetitle mint-cell--noborder" />
      <mt-cell>
        <router-link to="edittitle">编辑</router-link>
        <router-link to="#">删除</router-link>
      </mt-cell>
    </div>
    <div class="page-bottom-area">
      <mt-button size="large"
        type="primary"
        @click.native="$router.push('edittitle')">新增发票抬头</mt-button>
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
<style lang="scss" scoped>
.title-list {
  .page-container {
    .mint-cell {
      min-height: 30px;
      a:first-child {
        margin-right: 15px;
      }
    }
    .mint-cell--largetitle {
      margin: 10px 0;
    }
  }
}
</style>



