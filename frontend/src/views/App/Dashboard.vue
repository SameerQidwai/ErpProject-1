<template>
  <v-container
    fill-height
    fluid
    grid-list-xl>
    <v-layout wrap>
      <v-flex
        v-for="item in items"
        :key="item.text"
        sm6
        xs12
        md6
        lg4>
        <material-stats-card
          :title="item['group']"
          :value="item.text"
          :icon="item.icon"
          color="green"
          class="cursor"
          @click="to(item['to'])"
        />
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  data () {
    return {
      items: []
    }
  },
  created () {
    this.getItems()
  },
  methods: {
    getItems () {
      let data = JSON.parse(localStorage.getItem('links'))
      for (let i of data) {
        if (i['to'] && i['text'] !== 'Dashboard' && i['text'] !== 'User') {
          this.items.push(i)
        } else if (i['groupItem']) {
          for (let j of i['groupItem']) {
            j['group'] = i['group']
            this.items.push(j)
          }
        }
      }
    },
    to (path) {
      this.$router.push(path)
    }
  }
}
</script>
<style scoped>
.cursor {
  cursor: pointer;
}
</style>
