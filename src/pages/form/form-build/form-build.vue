<template>
  <div class="form-build" tabindex="-1">
    <x-loading
      v-if="showLoading"
      class="page-design-loading"
      :visible="loading"
      :networkError="networkError"
      @loading-refresh="refreshData"
      @loading-done="handleLoadingDone"
    ></x-loading>
    <x-form-design
      v-if="showFormDesign"
      ref="formDesignRef"
      :formId="formId"
      :formType="formType"
      :extraData="extraData"
      :menuTitle="menuTitle"
      :dataModelType="menuInfo.menuModelType"
      :disabled="disabled || isCopy"
      :renderClient="renderClient"
      :menuInfo="menuInfo"
      @update:diffData="setDiffData"
      @setDesignLoading="setDesignLoading"
      @openModelCodeModal="openModelCodeModal"
    ></x-form-design>
  </div>
</template>
<script>
import { XFormDesign } from '@x-apaas/x-dcloud-page-web'
import EventBusMixin from '@/mixin/eventbus.mixin'
import Vue from 'vue'
export default {
  name: 'formBuild',
  components: {
    XFormDesign
  },
  provide(){
    return {
      fullScreen: () => this.fullScreen,
      activeTabName: () => {},
      getWaterMarkText: ''
    }
  },
  mixins: [EventBusMixin],
  props: {
    menuId: {
      type: String,
      default: function() {
        return ''
      }
    },
    formId: {
      type: String,
      default: function() {
        return undefined
      }
    },
    datasourceId: {
      type: String
    },
    menuTitle: {
      type: String,
      default: ''
    },
    menuInfo: {
      type: Object,
      default() {
        return {}
      }
    },
    disabled: {
      type: Boolean,
      default: function() {
        return false
      }
    },
    isCopy: {
      type: Boolean,
      default: function () {
        return false
      }
    },
    renderClient: {
      type: String,
      default() {
        return ''
      }
    }
  },
  data() {
    return {
      fullScreen: false,
      formType: this.$route.name === 'data-model-fn-config' ? 'DATA_MODEL' : 'MENU',
      extraData: {
        datasourceId: ''
      },
      showFormDesign: true,
      erData: [],
      // 表单的loading状态
      loading: false,
      // 表单加载网络请求的失败的情况
      networkError: false,
      // 是否显示表单设计页面的loading
      showLoading: false
    }
  },
  watch: {
    datasourceId: {
      handler(newVal) {
        this.extraData.datasourceId = newVal
      },
      immediate: true
    }
  },
  eventbus: {
    handleFormCloseEvent: {
      listener: function(callback) {
        try {
          /* eslint-disable */
          callback(true)
        } catch (error) {
        }
      },
      scope: 'APP'
    }
  },
  beforeCreate() {

  },
  mounted() {
    this.clearFormData()
  },
  methods: {
    clearFormData() {
      /**
       * 左侧组件置空
       */

      const widgetList = this.$lodash.cloneDeep(this.$refs['formDesignRef'].widgetPanelConfig.groupWidgetList)
      const list = [widgetList[3]]
      this.$set(this.$refs['formDesignRef'].widgetPanelConfig, 'groupWidgetList', list)
      this.$refs['formDesignRef'].$refs.widgetPanelRef.$forceUpdate()

      /**
       * 表单构建内容置空
       */
      this.$set(this.$refs['formDesignRef'].$refs['formBuildRender'], 'formItemList', [])

      console.log('--------formItemList--------', this.$refs['formDesignRef'].widgetPanelConfig.groupWidgetList)
      console.log('--------formItemList--------', this.$refs['formDesignRef'].$refs['formBuildRender'].formItemList)
      
    },
    getFormConfig() {
      return {
        formItemList: this.$refs['formDesignRef'].$refs['formBuildRender'].formItemList
      }
    },
    handleNextStep() {
      return new Promise((resolve, reject) => {
        if (this.$refs.formDesignRef && this.$refs.formDesignRef.formConfigChanged.value) {
          // 弹窗
          this.$modalOptEvent.showGlobalModal({
            visible: true,
            title: this.$t('adminCommon.unsavedChange'),
            message: this.$t('fnConfig.formChangeModal.message'),
            okConfig: {
              title: this.$t('fnConfig.formChangeModal.okConfig.title'),
              onOk: () => {
                // TODO: 这里需要增加loadding
                return this.handleSave()
                  .then(() => {
                    resolve()
                  })
                  .catch((err) => {
                    reject(err)
                  })
              }
            },
            cancelConfig: {
              title: this.$t('fnConfig.formChangeModal.cancelConfig.title'),
              onCancel: () => {
                if (this.formId) {
                  resolve()
                }
              }
            },
            closeConfig: {
              onClose: () => {
                reject(new Error())
              }
            }
          })
        } else {
          resolve()
        }
      })
    },
    isChanged() {
      return this.$refs.formDesignRef && this.$refs.formDesignRef.formConfigChanged.value
    },
    handleTabClick() {
      return new Promise((resolve, reject) => {
        if (
          this.$refs.formDesignRef &&
          this.$refs.formDesignRef.formConfigChanged.value &&
          this.menuInfo.menuType !== 'QUOTE'
        ) {
          // 弹窗
          this.$modalOptEvent.showGlobalModal({
            visible: true,
            title: this.$t('adminCommon.unsavedChange'),
            message: this.$t('fnConfig.formChangeModal.message'),
            okConfig: {
              title: this.$t('fnConfig.formChangeModal.okConfig.title'),
              onOk: () => {
                return this.handleSave()
                  .then((res) => {
                    resolve()
                  })
                  .catch((err) => {
                    reject(err)
                  })
              }
            },
            cancelConfig: {
              title: this.$t('fnConfig.formChangeModal.cancelConfig.title'),
              onCancel: () => {
                resolve()
              }
            },
            closeConfig: {
              onClose: () => {
                reject(new Error())
              }
            }
          })
        } else {
          resolve()
        }
      })
    },
    handleBackClick() {
      return this.handleTabClick()
    },
    handleSave(formModelSetting) {
      return new Promise((resolve, reject) => {
        // 如果选中的是表格的某一列，要重新进行表格的校验
        // if (
        //   this.selectedColFormItem &&
        //   this.selectedFormItem.componentType === 'FORM_WIDGET_TABLE'
        // ) {
        //   const itemIndex = this.formItemList.indexOf(this.selectedFormItem)
        //   this.clickFormItemList(itemIndex)
        // }
        if (this.loading) {
          // loading时候不能保存
          this.$message({
            type: 'warning',
            message: this.$t('fnConfig.formBuild.loadingLater')
          })
          resolve()
        } else if (this.networkError) {
          // 网络错误的时候不能保存
          this.$message({
            type: 'warning',
            message: this.$t('fnConfig.formBuild.loadingError')
          })
          resolve()
        } else {
          this.handleFormBuildSave(formModelSetting)
            .then(() => {
              resolve()
            })
            .catch((err) => {
              reject(err)
            })
        }
      })
    },
    handleFormBuildSave(formModelSetting) {
      const previewLanguage = this.previewLanguage || 'zh-CN'
      return new Promise((resolve, reject) => {
        this.$refs.formDesignRef &&
          this.$refs.formDesignRef
            .onClickButton(this.$refs.formDesignRef, 'SAVE_FORM_CONFIG', {
              formModelSetting,
              previewLanguage
            })
            .then((respData) => {
              this.$emit('update:formId', respData.id)
              resolve()
            })
            .catch((err) => {
              console.error(err)
              reject(err)
            })
      })
    },
    getErData() {
      this.openLoading()
      const request = { ...apis.QUERY_BUSINESS_OBJECT_DATA }
      request.params = {
        formId: this.formId
      }
      this.$request(request)
        .asyncThen(
          (res) => {
            if (res.code === 'ok') {
              this.erData = dataConvert(res.data)
              this.cancelLoading()
            }
          },
          (error) => {
            console.error(error)
            this.setLoadingError()
          }
        )
        .asyncErrorCatch((error) => {
          console.error(error)
          this.setLoadingError()
        })
    },
    change2BsObject(status) {
      if (status) {
        this.showFormDesign = false
      } else {
        this.showFormDesign = true
      }
      if (!this.showFormDesign) {
        if (!this.formId) {
          return new Error(this.$t('fnConfig.formBuild.lackId'))
        }
        this.getErData()
        // this.erData = dataConvert(data)
      }
    },
    // loading --------------------------------------- start
    // 开启loading
    openLoading() {
      this.showLoading = true
      this.loading = true
      this.networkError = false
    },
    // 关闭loading
    cancelLoading() {
      this.loading = false
      this.networkError = false
    },
    // 设置加载接口报错的情况
    setLoadingError() {
      this.loading = false
      this.networkError = true
    },
    // 加载完的回调
    handleLoadingDone() {
      this.showLoading = false
    },
    // 设置表单设计的loading状态
    setDesignLoading(status) {
      switch (status) {
        case 'OPEN': {
          this.openLoading()
          break
        }
        case 'CANCEL': {
          this.cancelLoading()
          break
        }
        case 'ERROR': {
          this.setLoadingError()
          break
        }
      }
    },
    // 修改copy的diffData对比状态
    setDiffData(diffData) {
      this.$emit('update:diffData', diffData)
    },
    // 网络出错重新加载数据
    refreshData() {
      this.networkError = false
      if (this.showFormDesign) {
        this.$refs.formDesignRef && this.$refs.formDesignRef.initForm()
      } else {
        this.getErData()
      }
    },
    openModelCodeModal(data) {
      this.$emit('openModelCodeModal', data)
    }
  }
}
</script>
<style lang="scss">
.form-build {
  margin-top: 10px !important;
  height: calc(100vh - 120px) !important;
  // padding: 0px 4.167vw;
  display: flex;
  justify-content: center;
  min-width: 1024px;
  .page-design-loading {
    position: absolute;
    background-color: #fff;
    width: 94% !important;
    height: calc(100vh - 120px) !important;
    margin: 0 auto;
    z-index: 1999;
    .mask {
      background-color: #fff;
    }
  }
  .widget-panel {
    min-width: calc(15.625% + 20px);
    max-width: calc(15.625vw + 20px);
    padding: 24px 1.667vw;
    border-radius: 2px;
    box-shadow: 0px 0px 8px 0px #ebeef5;
    background: #ffffff;
    overflow-y: auto;
    user-select: none;

    .widget-group {
      .widget-group-title {
        padding-left: 8px;
        font-size: 14px;
        color: black;
        font-weight: var(--base-font-bold);
        line-height: 1px;
        display: flex;
        align-items: center;

        .widget-group-title-tag {
          min-width: 4px;
          background: #027aff;
          display: inline-block;
          height: 14px;
          border-radius: 2px;
        }

        .widget-group-title-name {
          margin-left: 8px;
          font-size: 14px;;
        }
      }

      .widget-container {
        padding: 12px 0 24px 0;

        .widget-list {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;

          .space-holder {
            pointer-events: none;
          }

          .form-build-item-wrapper {
            .widget-wrapper {
              display: flex;
            }

            .form-item-wrapper {
              display: none;
            }

            .widget-item {
              width: 5vw;
              min-width: 54px;
              min-height: 4.1667vw;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              border-radius: 2px;

              .widget-icon > .svg-icon {
                width: 1.65vw;
                height: 1.65vw;
                min-width: 16px;
                min-height: 16px;
                width: 32px !important;
                height: 32px !important;
              }

              &:hover {
                background: #efefef;
              }

              .weight-name {
                margin-top: 4px;
                font-size: var(--base-font-size);
              }
            }
          }
        }
      }
    }
  }

  .form-panel {
    display: flex;
    flex: 1;
    max-width: calc(50vw + 30px);
    min-width: calc(50% + 30px);
    min-height: calc(100vh - 120px);
    user-select: none;
    .form-panel-sklenton {
      padding: 12px 16px;
      margin: 0px 20px;
      background: #ffffff;
      overflow-y: auto;
      height: auto;
      .x-business-form-build-render {
        padding: 0;
        margin: 0;
        min-height: calc(100% - 4px);
        .form-item-list {
          width: 100%;
          min-width: 100%;
          height: calc(100% - 16px);
          display: flex;
          flex: 1;
          flex-wrap: wrap;
          align-content: flex-start;
          /* padding-bottom: 169px; */
          /* overflow: auto; */
          // overflow-y: auto; // 设置auto会出现两个滚动条
          padding-bottom: 16px;
          padding-right: 16px;
          padding-top: 16px;
          background: #fff;

          .form-build-item-wrapper:last-child {
            // margin-bottom: 24px;
          }
          // .el-form-item {
          //   .el-tooltip {
          //     > div {
          //       overflow: hidden;
          //       text-overflow: ellipsis;
          //       word-break: break-all;
          //       white-space: nowrap;
          //     }
          //   }
          // }
        }
      }
    }
  }

  .config-panel {
    background: #ffffff;
    width: 15.625vw;
    min-width: 15.625%;
    max-width: 15.625vw;
    padding: 24px 32px;
    overflow: auto;
    user-select: none;

    .form-config-item {
      margin-bottom: 24px;
    }
    .form-config-hidden {
      .el-form-item__label {
        margin-bottom: 0;
      }
    }
    .form-config-required {
      .el-form-item__label {
        margin-bottom: 0;
      }
    }
    .form-config-associated {
      .el-form-item__label {
        margin-bottom: 0;
      }
    }
    .form-config-editonnew {
      .el-form-item__label {
        margin-bottom: 0;
      }
    }
    .form-config-unique {
      .el-form-item__label {
        margin-bottom: 0;
      }
    }
    .config-panel-empty {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }

  .el-input__inner {
    color: var(--base-font-color);

    &::placeholder {
      color: #b2b2b2;
    }
  }
  .er-editor-demo-container {
    width: 100%;
    height: 100%;
    .x6-graph-scroller {
      width: 100%;
      height: 100%;
    }
  }
}
</style>