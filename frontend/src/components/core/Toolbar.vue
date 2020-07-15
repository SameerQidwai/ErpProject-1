<template>
  <v-toolbar
    id="core-toolbar"
    :scroll-threshold="100"
    app
    flat
    scroll-off-screen
    prominent
    style="background: #eee;"
  >
    <div class="v-toolbar-title">
      <v-toolbar-title class="tertiary--text font-weight-light">
        <v-btn
          v-if="responsive"
          class="default v-btn--simple"
          dark
          icon
          @click.stop="onClickBtn">
          <v-icon>mdi-view-list</v-icon>
        </v-btn>
        {{ title }}
      </v-toolbar-title>
    </div>

    <v-spacer />
    <v-flex
      md1
      hidden-print-only>
      <v-btn
        color="green darken-1"
        @click="logout()">Logout</v-btn>
    </v-flex>
  </v-toolbar>
</template>

<script>
import { mapMutations } from 'vuex'
/* eslint-disable */
export default {
  data: () => ({
    notifications: [
      "Mike, John responded to your email",
      "You have 5 new tasks",
      "You're now a friend with Andrew",
      "Another Notification",
      "Another One"
    ],
    title: null,
    responsive: true
  }),

  watch: {
    $route(val) {
      this.title = val.name;
    }
  },

  mounted() {
    this.onResponsiveInverted();
    window.addEventListener("resize", this.onResponsiveInverted);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.onResponsiveInverted);
  },

  methods: {
    ...mapMutations("app", ["setDrawer", "toggleDrawer"]),
    onClickBtn() {
      this.setDrawer(!this.$store.state.app.drawer);
    },
    onClick() {
      //
    },
    onResponsiveInverted() {
      if (window.innerWidth < 991) {
        this.responsive = true;
      } else {
        this.responsive = true;
      }
    },
    logout() {
      localStorage.removeItem("views");
      localStorage.removeItem("admin");
      localStorage.removeItem("permissions");
      localStorage.removeItem("super-admin");
      localStorage.removeItem("pageHeaders");
      localStorage.removeItem("links");
      // this.$router.push("user-login");
      location.reload();
    }
  },
  created() {
    this.setDrawer(false);
  }
};
</script>

<style>
#core-toolbar a {
  text-decoration: none;
}

</style>
