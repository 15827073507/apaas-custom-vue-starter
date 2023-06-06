import Vue from 'vue'
import { FormEngine, NetworkControl, WidgetControl } from '@x-apaas/x-dcloud-page-engine'

FormEngine.ActionControl.registerGlobalAction('EVENT_SHOW_MESSAGE', (engine, event) => {
  Vue.prototype.$message({
    message: event.message,
    type: (event.type || 'SUCCESS').toLowerCase()
  })
})

// 刷新当前菜单 ($refreshMenu方法在app-engine-home created方法中注册)
FormEngine.ActionControl.registerGlobalAction('REFRESH_CURRENT_MENU', (engine, event) => {
  if (!Vue.prototype.$refreshMenu) {
    console.warn('undefine vue prototype function refreshMenu')
  } else {
    Vue.prototype.$refreshMenu()
  }
})

// 刷新当前列表 ($refreshMenu方法在app-engine-page created方法中注册)
FormEngine.ActionControl.registerGlobalAction('REFRESH_CURRENT_LIST', (engine, event) => {
  if (!Vue.prototype.$refreshList) {
    console.warn('undefine vue prototype function refreshList')
  } else {
    Vue.prototype.$refreshList()
  }
})

Object.defineProperty(Vue, 'FormEngine', {
  value: FormEngine,
  configurable: false,
  writable: false,
  enumerable: false
})