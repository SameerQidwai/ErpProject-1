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
                    <span>Add item</span>
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
                  <v-icon>mdi-plus</v-icon>Add Customer
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
                        :class="{ 'success--text': item.amount>0, 'error--text': item.amount<0 }"
                        class="text-xs-right"
                      >{{ Math.abs(item.amount) }}</td>
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
                    <span>Payment In</span>
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
                  <span>Total Payment: </span>
                  <span class="info--text">Rs {{ objItem.debit }}</span>
                  <v-divider vertical />
                  <span>Total Purchased: </span>
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
                          <td>{{ new Date(item.date).toDateString() }}</td>
                          <td>{{ item.totalQty }}</td>
                          <td>{{ item.totalPrice }}</td>
                          <td>{{ item.debit }}</td>
                          <td>{{ item.discount }}</td>
                          <td>{{ item.balance }}</td>
                          <td>
                            <v-tooltip top>
                              <template v-slot:activator="{ on }">
                                <span>
                                  <v-icon
                                    v-on="on"
                                    @click="salesRecipt(item,true)">mdi-dots-vertical</v-icon>
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

    <!--Customer Model-->
    <v-dialog
      v-model="addDialog"
      width="600">
      <v-card>
        <v-form
          ref="form"
          v-model="addvalid">
          <v-container>
            <v-card-title class="headline">{{ dialogHeadline }}</v-card-title>
            <v-layout wrap>
              <v-flex>
                <v-text-field
                  v-model="custObj.name"
                  :rules="reqRules"
                  label="Customer Name"
                  clearable
                />
              </v-flex>
              <v-flex>
                <v-text-field
                  v-model="custObj.phone"
                  :rules="reqRules"
                  label="Phone#"
                  hint="Phone# starts with +92"
                  clearable
                  persistent-hint
                />
              </v-flex>
              <v-flex>
                <v-text-field
                  v-model="custObj.email"
                  label="E-mail"
                  clearable />
              </v-flex>
              <v-flex>
                <v-text-field
                  v-model="custObj.address"
                  :counter="100"
                  label="Address"
                  max="100"
                  clearable
                />
              </v-flex>
            </v-layout>
            <v-spacer />
            <v-layout>
              <v-flex text-xs-right>
                <v-btn
                  v-if="!edit"
                  :disabled="!addvalid"
                  color="success"
                  @click="addCustomer()">Add</v-btn>
                <v-btn
                  v-else
                  :disabled="!addvalid"
                  color="success"
                  @click="editCustomer()">Edit</v-btn>
                <v-btn
                  v-if="!edit"
                  color="error"
                  @click="reset()">Reset Form</v-btn>
              </v-flex>
            </v-layout>
          </v-container>
        </v-form>
      </v-card>
    </v-dialog>
    <!--End Customer Model-->

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
                  v-model="pay.cust"
                  :items="Customers"
                  :rules="reqRules"
                  label="Customer"
                  item-text="name"
                  item-value="_id"
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
                  v-model.number="pay.debit"
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
              @click="payCustomer()">pay</v-btn>
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
import api from "../../services/items-api";
import custApi from "../../services/cust-api";
import salesApi from "../../services/sales-api";
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
      custObj: {},

      search: undefined,
      item_headers: [
        { text: "Name", value: "name" },
        { text: "Amount", value: "amount", align: "right" }
      ],
      detail_headers: [
        { sortable: false, text: "id" },
        { sortable: false, text: "Date", value: "date" },
        { sortable: false, text: "Items Qty", value: "totalQty" },
        { sortable: false, text: "Total", value: "totalPrice" },
        { sortable: false, text: "Debit", value: "debit" },
        { sortable: false, text: "Discount", value: "discount" },
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
      Customers: [],
      payDialog: false,
      orderMenu: false,
      salesHeader: [
        { sortable: false, text: "Name", value: "name" },
        { sortable: false, text: "Description", value: "decs" },
        { sortable: false, text: "Qty", value: "quantity", align: "center" },
        { sortable: false, text: "Unit", value: "unit", align: "center" },
        { sortable: false, text: "Price", value: "Price", align: "center" },
        { sortable: false, text: "Total", value: "subTotal", align: "center" },
        { sortable: false, text: "....", value: "action", align: "center" }
      ],
      /**Sale Recipt variable */
      saleRecpt: {},
      delDialog: false,
      salesDialog: false
    };
  },
  created() {
    /**Item Stock */
    this.getCustomer();
    this.getPermissions();
  },
  computed: {
    balance() {
      // for pament dialog use balance
      return this.order.totalAmount - this.order.advance - this.pay.advance;
    }
  },
  methods: {
    /**page */
    getCOAheads() {
      coaApi.getCoa().then(resp => {
        this.coaHeads = resp;
      });
    },

    getAllcust() {
      salesApi.getCustomer().then(res => {
        this.Customers = res;
      });
    },

    blurBox() {
      if (!this.search) {
        this.searcbox = false;
      }
    },
    showItem(item) {
      this.objItem = item;
      custApi.customerDetail(item._id).then(res => {
        if (res) {
          this.detailed = res;
        }
      });
    },

    getCustomer() {
      custApi.getCustomer().then(res => {
        if (res.length>0) {
          this.custArray = res;
          console.log(res);
          this.showItem(this.custArray[0]);
        }
      });
    },

    /*END PURCHASE RECIPT FUNCTIONS */

    /* SALES RECIPT FUNCTIONS */
    salesRecipt(item, status) {
      this.saveStatus = status;
      salesApi.getRecipt(item._id, status).then(res => {
        if (res) {
          this.salesDialog = true;
          this.saleRecpt = res;
          console.log(res);
        }
      });
    },
    deleteSale(item) {
      salesApi.deleteSale(item._id).then(res => {
        if (res) {
          this.change(this.filter);
          this.delDialog = false;
          this.salesDialog = false;
        }
      });
    },
    returnItem(item, _id, status) {
      var data = { rId: _id, itemId: item._id, status: status };
      salesApi.returnItem(data).then(res => {
        if (res) {
          this.change(this.filter);
          this.salesRecipt(this.saleRecpt, status);
        }
      });
    },
    /* SALES RECIPT FUNCTIONS */
    /* Add customer */
    showAdd() {
      this.addDialog = true;
      this.custObj = {};
      this.edit = false;
      this.dialogHeadline = "Add Customer";
    },

    showEdit(item) {
      this.custObj = {
        name: item.name,
        phone: item.phoneNo,
        email: item.email,
        address: item.address,
        _id: item._id
      };
      this.addDialog = true;
      this.edit = true;
      this.dialogHeadline = "Edit Customer";
    },
    showPay(item) {
      this.getCOAheads();
      this.getAllcust();
      this.payDialog = true;
    },
    editCustomer() {
      custApi.editCustomer(this.custObj).then(res => {
        if (res) {
          this.addDialog = false;
          this.getCustomer();
        }
      });
    },

    addCustomer() {
      custApi.addCustomer(this.custObj).then(res => {
        if (res === true) {
          this.$refs.form.reset();
          this.snackbar = {
            msg: "Customer Added Successfully!",
            stat: true,
            color: "success",
            icon: "mdi-account-convert"
          };
        } else if (res.name) {
          this.snackbar = {
            msg: "Customer is Already Added!",
            stat: true,
            color: "info",
            icon: "mdi-account-check"
          };
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
    payCustomer() {
      custApi.payCustomer(this.pay).then(res => {
        if (res) {
          this.getCustomer();
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