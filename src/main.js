/*
 * @Author: your name
 * @Date: 2020-05-26 10:06:34
 * @LastEditTime: 2020-05-27 17:08:39
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /x-product-workspace/packages/x-project-app/src/main.js
 */
import i18n from './locale'
import './assets/scss/index.scss'
import './vendor/extension-plugin'
import Vue from 'vue'
import App from './App.vue'
// import './registerServiceWorker'
import router from './router'
import store from './store'
import './vendor/vconsole'
import '@babel/polyfill'
import './vendor/element-ui'
import './vendor/x-lib-ui'
import '@/router/auth.guard'
import './icons' // icon
import './plugins'
import './vendor/x-dcloud-layout-engine/x-dcloud-layout-engine'
import './vendor/x-dcloud-list-engine/x-dcloud-list-engine'
import './vendor/x-dcloud-page-engine/x-dcloud-page-engine'
import './vendor/x-dcloud-ui'
import './vendor/custom-load/index'

/** 注册logic */
import './mixin/logic/index'

Vue.prototype.$envUrl = function (url) {
  return `${process.env.VUE_APP_PUBLIC_PATH}${url}`
}

Vue.config.productionTip = false

/**
 * 开发用的
 */
const requireContext = require.context('./custom/', true, /apaas.json$/)
store.state.menuModule.customListViewMap = {}

requireContext.keys().map(key => {
  console.log('----------', key)
  const rc = requireContext(key)
  if (key.includes('apaas-custom-hello')) {
    return rc
  }
  if (rc && rc.entry) {
    // 装载JS
    const entryJs = key.replace('apaas.json', rc.entry.replace('./', '')).replace('./', '')
    const entryModule = require('./custom/' + entryJs)
    // loadScript

    Vue.use(entryModule.default)

    // 动态添加路由
    const r = router

    if (rc.router) {
      Object.keys(rc.router).forEach(key => {
        const routerConfig = rc.router[key]
        store.commit('menuModule/ADD_CUSTOM_MENU_ROUTER', routerConfig)
        r.addRoute('admin', {
          name: routerConfig.name,
          path: routerConfig.path,
          component: Vue.component(key)
        })
      })
    }

    if (rc.list) {
      Object.keys(rc.list).forEach((key) => {
        const customListViewMap = store.state.menuModule.customListViewMap || {}
        const index = Object.keys(customListViewMap).length
        const routerConfig = {
          ...rc.list[key],
          name: 'app-list-view' + index,
          meta: {
            title: key
          },
          path: 'app-list-view'
        }
        store.commit('menuModule/ADD_CUSTOM_LIST_VIEW_ROUTER', routerConfig)
      })
    }

    // r.addRoute('admin', {
    //   name: router.name,
    //   path: router.path,
    //   component: Vue.component()
    // })
  }
  return rc
})

new Vue({
  i18n,
  router,
  store,
  render: (h) => h(App)
}).$mount('#app')

// var requireAll = function requireAll(requireContext) {
//   return requireContext.keys().map(requireContext);
// };
