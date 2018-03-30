/*
 * 停车缴费
 * @Author: liangzc 
 * @Date: 2018-02-05 09:55:36 
 * @Last Modified by: liangzc
 * @Last Modified time: 2018-03-28 15:37:34
 */
<template>
  <div class="parking-fee">
    <div class="mint-msgbox"
      v-show="noRecord">
      <div class="mint-msgbox-content">
        <div class="mint-msgbox-message">无该车牌车辆入场记录</div>
      </div>
      <div class="mint-msgbox-btns">
        <button class="mint-msgbox-btn mint-msgbox-confirm"
          @click="$router.back()">其他车牌</button>
      </div>
    </div>
    <div class="page-header"
      v-show="vehicleOrder.pay_amount !== undefined">
      <h3 class="page-header-title">{{ vehicleOrder.park_name }}</h3>
      <span class="page-header-label">{{ vehicleOrder.park_address }}</span>
    </div>
    <div class="page-container"
      v-show="vehicleOrder.pay_amount !== undefined">
      <mt-cell title="车牌号"
        :value="vehicleOrder.plate" />
      <mt-cell title="进场时间"
        :value="vehicleOrder.in_time" />
      <mt-cell title="停车时长"
        :value="vehicleOrder.parking_time_desc" />
      <mt-cell title="停车费"
        :value="`${vehicleOrder.pay_amount || 0}元`" />
      <coupon-check v-model="checkedCoupon"
        :params="{parkCode:vehicleOrder.park_code,productType: '0'}" />
      <mt-cell v-if="vehicleOrder.need_service_fee"
        title="电子服务费"
        :value="`${(vehicleOrder.service_fee || 0).toFixed(2)}元`" />
      <mt-cell class="mint-cell--primary"
        title="支付金额"
        :value="`${totalFee}元`" />
    </div>
    <pay-type v-model="payType"
      v-show="vehicleOrder.pay_amount !== undefined"
      :total-amount="totalFee" />
    <div class="page-bottom-area"
      v-show="vehicleOrder.pay_amount !== undefined">
      <mt-button type="primary"
        size="large"
        :disabled="!needPay"
        @click.native="pay">{{ needPay ? '立即支付' : '无需支付' }}</mt-button>
      <div class="mint-cell-title mint-cell-title--center">
        <span class="mint-cell-label">温馨提示：请在付款成功后
          <b>{{ vehicleOrder.left_time_in_min }}分钟</b> 内离场</span>
        <span class="mint-cell-label">
          本服务由【优会停】提供
        </span>
      </div>
    </div>
  </div>
</template>
<script>
import PayType from '../components/pay-type';
import CouponCheck from '../components/coupon-check';
export default {
  data() {
    return {
      accountInfo: {}, //账户信息
      vehicleOrder: {}, //订单信息
      checkedCoupon: {}, //选中的优惠券
      payType: {}, //支付方式
      noRecord: false //无记录
    };
  },
  created() {
    document.setTitle('停车缴费');
    this.getVehicleOrder();
  },
  computed: {
    userInfo() {
      return this.$store.getters.user;
    },
    /**
     * 总金额
     */
    totalFee() {
      let couponFee = this.checkedCoupon ?
        (this.checkedCoupon.cashDiscount || 0) / 100 :
        0;
      let total =
        (Number(this.vehicleOrder.service_fee) || 0) +
        (Number(this.vehicleOrder.pay_amount) || 0);
      return (couponFee >= total ? 0 : total - couponFee).toFixed(2);
    },
    /**
     * 是否需要支付
     */
    needPay() {
      let amount = Number(this.vehicleOrder.pay_amount || '0');
      return amount > 0;
    }
  },
  methods: {
    /**
     * 获取车辆订单
     */
    getVehicleOrder() {
      if (this.$utils.isEmpty(this.$route.query.plate)) {
        this.$router.replace({
          path: '/vehicle/record',
          query: {
            redirect: this.$route.fullPath
          }
        });
        return;
      }
      this.noRecord = false;
      this.$parent.showLoading();
      this.axios
        .get('v1/phtons/getOrderByLpn', {
          params: {
            plate: this.$route.query.plate
          },
          silence: true,
          errorHandle: true
        })
        .then(res => {
          this.$parent.hideLoading();
          this.vehicleOrder = res;
        })
        .catch(error => {
          this.$parent.hideLoading();
          if (error.code === 13015) {
            this.noRecord = true;
            //无入场记录
          } else {
            this.$messagebox
              .alert(error.message, '提示', {
                confirmButtonText: '点击重试'
              })
              .then(action => {
                this.getVehicleOrder();
              });
          }
        });
    },
    /**
     * 立即支付
     */
    pay() {
      if (this.$utils.isEmptyObject(this.payType)) {
        this.$toast('请选择支付方式');
        return;
      }
      const {
        plate,
        park_name,
        park_code,
        park_address,
        in_time,
        out_time,
        pay_amount: parking_fee,
        bg_order_id,
        pay_channel = this.payType.value,
        coupon_id = this.checkedCoupon.id,
        idType = this.userInfo.id_type,
        id = this.userInfo.id
      } = this.vehicleOrder;

      this.axios
        .post(
          'v1/phtons/payParkingFee',
          {
            plate,
            park_name,
            park_code,
            park_address,
            in_time,
            out_time,
            parking_fee,
            bg_order_id,
            idType,
            id,
            pay_channel,
            coupon_id
          },
          { errorHandle: true }
        )
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
      this.$messagebox
        .alert('支付成功', '提示', {
          confirmButtonText: '我知道了'
        })
        .then(action => this.$router.replace('/mine/bills'));
    }
  },
  components: {
    PayType,
    CouponCheck
  }
};
</script>
<style lang="scss">
.parking-fee {
  .mint-msgbox {
    top: 35%;
    .mint-msgbox-btns {
      margin-top: 20px;
      .mint-msgbox-btn {
        font-size: 15px;
      }
    }
  }
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
    .mint-cell--paytype {
      margin-top: 35px;
    }
  }
  .page-bottom-area {
    .mint-cell-title--center {
      text-align: center;
      padding-bottom: 30px;
      .mint-cell-label {
        margin-top: 10px;
        b {
          font-weight: bold;
          color: #ff4c53;
        }
      }
    }
  }
}
</style>


