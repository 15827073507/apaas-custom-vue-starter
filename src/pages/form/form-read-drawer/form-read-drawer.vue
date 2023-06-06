<template>
  <div class="x-form-read">
    <x-drawer
      :append-to-body="true"
      :destroy-on-close="true"
      :before-close="beforeClose"
      :drawerVisible.sync="drawerVisible"
      :wrapper-class="drawerWrapperClass"
      width="calc(50% + 32px)"
      :destroyOnClose="true"
      :wrapperClosable="renderScene !== 'edit'"
      @close="handleClose"
      @closed="handleClosed"
    >
      <template v-slot:title>
        <div class="drawer-row drawer-header-row">
          <label class="header-title">{{ queryParams.title }}</label>
        </div>
        <template v-for="formBtn of formBtns">
            <el-tooltip
              :key="formBtn.buttonCode"
              class="item"
              :content="formBtn.text"
              placement="bottom"
            >
              <x-svg-icon
                :data-button-code="formBtn.buttonCode"
                style="margin-right: 20px; cursor: pointer"
                :name="formBtn.icon"
                @click.native="onClickButtonProxy(formBtn.buttonCode, $event)"
              ></x-svg-icon>
            </el-tooltip>
            <div
              v-if="formBtn.buttonCode === 'DELETE' && deleteLoading"
              :key="formBtn.buttonCode + '1'"
              style="margin-right: 20px; cursor: pointer"
              v-loading="deleteLoading"
              class="delete-loading"
            ></div>
          </template>
      </template>
      <div class="x-form-read-drawer-body">
        <div class="scroll-panel">
          <div class="left-render-space" :style="{ height: '100%' }"></div>
          <div class="center-render-panel">
            <x-form-build-render
              ref="formBuildRender"
              :renderScene="renderScene"
              :dragable="false"
              :formEngine="formEngine"
            ></x-form-build-render>
          </div>
        </div>
      </div>
    </x-drawer>
  </div>
</template>
<script>
import { XFormBuildRender } from '@x-apaas/x-dcloud-page-web'
import { FormLogicMixin } from '@x-apaas/x-dcloud-page-engine'
import DrawerPopupMixin from '@/mixin/drawer-popup.mixin'
export default {
  name: 'FormReadDrawer',
  components: {
    XFormBuildRender
  },
  renderLogic: 'CUSTOM_READ',
  mixins: [FormLogicMixin, DrawerPopupMixin],
  data() {
    return {
      renderScene: 'read',
      drawerVisible: false,
      drawerWrapperClass: '',
      formDrawerPromise: {
        resolve: null,
        reject: null
      },
      queryParams: {},
      formBtns: [
        {
          action: "READ_DRAWER_EDIT",
          buttonCode: "EDIT",
          buttonName: "编辑",
          buttonType: "SYS_BUTTON",
          icon: "edit-icon",
          isActive: false,
          loading: false,
          order: 0,
          text: "编辑"
        }, 
        // {
        //   action: "DO_DELETE",
        //   buttonCode: "DELETE",
        //   buttonName: "删除",
        //   buttonType: "SYS_BUTTON",
        //   icon: "delete-icon",
        //   isActive: false,
        //   loading: false,
        //   needRefresh: true,
        //   order: 1,
        //   text: "删除"
        // },
        {
          "text": "关闭",
          "icon": "close-icon",
          "buttonCode": "CLOSE",
          "order": 100,
          "loading": false,
          "isActive": false
        }
      ]
    }
  },
  mounted() {

  },
  methods: {
    openFormDrawerWithPromise(queryParams, hooks) {
      return new Promise((resolve, reject) => {
        this.formDrawerPromise.resolve = resolve
        this.formDrawerPromise.reject = reject
        this.drawerVisible = true
        this.queryParams = queryParams
        this.createWithCustomLife()
      })
    },
    handleClose() {

    },
    handleClosed() {

    },
    onClickButtonProxy(buttonCode, event) {
      if (buttonCode === 'EDIT') {
        debugger
        this.$eventBus.$emit('openFormModalWithPromise', { ...this.queryParams, callback: this.refreshDetailData})
      } else if (buttonCode === 'CLOSE') {
        this.drawerVisible = false
      }
    },
    refreshDetailData() {
      this.initDetailData(this)
    }
  }
}
</script>
<style lang="scss"> 
.x-form-read  {
  .x-svg-icon {
    margin-right: 0.85714rem;
    cursor: pointer;
  }
}
</style>