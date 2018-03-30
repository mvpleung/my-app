/*
 * 账单
 * @Author: liangzc 
 * @Date: 2018-02-05 09:55:36 
 * @Last Modified by: liangzc
 * @Last Modified time: 2018-03-28 18:06:00
 */
<template>
  <div class="bill-mine">
    <div class="page-container">
      <mt-navbar v-model="selected">
        <mt-tab-item id="1">缴费</mt-tab-item>
        <mt-tab-item id="2">错峰</mt-tab-item>
        <mt-tab-item id="3">包月</mt-tab-item>
      </mt-navbar>
      <!-- tab-container -->
      <mt-tab-container v-model="selected">
        <mt-tab-container-item id="1">
          <parking-record id="parkingRecord"
            is-component/>
        </mt-tab-container-item>
        <mt-tab-container-item id="2">
          <staggering-peak mescroll-id="stagmescroll"
            :list-only="true"
            is-component/>
        </mt-tab-container-item>
        <mt-tab-container-item id="3">
          <monthly mescroll-id="monthMescroll"
            :list-only="true"
            is-component/>
        </mt-tab-container-item>
      </mt-tab-container>
    </div>
  </div>
</template>
<script>
import Mescroll from 'vue-mescroll/mescroll';
import Staggering from '@/pages/staggeringPeak/index';
import Monthly from '@/pages/monthly/index';
import ParkingRecords from '@/pages/parkingFee/record';
export default {
  data() {
    return {
      selected: this.$route.query.selected || '1'
    };
  },
  created() {
    document.setTitle('账单');
  },
  components: {
    'me-scroll': Mescroll,
    'staggering-peak': Staggering,
    Monthly,
    'parking-record': ParkingRecords
  }
};
</script>
<style lang="scss">
.bill-mine {
  .page-container {
    .mint-navbar {
      height: 45px;
    }
    .mint-tab-container-item {
      .mescroll {
        margin-top: 3px;
      }
      #stagmescroll,
      #monthMescroll {
        top: 45px;
        height: calc(100% - 45px);
      }
    }
  }
}
</style>



