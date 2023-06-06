import Vue from 'vue'
import FormCustomTextV1Config from './form-widget/form-text-v1.widget'

/** 组件配置 */
const widgetConfigList = [
  FormCustomTextV1Config
]

widgetConfigList.forEach((widgetConfig) => {
  const compConfig = {
    widgetConfig
  }
  Vue.FormEngine && Vue.FormEngine.registerCustomGroupWidgetConfig(compConfig)
})