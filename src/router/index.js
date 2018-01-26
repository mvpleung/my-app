import Vue from 'vue'
import Router from 'vue-router'
import RouterConfig from '@/router/config.json'
import store from '@/store'
import * as Types from '@/store/types'
Vue.use(Router);

String.prototype.startWith = function (str, ignoreCase) {
    if (str == null || str == "" || this.length == 0 || str.length > this.length)
        return false;
    if ((ignoreCase && this.toUpperCase().substr(0, str.length) == str.toUpperCase()) || (!ignoreCase && this.substr(0, str.length) == str))
        return true;
    else
        return false;
    return true;
}
Array.prototype.indexOf = function (val) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] == val) return i;
    }
    return -1;
};

const initRoute = (rt) => {
    let parentPath = rt.component.startWith('components') || rt.component.startWith('pages') ? '' : 'pages',
        route = {
            name: rt.name,
            path: rt.path,
            // component: resolve => require([`@/${parentPath}${rt.component}`], resolve), //懒加载
            component: () =>
                import(`@/${parentPath}${rt.component}`), //按需加载
            redirect: rt.redirect,
            meta: {
                title: rt.title || rt.name,
                description: rt.description
            }
        }
    route.meta = Object.assign({}, route.meta, rt.meta)
    return route;
}
let vues = require.context("@/pages", true, /^((?!common|components).)*\.vue$/).keys(); //自动扫描所有vue文件
const registerRoute = (config) => {
    let routes = [],
        index = -1;
    config.forEach(page => { //处理手动配置路由
        if ((index = vues.indexOf(`.${page.component}.vue`)) !== -1) {
            vues.splice(index, 1);
        }
        let route = initRoute(page);
        if (page.children && page.children.length > 0) { //子路由
            let children = [];
            page.children.map(child => {
                children.push(initRoute(child));
            });
            route.children = children;
        }
        routes.push(route);
    });

    //处理自动扫描vue
    vues.forEach(vue => {
        let vueName = vue.substring(vue.lastIndexOf('/'), vue.lastIndexOf('.'));
        let exec = /\.\/([^/]+)\//g.exec(vue) || [],
            path = vueName + '/:title?';
        routes.push({
            name: path.substring(1),
            path: path,
            component: () =>
                import(`@/pages${vue.substring(1)}`),
            meta: {
                requireAuth: true
            }
        });
    });
    return routes;
};
const routes = registerRoute(RouterConfig);
routes.push({
    path: '/',
    redirect: '/homePage'
});

const router = new Router({
    routes
})
router.beforeEach((to, from, next) => {
    router.app.$indicator.close();
    from.path === '/' ? document.title = (to.meta.title || to.params.title || document.title) : document.setTitle(to.meta.title || to.params.title || document.title);
    navigationBehavior(from, to);
    if (globalConfig.requireAuth && to.matched.some(r => r.meta.requireAuth)) { //判断该路由是否需要登录权限
        if (store.getters.isLogin) { //通过vuex state 判断是否登录
            store.dispatch(Types.CHECK_USER_INFO).then(() => {
                next();
            }).catch(err => {
                console.error(err);
            })
        } else { //未登录，触发授权登录事件
            let query = to.query;
            query.openId = query.openId || from.query.openId;
            query.userId = query.userId || from.query.userId;
            store.dispatch(Types.WAP_OAUTH, { query: query, redirectUri: window.location.origin + '/#' + to.fullPath }).then(route => {
                if (route.path || route.name) {
                    let query = Object.assign({}, { redirectUri: to.fullPath }, route.query);
                    delete query.userId;
                    delete query.openId;
                    route.query = query;
                    router.replace(route);
                } else {
                    next();
                }
            }).catch(error => {
                console.error(error);
            });
            // next({
            //     path: '/login',
            //     query: {
            //         redirect: to.fullPath
            //     } //将跳转的路由path作为参数
            // })
        }
    } else {
        next();
    }
})

router.afterEach(route => {
    Vue.nextTick(() => { //滚动位置保持
        setTimeout(() => {
            let position = store.getters.scrollMap[location.hash] || {};
            scrollTo(position.x, position.y)
        }, 100)
    })
})

/**
 * 存储滚动位置
 * @param {String} path  路径
 * @param {Number} scroll 滚动距离
 */
let saveHashScroll = (path, scroll) => {
    store.dispatch(Types.SAVE_HASH_SCROLL, { hash: '#' + path, scroll: scroll });
}

/**
 * 处理路由导航
 * @param {Router} from 
 * @param {Router} to 
 */
let navigationBehavior = (from, to) => {
    //存储滚动距离
    saveHashScroll(from.fullPath, { x: window.pageXOffset, y: window.pageYOffset });
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
        forward(to);
    } else {
        let lastBeforeRoute = store.getters.routeChain[routeLength - 2];
        if (lastBeforeRoute.path === to.path) { //返回
            store.dispatch(Types.POP_ROUTE_CHAIN);
            store.dispatch(Types.SET_PAGE_DIRECTION, 'slide-right');
        } else { //前进
            forward(to);
        }
    }
}

/**
 * 前进路由
 * @param {Router} route 
 */
let forward = route => {
    saveHashScroll(route.fullPath, { x: 0, y: 0 }); //前进时，滚动到顶部
    store.dispatch(Types.SET_PAGE_DIRECTION, 'slide-left');
    store.dispatch(Types.ADD_ROUTE_CHAIN, route);
}

export default router