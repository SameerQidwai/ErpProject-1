<template>
  <v-container
    fill-height
    fluid
    grid-list-xl>
    <v-layout
      wrap
      class="justify-center">
      <v-flex
        sm12
        xs12
        md12
        lg12>
        <v-card v-on="$listeners">
          <helper-offset>
            <v-toolbar
              color="orange"
              dark
              tabs>
              <div>
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
        <v-data-table
          :headers="item_headers"
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
            <td @click="histroyItem=item.pay.salary; historyInfo=item.info; historyDialog=true;">
              <v-icon>mdi-view-list</v-icon>
            </td>
            <td>{{ item.info.name }}</td>
            <td>{{ item.info.payroll }}</td>

            <td>
              <v-text-field
                v-model.number="item.bonus"
                class="mr-2"
                type="Number" />
            </td>
            <td width="1%">
              <v-checkbox
                :disabled="!permissions['add'] || !item.headAcct"
                :readonly="item.pay.lastMonth == month"
                :value="item.pay.lastMonth == month"
                color="green"
                @change="paySalary(item.bonus,item.info,item.headAcct)"
              />
            </td>
            <td class="text-xs-center">
              <span v-show="item.pay.advance >0">{{ item.pay.advance }}</span>
              <v-icon
                v-show="item.pay.advance <=0 ||item.pay.advance == undefined"
                large
                color="green"
                @click="advanceDialog=true; historyInfo=item.info;"
              >mdi-cash</v-icon>
            </td>
            <td>
              <v-autocomplete
                v-model="item.headAcct"
                :items="coaHeads"
                item-text="name"
                return-object
                label="Select Head"
                outline
              />
            </td>
          </template>
        </v-data-table>
      </v-flex>
    </v-layout>

    <v-dialog
      v-model="historyDialog"
      max-width="600">
      <v-card>
        <v-card-title class="headline">{{ historyInfo.name }} Income History</v-card-title>
        <v-container grid-list-md>
          <v-data-table
            :headers="dialog_headers"
            :items="histroyItem"
            :search="search"
            hide-actions
          >
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
              <td>{{ item.date }}</td>
              <td>{{ item.bouns }}</td>
              <td>{{ historyInfo.payroll+item.bouns }}</td>
            </template>
          </v-data-table>
        </v-container>
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="red"
            @click="historyDialog = false">close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog
      v-model="advanceDialog"
      width="500">
      <v-card style="padding:1%">
        <v-layout row>
          <v-flex
            sx1
            lg1>
            <v-icon
              large
              color="red"
              @click="advanceDialog=false">mdi-close-box</v-icon>
          </v-flex>
          <v-flex
            sx11
            lg11
            text-xs-center>
            <h3>Give Advance salary to {{ historyInfo.name }}</h3>
          </v-flex>
        </v-layout>
        <v-layout
          justify-center
          align-center
          row>
          <v-flex xs10>
            <v-layout
              justify-center
              align-center
              row>
              <v-flex xs12>
                <v-text-field
                  v-model="advance"
                  label="Enter Advance Salary"
                  type="Number"
                  clearable
                />
              </v-flex>
            </v-layout>
          </v-flex>
          <v-spacer />
          <v-card-actions>
            <v-btn
              color="green"
              @click="advancePay(historyInfo._id,advance)">Give</v-btn>
          </v-card-actions>
        </v-layout>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import api from '../../services/payRoll-api'
import coaApi from '../../services/coa-api'

export default {
  data () {
    return {
      search: null,
      disThisBtn: false,
      item_headers: [
        { sortable: false, text: 'show' },
        { sortable: false, text: 'Name', value: 'name' },
        { sortable: false, text: 'Salary', value: 'salary' },
        { sortable: false, text: 'Bonus', value: '', width: '4%' },
        { sortable: false, text: 'Pay Status', value: '' },
        { sortable: false, text: 'Advance', align: 'center' },
        { sortable: false, text: 'Account', align: 'right', width: '15%' }
      ],
      dialog_headers: [
        { sortable: false, text: 'Date' },
        { sortable: false, text: 'Bonus', value: '' },
        { sortable: false, text: 'Total', value: '' }
      ],
      array: [],
      coaHeads: [],
      product: [], // get all product availlabe for the autocomplete
      historyDialog: false, // hide and show form
      advanceDialog: false,
      histroyItem: [],
      advance: 0,
      historyInfo: {},
      itemId: null, // Save Item id to delete
      ErrorDel: false, // snackbar error function
      getEmp: [],
      payDetail: false,
      payItem: [],
      list: [false],
      date: new Date(),
      month: new Date().getMonth()
    }
  },
  created () {
    this.getEmpPay()
    this.getPermissions()
    this.getCOAheads()
  },
  methods: {
    getCOAheads () {
      coaApi.getCoa().then(resp => {
        this.coaHeads = resp
      })
    },

    getEmpPay () {
      api.getEmpPay().then(res => {
        this.getEmp = res
      })
    },
    show (item) {
      this.payDetail = true
      this.payItem = item
    },
    paySalary (bonus, emp, headAcct) {
      var obj = { bonus, emp, headAcct, date: new Date() }
      api.paySalary(obj)
    },
    advancePay (id, advance) {
      var obj = { advance: advance, eId: id }
      api.advancePay(obj).then(res => {
        this.advanceDialog = false
        advance = 0
        this.getEmpPay()
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
      console.log(this.permissions)
    }
  }
}
</script>

<style  scoped>
</style>
