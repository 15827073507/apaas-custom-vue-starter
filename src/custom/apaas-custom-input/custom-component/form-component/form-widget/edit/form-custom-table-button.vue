<template>
  <div class="form-custom-table-button" style="width: 100%;">
    {{ widget.label }}
    <el-input
      placeholder="请输入内容"
      v-model="formValue"
      maxlength="999999999999"
    >
    </el-input>
  </div>
</template>
<script>
import FormWidgetConfigMixin from '@/mixin/form-widget.mixin'
export default {
  name: 'FormCustomTableInput',
  mixins: [FormWidgetConfigMixin]
}
</script>
