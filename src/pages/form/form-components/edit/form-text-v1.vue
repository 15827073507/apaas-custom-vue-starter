<template>
  <div class="form-text-v1">
    {{ widget.label }}
    <div class="value">{{ formValue }}</div>
  </div>
</template>
<script>
import FormWidgetConfigMixin from '@/mixin/form-widget.mixin'
export default {
  name: 'FormCustomTextV1',
  mixins: [FormWidgetConfigMixin]
}
</script>
<style lang="scss" scoped>
.form-text-v1 {
  width: 100%;

  .value {
    height: 24px;
  }
}
</style>
