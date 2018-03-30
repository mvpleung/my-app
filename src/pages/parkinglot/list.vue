/*
 * 找车位
 * @Author: liangzc 
 * @Date: 2018-01-30 14:31:46 
 * @Last Modified by: liangzc
 * @Last Modified time: 2018-03-26 15:49:05
 */
<template>
  <div class="parking-list">
    <el-amap-search-box class="search-box"
      :search-option="searchOption"
      :on-search-result="onSearchResult" />
    <el-amap class="amap-box"
      ref="amap"
      :style="{width: mapStyle.width + 'px', height: mapStyle.height + 'px'}"
      :vid="'amap-vue'"
      :center="mapCenter"
      :plugin="plugin"
      :zoom="zoom">
      <el-amap-marker v-for="(marker, index) in markers"
        :key="index"
        :position="marker.position"
        :events="marker.events"
        :content="marker.content" />
    </el-amap>
    <me-scroll ref="mescroll"
      class="page-container"
      :opt-down="{ auto: false }"
      :opt-up="{  auto: false, empty: { tip: '没有搜索到相关停车场' }}"
      :up-callback="() => getNearParkList(queryParams.currentPage+1)"
      :down-callback="() => getNearParkList(1)">
      <mt-spinner v-show="$utils.isEmpty(queryParams.longitude)"
        type="triple-bounce"
        :size="60" />
      <mt-cell v-for="(parking, i) in parkingList"
        :key="i + 1000"
        :data-index="i"
        class="mint-cell--large"
        @click.native="navigation(parking)">
        <template slot="title">
          <span class="mint-cell-text">{{ parking.name }}</span>
          <span class="mint-cell-label"
            v-show="position.lng && position.lat">
            距您：{{ parking | distance(position) }}
          </span>
          <span class="mint-cell-label">{{ parking.address }}</span>
          <span class="mint-cell-label">收费标准：{{ parking.charge }}</span>
        </template>
        <template>
          <mt-badge :type="parking | badgeType">
            {{ parking.allSCount }}
          </mt-badge>
          <span class="mint-cell-label mint-cell-value--link"
            @click.stop="navigation(parking)">去这里>></span>
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
      mapStyle: {
        width: 400,
        height: 400
      },
      mapCenter: [-1, -1],
      zoom: 15,
      markers: [],
      markerRefs: [],
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
        },
        {
          pName: 'ToolBar',
          position: 'RB',
          ruler: false,
          liteStyle: true,
          direction: false
        },
        'Scale'
      ],
      pois: [],
      //停车场查询参数
      queryParams: {
        longitude: '', //精度
        latitude: '', //纬度
        status: '0', //0:全部;1:支持电子支付;2:支持错峰
        currentPage: 1,
        pageSize: 20
      },
      parkingList: [],
      position: {} //定位信息
    };
  },
  created() {
    document.setTitle('找车位');
    this.$nextTick(() => {
      this.resetMapSize();
    });
    let resizeFunc = window.onresize;
    window.onresize = () => {
      this.resetMapSize();
      resizeFunc && resizeFunc.apply(this, arguments);
    };
  },
  watch: {
    /**
     * 点聚合
     */
    markerRefs(val) {
      if (val.length === this.markers.length) {
        if (!this.markerClusterer) {
          this.markerClusterer = new AMap.MarkerClusterer(
            this.$refs.amap.$$getInstance(),
            this.markerRefs,
            { gridSize: 80 }
          );
        } else {
          this.markerClusterer.clearMarkers();
          this.markerClusterer.addMarkers(this.markerRefs);
        }
      }
    }
  },
  filters: {
    /**
     * 距离
     */
    distance(parking, position = {}) {
      let distance = parseInt(
        AMap.GeometryUtil.distance(
          [position.lng, position.lat],
          [parking.longitude, parking.latitude]
        )
      );
      !isNaN(distance) &&
        (parking.distanceDesc =
          distance <= 0 ?
            '<1米' :
            distance >= 1000 ?
              `${(distance / 1000).toFixed(1)}公里` :
              `${distance}米`);
      return parking.distanceDesc;
    },
    /**
     * 根据车位剩余量展示不同颜色
     */
    badgeType(parking) {
      parking.countBadgeType =
        parking.allSCount === 0 ?
          'error' :
          parking.allSCount <= parking.allCount / 3 ? 'warning' : 'success';
      return parking.countBadgeType;
    }
  },
  methods: {
    /**
     * 重置地图尺寸
     */
    resetMapSize() {
      this.mapStyle = {
        width: window.innerWidth,
        height: window.innerHeight / 2
      };
    },
    initEvent(map) {
      this.$nextTick(() => {
        //手动处理定位iCON位置
        let geoIcon = document.getElementsByClassName(
          'amap-geolocation-con'
        )[0];
        if (geoIcon) {
          geoIcon.style.right = 14 + 'px';
          geoIcon.style.bottom = 130 + 'px';
        }
      });
      // o 是高德地图定位插件实例
      map.getCurrentPosition((status, result) => {
        if (result && result.position) {
          const { lng, lat } = this.position = result.position;
          this.searchOption.city = (result.addressComponent || {}).city;
          this.mapCenter = [lng, lat];
          this.queryParams.longitude = lng;
          this.queryParams.latitude = lat;
          this.$nextTick().then(() =>
            this.$refs.mescroll.instance.triggerDownScroll()
          );
        }
      });
    },
    /**
     * 搜索结果回调
     * @param {Array} pois 附近搜索列表
     */
    onSearchResult(pois) {
      const poi = pois[0] || {};
      this.queryParams = {
        ...this.queryParams,
        currentPage: 1,
        longitude: poi.lng || 0,
        latitude: poi.lat || 0
      };
      this.$refs.mescroll.instance.triggerDownScroll();
    },
    /**
     * 根据经纬度查询附近停车场列表
     * @param {Number} currentPage 当前页码
     */
    getNearParkList(currentPage, page) {
      this.queryParams.currentPage = currentPage || 1;
      this.axios
        .get('v1/phtons/getNearParkList', {
          params: this.queryParams,
          silence: true
        })
        .then(resp => {
          let { datas, resultCount } = resp.result_data || {};
          datas = datas || [];
          if (this.queryParams.currentPage <= 1) {
            this.parkingList = datas;
          } else {
            this.parkingList = this.parkingList.concat(datas);
          }
          this.addMarkers(datas);
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
     * 增加Marker
     * @param {Array} parkingList 附近搜索列表
     */
    addMarkers(parkingList) {
      let latSum = 0,
        lngSum = 0,
        markerArray = [],
        markerRefs = [];
      parkingList.forEach((parking, i) => {
        lngSum += Number(parking.longitude);
        latSum += Number(parking.latitude);
        markerArray.push({
          position: [Number(parking.longitude), Number(parking.latitude)],
          content: this.getMarkerContent(i),
          events: {
            click: () => {
              this.cellClick(i);
            },
            init: o => {
              markerRefs.push(o);
            }
          }
        });
      });
      this.markers =
        this.queryParams.currentPage <= 1 ?
          markerArray :
          this.markers.concat(markerArray);

      this.markerRefs =
        this.queryParams.currentPage <= 1 ?
          markerRefs :
          this.markerRefs.concat(markerRefs);

      parkingList.length > 0 &&
        (this.mapCenter = [
          lngSum / parkingList.length,
          latSum / parkingList.length
        ]);
    },
    /**
     * 获取Marker内容
     * @param {Number} i 下标
     * @param {Number} currentIndex 当前下标
     */
    getMarkerContent(i, currentIndex) {
      return `<img src="http://webapi.amap.com/theme/v1.3/markers/n/mark_${
        i === currentIndex ? 'r' : 'b'
      }.png"/><span>${i + 1}</span>`;
    },
    /**
     * 导航
     */
    navigation(parking) {
      const { longitude, latitude, name } = parking;
      location.href = `http://uri.amap.com/navigation?from=${
        this.position.lng
      },${
        this.position.lat
      },我的位置&to=${longitude},${latitude},${name}&src=phtons&callnative=1`;
    },
    /**
     * 停车场详情
     */
    parkingDetails(parking) {
      parking.currentPosition = this.position;
      this.$utils.setSessionItem('parkinglot', parking);
      this.$router.push('details');
    },
    cellClick(i) {
      this.markers.forEach((marker, index) => {
        index !== i && (marker.content = this.getMarkerContent(index));
      });
      this.$nextTick(() => {
        this.markers[i].content = this.getMarkerContent(i, i);
      });
      this.mapCenter = this.markers[i].position;
      this.$refs.mescrollpark.scrollTo(
        0,
        document.querySelector(`.mint-cell[data-index="${i}"]`).offsetTop
      );
    }
  },
  components: {
    'me-scroll': Mescroll
  }
};
</script>
<style lang="scss">
.parking-list {
  .search-box {
    position: fixed;
    top: 25px;
    width: 80%;
    left: calc(20% /2);
    z-index: 999;
    opacity: 0.8;
  }
  .amap-box {
    width: 400px;
    height: 400px;
  }
  .amap-marker-content span {
    color: white;
    font-size: 12px;
    position: absolute;
    left: 2px;
    top: 3px;
    width: 75%;
    text-align: center;
  }
  .mescroll.page-container {
    height: 50%;
    .mint-spinner-triple-bounce {
      margin-top: 35px;
      width: 100%;
      text-align: center;
    }
    .mint-cell--large {
      .mint-cell-wrapper {
        padding: 20px 10px 20px 10px;
        .mint-cell-value {
          display: block;
          text-align: right;
          .mint-cell-value--link {
            color: #6d6df3;
            font-size: 13px;
            margin-top: 20px;
            text-decoration: underline;
          }
        }
      }
    }
  }
}
</style>