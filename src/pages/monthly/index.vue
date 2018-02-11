/*
 * 已经购买包月产品
 * @Author: liangzc 
 * @Date: 2018-02-05 09:55:36 
 * @Last Modified by: liangzc
 * @Last Modified time: 2018-02-09 15:20:36
 */
<template>
  <div class="monthly-pro">
    <div class="page-header">
      <mt-cell title="已购包月产品"
        class="page-header-title" />
    </div>
    <div v-for="(monthly, index) in monthlyProducts"
      :key="index"
      class="page-container">
      <mt-cell title="金运世纪大厦停车场"
        value="还有3天过期"
        class="mint-cell--largetitle mint-cell--noborder" />
      <mt-cell title="粤B123465"
        value="70元/30天"
        class="mint-cell--noborder" />
      <mt-cell title="有效期：2018-01-01-2018-01-31">
        <router-link to="buy">续费>></router-link>
      </mt-cell>
    </div>
    <div class="page-bottom-area">
      <mt-button size="large"
        type="primary"
        @click.native="$router.push('list')">购买包月产品</mt-button>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      monthlyProducts: [{}, {}]
    };
  },
  created() {
    document.setTitle('已购包月产品');
  }
};
</script>
<style lang="scss">
.monthly-pro {
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



