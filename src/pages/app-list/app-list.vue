<template>
  <div class="app-list">
    <listHeader ref="listHeader" @operate="operate"></listHeader>
    <listTable ref="listTable"></listTable>
  </div>
</template>
<script>
import listHeader from './components/list-header/list-header.vue'
import listTable from './components/list-table/list-table.vue'
import FormEdit from './components/form-edit/form-edit.vue'
import DB from '@x-apaas/x-dcloud-database-api'
import customConfig from '@/database/custom.config'
export default {
  name: 'AppList',
  provide() {
    return {
      refreshTable: this.queryTableData
    }
  },
  components: {
    listHeader,
    listTable,
    FormEdit
  },
  mounted() {
    this.queryTableColumns()
    this.queryTableData()
  },
  methods: {
    queryTableColumns() {
      new DB(window, customConfig).then((db) => {
        db.queryAll({
          tableName: "form_config", 
          success: (res) => {
            console.log('----queryTableColumns---',res)
            if (res.length > 0) {
              let formItemList = res[0].config.formItemList || [], columns = []
              formItemList.forEach(ele => {
                let column = {
                  key: ele.uuid,
                  config: ele,
                  uuid: ele.uuid,
                  property: ele.uuid,
                  label: ele.label
                }
                columns.push(column)
              });
              this.$set(this.$refs.listTable, 'columns', columns)
            }
          }
        })
      })
    },
    queryTableData() {
      new DB(window, customConfig).then((db) => {
        db.queryAll({
          tableName: "form_list", 
          success: (res) => {
            console.log('----queryTableData---', res)
            if (res.length > 0) {
              this.$set(this.$refs.listTable, 'tableData', res.map(item => {
                return {...item.formData, id: item.id}
              }).reverse())
            } else {
              this.$set(this.$refs.listTable, 'tableData', [])
            }
          }
        })
      })
    },
    operate({type}) {
      if (type === 'ADD') {
        this.$refs.formEdit.openFormModalWithPromise({
          title: '新增表单'
        })
      }
    }
  }
}
</script>
<style lang="scss">
.app-list {
  height: calc(100vh - 130px);
}
</style>