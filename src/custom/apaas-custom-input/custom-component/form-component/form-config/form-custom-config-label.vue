<template>
  <div class="form-config-item form-config-label form-custom-config-label">
    <div class="label-wrapper">
      <el-form-item
        :label="$t('formConfig.label.titleName')"
        :rules="rules[configProperty]"
        :prop="configProperty"
      >
        <x-i18n-input
          v-model="labelValue"
          :disabled="disabled"
          :maxlength="200"
          :i18nResourceCode.sync="configI18nCode"
          :i18nAssociated.sync="configI18nAssociated"
          :i18nData.sync="configI18nData"
          :placeholder="$t('common.formPlaceholder.input')"
        ></x-i18n-input>
      </el-form-item>
    </div>
  </div>
</template>
<script>
import EditorFormConfigMixin from '@/mixin/form-config.mixin'

export default {
  name: 'FormCustomConfigLabel',
  mixins: [EditorFormConfigMixin],
  props: {},
  data() {
    return {
      rules: {}
    }
  },
  computed: {
    labelValue: {
      get() {
        return this.componentConfig && this.componentConfig.customComponentConfig.label
      },
      set(value) {
        this.componentConfig.customComponentConfig.label = value
      }
    }
  }
}
</script>
<style lang="scss"></style>
