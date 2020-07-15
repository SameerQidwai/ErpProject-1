<template>
  <section>
    <v-container
      fluid
      grid-list-xl>
      <v-layout>
        <v-flex xs12>
          <v-card >
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
                    clearable
                    dense
                    solo-inverte
                    label="Search Item"
                    prepend-inner-icon="mdi-magnify"
                  />
                </div>
                <v-spacer />
                <v-flex text-xs-right>
                  <v-btn
                    small
                    color="primary"
                    @click="createRequest()">Request Order</v-btn>
                </v-flex>
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
              <td>{{ new Date(item.requestDate).toDateString() }}</td>
              <td>{{ new Date (item.requestDate).toLocaleTimeString() }}</td>
              <td class="text-xs-center">
                <v-icon
                  color="blue"
                  large
                  @click="showEdit(item._id)">mdi-pencil-circle</v-icon>
              </td>
            </template>
          </v-data-table>
        </v-flex>
      </v-layout>
    </v-container>

    <v-dialog
      v-model="requestOrder"
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
              @click="requestOrder = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
            <v-toolbar-title>Request Order</v-toolbar-title>
            <v-spacer/>
            <v-toolbar-items>
              <v-btn
                dark
                flat
                fab
                @click="order()">
                <span v-if="!edit">Order</span>
                <span v-else>Edit</span>
              </v-btn>
            </v-toolbar-items>
          </v-toolbar>
        </v-card-title>

        <v-container
          fluid
          grid-list-xl
          mt-4>
          <v-layout wrap>
            <v-flex md6>
              <v-card >
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
                class="elevation-1"
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
                  <td class="text-xs-right">
                    <v-icon
                      :disabled=" item.pQty==null || item.pQty=='' || item.selectUnit==undefined"
                      color="primary"
                      large
                      @click="orderItem(item)"
                    >mdi-plus-box</v-icon>
                  </td>
                </template>
              </v-data-table>
            </v-flex>
            <v-flex md6>
              <v-card>
                <helper-offset>
                  <v-toolbar
                    color="green"
                    dark>
                    <v-layout>
                      <v-flex xs4>
                        <v-text-field
                          v-model="requestNo"
                          label="Request No"
                          hint="Will be auto generte if left empty"
                          class="mr-2"
                          flat
                          readonly
                          box
                        />
                      </v-flex>
                      <v-spacer />
                      <v-flex
                        v-if="edit"
                        text-xs-right
                        pt-4>
                        <v-tooltip
                          slot="append-outer"
                          top>
                          <template v-slot:activator="{ on }">
                            <v-icon
                              slot="activator"
                              large
                              color="red"
                              v-on="on"
                              @click="changeStatus('Reject Request')"
                            >mdi-close-thick</v-icon>
                          </template>
                          <span>Request Reject</span>
                        </v-tooltip>
                        <v-tooltip
                          slot="append-outer"
                          top>
                          <template v-slot:activator="{ on }">
                            <v-icon
                              slot="activator"
                              large
                              v-on="on"
                              @click="changeStatus('Approve Request')"
                            >mdi-send-circle</v-icon>
                          </template>
                          <span>Request Approve</span>
                        </v-tooltip>
                      </v-flex>
                    </v-layout>
                  </v-toolbar>
                </helper-offset>
              </v-card>
              <v-data-table
                :headers="headers"
                :items="orderItems"
                class="elevation-1">
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
                      type="number" />
                  </td>
                  <!--show input to edit data -->
                  <!--show end-->
                  <td class="text-xs-center">
                    <v-select
                      v-model="item.selectUnit"
                      :items="item.unit"
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
                          <v-spacer />
                          <v-flex text-xs-right>{{ item.qty }}</v-flex>
                        </v-layout>
                      </template>
                    </v-select>
                  </td>
                  <td class="text-xs-right">
                    <v-icon
                      color="red"
                      large
                      @click="deleteItems(index,item)">mdi-delete-circle</v-icon>
                  </td>
                </template>
              </v-data-table>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card>
    </v-dialog>

    <!-- Into the freaking component -->
    <v-dialog
      v-model="formDialog"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
      persistent
      max-width="600"
    >
      <v-card>
        <v-card-title class="tool">
          <!-- <v-container grid-list-md> -->
          <v-layout wrap>
            <v-flex
              offset-md1
              class="display-1">{{ dialogHeadline }}</v-flex>
          </v-layout>
          <!-- </v-container> -->
          <v-spacer />
          <v-btn
            fab
            small
            round
            color="default darken-2"
            @click="formDialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <!-- samoe to push -->
        <v-container grid-list-md>
          <v-form
            ref="addform"
            v-model="addvalid">
            <v-layout wrap>
              <v-flex
                xs12
                sm3
                md3>
                <v-text-field
                  v-model="ItemObj.name"
                  :rules="reqRules"
                  outline
                  label="Item Name"
                  required
                />
              </v-flex>
              <v-flex
                xs12
                sm3
                md3
                offset-md1>
                <v-text-field
                  v-model="ItemObj.code"
                  outline
                  label="Item Code"
                  hint="The code will be auto genereted if field left blank"
                />
              </v-flex>

              <v-flex
                xs3
                offset-md1>
                <v-btn
                  color="info darken-2"
                  class="addItem"
                  @click="getUnits();unitDialog=true;"
                >Select Unit</v-btn>
                <div
                  v-show="pri.unit!=undefined"
                  class="body-2">
                  <span>{{ pri.qty }} {{ pri.unit }}</span>
                  <span>=</span>
                  <span>{{ sec.qty }} {{ sec.unit }}</span>
                </div>
              </v-flex>
              <v-flex
                xs12
                sm3
                md3>
                <v-text-field
                  v-model.number="ItemObj.sPrice"
                  :rules="reqRules"
                  outline
                  type="Number"
                  label="Sale Price"
                />
              </v-flex>
              <v-flex
                xs12
                sm3
                md3
                offset-md1>
                <v-text-field
                  v-model.number="ItemObj.pPrice"
                  :rules="reqRules"
                  outline
                  type="Number"
                  label="Purchase Price"
                />
              </v-flex>
              <v-flex
                xs12
                sm3
                md3
                offset-md1>
                <v-text-field
                  v-model.number="ItemObj.qty"
                  :label="qtyLabel"
                  outline
                  type="Number" />
              </v-flex>
              <v-flex
                xs12
                sm7
                md7>
                <v-combobox
                  v-model="ItemObj.categories"
                  :rules="reqRules"
                  :items="getCat"
                  label="Categories"
                  outline
                  item-text="category"
                  item-value="_id "
                  chips
                  clearable
                  hide-no-data
                  hide-selected
                  prepend-inner-icon="mdi-checkbox-multiple-blank"
                  multiple
                  @input="getChange(ItemObj.categories)"
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
              <v-flex
                xs3
                offset-md1>
                <span v-show="addCat">
                  <v-btn
                    color="primary"
                    class="addItem"
                    @click="addCat=!addCat">Add Category</v-btn>
                </span>
                <span v-show="!addCat">
                  <v-text-field
                    v-model="category"
                    outline
                    label="Enter Caegory"
                    prepend-icon="mdi-close"
                    append-outer-icon="mdi-plus-outline"
                    clearable
                    @click:prepend="addCat=!addCat;category=''"
                    @click:append-outer="addCategory(ItemObj.categories,category)"
                  />
                </span>
              </v-flex>
              <v-flex
                xs7
                sm7>
                <v-textarea
                  :rows="2"
                  v-model="ItemObj.decs"
                  :rules="reqRules"
                  outline
                  label="Describtion"
                />
              </v-flex>
            </v-layout>
          </v-form>

          <v-card-actions>
            <v-spacer />
            <v-btn
              :disabled="!addvalid"
              color="green darken-2"
              class="addItem"
              @click="addItem()"
            >Save</v-btn>
          </v-card-actions>
        </v-container>
      </v-card>
    </v-dialog>

    <!--Add Unit Model-->
    <v-dialog
      v-model="unitDialog"
      persistent
      width="50%">
      <v-card>
        <v-container pa-0>
          <v-layout style="background:#dbefdc">
            <v-flex
              md11
              pt-2
              pl-3>
              <span
                class="headline"
                v-text="'Select Unit'"/>
            </v-flex>
            <v-flex
              text-xs-right
              pt-2
              pr-3>
              <v-icon
                color="black"
                @click="unitDialog=false">mdi-close</v-icon>
            </v-flex>
          </v-layout>
          <v-layout
            pt-4
            px-3
            justify-space-around
            justify-center>
            <v-flex xs1>
              <v-text-field
                v-model.number="pri.qty"
                label="Qty"
                type="number" />
            </v-flex>
            <v-flex xs4>
              <v-autocomplete
                :disabled="pri.qty==undefined"
                v-model="pri.unit"
                :items="unitArray"
                dense
                clearable
                item-text="name"
                item-value="acronym"
                label="Primary Unit"
              >
                <template slot="prepend-item">
                  <v-layout
                    row
                    class="body-2"
                    py-1
                    px-2>
                    <v-flex style="cursor: pointer;">
                      <span @click="addUnitDialog=true">
                        <v-icon color="#44f">mdi-18px mdi-plus-circle-outline</v-icon>
                        <span class="subheadingE">Add Unit</span>
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
                    <v-flex text-xs-right>
                      <span>({{ item.acronym }})</span>
                    </v-flex>
                  </v-layout>
                </template>
              </v-autocomplete>
            </v-flex>
            <v-flex
              xs1
              text-xs-center
              align-self-center
              pb-3>
              <v-icon>mdi-arrow-right-bold-outline</v-icon>
            </v-flex>
            <v-flex xs1>
              <v-text-field
                v-model.number="sec.qty"
                type="number"
                label="Qty" />
            </v-flex>
            <v-flex xs4>
              <v-autocomplete
                :disabled="sec.qty==undefined"
                v-model="sec.unit "
                :items="unitArray"
                dense
                clearable
                item-text="name"
                item-value="acronym"
                label="Secondary Unit"
              >
                <template slot="prepend-item">
                  <v-layout
                    row
                    class="body-2"
                    py-1
                    px-2>
                    <v-flex style="cursor: pointer;">
                      <span @click="addUnitDialog=true">
                        <v-icon color="#44f">mdi-18px mdi-plus-circle-outline</v-icon>
                        <span class="subheadingE">Add New Unit</span>
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
                    <v-flex text-xs-right>
                      <span>({{ item.acronym }})</span>
                    </v-flex>
                  </v-layout>
                </template>
              </v-autocomplete>
            </v-flex>
          </v-layout>
        </v-container>
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="info"
            class="addItem"
            @click="selectUnit(pri,sec)">Add</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!--Add Unit Model-->
    <!--Add NEW UNIT-->
    <v-dialog
      v-model="addUnitDialog"
      width="40%">
      <v-form
        ref="formUnit"
        v-model="formUnit">
        <v-card>
          <v-container pa-0>
            <v-layout style="background:#dbefdc">
              <v-flex
                md11
                pt-2
                pl-3>
                <span
                  class="headline"
                  v-text="'Add New Unit'"/>
              </v-flex>
              <v-flex
                text-xs-right
                pt-2
                pr-3>
                <v-icon
                  color="black"
                  @click="addUnitDialog=false">mdi-close</v-icon>
              </v-flex>
            </v-layout>
            <v-layout
              pt-4
              px-3
              justify-space-around
              justify-center>
              <v-flex xs5>
                <v-text-field
                  :rules="reqRules"
                  v-model="addUnit.name"
                  clearable
                  label="Unit Name" />
              </v-flex>
              <v-flex
                xs1
                text-xs-center
                align-self-center
                pb-3>
                <v-icon>mdi-dots-horizontal</v-icon>
              </v-flex>
              <v-flex xs5>
                <v-text-field
                  :rules="reqRules"
                  v-model="addUnit.acronym"
                  clearable
                  label="Unit Acronym"
                />
              </v-flex>
            </v-layout>
          </v-container>
          <v-card-actions>
            <v-spacer />
            <v-btn
              :disabled="!formUnit"
              class="addItem"
              color="blue"
              @click="saveUnit(addUnit)"
            >Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>
    <!-- Into the freaking component -->
    <v-snackbar
      v-model="snackbar.stat"
      :color="snackbar.color">
      <v-icon>{{ snackbar.icon }}</v-icon>
      <kbd>{{ snackbar.msg }}</kbd>
      <v-icon @click="snackbar.stat=false">mdi-close-circle</v-icon>
    </v-snackbar>
  </section>
</template>

<script>
import orderAPi from '../../services/order-api'
import itemApi from '../../services/items-api'

export default {
  data () {
    return {
      requestNo: undefined,
      requestOrder: false,
      search: undefined,
      edit: false,
      orderItems: [],
      items: [],
      orders: [],
      product: [],
      snackbar: false,
      dialogHeadline: undefined,
      headers: [
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
        { sortable: false, text: '....', value: 'action', align: 'right' }
      ],
      requestHeader: [
        { sortable: false, text: 'Request No', value: '_id' },
        { sortable: false, text: 'Requested Date', value: 'requestDate' },
        { sortable: false, text: 'requeted Time', value: 'time' },
        { sortable: false, text: 'Edit/Show', align: 'center' }
        // { sortable: false, text: "....", value: "action", align: "center" }
      ],

      // into freaking cmponent
      unitDialog: false,
      unitArray: [],
      pri: {},
      sec: {},

      addUnitDialog: false,
      addUnit: {},
      formUnit: {},

      addUnitObj: {},

      formDialog: false,
      ItemObj: {}, // call Item attribute in edit dialog
      qtyLabel: 'Opening Quantity',
      dialogHeadline: 'Add Item',
      addvalid: false,
      /** category cuffs */
      getCat: [],
      category: null,
      addCat: true,
      /** category cuffs End */
      // into Freaking component
      reqRules: [v => !!v || ' required']
    }
  },
  created () {
    this.getCategory('parents')
    this.getRequests()
  },
  methods: {
    createRequest () {
      this.items = []
      this.edit = false
      this.requestNo = undefined
      this.getItems()
      this.requestOrder = true
    },
    getItems () {
      itemApi.getItemApi().then(res => {
        if (res.length > 0) {
          this.product = res
        }
      })
    },
    getRequests () {
      orderAPi.getOrders('request').then(res => {
        if (res) {
          this.orders = res
        }
      })
    },

    orderItem (item) {
      var index = -1
      index = this.orderItems.findIndex(obj => obj._id === item._id)
      if (index === -1) {
        let preOrder = Object.assign({}, item)
        this.orderItems.push(preOrder)
      } else {
        this.snackbar = {
          msg: 'Item Already Added To List',
          stat: true,
          color: 'warning',
          icon: 'mdi-reload-alert'
        }
      }
    },

    deleteItems (index, item) {
      this.orderItems.splice(index, 1)
    },

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
        items: this.items,
        stage: 'request'
      }
      if (!this.edit) {
        this.orderApi(obj)
      } else {
        this.editApi(obj)
      }
    },
    orderApi (obj) {
      obj.requestDate = new Date()
      orderAPi.request(obj).then(res => {
        if (res) {
          this.items = []
          this.orderItems = []
          this.getRequests()
          this.snackbar = {
            msg: 'Ordered',
            stat: true,
            color: 'success',
            icon: 'mdi-truck-delivery-outline'
          }
          this.requestOrder = false
        }
      })
    },
    showEdit (id) {
      orderAPi.getOrder(id).then(res => {
        if (res) {
          this.edit = true
          this.items = []
          this.editOrder = res
          this.orderItems = res.items
          this.requestNo = res._id.substr(18)
          this.requestOrder = true
          this.getItems()
        }
      })
    },
    editApi (obj) {
      obj._id = this.editOrder._id
      obj.requestDate = this.editOrder.requestDate
      orderAPi.editRequest(obj).then(res => {
        if (res) {
          this.getRequests()
          this.requestOrder = false
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
      var data = { stage, _id: this.editOrder._id, reqActDate: new Date() }
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
    showAdd () {
      this.formDialog = true
      this.ItemObj = {}
      this.qtyLabel = 'Opening Quantity'
      this.dialogHeadline = 'Add Item'
      this.edit = false
      this.getCategory('parents')
    },
    // into freaking component
    addItem () {
      this.ItemObj.notDelivered = false
      itemApi.addItem(this.ItemObj).then(res => {
        this.snackbar = res.status
        if (res.status === true) {
          this.getItems()
          this.$refs.addform.reset()
          this.ItemObj.pCost = this.ItemObj.pPrice
          this.ItemObj.pQty = this.ItemObj.qty
          this.orderItem(this.ItemObj)
        }
      })
    },

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
      this.ItemObj.categories = this.ItemObj.categories.slice(
        0,
        this.ItemObj.categories.indexOf(item)
      )
      this.getChange(this.ItemObj.categories)
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
    /** Category ENd */
    /** Unit startted */
    getUnits () {
      itemApi.getUnits().then(res => {
        if (res) {
          this.unitArray = res
        }
      })
    },
    saveUnit (data) {
      itemApi.saveUnit(data).then(res => {
        if (res == true) {
          this.getUnits()
          this.addUnitDialog = false
          this.$refs.formUnit.reset()
        } else if (res.name) {
          this.snackbar = {
            msg: 'Unit is Already existed!',
            stat: true,
            color: 'red',
            icon: 'mdi-bell-plus'
          }
        }
      })
    },
    selectUnit (pri, sec) {
      if (sec.unit == pri.unit) {
        this.sec = {}
        this.snackbar = {
          msg: "Base Unit and Secondary Unit Can't not be same",
          stat: true,
          color: 'red',
          icon: 'mdi-shield-alert-outline'
        }
      } else {
        var unit = [pri, sec]
        this.ItemObj['unit'] = unit
        this.unitDialog = false
      }
    },
    /** Unit End */
    /** Item ENd */
    // into freaking component

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
</style>
