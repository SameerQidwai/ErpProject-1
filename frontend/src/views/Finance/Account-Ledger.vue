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
              <v-flex xs3>
                <v-autocomplete
                  v-model="headAcct"
                  :items="coaHeads"
                  item-text="name"
                  clearable
                  return-object
                  label="Select Head"
                  prepend-inner-icon="mdi-account-search"
                />
              </v-flex>
              <v-flex xs2>
                <v-menu
                  v-model="menu1"
                  :close-on-content-click="false"
                  :nudge-right="40"
                  lazy
                  transition="scale-transition"
                  offset-y
                  full-width
                  min-width="290px"
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      v-model="from_date"
                      label=" From Date"
                      prepend-icon="mdi-calendar"
                      readonly
                      no-title
                      clearable
                      v-on="on"
                    />
                  </template>
                  <v-date-picker
                    v-model="from_date"
                    no-title
                    dark
                    @input="menu1 = false" />
                </v-menu>
              </v-flex>
              <v-flex xs2>
                <v-menu
                  v-model="menu2"
                  :close-on-content-click="false"
                  :nudge-right="40"
                  lazy
                  transition="scale-transition"
                  offset-y
                  full-width
                  min-width="290px"
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      v-model="to_date"
                      label=" To Date"
                      append-icon="mdi-calendar"
                      readonly
                      no-title
                      clearable
                      v-on="on"
                    />
                  </template>
                  <v-date-picker
                    v-model="to_date"
                    no-title
                    dark
                    @input="menu1 = false" />
                </v-menu>
              </v-flex>
              <v-btn
                :disabled="headAcct ==undefined && from_date==undefined"
                small
                dark
                @click="filter(headAcct,from_date,to_date)"
              >Search</v-btn>
              <v-btn
                small
                dark
                @click="cleanfilter()">Clean Filter</v-btn>
            </v-toolbar>
          </helper-offset>
        </v-card>
        <!-- will do som other Time -->
        <v-data-table
          :headers="accLedgerRepHeaders"
          :items="accLedger"
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
            <td>{{ dateformat(item.timestamp) }}</td>
            <!-- <td>{{ item.lvl2[0].name }}</td> -->
            <td>{{ item.TransAccount[0].name }}</td>
            <td>{{ item.reason }}</td>
            <td class="text-xs-center">
              <span v-if="item.debit>0">Rs {{ item.debit }}</span>
            </td>
            <td class="text-xs-center">
              <span v-if="item.credit>0">Rs {{ item.credit }}</span>
            </td>
            <td class="text-xs-right">{{ item.balance }}</td>
          </template>
        </v-data-table>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import api from '../../services/ledger-api'
import coaApi from '../../services/coa-api'
export default {
  data () {
    return {
      search: null,
      validPaymentForm: true,
      menu1: false,
      menu2: false,
      //   pageSet: {
      //     descending: false,
      //     rowsPerPage: 25 // -1 for All",
      //   },
      from_date: undefined,
      to_date: undefined,
      reqRules: [v => !!v || ' required'],
      accLedgerRepHeaders: [
        {
          sortable: false,
          text: 'Date',
          type: 'date',
          value: 'date',
          align: 'left',
          dataType: 'Date'
        },
        // { sortable: false, text: 'Account', value: 'lvl2', align: 'left' },
        { sortable: false, text: 'Name', value: 'name', align: 'left' },
        {
          width: '300',
          sortable: false,
          text: 'Narration',
          value: 'narration',
          align: 'left'
        },
        {
          sortable: false,
          text: 'Debit Amount',
          value: 'Debit Amount',
          align: 'right'
        },
        {
          sortable: false,
          text: 'Credit Amount',
          value: 'amount',
          align: 'right'
        },
        {
          sortable: false,
          text: 'Balance Amount',
          value: 'balance',
          align: 'right'
        }
      ],
      accLedger: [],
      paymentCreate: {},
      recieptObject: {},
      amount: 0,
      headAcct: undefined,
      coaHeads: []
    }
  },
  created () {
    this.getLedger()
    this.getCOAheads()
  },
  methods: {
    dateformat (value) {
      var date = new Date(value).toDateString()
      return date
    },
    getLedger () {
      var balance = 0
      api.getLedger().then(res => {
        this.accLedger = res
        console.log(res)
        this.accLedger.forEach(el => {
          balance = balance + (el.debit - el.credit)
          el.balance = balance < 0 ? `(${balance * -1})` : balance
        })
      })
    },
    getCOAheads () {
      // coaApi.getCoaAll().then(resp => {
        coaApi.getCoa().then(resp => {
          this.coaHeads = resp
      })
    },
    filter (headAcct, from_date, to_date) {
      var data = { headAcct, from_date, to_date }
      api.ledgerFilter(data).then(res => {
        var balance = 0
        this.accLedger = res
        this.accLedger.forEach(el => {
          balance = balance + (el.credit - el.debit)
          el.balance = balance < 0 ? `(${balance * -1})` : balance
        })
      })
    },
    cleanfilter () {
      this.headAcct = undefined
      this.from_date = undefined
      this.to_date = undefined
      this.getLedger()
    }
  }
}
</script>

<style  scoped>
.font-text-bold {
  font-weight: 500 !important;
  padding-left: 5px;
}
</style>
