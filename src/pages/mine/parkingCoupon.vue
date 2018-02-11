/*
 * 购买停车券
 * @Author: liangzc 
 * @Date: 2018-02-07 14:26:36 
 * @Last Modified by: liangzc
 * @Last Modified time: 2018-02-09 15:08:19
 */
<template>
  <div class="parking-coupon">
    <div class="page-header">
      <h3 class="page-header-title">余额:{{userInfo.balance}}</h3>
    </div>
    <div class="page-container">
      <mt-cell title="选择停车券面额" />
      <grid-view :items="items" />
    </div>
    <div class="page-bottom-area">
      <router-link to="couponrecords">购买记录</router-link>
    </div>
  </div>
</template>

<script>
import { GridView } from '@/components';
export default {
  data() {
    return {
      userInfo: {
        balance: 0
      },
      items: [
        {
          label: '100元',
          subLabel: '送15元'
        },
        {
          label: '300元',
          subLabel: '送20元'
        },
        {
          label: '500元',
          subLabel: '送50元'
        },
        {
          label: '1000元',
          subLabel: '送150元'
        }
      ]
    };
  },
  created() {
    document.setTitle('购买停车券');
  },
  components: {
    GridView
  }
};
</script>

<style lang="scss" scoped>
.parking-coupon {
  .page-header {
    padding-left: 15px;
    border-bottom: 1px solid #e8e8e8;
  }
  .page-container {
    .mint-cell {
      margin-top: 20px;
      margin-bottom: -1px;
    }
  }
  .page-bottom-area {
    margin-top: 50px;
    a {
      color: darkslategray;
    }
  }
}
</style>