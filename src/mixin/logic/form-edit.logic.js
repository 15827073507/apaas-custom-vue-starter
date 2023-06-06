import DB from '@x-apaas/x-dcloud-database-api'
import customConfig from '@/database/custom.config'

export default {
  renderLogicName: 'CUSTOM_EDIT',
  methods: {
    onInitQueryParams(vm) {
      
    },
    onFormEngineCreated(vm) {
      
    },
    onInitForm(vm, refreshLeftDrawer) {
      new DB(window, customConfig).then((db) => {
        db.queryAll({
          tableName: "form_config", 
          success: (res) => {
            console.log('-----表单组件渲染------', res)
            if (res.length > 0) {
              vm.formEngine.formDataControl.updateFormItemList(res[0].config.formItemList || [])
            }
            if (vm.queryParams.documentId) {
              initFormData(vm, db)
            }
          }
        })
      })
    },
    onInitFormButton(vm) {

    },
    onInitRule(vm) {},
    initRule() {},
    async onClickButton(vm, buttonCode, event) {
    }
  },
  actions: {
    
  }
}

function initFormData(vm, db) {
  db.queryByPrimaryKey({
    tableName: 'form_list',
    target: vm.queryParams.documentId,
    success: (res) => {
      console.log('----详情页数据回显-----', res)
      vm.formEngine.formDataControl.updateFormValue(res.formData)
    }
  })
}