<template>
  <x-modal
    :append-to-body="true"
    :destroy-on-close="false"
    :modalVisible.sync="visiable"
    :title="queryParams.title"
    :okConfig="okConfig"
    :wrapper-class="modalWrapperClass"
    @closed="handleModalClose"
    width="992"
    >
    <div ref="FormEditModalBody" class="form-edit-modal-body">
      <x-form-build-render
        ref="formBuildRender"
        :renderScene="renderScene"
        :dragable="false"
        :formEngine="formEngine"
        @temp-save="tempSave"
        >
      </x-form-build-render>
    </div>
  </x-modal>
</template>
<script>
import { FormLogicMixin } from '@x-apaas/x-dcloud-page-engine'
import { XFormBuildRender } from '@x-apaas/x-dcloud-page-web'
import {guid} from '@/utils/uuid.util'
import DB from '@x-apaas/x-dcloud-database-api'
import customConfig from '@/database/custom.config'
export default {
  name: 'FormEdit',
  inject: ['refreshTable'],
  components: {
    XFormBuildRender
  },
  props: {
  },
  mixins: [FormLogicMixin],
  renderLogic: 'CUSTOM_EDIT',
  data() {
    return {
      renderScene: 'edit',
      visiable: false,
      fullScreen: false,
      formModalPromise: {
        resolve: null,
        reject: null
      },
      okConfig: {
        title: this.$t('common.confirm'),
        onOk: this.tempSave
      },
      saveContinueNextFlag: true,
      queryParams: {}
    }
  },
  computed: {
    modalWrapperClass() {
      return this.fullScreen ? 'x-form-edit-modal modal-full-screen' : 'x-form-edit-modal'
    }
  },
  mounted() {
    this.$eventBus.$on('openFormModalWithPromise', this.openFormModalWithPromise)
  },
  methods: {
    openFormModalWithPromise(queryParams, hooks) {
      return new Promise((resolve, reject) => {
        this.instanceId = guid()
        this.formModalPromise.resolve = resolve
        this.formModalPromise.reject = reject
        this.visiable = true
        this.queryParams = queryParams
        this.createWithCustomLife()
        if (queryParams.documentId) {
          this.saveContinueNextFlag = false
        }
      })
    },
    handleModalClose() {
      this.visiable = false
    },
    tempSave() {
      // 数据存储
      new DB(window, customConfig).then(async (db) => {
        const index = await this.getListDbMaxIndex()
        if (!this.queryParams.documentId) {
          db.insert({
            tableName: "form_list",
            data: {
              id: index,
              formData: this.formData
            },
            success: (res) => {
              console.log("表单数据新增成功", res)
              this.refreshTable()
            }
          })
        } else {
          db.updateByPrimaryKey({
            tableName: 'form_list',
            target: this.queryParams.documentId,
            handle: (item) => {
              item.formData = this.formData
            },
            success: (res) => {
              console.log("表单数据更新成功", res)
              this.refreshTable()
              this.queryParams.callback && this.queryParams.callback()
            }
          })
        }
      })
    },
    async getListDbMaxIndex() {
      return new Promise((resolve, reject) => {
        new DB(window, customConfig).then((db) => {
          db.queryAll({
            tableName: 'form_list',
            success: (res) => {
              let maxIndex = 0
              if (res.length > 0) {
                maxIndex = Math.max(...res.map(item => item.id))
              }
              const index = maxIndex + 1
              resolve(index)
            }
          })
        })
      })
    }
  }
}
</script>
<style lang="scss">
.x-form-edit-modal {
  max-width: calc(50vw + 30px);
  min-width: calc(50vw + 30px);
  transition: all 0.2s;

  .el-dialog__body {
    padding: 0px !important;
  }

  .form-edit-modal-body {
    height: calc(100vh - 204px);
    width: calc(50vw - 10px);
    overflow-y: auto;
  }
}
</style>