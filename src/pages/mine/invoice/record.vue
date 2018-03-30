/*
 * 开票记录
 * @Author: liangzc 
 * @Date: 2018-02-05 09:55:36 
 * @Last Modified by: liangzc
 * @Last Modified time: 2018-03-23 16:39:35
 */
<template>
  <div class="title-list">
    <me-scroll ref="mescroll"
      class="page-container"
      :opt-up="{ empty: { tip: '暂无开票记录' }, use:false}"
      :down-callback="getVoiceList">
      <mt-cell v-for="(record, index) in records"
        :key="index"
        @click.native="viewInvoice(record.id)"
        class="mint-cell--large">
        <template slot="title">
          <span class="mint-cell-text">
            {{ record.name }}
            <mt-badge size="small"
              v-if="['1', '2'].find(item => item === record.type)"
              color="#abaaaa">
              {{ record.type | voiceType }}
            </mt-badge>
          </span>
          <span class="mint-cell-label">
            开票日期
          </span>
          <span class="mint-cell-label">
            合计金额
          </span>
        </template>
        <template>
          <span class="mint-cell-label ignore">
            {{ record.KPRQ }}
          </span>
          <span class="mint-cell-label ignore">
            {{ record.HJJE }}
          </span>
        </template>
      </mt-cell>
    </me-scroll>
  </div>
</template>
<script>
import Mescroll from 'vue-mescroll/mescroll';
export default {
  data() {
    return {
      records: []
    };
  },
  created() {
    document.setTitle('开票记录');
  },
  filters: {
    voiceType(type) {
      return type === '1' ? '个人' : type === '2' ? '单位' : '';
    }
  },
  methods: {
    /**
     * 获取开票记录
     */
    getVoiceList() {
      this.axios
        .get('v1/phtons/voiceList', {
          params: {
            phone: this.$store.getters.user.mobile
          }
        })
        .then(resp => {
          this.records = resp.result_data || [];
          if (this.records.length === 0) {
            this.$refs.mescroll.instance.showEmpty();
          }
          this.$refs.mescroll.instance.endErr();
        })
        .catch(err => {
          this.$refs.mescroll.instance.showEmpty();
          this.$refs.mescroll.instance.endErr();
        });
    },
    /**
     * 查看电子发票
     */
    viewInvoice(id) {
      this.axios
        .get('v1/phtons/viewInvoice', {
          params: {
            id
          }
        })
        .then(resp => {
          let data = (resp.result_data || {}).data;
          data && (location.href = data);
        });
    }
  },
  components: {
    'me-scroll': Mescroll
  }
};
</script>
<style lang="scss">
.title-list {
  .page-container {
    .mint-cell {
      .mint-cell-wrapper {
        padding: 10px;
      }
    }
  }
}
</style>



