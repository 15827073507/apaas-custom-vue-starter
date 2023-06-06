export default {
  inject: { getPageName: { default: undefined, from: 'getPageName' }, getModuleName: { default: undefined, from: 'getModuleName' } },
  created() {
    // 需要延迟获取监听，所以不要在创建时使用eventbus
    setTimeout(() => {
      var $eventbus = this.$options[`eventbus`]
      this.$busListeners = {}
      for (var name in $eventbus) {
        // this.$busListeners[name] = $bus[name].bind(this) //rebind and remember each declared listener
        // bus.$on(name, this.$busListeners[name]) //register a listener for the event

        let listener
        const $busObject = $eventbus[name]
        if ($busObject instanceof Function) {
          listener = $busObject
          listener = listener.bind(this)
        } else if ($busObject.listener && $busObject.listener instanceof Function) {
          listener = $busObject.listener.bind(this)
        }

        if (!$busObject.scope) {
          $busObject.scope = 'PAGE'
        }
        if ($busObject.scope === 'PAGE') {
          if (!$busObject.pageName) {
            $busObject.pageName = (this.getPageName instanceof Function) && this.getPageName()
            $busObject.moduleName = (this.getModuleName instanceof Function) && this.getModuleName()
          } else if (!$busObject.moduleName) {
            $busObject.moduleName = (this.getModuleName instanceof Function) && this.getModuleName()
          }

          this.$bus.$on(`${name}-${$busObject.moduleName}-${$busObject.pageName}`, listener)
        } else if ($busObject.scope === 'MODULE') {
          if (!$busObject.moduleName) {
            $busObject.moduleName = (this.getModuleName instanceof Function) && this.getModuleName()
          }
          this.$bus.$on(`${name}-${$busObject.moduleName}`, listener)
        } else if ($busObject.scope === 'APP') {
          this.$bus && this.$bus.$on(`${name}-APP`, listener)
        }
      }
    })
  },
  beforeDestroy() {
    var $eventbus = this.$options[`eventbus`]
    for (var name in $eventbus) {
      // this.$busListeners[name] = $bus[name].bind(this) //rebind and remember each declared listener
      // bus.$on(name, this.$busListeners[name]) //register a listener for the event
      const $busObject = $eventbus[name]

      if (!$busObject.scope) {
        $busObject.scope = 'PAGE'
      }
      if ($busObject.scope === 'PAGE') {
        if (!$busObject.pageName) {
          $busObject.pageName = (this.getPageName instanceof Function) && this.getPageName()
          $busObject.moduleName = (this.getModuleName instanceof Function) && this.getModuleName()
        } else if (!$busObject.moduleName) {
          $busObject.moduleName = (this.getModuleName instanceof Function) && this.getModuleName()
        }
        this.$bus.$off(`${name}-${$busObject.moduleName}-${$busObject.pageName}`)
      } else if ($busObject.scope === 'MODULE') {
        if (!$busObject.moduleName) {
          $busObject.moduleName = (this.getModuleName instanceof Function) && this.getModuleName()
        }
        this.$bus.$off(`${name}-${$busObject.moduleName}`)
      } else if ($busObject.scope === 'APP') {
        this.$bus && this.$bus.$off(`${name}-APP`)
      }
    }
  },
  methods: {
    $emitWithEventBus: function(event, object, config) {
      const emitConfig = {
        ...(config || {})
      }
      if (!emitConfig.scope) {
        emitConfig.scope = 'PAGE'
      }
      if (emitConfig.scope === 'PAGE') {
        if (!emitConfig.pageName) {
          emitConfig.pageName = (this.getPageName instanceof Function) && this.getPageName()
          emitConfig.moduleName = (this.getModuleName instanceof Function) && this.getModuleName()
        } else if (!emitConfig.moduleName) {
          emitConfig.moduleName = (this.getModuleName instanceof Function) && this.getModuleName()
        }

        this.$bus.$emit(`${event}-${emitConfig.moduleName}-${emitConfig.pageName}`, object)
      } else if (emitConfig.scope === 'MODULE') {
        if (!emitConfig.moduleName) {
          emitConfig.moduleName = (this.getModuleName instanceof Function) && this.getModuleName()
        }
        this.$bus.$emit(`${event}-${emitConfig.moduleName}`, object, {
          opt: 'STARTS_WITH'
        })
      } else if (emitConfig.scope === 'APP') {
        this.$bus.$emit(`${event}`, object, {
          opt: 'STARTS_WITH'
        })
      }
    }
  }
}
