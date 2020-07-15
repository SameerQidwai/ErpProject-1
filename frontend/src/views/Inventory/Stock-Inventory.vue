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
                    <span>Add Item</span>
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
                  <v-icon>mdi-plus</v-icon>Add Item
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
                  <v-btn
                    fab
                    dark
                    small
                    icon
                    color="danger"
                    style="margin:0px 2px"
                    @click="deleteThis(objItem)"
                  >
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                </v-flex>
              </v-layout>
              <v-layout wrap>
                <v-flex>
                  <span>SALE PRICE:</span>
                  <span class="info--text">Rs {{ objItem.sPrice }}</span>
                </v-flex>
                <v-spacer />
                <v-flex text-xs-right>
                  <span>STOCK Quantity:</span>
                  <span
                    class="info--text"
                    v-text="objItem.qty" />
                </v-flex>
              </v-layout>
              <v-layout wrap>
                <v-flex>
                  <span>PURCHASE PRICE:</span>
                  <span class="info--text">Rs {{ objItem.pPrice }}</span>
                </v-flex>
                <v-spacer />
                <v-flex text-xs-right>
                  <span>STOCK VALUE:</span>
                  <span class="info--text">Rs {{ stockValue }}</span>
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
                <v-flex md2>
                  <span
                    class="headline"
                    v-text="'Transaction'" />
                </v-flex>
                <v-flex md7>
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
                    hide-details
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

    <v-dialog
      v-model="itemDel"
      persistent
      max-width="600">
      <v-card>
        <v-card-title class="headline">
          Are You Sure Want To Delete
          <kbd style="background-color:danger">{{ ItemObj.name }}</kbd> ?
        </v-card-title>
        <v-card-text class="text-xs-center">
          Item in stock:
          <kbd style="background-color:blue">{{ ItemObj.qty }}</kbd>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="orange darken-1"
            flat
            @click="itemDel = false">Disagree</v-btn>
          <v-btn
            color="green darken-1"
            flat
            @click="deleteBtn(ItemObj._id); itemDel = false">Agree</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

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
                  item-value="_id"
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
              v-if="!edit"
              :disabled="!addvalid"
              color="green darken-2"
              class="addItem"
              @click="addItem()"
            >Save</v-btn>
            <v-btn
              v-else
              :disabled="!addvalid"
              color="info"
              class="addItem"
              @click="editItem()"
            >Edit</v-btn>
            <!-- <v-btn color="orange" @click="formDialog = false">Cancel</v-btn> -->
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
                v-text="'Select Unit'" />
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
                  v-text="'Add New Unit'" />
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
    <!--Add NEW UNIT-->

    <!-- PURCHASE RECIPT DIALOGS -->
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
                  @click="editOrder(order._id)">mdi-file-document-edit</v-icon>
              </span>
              <span class="icons-model">
                <v-icon
                  :disabled="(order.totalPrice - order.advance)<=0 && order.delivered"
                  large
                  color="purple"
                  @click="payModel=!payModel"
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
                v-text="`Order No: ${order.orderNo}`" />
            </v-flex>
            <v-flex
              lg4
              md4
              sm12>
              <span
                class="title"
                v-text="`Supplier: ${order.supplierName}`" />
            </v-flex>
          </v-layout>
          <v-layout row>
            <v-flex
              lg4
              md4
              sm12>
              <span
                class="title custom-title"
                v-text="`Order Date: ${new Date (order.orderDate).toDateString()}`" />
            </v-flex>
            <v-flex
              lg4
              md4
              sm12>
              <span
                class="title custom-title"
                v-text="`Due Date: ${new Date (order.dueDate).toDateString()}`" />
            </v-flex>
            <v-flex
              lg4
              md4
              sm12>
              <v-checkbox
                v-model="order.delivered"
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
            :items="order.items"
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
                <td class="text-xs-center">{{ item.itemUnit }}</td>
                <td class="text-xs-center">{{ item.total }}</td>
              </tr>
            </template>
            <template v-slot:footer>
              <td />
              <td>Balance: {{ order.balance }}</td>
              <td>Advance: {{ order.advance }}</td>
              <td class="text-xs-center">Total Qty: {{ order.totalQty }}</td>
              <td />
              <td class="text-xs-center">Total Price: {{ order.totalPrice }}</td>
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
              <span class="headline">Total Price: {{ order.totalPrice }}</span>
            </v-flex>
            <v-flex md4>
              <v-text-field
                v-model.number="pay.advance"
                :height="6"
                :disabled="(order.totalPrice - order.advance)<=0 "
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
                :disabled="(order.totalPrice - order.advance)<=0 && pay.delivered"
              />
            </v-flex>
            <v-spacer />
            <v-flex md3>
              <v-btn
                color="black"
                @click="payment(order._id)">Payment</v-btn>
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
          <span v-if="order.status=='Purchase'">
            <kbd style="background:red">This Order Will be deleted permanenly!!</kbd>
          </span>
          <span v-else>
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
            v-if="order.status=='Purchase'"
            color="green darken-1"
            flat
            @click="deleteOrder(order); delDialog = false"
          >Agree</v-btn>
          <!--Order delete Btn-->
          <!--sale delete Btn-->
          <v-btn
            v-else
            color="green darken-1"
            flat
            @click="deleteSale(order); delDialog = false"
          >Agree</v-btn>
          <!--sale delete Btn-->
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- END PURCAHSE RECIPT DIALOGS-->

    <!--SALE RECIPT DIALOGS-->
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
                v-text="`Receipt ID:${order._id}`" />
            </v-flex>
          </v-layout>
          <v-layout row>
            <v-flex>
              <span
                class="title"
                v-text="`Customer:${order.customerName}`" />
            </v-flex>
            <v-flex>
              <span
                class="title"
                v-text="`Date:${new Date (order.date).toDateString()}`" />
            </v-flex>
          </v-layout>
          <v-data-table
            :headers="orderHeader"
            :items="order.items"
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
              </tr>
            </template>
            <template v-slot:footer>
              <td>Discount: {{ order.discount }}</td>
              <td>Paid: {{ order.debit }}</td>
              <td class="text-xs-center">Total Qty: {{ order.totalQty }}</td>
              <td />
              <td class="text-xs-center">Total Price: {{ order.totalPrice }}</td>
            </template>
          </v-data-table>
        </v-container>
      </v-card>
    </v-dialog>
    <!-- END SALE RECIPT DIALOGS-->

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
      unitDialog: false,
      unitArray: [],
      pri: {},
      sec: {},

      addUnitDialog: false,
      addUnit: {},
      formUnit: {},

      addUnitObj: {},
      formDialog: false, //Edit and Dialog
      ItemObj: {}, // call Item attribute in edit dialog
      product: [], // getItem array

      searcbox: false,
      itemDel: false, // hide $ show delete dialog
      snackbar: false,

      edit: false, //make Add dialog a Edit Dialog
      qtyLabel: null, // Qty lable in add Item
      dialogHeadline: null, // // headline in show Item
      addCat: true, //show text field
      category: null, // v-model for category
      getCat: [], //combobox list

      detailed: [],
      itemId: null, // Save Item id to delete

      objItem: {},

      refreshId: null,
      search: undefined,
      item_headers: [
        { text: "Name", value: "name" },
        { text: "Quantity", value: "qty", align: "right" }
      ],
      detail_headers: [
        { sortable: false, text: "Type" },
        { sortable: false, text: "Name", value: "party" },
        { sortable: false, text: "Date", value: "date" },
        { sortable: false, text: "Quantity", value: "item.itemQty" },
        { sortable: false, text: "Unit" },
        { sortable: false, text: "Price", value: "item.itemCost" },
        { sortable: false, text: "Total" },
        { sortable: false, text: "...", align: "left", width: "1px" }
      ],
      addvalid: true,
      reqRules: [v => !!v || " required"],

      /* Purchase Recipt Vartable */
      /** */
      orderDialog: false,
      delDialog: false,
      order: {}, // for render data and not referesh the whole data
      payModel: false,
      sold: [],
      pay: {
        advance: 0,
        delivered: false
      },
      orderHeader: [
        { sortable: false, text: "Name", value: "name" },
        { sortable: false, text: "Description", value: "decs" },
        { sortable: false, text: "Qty", value: "pQty", align: "center" },
        { sortable: false, text: "Unit", value: "unit", align: "center" },
        { sortable: false, text: "Price", value: "pCost", align: "center" },
        {
          sortable: false,
          text: "Total",
          align: "center",
          value: "total",
          align: "center"
        }
        // { sortable: false, text: "....", value: "action", align: "center" }
      ],//nothihnd
      /**Purcashe Recipt Variable */
      search2: undefined,
      salesDialog: false,
      order: {},
      filter: [],
      getCat: [],
      salesHeader: [
        { sortable: false, text: "Name", value: "name" },
        { soratable: false, text: "Description", value: "decs" },
        { sortable: false, text: "Qty", value: "sQty" },
        { sortable: false, text: "Unit", value: "unit", align: "center" },
        { sortable: false, text: "Price", value: "sSale" },
        { sortable: false, text: "Total", value: "total" }
        // { sortable: false, text: "....", value: "action", align: "center" }
      ]
      /**Sale Recipt variable */
    };
  },
  created() {
    /**Item Stock */
    // this.getSuppliers();
    this.getItems();
    this.getCategory("parents");
    this.getPermissions();
  },
  computed: {
    stockValue() {
      var stock = 0;
      this.detailed.forEach(element => {
        if (element.status === "Sale") {
          stock -= element.totalAmount;
        } else {
          stock += element.totalAmount;
        }
      });
      return stock;
    },
    balance() {
      // for pament dialog use balance
      return this.order.totalPrice - this.order.advance - this.pay.advance;
    }
  },
  methods: {
    /**page */
    blurBox() {
      if (!this.search) {
        this.searcbox = false;
      }
    },
    showItem(item) {
      this.objItem = item;
      api.itemDteail(item._id).then(res => {
        if (res) {
          this.detailed = res;
        }
      });
    },
    /**Page End */
    /**Item Stock */
    getItems() {
      api.getItemApi().then(res => {
        if (res.length > 0) {
          this.product = res;
          this.showItem(this.product[0]);
        }
      });
    },
    /**Delete Item */
    deleteThis(item) {
      this.ItemObj = item;
      this.itemDel = true;
      this.itemId = item._id;
    },

    deleteBtn() {
      api.deleteItem(this.itemId).then(res => {
        if (res.status == true) {
          this.itemDel = false;
          this.itemId = null;
          this.ItemObj = {};
          this.getItems();
        } else {
          this.snackbar = {
            msg: "Item not delete Somthing went wrong!",
            stat: true,
            color: "red",
            icon: "mdi-bell-plus"
          };
        }
      });
    },
    /**Delete Item End */
    /**Edit Item */
    showEdit(obj) {
      this.ItemObj = {} = Object.assign({}, obj);
      this.edit = true;
      this.qtyLabel = "Quantity";
      this.dialogHeadline = "Edit Item";
      this.formDialog = true;
      this.getCategory("parents");
    },

    editItem() {
      api.editItem(this.ItemObj).then(res => {
        if (res.status == true) {
          this.getCat = [];
          this.edit = false;
          this.formDialog = false;
          this.ItemObj = {};
          this.getItems();
        } else {
          this.snackbar = {
            msg: "Item is not Edited Somthing went wrong!",
            stat: true,
            color: "red",
            icon: "mdi-bell-plus"
          };
        }
      });
    },
    /**Edit Item End */
    /**Add Item */
    showAdd() {
      this.formDialog = true;
      this.ItemObj = {};
      this.qtyLabel = "Opening Quantity";
      this.dialogHeadline = "Add Item";
      this.edit = false;
      this.getCategory("parents");
    },

    addItem() {
      console.log(this.ItemObj);
      this.ItemObj.categories.forEach(el => {
        delete el.__v;
        delete el.parentId;
      });
      api.addItem(this.ItemObj).then(res => {
        if (res.status == true) {
          this.getCat = [];
          this.ItemObj = {};
          this.getItems();
          this.$refs.addform.reset();
          this.snackbar = {
            msg: "Item Added!",
            stat: true,
            color: "success",
            icon: "mdi-plus-box"
          };
        } else {
          this.snackbar = {
            msg: "Item Not Added!",
            stat: true,
            color: "red",
            icon: "mdi-minus-box"
          };
        }
      });
    },
    /**Category Start */
    getCategory(id) {
      api.getCategory(id).then(res => {
        if (res) {
          console.log(res);
          this.getCat = res;
        }
      });
    },

    getChange(select) {
      if (select.length > 0) {
        var parents = select[select.length - 1]._id;
        this.getCategory(parents);
      } else {
        this.getCategory("parents");
      }
    },
    remove(item) {
      this.ItemObj.categories = this.ItemObj.categories.slice(
        0,
        this.ItemObj.categories.indexOf(item)
      );
      this.getChange(this.ItemObj.categories);
    },
    addCategory(select, add) {
      if (add != "" && add != undefined) {
        if (select != undefined) {
          if (select.length > 0) {
            var len = select.length - 1;
            var parents = select[len]._id;
            var obj = { parentId: parents, category: add };
          } else {
            var obj = { category: add };
            var parents = "parents";
          }
        } else {
          var obj = { category: add };
          var parents = "parents";
        }
        api.addCategory(obj).then(res => {
          if (res.status == true) {
            this.category = "";
            this.getCategory(parents);
            this.snackbar = {
              msg: "New Category Added!",
              stat: true,
              color: "blue",
              icon: "mdi-plus-box"
            };
          }
        });
      }
    },

    /**Category ENd */
    /**Unit startted */
    getUnits() {
      api.getUnits().then(res => {
        if (res) {
          this.unitArray = res;
        }
      });
    },
    saveUnit(data) {
      api.saveUnit(data).then(res => {
        if (res == true) {
          this.getUnits();
          this.addUnitDialog = false;
          this.$refs.formUnit.reset();
        } else if (res.name) {
          this.snackbar = {
            msg: "Unit is Already existed!",
            stat: true,
            color: "red",
            icon: "mdi-bell-plus"
          };
        }
      });
    },
    selectUnit(pri, sec) {
      if (sec.unit == pri.unit) {
        this.sec = {};
        this.snackbar = {
          msg: "Base Unit and Secondary Unit Can't not be same",
          stat: true,
          color: "red",
          icon: "mdi-shield-alert-outline"
        };
      } else {
        var unit = [pri, sec];
        this.ItemObj["unit"] = unit;
        this.unitDialog = false;
      }
    },
    /**Unit End */
    /** Item ENd */
    /* PURCHASE RECIPT FUNCTIONS */
    orderRecipt(item) {
      orderApi.getRecipt(item._id).then(res => {
        if (res) {
          this.orderDialog = true;
          this.order = res;
          this.pay["delivered"] = this.order["delivered"];
        }
      });
    },

    payment(id) {
      this.pay.id = id;
      orderApi.payment(this.pay).then(res => {
        if (res) {
          /** for render data and not referesh the whole data */
          orderApi.getRecipt(id).then(res => {
            if (res) {
              this.order = res;
            }
          });
          /** */
          this.payModel = false;
        }
      });
    },
    // route query
    editOrder(id) {
      this.$router.push({
        path: "/purchase-order",
        query: { id, route: true }
      });
    },

    deleteOrder(item) {
      orderApi.deleteOrder(item._id).then(res => {
        if (res) {
          this.showItem(this.objItem);
          this.delDialog = false;
          this.orderDialog = false;
        }
      });
    },
    /*END PURCHASE RECIPT FUNCTIONS */

    /* SALES RECIPT FUNCTIONS */
    salesRecipt(item) {
      saleApi.getRecipt(item._id, true).then(res => {
        if (res) {
          this.salesDialog = true;
          this.order = res;
          console.log(res);
        }
      });
    },

    deleteSale(item) {
      saleApi.deleteSale(item._id).then(res => {
        if (res) {
          this.showItem(this.objItem);
          this.delDialog = false;
          this.salesDialog = false;
        }
      });
    },
    getItemsCat(data) {
      // get filtered Item acording to category
      api.getItemCat(data).then(res => {
        this.product = res; // get filtered Item acording to category
          this.showItem(this.product[0]);
      });
    },
    getfilter(select) {
      console.log("here", select);
      if (select.length > 0) {
        var catsearch = [];
        var parents = select[select.length - 1]._id; //parent id to search
        select.forEach(el => {
          catsearch.push({ _id: el._id, category: el.category }); // create array without parentId to search
        });
        this.getItemsCat(catsearch); // get filter category
        this.getCategory(parents); // get child category
      } else {
        (this.searchCat = []), this.getItems(); // get Item if category if category filed is empty
        this.getCategory("parents"); // get parent category
      }
    },
    removeFilter(item) {
      //remove category from filed box
      this.filter = this.filter.slice(0, this.filter.indexOf(item));
      this.getfilter(this.filter);
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