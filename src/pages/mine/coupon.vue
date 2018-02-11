/*
 * 优惠券
 * @Author: liangzc 
 * @Date: 2018-02-05 09:55:36 
 * @Last Modified by: liangzc
 * @Last Modified time: 2018-02-09 15:20:21
 */
<template>
  <div class="coupon-mine">
    <div class="page-header">
      <swipe :bannerData="bannerData" />
    </div>
    <div v-for="(coupon, index) in couponList"
      :key="index"
      class="page-container">
      <mt-cell title="优惠券1"
        label="2018-02-01 之前使用"
        value="￥1"
        class="mint-cell--largetitle" />
    </div>
  </div>
</template>
<script>
import { Swipe } from '@/components';
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
      couponList: [{}, {}]
    };
  },
  created() {
    document.setTitle('优惠券');
  },
  components: {
    Swipe
  }
};
</script>
<style lang="scss">
.coupon-mine {
  .page-container {
    .mint-cell--largetitle {
      .mint-cell-wrapper {
        margin: 5px 0;
        .mint-cell-value {
          span {
            color: rgb(255, 76, 83);
          }
        }
      }
    }
  }
}
</style>



