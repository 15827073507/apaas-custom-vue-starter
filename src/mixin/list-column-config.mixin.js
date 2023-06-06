const listColumnConfigMixin = {
  data() {
    return {}
  },
  props: {
    propKey: {
      type: String,
      default: ''
    },
    formData: {
      type: Object
    },
    config: {
      type: Object
    }
  },
  computed: {
    formValue: {
      get() {
        return this.formData[this.config.property]
      },
      set(value) {
        if (this.formData[this.config.property] !== value) {
          this.$set(this.formData, this.config.property, value)
        }
      }
    }
  }
}
export default listColumnConfigMixin