<template>
  <div class="form-custom-table-button" style="width: 100%;">
    <!-- {{ widget.label }} -->
    <el-input
      placeholder="请输入内容"
      v-model="formValue"
      maxlength="999999999999"
      @click.stop.native="clickInput"
    >
    </el-input>
  </div>
</template>
<script>
import listColumnConfigMixin from '@/mixin/list-column-config.mixin'
export default {
  name: 'listColumnInput',
  mixins: [listColumnConfigMixin],
  methods: {
    clickInput(event) {
      
    }
  }
}
</script>
