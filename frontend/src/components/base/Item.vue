<template>
  <v-list-tile
    :to="item.to"
    :active-class="color"
    :key="item.text"
    avatar
    class="v-list-item">
    <v-list-tile-action>
      <v-icon>{{ item.icon }}</v-icon>
    </v-list-tile-action>
    <v-list-tile-title v-text="item.text" />
  </v-list-tile>
</template>

<script>
import Themeable from 'vuetify/lib/mixins/themeable'

export default {
  name: 'Item',

  mixins: [Themeable],

  props: {
    item: {
      type: Object,
      default: () => ({
        href: undefined,
        icon: undefined,
        subtitle: undefined,
        title: undefined,
        to: undefined
      })
    },
    text: {
      type: Boolean,
      default: false
    }
  },

  computed: {
    computedText () {
      if (!this.item || !this.item.title) return ''

      let text = ''

      this.item.title.split(' ').forEach(val => {
        text += val.substring(0, 1)
      })

      return text
    },
    href () {
      return this.item.href || (!this.item.to ? '#' : undefined)
    }
  }
}
</script>
