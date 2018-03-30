/*
 * 停车场详情
 * @Author: liangzc 
 * @Date: 2018-02-05 09:55:36 
 * @Last Modified by: liangzc
 * @Last Modified time: 2018-03-26 15:39:41
 */
<template>
  <div class="parking-details">
    <div class="page-container">
      <mt-cell :title="parking.name"
        :label="parking.address"
        @click.native="navigation">
        <i class="iconfont icon-nav" />
      </mt-cell>
      <mt-cell v-if="parking.distanceDesc"
        :title="`距您${parking.distanceDesc}`" />
      <mt-cell :title="`收费标准：${parking.charge}`" />
      <mt-cell title="空闲车位">
        <mt-badge :type="parking.countBadgeType">
          {{ parking.allSCount }}
        </mt-badge>
      </mt-cell>
      <!-- <mt-cell class="mint-cell--noborder"
        title="费用估算" />{{ parking.rate }}
      <mt-cell>
        <span class="mint-cell-text"
          slot="icon">停车时长：</span>
        <span class="color-red">{{ amount }}小时</span>
        <number-button v-model="amount"
          @click.native="amountClick"
          :min="1" />
      </mt-cell> -->
    </div>
  </div>
</template>
<script>
import { NumberButton } from '@/components';
export default {
  data() {
    return {
      parking: {}, //停车场信息
      amount: 1,
      parkingrate: [] //费用标准
    };
  },
  created() {
    document.setTitle('场库详情');
    this.init();
    // this.amountClick();
  },
  methods: {
    init() {
      this.parking = this.$utils.getSessionItem('parkinglot') || {};
      // const reg = /\d+(\.\d*)?[元]/g; //费用估算
      // this.parking.rates = this.parking.charge ?
      //   this.parking.charge.match(reg) :
      //   [];
      // this.parking.rates.forEach((item, i) => {
      //   this.parkingrate[i] = parseInt(item.slice(0, -1));
      // });
    },
    /**
     * 导航
     */
    navigation() {
      const { lng, lat } = this.parking.currentPosition || {};
      const { longitude, latitude, name } = this.parking;
      location.href = `http://uri.amap.com/navigation?from=${lng},${lat},我的位置&to=${longitude},${latitude},${name}&src=phtons&callnative=1`;
    }
    // amountClick() {
    //   //费用估算
    //   if (this.amount > 1) {
    //     this.parking.rate =
    //       this.parkingrate.length !== 0 ?
    //         this.parkingrate[0] +
    //           this.parkingrate[1] * ((parseInt(this.amount) - 1) * 2) :
    //         0;
    //   } else {
    //     this.parking.rate =
    //       this.parkingrate.length !== 0 ? this.parkingrate[0] : 0;
    //   }
    // }
  },
  components: {
    NumberButton
  }
};
</script>
<style lang="scss">
.parking-details {
  .page-container {
    .mint-cell:first-child {
      padding-top: 15px;
      padding-bottom: 15px;
    }
    .mint-cell-wrapper {
      height: 70px;
      .mint-cell-text {
        white-space: normal !important;
        font-size: 15px;
        color: rgb(181, 178, 180);
      }
      .icon-nav {
        font-size: 300%;
        color: #2d2d96;
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


