/*
 * 编辑发票抬头
 * @Author: liangzc 
 * @Date: 2018-02-07 17:58:31 
 * @Last Modified by: liangzc
 * @Last Modified time: 2018-02-09 15:19:55
 */
<template>
  <div class="edit-title">
    <div class="page-header">
      <mt-radio v-model="titleType"
        :options="[{label: '个人', value: '1'}, {label: '单位', value: '2'}]" />
    </div>
    <div class="page-container">
      <mt-field label="抬头名称"
        placeholder="请输入抬头名称" />
      <mt-field v-if="titleType === '2'"
        label="企业税号"
        placeholder="请输入企业税号" />
      <mt-field label="电子邮箱"
        placeholder="请输入电子邮箱" />
      <mt-field label="联系电话"
        placeholder="请输入联系电话" />
    </div>
    <div class="page-bottom-area">
      <mt-button size="large"
        type="primary"
        @click.native="$router.go(-1)">保存</mt-button>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      titleType: '1'
    };
  }
};
</script>
<style lang="scss" scoped>
.edit-title {
  .page-header {
    text-align: center;
    padding: 15px 0;
    border-bottom: 1px solid #e8e8e8;
    .mint-radiolist {
      display: inline-flex;
      .mint-cell {
        .mint-cell-wrapper {
          border-bottom: none;
        }
      }
    }
  }
}
</style>


