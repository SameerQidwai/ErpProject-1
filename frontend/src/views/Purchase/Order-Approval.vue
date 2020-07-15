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
                {{ new Date(item.requestDate).toDateString() }}
                -{{ new Date (item.requestDate).toLocaleTimeString() }}
              </td>
              <td>
                {{ new Date(item.reqActDate).toDateString() }}
                -{{ new Date (item.reqActDate).toLocaleTimeString() }}
              </td>
              <td>
                {{ new Date(item.orderAppDate).toDateString() }}
                -{{ new Date (item.orderAppDate).toLocaleTimeString() }}
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
            <v-spacer/>

            <v-btn
              :disabled="!supplier"
              fab
              class="mr-1"
              color="success"
              @click="order()">
              <span>Order</span>
            </v-btn>
            <v-btn
              fab
              class="mr-1"
              color="red"
              @click="changeStatus('Reject Request')">
              Reject
            </v-btn>
          </v-toolbar>
        </v-card-title>

        <v-container
          fluid
          grid-list-xl
          class="mWidth">
          <v-flex text-xs-right>
            <v-icon
              v-if="isReRoute"
              color="error"
              @click="backtoPage()">mdi-close-circle</v-icon>
              <!--This is route-->
          </v-flex>
          <v-layout wrap>
            <v-flex md4>
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
                    <!-- <v-spacer />
                    <v-flex text-xs-right>
                      <span class="font-weight-bolder text-gray text--darken-3">Balance</span>
                    </v-flex>-->
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
                    <!-- <v-spacer />
                    <v-flex text-xs-right>8787</v-flex>-->
                  </v-layout>
                </template>
              </v-autocomplete>
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
                          <v-tab class="mr-3" >
                            <v-icon class="mr-2" >mdi-bug</v-icon>Order
                          </v-tab>
                          <!-- <v-tab class="mr-3">
                            <v-icon class="mr-2">mdi-code-tags</v-icon>Bill
                          </v-tab>-->
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
                    :headers="orderheaders"
                    :items="orderItems"
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
                      slot-scope="{ index, item }">
                      <td class="text-xs-center">{{ item.code }}</td>
                      <td>{{ item.name }}</td>
                      <td>{{ item.decs }}</td>
                      <td class="text-xs-center">
                        <v-text-field
                          v-model.number="item.pQty"
                          :label="(item.qty).toString()"
                          readonly
                          type="number" />
                      </td>
                      <!--show input to edit data -->
                      <!--show end-->
                      <td class="text-xs-center">
                        <v-select
                          v-model="item.selectUnit"
                          :items="item.unit"
                          readonly
                          item-text="unit"
                          return-object
                        >
                          <template slot="prepend-item">
                            <v-layout
                              row
                              class="body-2"
                              py-1
                              px-2>
                              <v-flex>
                                <span class="font-weight-bolder text-gray text--darken-3">Name</span>
                              </v-flex>
                              <v-spacer />
                              <v-flex text-xs-right>
                                <span class="font-weight-bolder text-gray text--darken-3">/Piece</span>
                              </v-flex>
                            </v-layout>
                            <v-divider />
                          </template>
                          <template
                            slot="item"
                            slot-scope="{ parent, item }">
                            <v-layout>
                              <v-flex>
                                <span>{{ item.unit }}</span>
                              </v-flex>
                              <v-spacer />
                              <v-flex text-xs-right>{{ item.qty }}</v-flex>
                            </v-layout>
                          </template>
                        </v-select>
                      </td>
                      <td class="text-xs-center">
                        <v-text-field
                          v-model.number="item.pPrice"
                          :label="(item.pPrice*item.selectUnit.qty).toString()"
                          readonly
                          type="number"
                        />
                      </td>
                      <td class="text-xs-center">{{ item.pPrice*item.selectUnit.qty*item.pQty }}</td>

                      <!-- <td class="text-xs-right">
                        <v-icon color="red" large @click="deleteItems(index,item)">mdi-delete-circle</v-icon>
                      </td> -->
                    </template>
                  </v-data-table>
                </v-tab-item>

                <v-divider />

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
        { sortable: false, text: 'Requested Date', value: 'requestDate' },
        { sortable: false, text: 'Request Approved Date', value: 'date' },
        { sortable: false, text: 'Order Approval Date', value: 'date' },
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
      headAcct: null,
      pDetail: [],
      orderdItem: [],
      headers: [
        { sortable: false, text: 'ID', value: 'id', align: 'center' },
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
        { sortable: false, text: 'Add', value: 'Add', align: 'right' }
      ],
      orderheaders: [
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
        // { sortable: false, text: "....", value: "action", align: "right" }
      ],
      dialog_headers: [
        // dialog orderd Item table headers
        { sortable: false, text: 'ID', value: 'id', align: 'center' },
        { sortable: false, text: 'Name', value: 'name', align: 'center' },
        { sortable: false, text: 'Price', value: 'country', align: 'center' },
        {
          sortable: false,
          text: 'Quantity',
          value: 'salary',
          align: 'center',
          width: '1%'
        }
      ],
      search: null,
      selected: false, // show item search or not on items card
      editThis: [], // show or not show edit firld in order cart
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
      reqRules: [v => !!v || ' required']
    }
  },
  computed: {
    balance: function () {
      if (this.advance === undefined) {
        return this.totalPrice
      } else {
        return this.totalPrice - this.advance
      }
    }
  },
  created () {
    // this.getCategory("parents");
    // supplier Stuffs
    //
    this.getPermissions()
    this.getRequests()
  },
  methods: {
    getRequests () {
      orderAPi.getOrders('Order Approval').then(res => {
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
    order () {
      this.items = []
      this.orderItems.forEach(element => {
        this.items.push({
          itemId: element._id,
          itemQty: element.pQty,
          itemCost: element.pPrice,
          itemUnit: element.selectUnit
        })
      })
      var obj = {
        _id: this.orderId,
        supplierId: this.supplier._id,
        supplierName: this.supplier.name,
        items: this.items,
        orderDate: this.orderDate,
        appDate: new Date(),
        dueDate: this.dueDate,
        stage: 'Ordered'
      }
      this.orderApi(obj)
    },

    orderApi (obj) {
      orderAPi.reqAproval(obj).then(res => {
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
      orderAPi.getOrder(id).then(res => {
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
    changeStatus (stage) {
      var data = { stage, _id: this.orderId, reqActDate: new Date() }
      orderAPi.changeStatus(data).then(res => {
        if (res) {
          console.log(res)
          this.getRequests()
          this.requestOrder = false
          this.snackbar = {
            msg: stage,
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
