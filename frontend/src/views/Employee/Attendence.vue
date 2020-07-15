<template>
  <v-container
    fill-height
    fluid
    grid-list-xl>
    <v-layout wrap>
      <v-flex md12>
        <!-- can make this component will do after -->
        <v-card
          v-bind="$attrs"
          v-on="$listeners">
          <helper-offset>
            <v-toolbar
              color="orange"
              dark
              tabs>
              <div xs2>
                <v-text-field
                  v-model="search"
                  class="mr-2"
                  flat
                  solo-inverted
                  dense
                  clearable
                  label="Search Item"
                  prepend-inner-icon="mdi-magnify"
                />
              </div>
            </v-toolbar>
          </helper-offset>
        </v-card>
        <!-- will do some other Time -->
        <v-data-table
          :headers="attend_headers"
          :items="getEmp"
          :search="search"
          hide-actions>
          <template
            slot="headerCell"
            slot-scope="{ header }">
            <span
              class="font-weight-bolder text--darken-3"
              v-text="header.text" />
          </template>
          <template
            slot="items"
            slot-scope="{  index , item }">
            <td>
              <v-icon @click="showHistory(item)">mdi mdi-view-list</v-icon>
            </td>
            <td>{{ item.name }}</td>
            <!-- itemCode-->
            <td>{{ item.fName }}</td>
            <!-- itemType-->
            <td @click="funct(item)">{{ item.phone }}</td>
            <!--itemCost -->
            <td class="text-xs-right">
              <v-checkbox
                :disabled="!permissions['add']"
                :readonly="item.att=today == new Date(item.lastAtt.date).toDateString()"
                v-model="item.att"
                color="green"
                @change="addAtt(item._id)"
              />
              <!-- <span>
                <v-radio-group
                  row
                  v-model="item.att"
                  @change="addAtt(item._id,item.att,item.lastAtt)"
                >
                  <v-radio label="P" color="success" :value="true"></v-radio>
                  <v-radio label="A" color="error" :value="false"></v-radio>
                </v-radio-group>
              </span> -->
            </td>
          </template>
        </v-data-table>
      </v-flex>
    </v-layout>
    <!--DialogS-->

    <!-- delete Dialog -->
    <v-dialog
      v-model="history"
      max-width="400">
      <v-card>
        <v-card-title class="headline">Attendence Inquiry of {{ ItemObj.name }}</v-card-title>
        <v-container grid-list-md>
          <v-data-table
            :headers="dialog_headers"
            :items="attend"
            :search="search"
            hide-actions>
            <template
              slot="headerCell"
              slot-scope="{ header }">
              <span
                class="font-weight-bolder text--darken-3"
                v-text="header.text" />
            </template>
            <template
              slot="items"
              slot-scope="{  index , item }">
              <td>{{ changeDate(item.date) }}</td>
              <!-- itemCode-->
              <td>{{ checkStatus(item.status) }}</td>
              <!--itemCost -->
            </template>
          </v-data-table>
        </v-container>
      </v-card>
    </v-dialog>
    <!-- Delete dialog End -->
    <!--End Dialog'S-->
  </v-container>
</template>

<script>
import api from '../../services/payRoll-api'

export default {
  data () {
    return {
      search: null,
      attend_headers: [
        { sortable: false, text: 'History', value: 'id' },
        { sortable: false, text: 'Name', value: 'name' },
        { sortable: false, text: 'Father Name', value: 'fname' },
        { sortable: false, text: 'contact', value: 'phone' },
        { sortable: false, text: 'Attendence', value: 'attend', width: '15%' }
      ],
      dialog_headers: [
        { sortable: false, text: 'Date', value: 'date' },
        { sortable: false, text: 'Attendence', value: 'name' }
      ],
      array: [],
      itemId: null,
      ErrorDel: false,
      getEmp: [],
      ItemObj: {},
      attend: [],
      history: false,
      today: new Date().toDateString()
    }
  },
  created () {
    this.getEmployees()
    this.getPermissions()
  },
  methods: {
    funct (item) {
      if (this.today === new Date(item.lastAtt.date).toDateString()) {
        console.log(true)
        console.log(
          this.today,
          '     ',
          new Date(item.lastAtt.date).toDateString()
        )
      } else {
        console.log(false)
        console.log(
          this.today,
          '     ',
          new Date(item.lastAtt.date).toDateString()
        )
      }
    },
    getEmployees () {
      api.getAttEmp().then(res => {
        this.getEmp = res
      })
    },
    showHistory (item) {
      api.history(item._id).then(res => {
        if (res) {
          this.attend = res.att
        }
      })
      this.history = true
      this.ItemObj = item
    },
    addAtt (id) {
      var Adate = new Date()
      var data = { id, Adate }
      api.present(data).then(res => {
        if (res === true) {
          alert('Present')
        }
      })
    },
    changeDate (date) {
      date = new Date(date).toLocaleString()
      return date
    },
    checkStatus (status) {
      if (status == false) {
        return 'Absent'
      }
      return 'Present'
    },
    getPermissions () {
      let admin = localStorage.getItem('admin')
      if (admin) {
        this.permissions = { add: true, edit: true, delete: true }
        return
      }
      let permissions = JSON.parse(localStorage.getItem('permissions'))
      let name = this.$router.currentRoute.name
      this.permissions = permissions.find(x => x.name === name)
      console.log(this.permissions)
    }
  }
}
</script>

<style scoped>
</style>
