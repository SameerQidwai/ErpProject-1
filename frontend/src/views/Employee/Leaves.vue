<template>
  <v-container
    fill-height
    fluid
    grid-list-xl>
    <v-layout wrap>
      <v-flex
        md12
        lg12>
        <v-card
          v-bind="$attrs"
          v-on="$listeners">
          <helper-offset
            :inline="inline"
            :full-width="fullWidth"
            :offset="offset">
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
              <v-flex xs2>
                <v-menu
                  v-model="menu2"
                  :close-on-content-click="false"
                  :nudge-right="40"
                  lazy
                  transition="scale-transition"
                  offset-y
                  full-width
                  max-width="290px"
                  min-width="290px"
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      v-model="date"
                      label="Date"
                      readonly
                      v-on="on" />
                  </template>
                  <v-date-picker
                    v-model="date"
                    type="month"
                    dark
                    no-title
                    @input="menu2 = false" />
                </v-menu>
              </v-flex>
              <v-spacer />
              <v-btn
                v-if="permissions['add']"
                @click="getEmployees(); leaveDialog=true">Add Leaves</v-btn>
            </v-toolbar>
          </helper-offset>
        </v-card>
        <v-data-table
          :headers="attend_headers"
          :items="getLeaves"
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
            <td>{{ item.name }}</td>
            <td>{{ item.subDate }}</td>
            <td>{{ item.diaDate1 }} - {{ item.diaDate2 }}</td>
            <td>{{ item.reason }}</td>
          </template>
        </v-data-table>
      </v-flex>
    </v-layout>

    <v-dialog
      v-model="leaveDialog"
      persistent
      max-width="600">
      <v-card>
        <v-card-title class="headline">Absence Leave</v-card-title>
        <v-container grid-list-md>
          <v-layout wrap>
            <v-flex md12>
              <v-autocomplete
                :items="getEmp"
                v-model="newItem.emp"
                class="mr-2"
                flat
                solo
                dense
                clearable
                item-text="name"
                return-object
                label="Employee Name"
                prepend-inner-icon="mdi-select"
              />
            </v-flex>
            <v-flex md6>
              <v-menu
                v-model="diaMenu1"
                :close-on-content-click="false"
                :nudge-right="40"
                lazy
                transition="scale-transition"
                offset-y
                full-width
                max-width="290px"
                min-width="290px"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-model="newItem.diaDate1"
                    label="Date From"
                    readonly
                    v-on="on" />
                </template>
                <v-date-picker
                  v-model="newItem.diaDate1"
                  dark
                  no-title
                  @input="diaMenu1 = false; "
                />
              </v-menu>
            </v-flex>
            <v-flex md6>
              <v-menu
                v-model="diaMenu2"
                :close-on-content-click="false"
                :nudge-right="40"
                lazy
                transition="scale-transition"
                offset-y
                full-width
                max-width="290px"
                min-width="290px"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-model="newItem.diaDate2"
                    label="Date Till"
                    readonly
                    v-on="on" />
                </template>
                <v-date-picker
                  v-model="newItem.diaDate2"
                  dark
                  no-title
                  @input="diaMenu2 = false; "
                />
              </v-menu>
            </v-flex>
            <v-flex md12>
              <v-textarea
                v-model="newItem.reason"
                label="Reason" />
            </v-flex>
          </v-layout>
        </v-container>
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="green darken-1"
            @click="addLeave()">Save</v-btn>
          <v-btn
            color="orange"
            @click="leaveDialog = false">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import api from '../../services/payRoll-api'

export default {
  props: {
    color: {
      type: String,
      default: 'secondary'
    },
    elevation: {
      type: [Number, String],
      default: 10
    },
    inline: {
      type: Boolean,
      default: false
    },
    fullWidth: {
      type: Boolean,
      default: false
    },
    offset: {
      type: [Number, String],
      default: 24
    }
  },
  data () {
    return {
      search: null,
      attend_headers: [
        { sortable: false, text: 'Name', value: 'name' },
        { sortable: false, text: 'Applied Date', value: 'aDate' },
        { sortable: false, text: 'Requested Date', value: 'rDate' },
        { sortable: false, text: 'reason', value: 'reason' }
      ],
      getEmp: [],
      getLeaves: [],
      newItem: {},
      leaveDialog: false,
      menu2: false,
      diaMenu1: false,
      diaMenu2: false,
      date: new Date().toISOString().substr(0, 10)
    }
  },
  created () {
    this.getLeave()
    this.getPermissions()
  },
  methods: {
    getEmployees () {
      api.getEmpApi().then(res => {
        this.getEmp = res
      })
    },
    getLeave () {
      api.getLeave().then(res => {
        this.getLeaves = res
      })
    },
    addLeave () {
      this.newItem.eId = this.newItem.emp._id
      this.newItem.name = this.newItem.emp.name
      this.newItem.myDate = new Date()
      delete this.newItem.emp
      api.addLeave(this.newItem).then(res => {
        if (res === true) {
          this.getLeave()
          this.leaveDialog = false
        }
      })
    },
    getPermissions () {
      let admin = localStorage.getItem('admin')
      if (admin) {
        this.permissions = { 'add': true, 'edit': true, 'delete': true }
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

<style lang="sass" scoped>

</style>
