<template>
  <section>
    <v-container
      fluid
      grid-list-xl>
      <v-layout
        binding="true"
        wrap
        row>
        <v-flex xs11>
          <v-layout
            wrap
            row
            align-content-space-between
            justify-center>
            <v-flex
              xs2
              class="bordercustome cyan3">
              <span>Paid</span>
              <br >
              <span class="font-weight-bold">Rs {{ paidTotal }}</span>
            </v-flex>
            <span class="spanB">+</span>
            <v-flex
              xs2
              class="bordercustome cyan2">
              <span>Unpaid</span>
              <br >
              <span class="font-weight-bold">Rs {{ unpaidTotal }}</span>
            </v-flex>
            <span class="spanB">=</span>
            <v-flex
              xs2
              class="bordercustome wheet">
              <span>Total</span>
              <br >
              <span class="font-weight-bold">Rs {{ TOTAL }}</span>
            </v-flex>
          </v-layout>
        </v-flex>
        <v-flex
          xs1
          text-xs-right
          class="addBtn">
          <v-btn
            small
            color="success"
            @click="routeSale()">
            <v-icon>mdi-plus</v-icon>Add Sale
          </v-btn>
        </v-flex>
      </v-layout>
    </v-container>
    <v-container
      fill-height
      fluid
      grid-list-xl>
      <v-layout wrap>
        <span />
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
                <v-flex md2>
                  <v-autocomplete
                    v-model="search"
                    :items="sold"
                    label="Search for Sales"
                    item-text="_id"
                    item-valu="_id"
                    solo-inverted
                    clearable
                  />
                </v-flex>
                <v-flex
                  v-if="filter==='Monthly'"
                  md2>
                  <v-menu
                    v-model="monthMenu"
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
                        v-model="month"
                        label="Month"
                        append-icon="mdi-calendar"
                        readonly
                        v-on="on"
                      />
                    </template>
                    <v-date-picker
                      v-model="month"
                      type="month"
                      dark
                      no-title
                      @input="monthMenu = false; change(filter)"
                    />
                  </v-menu>
                </v-flex>
                <v-flex
                  v-if="filter==='Daily'"
                  md2>
                  <v-menu
                    v-model="menu1"
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
                        v-model="date1"
                        label="From Date"
                        readonly
                        required
                        append-icon="mdi-calendar"
                        v-on="on"
                      />
                    </template>
                    <v-date-picker
                      v-model="date1"
                      type="date"
                      dark
                      no-title
                      @input="menu1 = false; change(filter)"
                    />
                  </v-menu>
                </v-flex>
                <v-spacer />
                <v-flex md2>
                  <v-select
                    v-model="filter"
                    :items="filters"
                    label="Filter"
                    clearable
                    solo-inverted
                    @input="change(filter)"
                  />
                </v-flex>
              </v-toolbar>
            </helper-offset>
          </v-card>

          <v-data-table
            :search="search"
            :headers="soldHeader"
            :items="sold"
            :rows-per-page-items="[25,50,100]"
            class="elevation-2"
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
              <td>{{ item._id.substr(18) }}</td>
              <td>{{ item.customerName }}</td>
              <td>{{ new Date(item.date).toDateString() }}</td>
              <td>{{ item.totalQty }}</td>
              <td>{{ item.totalAmount }}</td>
              <td>{{ item.debit }}</td>
              <td>{{ item.discount }}</td>
              <td>{{ item.balance=item.totalAmount-item.debit-item.discount }}</td>
              <td>
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-icon
                      color="success"
                      v-on="on"
                      @click="salesRecipt(item,item.status)"
                    >mdi-receipt</v-icon>
                  </template>
                  <span>Show Recipt</span>
                </v-tooltip>
              </td>
            </template>
          </v-data-table>
        </v-flex>
      </v-layout>
    </v-container>

    <v-dialog
      v-model="delDialog"
      max-width="400">
      <v-card>
        <v-card-title class="headline">
          <v-icon
            dark
            large
            color="yellow">mdi-alert</v-icon>
          <span v-text="'Warning'" />
        </v-card-title>
        <v-card-text class="text-xs-center">
          <span>
            <kbd style="background:red">This Sale Will be deleted permanenly!!</kbd>
          </span>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="orange darken-1"
            flat
            @click="delDialog = false">Disagree</v-btn>
          <!--Order delete Btn-->
          <v-btn
            color="green darken-1"
            flat
            @click="deleteSale(saleRecpt); delDialog = false">Agree</v-btn>
            <!--sale delete Btn-->
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog
      v-model="salesDialog"
      width="800px">
      <v-card>
        <v-layout wrap>
          <v-flex>
            <span class="icons-model">
              <v-icon
                large
                color="error"
                @click="delDialog= true">mdi-delete</v-icon>
            </span>
          </v-flex>
          <v-flex
            text-xs-center
            xs10>
            <span
              class="display-1"
              v-text="'Sale Receipt'" />
          </v-flex>
          <v-flex text-xs-right>
            <v-icon
              large
              color="red"
              @click="salesDialog=false">mdi-close-box</v-icon>
          </v-flex>
          <v-flex
            text-xs-center
            xs12>
            <v-divider />
          </v-flex>
        </v-layout>
        <v-container>
          <v-layout
            row
            style="padding:10px 0px">
            <v-flex>
              <span
                class="title"
                v-text="`Receipt ID:${saleRecpt._id}`" />
            </v-flex>
          </v-layout>
          <v-layout row>
            <v-flex>
              <span
                class="title"
                v-text="`Customer:${saleRecpt.customerName}`" />
            </v-flex>
            <v-flex>
              <span
                class="title"
                v-text="`Date:${new Date (saleRecpt.date).toDateString()}`" />
            </v-flex>
          </v-layout>
          <v-data-table
            :headers="salesHeader"
            :items="saleRecpt.items"
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
              <tr>
                <td>{{ item.name }}</td>
                <td>{{ item.decs }}</td>
                <td class="text-xs-center">{{ item.sQty }}</td>
                <td class="text-xs-center">{{ item.selectUnit.unit }}/{{ item.selectUnit.qty }}</td>
                <td class="text-xs-center">{{ item.sSale }}</td>
                <td class="text-xs-center">{{ item.total }}</td>
                <td v-if="saleRecpt.items.length>1">
                  <v-tooltip top>
                    <template v-slot:activator="{ on }">
                      <v-icon
                        v-on="on"
                        @click="returnItem(item,saleRecpt._id,saveStatus)"
                      >mdi-keyboard-return</v-icon>
                    </template>
                    <span>Show Recipt</span>
                  </v-tooltip>
                </td>
              </tr>
            </template>
            <template v-slot:footer>
              <td colspan="2">Discount: {{ saleRecpt.discount }}</td>
              <td colspan="2">Paid: {{ saleRecpt.debit }}</td>
              <td class="text-xs-center">Total Qty: {{ saleRecpt.totalQty }}</td>
              <td
                colspan="2"
                class="text-xs-center">Total Price: {{ saleRecpt.totalPrice }}</td>
            </template>
          </v-data-table>
        </v-container>
      </v-card>
    </v-dialog>
  </section>
</template>

<script>
import api from '../../services/sales-api'

export default {
  props: {
    color: { type: String, default: 'secondary' },
    elevation: { type: [Number, String], default: 10 },
    inline: { type: Boolean, default: false },
    fullWidth: { type: Boolean, default: false },
    offset: { type: [Number, String], default: 24 }
  },
  data () {
    return {
      filter: null,
      filters: ['All', 'Monthly', 'Daily'],
      soldHeader: [
        { sortable: false, text: 'Receipt Id', value: '_id' },
        { sortable: false, text: 'Customer', value: 'name' },
        { sortable: true, text: 'Date', value: 'date' },
        { sortable: true, text: 'Item Qty', value: 'totalQty' },
        { sortable: true, text: 'Total Price', value: 'totalAmount' },
        { sortable: true, text: 'Debit', value: 'debit' },
        { sortable: true, text: 'Discount', value: 'discount' },
        { sortable: true, text: 'Balance', value: 'balance' },
        { sortable: false, text: '....', align: 'center' }
      ],
      salesHeader: [
        { sortable: false, text: 'Name', value: 'name' },
        { sortable: false, text: 'Description', value: 'decs' },
        { sortable: false, text: 'Qty', value: 'quantity', align: 'center' },
        { sortable: false, text: 'Unit', value: 'unit', align: 'center' },
        { sortable: false, text: 'Price', value: 'Price', align: 'center' },
        { sortable: false, text: 'Total', value: 'subTotal', align: 'center' },
        { sortable: false, text: '....', value: 'action', align: 'center' }
      ],
      search: null,
      month: new Date().toISOString().substr(0, 7),
      monthMenu: false,
      menu1: false,
      date1: new Date().toISOString().substr(0, 10),
      sold: [],
      salesDialog: false,
      saleRecpt: {},
      delDialog: false,
      paidTotal: 0,
      unpaidTotal: 0,
      saveStatus: false
    }
  },
  computed: {
    TOTAL () {
      this.paidTotal = 0
      this.unpaidTotal = 0
      this.discount = 0
      this.sold.forEach(el => {
        this.paidTotal += el.debit
        this.unpaidTotal += el.totalAmount - el.debit - el.discount
      })
      return this.paidTotal + this.unpaidTotal
    }
  },
  created () {
    this.change()
  },
  methods: {
    getfilter (data) {
      api.getfilter(data).then(res => {
        this.sold = res
      })
    },
    change (filter) {
      if (filter === 'Daily') {
        var mydate = new Date(this.date1)
        var query = { $match: { date: this.date1 } }
        var query = { $match: { date: mydate } }

        this.getfilter(query)
      } else if (filter === 'Monthly') {
        var monthYear = this.month.split('-')
        const monthNames = [
          'Jan',
          'Feb',
          'Mar',
          'Apr',
          'May',
          'June',
          'July',
          'Aug',
          'Sep',
          'Oct',
          'Nov',
          'Dec'
        ]
        monthYear[1] = monthNames[parseInt(monthYear[1] - 1)]
        query = {
          $match: {
            $and: [
              { date: { $regex: monthYear[1] } },
              { date: { $regex: monthYear[0] } }
            ]
          }
        }
        this.getfilter(query)
      } else {
        query = { $match: { customerId: { $ne: 'sameer' } } }
        this.getfilter(query)
      }
    },
    salesRecipt (item, status) {
      this.saveStatus = status
      api.getRecipt(item._id, status).then(res => {
        if (res) {
          this.salesDialog = true
          this.saleRecpt = res
          console.log(res)
        }
      })
    },
    deleteSale (item) {
      api.deleteSale(item._id).then(res => {
        if (res) {
          this.change(this.filter)
          this.delDialog = false
          this.salesDialog = false
        }
      })
    },
    returnItem (item, _id, status) {
      var data = { rId: _id, itemId: item._id, status: status }
      api.returnItem(data).then(res => {
        if (res) {
          this.change(this.filter)
          this.salesRecipt(this.saleRecpt, status)
        }
      })
    },
    routeSale () {
      this.$router.push({ path: '/point-of-sale' })
    },
    /** Customer Dial stuff End */
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
<style>
.icons-model {
  padding: 0px 5px;
}
table.v-table tfoot tr td {
  padding: 0 8px;
  font-weight: 800;
}
.pFont {
  color: green;
  font-weight: 400;
}
.uFont {
  color: red;
  font-weight: 400;
}
.bordercustome {
  border-radius: 25px;
  font-size: large;
  padding: 8px;
}
.addBtn {
  position: relative;
  bottom: -31px;
  left: -39px;
}
.spanB {
  padding: 26px 13px;
  font-weight: 900;
}
.wheet {
  background: #f8d99f !important;
}
.cyan2 {
  background: #9fdddd;
}
.cyan3 {
  background: #79ebeb;
}
</style>
