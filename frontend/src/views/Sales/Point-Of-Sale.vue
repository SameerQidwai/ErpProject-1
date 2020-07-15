<template>
  <v-container
    fill-height
    fluid
    grid-list-xl>
    <v-layout wrap>
      <v-flex
        md6
        sm12>
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
          @input="getChange(filter)"
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
        <v-card
          v-bind="$attrs"
          v-on="$listeners">
          <helper-offset>
            <v-toolbar
              color="orange"
              dark
              tabs>
              <v-flex xs5>
                <v-autocomplete
                  v-model="search"
                  :items="products"
                  label="Search for Items"
                  item-text="name"
                  box
                  clearable
                />
              </v-flex>
              <v-flex xs6>
                <v-autocomplete
                  v-model="search"
                  :items="products"
                  item-text="decs"
                  label="Search for Descriptions"
                  box
                  clearable
                />
              </v-flex>
            </v-toolbar>
          </helper-offset>
        </v-card>

        <v-data-table
          :search="search"
          :headers="headers"
          :items="products"
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
            <td class="text-xs-center">{{ item.name }}</td>
            <td>{{ item.decs }}</td>
            <td class="text-xs-center">
              <v-text-field
                v-model.number="item.sQty"
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
                v-model.number="item.sSale"
                :label="item.sPrice.toString()"
                type="number"
                min="0"
              />
            </td>
            <td class="text-xs-right">
              <v-icon
                :disabled=" !item.sQty|| !item.selectUnit"
                color="primary"
                large
                @click="addQtyToSale(item)"
              >mdi-plus-box</v-icon>
            </td>
          </template>
        </v-data-table>
      </v-flex>
      <v-flex
        md6
        sm12>
        <v-layout
          wrap
          row
          align-content-space-between
          justify-center>
          <v-flex mb-2>
            <v-layout
              wrap
              justify-center
              justify-space-around>
               <v-flex md4 pa-1 xs4 class="bordercustome cyan3">
                <h4 class="font-weight-bold">Total: {{ GrandTotal }}</h4>
              </v-flex >
              <v-flex md4 xs4 pa-1 class="bordercustome cyan2">
                <h4 class="font-weight-bold">Debit: {{ order.debit }}</h4>
              </v-flex >
              <v-flex md4 xs4  pa-1 class="bordercustome wheet">
                <h4 class="font-weight-bold">Balance: {{ Balance }}</h4>
              </v-flex >
            </v-layout>
          </v-flex>
        </v-layout>
        <v-card
          v-bind="$attrs"
          v-on="$listeners">
          <helper-offset>
            <v-toolbar
              color="green"
              dark
              tabs>
              <v-layout wrap>
                <v-flex md6>
                  <v-autocomplete
                    v-model="selectedCustomer"
                    :items="Customers"
                    label="Select Customers"
                    box
                    item-text="name"
                    return-object
                    clearable
                    @input="getCart()"
                    @click:clear="clearVars()"
                  >
                    <template slot="prepend-item">
                      <v-container
                        color="success"
                        class="autoPad"
                        @click="addDialog=!addDialog">
                        <v-layout
                          row
                          class="body-2">
                          <v-flex class="point">
                            <v-icon color="#44f">mdi-18px mdi-plus-circle-outline</v-icon>
                            <span class="subheadingE">Add Customer</span>
                          </v-flex>
                        </v-layout>
                      </v-container>
                      <v-divider />
                    </template>
                  </v-autocomplete>
                </v-flex>
                <v-spacer />
                <v-flex style="align-self: center">
                  <v-layout wrap>
                    <v-flex text-xs-right>
                      <v-tooltip top>
                        <template v-slot:activator="{ on }">
                          <v-btn
                            :disabled="selectedCustomer==undefined"
                            fab
                            dark
                            icon
                            color="primary"
                            v-on="on"
                            @click="showPay()"
                          >
                            <v-icon
                              dark
                              class="mr-1">mdi-account-cash</v-icon>
                          </v-btn>
                        </template>
                        <span>Payment</span>
                      </v-tooltip>
                      <v-tooltip top>
                        <template v-slot:activator="{ on }">
                          <v-btn
                            :disabled="selectedCustomer==undefined"
                            fab
                            dark
                            icon
                            color="danger"
                            v-on="on"
                            @click="returnSale()"
                          >
                            <v-icon
                              dark
                              class="mr-1">mdi-delete</v-icon>
                          </v-btn>
                        </template>
                        <span>Return sale</span>
                      </v-tooltip>
                    </v-flex>
                  </v-layout>
                </v-flex>
              </v-layout>
            </v-toolbar>
          </helper-offset>
        </v-card>
        <!-- will do som other Time -->
        <v-card>
          <v-data-table
            :headers="salesHeader"
            :items="saleItems"
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
              slot-scope="{  index , item }">
              <td class="text-xs-left">{{ item.name }}</td>
              <td>{{ item.decs }}</td>
              <td class="text-xs-left">{{ item.sQty }}</td>
              <td class="text-xs-left">{{ item.sUnit.unit }}</td>
              <td class="text-xs-left">{{ item.sSale }}</td>
              <td class="text-xs-left">{{ item.sQty * item.sSale*item.sUnit.qty }}</td>
              <!--itemCost -->
              <td class="text-xs-center">
                <v-icon
                  color="red"
                  large
                  @click="delFromCart(item,index)">mdi-delete-circle</v-icon>
              </td>
            </template>
          </v-data-table>
        </v-card>
      </v-flex>
    </v-layout>

    <v-dialog
      v-model="addDialog"
      width="600">
      <v-card>
        <v-form
          ref="form"
          v-model="valid">
          <v-container>
            <v-card-title class="headline">Add customer</v-card-title>
            <v-layout wrap>
              <v-flex>
                <v-text-field
                  v-model="newCustomer.name"
                  :rules="reqRules"
                  label="Customer Name"
                  clearable
                />
              </v-flex>
              <v-flex>
                <v-text-field
                  v-model="newCustomer.phone"
                  :rules="phoneRules"
                  label="Phone#"
                  hint="Phone# starts with +92"
                  clearable
                  persistent-hint
                />
              </v-flex>
              <v-flex>
                <v-text-field
                  v-model="newCustomer.email"
                  label="E-mail"
                  clearable />
              </v-flex>
              <v-flex>
                <v-text-field
                  v-model="newCustomer.address"
                  :counter="100"
                  label="Address"
                  max="100"
                  clearable
                />
              </v-flex>
              <v-flex text-xs-right>
                <v-btn
                  :disabled="!valid"
                  color="success"
                  @click="addCustomer">Add</v-btn>
                <v-btn
                  color="error"
                  @click="reset()">Reset Form</v-btn>
              </v-flex>
            </v-layout>
          </v-container>
        </v-form>
      </v-card>
    </v-dialog>

    <v-dialog
      v-model="payDialog"
      width="800">
      <v-card>
        <v-container grid-list-xl>
          <v-card-title class="headline">
            <v-layout wrap>
              <v-flex>Recipt Id: {{ obj.id }}</v-flex>
              <v-flex>Name: {{ obj.customerName }}</v-flex>
            </v-layout>
          </v-card-title>
          <v-divider
            dark
            class="divided" />
          <v-card-title>
            <v-layout
              wrap
              title>
              <v-flex>Total Amount: {{ obj.total }}</v-flex>
              <v-flex>Balance: {{ obj.balance }}</v-flex>
              <v-flex>Debit: {{ obj.debit }}</v-flex>
              <v-flex>Discount: {{ obj.discount }}</v-flex>
            </v-layout>
          </v-card-title>
          <v-divider
            dark
            class="divided" />
          <v-form
            ref="payform"
            v-model="payValid">
            <v-layout wrap>
              <span class="custom-center">RECEIVED:</span>
              <v-flex md3>
                <v-text-field
                  v-model.number="Debit"
                  type="Number"
                  outline
                  label="(Rs)"
                  min="0"
                  @input="fDebit(Debit)"
                />
              </v-flex>
              <v-flex>
                <v-switch
                  v-model="obj.closed"
                  :disabled="obj.balance > 0"
                  color="info">
                  <template slot="label">
                    <span style>CHECK-OUt</span>
                  </template>
                </v-switch>
              </v-flex>
              <v-spacer />
              <span
                text-xs-right
                class="custom-center">DISCOUNT:</span>
              <v-flex md2>
                <v-text-field
                  v-model.number="dis"
                  outline
                  type="Number"
                  label="(Rs)"
                  min="0"
                  @input="fdiscount(dis)"
                />
              </v-flex>
              <span class="custom-center font-wazn">-</span>
              <v-flex md2>
                <v-text-field
                  v-model.number="pDis"
                  outline
                  type="Number"
                  max="100"
                  min="0"
                  label="(%)"
                  max-length="100"
                  @input="fpDiscount(pDis)"
                />
              </v-flex>
              <v-flex md4>
                <v-autocomplete
                  v-model="headAcct"
                  :rules="reqRules"
                  :items="coaHeads"
                  item-text="name"
                  return-object
                  label="Select Head"
                  outline
                />
              </v-flex>
            </v-layout>
          </v-form>
        </v-container>
        <v-card-actions>
          <v-spacer />
          <v-btn
            :disabled="!payValid"
            color="green darken-1"
            @click="payment()">Save</v-btn>
          <v-btn
            color="orange"
            @click="payDialog=!payDialog;">Cancel</v-btn>
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
import api from '../../services/items-api'
import salesApi from '../../services/sales-api'
import coaApi from '../../services/coa-api'
import cust from '../../services/cust-api'
import constants from '../../services/constants'

export default {
  data () {
    return {
      search: null,
      coaHeads: [],
      addDialog: false,
      payDialog: false,
      chose: true,
      snackbar: {},

      selectedItem: '',
      itemSelect: [],

      selectedDescription: '',
      descSelect: [],

      products: [],
      headers: constants.POS_HEADERS,

      // From here sales POS starts
      selectedCustomer: undefined,
      Customers: [],
      salesHeader: constants.POS_SALES_HEADERS,
      saleItems: [],
      order: {},
      GrandTotal: 0,
      Debit: null,
      Balance: 0,
      obj: {},
      dis: 0,
      pDis: null,
      headAcct: null,
      /** Customer Dialog STuff */
      payValid: true,
      valid: true,
      newCustomer: {},
      reqRules: [v => !!v || 'required'],
      phoneRules: [v => !!v || 'Phone# is required'],
      getCat: [],
      filter: [],
      searchCat: []
    }
  },
  created () {
    this.getItems()
    this.getCustomers()
    this.getCategory('parents')
    this.getPermissions()
    this.getCOAheads()
  },
  methods: {
    getCOAheads () {
      coaApi.getCoa().then(resp => {
        this.coaHeads = resp
      })
    },

    getItems () {
      api.getItemApi().then(res => {
        this.products = res
      })
    },

    getCustomers () {
      salesApi.getCustomer().then(res => {
        this.Customers = res
      })
    },

    getCart () {
      if (this.selectedCustomer !== undefined) {
        let id = this.selectedCustomer._id
        salesApi.getCart(id).then(res => {
          if (res) {
            this.order = res
            this.saleItems = res.items
            this.GrandTotal = res.totalPrice
          } else if (res === false) {
            this.order = res
            this.saleItems = res.items
            this.GrandTotal = 0
          }
        })
      }
    },

    addQtyToSale (item) {
      /* stop same Item twice in the array */
      // let exist = this.saleItems.find(x => x._id === item._id);

      // if (exist) {
      //   this.snackbar = {
      //     msg: "Already Added",
      //     stat: true,
      //     color: "warning",
      //     icon: "mdi-clipboard-outline"
      //   };
      //   return;
      // }
      /* End stop same Item twice in the array */
      if (this.selectedCustomer) {
        if (item.sQty <= item.qty) {
          if (item.sSale !== undefined && item.sSale !== '') {
            this.addToArray(item)
          } else {
            item.sSale = item.sPrice
            this.addToArray(item)
          }
        } else {
          this.snackbar = {
            msg: 'Quantity Not Enough!',
            stat: true,
            color: 'warning',
            icon: 'mdi-clipboard-outline'
          }
        }
      } else {
        this.snackbar = {
          msg: 'Select Customer!',
          stat: true,
          color: 'info',
          icon: 'mdi-account-alert'
        }
      }
    },

    addToArray (item) {
      let preOrder = Object.assign({}, item)
      item.qty = item.qty - item.sQty * item.selectUnit.qty
      preOrder.itemId = item._id
      var cus = this.selectedCustomer
      var obj = {
        customerId: cus._id,
        customerName: cus.name,
        date: new Date(),
        items: {
          itemId: item._id,
          sQty: item.sQty,
          sSale: item.sSale,
          sUnit: item.selectUnit,
          index: new Date().getTime()
        }
      }
      salesApi.addToCart(obj).then(res => {
        if (res) {
          // this.order = res;
          // this.saleItems = res.product;
          // this.totalDebitBalance();
          this.getCart()
        }
      })
    },

    delFromCart (item, sIndex) {
      let cus = this.selectedCustomer
      let vars = this.order
      let obj = {
        id: vars._id,
        customerId: cus._id,
        customerName: cus.name,
        items: {
          itemId: item._id,
          sQty: item.sQty,
          sSale: item.sSale,
          sUnit: item.sUnit,
          index: item.index
        }
      }
      salesApi.delFromCart(obj).then(res => {
        if (res) {
          console.log(res)
          var pIndex = this.products
            .map(function (x) {
              return x._id
            })
            .indexOf(item._id)
          this.products[pIndex].qty += item.sQty * item.sUnit.qty
          this.getCart()
        }
      })
    },

    totalDebitBalance () {
      let totalAmount = 0
      this.GrandTotal = 0
      this.Balance = 0
      this.saleItems.forEach(element => {
        totalAmount += element.sQty * element.sSale
      })
      this.GrandTotal = totalAmount
      this.order.debit = parseInt(this.order.debit) || 0
      this.Balance = totalAmount - this.order.debit - this.order.discount
    },

    clearVars () {
      this.GrandTotal = 0
      this.Balance = 0
      this.saleItems = []
      this.order = {}
    },

    showPay () {
      this.$refs.payform.reset()
      let vars = this.order
      this.obj = {
        id: vars._id,
        customerId: vars.customerId,
        customerName: this.selectedCustomer.name,
        total: this.GrandTotal,
        balance: this.Balance,
        debit: vars.debit,
        discount: vars.discount
      }
      this.payDialog = true
    },

    payment () {
      this.payDialog = !this.payDialog
      let vars = this.order
      var myobj = {
        id: vars._id,
        debit: this.Debit,
        discount: this.dis,
        customerId: this.obj.customerId,
        customerName: this.obj.customerName,
        closed: this.obj.closed,
        act: this.headAcct,
        total: this.GrandTotal,
        drDate: new Date()
      }

      salesApi.payment(myobj).then(res => {
        if (res === true) {
          this.getCustomers()
          this.clearVars()
          this.selectedCustomer = undefined
        } else if (res === false) {
          this.getCart()
        }
      })
    },

    fdiscount (dis) {
      if (this.Debit) {
        this.obj.balance = this.Balance - this.Debit - dis
        this.pDis = (dis / (this.Balance - this.Debit)) * 100
      } else {
        this.obj.balance = this.Balance - dis
        this.pDis = (dis / this.Balance) * 100
      }
    },

    fpDiscount (pDis) {
      if (this.Debit) {
        this.obj.balance = Math.round(
          this.Balance - this.Debit - (pDis / 100) * (this.Balance - this.Debit)
        )
        this.dis = this.Balance - this.Debit - this.obj.balance
      } else {
        this.obj.balance = Math.round(
          this.Balance - (pDis / 100) * this.Balance
        )
        this.dis = this.Balance - this.obj.balance
      }
    },

    fDebit (debit) {
      if (this.dis) {
        this.obj.balance = this.Balance - this.dis - debit
      } else {
        this.obj.balance = this.Balance - debit
      }
    },

    addCustomer () {
      cust.addCustomer(this.newCustomer).then(res => {
        if (res === true) {
          this.$refs.form.reset()
          this.snackbar = {
            msg: 'Customer Added Successfully!',
            stat: true,
            color: 'success',
            icon: 'mdi-account-convert'
          }
          this.getCustomers()
        } else if (res.name) {
          this.snackbar = {
            msg: 'Customer is Already Added!',
            stat: true,
            color: 'info',
            icon: 'mdi-account-check'
          }
        } else {
          this.snackbar = {
            msg: 'Something Whent Wrong!',
            stat: true,
            color: 'danger',
            icon: 'mdi-bell-plus'
          }
        }
      })
    },

    reset () {
      this.$refs.form.reset()
    },

    getItemsCat (data) {
      // get filtered Item acording to category
      api.getItemCat(data).then(res => {
        this.products = res // get filtered Item acording to category
      })
    },

    getCategory (id) {
      // get category
      api.getCategory(id).then(res => {
        if (res) {
          this.getCat = res
        }
      })
    },
    getChange (select) {
      if (select.length > 0) {
        var catsearch = []
        var parents = select[select.length - 1]._id // parent id to search
        select.forEach(el => {
          catsearch.push({ _id: el._id, category: el.category }) // create array without parentId to search
        })
        this.getItemsCat(catsearch) // get filter category
        this.getCategory(parents) // get child category
      } else {
        this.searchCat = []
        this.getItems() // get Item if category if category filed is empty
        this.getCategory('parents') // get parent category
      }
    },
    remove (item) {
      // remove category from filed box
      this.filter = this.filter.slice(0, this.filter.indexOf(item))
      this.getChange(this.filter)
    },

    returnSale () {
      var id = this.order._id
      salesApi.returnSale(id).then(res => {
        if (res) {
          this.getCustomers()
          this.clearVars()
          this.selectedCustomer = undefined
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
<style>
.font-text-bold {
  font-weight: 700 !important;
}
.text-center {
  text-align: center;
}
h4 {
  padding-left: inherit;
}
.divided {
  margin-bottom: 15px !important;
  border-color: black !important;
}
.font-wazn {
  font-size: 36px;
}
.custom-center {
  align-self: center !important;
  padding-bottom: 23px !important;
}
.subheadingE {
  color: blue;
  padding: 4px;
}
.autoPad {
  padding: 5px 10px;
}
.point {
  cursor: pointer;
}
.bordercustome {
  border-radius: 25px;
  margin-bottom: 30px;
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
