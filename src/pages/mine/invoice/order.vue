/*
 * 可开具发票订单
 * @Author: liangzc 
 * @Date: 2018-02-05 09:55:36 
 * @Last Modified by: liangzc
 * @Last Modified time: 2018-03-29 09:47:41
 */
<template>
  <div class="invoice-order">
    <div class="page-header">
      <h3 class="page-header-title">可开具发票订单</h3>
    </div>
    <me-scroll ref="mescroll"
      class="page-container"
      :opt-up="{ empty: { tip: '暂无可开票订单' }}"
      :opt-down="{autoShowLoading:true}"
      :up-callback="() => getChargeList(queryParams.currentPage+1)"
      :down-callback="() => getChargeList(1)">
      <mt-cell v-for="(order, index) in orders"
        :key="index"
        class="mint-cell--large"
        @click.native="$refs.checkbox[index].click()">
        <template slot="title">
          <div>
            <label class="mint-checkbox">
              <input type="checkbox"
                ref="checkbox"
                v-model="checkedArray"
                class="mint-checkbox-input"
                :value="order">
              <span class="mint-checkbox-core" />
            </label>
          </div>
          <div>
            <span class="mint-cell-text">{{ order.lpn }}</span>
            <span class="mint-cell-label">
              停车场
            </span>
            <span class="mint-cell-label">
              停车费用
            </span>
            <span class="mint-cell-label">
              支付时间
            </span>
            <span class="mint-cell-label">
              支付方式
            </span>
            <span class="mint-cell-label">
              交易单号
            </span>
          </div>
        </template>
        <template>
          <span class="mint-cell-label">
            {{ order.parkName }}
          </span>
          <span class="mint-cell-label">
            {{ (Number(order.charge || '0')/100).toFixed(2) }}元
          </span>
          <span class="mint-cell-label">
            {{ order.payTime }}
          </span>
          <span class="mint-cell-label">
            {{ payChannel[order.payType] }}
          </span>
          <span class="mint-cell-label">
            {{ order.orderId }}
          </span>
        </template>
      </mt-cell>
    </me-scroll>
    <div class="page-bottom-flex">
      <label class="mint-checkbox page-bottom-start">
        <input type="checkbox"
          v-model="checkedAll"
          :true-value="true"
          :false-value="false"
          :disabled="orders.length === 0"
          @click="checkAll"
          class="mint-checkbox-input"
          value="1">
        <span class="mint-checkbox-core" />
        <span class="mint-cell-label">全选</span>
      </label>
      <mt-button class="page-bottom-end"
        size="small"
        type="danger"
        :disabled="checkedArray.length === 0"
        @click.native="next">下一步</mt-button>
    </div>
  </div>
</template>
<script>
import Mescroll from 'vue-mescroll/mescroll';
export default {
  data() {
    return {
      orders: [],
      queryParams: {
        idType: this.$store.getters.user.id_type,
        id: this.$store.getters.user.id,
        currentPage: 0,
        pageSize: 20
      },
      checkedAll: false,
      checkedArray: [], //选中的集合
      payChannel: {
        '1': '现金',
        '2': '微信支付',
        '3': '支付宝',
        '4': 'QQ支付',
        '5': '储值现金支付',
        '6': '其他电子支付',
        '7': '百联支付',
        '8': '支付宝免密',
        '9': 'I天地',
        '99': '其他',
        '0': '未付'
      }
    };
  },
  created() {
    document.setTitle('可开具发票订单');
    this.$bus.on('refreshCHargeList', () => this.getChargeList(1));
  },
  activated() {
    this.$utils.removeSessionItem('invoiceInfo');
  },
  watch: {
    /**
     * 监听选中数组，处理全选按钮状态
     */
    checkedArray(val, oldVal) {
      this.checkedAll = val.length === this.orders.length;
    }
  },
  methods: {
    /**
     * 获取可开票列表
     * @param {Number} currentPage 当前页
     */
    getChargeList(currentPage) {
      this.loading = true;
      this.queryParams.currentPage = currentPage || 1;
      this.axios
        .get('v1/phtons/getChargeList', {
          params: this.queryParams,
          silence: true
        })
        .then(resp => {
          let { datas, totalRowsAmount } = resp.result_data || {};
          datas = datas || [];
          if (this.queryParams.currentPage <= 1) {
            this.orders = datas;
          } else {
            this.orders = this.orders.concat(datas);
          }
          this.$refs.mescroll.instance.endBySize(datas.length, totalRowsAmount);
          this.loading = false;
        })
        .catch(err => {
          this.$toast(err.message);
          this.$refs.mescroll.instance.endBySize(0);
          this.$refs.mescroll.instance.endErr();
          this.loading = false;
        });
    },
    /**
     * 全选
     */
    checkAll(e) {
      this.orders.length > 0 &&
        (this.checkedArray = e.target.checked ? this.orders : []);
    },
    /**
     * 下一步
     */
    next() {
      if (this.checkedArray.length > 0) {
        let parkCode = this.checkedArray[0].parkCode;
        if (!this.checkedArray.every(item => item.parkCode === parkCode)) {
          this.$messagebox.alert('不同的停车场不能合并开票！');
          return;
        }
        let invoiceInfo = {
          parkCode,
          userId: this.$store.getters.user.mobile,
          datas: this.checkedArray.map(item => ({
            price: item.charge,
            id: item.id
          }))
        };
        this.$utils.setSessionItem('invoiceInfo', invoiceInfo, true);
        this.$router.push('create');
      }
    }
  },
  components: {
    'me-scroll': Mescroll
  }
};
</script>
<style lang="scss">
.invoice-order {
  .page-container {
    height: 85%;
    .mint-cell--large {
      .mint-cell-title {
        display: inline-flex;
        div:first-child {
          display: flex;
          align-items: center;
          padding-right: 10px;
        }
      }
      .mint-cell-value {
        display: block;
        text-align: right;
        flex: 1;
        .mint-cell-label {
          &:last-child {
            word-break: break-all;
          }
        }
      }
    }
  }
  .page-bottom-flex {
    .mint-cell-label {
      display: inline;
      font-size: 16px;
    }
  }
}
</style>



