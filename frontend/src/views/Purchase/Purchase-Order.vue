<template>
  <section>
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
            clearable
            item-text="name"
            item-value="_id"
            return-object
            label="Select Supplier"
            prepend-inner-icon="mdi-select"
            dense
          >
            <template slot="prepend-item">
              <v-container
                color="success"
                class="autoPad"
                @click="supplierDialog=!supplierDialog">
                <v-layout
                  row
                  class="body-2">
                  <v-flex class="point">
                    <v-icon color="#44f">mdi-18px mdi-plus-circle-outline</v-icon>
                    <span class="subheadingE">Add Supplier</span>
                  </v-flex>
                </v-layout>
              </v-container>
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
              @input="dueMenu = false" />
          </v-menu>
        </v-flex>
        <v-flex md2>
          <v-text-field
            v-model="orderNo"
            :rules="reqRules"
            label="Order No" />
        </v-flex>
      </v-layout>
      <v-layout wrap>
        <v-flex
          md6
          lg6>
          <v-combobox
            v-model="filter"
            :items="getCat"
            label="Category Search"
            solo
            item-text="category"
            item-value="_id "
            chips
            clearable
            hide-no-data
            hide-selected
            prepend-inner-icon="mdi-checkbox-multiple-blank"
            multiple
            @input="getfilter(filter)"
          >
            <template v-slot:selection="data">
              <v-chip
                close:selected="data.selected"
                close
                @input="removeFilter(data.item)">
                <strong>{{ data.item.category }}</strong>;
              </v-chip>
            </template>
          </v-combobox>
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
                    :items="product"
                    item-text="name"
                    item-value="name"
                    class="mr-2"
                    flat
                    label="Search Item"
                    prepend-inner-icon="mdi-magnify"
                    clearable
                    dense
                    solo-inverted
                  />
                </div>
                <v-spacer />
                <v-flex text-xs-right>
                  <v-btn
                    fab
                    dark
                    icon
                    color="primary"
                    @click="showAdd()">
                    <v-icon
                      dark
                      class="mr-1">mdi-playlist-plus</v-icon>
                  </v-btn>
                </v-flex>
              </v-toolbar>
            </helper-offset>
          </v-card>
          <v-data-table
            :headers="headers"
            :items="product"
            :search="search"
            :rows-per-page-items="[25,50,100]">
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
              <td class="text-xs-center">{{ item.name }}</td>
              <td>{{ item.decs }}</td>
              <td class="text-xs-center">
                <v-text-field
                  v-model.number="item.pQty"
                  :label="item.qty.toString()"
                  type="number"
                  min="0"
                />
              </td>
              <td class="text-xs-center">
                <v-select
                  v-model="item.selectUnit"
                  :items="item.unit"
                  item-text="unit"
                  return-object
                  dense
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
                      <v-spacer />
                      <v-flex text-xs-right>{{ item.qty }}</v-flex>
                    </v-layout>
                  </template>
                </v-select>
              </td>
              <td class="text-xs-left">
                <v-text-field
                  v-model.number="item.pCost"
                  :label="item.pPrice.toString()"
                  type="number"
                  min="0"
                />
              </td>
              <td class="text-xs-right">
                <v-icon
                  :disabled=" !item.pQty|| !item.selectUnit"
                  color="primary"
                  large
                  @click="orderItem(item)"
                >mdi-plus-box</v-icon>
              </td>
            </template>
          </v-data-table>
        </v-flex>
        <v-flex
          md6
          lg6>
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
                        <v-icon class="mr-2">mdi-bug</v-icon>Order
                      </v-tab>
                      <v-tab class="mr-3">
                        <v-icon class="mr-2">mdi-code-tags</v-icon>Bill
                      </v-tab>
                    </v-tabs>
                  </v-flex>
                </div>
              </v-toolbar>
            </helper-offset>
          </v-card>

          <v-tabs-items v-model="tabs">
            <v-tab-item>
              <v-data-table
                :headers="orderheaders"
                :items="orderItems"
                :rows-per-page-items="[25,50,100]">
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
                  <td>{{ item.name }}</td>
                  <td>{{ item.decs }}</td>

                  <td class="text-xs-center">
                    <span v-if="!editThis[index].edit">{{ item.pQty }}</span>
                    <v-text-field
                      v-else
                      v-model.number="item.pQty"
                      type="number"
                      @keypress.enter="editThis[index].edit=false;"
                      @blur="editThis[index].edit=false;"
                    />
                  </td>
                  <!--show input to edit data -->
                  <!--show end-->
                  <td class="text-xs-center">
                    <span v-if="!editThis[index].edit">{{ item.selectUnit.unit }}</span>
                    <v-select
                      v-else
                      v-model="item.selectUnit"
                      :items="item.unit"
                      item-text="unit"
                      return-object
                      dense
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
                          <v-spacer />
                          <v-flex text-xs-right>{{ item.qty }}</v-flex>
                        </v-layout>
                      </template>
                    </v-select>
                  </td>
                  <td class="text-xs-center">
                    <span v-if="!editThis[index].edit">{{ item.pCost }}</span>
                    <v-text-field
                      v-else
                      v-model.number="item.pCost"
                      type="number"
                      @keypress.enter="editThis[index].edit=false;"
                      @blur="editThis[index].edit=false;"
                    />
                  </td>
                  <td>{{ item.pQty * item.pCost * item.selectUnit.qty }}</td>
                  <td class="text-xs-right">
                    <v-icon
                      color="blue"
                      large
                      @click="editThis[index].edit = !editThis[index].edit ;editTotal(item,index)"
                    >mdi-pencil-circle</v-icon>
                    <v-icon
                      color="red"
                      large
                      @click="deleteItems(index,item)">mdi-delete-circle</v-icon>
                  </td>
                </template>
              </v-data-table>
            </v-tab-item>

            <v-divider />

            <v-tab-item>
              <v-card>
                <v-container>
                  <v-layout wrap>
                    <!-- <v-flex>
                      <h2>Total Item: {{ totalQty }}</h2>
                    </v-flex>-->
                    <v-flex
                      md6
                      style="padding-top:28px">
                      <span class="headline">Total Price: {{ totalPrice }}</span>
                    </v-flex>
                    <v-flex md4>
                      <v-text-field
                        v-model.number="advance"
                        :disabled="totalPrice === 0"
                        label="Advance Payment"
                        outline
                        type="Number"
                      />
                    </v-flex>
                    <v-flex
                      md6
                      style="padding-top:28px">
                      <span class="headline">Balance: {{ balance }}</span>
                    </v-flex>

                    <v-flex
                      md3
                      style="padding-top:28px">
                      <span
                        class="headline"
                        v-text="`Delivered:` " />
                    </v-flex>
                    <v-flex md1>
                      <v-switch
                        v-model="delivery"
                        :disabled="!supplier || orderItems.length <=0 " />
                    </v-flex>
                    <v-flex md4>
                      <v-autocomplete
                        v-model="headAcct"
                        :items="coaHeads"
                        item-text="name"
                        return-object
                        label="Select Head"
                        outline
                      />
                    </v-flex>
                    <v-spacer />
                    <v-flex md3>
                      <v-btn
                        :disabled="!supplier || orderItems.length <=0 || !headAcct"
                        color="black"
                        @click="order()"
                      >Purchase</v-btn>
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

    <v-dialog
      v-model="orderDialog"
      persistent
      width="600">
      <v-card>
        <v-icon
          large
          color="red"
          @click="orderDialog=false">mdi-close-box-outline</v-icon>
        <v-container>
          <v-layout row>
            <v-flex sx4>Supplier: {{ pDetail.supplierName }}</v-flex>
            <v-flex sx4>Order No: {{ pDetail.orderNo }}</v-flex>
            <v-flex sx4>Order Date: {{ pDetail.orderDate }}</v-flex>
          </v-layout>
          <v-data-table
            :headers="dialog_headers"
            :items="orderdItem"
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
              <td class="text-xs-center">{{ item.code }}</td>
              <td class="text-xs-center">{{ item.name }}</td>
              <td class="text-xs-center">{{ item.pPrice }}</td>
              <td class="text-xs-center">{{ pDetail.items[index].pQty }}</td>
            </template>
          </v-data-table>
        </v-container>
      </v-card>
    </v-dialog>

    <v-dialog
      v-model="supplierDialog"
      max-width="600">
      <v-card>
        <v-card-title class="headline">Add New Supplier</v-card-title>
        <v-form
          ref="supform"
          v-model="supvalid">
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex md6>
                <v-text-field
                  v-model="supItem.name"
                  :rules="reqRules"
                  label="Name"
                  hint="i.e: xyz-123"
                />
              </v-flex>
              <v-flex md6>
                <v-text-field
                  v-model="supItem.email"
                  :rules="reqRules"
                  label="Email" />
              </v-flex>
              <v-flex md6>
                <v-text-field
                  v-model="supItem.phone"
                  :rules="reqRules"
                  label="Phone" />
              </v-flex>
              <v-flex md12>
                <v-text-field
                  v-model="supItem.address"
                  :rules="reqRules"
                  label="Address" />
              </v-flex>
              <v-flex md12>
                <v-textarea
                  v-model="supItem.about"
                  label="About" />
              </v-flex>
            </v-layout>
          </v-container>
        </v-form>
        <v-card-actions>
          <v-spacer />
          <v-btn
            :disabled="!supvalid"
            color="green darken-1"
            @click="addSupplier()">Save</v-btn>
          <v-btn
            color="orange"
            @click="supplierDialog = false">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog
      v-model="formDialog"
      transition="dialog-bottom-transition"
      persistent>
      <v-card tile>
        <!-- <v-card-title> -->
        <v-container
          fluid
          style="padding:0">
          <v-layout wrap>
            <v-flex style="padding:20px">
              <span
                class="headline"
                v-text=" dialogHeadline" />
            </v-flex>
            <v-spacer />
            <v-flex
              text-xs-right
              style="padding:20px">
              <v-btn
                fab
                dark
                icon
                color="primary darken-2"
                @click="formDialog = false">
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </v-flex>
          </v-layout>
        </v-container>
        <!-- </v-card-title> -->
        <v-container
          grid-list-md
          style="padding-top:0px">
          <v-form
            ref="addform"
            v-model="addvalid">
            <v-layout wrap>
              <v-flex
                xs12
                sm4
                md4>
                <v-text-field
                  v-model="newItem.name"
                  :rules="reqRules"
                  label="Item Name"
                  required />
              </v-flex>
              <v-flex
                xs12
                sm4
                md4
                offset-md1>
                <v-text-field
                  v-model="newItem.code"
                  :rules="reqRules"
                  label="Item Code"
                  hint="i.e: xyz-123"
                />
              </v-flex>
              <v-flex
                xs12
                sm4
                md4>
                <v-text-field
                  v-model.number="newItem.sPrice"
                  :rules="reqRules"
                  type="Number"
                  label="Sale Price"
                />
              </v-flex>
              <v-flex
                xs12
                sm4
                md4
                offset-md1>
                <v-text-field
                  v-model.number="newItem.pPrice"
                  :rules="reqRules"
                  type="Number"
                  label="Purchase Price"
                />
              </v-flex>
              <v-flex
                xs12
                sm4
                md4>
                <v-text-field
                  v-model.number="newItem.qty"
                  :label="qtyLabel"
                  type="Number" />
              </v-flex>
              <v-flex
                xs12
                sm4
                md4
                offset-md1>
                <v-combobox
                  v-model="newItem.categories"
                  :rules="reqRules"
                  :items="getCat"
                  label="Categories"
                  solo
                  item-text="category"
                  item-value="_id "
                  chips
                  clearable
                  hide-no-data
                  hide-selected
                  prepend-inner-icon="mdi-checkbox-multiple-blank"
                  multiple
                  @input="getChange(newItem.categories)"
                >
                  <template v-slot:selection="data">
                    <v-chip
                      close:selected="data.selected"
                      close
                      @input="remove(data.item)">
                      <strong>{{ data.item.category }}</strong>;
                    </v-chip>
                  </template>
                </v-combobox>
              </v-flex>
              <v-spacer />
              <v-flex v-show="addCat">
                <v-btn
                  color="primary"
                  @click="addCat=!addCat">Add Category</v-btn>
              </v-flex>
              <v-flex v-show="!addCat">
                <v-text-field
                  v-model="category"
                  label="Enter Caegory"
                  prepend-icon="mdi-close"
                  append-outer-icon="mdi-plus-outline"
                  @click:prepend="addCat=!addCat;category=''"
                  @click:append-outer="addCategory(newItem.categories,category)"
                />
              </v-flex>
              <v-flex
                md4
                xs4
                sm4>
                <v-textarea
                  v-model="newItem.decs"
                  :rules="reqRules"
                  label="Describtion" />
              </v-flex>
            </v-layout>
          </v-form>

          <v-card-actions>
            <v-spacer />
            <v-btn
              :disabled="!addvalid"
              color="green darken-1"
              @click="addItem()">Save</v-btn>
          </v-card-actions>
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
import constants from '../../services/constants'

export default {
  data () {
    return {
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
      headers: constants.POS_HEADERS,
      orderheaders: constants.POS_SALES_HEADERS,
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
      advance: 0,
      orderDate: new Date().toISOString().substr(0, 10),
      dueDate: new Date().toISOString().substr(0, 10),
      orderNo: null,
      delivery: false,
      /** */
      list: {
        0: false,
        1: false,
        2: false
      },
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
      formDialog: false,
      newItem: {},
      addvalid: false,
      product: [], // get all product availlabe for the autocomplete
      qtyLabel: 'Opening Quantity',
      dialogHeadline: 'Add Item',
      /** Product puffs End */

      /** category cuffs */
      getCat: [],
      category: null,
      addCat: true,
      /** category cuffs End */

      // route variables editOrder
      isReRoute: false,
      orderId: undefined,
      filter: []
    }
  },
  computed: {
    balance: function () {
      if (this.advance === undefined) {
        return this.totalPrice
      } else {
        return this.totalPrice - this.advance
      }
    },
    totalPrice () {
      var stock = 0
      this.orderItems.forEach(item => {
        stock = stock + item.pCost * item.pQty * item.selectUnit.qty
      })

      return stock
    },
    totalQty () {
      var qty = 0
      this.orderItems.forEach(item => {
        qty = qty + item.pQty
      })
      return qty
    }
  },
  created () {
    this.getCategory('parents')
    this.getSuppliers() // supplier Stuffs
    this.getItems()
    this.getPermissions()
    this.getCOAheads()
    // route query eidt ORder link
    this.isReRoute = this.$route.query.route
    this.getOrder(this.$route.query.id)
    // route query
  },
  methods: {
    getCOAheads () {
      coaApi.getCoa().then(resp => {
        this.coaHeads = resp
      })
    },

    getItems () {
      itemApi.getItemApi().then(res => {
        this.product = res
      })
    },

    orderItem (item) {
      var index = -1
      index = this.orderItems.findIndex(obj => obj._id === item._id)
      if (index === -1) {
        if (item.pCost) {
          this.addToArray(item)
        } else {
          item.pCost = item.pPrice
          this.addToArray(item)
        }
      } else {
        this.snackbar = {
          msg: 'Item Already Added To List',
          stat: true,
          color: 'warning',
          icon: 'mdi-reload-alert'
        }
      }
    },

    addToArray (item) {
      this.editThis.push({ edit: false })
      let preOrder = Object.assign({}, item)
      this.orderItems.push(preOrder)
    },

    deleteItems (index, item) {
      this.orderItems.splice(index, 1)
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

    /** Category cuffs */
    getCategory (id) {
      itemApi.getCategory(id).then(res => {
        if (res) {
          this.getCat = res
        }
      })
    },

    getChange (select) {
      if (select.length > 0) {
        var parents = select[select.length - 1]._id
        this.getCategory(parents)
      } else {
        this.getCategory('parents')
      }
    },

    remove (item) {
      this.newItem.categories = this.newItem.categories.slice(
        0,
        this.newItem.categories.indexOf(item)
      )
      this.getChange(this.newItem.categories)
    },

    addCategory (select, add) {
      if (add !== '' && add !== undefined) {
        if (select !== undefined) {
          if (select.length > 0) {
            var parents = select[add]._id
            var obj = { parentId: parents, category: add }
          } else {
            obj = { category: add }
            parents = 'parents'
          }
        } else {
          obj = { category: add }
          parents = 'parents'
        }
        itemApi.addCategory(obj).then(res => {
          this.snackbar = res.status
          if (res.status === true) {
            this.category = ''
            this.getCategory(parents)
          }
        })
      }
    },
    /** Category cuffs End */

    /** New Item puffs */
    showAdd () {
      this.formDialog = true
      this.newItem = {}
    },

    addItem () {
      this.newItem.notDelivered = false
      itemApi.addItem(this.newItem).then(res => {
        this.snackbar = res.status
        if (res.status === true) {
          this.getItems()
          this.$refs.addform.reset()
          this.newItem.pCost = this.newItem.pPrice
          this.newItem.pQty = this.newItem.qty
          this.addToArray(this.newItem)
        }
      })
    },
    /** New Item puffs End */
    order () {
      this.orderItems.forEach(element => {
        this.items.push({
          itemId: element._id,
          itemQty: element.pQty,
          itemCost: element.pCost,
          itemUnit: element.selectUnit
        })
      })
      var obj = {
        _id: this.orderId,
        supplierId: this.supplier._id,
        supplierName: this.supplier.name,
        items: this.items,
        orderNo: this.orderNo,
        orderDate: this.orderDate,
        date: new Date(),
        dueDate: this.dueDate,
        advance: this.advance,
        delivered: this.delivery,
        act: this.headAcct
      }
      if (!this.isReRoute) {
        this.orderApi(obj)
      } else {
        this.editApi(obj)
      }
    },
    orderApi (obj) {
      orderAPi.orderApi(obj).then(res => {
        if (res) {
          this.totalQty = 0
          this.totalPrice = 0
          this.items = []
          this.orderItems = []
          this.supplier = undefined
          this.advance = undefined
          this.getItems()
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
    getOrder (id) {
      if (this.isReRoute !== undefined) {
        orderAPi.getRecipt(id).then(res => {
          if (res) {
            console.log(res)
            // fill this array to edit show input
            this.editThis = Array.from({ length: res.items.length }, () => ({
              edit: false
            }))
            //                value        start     end
            this.orderId = res._id
            this.supplier = { _id: res.supplierId, name: res.supplierName }
            this.orderDate = res.orderDate
            this.dueDate = res.dueDate
            this.orderNo = res.orderNo
            this.orderItems = res.items
            this.advance = res.advance
            this.delivery = res.delivered
          }
        })
      }
    },
    editApi (obj) {
      obj.total = this.totalPrice
      orderAPi.editApi(obj).then(res => {
        if (res) {
          this.snackbar = {
            msg: 'Order Edited',
            stat: true,
            color: 'success',
            icon: 'mdi-trophy-award'
          }
          this.$router.push({ path: '/purchase-report' })
        }
      })
    },
    backtoPage () {
      this.$router.push({ path: '/purchase-report' })
    },
    getItemsCat (data) {
      // get filtered Item acording to category
      itemApi.getItemCat(data).then(res => {
        this.product = res // get filtered Item acording to category
      })
    },
    getfilter (select) {
      console.log('here', select)
      if (select.length > 0) {
        var catsearch = []
        var parents = select[select.length - 1]._id // parent id to search
        select.forEach(el => {
          catsearch.push({ _id: el._id, category: el.category }) // create array without parentId to search
        })
        this.getItemsCat(catsearch) // get filter category
        this.getCategory(parents) // get child category
      } else {
        (this.searchCat = []), this.getItems() // get Item if category if category filed is empty
        this.getCategory('parents') // get parent category
      }
    },
    removeFilter (item) {
      // remove category from filed box
      this.filter = this.filter.slice(0, this.filter.indexOf(item))
      this.getfilter(this.filter)
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
.point {
  cursor: pointer;
}
</style>
