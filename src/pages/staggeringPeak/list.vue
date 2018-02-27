/*
 * 错峰产品列表
 * @Author: liangzc 
 * @Date: 2018-01-30 14:31:46 
 * @Last Modified by: liangzc
 * @Last Modified time: 2018-02-27 11:04:46
 */
<template>
  <div class="amap-wrapper">
    <amap-search-box class="search-box"
      :search-option="searchOption"
      :on-search-result="onSearchResult" />
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
        :content="marker.content" />
      <el-amap-info-window v-for="(window, index) in windows"
        :key="index + 1000"
        :position="window.position"
        :visible="window.visible"
        :content="window.content" />
    </el-amap>
    <div :style="{height: mapStyle.height + 'px', overflow: 'auto'}"
      v-infinite-scroll="() => getNearStaProList(queryParams.currentPage++)"
      :infinite-scroll-disabled="hasMore"
      infinite-scroll-distance="50">
      <mt-cell v-for="(poi, i) in pois"
        :key="i + 10000"
        :title="poi.name"
        :label="poi.address"
        @click.native="cellClick(i)" />
    </div>
  </div>
</template>

<script>
import { amapSearchBox } from '@/components';
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
      windows: [],
      searchOption: {
        citylimit: true
      },
      //地图插件
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
      pois: [],
      //停车场查询参数
      queryParams: {
        longitude: '', //精度
        latitude: '', //纬度
        keyWords: '', //关键字
        currentPage: 1,
        pageSize: 10
      },
      hasMore: true,
      parkingList: []
    };
  },
  created() {
    document.setTitle('错峰产品');
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
          const { lng, lat } = result.position;
          this.searchOption.city = (result.addressComponent || {}).city;
          this.center = [lng, lat];
          this.queryParams.longitude = lng;
          this.queryParams.latitude = lat;
          this.$nextTick().then(() => this.getNearStaProList());
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
     * 搜索回调
     * @param {String} result 搜索结果
     */
    onSearchResult(result) {
      this.queryParams.keyWords = result.keyword;
      this.getNearStaProList();
    },
    /**
     * 根据经纬度查询附近停车场列表
     * @param {Number} currentPage 当前页码
     */
    getNearStaProList(currentPage) {
      this.queryParams.currentPage = currentPage || 1;
      this.axios
        .get('v1/', {
          params: this.queryParams
        })
        .then(resp => {
          let resultData = resp.result_data || {};
          if (this.queryParams.currentPage <= 1) {
            this.parkingList = resultData.datas;
          } else {
            this.parkingList = this.parkingList.concat(resultData.datas);
          }
          this.hasMore = resultData.resultCount >= this.queryParams.pageSize;
        });
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
  },
  components: {
    amapSearchBox
  }
};
</script>
<style lang="scss" scoped>
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