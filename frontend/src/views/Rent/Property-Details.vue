<template>
  <v-container fill-height fluid grid-list-xl>
    <v-layout wrap>
      <v-flex md12 lg12>
        <!-- can make this component will do after -->
        <v-card v-bind="$attrs" v-on="$listeners">
          <helper-offset>
            <v-toolbar color="orange" dark tabs>
              <div xs2>
                <v-text-field
                  v-model="search"
                  class="mr-2"
                  flat
                  solo-inverted
                  dense
                  clearable
                  label="Search Item"
                  prepend-inner-icon="mdi-magnify"
                />
              </div>
              <v-spacer />
              <v-btn @click="maintDialog = true; getType()">Set Maintenance</v-btn>
              <v-btn v-if="permissions['add']" @click="formDialog = true; getType()">Add Property</v-btn>
            </v-toolbar>
          </helper-offset>
        </v-card>
        <!-- will do som other Time -->
        <v-data-table :headers="item_headers" :items="properties" :search="search" hide-actions>
          <template slot="headerCell" slot-scope="{ header }">
            <span class="font-weight-bolder text--darken-3" v-text="header.text" />
          </template>
          <template slot="items" slot-scope="{  index , item }">
            <td>{{ index+1 }}</td>
            <td>{{ item.address }}</td>
            <!-- itemCode-->
            <td>{{ item.type }}</td>
            <td>{{ item.rent }}/month</td>
            <!-- itemType-->
            <!--itemCost -->
            <!-- <td class="text-xs-center">
              <v-icon
                v-if="item.available"
                :disabled="!permissions['add']"
                large
                @click="showData(item); RAFdialog = true;"
              >mdi-format-float-left</v-icon>
            </td> -->
            <td class="text-xs-center">
              <v-icon
                v-if="item.forsale"
                :disabled="!permissions['add']"
                large
                @click="showData(item); ownerDialog=true"
              >mdi-format-float-left</v-icon>
            </td>
            <!-- @click="showData(item);getownerShip(item);" -->
            <td class="text-xs-right">
              <v-icon
                color="green"
                large
                @click="pDetail = item; detailDialog = true;"
              >mdi-view-list</v-icon>
              <v-icon
                v-if="permissions['edit']"
                color="blue"
                large
                @click="showData(item); editDialog = true;"
              >mdi-pencil-circle</v-icon>
              <v-icon
                v-if="permissions['delete']"
                color="red"
                large
                @click="pDetail = item; delDialog = true;"
              >mdi-delete-circle</v-icon>
            </td>
          </template>
        </v-data-table>
      </v-flex>
    </v-layout>
    <!--DialogS-->

    <!--Dialog  form to create item-->
    <v-dialog v-model="formDialog" persistent max-width="600">
      <v-card>
        <v-form ref="createform" v-model="createvalid">
          <v-card-title class="headline">Add Property</v-card-title>
          <v-container grid-list-md>
            <v-layout wrap>
              <!-- <v-flex md6>
                <v-text-field
                  :rules="reqRules"
                  v-model="newItem.owner"
                  label="Owner"
                  hint="i.e: xyz-123"
                />
              </v-flex>-->
              <v-flex md6>
                <v-text-field
                  :rules="reqRules"
                  v-model="newItem.address"
                  label="Address"
                  hint="i.e: xyz-123"
                />
              </v-flex>
              <v-flex md6>
                <v-autocomplete
                  :rules="reqRules"
                  v-model="newItem.type"
                  :items="typesCat"
                  auto-select-first
                  item-text="type"
                  return-object
                  label="Property Type"
                >
                  <template slot="prepend-item">
                    <v-layout
                      row
                      class="body-2"
                      py-1
                      px-2
                      style="cursor: pointer;"
                      @click="typeDialog=true"
                    >
                      <v-flex md1>
                        <v-icon color="#44f">mdi-18px mdi-plus-circle-outline</v-icon>
                      </v-flex>
                      <v-flex pl-1 color="blue">Add New Type</v-flex>
                    </v-layout>
                    <v-divider />
                  </template>
                </v-autocomplete>
              </v-flex>
              <v-flex md6>
                <v-text-field
                  :rules="reqRules"
                  v-model="newItem.bedroom"
                  label="Bedrooms"
                  type="Number"
                  required
                />
              </v-flex>
              <v-flex md6>
                <v-text-field
                  :rules="reqRules"
                  v-model="newItem.bathroom"
                  label="Bathrooms"
                  type="Number"
                  required
                />
              </v-flex>
              <v-flex md6>
                <v-text-field
                  :rules="reqRules"
                  v-model="newItem.sqft"
                  label="Sq.Footage"
                  type="Number"
                  required
                />
              </v-flex>
              <v-flex md6>
                <v-text-field
                  :rules="reqRules"
                  v-model="newItem.rent"
                  label="rent/month"
                  type="Number"
                  required
                />
              </v-flex>
              <v-flex md12>
                <v-textarea v-model="newItem.detail" rows="1" label="Detail" required />
              </v-flex>
              <v-flex md6>
                <v-switch v-model="newItem.available" label="Available" />
              </v-flex>
              <v-flex md6>
                <v-switch v-model="newItem.forsale" label="For Sale" />
              </v-flex>
            </v-layout>
          </v-container>
          <v-card-actions>
            <v-spacer />
            <v-btn
              color="green darken-1"
              @click="addBuilding();formDialog = false"
            >Save</v-btn>
            <v-btn color="orange" @click="formDialog = false">Cancel</v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>
    <!--Form dialog end-->

    <!-- detail Dialog -->
    <v-dialog v-model="detailDialog" max-width="600">
      <v-card>
        <v-card-title class="headline">Property Detail</v-card-title>
        <v-container grid-list-md>
          <v-layout wrap>
            <!-- <v-flex md6>
              <v-text-field
                v-model="pDetail.owner"
                label="Owner"
                outline
                hint="i.e: xyz-123" />
            </v-flex>-->
            <v-flex md6>
              <v-text-field
                v-model="pDetail.address"
                label="Address"
                outline
                readonly
                hint="i.e: xyz-123"
              />
            </v-flex>
            <v-flex md6>
              <v-text-field
                v-model="pDetail.type"
                label="Property Type"
                outline
                readonly
                hint="i.e: xyz-123"
              />
            </v-flex>
            <v-flex md6>
              <v-text-field v-model="pDetail.bedroom" label="Bedrooms" outline readonly required />
            </v-flex>
            <v-flex md6>
              <v-text-field v-model="pDetail.bathroom" label="Bathrooms" outline readonly required />
            </v-flex>
            <v-flex md6>
              <v-text-field v-model="pDetail.sqft" label="Sq.Footage" outline readonly required />
            </v-flex>
            <v-flex md6>
              <v-text-field
                v-model="pDetail.rent"
                label="rent/month"
                outline
                readonly
                disabled
                required
              />
            </v-flex>
            <v-flex md12>
              <v-textarea
                v-model="pDetail.detail"
                label="Detail"
                outline
                readonly
                no-resize
                required
              />
            </v-flex>
          </v-layout>
        </v-container>
      </v-card>
    </v-dialog>
    <!-- detail dialog End -->

    <!--Eidt Dialog-->
    <v-dialog v-if="pDetail" v-model="editDialog" persistent max-width="600">
      <v-card>
        <v-form ref="editform" v-model="editvalid">
          <v-card-title class="headline">Edit Property</v-card-title>
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex md6>
                <v-text-field v-model="pDetail.owner" label="Owner" outline hint="i.e: xyz-123" />
              </v-flex>
              <v-flex md6>
                <v-text-field
                  v-model="pDetail.address"
                  :rules="reqRules"
                  label="Address"
                  outline
                  hint="i.e: xyz-123"
                />
              </v-flex>
              <v-flex md6>
                <v-text-field
                  v-model="pDetail.type"
                  :rules="reqRules"
                  label="Property Type"
                  outline
                  hint="i.e: xyz-123"
                />
              </v-flex>
              <v-flex md6>
                <v-text-field
                  :rules="reqRules"
                  v-model="pDetail.bedroom"
                  label="Bedrooms"
                  outline
                  required
                />
              </v-flex>
              <v-flex md6>
                <v-text-field
                  :rules="reqRules"
                  v-model="pDetail.bathroom"
                  label="Bathrooms"
                  outline
                  required
                />
              </v-flex>
              <v-flex md6>
                <v-text-field
                  :rules="reqRules"
                  v-model="pDetail.sqft"
                  label="Sq.Footage"
                  outline
                  required
                />
              </v-flex>
              <v-flex md6>
                <v-text-field
                  :rules="reqRules"
                  v-model="pDetail.rent"
                  label="rent/month"
                  outline
                  required
                />
              </v-flex>
              <v-flex md6>
                <v-textarea v-model="pDetail.detail" rows="1" label="Detail" outline />
              </v-flex>
              <v-flex md6>
                <v-switch v-model="pDetail.available" label="available" outline />
              </v-flex>
              <v-flex md6>
                <v-switch v-model="pDetail.forsale" label="For Sale" outline />
              </v-flex>
            </v-layout>
          </v-container>
          <v-card-actions>
            <v-spacer />
            <v-btn  color="green darken-1" @click="editDetail()">Save</v-btn>
            <v-btn color="orange darken-1" @click="editDialog = false;">Cancel</v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>
    <!--Edit dialog End-->

    <!--Delete dialog form-->
    <v-dialog v-model="delDialog" max-width="290">
      <v-card>
        <v-card-title class="headline">Sure Want to Delete...</v-card-title>
        <v-card-text>address: {{ pDetail.address }}</v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="orange darken-1" flat @click="delDialog = false">Cancel</v-btn>
          <v-btn
            color="green darken-1"
            flat
            @click="delDetail(pDetail._id); delDialog = false"
          >Delete</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!--End Delete dialog-->

    <!--Dialog for rent Acceptance form-->
    <!-- if they want it again it comes here -->

    <!--End dialong for RAF-->

    <!--START Ownership form-->
    <v-dialog
      v-model="ownerDialog"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
      scrollable
    >
      <v-card tile>
        <v-toolbar card dark color="primary">
          <v-btn icon dark @click="ownerDialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>Ownership Act Form</v-toolbar-title>
          <v-spacer />
          <v-toolbar-items>
            <v-btn :disabled="!ownervalid" dark flat @click="ownerShip(tOwner)">Save</v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-card-text class="text-xs-center">
          <div id="printOSF">
            <h2>Ownership Request Form</h2>
            <v-form ref="ownerShipForm" v-model="ownervalid">
              <v-container grid-list-md style="font-size:20">
                <v-layout row wrap>
                  <v-flex xs6>
                    <v-text-field
                      v-model="tOwner.owner"
                      label="Landlord's Name  "
                      required
                    />
                  </v-flex>
                  <v-flex xs6>
                    <v-text-field
                      v-model="tOwner.address"
                      label="Landlord's Address"
                      required
                    />
                  </v-flex>
                  <v-flex xs6>
                    <v-select
                      :items="tenants_list"
                      v-model="tOwner.tenantId"
                      item-text="tenantName"
                      item-value="_id"
                      label="New Owner's Name"
                    />
                  </v-flex>
                  <v-flex xs3>
                    <v-menu
                      v-model="dateMenu"
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
                          v-model="tOwner.signDate"
                          label="current Date"
                          readonly
                          required
                          v-on="on"
                        />
                      </template>
                      <v-date-picker
                        v-model="tOwner.signDate"
                        type="date"
                        dark
                        no-title
                        @input="dateMenu = false"
                      />
                    </v-menu>
                  </v-flex>
                  <v-flex xs3>
                    <v-menu
                      v-model="lastMenu"
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
                          v-model="tOwner.lastDate"
                          label="Last Date of full Paymnet"
                          readonly
                          required
                          v-on="on"
                        />
                      </template>
                      <v-date-picker
                        v-model="tOwner.lastDate"
                        type="date"
                        dark
                        no-title
                        @input="lastMenu = false"
                      />
                    </v-menu>
                  </v-flex>
                </v-layout>
                <v-layout row wrap>
                  <v-flex xs3>Property Purchase Amount is</v-flex>
                  <v-flex xs2>
                    <v-text-field
                      v-model.number="tOwner.purchaseAmount"
                      type="number"
                      label="Amount/Month"
                      required
                    />
                    <br />
                  </v-flex>
                </v-layout>
                <v-layout row wrap>
                  <v-flex xs3>Enter a Monthly Payment.</v-flex>

                  <v-flex xs2>
                    <v-text-field
                      v-model.number="tOwner.ownerRent"
                      type="number"
                      label="Amount/Month"
                      required
                    />
                  </v-flex>
                </v-layout>
              </v-container>
            </v-form>
          </div>
        </v-card-text>
        <div style="flex: 1 1 auto;" />
      </v-card>
    </v-dialog>

    <v-dialog v-model="typeDialog" width="40%">
      <v-card>
        <v-container pa-0>
          <v-layout style="background:#dbefdc">
            <v-flex md11 pt-2 pl-3>
              <span class="headline" v-text="'Add New Type'" />
            </v-flex>
            <v-flex text-xs-right pt-2 pr-3>
              <v-icon color="black" @click="typeDialog=false">mdi-close</v-icon>
            </v-flex>
          </v-layout>
          <v-form ref="typeForm" v-model="typeForm">
            <v-layout pt-4 px-3 justify-space-between justify-center>
              <v-flex offset-md2 xs5>
                <v-text-field :rules="reqRules" v-model="type" clearable label="Type Name" />
              </v-flex>
              <!-- <v-spacer/> -->
              <v-flex text-xs-right md2>
                <v-btn
                  :disabled="!typeForm"
                  class="addItem"
                  color="blue"
                  @click="saveType(type)"
                >Save</v-btn>
              </v-flex>
            </v-layout>
          </v-form>
        </v-container>
      </v-card>
    </v-dialog>

    <v-dialog
       v-model="maintDialog"
       width="350px"
    >
      <v-card>
          <v-card-title class="headline">
            <v-layout justify-space-around> Set Maintenance</v-layout>
          </v-card-title>
          <v-card-text>
            <v-form ref="mantForm">
              <v-layout justify-space-around>
                <v-flex md5>
                  <v-autocomplete
                      auto-select-first
                      v-model="setmant.newtypeMant"
                      :items="typesCat"
                      item-text="type"
                      label="Property Type"
                    >
                      <template slot="prepend-item">
                        <v-layout
                          row
                          class="body-2"
                          py-1
                          px-2
                          style="cursor: pointer;"
                          @click="typeDialog=true"
                        >
                          <v-flex md1>
                            <v-icon color="#44f">mdi-18px mdi-plus-circle-outline</v-icon>
                          </v-flex>
                          <v-flex pl-1 color="blue">Add New Type</v-flex>
                        </v-layout>
                        <v-divider />
                      </template>
                    </v-autocomplete>
                </v-flex>
                <v-flex md3>
                  <v-text-field
                    v-model="setmant.amount"
                    label="Amount"
                  />
                </v-flex>
              </v-layout>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer/>
            <v-btn dark @click="setMant(setmant)">Update</v-btn>
          </v-card-actions>
      </v-card>
    </v-dialog>

  <v-snackbar
    :value="snackbar.stat"
    :color="snackbar.color"
  >
    <v-icon dark>{{ snackbar.icon }}</v-icon>
    <b>{{ snackbar.msg }}</b>
    <v-icon @click="snackbar.stat=false">mdi-close-circle</v-icon>
  </v-snackbar>
    <!--END Ownership form-->
  </v-container>
</template>

<script>
import rentApi from "../../services/rent-api";

export default {
  data() {
    return {
      snackbar:{stat:false},
      valid: true,
      createvalid: true,
      editvalid: true,
      search: null,
      lastMenu: false,
      item_headers: [
        { sortable: false, text: "ID", value: "id" },
        { sortable: false, text: "Adress", value: "address" },
        { sortable: false, text: "Type", value: "type" },
        { sortable: false, text: "Rent", value: "rent" },
        // { sortable: false, text: "RAF", value: "form", align: "center" },
        { sortable: false, text: "Ownership", value: "form", align: "center" },
        { sortable: false, text: "Action", align: "right", width: "12%" }
      ],
      detailDialog: false,
      
      formDialog: false,
      editDialog: false,
      delDialog: false,
      pDetail: {},
      newItem: { available: true, forsale:true  },
      setmant: {},
      properties: [],
      reqRules: [v => !!v || " required"],
      tenants_list: null,
      permissions: {},
      ownerDialog: false,
      tOwner: {},
      ownervalid: false,
      dateMenu: false,

      typesCat: [],
      typeForm: false,
      typeDialog: false,
      type: undefined,
      maintDialog: false
    };
  },
  created() {
    this.getInfo();
    this.getTenants();
    this.getPermissions();
  },
  methods: {
    getInfo() {
      rentApi.getPropertyApi().then(res => {
        if(res.length>0){
          this.properties = res;
        }
      });
    },
    getTenants() {
      rentApi.getTenantApi().then(res => {
        this.tenants_list = res;
      });
    },
    addBuilding() {
      // console.log(this.newItem.type)
      if(this.newItem.type){
        this.newItem['mant'] = this.newItem.type.amount
        this.newItem['type'] = this.newItem.type.type
      }
      // if (this.$refs.createform.validate()) {
        rentApi.addPropertyApi(this.newItem).then(res => {
          if (res.status === "success") {
            this.getInfo();
          }
        });
      // }
    },
    editDetail() {
      rentApi.editPropertyApi(this.pDetail).then(res => {
        if (res.status === "success") {
          this.getInfo();
          this.editDialog = false;
        }
      });
    },
    delDetail(propertyId) {
      rentApi.deletePropertyApi(propertyId).then(res => {
        if (res === 202) {
          this.getInfo();
        }else if (res === 200){
          this.snackbar = {
            msg: 'You can`t delete this property, remove ownership first',
            stat: true,
            color: 'red',
            icon: 'mdi-close-circle-outline'
          }
        }
      });
    },
    showData(obj) {
      /** show data on edit dialog.. andn not change till from the backend */
      this.pDetail = Object.assign({}, obj);
      this.tOwner = Object.assign({}, obj);
      this.tOwner.owner = "Community"
    },
    ownerShip(obj) {
      var arrayData = {
        bldgId: obj["_id"]["$oid"],
        ownerId: obj["tenantId"],
        signDate: obj["signDate"],
        lastDate: obj["lastDate"],
        purchaseAmount: obj["purchaseAmount"],
        ownerRent: obj["ownerRent"]
      };
      rentApi.ownerShip(arrayData).then(res => {
        if (res) {
          // this.printOSF();
          this.ownerDialog = false; // close the opened dialog box
          this.$refs.ownerShipForm.reset(); // reset the dialog box feilds
          this.getInfo(); // call property again
        }
      });
    },
    getownerShip(obj) {
      var id = obj["_id"]["$oid"];
      rentApi.getownerShip(id).then(res => {
        if (res) {
          this.tOwner.ownerRent = res["ownerRent"];
          this.tOwner.signDate = res["signDate"];
          this.tOwner.tenantId = res["tenantId"];
          this.tOwner.purchaseAmount = res["purchaseAmount"];
        }
        this.ownerDialog = true;
      });
    },
    setMant(data){
      rentApi.setMant(data).then(res =>{
        if(res === true){
          this.maintDialog =false;
          this.$refs.mantForm.reset()
        }
      });
    },

    saveType(type) {
      var type = { type: type };
      rentApi.addtype(type).then(res => {
        if (res === true) {
          this.getType();
          this.typeDialog = false;
          var len = this.typesCat.length - 1;
        }
      });
    },

    getType() {
      rentApi.getType().then(res => {
        if (res) {
          this.typesCat = res;
        }
      }); 
    },

    printOSF() {
      const modal = document.getElementById("printOSF");
      modal.style.width = 100 + "%";
      const cloned = modal.cloneNode(true);
      let section = document.getElementById("print");
      if (!section) {
        section = document.createElement("div");
        section.id = "print";
        document.body.appendChild(section);
      }
      section.innerHTML = "";
      section.appendChild(cloned);
      window.print();
      modal.style.width = 100 + "%";
      this.ownerDialog = false; // close the opened dialog box
      this.$refs.ownerShipForm.reset(); // reset the dialog box feilds
      this.getInfo(); // call property again
    },

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

<style >
@media screen {
  #print {
    display: none;
  }
}
@media print {
  body * {
    visibility: hidden;
  }
  #print,
  #print * {
    visibility: visible;
  }
  #print {
    position: absolute;
    left: 0;
    top: 0;
  }
}
</style>
