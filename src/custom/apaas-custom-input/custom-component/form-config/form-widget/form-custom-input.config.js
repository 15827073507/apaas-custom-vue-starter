const FormCustomInputConfig = {
  version: 2.0,
  code: 'FORM_CUSTOM_INPUT',
  desc: {
    icon: 'form-text',
    // iconType: 'DEFAULT',
    text: '自开发输入框ssss',
    description: '这是一个自开发输入框ssss'
  },
  instance: {
    uuid: '$itemUuid',
    inTable: false
  },
  component: {
    edit: 'FormCustomTableInput',
    read: 'FormCustomTableInput',
    ide: 'FormCustomTableInput',
    list: 'listColumnInput'
  },
  widget: {
    display: {
      label: '新版自开发文本输入',
      width: 6,
      mobileWidth: 12,
      useInEdit: true,
      hidden: false,
      readOnly: false
    },
    allow: {
      calcRule: false,
      useInTableColumn: false,
      scanCode: false,
      copy: false
    },
    default: {
      customDefaultKey: 'defaultValue',
      value: null,
      width: 6,
      formLayoutDisable: true
      // areaValue: null,
      // userValue: null,
      // deptValue: null,
      // selectValue: null
    },
    validator: {
      uniqueCheck: false
      // , decimalNum: 2,
      // maxValue: null,
      // minValue: null,
      // rangeInLocation: null,
      // fileMaxSize: 10 * 1024 * 1024,
      // fileMaxNum: null
    },
    special: {
      // documentNumRules: [],
      // excludeComponentTypes: ['FORM_WIDGET_TABLE', 'FORM_WIDGET_SPACE']
      customComponentConfig: {
        label: '新版自开发文本输入'
      }
    },
    editor: {
      config: [
        'INFO',
        'BTN_NAME',
        'CUSTOM_LABEL',
        'TITLE_DESCRIPTION',
        'ALIGN',
        'BUTTON_WIDTH',
        'WIDTH',
        'READONLY',
        'HIDDEN'
      ]
    }
  },
  client: {
    mobile: {
      widget: {
        editor: {
          config: [
            'INFO',
            'BTN_NAME',
            'CUSTOM_LABEL',
            'TITLE_DESCRIPTION',
            'ALIGN',
            'BUTTON_WIDTH',
            'WIDTH',
            'READONLY',
            'HIDDEN'
          ]
        }
      },
      component: {
        ide: 'MobileFormCustomTableInput',
        edit: 'MobileFormCustomTableInput',
        read: 'MobileFormCustomTableInput',
        list: 'MobileFormCustomListColumn'
      }
    }
  }
}

export default FormCustomInputConfig
