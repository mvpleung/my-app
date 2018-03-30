import Vue from 'vue';
import Router from 'vue-router';
import RouterConfig from '@/router/config.json';
import store from '@/store';
import * as Types from '@/store/types';
Vue.use(Router);

String.prototype.startWith = function(str, ignoreCase) {
  if (
    !str ||
    str === '' ||
    str === null ||
    this.length === 0 ||
    str.length > this.length
  ) {
    return false;
  }
  if (
    ignoreCase &&
      this.toUpperCase().substr(0, str.length) === str.toUpperCase() ||
    !ignoreCase && this.substr(0, str.length) === str
  ) {
    return true;
  }
  return false;
};

let camelCase = value => {
  let result = value
    .replace(/\d/gm, '')
    .replace(/[-|_](\w)/g, function($0, $1) {
      return $1.toUpperCase();
    })
    .replace(/[-|_]/gm, '');
  return result.substring(0, 1).toLowerCase() + result.substring(1);
};

const initRoute = rt => {
  let parentPath = rt.component ?
      rt.component.startWith('components') || rt.component.startWith('pages') ?
        '' :
        'pages' :
      null,
    route = {
      name: rt.name,
      path: rt.path,
      // component: resolve => require([`@/${parentPath}${rt.component}`], resolve), //懒加载
      redirect: rt.redirect,
      alias: rt.alias,
      meta: {
        title: rt.title || rt.name,
        description: rt.description
      }
    };
  parentPath !== null &&
    (route.component = () => import(`@/${parentPath}${rt.component}`)); //按需加载
  route.meta = Object.assign({}, route.meta, rt.meta);
  return route;
};
let vues = require
  .context('@/pages', true, /^((?!common|components).)*\.vue$/)
  .keys(); //自动扫描所有vue文件
const registerRoute = config => {
  let routes = [],
    index = -1;
  config.forEach(page => {
    //处理手动配置路由
    if ((index = vues.indexOf(`.${page.component}.vue`)) !== -1) {
      vues.splice(index, 1);
    }
    if (
      (page.meta || {}).test === true &&
      process.env.NODE_ENV === 'production'
    )
      //过滤 meta 中 test:true 的测试路由
      return;
    let route = initRoute(page);
    if (page.children && page.children.length > 0) {
      //子路由
      let children = [];
      page.children.map(child => {
        children.push(initRoute(child));
      });
      route.children = children;
    }
    routes.push(route);
  });

  //处理自动扫描vue
  let redirectArray = [];
  vues.forEach(vue => {
    const execs = vue.substring(2, vue.length - 4).split('/'),
      parentPath = vue.substring(1, vue.lastIndexOf('/'));
    if (execs.length > 1 && redirectArray.indexOf(parentPath) < 0) {
      routes.push({
        path: parentPath,
        redirect: `${parentPath}/index`
      });
      redirectArray.push(parentPath);
    }
    routes.push({
      name: camelCase((execs.slice(-2, -1) || '') + '_' + execs.slice(-1)),
      path: vue.substring(1, vue.length - 4) + '/:title?',
      component: () => import(`@/pages${vue.substring(1)}`),
      meta: {
        requireAuth: true,
        keepAlive: true
      }
    });
  });
  redirectArray = null;
  return routes;
};
const routes = registerRoute(RouterConfig);
routes.push({
  path: '/',
  redirect: '/parkinglot/list'
});

const router = new Router({
  routes
});
router.beforeEach((to, from, next) => {
  router.app.$indicator.close();
  //处理路由导航（前进 or 后退）
  navigationBehavior(from, to);
  //初始化用户信息（详情 /store/modules/user）
  store.dispatch(Types.INIT_USER);
  if (
    ($globalConfig.navigator.isWechat || $globalConfig.navigator.isAlipay) && //判断该路由是否需要登录权限
    to.matched.some(r => r.meta.requireAuth)
  ) {
    //通过vuex state 判断是否登录
    if (store.getters.isLogin) {
      //更新账户信息
      updateAccount(to, next, true);
    } else {
      //未登录，触发授权登录事件
      next(oauth(to));
    }
  } else {
    next();
  }
});

router.afterEach((to, from) => {
  Vue.nextTick(() => {
    //滚动位置保持
    setTimeout(() => {
      let position = store.getters.scrollMap[location.hash] || {};
      scrollTo(position.x, position.y);
    }, 100);
  });
});

/**
 * 跳转授权
 * @param {Router} to 目标路由
 */
let oauth = to => {
  return {
    path: '/oauth',
    query: Object.assign({}, { redirect: to.fullPath }, to.query)
  };
};

/**
 * 获取账户信息
 * @param {Object} to
 * @param {Object} next
 * @param {Boolean} retry 是否重试
 */
let updateAccount = (to, next, retry) => {
  store
    .dispatch(Types.UPDATE_ACCOUNT)
    .then(() => next())
    .catch(err => {
      if (err.code === 15002) {
        //会员不存在（手机不存在），重新获取用户信息
        next(oauth(to));
      } else {
        //重试一次
        retry ? updateAccount(to, next) : next();
      }
    });
};

/**
 * 存储滚动位置
 * @param {String} path  路径
 * @param {Number} scroll 滚动距离
 */
let saveHashScroll = (path, scroll) => {
  store.dispatch(Types.SAVE_HASH_SCROLL, { hash: '#' + path, scroll: scroll });
};

/**
 * 处理路由导航
 * @param {Router} from
 * @param {Router} to
 */
let navigationBehavior = (from, to) => {
  //存储滚动距离
  saveHashScroll(from.fullPath, {
    x: window.pageXOffset,
    y: window.pageYOffset
  });
  //缓存路由信息，用于前进 or 后退识别
  let routeLength = store.getters.chainLength;
  if (routeLength === 0) {
    store.dispatch(Types.SET_PAGE_DIRECTION, 'fade');
    if (to.path === from.path && to.path === '/') {
      //当直接打开根路由的时候
      store.dispatch(Types.ADD_ROUTE_CHAIN, to);
    } else {
      //直接打开非根路由的时候其实生成了两个路径，from其实就是根路由
      store.dispatch(Types.ADD_ROUTE_CHAIN, [from, to]);
    }
  } else if (routeLength === 1) {
    forward(from, to);
  } else {
    let lastBeforeRoute = store.getters.routeChain[routeLength - 2];
    if (lastBeforeRoute.path === to.path) {
      //返回
      store.dispatch(Types.POP_ROUTE_CHAIN);
      store.dispatch(Types.SET_PAGE_DIRECTION, 'slide-right');
      back(from, to);
    } else {
      //前进
      forward(from, to);
    }
  }
};

/**
 * 前进路由
 */
let forward = (from, to) => {
  saveHashScroll(to.fullPath, { x: 0, y: 0 }); //前进时，滚动到顶部
  store.dispatch(Types.SET_PAGE_DIRECTION, 'slide-left');
  store.dispatch(Types.ADD_ROUTE_CHAIN, to);
};
/**
 * 后退路由
 */
let back = (from, to) => {
  typeof from.meta.keepAlive !== 'undefined' && (from.meta.keepAlive = false);
  typeof to.meta.keepAlive !== 'undefined' && (to.meta.keepAlive = true);
};

export default router;
