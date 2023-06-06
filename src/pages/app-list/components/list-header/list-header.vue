<template>
  <div class="list-header">
    <div class="list-header-title">
      <slot name="title">列表</slot>
    </div>
    <div class="list-header-button">
      <el-button
        class="list-button ADD"
        type="primary"
        :loading="loading"
        @click.native="insertTableData($event)"
      >
       新增
      </el-button>

      <el-button
        class="list-button Delete"
        type="danger"
        :loading="loading"
        v-show="showDelete"
        @click.native="deleteTableData($event)"
      >
       删除
      </el-button>
    </div>
    <FormEdit ref="formEdit"></FormEdit>
  </div>
</template>
<script>
import FormEdit from '../form-edit/form-edit.vue'
import DB from '@x-apaas/x-dcloud-database-api'
import customConfig from '@/database/custom.config'
export default {
  name: 'listHeader',
  components: {
    FormEdit
  },
  inject: ['refreshTable'],
  data() {
    return  {
      loading: false,
      showDelete: false,
      selectedOptions: []
    }
  },
  mounted() {
    this.$eventBus.$on('selectedChange', (options) => {
      this.selectedOptions = options
      options.length > 0 ? this.showDelete = true : this.showDelete = false
    })
  },
  methods: {
    insertTableData() {
      this.$refs.formEdit.openFormModalWithPromise({
        title: '新增表单'
      })
    },
    deleteTableData() {
      const ids = this.selectedOptions.map(item => item.id) || []
      new DB(window, customConfig).then((db) => {
        db.delete({
          tableName: "form_list",
          condition: (item)=> { return ids.includes(item.id)},
          success: (res) => {
            console.log("删除成功");
            this.refreshTable()
          }
        });
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.list-header {
  // display: -webkit-box;
  // display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: justify;
  -ms-flex-pack: justify;
  justify-content: space-between;
  height: 56px;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  .list-header-title {
    font-family: 'PingFang SC,BlinkMacSystemFont,-apple-system,Microsoft YaHei,Arial,sans-serif';
    font-weight: 700;
  }

  .list-header-button {
    margin-left: auto;
  }
}
</style>