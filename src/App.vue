<template>
	<div id="app">
		<div v-if="$router.currentRoute.query.search === 'search'" class="mint-searchbar"><div class="mint-searchbar-inner"><i class="mintui mintui-search"></i><input v-model="search" type="search" placeholder="搜索" class="mint-searchbar-core"></div><a class="mint-searchbar-cancel" style="display: none;">取消</a></div>
		<keep-alive>
			<router-view v-if="$router.currentRoute.meta.keepAlive"></router-view>
		</keep-alive>
		<router-view v-if="!$router.currentRoute.meta.keepAlive"></router-view>
	</div>
</template>

<script>
import command from '@/js/command';
import { mapState } from 'vuex';
export default {
  name: 'app',
  data() {
    return {
      search: ''
    };
  },
  watch: {
    search(val, oldVal) {
      command.exec(this, val);
    }
  },
  computed: {
    ...mapState({
      pageDirection: state => state.global.pageDirection
    })
  },
  created() {
    //解决微信 title 设置异常问题
    document.setTitle = title => {
      document.title = title;
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
  beforeCreate() {}
};
</script>

<style lang="scss">
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
</style>