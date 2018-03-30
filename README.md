# my-app

> my project

## Build Setup

```bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build:prod

# build for UAT with minification -- 构建UAT环境
npm run build:uat

# build for SIT and view the bundle analyzer report -- 构建SIT环境
npm run build:sit

# 生产调试
#1.访问任意页：   xxxx/XX?search=search
#2.指令配置路径:  @/js/command.js
#3.搜索栏输入： config:logger:true (指令格式:config:[command]:[enable])
#4.打开调试开关，返回刷新或者手动输入路由跳转
```

For detailed explanation on how things work, checkout the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).

```bash
#config.json 路由配置信息解释
# {
#    "path": "/friends",                    //路由路径
#    "name": "friends",                     //路由别名，禁止使用中文
#    "title": "邀请好友"                     //路由组件页标题，会转化为 meta 节点存储
#    "component": "/mine/children/friends", //路由组件对应 vue 文件
#    "description": "",                     //路由描述，会转化为 meta 节点存储
#    "redirect": "",                        //路由重定向
#    "meta": {                              //路由元数据
#        "requireAuth": true,               //路由是否需要登录
#        "keepAlive": true                    //路由页是否需要保持状态
#    }
# }
```
