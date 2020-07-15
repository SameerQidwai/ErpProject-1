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
              <span >Paid</span>
              <br >
              <span class="font-weight-bold ">Rs {{ paidTotal }}</span>
            </v-flex>
            <span class="spanB">+</span>
            <v-flex
              xs2
              class="bordercustome cyan2">
              <span>Unpaid</span>
              <br >
              <span class="font-weight-bold ">Rs {{ unpaidTotal }}</span>
            </v-flex>
            <span class="spanB">=</span>
            <v-flex
              xs2
              class="bordercustome wheet" >
              <span>Total</span>
              <br >
              <span class="font-weight-bold ">Rs {{ TOTAL }}</span>
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
            @click="routeOrder()">
            <v-icon>mdi-plus</v-icon>Add Purchase
          </v-btn>
        </v-flex>
      </v-layout>
    </v-container>
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
                <v-flex md3>
                  <v-autocomplete
                    v-model="search"
                    :items="sold"
                    label="Search for Order"
                    item-text="orderNo"
                    solo-inverted
                    clearable
                  />
                </v-flex>
                <v-flex
                  v-if="filter==='Monthly'"
                  md3>
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
                      @input="monthMenu = false; change(filter)" />
                  </v-menu>
                </v-flex>
                <v-flex
                  v-if="filter==='Daily'"
                  md3>
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
                <v-flex md3>
                  <v-select
                    v-model="filter"
                    :items="filters"
                    label="Filter"
                    clearable
                    solo-inverted
                    @input="change(filter)"/>
                </v-flex>
              </v-toolbar>
            </helper-offset>
          </v-card>

          <v-data-table
            :search="search"
            :headers="soldHeader"
            :items="sold"
            :rows-per-page-items="[25,50,100]"
            class="elevation-2">
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
              <td>{{ item.supplierName }}</td>
              <td>{{ new Date(item.orderDate).toDateString() }}</td>
              <td>{{ item.totalAmount }}</td>
              <td>{{ item.advance }}</td>
              <td>{{ item.balance=item.totalAmount-item.advance }}</td>
              <td><Span
                v-if="!item.delivered"
                class="error--text">Not Delivered</Span>
                <Span
                  v-if="item.delivered"
                  class="success--text">Delivered</Span></td>
              <td>
                <v-tooltip
                  top
                >
                  <template v-slot:activator="{ on }">
                    <v-icon
                      color="success"
                      v-on="on"
                      @click="showRecipt(item)"
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
      v-model="orderDialog"
      scrollable
      width="80%">
      <v-card>
        <v-card-title>
          <v-layout wrap>
            <v-flex xs2>
              <span class="icons-model">
                <v-icon
                  large
                  color="success"
                  @click="editOrder(orderRecpt._id)">mdi-file-document-edit</v-icon>
              </span>
              <span class="icons-model">
                <v-icon
                  :disabled="(orderRecpt.totalAmount - orderRecpt.advance)<=0 && orderRecpt.delivered"
                  large
                  color="purple"
                  @click="payModel=!payModel"
                >mdi-account-cash</v-icon>
              </span>
              <span class="icons-model">
                <v-icon
                  large
                  color="error"
                  @click="delDialog= true"
                >mdi-delete</v-icon>
              </span>
            </v-flex>
            <v-flex
              text-xs-center
              xs8>
              <span
                class="display-1"
                v-text="'Purchase Receipt'"/>
            </v-flex>
            <v-flex
              text-xs-right
              xs2>
              <v-icon
                large
                color="red"
                @click="orderDialog=false">mdi-close-box</v-icon>
            </v-flex>
            <v-flex
              text-xs-center
              md12
              lg12
              xs12
              sm12>
              <v-divider />
            </v-flex>
          </v-layout>
        </v-card-title>
        <v-card-text style="max-height:600px">
          <v-layout
            row
            style="padding:10px 0px">
            <v-flex
              lg4
              md4
              sm12 >
              <span
                class="title"
                v-text="`Order No: ${orderRecpt.orderNo}`" />
            </v-flex>
            <v-flex
              lg4
              md4
              sm12 >
              <span
                class="title"
                v-text="`Supplier: ${orderRecpt.supplierName}`" />
            </v-flex >
          </v-layout>
          <v-layout row >
            <v-flex
              lg4
              md4
              sm12>
              <span
                class="title custom-title"
                v-text="`Order Date: ${new Date(orderRecpt.orderDate).toDateString()}`" />
            </v-flex>
            <v-flex
              lg4
              md4
              sm12>
              <span
                class="title custom-title"
                v-text="`Due Date: ${new Date(orderRecpt.dueDate).toDateString()}`" />
            </v-flex>
            <v-flex
              lg4
              md4
              sm12 >
              <v-checkbox
                v-model="orderRecpt.delivered"
                off-icon="mdi-close-box"
                on-icon="mdi-checkbox-marked"
                label="Delivered:"
                color="green"
                readonly
                style="margin:0px"
              >
                <template slot="label">
                  <span
                    class="title custom-title"
                    v-text="'Delivered:'" />

                </template>

              </v-checkbox>
            </v-flex>
          </v-layout>
          <v-data-table
            :headers="orderHeader"
            :items="orderRecpt.items"
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
                <td>{{ item.decs }} </td>
                <td class="text-xs-center">{{ item.pQty }}</td>
                <td class="text-xs-center">{{ item.selectUnit.unit }}/{{ item.selectUnit.qty }}</td>
                <td class="text-xs-center">{{ item.pCost }}</td>
                <td class="text-xs-center">{{ item.total }}</td>
              </tr>
            </template>
            <template v-slot:footer >
              <td />
              <td>Balance: {{ orderRecpt.balance }}</td>
              <td>Advance: {{ orderRecpt.advance }}</td>
              <td class="text-xs-center">Total Qty: {{ orderRecpt.totalQty }}</td>
              <td />
              <td class="text-xs-center">Total Price: {{ orderRecpt.totalPrice }}</td>
            </template>
          </v-data-table>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-dialog
      v-model="payModel"
      width="50%">
      <v-card>
        <v-container>
          <v-layout wrap>
            <v-flex md6>
              <span class="headline">Total Price: {{ orderRecpt.totalPrice }}</span>
            </v-flex>
            <v-flex md4>
              <v-text-field
                v-model.number="pay.advance"
                :height="6"
                :disabled="(orderRecpt.totalPrice - orderRecpt.advance)<=0 "
                label="Payment"
                outline
                type="Number"
              />
            </v-flex>
            <v-flex md6>
              <span class="headline">Balance: {{ balance }}</span>
            </v-flex>

            <v-flex md3>
              <span
                class="headline"
                v-text="`Delivered:` "/>
            </v-flex>
            <v-flex md1>
              <v-switch
                v-model="pay.delivered"
              />
            </v-flex>
            <v-flex md4>
              <v-autocomplete
                v-model="paidAcct"
                :items="coaHeads"
                item-text="name"
                return-object
                label="Select Credit Account"
                outline
              />
            </v-flex>
            <v-spacer/>
            <v-flex md3>
              <v-btn
                color="black"
                @click="payment(orderRecpt)"
              >Payment</v-btn>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card>
    </v-dialog>

    <v-dialog
      v-model="delDialog"
      max-width="400">
      <v-card>
        <v-card-title class="headline">
          <v-icon
            dark
            large
            color="yellow">mdi-alert</v-icon>
          <span v-text="'Warning'"/>
        </v-card-title>
        <v-card-text class="text-xs-center">
          <kbd style="background:red"> This order Will be deleted permanenly!!</kbd>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="orange darken-1"
            flat
            @click="delDialog = false">Disagree</v-btn>
          <v-btn
            color="green darken-1"
            flat
            @click="deleteOrder(orderRecpt); delDialog = false"
          >Agree</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </section>
</template>

<script>
import api from '../../services/order-api'
import coaApi from '../../services/coa-api'
export default {

  data () {
    return {
      filter: null,
      filters: ['All', 'Monthly', 'Daily'],
      soldHeader: [
        { text: 'Order No', value: 'orderNo' },
        { text: 'Supplier', value: 'name' },
        { text: 'Date', value: 'orderDate' },
        { text: 'Total Price', value: 'totalAmount' },
        { text: 'Debit', value: 'advance' },
        { text: 'Balance', value: 'balance' },
        { text: 'Status', value: 'delivered' },
        { sortable: false, text: '....', align: 'center' }
      ],
      orderHeader: [
        { sortable: false, text: 'Name', value: 'name' },
        { sortable: false, text: 'Description', value: 'decs' },
        { sortable: false, text: 'Qty', value: 'quantity', align: 'center' },
        { sortable: false, text: 'Unit', value: 'unit' },
        { sortable: false, text: 'Price', value: 'Price', align: 'center' },
        { sortable: false, text: 'Total', value: 'subTotal', align: 'center' }
        // { sortable: false, text: "....", value: "action", align: "center" }
      ],
      search: undefined,
      month: new Date().toISOString().substr(0, 7),
      monthMenu: false,
      menu1: false,
      date1: new Date().toISOString().substr(0, 10),

      /** */
      orderRecpt: {},
      orderDialog: false,
      delDialog: false,
      order: {}, // for render data and not referesh the whole data
      payModel: false,
      sold: [],
      pay: {
        advance: 0,
        delivered: false
      },
      paidTotal: 0,
      unpaidTotal: 0,

      paidAcct: undefined,
      coaHeads: undefined

    }
  },
  computed: {
    balance () { // for pament dialog use balance
      return this.orderRecpt.totalPrice - this.orderRecpt.advance - this.pay.advance
    },
    TOTAL () {
      this.paidTotal = 0
      this.unpaidTotal = 0
      this.discount = 0
      this.sold.forEach(el => {
        this.paidTotal += el.advance
        this.unpaidTotal += el.totalAmount - el.advance
      })
      return this.paidTotal + this.unpaidTotal
    }
  },
  created () {
    this.change()
  },
  methods: {
    getReport (data) {
      api.getReport(data).then(res => {
        this.sold = res
      })
    },
    change (filter) {
      if (filter === 'Daily') {
        var query = { '$match': { 'orderDate': this.date1 } }
        this.getReport(query)
      } else if (filter === 'Monthly') {
        query = { $match: { orderDate: { $regex: this.month } } }
        this.getReport(query)
      } else {
        query = { '$match': { 'supplierId': { '$ne': 'sameer' } } }
        this.getReport(query)
      }
    },

    showRecipt (item) {
      api.getRecipt(item._id).then(res => {
        if (res) {
          console.log(res)
          this.orderDialog = true
          this.orderRecpt = res
          this.pay['delivered'] = this.orderRecpt['delivered']
          this.getCOAheads()
        }
      })
      coaApi.findAccount(item._id).then(res => {
        if (res) {
          this.paidAcct = res
        }
      })
    },

    payment (item) {
      this.pay.id = item._id
      this.pay.acct = this.paidAcct
      this.pay.date = new Date()
      this.pay.supplierName = this.orderRecpt.supplierName
      this.pay.supplierId = this.orderRecpt.supplierId
      this.pay.total = this.orderRecpt.totalPrice
      api.payment(this.pay).then(res => {
        if (res) {
        /** for render data and not referesh the whole data */
          api.getRecipt(item._id).then(res => {
            if (res) {
              item = res
              this.orderRecpt = res
              this.orderPay.advance = 0
            }
          })
          /** */
          this.payModel = false
        }
      })
    },
    // route query
    editOrder (id) {
      this.$router.push({ path: '/purchase-order', query: { id, route: true } })
    },

    deleteOrder (item) {
      api.deleteOrder(item._id).then(res => {
        if (res) {
          this.change(this.filter)
          this.delDialog = false
          this.orderDialog = false
        }
      })
    },

    routeOrder () {
      this.$router.push({ path: '/purchase-order' })
    },
    getCOAheads () {
      coaApi.getCoa().then(resp => {
        this.coaHeads = resp
      })
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
<style scoped>
@media only screen and (max-width: 768px ) {
  .display-1 {
    font-size: 24px !important;
  }
  .icons-model .v-icon{
    padding: 0px 2px;
    /* font-size: 26px !important; */
    font-size: 1.71rem !important;
  }
  .v-card .title {
    font-size: 1rem !important;
  }

}
  @media only screen and (max-width: 425px ) {
  .v-card .title {
    font-size: .60rem !important;
  }
}
.icons-model {
    padding: 0px 5px;
}
table.v-table tfoot tr td {
    padding: 0 8px;
    font-weight:800
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
  font-size:large;
  padding: 8px;
}
.addBtn{
  position: relative;
  bottom: -31px;
  left: -39px;
}
.spanB{
  padding: 26px 13px;
  font-weight: 900;
}
.wheet{
  background: #f8d99f !important;
}
.cyan2{
  background:#9fdddd;
}
.cyan3{
  background:#79ebeb;
}
</style>
