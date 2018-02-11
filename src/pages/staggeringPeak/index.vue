/*
 * 已经购买错峰产品
 * @Author: liangzc 
 * @Date: 2018-02-05 09:55:36 
 * @Last Modified by: liangzc
 * @Last Modified time: 2018-02-09 15:21:00
 */
<template>
  <div class="stagger-peak">
    <div class="page-header">
      <mt-cell title="已购错峰产品"
        class="page-header-title" />
    </div>
    <div v-for="(stagger, index) in staggerPeaks"
      :key="index"
      class="page-container">
      <mt-cell title="金运世纪大厦停车场"
        value="还有3天过期"
        class="mint-cell--largetitle mint-cell--noborder" />
      <mt-cell title="粤B123465"
        value="70元/30天"
        class="mint-cell--noborder" />
      <mt-cell title="错峰时间：18：00-09：00"
        class="mint-cell--noborder" />
      <mt-cell title="有效期：2018-01-01-2018-01-31">
        <router-link to="buy">续费>></router-link>
      </mt-cell>
    </div>
    <div class="page-bottom-area">
      <mt-button size="large"
        type="primary"
        @click.native="$router.push('list')">购买错峰产品</mt-button>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      staggerPeaks: [{}, {}]
    };
  },
  created() {
    document.setTitle('已购错峰产品');
  }
};
</script>
<style lang="scss">
.stagger-peak {
  .page-header-title {
    border-bottom: 1px solid #e8e8e8;
  }
  .page-container {
    .mint-cell {
      min-height: 30px;
    }
    .mint-cell--largetitle {
      margin: 15px 0;
      .mint-cell-value {
        span {
          color: rgb(255, 76, 83);
        }
      }
    }
  }
}
</style>



