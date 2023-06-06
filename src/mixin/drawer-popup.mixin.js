import {
  pushDrawerStack,
  popDrawerStack,
  getTopInstance,
  destroyedInstance
} from '@/utils/drawer'

export default {
  data() {
    return {
      isPopUp: false
    }
  },
  destroyed() {
    const prevDrawerInstance = getTopInstance()
    // 避免意外情况发生
    if (prevDrawerInstance) {
      if (prevDrawerInstance._uid === this._uid) {
        // 避免意外destroyed，没有走drawerPopupAfter，导致抽屉没有收进去
        this.drawerPopupAfter()
      } else if (prevDrawerInstance.isPopUp === true) {
        // 避免意外destroyed，走drawerPopupAfter了，但抽屉没有收进去
        prevDrawerInstance.runPickUp()
      }
    }
    destroyedInstance(this)
  },
  methods: {
    drawerPopupBefore() {
      let prevDrawerInstance = getTopInstance()
      if (prevDrawerInstance) {
        prevDrawerInstance.runPopUp()
      }
      pushDrawerStack(this)
    },
    drawerPopupAfter() {
      popDrawerStack(this)
      let prevDrawerInstance = getTopInstance()
      if (prevDrawerInstance) {
        prevDrawerInstance.runPickUp()
      }
    },
    runPopUp() {
      this.isPopUp = true
    },
    runPickUp() {
      this.isPopUp = false
    }
  }
}
