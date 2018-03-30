/*
 * 购买包月产品
 * @Author: liangzc 
 * @Date: 2018-02-05 09:55:36 
 * @Last Modified by: liangzc
 * @Last Modified time: 2018-03-28 17:47:11
 */
<template>
  <div class="monthly-buy">
    <div class="page-header">
      <h3 class="page-header-title">{{ productDetails.parkingName }}</h3>
      <span class="page-header-label">
        {{ productDetails.address }}{{ distanceDesc }}
      </span>
    </div>
    <div class="page-container">
      <vehicle-select ref="vehicleChoice"
        is-primary
        :disabled="productDetails.renew === 1"
        v-model="productDetails.plate" />
      <mt-cell title="停放位置"
        :value="productDetails.parkSpacesNum" />
      <mt-cell title="收费标准"
        class="mint-cell--primary"
        :value="
        `${productDetails.price||''}元/${productDetails.activeDays||''}天`" />
      <mt-cell title="开始日期"
        :value="params.startTime"
        is-link
        @click.native="$refs.datePicker.open()" />
      <mt-cell title="结束日期"
        :value="params.endTime" />
      <coupon-check v-model="checkedCoupon"
        :params="{parkCode:productDetails.parkingCode,productType: '2'}" />
    </div>
    <pay-type v-model="payType"
      :total-amount="totalFee" />
    <div class="page-container page-container--margin">
      <mt-cell class="mint-cell--large">
        <template slot="title">
          <span class="mint-cell-text">包月停车产品使用须知</span>
          <span class="mint-cell-label">
            1、用户成功购买包月产品并生效后，可在有效时间内任意进出相应停车场，无需另行缴费
          </span>
          <span class="mint-cell-label">
            2、用户须严格按照包月停车协议条款执行停车操作
          </span>
          <span class="mint-cell-label">
            3、用户须听从现场管理人员安排，遵守停车场规则，若因用户自身原因造成的自身或第三方损失，由用户自行承担
          </span>
          <span class="mint-cell-label">
            4、用户应在购买有效时间内进出停车场，停车场保留拒绝用户提前进场或超时停放的权利，特殊情况请与管理人员友好协商
          </span>
          <span class="mint-cell-label">
            5、若用户超时停放，出场时需要在收费处补齐超时部分停车费（费率以停放停车场收费标准为准）
          </span>
        </template>
      </mt-cell>
      <mt-cell class="mint-cell--large">
        <template slot="title">
          <span class="mint-cell-text">退款须知</span>
          <span class="mint-cell-label">
            1、包月产品生效后，即不支持退款
          </span>
          <span class="mint-cell-label">
            2、特殊原因造成的购买失败或使用不成功，则原路退款至支付账户，到账日期以支付渠道相关规定为准
          </span>
        </template>
      </mt-cell>
    </div>
    <div class="page-bottom-area">
      <mt-button type="primary"
        size="large"
        :disabled="$utils.isEmpty(productDetails.plate)"
        @click.native="pay">立即支付</mt-button>
    </div>
    <datetime-picker ref="datePicker"
      type="date"
      year-format="{value} 年"
      month-format="{value} 月"
      date-format="{value} 日"
      pattern="yyyy年MM月dd日"
      :start-date="new Date(productDetails.renewTime || Date.now())"
      :end-date="new Date(productDetails.endTime)"
      @confirm="dateComfirm" />
  </div>
</template>
<script>
import { DateTimePicker } from '@/components';
import PayType from '../components/pay-type';
import CouponCheck from '../components/coupon-check';
import VehicleSelect from '../components/vehicle-select';
export default {
  data() {
    return {
      accountInfo: this.$store.getters.account,
      productDetails: {}, //产品详情
      checkedCoupon: {}, //选中的优惠券
      payType: {}, //支付方式
      params: {
        startTime: '',
        endTime: ''
      }
    };
  },
  created() {
    document.setTitle('购买包月产品');
    this.init();
  },
  watch: {
    'params.startTime': {
      handler(val) {
        if (this.$utils.isEmpty(this.productDetails.activeDays)) return;
        let endDate = this.$utils.stepDays(val, this.productDetails.activeDays);
        endDate &&
          (this.params.endTime = this.$utils.compareDate(
            endDate,
            this.productDetails.endTime
          ) ?
            this.productDetails.endTime :
            endDate);
      },
      deep: true
    }
  },
  computed: {
    userInfo() {
      return this.$store.getters.user;
    },
    /**
     * 距离
     */
    distanceDesc() {
      return this.productDetails.distanceDesc ?
        `， 距您：${this.productDetails.distanceDesc}` :
        '';
    },
    /**
     * 总金额
     */
    totalFee() {
      let couponFee = this.checkedCoupon ?
        (this.checkedCoupon.cashDiscount || 0) / 100 :
        0;
      return (couponFee >= this.productDetails.price ?
        0 :
        this.productDetails.price - couponFee
      ).toFixed(2);
    }
  },
  methods: {
    init() {
      this.productDetails =
        this.$utils.getSessionItem('monthlyProduct', true) || {};
      this.params.startTime =
        this.productDetails.renewTime || new Date().Format('yyyy-MM-dd');
    },
    /**
     * 日期选择回调
     */
    dateComfirm(value) {
      this.params = {
        ...this.params,
        startTime: this.$utils.formatDateTime(value)
      };
    },
    /**
     * 立即支付
     */
    pay() {
      if (this.$utils.isEmptyObject(this.payType)) {
        this.$toast('请选择支付方式');
        return;
      }
      this.axios
        .get('v1/phtons/buyLongRent', {
          params: {
            idType: this.userInfo.id_type,
            id: this.userInfo.id,
            payChannel: this.payType.value,
            productId: this.productDetails.productId,
            plate: this.productDetails.plate,
            validFrom: this.params.startTime,
            couponId: this.checkedCoupon.id || ''
          },
          errorHandle: true
        })
        .then(resp => {
          const { params = {}, pay_order_amount } = resp || {};
          //仅余额支付存在 pay_result
          if (
            !params && pay_order_amount === 0 ||
            params.pay_result === true
          ) {
            this.paySuccess();
          } else {
            //需要支付
            if (params.pay_result === false) {
              this.$messagebox.alert(params.msg || '支付失败，请重试');
              return;
            }
            if (!resp.params) {
              this.$messagebox.alert('获取支付信息失败，请重试');
              return;
            }
            this.$uniquePay.pay(resp.params).then(resp => this.paySuccess());
          }
        })
        .catch(err => this.$messagebox.alert(err.message));
    },
    /**
     * 支付成功
     */
    paySuccess() {
      this.$utils.removeSessionItem('monthlyProduct');
      this.$messagebox
        .alert('支付成功', '提示', {
          confirmButtonText: '我知道了'
        })
        .then(action => this.$router.replace('/mine/bills?selected=3'));
    }
  },
  components: {
    'datetime-picker': DateTimePicker,
    PayType,
    CouponCheck,
    VehicleSelect
  }
};
</script>
<style lang="scss" scoped>
.monthly-buy {
  .page-header {
    margin-bottom: 25px;
    margin-top: 15px;
    .page-header-label {
      color: #888;
      display: block;
      font-size: 12px;
      margin-left: 10px;
    }
  }
  .page-container {
    &--margin {
      margin-top: 35px;
      padding-bottom: 20%;
    }
    .mint-cell {
      .mint-cell-text {
        color: #888 !important;
      }
      .mint-cell-label {
        color: #999;
        line-height: 20px;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
      }
    }
  }
  .page-bottom-area {
    position: fixed;
    background: white;
  }
}
</style>


