import formRender from './form.vue'
import admin from '@/pages/admin/admin.vue'

export default {
  path: '/admin',
  name: 'admin',
  component: admin,
  children: [
    {
      path: '/formRender',
      name: 'formRender',
      component: formRender,
    }
  ]
}