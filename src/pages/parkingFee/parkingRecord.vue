/*
 * 停车记录
 * @Author: liangzc 
 * @Date: 2018-02-05 09:55:36 
 * @Last Modified by: liangzc
 * @Last Modified time: 2018-02-09 15:20:41
 */
<template>
  <div class="parking-record">
    <div v-for="(record, index) in records"
      :key="index"
      class="page-container">
      <mt-cell title="粤B123465"
        class="mint-cell--largetitle mint-cell--noborder" />
      <mt-cell title="停车场"
        value="金运世纪大厦停车场"
        class="mint-cell--noborder" />
      <mt-cell title="入场时间"
        value="2018/01/22 18：00"
        class="mint-cell--noborder" />
      <mt-cell title="出场时间"
        value="2018/01/22 19：00"
        class="mint-cell--noborder" />
      <mt-cell title="停车时长"
        value="1小时"
        class="mint-cell--noborder" />
      <mt-cell title="停车费用"
        value="￥25" />
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      records: [{}, {}]
    };
  },
  created() {
    document.setTitle('停车记录');
  }
};
</script>
<style lang="scss" scoped>
.parking-record {
  .page-container {
    .mint-cell {
      min-height: 30px;
    }
    .mint-cell:nth-child(6n) {
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
</style>



