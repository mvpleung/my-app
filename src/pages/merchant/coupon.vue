/*
 * 商户优惠券列表
 * @Author: liangzc 
 * @Date: 2018-02-05 09:55:36 
 * @Last Modified by: liangzc
 * @Last Modified time: 2018-03-15 11:39:39
 */
<template>
  <div class="merchant-coupon">
    <div class="page-container">
      <mt-cell class="mint-cell--large"
        v-for="(coupon, index) in couponList"
        :key="index"
        @click.native="grantCoupon(coupon)">
        <template slot="title">
          <span class="mint-cell-text">{{ coupon.discountName }}</span>
          <span class="mint-cell-label">
            {{ coupon.discountTimes }}
          </span>
          <span class="mint-cell-label">
            有效期至：{{ $utils.formatDateTime(coupon.endTime) }}
          </span>
        </template>
        <template>
          <span class="mint-cell-value--link">去发放>></span>
          <span class="mint-cell-label">
            可用:
            <font color="green">
              {{ coupon.releaseQuantity - coupon.giveOutQuantity }}
            </font>/{{ coupon.releaseQuantity }}
          </span>
        </template>
      </mt-cell>
    </div>
    <mt-popup v-model="qrCodeVisible"
      position="bottom">
      <div id="qrcode" />
      <span>{{ selectedCoupon? selectedCoupon.discountName : '' }}</span>
    </mt-popup>
  </div>
</template>
<script>
import QRCode from 'qrcode-lib';
export default {
  data() {
    return {
      couponList: [], //优惠券列表
      selectedCoupon: null, //当前选中得优惠券
      qrcode: null,
      qrCodeVisible: false
    };
  },
  created() {
    document.setTitle('优惠券-商户登录');
    this.getCouponList();
  },
  watch: {
    qrCodeVisible(val) {
      if (!val && this.qrcode) {
        this.qrcode.clear();
        this.selectedCoupon = null;
      }
    }
  },
  methods: {
    /**
     * 获取商户优惠券列表
     */
    getCouponList() {
      this.axios
        .get('v1/phtons/couponList', {
          params: { token: this.$route.params.token }
        })
        .then(resp => (this.couponList = (resp.result_data || {}).datas || []));
    },
    /**
     * 发放优惠券
     * @param {Object} coupon 优惠券
     */
    grantCoupon(coupon) {
      this.axios
        .get('v1/phtons/genQRCode', {
          params: {
            groupId: this.$route.params.groupId,
            releaseId: coupon.id,
            state: $globalConfig.navigator.ua,
            type: '2'
          }
        })
        .then(resp => {
          this.selectedCoupon = coupon;
          this.qrCodeVisible = true;
          if (!this.qrcode) {
            this.qrcode = new QRCode('qrcode', {
              text: resp.url,
              width: 200,
              height: 200,
              colorDark: '#000000',
              colorLight: '#ffffff',
              correctLevel: QRCode.CorrectLevel.H
            });
          } else {
            this.qrcode.makeCode(resp.url); // make another code.
          }
        });
    }
  }
};
</script>
<style lang="scss">
.merchant-coupon {
  .page-container {
    .mint-cell--large {
      .mint-cell-value {
        display: block;
        text-align: right;
        .mint-cell-value--link {
          color: #6d6df3;
          font-size: 13px;
        }
      }
    }
  }
  .mint-popup-bottom {
    z-index: 2005;
    width: 100%;
    text-align: center;
    height: 70%;
    #qrcode {
      padding-top: 10%;
      margin-bottom: 15px;
      img {
        margin: 0 auto;
      }
    }
  }
}
</style>



