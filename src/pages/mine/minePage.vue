<template>
   <div class="minepage">
      <div class="mine-infor">
         <div class="container">
            <div class="flex">
               <div class="img">
                  <img :src="$store.getters.user.wxHeadimg || require('@/assets/integral-img.png')" />
               </div>
               <div class="text">
                  <div class="title">
                     <span v-if="userName !=null && userName !=''">{{userName}}</span>
                     <span v-else>{{"暂无名字" + agentCode}}</span>
                  </div>
                  <div class="identifi">
                     <i class="iconfont icon-yirenzheng"></i>
                  </div>
               </div>
            </div>
            <div class="editMineinfo">
               <router-link :to="{ path: '###' }">
                  <i class="iconfont icon-xg"></i>
                  修改个人信息
               </router-link>
            </div>
         </div>
      </div>

      <div class="mine-list">
         <mt-cell title="我的认证" icon=" iconfont icon-sfz" is-link :to="{ path: '/identification' }"></mt-cell>
         <mt-cell title="我的订单" icon=" iconfont icon-dd" is-link :to="{ path: '/order' }"></mt-cell>
         <mt-cell title="我的联盟" icon=" iconfont icon-hz" is-link :to="{ path: '/alliance' }"></mt-cell>
         <mt-cell title="我的业绩" icon=" iconfont icon-yj" is-link :to="{ path: '/integral' }"></mt-cell>
         <mt-cell title="邀请好友" icon=" iconfont icon-yq" is-link :to="{ path: '/friends' }"></mt-cell>
      </div>
   </div>
</template>

<script>
let self = null;
export default {
  data() {
    return {};
  },
  created() {
    self = this;
    self.agentCode = self.$store.getters.user.agentCode;
    self.userName = self.$store.getters.user.userName;
  }
};
</script>

<style lang="scss">
.iconfont {
  font-family: "iconfont" !important;
  font-size: 16px;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.icon-yq:before {
  content: "\e66c";
}

.icon-dd:before {
  content: "\e65b";
}

.icon-yj:before {
  content: "\e63b";
}

.icon-hz:before {
  content: "\e6a5";
}

.icon-arrow-r:before {
  content: "\e66a";
}

.icon-sfz:before {
  content: "\e61e";
}

.icon-xg:before {
  content: "\e658";
}

.minepage {
  .mine-infor {
    position: relative;
    display: flex;
    align-items: center;
    height: 200px;
    /*background: rgb(253, 0, 0);*/
    background: url(../../assets/mine-bg.png) top center no-repeat;
    padding-left: 20px;
    .container {
      .flex {
        display: flex;
        .img {
          width: 80px;
          img {
            width: 100%;
          }
        }
        .text {
          display: flex;
          align-items: center;
          margin-left: 20px;
          flex-direction: column;
          margin-top: 20px;
          .title {
            color: white;
            font-size: 20px;
            letter-spacing: 2px;
          }
          .identifi {
            color: #f4e927;
            margin-top: 6px;
            i {
              font-size: 14px;
            }
          }
        }
      }
      .editMineinfo {
        position: absolute;
        right: 5px;
        bottom: 10px;
        a {
          i {
            font-size: 14px;
          }
          text-decoration: none;
          font-size: 14px;
          color: #fff;
        }
      }
    }
  }
  .mine-list {
    .mint-cell {
      background: none;
      .mint-cell-wrapper {
        /*border-bottom: 1px solid #e1e0e0;*/
        font-size: 15px;
        line-height: 2.8;
        color: #242524;
        .iconfont {
          color: #f90000;
          font-size: 20px;
          padding-right: 10px;
          vertical-align: middle;
        }
      }
      .mint-cell-allow-right {
        &:after {
          width: 8px;
          height: 8px;
          border-width: 1px;
          border-bottom-width: 0;
          border-left-width: 0;
        }
      }
    }
  }
}
</style>