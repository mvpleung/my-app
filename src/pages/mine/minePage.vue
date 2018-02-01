<template>
  <div class="minepage">
    <div class="mine-infor">
      <div class="head-img">
        <img :src="$store.getters.user.wxHeadimg || require('@/assets/integral-img.png')" />
      </div>
      <div class="nick-name">
        <span>测试</span>
      </div>
      <div class="link-desc">
        <span>已绑定1305887284</span>
        <router-link :to="{ path: '###' }">
          更换
        </router-link>
      </div>
    </div>
    <div>
      <grid-view class="top-grid">
        <grid-item slot="grid" :label="`余额:${userInfo.balance}`"></grid-item>
        <grid-item slot="grid" :label="`积分:${userInfo.integral}`"></grid-item>
        <grid-item slot="grid" :label="`优惠券:${userInfo.coupon}`"></grid-item>
      </grid-view>
      <swipe class="mt-30" :bannerData="bannerData"></swipe>
      <grid-view class="mt-30" :items="items"></grid-view>
      <swipe class="mt-30" :bannerData="bannerData"></swipe>
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
          icon: require('@/assets/icon_tabbar.png')
        },
        {
          label: '包月续租',
          icon: require('@/assets/icon_tabbar.png')
        },
        {
          label: '停车券',
          icon: require('@/assets/icon_tabbar.png')
        },
        {
          label: '优惠券',
          icon: require('@/assets/icon_tabbar.png')
        },
        {
          label: '停车记录',
          icon: require('@/assets/icon_tabbar.png')
        },
        {
          label: '账单',
          icon: require('@/assets/icon_tabbar.png')
        },
        {
          label: '发票',
          icon: require('@/assets/icon_tabbar.png')
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

<style lang="scss">
.minepage {
  .top-grid {
    p {
      font-size: 15px !important;
    }
  }
  .mine-infor {
    height: 180px;
    padding-top: 8%;
    text-align: center;
    background: url(../../assets/mine-bg.png) top center no-repeat;
    .head-img {
      width: 80px;
      margin: 0 auto;
      img {
        width: 100%;
        border-radius: 50px;
      }
    }
    .nick-name {
      color: rgba(255, 255, 255, 0.829);
      font-size: 14px;
      margin-top: 10px;
    }
    .link-desc {
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