import '../../pages/form/form-components/index'
import '../../pages/form/form-config/index'
import Vue from 'vue'
import VueDOMPurifyHTML from 'vue-dompurify-html'

const initVueDOMPurifyHTML = () => {
  Vue.use(VueDOMPurifyHTML, {
    default: {
      ADD_TAGS: ['iframe', 'xmp']
    },
    hooks: {
      afterSanitizeAttributes: (currentNode) => {
        // Do something with the node
        // set all elements owning target to target=_blank
        if ('target' in currentNode) {
          currentNode.setAttribute('target', '_blank')
          // prevent https://www.owasp.org/index.php/Reverse_Tabnabbing
          currentNode.setAttribute('rel', 'noopener noreferrer')
        }
      }
    }
  })
}

initVueDOMPurifyHTML()

Vue.prototype.$eventBus = new Vue()