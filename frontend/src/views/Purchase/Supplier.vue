<template>
  <v-container
    fluid
    grid-list-xl
    class="mWidth">
    <v-layout>
      <v-flex
        md3
        shrink
        pa-1
        class="parFlex">
        <!-- color="#b9f6ca" -->
        <v-card class="card-1">
          <v-card-actions>
            <v-layout>
              <v-flex v-show="!searcbox">
                <v-icon @click="searcbox=!searcbox">mdi-magnify</v-icon>
              </v-flex>
              <v-flex
                v-show="searcbox"
                md12>
                <v-text-field
                  v-model="search"
                  autofocus
                  solo
                  prepend-inner-icon="mdi-magnify"
                  clearable
                  @blur="blurBox()"
                  @click:clear="searcbox=false"
                >
                  <v-tooltip
                    slot="append-outer"
                    top>
                    <template v-slot:activator="{ on }">
                      <v-icon
                        slot="activator"
                        color="success"
                        v-on="on"
                        @click="showAdd();searcbox=!searcbox;search=undefined"
                      >mdi-plus-outline</v-icon>
                    </template>
                    <span>Add Supplier</span>
                  </v-tooltip>
                </v-text-field>
              </v-flex>
              <v-spacer />
              <v-flex
                v-show="!searcbox"
                text-xs-right>
                <v-btn
                  small
                  color="success"
                  @click="showAdd()">
                  <v-icon>mdi-plus</v-icon>Add Supplier
                </v-btn>
              </v-flex>
            </v-layout>
          </v-card-actions>
          <v-responsive class="Stable">
            <v-layout>
              <v-flex>
                <v-data-table
                  :headers="item_headers"
                  :items="custArray"
                  :search="search"
                  hide-actions
                >
                  <template
                    slot="headerCell"
                    slot-scope="{ header }">
                    <span
                      class="success--text"
                      v-text="header.text" />
                  </template>
                  <template
                    slot="items"
                    slot-scope="{ index, item }">
                    <tr @click="showItem(item)">
                      <td class="text-xs-left text-capitalize">{{ item.name }}</td>
                      <td
                        :class="{ 'success--text': item.amount<0, 'error--text': item.amount>0 }"
                        class="text-xs-right"
                      >{{ Math.abs(Math.round(item.amount)) }}</td>
                    </tr>
                  </template>
                </v-data-table>
              </v-flex>
            </v-layout>
          </v-responsive>
        </v-card>
      </v-flex>

      <v-flex
        md9
        shrink
        pa-1
        class="parFlex">
        <v-flex
          md12
          class="flex1">
          <!-- color="#ffe57f" -->
          <v-card class="card-2">
            <v-container
              fluid
              grid-list-xl
              style="padding: 10px"
              class="body-2">
              <v-layout wrap>
                <v-flex>
                  <span
                    class="headline text-capitalize"
                    v-text="objItem.name" />
                </v-flex>
                <v-flex text-xs-right>
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-btn
                        fab
                        dark
                        small
                        icon
                        color="success"
                        style="margin:0px 2px"
                        v-on="on"
                        @click="showPay(objItem)"
                      >
                        <v-icon>mdi-account-cash</v-icon>
                      </v-btn>
                    </template>
                    <span>Payment Out</span>
                  </v-tooltip>
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-btn
                        fab
                        dark
                        small
                        icon
                        color="info"
                        style="margin:0px 2px"
                        v-on="on"
                        @click="showEdit(objItem)"
                      >
                        <v-icon>mdi-pencil</v-icon>
                      </v-btn>
                    </template>
                    <span>Edit</span>
                  </v-tooltip>
                </v-flex>
              </v-layout>
              <v-layout wrap>
                <v-flex>
                  <span>Phone:</span>
                  <span class="info--text">{{ objItem.phoneNo }}</span>
                </v-flex>
                <v-spacer />
                <v-flex text-xs-right>
                  <span>Address:</span>
                  <span
                    class="info--text"
                    v-text="objItem.address" />
                </v-flex>
              </v-layout>
              <v-layout wrap>
                <v-flex>
                  <span>Email:</span>
                  <span class="info--text">{{ objItem.email }}</span>
                </v-flex>
                <v-spacer />
                <v-flex text-xs-right>
                  <span>Total Purchased:</span>
                  <span class="info--text">Rs {{ objItem.debit }}</span>
                  <v-divider vertical />
                  <span>Total Payment:</span>
                  <span class="info--text">Rs {{ objItem.credit }}</span>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card>
        </v-flex>
        <v-flex
          md12
          class="flex2">
          <v-card class="card-3">
            <v-container
              fluid
              grid-list-xl
              style="padding: 10px">
              <v-layout wrap>
                <v-flex>
                  <span
                    class="headline"
                    v-text="'Transaction'" />
                </v-flex>
                <v-flex md3>
                  <v-text-field
                    v-model="search2"
                    solo
                    prepend-inner-icon="mdi-magnify"
                    hide-details
                  />
                </v-flex>
              </v-layout>
              <v-responsive class="Ttable">
                <v-layout wrap>
                  <v-flex>
                    <v-data-table
                      :headers="detail_headers"
                      :items="detailed"
                      :search="search2"
                      hide-actions
                    >
                      <template
                        slot="headerCell"
                        slot-scope="{ header }">
                        <span
                          class="warning--text"
                          v-text="header.text" />
                      </template>
                      <template
                        slot="items"
                        slot-scope="{ index, item }">
                        <tr>
                          <td>{{ item._id.substr(18) }}</td>
                          <td>{{ new Date(item.orderDate).toDateString() }}</td>
                          <td>{{ new Date(item.dueDate).toDateString() }}</td>
                          <td>{{ item.totalQty }}</td>
                          <td>{{ item.totalPrice }}</td>
                          <td>{{ item.credit || 0 }}</td>
                          <td>{{ item.balance || item.totalPrice }}</td>
                          <td>
                            <v-tooltip top>
                              <template v-slot:activator="{ on }">
                                <span>
                                  <v-icon
                                    v-on="on"
                                    @click="showRecipt(item,true)">mdi-dots-vertical</v-icon>
                                </span>
                              </template>
                              <span>Sale Recipt</span>
                            </v-tooltip>
                          </td>
                        </tr>
                      </template>
                    </v-data-table>
                  </v-flex>
                </v-layout>
              </v-responsive>
            </v-container>
          </v-card>
        </v-flex>
      </v-flex>
    </v-layout>

    <v-dialog
      v-model="supplierDialog"
      persistent
      max-width="600">
      <v-card>
        <v-card-title class="headline">{{ dialogHeadline }}</v-card-title>
        <v-form
          ref="addform"
          v-model="addvalid">
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex md6>
                <v-text-field
                  v-model="supObj.name"
                  :rules="reqRules"
                  label="Name"
                  hint="i.e: xyz-123"
                />
              </v-flex>
              <v-flex md6>
                <v-text-field
                  v-model="supObj.email"
                  :rules="reqRules"
                  label="Email" />
              </v-flex>
              <v-flex md6>
                <v-text-field
                  v-model="supObj.phone"
                  :rules="reqRules"
                  label="Phone" />
              </v-flex>
              <v-flex md12>
                <v-text-field
                  v-model="supObj.address"
                  :rules="reqRules"
                  label="Address" />
              </v-flex>
              <v-flex md12>
                <v-textarea
                  v-model="supObj.about"
                  label="About" />
              </v-flex>
            </v-layout>
          </v-container>
        </v-form>
        <v-card-actions>
          <v-spacer />
          <v-btn
            v-show="!edit"
            :disabled="!addvalid"
            color="green darken-1"
            @click="addSupplier()"
          >Save</v-btn>
          <v-btn
            v-show="edit"
            :disabled="!addvalid"
            color="green darken-1"
            @click="updateSupplier()"
          >Edit</v-btn>
          <v-btn
            color="orange"
            @click="supplierDialog = false">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!--Customer Model-->

    <!--End Customer Model-->
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
                  @click="editOrder(orderRecpt._id)"
                >mdi-file-document-edit</v-icon>
              </span>
              <span class="icons-model">
                <v-icon
                  :disabled="(orderRecpt.totalAmount - orderRecpt.advance)<=0 && orderRecpt.delivered"
                  large
                  color="purple"
                  @click="orderPayDialog=!orderPayDialog"
                >mdi-account-cash</v-icon>
              </span>
              <span class="icons-model">
                <v-icon
                  large
                  color="error"
                  @click="delDialog= true">mdi-delete</v-icon>
              </span>
            </v-flex>
            <v-flex
              text-xs-center
              xs8>
              <span
                class="display-1"
                v-text="'Purchase Receipt'" />
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
              sm12>
              <span
                class="title"
                v-text="`Order No: ${orderRecpt.orderNo}`" />
            </v-flex>
            <v-flex
              lg4
              md4
              sm12>
              <span
                class="title"
                v-text="`Supplier: ${orderRecpt.supplierName}`" />
            </v-flex>
          </v-layout>
          <v-layout row>
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
              sm12>
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
                <td>{{ item.decs }}</td>
                <td class="text-xs-center">{{ item.pQty }}</td>
                <td class="text-xs-center">{{ item.selectUnit.unit }}/{{ item.selectUnit.qty }}</td>
                <td class="text-xs-center">{{ item.pCost }}</td>
                <td class="text-xs-center">{{ item.total }}</td>
              </tr>
            </template>
            <template v-slot:footer>
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
      v-model="orderPayDialog"
      width="50%">
      <v-card>
        <v-container>
          <v-layout wrap>
            <v-flex md6>
              <span class="headline">Total Price: {{ orderRecpt.totalPrice }}</span>
            </v-flex>
            <v-flex md4>
              <v-text-field
                v-model.number="orderPay.advance"
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
                v-model="orderPay.delivered"
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
          <span v-text="'Warning'" />
        </v-card-title>
        <v-card-text class="text-xs-center">
          <kbd style="background:red">This order Will be deleted permanenly!!</kbd>
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
    <!-- END SALE RECIPT DIALOGS-->
    <!--Customer Payment-->
    <v-dialog
      v-model="payDialog"
      width="600">
      <v-card>
        <v-form
          ref="payform"
          v-model="payvalid">
          <v-card-title>
            <div>
              <span class="headline">Payment</span>
            </div>
          </v-card-title>
          <v-divider />
          <v-card-text>
            <v-layout justify-space-around>
              <v-flex xs5>
                <v-autocomplete
                  v-model="pay.sup"
                  :items="getsupp"
                  :rules="reqRules"
                  label="Supplier"
                  item-text="name"
                  return-object
                  outline
                  clearable
                  prepend-inner-icon="mdi-account"
                  dense
                />
              </v-flex>
              <v-spacer />
              <v-flex xs4>
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
                      v-model="pay.date"
                      :rules="reqRules"
                      label="Date"
                      readonly
                      clearable
                      append-icon="mdi-calendar"
                      v-on="on"
                    />
                  </template>
                  <v-date-picker
                    v-model="pay.date"
                    type="date"
                    dark
                    no-title
                    @input="orderMenu = false"
                  />
                </v-menu>
              </v-flex>
            </v-layout>
            <v-layout justify-space-around>
              <v-flex xs5>
                <v-autocomplete
                  v-model="pay.headAcct"
                  :items="coaHeads"
                  :rules="reqRules"
                  item-text="name"
                  return-object
                  label="Select Head"
                  clearable
                  outline
                />
              </v-flex>
              <v-spacer />
              <v-flex xs4>
                <v-text-field
                  v-model.number="pay.credit"
                  :rules="reqRules"
                  type="number"
                  label="Paid"
                />
              </v-flex>
            </v-layout>
          </v-card-text>
          <v-divider />
          <v-card-actions>
            <v-spacer />
            <v-btn
              :disabled="!payvalid"
              color="black"
              small
              @click="paySupplier()">pay</v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>
    <!--End Customer Payment-->

    <v-snackbar
      v-model="snackbar.stat"
      :color="snackbar.color">
      <v-icon>{{ snackbar.icon }}</v-icon>
      <kbd>{{ snackbar.msg }}</kbd>
      <v-icon @click="snackbar.stat=false">mdi-close-circle</v-icon>
    </v-snackbar>
  </v-container>
</template>

<script>
/* eslint-disable */
import api from "../../services/api";
import custApi from "../../services/cust-api";
import orderApi from "../../services/order-api";
import coaApi from "../../services/coa-api";

export default {
  data() {
    return {
      custArray: [], // getItem array
      searcbox: false,
      snackbar: false,
      dialogHeadline: null, // // headline in show Item
      detailed: [],
      objItem: {},

      search: undefined,
      item_headers: [
        { text: "Name", value: "name" },
        { text: "Amount", value: "amount", align: "right" }
      ],
      detail_headers: [
        { sortable: false, text: "id" },
        { sortable: false, text: "order Date", value: "date" },
        { sortable: false, text: "due Date", value: "date" },
        { sortable: false, text: "Items Qty", value: "totalQty" },
        { sortable: false, text: "Total", value: "totalPrice" },
        { sortable: false, text: "Credit", value: "debit" },
        { sortable: false, text: "Balance", value: "balance" },
        { sortable: false, text: "...", align: "left", width: "1px" }
      ],
      addvalid: true,
      payvalid: true,
      reqRules: [v => !!v || " required"],

      showFil: false,

      /* Purchase Recipt Vartable */
      /** */

      pay: {
        date: new Date().toISOString().substr(0, 10)
      },
      /**Purcashe Recipt Variable */
      search2: undefined,
      addDialog: false,
      edit: false,
      order: {},
      coaHeads: [],
      getsupp: [],
      payDialog: false,
      orderMenu: false,
      orderHeader: [
        { sortable: false, text: "Name", value: "name" },
        { sortable: false, text: "Description", value: "decs" },
        { sortable: false, text: "Qty", value: "quantity", align: "center" },
        { sortable: false, text: "Unit", value: "unit" },
        { sortable: false, text: "Price", value: "Price", align: "center" },
        { sortable: false, text: "Total", value: "subTotal", align: "center" }
        // { sortable: false, text: "....", value: "action", align: "center" }
      ],
      /**Sale Recipt variable */
      orderRecpt: {},
      delDialog: false,
      orderDialog: false,

      supObj: {},
      supplierDialog: false,

      orderPay: {
        advance:0,
        delivered: false
      },
      orderPayDialog: false,
      paidAcct:{},
    };
  },
  created() {
    /**Item Stock */
    this.getSupplierAcct();
    this.getPermissions();
  },
  computed: {
    balance() {
      // for pament dialog use balance
      return this.orderRecpt.totalPrice - this.orderRecpt.advance - this.orderPay.advance;
    }
  },
  methods: {
    /**page */
    getCOAheads() {
      coaApi.getCoa().then(resp => {
        if(resp){
          this.coaHeads = resp;
        }
      });
    },

    getSupplier() {
      api.getsup().then(res => {
        if(res){
         this.getsupp = res;
        }
      });
    },

    blurBox() {
      if (!this.search) {
        this.searcbox = false;
      }
    },
    showItem(item) {
      this.objItem = item;
      api.supplierDetail(item._id).then(res => {
        if (res) {
          this.detailed = res;
        }
      });
    },

    getSupplierAcct() {
      api.getSupplierAcct().then(res => {
        if (res.length>0) {
          this.custArray = res;
          this.showItem(this.custArray[0]);
        }
      });
    },

    /*END PURCHASE RECIPT FUNCTIONS */

    /* SALES RECIPT FUNCTIONS */
    showRecipt(item) {
      orderApi.getRecipt(item._id).then(res => {
        if (res) {
          this.orderDialog = true;
          this.orderRecpt = res;
          this.orderPay["delivered"] = this.orderRecpt["delivered"];
          this.getCOAheads();
        }
      });
      coaApi.findAccount(item._id).then(res => {
        if (res) {
          this.paidAcct = res;
        }
      });
    },
    editOrder(id) {
      this.$router.push({
        path: "/purchase-order",
        query: { id, route: true }
      });
    },

    deleteOrder(item) {
      orderApi.deleteOrder(item._id).then(res => {
        if (res) {
          this.change(this.filter);
          this.delDialog = false;
          this.orderDialog = false;
        }
      });
    },

    returnItem(item, _id, status) {
      var data = { rId: _id, itemId: item._id, status: status };
      salesApi.returnItem(data).then(res => {
        if (res) {
          this.change(this.filter);
          this.showRecipt(this.orderRecpt);
        }
      });
    },
     payment (item) {
      this.orderPay.id = item._id
      this.orderPay.acct = this.paidAcct
      this.orderPay.date = new Date()
      this.orderPay.supplierName = this.orderRecpt.supplierName
      this.orderPay.supplierId = this.orderRecpt.supplierId
      this.orderPay.total = this.orderRecpt.totalPrice
      orderApi.payment(this.orderPay).then(res => {
        if (res) {
        /** for render data and not referesh the whole data */
          this.orderPayDialog =false;
          orderApi.getRecipt(item._id).then(res => {
            if (res) {
              item = res
              this.orderRecpt = res
              this.orderPay.advance=0
            }
          })
          /** */
          this.payModel = false
        }
      })
    },
    /* SALES RECIPT FUNCTIONS */
    /* Add customer */
    showAdd() {
      this.supplierDialog = true;
      this.supObj = {};
      this.edit = false;
      this.dialogHeadline = "Add Supplier";
    },

    showEdit(item) {
      this.supObj = {
        name: item.name,
        phone: item.phoneNo,
        email: item.email,
        address: item.address,
        about: item.about,
        _id: item._id
      };
      this.supplierDialog = true;
      this.edit = true;
      this.dialogHeadline = "Edit Supplier";
    },

    showPay(item) {
      this.getSupplier();
      this.getCOAheads();
      this.payDialog = true;
    },

    updateSupplier() {
      api.updateSupplier(this.supObj).then(res => {
        if (res) {
          this.supplierDialog = false;
          this.getSupplierAcct();
        }
      });
    },

    addSupplier() {
      api.addSupplier(this.supObj).then(res => {
        if (res === true) {
          this.snackbar = {
            msg: "Supplier Added Successfully!",
            stat: true,
            color: "success",
            icon: "mdi-account-convert"
          };
          this.getSupplier();
          this.supplierDialog = false;
        } else if (res.name) {
          this.snackbar = {
            msg: "Supplier is Already Added!",
            stat: true,
            color: "info",
            icon: "mdi-account-check"
          };
          this.getSupplier();
          this.supplierDialog = false;
        } else {
          this.snackbar = {
            msg: "Something Whent Wrong!",
            stat: true,
            color: "danger",
            icon: "mdi-bell-plus"
          };
        }
      });
    },
    

    paySupplier() {
      api.paySupplier(this.pay).then(res => {
        if (res) {
          this.getSupplierAcct();
        }
      });
    },
    reset() {
      this.$refs.form.reset();
    },
    /* End Add customer */
    getPermissions() {
      let admin = localStorage.getItem("admin");
      if (admin) {
        this.permissions = { add: true, edit: true, delete: true };
        return;
      }
      let permissions = JSON.parse(localStorage.getItem("permissions"));
      let name = this.$router.currentRoute.name;
      this.permissions = permissions.find(x => x.name === name);
      console.log(this.permissions);
    }
  }
};
</script>

<style>
.v-btn.addItem {
  border-radius: 20px !important;
  padding: 8px 6px !important;
}

.subheadingE {
  color: blue;
  padding: 4px;
}
.v-card__title.tool {
  padding: 0 !important;
  background: #dbefdc;
}
.mWidth {
  padding: 5px 24px;
}
#core-view {
  padding-bottom: 0px !important;
}
.parFlex {
  height: -webkit-fill-available;
  padding: 5px;
}
.flex1 {
  height: -webkit-fill-available;
  padding: 0px 0px 5px 0px !important;
}
.flex2 {
  height: -webkit-fill-available;
  padding: 5px 0px 0px 0px !important;
}
.card-3 {
  min-height: 440px;
  /* max-height:440px */
}
.card-1 {
  min-height: 600px;
  /* max-height:600px */
}
.card-2 {
  min-height: 150px;
  max-height: 150px;
}
.Ttabel {
  /**to make transaction table scrollable */
}
.Stable {
  /* To make stock table scrollable */
}
/* Order Dialog css */
@media only screen and (max-width: 768px) {
  .display-1 {
    font-size: 24px !important;
  }
  .icons-model .v-icon {
    padding: 0px 2px;
    /* font-size: 26px !important; */
    font-size: 1.71rem !important;
  }
  .v-card .title {
    font-size: 1rem !important;
  }
}
@media only screen and (max-width: 425px) {
  .v-card .title {
    font-size: 0.6rem !important;
  }
}
.icons-model {
  padding: 0px 5px;
}
table.v-table tfoot tr td {
  padding: 0 8px;
  font-weight: 800;
}
/**End order Dialog css */
</style>