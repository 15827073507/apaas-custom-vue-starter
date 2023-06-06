import { customFormComponentList, customFormConfigList } from './custom-component/form-component'
import { widgetConfigList, editorConfigList } from './custom-component/form-config'

const install = function(Vue, opts) {
  // 安装表单部件
  // 注册自开发表单组件
  if (
    customFormComponentList && Array.isArray(customFormComponentList)
  ) {
    customFormComponentList.forEach((comp) => {
      Vue.component(comp.name, comp)
    })
  }
  // 注册自开发组件配置
  if (
    customFormConfigList && Array.isArray(customFormConfigList)
  ) {
    customFormConfigList.forEach((comp) => {
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

const ButtonCustomPlugin = {
  install: install
}

export default ButtonCustomPlugin
