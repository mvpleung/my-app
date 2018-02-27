/*
 * 停车场详情
 * @Author: liangzc 
 * @Date: 2018-02-05 09:55:36 
 * @Last Modified by: liangzc
 * @Last Modified time: 2018-02-27 11:28:31
 */
<template>
  <div class="parking-details">
    <div class="page-header">
      <swipe :items="bannerData" />
      <div class="page-header-info">
        <h3 class="page-header-title">金运世纪大厦停车场</h3>
        <router-link class="page-header-link"
          to="#">去这里>></router-link>
      </div>
    </div>
    <div class="page-container">
      <mt-cell title="距您200米" />
      <mt-cell title="收费标准：白天：第一小时15元，第二小时后3元/半小时，晚上：第一小时15元，第一小时后3元/半小时" />
      <mt-cell title="空闲车位">
        <mt-badge type="warning">5</mt-badge>
      </mt-cell>
      <mt-cell class="mint-cell--noborder"
        title="费用估算：" />
      <mt-cell>
        <span class="mint-cell-text"
          slot="icon">停车时长：</span>
        <span class="color-black"
          slot="icon">1小时</span>
        <span class="color-red">{{ amount }}元</span>
        <number-button v-model="amount"
          :min="0" />
      </mt-cell>
    </div>
  </div>
</template>
<script>
import { Swipe, NumberButton } from '@/components';
export default {
  data() {
    return {
      amount: 1,
      bannerData: [
        {
          imgUrl: require('@/assets/banner.png')
        },
        {
          imgUrl: require('@/assets/banner1.png')
        }
      ]
    };
  },
  created() {
    document.setTitle('场库详情');
  },
  methods: {},
  components: {
    Swipe,
    NumberButton
  }
};
</script>
<style lang="scss">
.parking-details {
  .page-header {
    .page-header-info {
      width: 100%;
      display: inline-flex;
      .page-header-title {
        flex: 3;
      }
      .page-header-link {
        flex: 1;
        margin-right: 15px;
        padding: 15px 0;
      }
    }
  }
  .page-container {
    .mint-cell-wrapper {
      height: 70px;
      .mint-cell-text {
        white-space: normal;
        font-size: 15px;
        color: rgb(181, 178, 180);
      }
      .mint-badge.is-warning {
        padding: 4px 8px;
      }
      .number-button {
        margin-left: 20px;
      }
    }
  }
}
</style>


