/*
 * 个人中心
 * @Author: liangzc 
 * @Date: 2018-01-27 14:26:16 
 * @Last Modified by: liangzc
 * @Last Modified time: 2018-02-09 15:20:25
 */
<template>
  <div class="minepage">
    <div class="mine-infor">
      <div class="mine-head-img">
        <img :src="$store.getters.user.wxHeadimg || require('@/assets/integral-img.png')"
        />
      </div>
      <div class="mine-nick-name">
        <span>测试</span>
      </div>
      <div class="mine-link-desc">
        <span>已绑定1305887284</span>
        <router-link to="/mine/phonebinding">
          更换
        </router-link>
      </div>
    </div>
    <div>
      <grid-view class="mine-top-grid">
        <grid-item slot="grid"
          :label="`余额:${userInfo.balance}`" />
        <grid-item slot="grid"
          :label="`积分:${userInfo.integral}`" />
        <grid-item slot="grid"
          :label="`优惠券:${userInfo.coupon}`" />
      </grid-view>
      <swipe class="mt-30"
        :bannerData="bannerData" />
      <grid-view class="mt-30"
        :items="items" />
      <swipe class="mt-30"
        :bannerData="bannerData" />
    </div>
  </div>
</template>

<script>
import { GridView, GridItem, Swipe } from '@/components';
export default {
  data() {
    return {
      userInfo: {
        balance: 0,
        integral: 66,
        coupon: 5
      },
      items: [
        {
          label: '车位预订',
          icon: require('@/assets/icon_tabbar.png')
        },
        {
          label: '错峰成品',
          icon: require('@/assets/icon_tabbar.png'),
          link: '/staggeringpeak'
        },
        {
          label: '包月续租',
          icon: require('@/assets/icon_tabbar.png'),
          link: '/monthly'
        },
        {
          label: '停车券',
          icon: require('@/assets/icon_tabbar.png'),
          link: '/mine/parkingcoupon'
        },
        {
          label: '优惠券',
          icon: require('@/assets/icon_tabbar.png'),
          link: '/mine/coupon'
        },
        {
          label: '停车记录',
          icon: require('@/assets/icon_tabbar.png'),
          link: '/parkingfee/parkingrecord'
        },
        {
          label: '账单',
          icon: require('@/assets/icon_tabbar.png'),
          link: '/mine/bills'
        },
        {
          label: '发票',
          icon: require('@/assets/icon_tabbar.png'),
          link: '/mine/invoice'
        },
        {
          label: '信用付',
          icon: require('@/assets/icon_tabbar.png')
        }
      ],
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
  created() {},
  components: {
    GridView,
    GridItem,
    Swipe
  }
};
</script>

<style lang="scss" scoped>
.minepage {
  .mine-top-grid {
    p {
      font-size: 15px !important;
    }
  }
  .mine-infor {
    height: 180px;
    padding-top: 8%;
    text-align: center;
    background: url(../../assets/mine-bg.png) top center no-repeat;
    .mine-head-img {
      width: 80px;
      margin: 0 auto;
      img {
        width: 100%;
        border-radius: 50px;
      }
    }
    .mine-nick-name {
      color: rgba(255, 255, 255, 0.829);
      font-size: 14px;
      margin-top: 10px;
    }
    .mine-link-desc {
      color: rgba(255, 255, 255, 0.705);
      font-size: 12px;
      margin-top: 20px;
    }
  }
  .mt-30 {
    margin-top: 30px;
  }
}
</style>