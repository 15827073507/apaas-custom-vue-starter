<template>
  <div class="form-render">
    <component
        :is="computActiveComponentName"
        ref="dynamicComp"
        :menuId="queryParams.menuId"
        :formId="queryParams.formId"
        :processId.sync="queryParams.processId"
        :copyMenuId="queryParams.copyMenuId || ''"
        :copyFormId="queryParams.copyFormId || ''"
        :copyProcessId="queryParams.copyProcessId || ''"
        :isCopy="!!queryParams.isCopy"
        :appId="$route.query.appId"
        :menuTitle="queryParams.title"
        :menuInfo="menuInfo"
        :hasPublicForm="hasPublicForm"
        :processStatus="queryParams.processStatus"
        :datasourceId="menuInfo.datasourceId"
        :isMicroServiceMenu="isMicroServiceMenu"
        :disabled="disabled"
        :sourceMenuId="sourceMenuId"
        :renderClient="renderClient"
        :diffData="diffData"
        @update:formId="setFormId"
        @update:diffData="setDiffData"
        @set-process-status="setProcessStatus"
        @page-setting-menu="currentPageSettingMenu = $event"
        @openModelCodeModal="openModelCodeModal"
      ></component>
  </div>
</template>
<script>
import formBuild from './form-build/form-build.vue'
import EventBusMixin from '@/mixin/eventbus.mixin'
import DB from '@x-apaas/x-dcloud-database-api'
import customConfig from '@/database/custom.config'
export default {
  name: 'FormRender',
  components: {
    formBuild
  },
  mixins: [EventBusMixin],
  provide() {
    return {
      getI18nShowStatus: () => this.isShowI18nText,
      getPreviewLanguage: () => this.getLocale,
      getAppLanguage: () => this.langList,
      openFormSettings: this.openFormSettings
    }
  },
  data() {
    return {
      computActiveComponentName: 'formBuild',
      isTodoConfig: !!this.$route.query.menuType,
      FormData: {},
      queryCodeFieldsMes: '',
      isFormBuild: true,
      currentStepIndex: 0,
      disableSteps: this.$route.query.menuType
        ? ['workFlowDesign', 'listPageDesign', 'formBuildDesign']
        : [],
      queryParams: {
        menuId: '',
        formId: '',
        formType: '',
        processId: '',
        processStatus: '',
        title: ''
      },
      fnCode: '',
      menuInfo: {},
      saveBtnLoading: false,
      currentPageSettingMenu: '',
      sourceMenuId: '',
      handlerBeforeLeave: (activeName, oldActiveName) => {
        return new Promise((resolve, reject) => {
          // todo 此判断有问题
          if (this.$refs.dynamicComp && this.$refs.dynamicComp.handleTabClick) {
            this.$refs.dynamicComp
              .handleTabClick()
              .then(() => {
                const index = this.steps.indexOf(
                  this.steps.filter((item) => item.code === activeName)[0]
                )
                this.currentStepIndex = index
                resolve()
              })
              .catch((err) => {
                reject(err)
              })
          } else {
            console.warn(this.$t('appManagement.detailPage.saveFunction'))
            const index = this.steps.indexOf(
              this.steps.filter((item) => item.code === activeName)[0]
            )
            this.currentStepIndex = index
            resolve()
          }
        })
      },
      // 是否拥有分享表单
      hasPublicForm: false,
      renderClient: 'web',
      dropdownArrow: false,
      langList: [],
      showI18nText: 'DISABLE',
      localeValue: '',
      diffData: null,
      isComplete: false,
      isStartProcessBtn: false,
      refreshExtensionMark: 'refresh'
    }
  },
  computed: {
    steps() {
      return [
        {
          code: 'formBuildDesign',
          title: this.$t('fnConfig.formDesign'),
          componentName: 'form-build-design'
        },
        {
          code: 'listPageDesign',
          title: this.$t('fnConfig.listPageDesign'),
          componentName: 'list-page-config'
        },
        {
          code: 'workFlowDesign',
          title: this.$t('fnConfig.workFlowDesign'),
          componentName: 'workflow-design'
        },
        {
          code: 'pageSetting',
          title: this.$t('fnConfig.pageSetting'),
          componentName: 'page-setting'
        }
      ].filter((item) => !this.disableSteps.includes(item.code))
    },
    computActiveName: function() {
      if (
        this.steps[this.currentStepIndex] &&
        this.steps[this.currentStepIndex].code === 'formBuildDesign'
      ) {
        this.isFormBuild = true
      }
      return this.steps[this.currentStepIndex] && this.steps[this.currentStepIndex].code
    },
    computShowSaveBtn: function() {
      if (!this.menuInfo.menuType || this.isQuoteMenu) return false
      // 保存按钮是否显示
      if (this.currentStepIndex === 2) {
        // 如果是流程设计则跟关闭流程按钮一起显示
        return this.computShowCloseProcessBtn
      } else if (this.currentStepIndex === 3) {
        // 如果是页面设置则跟关闭流程按钮一起显示
        const showBtnPageSettingMenu = ['dataTemplate', 'messageRemind', 'createPermissions', 'formScope', 'customButton', 'dataExport', 'businessRule', 'printSetting']
        return !showBtnPageSettingMenu.includes(this.currentPageSettingMenu)
      } else {
        // 其他页面都显示
        return true
      }
    },
    computShowCloseProcessBtn: function() {
      if (this.isQuoteMenu) {
        return false
      }
      // 关闭流程按钮是否显示
      if (this.currentStepIndex === 2 && this.queryParams.processStatus === 'ENABLE') {
        // 如果是流程设计并且流程状态为ENABLE则显示
        return true
      } else {
        return false
      }
    },
    isQuoteMenu: function() {
      return this.menuInfo && this.menuInfo.menuType === 'QUOTE'
    },
    isMicroServiceMenu: function() {
      return this.menuInfo && this.menuInfo.menuModelType === 'MICRO_SERVICE'
    },
    computShowOtherLinkBtn() {
      if (!this.computShowCloseProcessBtn && this.currentStepIndex === 2) {
        this.getProcessBtnFlag()
        return ExtensionEngine.getInstance().validateBlock('ADMIN_OTHER_LINK_EXTENSION', 'OtherLinkExtension') || false
      } else {
        return false
      }
    },
    disabled() {
      if (this.computShowOtherLinkBtn) {
        return this.isStartProcessBtn
      } else {
        return this.isQuoteMenu
      }
    }
  },
  created() {

  },
  mounted() {
    new DB(window, customConfig).then((db) => {
      db.queryAll({
        tableName: "form_config", 
        success: (res) => {
          console.log(res)
          if (res.length > 0) {
            this.$set(this.$refs['dynamicComp'].$refs['formDesignRef'].$refs['formBuildRender'], 'formItemList', res[0].config.formItemList || [])
          }
        }
      })
    })
  },
  methods: {
    initAppAuthority(appId) {
      if (!appId) {
        return
      }
      const request = {
        ...apis.QUERY_APP_AUTHORITY_RESOURCES,
        params: {
          userId: this.userInfo.id,
          accessType: 'APP',
          appId: appId
        }
      }
      this.$request(request).asyncThen((resp) => {
        this.setAppAuthority({
          authorityMenuList: resp.data.menuList || [],
          authorityInterfaceList: resp.data.interfaceList || []
        })
      }, (err) => {
        console.error(err)
      }).asyncErrorCatch((err) => {
        console.error(err)
      })
    },
    // handleOpnenCalendar() {
    //   this.$refs.appCalendarRef.showModal()
    // },
    setProcessStatus(e) {
      this.$set(this.queryParams, 'processStatus', e)
      // this.queryParams.processStatus = e
      this.$nextTick(() => {
        this.$forceUpdate()
      })
    },
    setFormId(formId) {
      if (formId) {
        const query = {
          ...this.$route.query,
          formId: formId
        }
        // this.$router.replace({
        //   query
        // })
        this.queryParams = this.$lodash.cloneDeep(query)
      }
    },
    setMenuId(menuId) {
      if (menuId) {
        const query = {
          ...this.$route.query,
          menuId
        }
        this.queryParams = this.$lodash.cloneDeep(query)
      }
    },
    setDiffData(uuid) {
      this.diffData = uuid
    },
    handleBack() {
      if (this.$route.query.isCopy) {
        this.handleCopyClose()
        return
      }

      if (this.menuInfo.menuType === 'QUOTE') {
        this.goBack()
      } else if (
        this.$refs.dynamicComp.isChanged instanceof Function &&
        this.$refs.dynamicComp.isChanged()
      ) {
        if (this.$refs.dynamicComp && this.$refs.dynamicComp.handleBackClick) {
          this.$refs.dynamicComp
            .handleBackClick()
            .then(() => {
              this.goBack()
            })
            .catch((err) => {
              console.error(err)
            })
        } else {
          console.warn(this.$t('fnConfig.formChangeModal.returnFun'))
        }
      } else {
        this.goBack()
      }
    },
    goBack() {
      this.$router.go(-1)
    },
    handleClose() {
      if (this.$route.query.isCopy) {
        this.handleCopyClose()
        return
      }

      this.$emitWithEventBus(
        'handleFormCloseEvent',
        (status) => {
          if (status) {
            this.handleBack()
          }
        },
        {
          scope: 'APP'
        }
      )
    },
    handleCopyClose() {
      if (this.steps[this.currentStepIndex].code === 'pageSetting' && this.isComplete) {
        this.goBack()
        return
      }

      let stepsMsg = ''
      let steps = this.$lodash.cloneDeep(this.steps.map((step) => step.title))
      const otherSteps = steps.slice(this.currentStepIndex)
      if (this.$refs.dynamicComp.isChanged instanceof Function) {
        const isChanged = this.$refs.dynamicComp.isChanged()
        // 如果当前step已经保存则删除第一个
        if (!isChanged) {
          otherSteps.shift()
        }
      }
      // 剩余step为0 则直接返回
      if (otherSteps.length === 0) {
        this.goBack()
        return
      }

      // 剩余step大于1时 处理国际化英文
      if (otherSteps.length > 1) {
        const lastStep = otherSteps.pop()
        stepsMsg = `${otherSteps.join(this.$t('fnConfig.copyPage.firstMsg'))}${this.$t(
          'fnConfig.copyPage.secondMsg'
        )}${lastStep}`
      } else {
        stepsMsg = otherSteps[0]
      }
      this.$modalOptEvent.showGlobalModal({
        visible: true,
        title: this.$t('fnConfig.formChangeModal.title'),
        message: this.$t('fnConfig.copyPage.message', {
          msg: stepsMsg
        }),
        okConfig: {
          title: this.$t('fnConfig.deleteTab.ok'),
          onOk: () => {
            // // 接口一次性复制页面设置相关配置
            this.goBack()
          }
        },
        cancelConfig: {
          title: this.$t('fnConfig.deleteTab.cancel'),
          onCancel: () => {}
        },
        closeConfig: {
          onClose: () => {}
        }
      })
    },
    change2BsObject(status) {
      if (status) {
        return new Promise((resolve, reject) => {
          if (this.$refs.dynamicComp && this.$refs.dynamicComp.handleTabClick) {
            this.$refs.dynamicComp
              .handleTabClick()
              .then(() => {
                this.isFormBuild = !status
                this.$refs.dynamicComp.change2BsObject(status)
                resolve()
              })
              .catch((err) => {
                reject(err)
              })
          }
        })
      } else {
        this.isFormBuild = !status
        this.$refs.dynamicComp.change2BsObject(status)
      }
    },
    // 保存
    handleSave(formModelSetting) {
      if (this.computActiveName === 'pageSetting') {
        this.saveBtnLoading = true
        this.$emitWithEventBus(
          'formSettingEvent',
          () => {
            this.saveBtnLoading = false
          },
          {
            scope: 'APP'
          }
        )
      } else {
        // 点击保存按钮，执行事件到当前界面
        if (this.$refs.dynamicComp && this.$refs.dynamicComp.handleSave) {
          if (!this.$refs.dynamicComp.hiddenSaveButtonLoading) {
            // 隐藏保存按钮loading
            this.saveBtnLoading = true
          }
          setTimeout(() => {
            this.$refs.dynamicComp.handleSave(formModelSetting).then(
              (res) => {
                this.saveBtnLoading = false
                this.$refs.modelCode.modalVisible = false
                this.$refs.modelCode.confirmOkLoading = false
              },
              (error) => {
                this.saveBtnLoading = false
                this.$refs.modelCode.confirmOkLoading = false
              }
            )
          }, 50)
        } else {
          console.warn(this.$t('appManagement.detailPage.saveFunction'))
        }
      }
    },
    // 完成复制
    handleCompleteSave() {
      this.saveBtnLoading = true
      const request = {
        ...apis.SAVE_ALL_APP_SETTING,
        params: {
          formId: this.queryParams.formId,
          menuId: this.queryParams.menuId,
          copyMenuId: this.queryParams.copyMenuId,
          copyFormId: this.queryParams.copyFormId,
          componentUidMap: this.diffData.diffUuid,
          xdapFormConfig: {
            advancedPermissionGroups: null,
            excelImportConfig: {},
            excelExportConfig: {}
          }
        }
      }
      this.$request(request).asyncThen((resp) => {
        if (resp.code === 'ok') {
          this.isComplete = true
        }
        this.saveBtnLoading = false
      })
    },
    handleModelCodeModalConfirm(data) {
      this.handleSave(data)
    },
    openModelCodeModal(data) {
      this.$refs.modelCode.showModel(data)
      this.saveBtnLoading = false
    },
    // 关闭流程按钮
    handleCloseProcess() {
      this.$refs.dynamicComp.handleCloseProcess()
    },
    // 上一步
    handleLastStep() {
      if (this.$refs.dynamicComp && this.$refs.dynamicComp.handleLastStep) {
        this.$refs.dynamicComp.handleLastStep().then(() => {
          const temp = this.currentStepIndex - 1
          this.currentStepIndex = temp
        })
      } else {
        console.warn(this.$t('appManagement.detailPage.saveFunction'))
        const temp = this.currentStepIndex - 1
        this.currentStepIndex = temp
      }
    },
    // 下一步
    handleNextStep() {
      if (this.$refs.dynamicComp && this.$refs.dynamicComp.handleNextStep) {
        this.$refs.dynamicComp.handleNextStep().then(() => {
          const temp = this.currentStepIndex + 1
          this.currentStepIndex = temp
        })
      } else {
        console.warn(this.$t('appManagement.detailPage.saveFunction'))
        const temp = this.currentStepIndex + 1
        this.currentStepIndex = temp
      }
    },
    setProcessId(sourceMenuId) {
      const request = {
        ...apis.QUERY_MENU_DETAIL,
        params: {
          id: sourceMenuId
        }
      }
      this.$request(request).asyncThen((resp) => {
        if (resp.code === 'ok') {
          this.queryParams.processId = resp.data.processId
        }
      })
    },
    queryMenuDetail() {
      if (this.$route.query.isCopy) {
        this.menuInfo = {
          ...this.menuInfo,
          menuType: this.$route.query.copyMenuType
        }
      }
      // 查询菜单明细
      return new Promise((resolve, reject) => {
        const request = {
          ...apis.QUERY_MENU_DETAIL,
          params: {
            id: this.$route.query.menuId
          }
        }
        this.$request(request).asyncThen((resp) => {
          if (resp.code === 'ok') {
            this.menuInfo = resp.data
            this.queryParams.title = this.menuInfo.menuName
            this.sourceMenuId = resp.data.sourceMenuId || ''
            resolve(resp.data)
          }
        })
      })
    },
    editMenuInfo() {
      this.queryMenuDetail().then((data) => {
        const quoteDisabled = this.menuInfo.menuType === 'QUOTE'
        this.$refs.menuInfoModal.showModal(
          data,
          this.menuInfo.menuType,
          quoteDisabled,
          data.menuModelType,
          true
        )
      })
    },
    handleConfirm({ data, callback }) {
      this.FormData = data
      // TODO 编辑菜单信息确定方法
      const request = {
        ...apis.SAVE_MENU_INFO,
        params: {
          appId: this.$route.query.appId,
          menuType: 'MENU',
          cusModelPageStatus: data.cusModelPageStatus,
          ...data
        }
      }
      this.$request(request)
        .asyncThen(
          (resp) => {
            if (resp.code === 'ok') {
              this.queryMenuDetail()
              callback()
            }
          },
          () => {
            /* eslint-disable */
            callback(false)
          }
        )
        .asyncErrorCatch(() => {
          /* eslint-disable */
          callback(false)
        })
    },
    getCurrentTimestamp(step = 0) {
      return new Date().getTime() + step
    },
    queryHasPublicForm() {
      // TODO 查询是否有公开表单（后面放开）
      // const request = {
      //   ...apis.QUERY_HAS_PUBLIC_FORM
      // }
      // this.$request(request).asyncThen(resp => {
      //   if (resp.code === 'ok') {
      //     this.hasPublicForm = resp.data.publicFormFlag === 'Y'
      //   }
      // })
    },
    checkoutPlatform(type) {
      if (this.$refs.dynamicComp.changeStatus) {
        return new Promise((resolve, reject) => {
          this.$modalOptEvent.showGlobalModal({
            visible: true,
            title: this.$t('adminCommon.unsavedChange'),
            message: this.$t('fnConfig.formChangeModal.message'),
            okConfig: {
              title: this.$t('fnConfig.formChangeModal.okConfig.title'),
              onOk: () => {
                // TODO: 这里需要增加loadding
                this.$refs.dynamicComp.handleSave().then(() => {
                  this.renderClient = type
                  resolve()
                })
              }
            },
            cancelConfig: {
              title: this.$t('fnConfig.formChangeModal.cancelConfig.title'),
              onCancel: () => {
                this.renderClient = type
                resolve()
              }
            },
            closeConfig: {
              onClose: () => {
                reject(new Error())
              }
            }
          })
        })
      } else {
        this.renderClient = type
      }
    },
    handleCommand(command) {
      this.localeValue = command
      XEventBus.emit('changePreview', command)
    },
    handleDropdown(e) {
      this.dropdownArrow = e
      if (!e) return
    },
    queryI18nTextConfig() {
      const { appId } = this.$route.query
      const request = {
        ...apis.QUERY_I18N_TEXT_CONFIG,
        params: { appId }
      }
      this.$request(request)
        .asyncThen(
          (resp) => {
            this.showI18nText = resp.data.status
            this.showI18nText === 'ENABLE' && this.queryAppLanguage()
          },
          (err) => {
          }
        )
        .asyncErrorCatch((err) => {
          this.showI18nText = 'DISABLE'
        })
    },
    queryAppLanguage() {
      const request = { ...apis.GET_I18N_TEXT_LANG_LIST }
      request.params = {
        appId: this.$route.query.appId
      }
      this.$request(request)
        .asyncThen((resp) => {
          this.langList = (resp.data || []).filter((item) => item.status === 'ENABLE')
        })
        .asyncErrorCatch((err) => {
          console.error(err)
        })
    },
    handleOtherLink() {
      let param = {
        tenantId: this.$store.state.tenantModule.currentOrg.id,
        appId: this.$route.query.appId,
        menuId: this.$route.query.menuId,
        formId: this.$route.query.formId
      }
      this.otherLink(param)
    },
    openFormSettings(sonTableWidget) {
      if(!this.$lodash.isEmpty(sonTableWidget) && this.$refs.dynamicComp && this.$refs.dynamicComp.$refs.formDesignRef){
        this.$refs.dynamicComp.$refs.formDesignRef.sonTableWidget = sonTableWidget
        this.$refs.dynamicComp.$refs.formDesignRef.initComponentFormSettings()
      }else{
        this.$refs.dynamicComp.$refs.formDesignRef.sonTableWidget = {}
      }
      this.showFormSetting = true
    },
    getAppIdByCode(extensionCode) {
      let appId = ''
      if (Array.isArray(ExtensionEngine.getInstance().config.whiteExtensions)) {
        const index = ExtensionEngine.getInstance().config.whiteExtensions.findIndex(
          (item) => item.extensionCode === extensionCode
        )
        if (index > -1) {
          appId = ExtensionEngine.getInstance().config.whiteExtensions[index].appId
        }
      }
      return appId
    },
    saveFormConfig() {
      new DB(window, customConfig).then((db) => {
        console.log('----getFormConfig-------', this.$refs.dynamicComp.getFormConfig())
        db.insert({
          tableName: "form_config",
          data: {
            id: 1,
            config: this.$refs.dynamicComp.getFormConfig()
          },
          success: (res) => {
            console.log("表单配置添加成功", res)
          }
        })
      })
    }
  }
}
</script>
<style lang="scss">
.form-render {
  height: 100%;
  width: 100%;
}
</style>