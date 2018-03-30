/*
 * 支付方式
 * @Author: liangzc 
 * @Date: 2018-03-09 13:56:09 
 * @Last Modified by: liangzc
 * @Last Modified time: 2018-03-15 16:43:35
 */
<template>
  <div class="pay-type page-container">
    <span>
      <mt-cell :title="title"
        :class="className"
        :value="payType.label"
        is-link
        @click.native="open()" />
    </span>
    <data-picker ref="payTypePicker"
      :slots="payTypes"
      :default="payType"
      :value-key="'label'"
      @confirm="payTypeConfirm" />
  </div>
</template>

<script type="text/babel">
import { DataPicker } from '@/components';
export default {
  name: 'pay-type',
  props: {
    /**
     * 标题
     */
    title: {
      type: String,
      default: '支付方式'
    },
    /**
     * 总金额
     */
    totalAmount: {
      type: [Number, String],
      default: 0
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
      accountInfo: this.$store.getters.account, //账户信息
      payType: {} //支付方式
    };
  },
  created() {
    this.payType =
      this.payTypes[0].values[this.payTypes[0].defaultIndex || 0] || {};
  },
  watch: {
    value(val) {
      this.payType = val || {};
    },
    /**
     * 监听支付方式改动
     */
    payTypes(val) {
      this.payType = val[0].values[val[0].defaultIndex || 0] || {};
    },
    payType: {
      handler(val) {
        this.$emit('input', val);
      },
      deep: true
    }
  },
  computed: {
    totalFee() {
      return this.totalAmount ? Number(this.totalAmount) : 0;
    },
    /**
     * 支付方式
     */
    payTypes() {
      let cashDiscount =
        this.accountInfo.cashAccount !== undefined ?
          (this.accountInfo.cashAccount / 100).toFixed(2) :
          -1;
      let payment = $globalConfig.navigator.isWechat ?
        [{ label: '微信支付', value: 'Wechat' }] :
        $globalConfig.navigator.isAlipay ?
          [{ label: '支付宝支付', value: 'Alipay' }] :
          [];
      if (cashDiscount >= 0.0) {
        let values = [
          {
            label: `余额支付(${cashDiscount})`,
            value: 'UserAccount',
            disabled: cashDiscount < this.totalFee
          },
          ...payment
        ];
        return [
          {
            flex: 1,
            values,
            defaultIndex: cashDiscount < this.totalFee ? 1 : 0
          }
        ];
      }
      return [
        {
          flex: 1,
          values: payment
        }
      ];
    }
  },
  methods: {
    open() {
      this.$refs.payTypePicker.open();
    },
    payTypeConfirm(picker, values) {
      this.payType = values[0] || {};
    }
  },
  components: {
    DataPicker
  }
};
</script>
<style lang="scss">
.pay-type {
  &.page-container {
    .mint-cell {
      margin-top: 35px;
    }
  }
}
</style>
