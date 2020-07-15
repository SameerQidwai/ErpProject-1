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
              <v-spacer />
              <v-btn
                v-if="permissions['add']"
                @click="getEmployees();loanDialog=true">Add Loan</v-btn>
            </v-toolbar>
          </helper-offset>
        </v-card>
        <v-data-table
          :headers="item_headers"
          :items="getLoan"
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
            <td>{{ index }}</td>
            <td>{{ item.name }}</td>
            <td>{{ item.idate }}</td>
            <td>{{ item.rdate }}</td>
            <td>{{ item.loan }}</td>
            <td>
              <span
                v-if="new Date(item.rdate) < lateDate"
                class="text-danger">Late</span>
              <span v-else>-</span>
            </td>
            <td>

              <v-checkbox
                :disabled="!permissions['add']"
                :readonly="item.status || !item.headAcct"
                v-model="item.status"
                :value="item.status"
                color="green"
                @change="loanPaid(item)"
              />
            </td>
            <td >
              <span v-if="!item.status">
                <v-autocomplete
                  v-model="item.headAcct"
                  :items="coaHeads"
                  item-text="name"
                  return-object
                  label="Select Head"
                />
              </span>
            </td>
          </template>
        </v-data-table>
      </v-flex>
    </v-layout>

    <v-dialog
      v-model="loanDialog"
      persistent
      max-width="600">
      <v-card>
        <v-card-title class="headline">Add Loan</v-card-title>
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
                label="Enter  Employee Name"
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
                    v-model="newItem.idate"
                    label="Date From"
                    readonly
                    v-on="on" />
                </template>
                <v-date-picker
                  v-model="newItem.idate"
                  dark
                  no-title
                  @input="diaMenu1 = false; " />
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
                    v-model="newItem.rdate"
                    label="Date Till"
                    readonly
                    v-on="on" />
                </template>
                <v-date-picker
                  v-model="newItem.rdate"
                  dark
                  no-title
                  @input="diaMenu2 = false; " />
              </v-menu>
            </v-flex>
            <v-flex md3>
              <v-text-field
                v-model="newItem.loan"
                type="Number"
                label="Loan Amount"
                required />
            </v-flex>
            <v-flex md9>
              <v-textarea
                v-model="newItem.lReason"
                rows="1"
                label="Loan Reason"
                required />
            </v-flex>
            <v-flex md4>
              <v-autocomplete
                v-model="newItem.headAcct"
                :items="coaHeads"
                item-text="name"
                return-object
                label="Select Head"
              />
            </v-flex>
          </v-layout>
        </v-container>
        <v-card-actions>
          <v-spacer />
          <v-btn
            :disabled="disable"
            color="green darken-1"
            @click="addLoan();disable=true">Save</v-btn>
          <v-btn
            color="orange"
            @click="loanDialog = false">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar
      :value="snackbar.stat"
      :color="snackbar.color">
      <v-icon>{{ snackbar.icon }}</v-icon>
      <b>{{ snackbar.msg }}</b>
      <v-icon @click="snackbar.stat=false">mdi-close-circle</v-icon>
    </v-snackbar>
  </v-container>
</template>

<script>
import api from '../../services/payRoll-api'
import constants from '../../services/constants'
import coaApi from '../../services/coa-api'

export default {
  data () {
    return {
      diaMenu1: false,
      diaMenu2: false,
      search: null,
      loanDialog: false,
      coaHeads: [],
      disable: false,
      snackbar: {},
      lateDate: new Date(),

      item_headers: constants.LOANS_ITEM_HEADERS,
      getLoan: constants.LOAN_GET_LOAN,
      getEmp: constants.LOAN_GET_EMP,

      ItemObj: {},
      newItem: {}
    }
  },
  created () {
    this.getLoans()
    this.getPermissions()
    this.getCOAheads()
  },
  methods: {
    getCOAheads () {
      coaApi.getCoa().then(resp => {
        this.coaHeads = resp
      })
    },

    getEmployees () {
      api.getEmpApi().then(res => {
        // get employee to autocomplete
        this.getEmp = res
      })
    },

    getLoans () {
      api.getLoans().then(res => {
        this.getLoan = res
      })
    },

    addLoan () {
      this.newItem.eId = this.newItem.emp._id // delete the employee obj an keep the usefull info
      this.newItem.name = this.newItem.emp.name
      delete this.newItem.emp
      this.newItem.date = new Date()
      api.addLoan(this.newItem).then(res => {
        if (res === true) {
          this.getLoans()
          this.loanDialog = false
        }
      })
    },

    loanPaid (data) {
      data.drDate = new Date()
      api.loanPaid(data).then(res => {
        if (res === true) {
          this.getLoans()
          this.snackbar = {
            msg: 'Loan Makred Paid!',
            stat: true,
            color: 'blue',
            icon: 'mdi-clipboard-outline'
          }
        }
      })
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
    }
  }
}
</script>

<style  scoped>
</style>
