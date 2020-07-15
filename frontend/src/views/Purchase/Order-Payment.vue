<template>
  <section>
    <v-container
      fluid
      grid-list-xl>
      <v-layout>
        <v-flex xs12>
          <v-card
            v-bind="$attrs"
            v-on="$listeners">
            <helper-offset>
              <v-toolbar
                color="orange"
                dark
                tabs>
                <div
                  xs2
                  class="float-right">
                  <v-autocomplete
                    v-model="search"
                    :items="orders"
                    item-text="_id"
                    item-value="_id"
                    class="mr-2"
                    flat
                    clearable
                    dense
                    solo-inverte
                    label="Search Item"
                    prepend-inner-icon="mdi-magnify"
                  />
                </div>
              </v-toolbar>
            </helper-offset>
          </v-card>
          <v-data-table
            :headers="requestHeader"
            :items="orders"
            :search="search">
            <template
              slot="headerCell"
              slot-scope="{ header }">
              <span
                class="font-weight-bolder text--darken-3"
                v-text="header.text" />
            </template>
            <template
              slot="items"
              slot-scope="{ index, item }">
              <td>{{ item._id.substr(18) }}</td>
              <td>
                <div>{{ new Date(item.requestDate).toDateString() }}</div>
                <div>{{ new Date (item.requestDate).toLocaleTimeString() }}</div>
              </td>
              <td>
                <div>{{ new Date(item.reqActDate).toDateString() }}</div>
                <div>{{ new Date (item.reqActDate).toLocaleTimeString() }}</div>
              </td>
              <td>
                <div>{{ new Date(item.orderAppDate).toDateString() }}</div>
                <div>{{ new Date (item.orderAppDate).toLocaleTimeString() }}</div>
              </td>
              <td>
                <div>{{ new Date(item.appDate).toDateString() }}</div>
                <div>{{ new Date (item.appDate).toLocaleTimeString() }}</div>
              </td>
              <td>
                <div>{{ new Date(item.deliveryDate).toDateString() }}</div>
                <div>{{ new Date (item.deliveryDate).toLocaleTimeString() }}</div>
              </td>
              <td class="text-xs-center">
                <v-icon
                  color="blue"
                  large
                  @click="showOrder(item._id)">mdi-pencil-circle</v-icon>
              </td>
            </template>
          </v-data-table>
        </v-flex>
      </v-layout>
    </v-container>

    <v-dialog
      v-model="placeOrder"
      fullscreen
      transition="dialog-bottom-transition"
      persistent>
      <v-card>
        <v-card-title class="tool">
          <v-toolbar
            card
            dark
            color="cyan">
            <v-btn
              icon
              dark
              @click="placeOrder = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
            <v-toolbar-title>Request Order</v-toolbar-title>
            <v-spacer />

            <!-- <v-btn :disabled="!supplier" dark color="success" small @click="callit()">
              <span>Call IT</span>
            </v-btn>-->
          </v-toolbar>
        </v-card-title>

        <v-container
          fluid
          grid-list-xl
          class="mWidth">
          <v-layout wrap>
            <v-flex md2>
              <v-autocomplete
                v-model="supplier"
                :items="getsupp"
                :rules="reqRules"
                item-text="name"
                item-value="_id"
                return-object
                readonly
                label="Select Supplier"
                prepend-inner-icon="mdi-select"
              >
                <template slot="prepend-item">
                  <v-layout
                    row
                    class="body-2"
                    py-1
                    px-2>
                    <v-flex style="cursor: pointer;">
                      <span @click="supplierDialog=!supplierDialog">
                        <v-icon color="#44f">mdi-18px mdi-plus-circle-outline</v-icon>
                        <span class="subheadingE">Add Supplier</span>
                      </span>
                    </v-flex>
                  </v-layout>
                  <v-divider />
                </template>
                <template
                  slot="item"
                  slot-scope="{ parent, item }">
                  <v-layout>
                    <v-flex>
                      <span>{{ item.name }}</span>
                    </v-flex>
                    <v-spacer />
                  </v-layout>
                </template>
              </v-autocomplete>
            </v-flex>
            <v-flex md2>
              <v-autocomplete
                v-model="invenHead"
                :items="coaHeads"
                item-text="name"
                return-object
                label="Inventory Head"
              />
            </v-flex>
            <v-spacer />
            <v-flex md2>
              <v-menu
                v-model="orderMenu"
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
                    v-model="orderDate"
                    :rules="reqRules"
                    label="Order Date"
                    readonly
                    append-icon="mdi-calendar"
                    v-on="on"
                  />
                </template>
                <v-date-picker
                  v-model="orderDate"
                  type="date"
                  dark
                  no-title
                  @input="orderMenu = false"
                />
              </v-menu>
            </v-flex>
            <v-flex md2>
              <v-menu
                v-model="dueMenu"
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
                    v-model="dueDate"
                    :rules="reqRules"
                    label="Due Date"
                    readonly
                    required
                    append-icon="mdi-calendar"
                    v-on="on"
                  />
                </template>
                <v-date-picker
                  v-model="dueDate"
                  type="date"
                  dark
                  no-title
                  @input="dueMenu = false"
                />
              </v-menu>
            </v-flex>
            <v-flex md2>
              <v-text-field
                v-model="orderNo"
                :rules="reqRules"
                readonly
                label="Order No" />
            </v-flex>
          </v-layout>
          <v-layout wrap>
            <v-flex md12>
              <v-card
                v-bind="$attrs"
                v-on="$listeners">
                <helper-offset>
                  <v-toolbar
                    color="green"
                    dark
                    tabs>
                    <div
                      xs2
                      class="float-right">
                      <v-flex slot="header">
                        <v-tabs
                          v-model="tabs"
                          color="transparent"
                          slider-color="white">
                          <span
                            class="subheading font-weight-light mr-3"
                            style="align-self: center"
                          >Tasks:</span>
                          <v-tab class="mr-3">
                            <v-icon class="mr-2">mdi-bug</v-icon>Good Recipt
                          </v-tab>
                          <v-tab class="mr-3" >
                            <!-- @click="getCOAheads()" -->
                            <v-icon class="mr-2">mdi-code-tags</v-icon>Payment/Bill
                          </v-tab>
                        </v-tabs>
                      </v-flex>
                    </div>
                    <v-spacer />

                    <v-flex text-xs-right>
                      <span class="headline">Total Qty: {{ totalQty }}</span>
                      <v-divider vertical />
                      <span class="headline">Total Price: {{ totalPrice }}</span>
                    </v-flex>
                  </v-toolbar>
                </helper-offset>
              </v-card>

              <v-tabs-items v-model="tabs">
                <v-tab-item>
                  <v-data-table
                    v-model="selected"
                    :headers="orderheaders"
                    :items="orderItems"
                    item-key="_id"
                    class="elevation-1"
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
                      slot-scope="props">
                      <td>
                        <v-checkbox
                          v-model="props.item.delivery"
                          primary
                          readonly
                          hide-details />
                      </td>
                      <td class="text-xs-center">{{ props.item.code }}</td>
                      <td>{{ props.item.name }}</td>
                      <td>{{ props.item.decs }}</td>
                      <td class="text-xs-center">
                        <v-text-field
                          v-model.number="props.item.pQty"
                          :label="(props.item.qty).toString()"
                          readonly
                          type="number"
                        />
                      </td>
                      <!--show input to edit data -->
                      <!--show end-->
                      <td class="text-xs-center">
                        <v-select
                          v-model="props.item.selectUnit"
                          :items="props.item.unit"
                          readonly
                          item-text="unit"
                          return-object
                        />
                      </td>
                      <td class="text-xs-center">
                        <v-text-field
                          v-model.number="props.item.pPrice"
                          :label="(props.item.pPrice*props.item.selectUnit.qty).toString()"
                          readonly
                          type="number"
                        />
                      </td>
                      <td
                        class="text-xs-center"
                      >{{ props.item.pPrice*props.item.selectUnit.qty*props.item.pQty }}</td>

                      <!-- <td class="text-xs-right">
                        <v-icon color="red" large @click="deleteItems(index,item)">mdi-delete-circle</v-icon>
                      </td>-->
                    </template>
                  </v-data-table>
                </v-tab-item>

                <v-divider />
                <v-tab-item>
                  <v-card>
                    <v-container>
                      <v-layout wrap>
                        <v-flex md6>
                          <span class="headline">Total Price: {{ totalPrice }}</span>
                        </v-flex>
                        <v-flex md6>
                          <span class="headline">Balance: {{ balance }}</span>
                        </v-flex>
                        <v-flex md3>
                          <v-text-field
                            v-model.number="advance"
                            label="Payment"
                            outline
                            type="Number"
                          />
                        </v-flex>
                        <v-flex
                          offset-md3
                          md3>
                          <v-autocomplete
                            v-model="headAcct"
                            :items="coaHeads"
                            item-text="name"
                            return-object
                            label="Payment Head"
                            outline
                          />
                        </v-flex>
                        <v-flex md12>
                          <hr >
                        </v-flex>
                        <v-flex md3>
                          <v-text-field
                            v-model.number="tax"
                            outline
                            label="TAX(%)" />
                        </v-flex>
                        <v-flex
                          offset-md3
                          md3>
                          <v-autocomplete
                            v-model="taxHead"
                            :items="coaHeads"
                            item-text="name"
                            return-object
                            label="Tax Head"
                            outline
                          />
                        </v-flex>
                        <v-flex
                          offset-md10
                          text-xs-right>
                          <v-btn
                            :disabled="!headAcct"
                            color="black"
                            @click="payNow()">Payment</v-btn>
                        </v-flex>
                      </v-layout>
                    </v-container>
                  </v-card>
                </v-tab-item>
                <v-divider />
              </v-tabs-items>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card>
    </v-dialog>

    <v-snackbar
      :value="snackbar.stat"
      :color="snackbar.color">
      <v-icon dark>{{ snackbar.icon }}</v-icon>
      <b>{{ snackbar.msg }}</b>
      <v-icon @click="snackbar.stat=false">mdi-close-circle</v-icon>
    </v-snackbar>
  </section>
</template>

<script>
import api from '../../services/api'
import itemApi from '../../services/items-api'
import orderAPi from '../../services/order-api'
import coaApi from '../../services/coa-api'

export default {
  data () {
    return {
      requestHeader: [
        { sortable: false, text: 'Request No', value: '_id' },
        { sortable: false, text: 'Requested', value: 'requestDate' },
        { sortable: false, text: 'Request Approved', value: 'date' },
        { sortable: false, text: 'Order Approval', value: 'date' },
        { sortable: false, text: 'Order Approved', value: 'date' },
        { sortable: false, text: 'Order Delivered', value: 'date' },
        { sortable: false, text: 'Edit/Show', align: 'center' }
      ],

      count: 0,
      coaHeads: [],
      orderDialog: false,
      payDialog: false,
      orderMenu: false,
      dueMenu: false,
      valid: false,
      snackbar: {},
      pDetail: [],
      orderdItem: [],
      orderheaders: [
        {
          sortable: false,
          text: '....',
          value: 'action',
          align: 'left',
          width: '2%'
        },

        { sortable: false, text: 'Code', value: 'code', align: 'center' },
        { sortable: false, text: 'Name', value: 'name', align: 'center' },
        { sortable: false, text: 'Description', value: 'decs' },
        {
          sortable: false,
          text: 'Quantity',
          value: 'quantity',
          align: 'center',
          width: '10%'
        },
        {
          sortable: false,
          text: 'Unit',
          value: 'Unit',
          align: 'center',
          width: '12%'
        },
        {
          sortable: false,
          text: 'Price/Unit',
          value: 'price',
          align: 'center',
          width: '10%'
        },
        {
          sortable: false,
          text: 'Total',
          value: 'price',
          align: 'center',
          width: '10%'
        }
      ],
      search: null,
      orders: [],
      tabs: 0,
      items: [], // Item to save data in thw database

      /** PAGE VARIBALE */
      totalQty: 0,
      totalPrice: 0,
      advance: 0,
      orderDate: new Date().toISOString().substr(0, 10),
      dueDate: new Date().toISOString().substr(0, 10),
      orderNo: null,
      delivery: false,
      /** */
      orderItems: [],
      reqRules: [v => !!v || ' required'],
      /** Supplier stuffs */
      supplierDialog: false,
      supvalid: false,
      getsupp: [], // get supplier array to use in autpoCOmpelet v-model name
      supplier: null, // autpoCOmpelet v-model name
      supplierName: null, // to SHow
      supItem: {},
      /** Supplier stuffs End */

      /** Product puffs */

      product: [], // get all product availlabe for the autocomplete
      /** Product puffs End */

      // route variables editOrder
      isReRoute: false,
      orderId: undefined,

      placeOrder: false,
      orders: [],
      reqRules: [v => !!v || ' required'],

      selected: [],
      invenHead: undefined,
      headAcct: undefined,
      taxHead: undefined,
      tax: 0
      // balance:0
    }
  },
  computed: {
    balance () {
      return this.totalPrice - this.advance
    }
  },
  created () {
    this.getPermissions()
    this.getRequests()
    this.getCOAheads()
  },
  methods: {
    getCOAheads () {
      coaApi.getCoa().then(resp => {
        this.coaHeads = resp
      })
    },
    getRequests () {
      orderAPi.getOrders('Delivered').then(res => {
        if (res) {
          this.orders = res
        }
      })
    },

    orderItem (item) {
      var index = -1
      index = this.orderItems.findIndex(obj => obj._id === item._id)
      if (index === -1) {
        this.addToArray(item)
      } else {
        this.snackbar = {
          msg: 'Item Already Added To List',
          stat: true,
          color: 'warning',
          icon: 'mdi-reload-alert'
        }
      }
    },
    /** SUpplier Stuffs */
    getSuppliers () {
      api.getsup().then(res => {
        this.getsupp = res
      })
    },

    addSupplier () {
      api.addSupplier(this.supItem).then(res => {
        if (res === true) {
          this.getSuppliers()
          this.$refs.supform.reset()
          this.supplierDialog = false
        }
      })
    },
    /** Supplier Stuff's End */

    /** Category cuffs End */

    /** New Item puffs */

    /** New Item puffs End */
    payNow () {
      var obj = {
        _id: this.orderId,
        paymentDate: new Date(),
        advance: this.advance,
        total: this.totalPrice,
        tax: Math.round(this.tax / 100 * this.totalPrice),
        stage: 'Paid',
        supplierId: this.supplier._id,
        supplierName: this.supplier.name,
        acct: this.headAcct,
        invenHead: this.invenHead,
        taxHead: this.taxHead
      }
      this.orderApi(obj)
    },

    orderApi (obj) {
      orderAPi.payment(obj).then(res => {
        if (res) {
          this.totalQty = 0
          this.totalPrice = 0
          this.getRequests()
          this.placeOrder = false
          this.items = []
          this.orderItems = []
          this.snackbar = {
            msg: 'Ordered',
            stat: true,
            color: 'success',
            icon: 'mdi-truck-delivery-outline'
          }
        }
      })
    },
    /** For Edit route Order */
    showOrder (id) {
      orderAPi.getOrderPaymnet(id).then(res => {
        if (res) {
          this.orderId = res._id
          this.orderNo = res._id.substr(18)
          this.supplier = { _id: res.supplierId, name: res.supplierName }
          this.orderItems = res.items
          this.totalPrice = res.totalPrice
          this.totalQty = res.totalQty
          this.placeOrder = true
          this.getSuppliers()
        }
      })
    },
    editApi (obj) {
      orderAPi.editApi(obj).then(res => {
        if (res) {
          this.snackbar = {
            msg: 'Order Edited',
            stat: true,
            color: 'success',
            icon: 'mdi-trophy-award'
          }
        }
      })
    },
    /** End */
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
.v-card__title.tool {
  padding: 0 !important;
}
@media only screen and (min-width: 1264px) {
  .mWidth {
    max-width: -webkit-fill-available !important;
  }
}
@media only screen and (min-width: 960px) {
  .mWidth {
    max-width: -webkit-fill-available;
  }
}
.autoPad {
  padding: 5px 10px;
}
.subheadingE {
  color: blue;
  padding: 4px;
}
</style>
