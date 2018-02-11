/*
 * 车辆缴费记录
 * @Author: liangzc 
 * @Date: 2018-02-05 09:55:36 
 * @Last Modified by: liangzc
 * @Last Modified time: 2018-02-09 15:20:48
 */
<template>
  <div>
    <div class="page-container">
      <mt-cell title="最近停缴记录" />
      <mt-cell v-for="(record, index) in records"
        :key="index"
        :title="record.vehicleNumber"
        to="/parkingFee"
        is-link />
    </div>
    <div class="page-bottom-area">
      <mt-button size="large"
        type="primary"
        @click.native="$router.push('vehicleInput')">其他车牌缴费</mt-button>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      records: [
        {
          vehicleNumber: '粤B12345'
        },
        {
          vehicleNumber: '粤B12345'
        },
        {
          vehicleNumber: '粤B12345'
        }
      ]
    };
  },
  created() {
    document.setTitle('选择缴费车辆');
  }
};
</script>



