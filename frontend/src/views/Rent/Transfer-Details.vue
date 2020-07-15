<template>
  <v-container
    fill-height
    fluid
    grid-list-xl>
    <v-layout wrap>
      <v-flex
        md12
        lg12>
        <v-card
          v-bind="$attrs"
          v-on="$listeners">
          <helper-offset>
            <v-toolbar
              color="purple"
              dark
              tabs>
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
            </v-toolbar>
          </helper-offset>
        </v-card>

        <v-data-table
          :headers="item_headers"
          :items="history"
          :search="search"
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
            <td >
              <span v-for ="(obj,index) of item.tenant" :key="index">
                <span >{{'- '+ obj.tenantName }}<br></span>
              </span>
            </td> 
            <!-- <td >
              <span v-for ="(obj,index) of item.tenant" :key="index">
                <span >{{'- '+obj.tenantPhone }}<br></span>
              </span>
            </td> -->
            <td :class="[item.trans.subletName ? 'text-xs-left' : 'text-xs-center']"> 
              <span v-if="item.trans.subletName">{{ item.trans.subletName }}</span>
              <span v-else>-</span>
            </td>
            <!-- <td class="text-xs-center">
              <span v-if="item.trans.subletPhone">{{ item.trans.subletPhone }}</span>
              <span v-else>-</span>
            </td> -->
            <td>{{ item.pro.address }}</td>
            <!-- <td>{{ item.acceptedRent }}/month</td> -->
            <td> {{ parseInt(item.owner.ownerRent) }}/Month </td> 
            <td class="text-xs-center">
              <span v-if="item.trans.acceptedRent" >
                {{  parseInt(item.trans.acceptedRent) }}/month
              </span>
              <span v-else> - </span>
            </td>
            <td>
              {{item.rentNow=  parseInt(item.owner.ownerRent) + parseInt(item.trans.acceptedRent || 0) }}
            </td>
            <td @click="newDeposit=undefined">
              <v-edit-dialog
                :return-value.sync="item.deposit"
                large
                lazy
                @save="depositSave(item,newDeposit)"
              >
                <div>
                  {{ item.deposit }}
                  <v-icon >mdi-plus</v-icon>
                </div>
                <!-- <template v-slot:input>
                 
                </template> -->
                <template v-slot:input>
                   <div class="mt-3 title">Update Deposit</div>
                  <v-form ref='editDialog'>
                    <v-text-field
                      v-model.number="newDeposit"
                      type="Number"
                      label="Add Deposit"
                      single-line
                      counter
                      autofocus
                    />
                  </v-form>
                </template>
              </v-edit-dialog>
            </td>
            <td class="text-xs-right">
              <v-icon
                color="green"
                
                @click="showDetail(item)">mdi-view-list</v-icon>
            </td>
          </template>
          <template v-slot:no-data>
            <v-flex text-xs-center>
              <v-progress-circular
                :width="3"
                :size="50"
                color="red"
                indeterminate />
            </v-flex>
          </template>
        </v-data-table>
      </v-flex>
    </v-layout>

    <!--Dialog for rent Acceptance form-->
    <v-dialog
      v-model="detailDialog"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition">
      <v-card tile>
        <v-toolbar
          card
          dark
          color="primary">
          <v-btn
            icon
            dark
            @click="detailDialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>Property Details</v-toolbar-title>
          <v-spacer />
        </v-toolbar>

        <v-container
          fluid
          grid-list-xl>
          <v-card-text>
            <h3>Building Information</h3>
          </v-card-text>
          <v-flex offset-xs1>
            <v-card>
              <v-layout
                row
                wrap
                class="pad">
                <!-- <v-flex md3>
                  <v-text-field
                    v-model="pDetail.owner"
                    label="OWNER"
                    outline
                    readonly />
                </v-flex> -->
                
                <v-flex md8>
                  <v-text-field
                    v-model="pDetail.pro.address"
                    label="ADDRESS"
                    outline
                    readonly />
                </v-flex>
                </v-layout>
                <v-layout
                row
                wrap
                class="pad">
                <v-flex md2>
                  <v-text-field
                    v-model="pDetail.pro.sqft"
                    label="AREA"
                    outline
                    readonly />
                </v-flex>
                <v-flex md2>
                  <v-text-field
                    v-model="pDetail.pro.bedroom"
                    label="BEDROOM"
                    outline
                    readonly />
                </v-flex>
                <v-flex md2>
                  <v-text-field
                    v-model="pDetail.pro.bathroom"
                    label="BATHROOM"
                    outline
                    readonly />
                </v-flex>
              </v-layout>
              <v-layout
                row
                wrap
                class="pad">
                <v-flex md8>
                  <v-textarea
                    v-model="pDetail.pro.detail"
                    label="DETAIL"
                    outline
                    readonly
                    no-resize />
                </v-flex>
              </v-layout>
            </v-card>
          </v-flex>
        </v-container>
        <v-container
          v-if="pDetail.owner"
          fluid
          grid-list-xl>
          <v-layout justify-center>
            <v-flex title md1>Owners</v-flex>
            <v-flex md1>
              <v-icon
                color="error"
                large
                @click="showDel('Owner')"
              >mdi-close-thick</v-icon>
              <v-icon
                large
                color="black"
                @click="showHistory('Owner')">mdi-history</v-icon>
            </v-flex>
          </v-layout>
          <span v-for ="(obj,index) of pDetail.tenant" :key="index">
            <v-card-text>
              <v-layout>
                <v-flex pl-4>
                  <h3>Owner Information - {{index+1}}</h3>
                </v-flex>
                <v-spacer />
                <v-flex
                  md1
                  align-self-end
                  text-xs-right
                  v-if="pDetail.tenant.length>1"
                  >
                  <v-icon
                    large
                    color="error"
                    @click="showDel('Tenant',index)">mdi-delete</v-icon>
                </v-flex>
              </v-layout>
            </v-card-text>
            <v-flex offset-xs1>
              <v-card
                hover
                raised>
                <v-layout
                  row
                  wrap
                  class="pad">
                  <v-flex md3>
                    <v-text-field
                      v-model="obj.tenantName"
                      label="NAME"
                      outline
                      readonly
                    />
                  </v-flex>
                  <v-flex md3>
                    <v-text-field
                      v-model="obj.tenantPhone"
                      label="PHONE"
                      outline
                      readonly
                    />
                  </v-flex>
                  <v-flex md8>
                    <v-text-field
                      v-model="obj.tenantAddress"
                      label="OLD ADDRESS"
                      outline
                      readonly
                    />
                  </v-flex>
                  <v-flex md8>
                    <v-textarea
                      v-model="obj.tenantDetail"
                      label="DETAIL"
                      outline
                      readonly
                      no-resize
                    />
                  </v-flex>
                </v-layout>
              </v-card>
            </v-flex>
          </span>
        </v-container>

        <v-container
          v-if="pDetail.owner"
          fluid
          grid-list-xl>
          <v-card-text>
            <h3>Purcahse Detail</h3>
          </v-card-text>
          <v-flex offset-xs1>
            <v-card
              hover
              raised>
              <v-layout
                row
                wrap
                class="pad">
                <v-flex md2>
                  <v-text-field
                    v-model="pDetail.owner.signDate"
                    label="SIGNED"
                    outline
                    readonly />
                </v-flex>
                <v-flex md2>
                  <v-text-field
                    v-model="pDetail.owner.purchaseAmount"
                    label="Purcahse Price"
                    outline
                    readonly
                  />
                </v-flex>
                <v-flex md2>
                  <v-text-field
                    v-model="pDetail.owner.ownerRent"
                    label="Owner Rent"
                    outline
                    readonly />
                </v-flex>
                <v-flex
                  md2>
                  <v-text-field
                    v-model="pDetail.deposit"
                    label="DEPOSIT"
                    outline
                    readonly />
                </v-flex>
              </v-layout>
            </v-card>
          </v-flex>
        </v-container>
      
        <v-container
          fluid
          grid-list-xl>
          <v-layout justify-center>
          <v-flex headline md1>Sublet</v-flex>
        </v-layout>
          <v-card-text>
            <v-layout>
              <v-flex>
                <h3>Sublet Information</h3>
              </v-flex>
              <v-spacer />
              <v-flex
                md1
                align-self-end
                text-xs-right>
                <!-- <v-icon
                  large
                  color="black"
                  @click="showHistory('Sublet')">mdi-history</v-icon> -->
                  <v-icon
                  large
                  color="blue"
                  @click="addsublet=!addsublet">mdi-pencil-circle</v-icon>
                <v-icon
                  large
                  color="error"
                  @click="showDel('Sublet')">mdi-delete</v-icon>
              </v-flex>
            </v-layout>
          </v-card-text>
          <v-flex offset-xs1>
            <v-card
              hover
              raised
            >
            <v-layout 
              v-if="!pDetail.trans.subletName && !addsublet" 
            >
              <v-flex text-xs-center>
                <v-btn class="success" @click="addsublet=true">Add Sublet Information</v-btn>
              </v-flex>
            </v-layout>
            <v-form>
              <div v-if="pDetail.trans.subletName || addsublet"  >
                <v-layout
                  row
                  wrap
                  px-1
                >
                  <v-flex md3>
                    <v-text-field
                      v-model="pDetail.trans.subletName"
                      label="NAME"
                      outline
                      :readonly="!addsublet" />
                  </v-flex>
                  <v-flex md3>
                    <v-text-field
                      v-model="pDetail.trans.subletPhone"
                      label="PHONE"
                      outline
                      :readonly="!addsublet" />
                  </v-flex>
                  <v-flex md3>
                    <v-text-field
                      v-model="pDetail.trans.subletNIC"
                      label="Sublet NIC"
                      outline
                      :readonly="!addsublet"
                    />
                  </v-flex>
                </v-layout>
                <v-layout
                  px-1
                >
                  <v-flex md2>
                    <v-menu
                      v-model="startMenu"
                      :close-on-content-click="false"
                      :nudge-right="40"
                      lazy
                      :disabled="!addsublet"
                      transition="scale-transition"
                      offset-y
                      full-width
                      max-width="290px"
                      min-width="290px"
                    >
                      <template v-slot:activator="{ on }">
                        <v-text-field
                          v-model="pDetail.trans.leaseStartDate"
                          label="Lease Date"
                          outline
                          :readonly="!addsublet"
                          v-on="on"
                        />
                      </template>
                      <v-date-picker
                        v-model="pDetail.trans.leaseStartDate"
                        type="date"
                        dark
                        no-title
                        @input="startMenu = false"
                      />
                    </v-menu>
                  </v-flex>
                  <v-flex md2>
                    <v-text-field
                      v-model.number="pDetail.trans.acceptedRent"
                      label="Start Rent Date"
                      outline
                      :readonly="!addsublet"
                    />
                  </v-flex>
                </v-layout>
              </div>
            </v-form>
              <v-card-actions>
                <v-spacer/>
                <v-btn v-if="addsublet === true" class="success" @click="transferInfo()">Save</v-btn>
              </v-card-actions>
            </v-card>
          </v-flex>
        </v-container>
      </v-card>
    </v-dialog>

    <v-dialog
      v-model="delDialog"
      persistent
      max-width="400">
      <v-card>
        <v-card-title class="headline text-xs-center">
          Are You Sure Want To Remove</v-card-title>
        <v-card-text class="text-xs-center">
          <kbd>{{ delPerson.name }}</kbd>
          <span class="font-weight-bold">as an {{ delPerson.perIs }}</span>
        </v-card-text>
        <v-card-text class="text-xs-center">
          <span class="font-weight-bold">From</span>
          <kbd>{{ delPerson.address }}</kbd>
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
            @click="deletePerson()">Agree</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </v-container>
</template>

<script>
import rentApi from '../../services/rent-api'

export default {
  data () {
    return {
      search: null,
      detailDialog: false,
      item_headers: [
        { sortable: false, text: 'Tenant Name', value: 'tenant.tenantName' },
        // { sortable: false, text: 'Tenant phone' },
        { sortable: false, text: 'Sublet Name', value: 'trans.subletName' },
        // { sortable: false, text: 'Sublet phone' },
        { sortable: false, text: 'Address', value: 'pro.address' },
        { sortable: false, text: 'Tenant Rent', value: 'rent' },
        { sortable: false, text: 'Sublet Rent', value: 'rent' },
        { sortable: false, text: 'Total', value: 'start' },
        { sortable: false, text: 'Deposit', value: 'deposit' },
        { sortable: false, text: 'Detail', align: 'right' }
      ],
      pDetail: {
        pro:[],
        owner:[],
        tenant:[],
        trans:[],
      },
      history: [],

      delPerson: {},
      delDialog: false,
      newDeposit: undefined,

      addsublet:false,
      addrent:false,
      startMenu:false,  
    }
  },
  created () {
    this.getTransHistory()
    this.getPermissions()
  },
  methods: {
    getTransHistory () {
      rentApi.getTransHistoryApi().then(res => {
        console.log(res)
        this.history = res
      })
    },
    showDetail (item) {
      this.pDetail = Object.assign({}, item)
      if (item.leaseStartDate){
        this.pDetail.leaseStartDate = new Date(item.leaseStartDate).toISOString().substr(0, 10)
      }
      this.detailDialog = true
    },
    showDel (del,i) {
      console.log(this.pDetail)
      if (del == 'Tenant') {
        this.delPerson = {
          name: this.pDetail['tenant'][i]['tenantName'],
          del_id: this.pDetail['tenant'][i]['_id'],
          address: this.pDetail['pro']['address'],
          perIs: 'Tenant'
        }  
      } else if(del == 'Sublet'){
          this.delPerson = {
            name: this.pDetail['trans']['subletName'],
            del_id: this.pDetail['trans']['_id'],
            address: this.pDetail['pro']['address'],
            perIs: 'Sublet'
          }
        }else if (del == 'Owner'){
          this.delPerson = {
            perIs: 'Owner'
          }
      }
      this.delDialog = true
    },
    deletePerson (id) {
      var data = {
        perIs: this.delPerson['perIs'],
        id: this.pDetail['_id'],
        del_id: this.delPerson['del_id'],
      }
      console.log(data)
      rentApi.delPerson(data).then(res => {
        if (res) {
        }
      })
    },
    showHistory (hist) {
      var hist_data = {
        name: this.pDetail['bldgId'],
        perIs: hist
      }
      console.log(hist_data)
      // rentApi.showHistory(hist_data).then(res=>{
      //   if (res){
      //     this.delDialog=false
      //   }
      // })
    },
    depositSave (item, newDeposit) {
      if (newDeposit > 0) {
        var obj = {
          _id: item.id,
          deposit: newDeposit
        }
        rentApi.incDeposit(obj).then(res => {
          if (res === false) {
            item.deposit = this.oldDeposit
          } else if (res === true) {
            item.deposit += this.newDeposit
          }
        })
      }
    },
    transferInfo() {
      var arrayData = {
        bldgId: this.pDetail['pro']['_id'],
        leaseStartDate: new Date (this.pDetail['trans']["leaseStartDate"]),
        acceptedRent: this.pDetail['trans']["acceptedRent"],
        subletName: this.pDetail['trans']["subletName"],
        subletPhone: this.pDetail['trans']["subletPhone"],
        subletNIC: this.pDetail['trans']["subletNIC"],
      };
      console.log(arrayData)
      this.addsublet=false
      rentApi.rentTransferApi(arrayData).then(res => {
        if (res) {
          this.detailDialog=false;
          this.getTransHistory()
        }
      });
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
      console.log(this.permissions)
    }
  }
}
</script>

<style  scoped>
.border {
  border: 1px solid black;
}

.pad {
  padding-left: 1%;
}
</style>
