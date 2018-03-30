/*
 * 优惠券
 * @Author: liangzc 
 * @Date: 2018-02-05 09:55:36 
 * @Last Modified by: liangzc
 * @Last Modified time: 2018-03-28 17:26:26
 */
<template>
  <div class="coupon-index">
    <div class="page-header">
      <swipe :items="bannerData" />
    </div>
    <div class="page-container">
      <mt-cell v-for="(coupon, index) in couponList"
        :key="index"
        to="/pay/parking"
        class="mint-cell--large">
        <template slot="title">
          <span class="mint-cell-text">{{ coupon.discountName }}</span>
          <span class="mint-cell-label">
            {{ coupon.discountTimes }}
          </span>
          <span class="mint-cell-label">
            有效期至：{{ $utils.formatDateTime(coupon.endTime) }}
          </span>
        </template>
        <span class="mint-cell-value--primary">
          {{ Number(coupon.cashDiscount || '0')/100 }}元
        </span>
        <span class="mint-cell-value--link">去使用>></span>
      </mt-cell>
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
          imgUrl: require('@/assets/banner_ex.png')
        }
      ],
      couponList: []
    };
  },
  created() {
    document.setTitle('优惠券');
    this.getCouponList();
  },
  methods: {
    getCouponList() {
      const { id_type: idType, id } = this.$store.getters.user;
      this.axios('v1/phtons/getUserDiscountList', {
        params: { idType, id }
      }).then(resp => (this.couponList = (resp.result_data || {}).datas || []));
    }
  },
  components: {
    Swipe
  }
};
</script>
<style lang="scss">
.coupon-index {
  .page-container {
    .mint-cell--large {
      .mint-cell-value {
        display: block;
        text-align: right;
        .mint-cell-value--primary {
          display: block;
          margin-bottom: 10px;
          color: rgb(255, 76, 83);
        }
        .mint-cell-value--link {
          color: #6d6df3;
          font-size: 13px;
        }
      }
    }
  }
}
</style>



