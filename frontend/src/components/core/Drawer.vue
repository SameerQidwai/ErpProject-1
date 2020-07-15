<template>
  <v-navigation-drawer
    id="app-drawer"
    v-model="inputValue"
    v-bind="$attrs"
    dark
    app
    mobile-break-point="960"
    width="260"
  >
    <v-img
      :src="images[dImg]"
      min-height="100%">
      <v-layout
        class="fill-height"
        tag="v-list"
        column>
        <div class="Barmuda">
          <v-list-tile avatar>
            <v-list-tile-avatar color="white" />
            <v-list-tile-title class="title">ERP by 5Cube</v-list-tile-title>
          </v-list-tile>
          <v-divider />
          <template v-for="item in links">
            <v-list-group
              v-if="item.groupItem"
              :key="item.text"
              :active-class="color">
              <template v-slot:activator>
                <v-list-tile
                  :active-class="color"
                  class="v-list-item">
                  <v-list-tile-action>
                    <v-icon>{{ item.icon }}</v-icon>
                  </v-list-tile-action>
                  <v-list-tile-content>
                    <v-list-tile-title>{{ item.text }}</v-list-tile-title>
                  </v-list-tile-content>
                </v-list-tile>
              </template>

              <v-list-tile
                v-for="subItem in item.groupItem"
                :key="subItem.text"
                :active-class="color"
                :to="subItem.to"
                avatar
                class="v-list-item"
              >
                <v-list-tile-content>
                  <v-list-tile-title class="text-xs-center">{{ subItem.text }}</v-list-tile-title>
                </v-list-tile-content>

                <v-list-tile-action>
                  <v-icon>{{ subItem.icon }}</v-icon>
                </v-list-tile-action>
              </v-list-tile>
            </v-list-group>

            <v-list-tile
              v-else
              :to="item.to"
              :active-class="color"
              :key="item.text"
              avatar
              class="v-list-item"
            >
              <v-list-tile-action>
                <v-icon>{{ item.icon }}</v-icon>
              </v-list-tile-action>
              <v-list-tile-title v-text="item.text" />
            </v-list-tile>
          </template>
          <div />
        </div>
      </v-layout>
    </v-img>
  </v-navigation-drawer>
</template>

<script>
// Utilities
import { mapMutations, mapState } from 'vuex'

/* eslint-disable */
export default {
  props: {
    opened: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    logo: "../../assets/favicon.ico",
    links: [],
    images: [
      "https://demos.creative-tim.com/vue-material-dashboard/img/sidebar-1.23832d31.jpg",
      "https://demos.creative-tim.com/vue-material-dashboard/img/sidebar-2.32103624.jpg",
      "https://demos.creative-tim.com/vue-material-dashboard/img/sidebar-3.3a54f533.jpg",
      "https://demos.creative-tim.com/vue-material-dashboard/img/sidebar-4.3b7e38ed.jpg",
      "https://demos.creative-tim.com/material-dashboard/assets/img/sidebar-1.jpg",
      "https://demos.creative-tim.com/material-dashboard/assets/img/sidebar-2.jpg",
      "https://demos.creative-tim.com/material-dashboard/assets/img/sidebar-3.jpg",
      "https://demos.creative-tim.com/material-dashboard/assets/img/sidebar-4.jpg"
    ],
    dImg: 0,
    openIt: true
  }),
  computed: {
    ...mapState("app", ["image", "color"]),
    inputValue: {
      get() {
        return this.$store.state.app.drawer;
      },
      set(val) {
        this.setDrawer(val);
      }
    },
    items() {
      return this.$t("Layout.View.items");
    }
  },
  methods: {
    ...mapMutations("app", ["setDrawer", "toggleDrawer"]),
    getRandomInt(max) {
      return Math.floor(Math.random() * Math.floor(max));
    }
  },
  created() {
    this.links = JSON.parse(localStorage.getItem('links'))
    this.dImg = this.getRandomInt(7);
  }
};
</script>

<style lang="scss">
.v-navigation-drawer::-webkit-scrollbar {
  width: 1px !important;
}
.v-list-group__activator p {
  margin-bottom: 0;
}
.v-navigation-drawer .v-list .v-list-item > .v-list__tile {
  padding: 10px 10px !important;
}
#app-drawer {
  .v-list__tile {
    border-radius: 10px;

    &--buy {
      margin-top: auto;
      margin-bottom: 17px;
    }
  }
}
</style>