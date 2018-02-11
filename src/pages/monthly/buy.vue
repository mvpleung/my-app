/*
 * 购买包月产品
 * @Author: liangzc 
 * @Date: 2018-02-05 09:55:36 
 * @Last Modified by: liangzc
 * @Last Modified time: 2018-02-09 15:20:33
 */
<template>
  <div class="stagger-buy">
    <div class="page-header">
      <swipe :bannerData="bannerData" />
      <h3 class="page-header-title">金运世纪大厦停车场</h3>
    </div>
    <div class="page-container">
      <mt-cell title="车牌号"
        value="粤B12345" />
      <mt-cell title="收费标准"
        value="200元/30天" />
      <mt-cell title="开始日期"
        value="2018-02-12"
        is-link
        @click.native="$refs.startTimePicker.open()" />
      <mt-cell title="结束日期"
        value="2018-02-12"
        is-link
        @click.native="$refs.endTimePicker.open()" />
      <mt-cell title="支付方式"
        value="微信支付"
        is-link
        @click.native="$refs.payTypePicker.open()" />
    </div>
    <div class="page-bottom">
      <div class="page-bottom-left">
        实付：0.5元
      </div>
      <div class="page-bottom-right">
        立即支付
      </div>
      <data-picker ref="payTypePicker"
        :slots="payTypes" />
      <datetime-picker ref="startTimePicker" />
      <datetime-picker ref="endTimePicker" />
    </div>
  </div>
</template>
<script>
import { Swipe, DataPicker, DateTimePicker } from '@/components';
export default {
  data() {
    return {
      bannerData: [
        {
          imgUrl: require('@/assets/banner.png')
        },
        {
          imgUrl: require('@/assets/banner1.png')
        }
      ],
      payTypes: [
        {
          values: ['余额(40元)', '微信支付']
        }
      ]
    };
  },
  created() {
    document.setTitle('购买包月产品');
  },
  methods: {},
  components: {
    Swipe,
    DataPicker,
    'datetime-picker': DateTimePicker
  }
};
</script>
<style lang="scss" scoped>

</style>


