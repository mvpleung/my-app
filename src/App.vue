<template>
  <div id="app">
    <div v-if="$router.currentRoute.query.search === 'search'"
      class="mint-searchbar">
      <div class="mint-searchbar-inner">
        <i class="mintui mintui-search" /><input v-model="search"
          type="search"
          placeholder="搜索"
          class="mint-searchbar-core"></div>
      <a class="mint-searchbar-cancel"
        style="display: none;">取消</a>
    </div>
    <keep-alive>
      <router-view v-show="!globalLoading"
        v-if="$router.currentRoute.meta.keepAlive" />
    </keep-alive>
    <router-view v-show="!globalLoading"
      v-if="!$router.currentRoute.meta.keepAlive" />
    <mt-spinner v-show="globalLoading"
      class="app-spinner"
      type="triple-bounce"
      :size="60" />
  </div>
</template>

<script>
import command from '@/js/command';
import { mapState, mapActions } from 'vuex';
export default {
  name: 'app',
  data() {
    return {
      search: '',
      title: {}
    };
  },
  watch: {
    search(val, oldVal) {
      command.exec(this, val);
    },
    $route(to, from) {
      document.setTitle(
        to.meta.title || to.params.title || this.title[to.name]
      );
      this.hideLoading();
      this.$messagebox.close();
    }
  },
  computed: {
    ...mapState({
      pageDirection: state => state.global.pageDirection,
      globalLoading: state => state.global.globalLoading
    })
  },
  created() {
    //解决微信 title 设置异常问题
    document.setTitle = (title, currentRoute) => {
      document.title = title || '';
      this.title[currentRoute ? currentRoute.name : this.$route.name] =
        title || '';
      if (/ip(hone|od|ad)/i.test(navigator.userAgent)) {
        var i = document.createElement('iframe');
        i.src = '../favicon.ico';
        i.style.display = 'none';
        i.onload = function() {
          setTimeout(function() {
            i.remove();
          }, 9);
        };
        document.body.appendChild(i);
      }
    };
  },
  methods: {
    ...mapActions(['showLoading', 'hideLoading'])
  }
};
</script>

<style lang="scss">
#app {
  .app-spinner {
    .mint-spinner-triple-bounce {
      text-align: center;
      width: 100%;
      position: fixed;
      top: 35%;
    }
  }
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.5s ease;
  }
  .fade-enter,
  .fade-leave-active {
    opacity: 0;
  }
  .child-view {
    position: relative;
    transition: all 0.3s cubic-bezier(0.55, 0, 0.1, 1);
  }
  .slide-left-enter,
  .slide-right-leave-active {
    opacity: 0;
    -webkit-transform: translate(30px, 0);
    transform: translate(30px, 0);
  }
  .slide-left-leave-active,
  .slide-right-enter {
    opacity: 0;
    -webkit-transform: translate(-30px, 0);
    transform: translate(-30px, 0);
  }
}
</style>