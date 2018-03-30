/*
 * 个人中心
 * @Author: liangzc 
 * @Date: 2018-01-27 14:26:16 
 * @Last Modified by: liangzc
 * @Last Modified time: 2018-03-28 16:35:00
 */
<template>
  <div class="minepage">
    <div class="mine-infor">
      <div class="mine-head-img">
        <img class="ignore"
          :src="headImg">
      </div>
      <div class="mine-nick-name">
        <span>{{ userInfo.nick_name }}</span>
      </div>
      <div class="mine-link-desc">
        <template v-if="!$utils.isEmpty(userInfo.mobile)">
          <span>已绑定{{ userInfo.mobile }}</span>
          <a @click="logout">
            登出
          </a>
        </template>
        <template v-else>
          <span>未绑定手机，</span>
          <router-link :to="`/mine/phonebinding?redirect=${$route.fullPath}`">
            去绑定
          </router-link>
        </template>
      </div>
    </div>
    <div>
      <grid-view class="mine-top-grid">
        <grid-item slot="grid"
          :label="`余额:${cashAccount}`" />
        <grid-item slot="grid"
          :label="`积分:${accountInfo.integralAccount || '0'}`" />
        <grid-item slot="grid"
          :label="`优惠券:${accountInfo.discountCount || '0'}`" />
      </grid-view>
      <grid-view class="mt-30"
        :items="items"
        @item-click="goLink" />
    </div>
  </div>
</template>

<script>
import { GridView, GridItem } from '@/components';
import { mapActions } from 'vuex';
export default {
  data() {
    return {
      accountInfo: this.$store.getters.account,
      items: [
        {
          label: '车位预订',
          iconfont: {
            color: '#1296db',
            content: '&#xe8f9;'
          }
        },
        {
          label: '错峰产品',
          iconfont: {
            color: '#d4237a',
            content: '&#xe6b7;'
          },
          link: '/staggeringpeak'
        },
        {
          label: '包月续租',
          iconfont: {
            color: '#d81e06',
            content: '&#xe61c;'
          },
          link: '/monthly'
        },
        {
          label: '充值',
          iconfont: {
            color: '#d81e06',
            content: '&#xe628;'
          },
          link: '/pay/recharge'
        },
        {
          label: '优惠券',
          iconfont: {
            color: '#13227a',
            content: '&#xe63f;'
          },
          link: '/coupon/index'
        },
        {
          label: '停车记录',
          iconfont: {
            color: '#333',
            content: '&#xe66b;'
          },
          link: '/parkingfee/record'
        },
        {
          label: '账单',
          iconfont: {
            color: '#2c2c2c',
            content: '&#xe6b8;'
          },
          link: '/mine/bills'
        },
        {
          label: '发票',
          iconfont: {
            color: '#515151',
            content: '&#xe654;'
          },
          link: '/mine/invoice'
        },
        {
          label: '信用付',
          iconfont: {
            color: '#d81e06',
            content: '&#xe675;'
          }
        },
        {
          label: '联系我们',
          iconfont: {
            color: '#333',
            content: '&#xe634;'
          },
          link: '/mine/contact'
        }
      ],
      bannerData: [
        {
          imgUrl: require('@/assets/banner_ex.png')
        }
      ]
    };
  },
  activated() {
    this.init();
  },
  computed: {
    /**
     * 用户信息
     */
    userInfo() {
      return this.$store.getters.user;
    },
    /**
     * 头像
     */
    headImg() {
      return this.userInfo.avatar || require('@/assets/face_holder.png');
    },
    /**
     * 账户余额
     */
    cashAccount() {
      return ((this.accountInfo.cashAccount || 0) / 100).toFixed(2) || 0;
    }
  },
  methods: {
    init() {
      if (this.$utils.isEmpty(this.userInfo.mobile)) {
        this.$router.push(
          `/mine/phonebinding?redirect=${this.$route.fullPath}`
        );
        return;
      }
    },
    /**
     * 九宫格跳转
     */
    goLink(item) {
      if (item.link === '/pay/recharge') {
        this.$utils.goPay(this, item.link);
      } else if (item.link) {
        this.$router.push(item.link);
      }
    },
    /**
     * 退出登录
     */
    logout() {
      this.updateMobile(null);
      this.$router.push(`/mine/phonebinding?redirect=${this.$route.fullPath}`);
    },
    ...mapActions(['updateMobile'])
  },
  components: {
    GridView,
    GridItem
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
    height: 150px;
    padding-top: 8%;
    text-align: center;
    background: url(../../assets/red_bg.png) top center no-repeat;
    .mine-head-img {
      width: 80px;
      height: 80px;
      margin: 0 auto;
      img.ignore {
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
      a {
        color: darkblue;
        text-decoration: underline;
      }
    }
  }
  .mt-30 {
    margin-top: 30px;
  }
}
</style>