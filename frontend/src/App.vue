<template>
  <v-app>
    <core-toolbar v-if="login" />

    <core-drawer v-if="login" />

    <core-view />
    <!-- <core-filter/> -->
  </v-app>
</template>

<script>
export default {
  data: () => ({
    login: false
  }),
  created () {
    this.checkAuth()
  },
  methods: {
    checkAuth () {
      let data = localStorage.getItem('views')
      if (data) {
        this.login = true
        return
      }
      data = localStorage.getItem('admin')
      if (data) {
        this.login = true
      }
      data = localStorage.getItem('super-admin')
      if (data) {
        this.login = true
      }
    }
  }
}
</script>

<style lang="scss">
@import "@/styles/index.scss";

.v-datatable thead th.column.sortable i {
  vertical-align: unset;
}
</style>
