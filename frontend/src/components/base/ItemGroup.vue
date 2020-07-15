<template>
  <v-list-group
    v-if="item.groupItem"
    :key="item.text"
    :active-class="color"
    no-action>
    <template v-slot:activator>
      <v-list-tile
        :active-class="color"
        :to="item.to"
        avatar
        class="v-list-item">
        <v-list-tile-action>
          <v-icon>{{ item.icon }}</v-icon>
        </v-list-tile-action>
        <v-list-tile-content>
          <v-list-tile-title>{{ item.text }}</v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
    </template>
  </v-list-group>
</template>

<script>
// Utilities
import kebabCase from 'lodash/kebabCase'
import { mapState } from 'vuex'

export default {
  name: 'ItemGroup',

  inheritAttrs: false,

  props: {
    item: {
      type: Object,
      default: () => ({
        avatar: undefined,
        group: undefined,
        title: undefined,
        children: []
      })
    },
    subGroup: {
      type: Boolean,
      default: false
    },
    text: {
      type: Boolean,
      default: false
    }
  },

  computed: {
    ...mapState(['color ']),
    children () {
      return this.item.children.map(item => ({
        ...item,
        to: !item.to ? undefined : `${this.item.group}/${item.to}`
      }))
    },
    computedText () {
      if (!this.item || !this.item.title) return ''

      let text = ''

      this.item.title.split(' ').forEach(val => {
        text += val.substring(0, 1)
      })

      return text
    },
    group () {
      return this.genGroup(this.item.children)
    }
  },

  methods: {
    genGroup (children) {
      return children
        .filter(item => item.to)
        .map(item => {
          const parent = item.group || this.item.group
          let group = `${parent}/${kebabCase(item.to)}`

          if (item.children) {
            group = `${group}|${this.genGroup(item.children)}`
          }

          return group
        })
        .join('|')
    }
  }
}
</script>

<style>
.v-list-group__activator p {
  margin-bottom: 0;
}
</style>
