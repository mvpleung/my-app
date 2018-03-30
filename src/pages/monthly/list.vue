/*
 * 包月产品列表
 * @Author: liangzc 
 * @Date: 2018-01-30 14:31:46 
 * @Last Modified by: liangzc
 * @Last Modified time: 2018-03-29 15:00:18
 */
<template>
  <div class="monthly-wrapper page-container">
    <amap-search-box class="search-box"
      poi-only
      :search-option="searchOption"
      :on-search-result="onSearchResult" />
    <div class="page-container-label"
      @click="position.status !== 1 ? getCurrentPosition() : null">
      <span>
        <i class="iconfont icon-location" />{{ position.formattedAddress }}
      </span>
    </div>
    <el-amap class="amap-box"
      ref="amap"
      :vid="'amap-vue'"
      :plugin="plugin"
      :center="[-1,-1]" />
    <me-scroll ref="mescroll"
      :opt-down="{ auto: false }"
      :opt-up="{  auto: false, empty: { tip: '没有搜索到相关产品' }}"
      :up-callback="() => getNearMonthlyList(queryParams.currentPage+1)"
      :down-callback="() => getNearMonthlyList(1)">
      <mt-spinner v-show="loading"
        type="triple-bounce"
        :size="60" />
      <mt-cell v-for="(product, i) in productList"
        :key="i + 1000"
        class="mint-cell--large"
        is-link
        @click.native="buy(product)">
        <template slot="title">
          <span class="mint-cell-text">{{ product.parkingName }}</span>
          <span class="mint-cell-label"
            v-show="position.status === 1">
            距您：{{ product | distance(position) }}
          </span>
          <span class="mint-cell-label">{{ product.address }}</span>
          <span class="mint-cell-label">
            收费标准：{{ product.price }}元/{{ product.activeDay }}天
          </span>
          <span class="mint-cell-label">
            停车位置：{{ product.parkSpacesNum }}
          </span>
        </template>
      </mt-cell>
    </me-scroll>
  </div>
</template>

<script>
import Mescroll from 'vue-mescroll/mescroll';
import { AmapSearchBox } from '@/components';
export default {
  data() {
    return {
      searchOption: {
        citylimit: true
      },
      //地图插件
      plugin: [
        {
          pName: 'Geolocation',
          buttonPosition: 'RB',
          zoomToAccuracy: true,
          events: {
            init: this.initEvent
          }
        }
      ],
      //停车场查询参数
      queryParams: {
        longitude: '', //精度
        latitude: '', //纬度
        currentPage: 1,
        pageSize: 20
      },
      loading: false,
      position: {
        //定位信息
        formattedAddress: '定位中...'
      },
      productList: [],
      map: null
    };
  },
  created() {
    document.setTitle('包月产品');
    //重置缓存
    this.$utils.removeSessionItem('monthlyProduct');
  },
  filters: {
    /**
     * 距离
     */
    distance(product, position) {
      const { lng, lat } = position.position || {};
      let distance = parseInt(
        AMap.GeometryUtil.distance(
          [lng, lat],
          [product.longitude, product.latitude]
        )
      );
      !isNaN(distance) &&
        (product.distanceDesc =
          distance <= 0 ?
            '<1米' :
            distance >= 1000 ?
              `${(distance / 1000).toFixed(1)}公里` :
              `${distance}米`);
      return product.distanceDesc;
    }
  },
  methods: {
    initEvent(map) {
      this.map = map;
      this.getCurrentPosition(map);
    },
    /**
     * 定位
     */
    getCurrentPosition(map) {
      this.loading = true;
      (map || this.map) &&
        (map || this.map).getCurrentPosition((status, result) => {
          this.position = result || {};
          if (result && result.position) {
            const { lng, lat } = result.position;
            this.searchOption.city = (result.addressComponent || {}).city;
            this.center = [lng, lat];
            this.queryParams.longitude = lng;
            this.queryParams.latitude = lat;
            this.$nextTick().then(() =>
              this.$refs.mescroll.instance.triggerDownScroll()
            );
          } else {
            this.position = {
              formattedAddress: '定位失败，点击重试'
            };
          }
          this.loading = false;
        });
    },
    /**
     * 搜索回调
     * @param {String} result 搜索结果
     */
    onSearchResult(result) {
      const poi = result.pois[0] || {};
      this.queryParams = {
        ...this.queryParams,
        longitude: poi.lng || 0,
        latitude: poi.lat || 0
      };
      this.$refs.mescroll.instance.triggerDownScroll();
    },
    /**
     * 根据经纬度查询附近停车场列表
     * @param {Number} currentPage 当前页码
     */
    getNearMonthlyList(currentPage) {
      this.queryParams.currentPage = currentPage || 1;
      this.axios
        .get('v1/phtons/getNearLongRentList', {
          params: this.queryParams,
          silence: true
        })
        .then(resp => {
          let { datas, resultCount } = resp.result_data || {};
          datas = datas || [];
          if (this.queryParams.currentPage <= 1) {
            this.productList = datas;
          } else {
            this.productList = this.productList.concat(datas);
          }
          this.$refs.mescroll.instance.endBySize(datas.length, resultCount);
        })
        .catch(err => {
          console.error(err);
          this.$toast(err.message);
          this.$refs.mescroll.instance.endBySize(0);
          this.$refs.mescroll.instance.endErr();
        });
    },
    /**
     * 购买
     */
    buy(product) {
      this.$utils.setSessionItem('monthlyProduct', product, true);
      this.$utils.goPay(this, '/pay/monthly');
    }
  },
  components: {
    AmapSearchBox,
    'me-scroll': Mescroll
  }
};
</script>
<style lang="scss">
.monthly-wrapper {
  .search-box {
    top: 25px;
    width: 90%;
    left: calc(10% /2);
    z-index: 999;
    border: 0.5px solid #d9d9d9;
  }
  .page-container-label {
    width: 96%;
    left: calc(4% /2);
    color: #888;
    display: block;
    font-size: 13px;
    margin-left: 10px;
    position: relative;
    top: 40px;
    line-height: 1.4;
    .icon-location {
      font-size: 18px;
    }
  }
  .amap-box {
    display: none;
  }
  .mescroll {
    top: 22%;
    height: 78%;
    .mint-spinner-triple-bounce {
      top: 40%;
      position: fixed;
      width: 100%;
      text-align: center;
    }
  }
}
</style>