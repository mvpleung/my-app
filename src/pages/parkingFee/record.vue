/*
 * 停车记录
 * @Author: liangzc 
 * @Date: 2018-02-05 09:55:36 
 * @Last Modified by: liangzc
 * @Last Modified time: 2018-03-28 17:27:01
 */
<template>
  <div class="parking-record">
    <me-scroll ref="mescroll"
      class="page-container"
      :id="mescrollId"
      :opt-up="{ empty: { tip: '暂无停车缴费记录' }}"
      :opt-down="{autoShowLoading:true}"
      :up-callback="() => getPaymentRecord(queryParams.currentPage+1)"
      :down-callback="() => getPaymentRecord(1)">
      <mt-cell v-for="(record, index) in records"
        :key="index"
        class="mint-cell--large">
        <template slot="title">
          <span class="mint-cell-text">{{ record.plate }}</span>
          <span class="mint-cell-label">
            停车场
          </span>
          <span class="mint-cell-label">
            入场时间：
          </span>
          <span class="mint-cell-label">
            出场时间：
          </span>
          <span class="mint-cell-label">
            停车时长：
          </span>
          <span class="mint-cell-label">
            停车费用：
          </span>
        </template>
        <template>
          <span class="mint-cell-label">
            {{ record.park_name }}
          </span>
          <span class="mint-cell-label">
            {{ record.in_time }}
          </span>
          <span class="mint-cell-label">
            {{ record.out_time }}
          </span>
          <span class="mint-cell-label">
            {{ record.parking_time_desc }}
          </span>
          <span class="mint-cell-label">
            {{ Number(record.pay_amount || '0').toFixed(2) }}元
          </span>
        </template>
      </mt-cell>
    </me-scroll>
  </div>
</template>
<script>
import Mescroll from 'vue-mescroll/mescroll';
export default {
  name: 'parking-record',
  props: {
    /**
     * mescroll id
     */
    mescrollId: {
      type: String,
      default: 'mescroll'
    },
    /**
     * 是否作为组件存在
     */
    isComponent: Boolean
  },
  data() {
    return {
      records: [],
      queryParams: {
        currentPage: 0,
        pageSize: 20,
        id: this.$store.getters.user.id,
        idType: this.$store.getters.user.id_type
      }
    };
  },
  created() {
    !this.isComponent && document.setTitle('停车记录');
  },
  methods: {
    /**
     * 获取缴费记录
     * @param {Number} page 当前页码
     */
    getPaymentRecord(page) {
      this.queryParams.currentPage = page || 1;
      this.axios
        .get('v1/phtons/getParkingList', {
          params: this.queryParams,
          silence: true
        })
        .then(resp => {
          let plates = resp.result || [];
          if (this.queryParams.currentPage <= 1) {
            this.records = plates;
          } else {
            this.records = this.records.concat(plates);
          }
          this.$refs.mescroll.instance.endSuccess(
            plates.length,
            plates.length >= this.queryParams.pageSize
          );
        })
        .catch(err => {
          this.$toast(err.message);
          this.$refs.mescroll.instance.endBySize(0);
          this.$refs.mescroll.instance.endErr();
        });
    }
  },
  components: {
    'me-scroll': Mescroll
  }
};
</script>
<style lang="scss">
.parking-record {
  .page-container.mescroll {
    .mint-cell--large {
      .mint-cell-wrapper {
        .mint-cell-value {
          display: block;
          text-align: right;
        }
      }
    }
  }
}
</style>



