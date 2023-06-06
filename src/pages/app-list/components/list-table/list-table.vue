<template>
  <div class="list-table">
    <el-table
      ref="listTable"
      :data="tableData"
      tooltip-effect="dark"
      style="width: 100%"
      height="calc(100% - 56px)"
      @selection-change="handleSelectionChange"
      @row-click="rowClick">
      <el-table-column
        type="selection"
        width="55">
      </el-table-column>
      <template v-for="column in columns">
        <el-table-column
          :key="column.uuid"
          :prop="column.prop"
          :label="column.label"
          >
            <template slot="header">
              <span class="column-header">{{ column.label }} </span>
            </template>
            <template slot-scope="scope">
              <component
                v-if="columnComponents[column.uuid]"
                :is="columnComponents[column.uuid].list"
                :key="column.uuid"
                :formData="scope.row"
                :config="column"
                :renderClient="'web'"
                >
              </component>
              <div v-else class="column-content">
                {{ scope.row[column.uuid] }}
              </div>
            </template>
        </el-table-column>
      </template>
    </el-table>
    <FormReadDrawer ref="formReadDrawer"></FormReadDrawer>
  </div>
</template>
<script>
import FormReadDrawer from '@/pages/form/form-read-drawer/form-read-drawer.vue'
import DB from '@x-apaas/x-dcloud-database-api'
import customConfig from '@/database/custom.config'
export default {
  name: 'listTable',
  components: {
    FormReadDrawer
  },
  data() {
    return {
      tableData: [],
      columns: [],
      selectOptions: [],
      columnComponents: {}
    }
  },
  mounted() {
    new DB(window, customConfig).then((db) => {
      db.queryAll({
        tableName: "form_config", 
        success: (res) => {
          console.log('-----表单组件渲染------', res)
          if (res.length > 0) {
            this.columnComponents = {}
            res[0].config.formItemList.forEach(ele => {
              if (ele.render && ele.render.list) {
                this.columnComponents[ele.uuid] = {
                  list: ele.render.list,
                  config: ele
                }
                this.$forceUpdate()
              }
            })
          }
        }
      })
    })
  },
  methods: {
    handleSelectionChange(options) {
      this.selectOptions = options
      this.$eventBus.$emit('selectedChange', options)
    },
    rowClick(row, column, event) {
      this.$refs.formReadDrawer.openFormDrawerWithPromise({
        title: '详情页',
        documentId: row.id
      })
    }
  }
}
</script>
<style lang="scss">
.list-table {
  height: calc(100vh - 186px);

  .column-header {
    font-weight: 700;
  }

  .el-table__empty-block {
    width: 100%;
  }
}
</style>