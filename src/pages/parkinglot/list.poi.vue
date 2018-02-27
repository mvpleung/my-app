/*
 * 找车位
 * @Author: liangzc 
 * @Date: 2018-01-30 14:31:46 
 * @Last Modified by: liangzc
 * @Last Modified time: 2018-02-13 15:38:54
 */
<template>
  <div class="amap-wrapper">
    <el-amap-search-box class="search-box"
      :search-option="searchOption"
      :on-search-result="onSearchResult"></el-amap-search-box>
    <el-amap class="amap-box"
      :style="{width: mapStyle.width + 'px', height: mapStyle.height + 'px'}"
      :vid="'amap-vue'"
      :plugin="plugin"
      :center="mapCenter"
      :zoom="zoom">
      <el-amap-marker v-for="(marker, index) in markers"
        :key="index"
        :position="marker.position"
        :events="marker.events"
        :content="marker.content"></el-amap-marker>
      <el-amap-info-window v-for="(window, index) in windows"
        :key="index + 1000"
        :position="window.position"
        :visible="window.visible"
        :content="window.content"></el-amap-info-window>
    </el-amap>
    <div :style="{height: mapStyle.height + 'px', overflow: 'auto'}">
      <mt-cell v-for="(poi, i) in pois"
        :key="i + 10000"
        :title="poi.name"
        :label="poi.address"
        @click.native="cellClick(i)" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'parking-map',
  data() {
    return {
      mapStyle: {
        width: 400,
        height: 400
      },
      mapCenter: [-1, -1],
      zoom: 15,
      markers: [],
      windows: [],
      searchOption: {},
      plugin: [
        {
          pName: 'Geolocation',
          buttonPosition: 'RB',
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
      pois: []
    };
  },
  created() {
    this.$nextTick(() => {
      this.resetMapSize();
    });
    let resizeFunc = window.onresize;
    window.onresize = () => {
      this.resetMapSize();
      resizeFunc && resizeFunc.apply(this, arguments);
    };
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
      //手动处理定位iCON位置
      let geoIcon = document.getElementsByClassName('amap-geolocation-con')[0];
      geoIcon.style.right = 14 + 'px';
      geoIcon.style.bottom = 130 + 'px';
      // o 是高德地图定位插件实例
      map.getCurrentPosition((status, result) => {
        if (result && result.position) {
          this.searchOption.city = (result.addressComponent || {}).city;
          this.center = [result.position.lng, result.position.lat];
          this.$nextTick();
        }
      });
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
     * 增加Marker
     * @param {Array} pois 附近搜索列表
     */
    addMarkers(pois) {
      let latSum = 0,
        lngSum = 0;
      pois.forEach((poi, i) => {
        lngSum += poi.lng;
        latSum += poi.lat;
        this.markers.push({
          position: [poi.lng, poi.lat],
          content: this.getMarkerContent(i),
          events: {
            click: () => {
              this.cellClick(i);
            }
          }
        });
        this.mapCenter = [lngSum / pois.length, latSum / pois.length];
      });
    },
    /**
     * 搜索结果回调
     * @param {Array} pois 附近搜索列表
     */
    onSearchResult(pois) {
      this.pois = pois;
      this.markers = [];
      if (pois.length > 0) {
        this.addMarkers(pois);
      }
    },
    cellClick(i) {
      this.markers.forEach((marker, index) => {
        index !== i && (marker.content = this.getMarkerContent(index));
      });
      this.$nextTick(() => {
        this.markers[i].content = this.getMarkerContent(i, i);
      });
      this.mapCenter = this.markers[i].position;
    }
  }
};
</script>
<style lang="scss">
.amap-wrapper {
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
}
</style>