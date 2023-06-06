<template>
  <div class="white-layout">
    <base-header>
      <template v-slot:append>
        <div class="app-workbench__icon">
          <x-svg-icon name="workbench-icon"></x-svg-icon>
        </div>
      </template>
    </base-header>
    <div class="admin__container">
      <Home></Home>
    </div>
  </div>
</template>
<script>
import BaseHeader from '@/components/base-header'
import FormRender from '@/pages/form/form.vue'
import Home from '@/pages/home/home.vue'
export default {
  name: 'WhiteLayout',
  components: {
    BaseHeader,
    FormRender,
    Home
  },
  data() {
    return {
    }
  }
}
</script>
<style lang="scss" scoped>
.white-layout {
  .admin__container {
    display: flex;
    height: calc(100vh - 64px);
    margin: 0 auto;
    overflow: hidden;
  }
  .admin__main {
    flex: 1;
    overflow: hidden;
  }
}
</style>