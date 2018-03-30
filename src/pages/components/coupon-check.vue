/*
 * 选择优惠券
 * @Author: liangzc 
 * @Date: 2018-03-09 14:23:27 
 * @Last Modified by: liangzc
 * @Last Modified time: 2018-03-15 14:58:15
 */
<template>
  <div class="mint-cell">
    <mt-cell :title="title"
      :class="[couponStyle.class, className]"
      :value="couponStyle.label"
      is-link
      @click.native="$refs.couponPopup.open()" />
    <popup-check ref="couponPopup"
      v-model="checkedCoupon"
      :title="checkTitle"
      :control-title="controlTitle"
      :options="couponList"
      label-key="discountName"
      value-key="id"
      :confirm="couponConfirm" />
  </div>
</template>

<script type="text/babel">
import { PopupCheck } from '@/components';
export default {
  name: 'coupon-check',
  props: {
    /**
     * 标题
     */
    title: {
      type: String,
      default: '停车优惠'
    },
    /**
     * 选择层标题
     */
    checkTitle: {
      type: String,
      default: '选择优惠券'
    },
    /**
     * 控制项标题
     */
    controlTitle: {
      type: String,
      default: '不使用优惠券'
    },
    /**
     * 查询参数{parkCode, productType}
     */
    params: {
      type: Object,
      default: () => null
    },
    value: null,
    /**
     * 样式
     */
    className: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      couponList: [], //优惠券列表
      checkedCoupon: null //选中的优惠券
    };
  },
  created() {
    this.$nextTick(() => this.getParkingCoupon());
  },
  watch: {
    value(val) {
      this.checkedCoupon = val || {};
    },
    'params.parkCode': {
      handler(val) {
        this.getParkingCoupon();
      }
    },
    checkedCoupon: {
      handler(val) {
        this.$emit('input', val);
      },
      deep: true
    }
  },
  computed: {
    /**
     * 优惠券展示
     */
    couponStyle() {
      return {
        class:
          this.checkedCoupon && this.checkedCoupon.cashDiscount ?
            'mint-cell--primary' :
            '',
        label:
          this.couponList && this.couponList.length > 0 ?
            this.checkedCoupon && this.checkedCoupon.cashDiscount ?
              `-${((this.checkedCoupon.cashDiscount || 0) / 100).toFixed(
                2
              )}元` :
              '选择优惠券' :
            '暂无优惠券'
      };
    }
  },
  methods: {
    /**
     * 获取可用优惠券
     */
    getParkingCoupon() {
      const { id_type: idType, id } = this.$store.getters.user;
      this.params &&
        this.params.parkCode &&
        this.axios
          .get('v1/phtons/getUserDiscountListForParking', {
            params: { idType, id, ...this.params }, //产品类型（0：临停，1：错峰，2：长租，3：车位预约
            errorHandle: true
          })
          .then(
            resp => (this.couponList = (resp.result_data || {}).datas || [])
          );
    },
    /**
     * 优惠券选择回调
     */
    couponConfirm(coupon) {
      this.checkedCoupon = coupon;
    }
  },
  components: {
    PopupCheck
  }
};
</script>
<style lang="scss" scoped>
.mint-cell {
  .mint-cell {
    border: none;
    background: none;
  }
}
</style>
