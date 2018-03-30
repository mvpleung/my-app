/*
 * 已经购买包月产品
 * @Author: liangzc 
 * @Date: 2018-02-05 09:55:36 
 * @Last Modified by: liangzc
 * @Last Modified time: 2018-03-28 17:32:45
 */
<template>
  <div class="monthly-pro">
    <div class="page-header"
      v-if="!listOnly">
      <h3 class="page-header-title">已购包月产品</h3>
    </div>
    <me-scroll ref="mescroll"
      class="page-container"
      :id="mescrollId"
      :opt-up="{ empty: { tip: '暂无购买记录' }}"
      :opt-down="{autoShowLoading:true}"
      :up-callback="() => monthlyRecordList(queryParams.currentPage+1)"
      :down-callback="() => monthlyRecordList(1)">
      <mt-cell v-for="(product, index) in monthlyList"
        :key="index"
        class="mint-cell--large"
        :class="isInvalid(product)?'mint-cell--disabled':''">
        <template slot="title">
          <span class="mint-cell-text">{{ product.parkingName }}</span>
          <span class="mint-cell-label">
            {{ product.lpn }}
          </span>
          <span class="mint-cell-label">
            有效期：{{ product.startTime }} - {{ product.endTime }}
          </span>
        </template>
        <template v-if="!isInvalid(product)">
          <span class="mint-cell-label">
            {{ product | expiryTime($utils) }}
          </span>
          <span class="mint-cell-label">
            {{ (Number(product.actualPayMoney || '0')/100).toFixed(2) }}元
          </span>
        </template>
        <template v-else>
          <i class="iconfont icon-Invalid" />
        </template>
      </mt-cell>
    </me-scroll>
    <div class="page-bottom-area"
      v-if="!listOnly"
      v-show="!loading">
      <mt-button size="large"
        type="primary"
        @click.native="$router.push('list')">购买包月产品</mt-button>
    </div>
  </div>
</template>
<script>
import Mescroll from 'vue-mescroll/mescroll';
export default {
  name: 'monthly',
  props: {
    /**
     * mescroll id
     */
    mescrollId: {
      type: String,
      default: 'mescroll'
    },
    /**
     * 是否仅显示列表
     */
    listOnly: Boolean,
    /**
     * 是否作为组件存在
     */
    isComponent: Boolean
  },
  data() {
    return {
      loading: false,
      monthlyList: [],
      queryParams: {
        idType: this.$store.getters.user.id_type,
        id: this.$store.getters.user.id,
        currentPage: 0,
        pageSize: 20
      }
    };
  },
  created() {
    !this.isComponent && document.setTitle('已购包月产品');
    //重置缓存
    this.$utils.removeSessionItem('monthlyProduct');
  },
  filters: {
    /**
     * 过期时间
     */
    expiryTime(product, utils) {
      let days = utils.dateDiff(product.endTime, Date.now());
      return days > 0 && days <= 3 ?
        `还有${days}天过期` :
        days === 0 ? '今天到期' : '';
    }
  },
  computed: {
    now() {
      return new Date().Format('yyyy-MM-dd');
    }
  },
  methods: {
    /**
     * 获取已购包月产品记录
     * @param {Number} currentPage 当前页
     */
    monthlyRecordList(currentPage) {
      this.loading = true;
      this.queryParams.currentPage = currentPage || 1;
      this.axios
        .get('v1/phtons/longRentRecordList', {
          params: this.queryParams,
          silence: true
        })
        .then(resp => {
          let { recordList, count } = resp.result_data || {};
          recordList = recordList || [];
          if (this.queryParams.currentPage <= 1) {
            this.monthlyList = recordList;
          } else {
            this.monthlyList = this.monthlyList.concat(recordList);
          }
          this.$refs.mescroll.instance.endBySize(recordList.length, count);
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
     * 是否已失效
     */
    isInvalid(product) {
      return this.$utils.dateDiff(product.endTime, this.now) < 0;
    }
  },
  components: {
    'me-scroll': Mescroll
  }
};
</script>
<style lang="scss">
.monthly-pro {
  .page-container.mescroll {
    top: 45px;
    height: calc(100% - 45px);
    .mint-cell {
      min-height: 30px;
    }
    .mint-cell--large {
      .mint-cell-value {
        display: block;
        text-align: right;
        .mint-cell-label {
          &:nth-child(1) {
            color: rgb(255, 76, 83);
          }
          &:nth-child(2) {
            font-size: 14px;
            font-weight: bold;
          }
          &:last-child {
            margin-bottom: 15px;
          }
        }
        .mint-cell-value--link {
          color: #6d6df3;
          font-size: 14px;
          text-decoration: underline;
        }
        .icon-Invalid {
          font-size: 55px;
        }
      }
    }
  }
  .page-bottom-area {
    position: fixed;
  }
}
</style>



