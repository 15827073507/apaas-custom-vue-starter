<template>
  <div class="home">
    <div class="tabs-content" ref="tabs">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="表单构建" name="first">
          <span slot="label"><i class="el-icon-date"></i> 表单构建</span>
          <FormRender ref="formRender"></FormRender>
        </el-tab-pane>
        <el-tab-pane label="列表" name="second" >
          <AppList ref="appList"></AppList>
        </el-tab-pane>
        <!-- <el-tab-pane label="自开发页面" name="third" >自开发页面</el-tab-pane>
        <el-tab-pane label="自开发布局" name="fourth" >自开发布局</el-tab-pane> -->
      </el-tabs>
      <div class="tab-right">
        <el-button
          v-if="activeName === 'first'"
          class="list-button SAVE"
          type="primary"
          :loading="loading"
          @click.native="saveFormConfig($event)"
        >
        保存
        </el-button>
      </div>
    </div>
  </div>
</template>
<script>
import FormRender from '../form/form.vue'
import AppList from '../app-list/app-list.vue'
import DB from '@x-apaas/x-dcloud-database-api'
import customConfig from '@/database/custom.config'
export default {
  name: 'Home',
  components: {
    FormRender,
    AppList
  },
  data() {
    return {
      activeName: 'first',
      loading: false
    }
  },
  mounted() {
    this.$refs.tabs.getElementsByClassName('el-tabs__header')[0].style.lineHeight = '50px'
  },
  methods: {
    handleClick(tab, event) {
      if (tab.name === 'second') {
        this.$refs.appList.queryTableColumns()
        this.$refs.appList.queryTableData()
      }
    },
    saveFormConfig() {
      this.$refs.formRender.saveFormConfig && this.$refs.formRender.saveFormConfig()

      // 清空列表数据
      new DB(window, customConfig).then((db) => {
        db.clearTable({
          tableName: 'form_list'
        })
      })

      this.$message({
          message: '表单配置保存成功！',
          type: 'success'
        });
    }
  }
}
</script>
<style lang="scss">
.home {
  height: 100%;
  width: 100%;
  // padding: 12px 16px;
  background-color: #f7f7f7;
  border-top: 1px solid #f7f7f7;

  .tabs-content {
    position: relative;
    background-color: #fff;
    height: 100%;

    .el-tabs__header {
      margin: 0;

      .el-tabs__nav-scroll {
        display: flex;
        justify-content: center;
      }
    }

    .el-tabs__nav-wrap::after {
      height: 0;
    }

    .el-tab-pane {
      padding: 8px 10px;
    }

    .el-tabs {
      margin: 0 15px;
    }

    .x-form-design{
      background-color: #f6f6f6;
      padding-top: 8px;
    }

    .tab-right {
      position: absolute;
      top: 9px;
      right: 35px;
    }
  }
}
</style>