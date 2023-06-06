import ApaasCustom{ { ModuleName } } from './custom-page/page.vue'
import { customFormComponentList } from './custom-component/form-component'
import { widgetConfigList, editorConfigList } from './custom-component/form-config'

const install = function (Vue, opts) {
  // 安装{{ModuleName}}模块, 此处的和apaas.json定义的路由，必须一致
  Vue.component('apaas-custom-{{moduleName}}', ApaasCustom{{ ModuleName }})
// 安装表单部件
// 注册自开发表单组件
if (
  customFormComponentList && Array.isArray(customFormComponentList)
) {
  customFormComponentList.forEach((comp) => {
    Vue.component(comp.name, comp)
  })
}
// 表单引擎注册自开发组件配置

if (
  widgetConfigList && Array.isArray(widgetConfigList)
) {
  widgetConfigList.forEach((widgetConfig) => {
    const compConfig = {
      widgetConfig
    }
    /**
     * 旧自开发引入注册
     * Vue.FormEngine && Vue.FormEngine.registerCustomComponentConfig(compConfig)
     */

    /** 新版自开发组测 */
    Vue.FormEngine && Vue.FormEngine.registerCustomGroupWidgetConfig(compConfig)
  })
}

// 表单引擎注册自开发组件配置
if (
  editorConfigList && Array.isArray(editorConfigList)
) {
  editorConfigList.forEach((editorConfig) => {
    Vue.FormEngine && Vue.FormEngine.registerCustomEditorConfig(editorConfig)
  })
}
}
const {{ ModuleName }}CustomPlugin = {
  install: install
}

export default {{ ModuleName }}CustomPlugin
