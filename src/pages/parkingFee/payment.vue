/*
 * 停车缴费
 * @Author: liangzc 
 * @Date: 2018-02-05 09:55:36 
 * @Last Modified by: liangzc
 * @Last Modified time: 2018-02-09 15:20:43
 */
<template>
  <div class="parking-fee">
    <div class="page-header">
      <swipe :bannerData="bannerData" />
      <h3 class="page-header-title">金运世纪大厦停车场</h3>
    </div>
    <div class="page-container">
      <mt-cell title="车牌号"
        value="粤B12345" />
      <mt-cell title="进场时间"
        value="2018/01/19 14：20" />
      <mt-cell title="停车时长"
        value="20分钟" />
      <mt-cell class="mint-cell--redvalue"
        title="停车费"
        value="4.50元" />
      <mt-cell title="停车优惠"
        value="VIP9折"
        is-link
        @click.native="$refs.couponPicker.open()" />
      <mt-cell title="电子服务费(5%)"
        value="0.50元" />
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
      <data-picker ref="couponPicker"
        :slots="coupons" />
      <data-picker ref="payTypePicker"
        :slots="payTypes" />
    </div>
  </div>
</template>
<script>
import { Swipe, DataPicker } from '@/components';
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
      coupons: [
        {
          values: ['VIP9折', '优惠券A', '优惠券B', '优惠券C']
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
    document.setTitle('停车缴费');
  },
  methods: {},
  components: {
    Swipe,
    DataPicker
  }
};
</script>
<style lang="scss" scoped>

</style>


