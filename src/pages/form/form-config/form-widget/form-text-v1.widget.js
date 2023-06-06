const FormCustomTextV1Config = {
  version: 2.0,
  code: 'FORM_CUSTOM_TEXT_V1',
  desc: {
    icon: 'x-lib-static-text',
    // iconType: 'DEFAULT',
    text: '静态文本',
    description: '这是一个静态文本'
  },
  instance: {
    uuid: '$itemUuid',
    inTable: false
  },
  component: {
    edit: 'FormCustomTextV1',
    read: 'FormCustomTextV1',
    ide: 'FormCustomTextV1',
    list: ''
  },
  widget: {
    display: {
      label: '静态文本~',
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
      width: 6
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
        label: '静态文本~'
      }
    },
    editor: {
      config: [
        'INFO',
        'BTN_NAME',
        // 'CUSTOM_LABEL',
        // 'TITLE_DESCRIPTION'
        // 'ALIGN',
        // 'BUTTON_WIDTH',
        'WIDTH',
        // 'READONLY',
        // 'HIDDEN'
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
        ide: 'MobileFormCustomTextV1',
        edit: 'MobileFormCustomTextV1',
        read: 'MobileFormCustomTextV1',
        list: ''
      }
    }
  }
}

export default FormCustomTextV1Config
