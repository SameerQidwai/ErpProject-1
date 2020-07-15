<template>
  <v-container
    fluid
    grid-list-xl
    class="mWidth">
    <v-layout>
      <v-flex
        md3
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
                    <span>Add Category</span>
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
                  <v-icon>mdi-plus</v-icon>Add Category
                </v-btn>
              </v-flex>
            </v-layout>
          </v-card-actions>
          <v-responsive class="Stable">
            <v-layout>
              <v-flex>
                <v-data-table
                  :headers="item_headers"
                  :items="product"
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
                      <td class="text-xs-left">{{ item.name }}</td>
                      <td class="text-xs-right">{{ item.qty }}</td>
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
                    class="headline"
                    v-text="objItem.name" />
                </v-flex>
                <v-flex text-xs-right>
                  <v-btn
                    fab
                    dark
                    small
                    icon
                    color="info"
                    style="margin:0px 2px"
                    @click="showEdit(objItem)"
                  >
                    <v-icon>mdi-pencil</v-icon>
                  </v-btn>
                </v-flex>
              </v-layout>
              <v-layout wrap>
                <v-flex>
                  <span>PRICE:</span>
                  <span class="info--text">Rs {{ objItem.sPrice }}</span>
                </v-flex>
                <v-spacer />
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
                <v-flex md1>
                  <span
                    class="headline"
                    v-text="'Report'" />
                </v-flex>
                <v-flex md3>
                  <v-text-field
                    v-model="search2"
                    solo
                    prepend-inner-icon="mdi-magnify"
                    hide-details
                  />
                </v-flex>
                <v-spacer />
                <v-flex
                  xs2
                  text-xs-right>
                  <v-btn
                    small
                    class="info"
                    @click="exDialog=true">
                    <v-icon>mdi-plus</v-icon>Add Expense
                  </v-btn>
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
                          <td>{{ item.status }}</td>
                          <td>{{ item.party }}</td>
                          <td>{{ new Date(item.date).toDateString() }}</td>
                          <td>{{ item.item.itemQty }}</td>
                          <td>{{ item.item.itemUnit.unit }}/{{ item.item.itemUnit.qty }}</td>
                          <td>{{ item.item.itemCost }}</td>
                          <td>{{ item.totalAmount }}</td>
                          <td>
                            <v-tooltip top>
                              <template v-slot:activator="{ on }">
                                <span v-if="item.status=='Sale'">
                                  <v-icon
                                    v-on="on"
                                    @click="salesRecipt(item)">mdi-dots-vertical</v-icon>
                                </span>
                                <span v-else>
                                  <v-icon
                                    v-on="on"
                                    @click="orderRecipt(item)">mdi-dots-vertical</v-icon>
                                </span>
                              </template>
                              <span v-if="item.status=='Sale'">Sale Recipt</span>
                              <span v-else>Order Recipt</span>
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

    <!--Add NEW UNIT-->

    <!-- PURCHASE RECIPT DIALOGS -->
    <v-dialog
      v-model="payModel"
      width="50%">
      <v-card>
        <v-container>
          <v-layout wrap>
            <v-flex md6>
              <span class="headline">Total Price:</span>
            </v-flex>
            <v-flex md4>
              <v-text-field
                v-model.number="pay.advance"
                :height="6"
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
                v-text="`Delivered:` " />
            </v-flex>
            <v-flex md1>
              <v-switch
                v-model="pay.delivered"
                :disabled="pay.delivered" />
            </v-flex>
            <v-spacer />
            <v-flex md3>
              <v-btn
                color="black"
                @click="payment()">Payment</v-btn>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card>
    </v-dialog>

    <!-- END PURCAHSE RECIPT DIALOGS-->
    <v-dialog
      v-model="addDialog"
      width="400px"
      persistent
      no-click-animation>
      <v-form
        ref="addCat"
        v-model="addCat">
        <v-card>
          <v-container pa-0>
            <v-layout style="background:#dbefdc">
              <v-flex
                md11
                pt-2
                pl-3>
                <span
                  class="headline"
                  v-text="`${dialogHeadline} Expense Category`" />
              </v-flex>
              <v-flex
                text-xs-right
                pt-2
                pr-3>
                <v-icon
                  color="black"
                  @click="addDialog=false">mdi-close</v-icon>
              </v-flex>
            </v-layout>
            <v-layout
              pt-4
              px-3
              justify-space-around
              justify-center>
              <v-flex xs9>
                <v-text-field
                  v-model="catName"
                  :rules="reqRules"
                  outline
                  clearable
                  label="ENTER EXPENSE CATEGORY NAME"
                />
              </v-flex>
            </v-layout>
          </v-container>
          <v-divider dark />
          <v-card-actions>
            <v-spacer />
            <v-btn
              v-if="!editDialog"
              :disabled="!addCat"
              class="addItem"
              color="success"
              @click="Add(catName)"
            >Save</v-btn>
            <v-btn
              v-else
              :disabled="!addCat"
              class="addItem"
              color="blue"
              @click="Edit(catName)"
            >Edit</v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>

    <v-dialog
      v-model="exDialog"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
      persistent
    >
      <v-card>
        <v-card-title class="tool">
          <v-layout wrap>
            <v-flex
              offset-md1
              class="display-1">
              <span>Expense</span>
            </v-flex>
          </v-layout>
          <v-spacer />
          <v-btn
            fab
            small
            round
            color="default darken-2"
            @click="exDialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <!-- samoe to push -->
        <v-container grid-list-md>
          <v-layout wrap>
            <v-flex md4>
              <v-autocomplete
                :rules="reqRules"
                clearable
                item-text="name"
                item-value="_id"
                return-object
                label="Select Category"
                prepend-inner-icon="mdi-select"
                dense
              >
                <template slot="prepend-item">
                  <v-container
                    color="success"
                    pa-1
                    @click="addDialog=!addDialog">
                    <v-layout
                      row
                      class="body-2">
                      <v-flex class="point">
                        <v-icon color="#44f">mdi-18px mdi-plus-circle-outline</v-icon>
                        <span class="subheadingE">Add Expense Category</span>
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
                    :rules="reqRules"
                    label="Order Date"
                    readonly
                    append-icon="mdi-calendar"
                    v-on="on"
                  />
                </template>
                <v-date-picker
                  type="date"
                  dark
                  no-title />
              </v-menu>
            </v-flex>
          </v-layout>
          <v-data-table
            :headers="exHeader"
            :items="exItems"
            hide-actions
            no-data-text>
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
              <tr
                v-if="!item.edit"
                @click="clickCount+=1;clickEdit(index,clickCount)">
                <td>{{ item.name }}</td>
                <td>{{ item.qty }}</td>
                <td>
                  <span>{{ item.price }}</span>
                </td>
                <td>{{ item.qty*item.price }}</td>
                <td>
                  <v-icon
                    color="info"
                    large
                    @click="editFunc(index)">mdi-pencil-circle</v-icon>
                  <v-icon
                    color="red"
                    large
                    @click="deleteFunc(index)">mdi-delete-circle</v-icon>
                </td>
              </tr>
              <tr
                v-else
                @keypress.enter="item.edit=false">
                <td>
                  <v-text-field
                    v-model="item.name"
                    solo />
                </td>
                <td>
                  <v-text-field
                    v-model.number="item.qty"
                    type="number"
                    solo />
                </td>
                <td>
                  <v-text-field
                    v-model.number="item.price"
                    type="number"
                    solo />
                </td>
                <td>
                  <v-text-field
                    v-model.number="amount"
                    :placeholder="(amount=item.qty*item.price).toString()"
                    type="number"
                    disabled
                    solo
                  />
                </td>
                <td>
                  <v-icon
                    color="info"
                    large
                    @click="item.edit=false">mdi-pencil-circle</v-icon>
                  <v-icon
                    color="red"
                    large
                    @click="deleteFunc(index)">mdi-delete-circle</v-icon>
                </td>
              </tr>
            </template>
            <template
              v-slot:footer
              v-if="zeest">
              <tr
                class="font-weight-light"
                @keypress.enter="pushFunc(exItem)">
                <td>
                  <v-text-field
                    v-model="exItem.name"
                    solo />
                </td>
                <td>
                  <v-text-field
                    v-model.number="exItem.qty"
                    type="number"
                    solo />
                </td>
                <td>
                  <v-text-field
                    v-model.number="exItem.price"
                    type="number"
                    solo />
                </td>
                <td>
                  <v-text-field
                    v-model.number="amount"
                    :placeholder="(amount=exItem.qty*exItem.price).toString()"
                    type="number"
                    disabled
                    solo
                  />
                </td>
              </tr>
              <tr>
                <td class="text-xs-right">Total</td>
                <td class="text-xs-right">{{ totalQty }}</td>
                <td/>
                <td class="text-xs-right">{{ totalAmount }}</td>
              </tr>
            </template>
            <template v-slot:no-data>
              <tr @keypress.enter="pushFunc(exItem)">
                <td>
                  <v-text-field
                    v-model="exItem.name"
                    solo />
                </td>
                <td>
                  <v-text-field
                    v-model.number="exItem.qty"
                    solo
                    type="Number" />
                </td>
                <td>
                  <v-text-field
                    v-model.number="exItem.price"
                    solo
                    type="Number" />
                </td>
                <td>
                  <v-text-field
                    v-model.number="amount"
                    :placeholder="(amount=exItem.qty*exItem.price).toString()"
                    disabled
                    solo
                  />
                </td>
              </tr>
            </template>
          </v-data-table>
        </v-container>
      </v-card>
    </v-dialog>

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
import orderApi from "../../services/order-api";
import saleApi from "../../services/sales-api";

export default {
  data() {
    return {
      addDialog: false,
      addCat: false,
      dialogHeadline: "Add",
      catName: undefined,
      editDialog: false,

      exDialog: false,
      exItem: {
        qty: 1,
        price: 0
      },
      totalQty: 0,
      zeest: false,
      exHeader: [
        { sortable: false, text: "Item", value: "date" },
        { sortable: false, text: "Qty", value: "qty", width: "15%" },
        { sortable: false, text: "Price", value: "price", width: "15%" },
        { sortable: false, text: "Amount", value: "amount", width: "15%" },
        { sortable: false, text: "...", align: "left" }
      ],
      exItems: [],
      amount: 0,

      product: [], // getItem array

      searcbox: false,
      snackbar: false,

      detailed: [],

      objItem: {},

      search: undefined,
      item_headers: [
        { text: "Category", value: "category" },
        { text: "Amount", value: "amount", align: "right" }
      ],
      detail_headers: [
        { sortable: false, text: "Date", value: "date" },
        { sortable: false, text: "Amount", value: "amount" },
        { sortable: false, text: "...", align: "left", width: "1px" }
      ],
      addvalid: true,
      reqRules: [v => !!v || " required"],

      /* Purchase Recipt Vartable */
      /** */
      delDialog: false,
      payModel: false,
      sold: [],
      pay: {
        advance: 0,
        delivered: false
      },
      /**Purcashe Recipt Variable */
      search2: undefined,
      /**Sale Recipt variable */
      balance: 0,
      stockValue: 0,
      clickSave:0,
      clickCount:0,
    };
  },
  created() {
    /**Item Stock */
  },
  computed: {
    totalAmount(){
      var amount = 0;
      var qty = 0
      this.exItems.forEach(el => {
        amount += (el.price*el.qty)
        qty += el.qty
      });
      this.totalQty = qty;
      return amount;
    }
  },
  methods: {
    blurBox() { // make disappear the search Box
      if (!this.search) {
        this.searcbox = false;
      }
    },
    showAdd() { //show add Category dialog
      this.dialogHeadline = "Add";
      this.editDialog = false;
      this.addDialog = true;
    },
    showEdit() { //edit add Category dialog
      this.dialogHeadline = "Edit";
      this.editDialog = true;
      this.addDialog = true;
    },
    pushFunc(item) { //add expense to a list
      var obj = Object.assign({}, item);
      obj.edit = false;
      this.exItem = { qty: 1, price: 0 }
      this.exItems.push(obj);
      this.zeest = true; //if foot should show or no-data extension template of table
    },
    clickEdit(index,count){ //edit expense in the list On double Click
      if (count === 2){
        if(index===this.clickSave){
          this.exItems.forEach((el,jndex) => {
          if (jndex === index) {
            el.edit = true
            this.clickCount = 0;
            return;
          }
          el.edit=false;

        });
        }else{
          this.clickSave = index;
          this.clickCount = 0;
        }
      }else{
        this.clickSave = index;
      }
    },
    editFunc(index){
      this.exItems.forEach((el,jndex) => {
          if (jndex === index) {
            el.edit = true
            this.clickCount = 0;
            return;
          }
          el.edit=false;

        });
    },
     deleteFunc (index) { //delete expense from the unsaved List
      this.exItems.splice(index, 1)
      this.clickCount = 0;
      if (this.exItems.length<=0){
         this.zeest = false
      }
    },
    addExpense(){
      //delete edit 
      //delete amount
    },
    /* SALES RECIPT FUNCTIONS */
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
.card-1 {
  min-height: 600px;
  /* max-height:600px */
}
.card-2 {
  min-height: 100px;
  max-height: 100px;
}
.card-3 {
  min-height: 490px;
  /* max-height:440px */
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
/* @media only screen and (max-width: 425px) {
  .v-card .title {
    font-size: 0.6rem !important;
  }
}
.icons-model {
  padding: 0px 5px;
} */
table.v-table tfoot tr td {
  padding: 0 8px;
  font-weight: 800;
}
/**End order Dialog css */
</style>