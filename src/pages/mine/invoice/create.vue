/*
 * 开具发票
 * @Author: liangzc 
 * @Date: 2018-02-05 09:55:36 
 * @Last Modified by: liangzc
 * @Last Modified time: 2018-03-29 09:51:35
 */
<template>
  <div class="invoice-create">
    <div class="page-container">
      <mt-cell title="发票信息" />
      <title-select v-model="title"
        is-primary/>
      <mt-cell title="企业税号"
        v-if="title.type === '2'"
        :value="title.businessTax" />
      <mt-cell title="电子邮箱"
        :value="title.eMail" />
      <mt-cell title="联系电话"
        :value="title.phone" />
    </div>
    <div class="page-container">
      <mt-cell title="发票信息" />
      <mt-cell title="开票金额"
        :value="`${invoiceFee}元`" />
      <mt-cell title="发票类型"
        value="电子发票" />
    </div>
    <div class="page-bottom-area">
      <mt-button size="large"
        type="primary"
        :disabled="disabledCreate"
        @click.native="submit">提交</mt-button>
    </div>
  </div>
</template>
<script>
import TitleSelect from '@/pages/components/title-select';
export default {
  data() {
    return {
      title: {},
      invoiceInfo: {}
    };
  },
  created() {
    document.setTitle('开具发票');
    this.invoiceInfo =
      this.$utils.getSessionItem('invoiceInfo', true) || this.invoiceInfo;
  },
  watch: {
    title: {
      handler(val) {
        this.invoiceInfo.headId = val.id;
      },
      deep: true
    }
  },
  computed: {
    /**
     * 是否创建按钮
     */
    disabledCreate() {
      return (
        this.$utils.isEmpty(this.title.id) ||
        this.$utils.isEmpty(this.invoiceInfo.parkCode)
      );
    },
    /**
     * 开票金额
     */
    invoiceFee() {
      return (
        (this.invoiceInfo.datas || []).reduce(
          (prev, current) => Number(prev || '0') + Number(current.price || '0'),
          0
        ) / 100
      ).toFixed(2);
    }
  },
  methods: {
    /**
     * 开票
     */
    submit() {
      this.axios
        .get('v1/phtons/createInvoice', {
          params: {
            ...this.invoiceInfo,
            datas: JSON.stringify(this.invoiceInfo.datas)
          }
        })
        .then(resp => {
          this.$utils.removeSessionItem('invoiceInfo');
          this.$bus.emit('refreshCHargeList');
          this.$router.replace('records');
        });
    }
  },
  components: {
    TitleSelect
  }
};
</script>
<style lang="scss" scoped>
.invoice-create {
  .page-container {
    .mint-cell:first-child {
      background: #e0dddd29;
      border-top: none;
    }
    .mint-cell:nth-child(2) {
      border-top: 0.5px solid #d9d9d9;
    }
  }
}
</style>


