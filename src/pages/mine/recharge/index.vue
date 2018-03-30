/*
 * 余额充值
 * @Author: liangzc 
 * @Date: 2018-02-07 14:26:36 
 * @Last Modified by: liangzc
 * @Last Modified time: 2018-03-19 15:01:25
 */
<template>
  <div class="recharge">
    <div class="page-header">
      <h3 class="page-header-title">
        余额: {{ cashAccount }}
      </h3>
    </div>
    <div class="page-container">
      <mt-cell title="选择停车券面额" />
      <grid-view :items="rechargeList"
        label-key="rechargeMoney"
        label-pattern="%s元"
        sub-label-key="giveMoney"
        sub-label-pattern="送%s元"
        :filter="itemFilter"
        @item-click="recharge" />
    </div>
    <div class="page-bottom-area">
      <mt-button @click.native="$router.push('/mine/recharge/record')">
        充值记录
      </mt-button>
      <router-link tag="span"
        to="/mine/recharge/contract">查看充值协议</router-link>
    </div>
  </div>
</template>

<script>
import { GridView } from '@/components';
export default {
  data() {
    return {
      tempCashAccount: null,
      rechargeList: []
    };
  },
  created() {
    document.setTitle('余额充值');
    this.init();
  },
  computed: {
    accountInfo() {
      return this.$store.getters.account;
    },
    cashAccount() {
      return (
        this.tempCashAccount ||
        (Number(this.accountInfo.cashAccount || '0') / 100).toFixed(2)
      );
    }
  },
  methods: {
    init() {
      this.getRechargeList();
    },
    /**
     * 获取充值列表
     */
    getRechargeList() {
      this.axios('v1/phtons/rechargeList').then(resp => {
        this.rechargeList = (resp.result_data || {}).rechargeList || [];
      });
    },
    itemFilter(item) {
      item.rechargeMoney = item.rechargeMoney / 100;
      item.giveMoney = (Number(item.giveMoney) || 0) / 100;
      return item;
    },
    /**
     * 充值
     */
    recharge(item) {
      const { id_type: idType, id } = this.$store.getters.user;
      this.axios
        .get('v1/phtons/payRecharge', {
          params: { rechargeId: item.id, idType, id }
        })
        .then(resp => {
          this.$uniquePay.pay(resp.params).then(res => {
            this.tempCashAccount = (
              Number(this.accountInfo.cashAccount || '0') / 100 +
              Number(item.rechargeMoney || '0') +
              Number(item.giveMoney || '0')
            ).toFixed(2);
            this.$store.dispatch('resetAccount');
            this.$messagebox
              .alert('充值成功，请稍后查看账户余额', '提示', {
                confirmButtonText: '我知道了'
              })
              .then(action => {
                this.$router.go(-1);
                this.$bus.emit('refresh');
              });
          });
        });
    }
  },
  components: {
    GridView
  }
};
</script>

<style lang="scss" scoped>
.recharge {
  .page-header {
    padding-left: 15px;
  }
  .page-container {
    .mint-cell {
      margin-top: 20px;
      margin-bottom: -1px;
    }
  }
  .page-bottom-area {
    margin-top: 50px;
    .mint-button--default {
      width: 60%;
    }
    span {
      margin-top: 30px;
      display: block;
      color: darkslategray;
      font-size: 15px;
    }
  }
}
</style>