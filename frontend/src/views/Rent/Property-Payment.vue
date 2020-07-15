<template>
  <v-container
    fill-height
    fluid
    grid-list-xl>
    <v-layout wrap>
      <v-flex
        md12
        lg12>
        <!-- can make this component will do after -->
        <v-card
          v-bind="$attrs"
          v-on="$listeners">
          <helper-offset>
            <v-toolbar
              color="orange"
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
        <!-- will do som other Time -->
        <v-data-table
          v-if="approve"
          :headers="paymnet_headers"
          :items="approve"
          :search="search"
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
            slot-scope="{  index , item }">
            <td>{{ item.bldg.address }}</td>
            <td>{{ item.bldg.type }}</td>
            <td>{{ item.owner.tenantName }}</td>
            <td>{{ item.ownerRent }}/month</td>
            <td>{{ item.purchaseAmount }}</td>
            <td>{{ item.paidAmount }}</td>
            <td>{{ item.lastDate }}</td>
            <td class="text-xs-center">
              <v-icon
                large
                @click="showData(item)">mdi-format-page-break</v-icon>

              <v-icon
                large
                @click="payShow(item)">mdi-card-account-details</v-icon>
            </td>
          </template>
          <template v-slot:no-data>
            <v-flex text-xs-center>
              <v-progress-circular
                :width="3"
                :size="50"
                color="red"
                indeterminate/>
            </v-flex>
          </template>
        </v-data-table>
      </v-flex>
    </v-layout>

    <v-dialog
      v-model="detailDialog"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition">
      <v-card tile>
        <v-toolbar
          card
          dark
          color="black">
          <v-btn
            icon
            dark
            @click="detailDialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title class="white--text">Property Details</v-toolbar-title>
          <v-spacer />
          <!-- :disabled="pDetail.purchase <50 || pDetail.process == 'Transfer'" -->
          <v-toolbar-items>
            <v-btn
            :disabled="pDetail.purchase <50 || pDetail.process == 'Transfer'"
              fab
              class="mr-1"
              color="success"
              @click="status='Transfer';statusDialog=true;"
            >Approve</v-btn>
            <v-btn
              fab
              class="mr-1"
              color="red"
              @click="status='Rejected';statusDialog=true;">
              <span>Reject</span>
            </v-btn>
          </v-toolbar-items>
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
                <v-flex md8>
                  <v-text-field
                    v-model="pDetail.bldg.address"
                    label="ADDRESS"
                    outline
                    readonly />
                </v-flex>
                <v-flex md2>
                  <v-text-field
                    v-model="pDetail.bldg.sqft"
                    label="AREA"
                    outline
                    readonly />
                </v-flex>
                <v-flex md2>
                  <v-text-field
                    v-model="pDetail.bldg.bedroom"
                    label="BEDROOM"
                    outline
                    readonly />
                </v-flex>
                <v-flex md2>
                  <v-text-field
                    v-model="pDetail.bldg.bathroom"
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
                    v-model="pDetail.bldg.detail"
                    label="DETAIL"
                    outline
                    readonly
                    no-resize
                  />
                </v-flex>
              </v-layout>
            </v-card>
          </v-flex>
        </v-container>

        <v-container
          fluid
          grid-list-xl>
          <v-card-text>
            <v-layout>
              <v-flex>
                <h3>Owner Information</h3>
              </v-flex>
              <v-spacer />
              <v-flex
                md1
                align-self-end
                text-xs-right />
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
                    v-model="pDetail.owner.tenantName"
                    label="NAME"
                    outline
                    readonly />
                </v-flex>
                <v-flex md3>
                  <v-text-field
                    v-model="pDetail.owner.tenantPhone"
                    label="PHONE"
                    outline
                    readonly />
                </v-flex>
                <v-flex md3>
                  <v-text-field
                    v-model="pDetail.owner.tenantNIC"
                    label="PHONE"
                    outline
                    readonly />
                </v-flex>
                <v-flex md2>
                  <v-text-field
                    v-model="pDetail.owner.tenantNIC"
                    label="PHONE"
                    outline
                    readonly />
                </v-flex>
                <v-flex md8>
                  <v-text-field
                    v-model="pDetail.owner.tenantAddress"
                    label="PERMENANT ADDRESS"
                    outline
                    readonly
                  />
                </v-flex>
                <v-flex md8>
                  <v-textarea
                    v-model="pDetail.owner.tenantDetail"
                    label="DETAIL"
                    outline
                    readonly
                    no-resize
                  />
                </v-flex>
              </v-layout>
            </v-card>
          </v-flex>
        </v-container>

        <v-container
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
                    v-model="pDetail.signDate"
                    label="SIGNED"
                    outline
                    readonly />
                </v-flex>
                <v-flex md2>
                  <v-text-field
                    v-model="pDetail.lastDate"
                    label="Last Date"
                    outline
                    readonly />
                </v-flex>
                <v-flex md2>
                  <v-text-field
                    v-model="pDetail.purchaseAmount"
                    label="Purcahse Price"
                    outline
                    readonly
                  />
                </v-flex>
                <v-flex md2>
                  <v-text-field
                    v-model="pDetail.ownerRent"
                    label="Owner Rent"
                    outline
                    readonly />
                </v-flex>
              </v-layout>
            </v-card>
          </v-flex>
        </v-container>
        <div style="flex: 1 1 auto;" />
      </v-card>
    </v-dialog>

    <v-dialog
      v-model="statusDialog"
      persistent
      max-width="450">
      <v-card>
        <v-flex pl-5>
          <v-card-title class="headline">You Sure Want to {{ status }}</v-card-title>
        </v-flex>
        <v-card-text class="font-weight-bold text-xs-center">
          <span v-text="' Ownership to  '" />
          <kbd>{{ pDetail.owner.tenantName }}</kbd>
          <span v-text="' for '" />
          <kbd>{{ pDetail.bldg.address }}</kbd>
        </v-card-text>
        <v-card-text
          v-if="status=='Transfer'"
          class="font-weight-bold  text-xs-center">
          <v-form ref="depform">
            <v-layout justify-center>
              <v-flex
                pt-4
                md4>
                <span v-text="' with deposit of '" />
              </v-flex>
              <v-flex md3>
                <v-text-field
                  v-model.number="deposit"
                  typr="Number"
                  label="Amount"
                  outline />
              </v-flex>
            </v-layout>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="orange darken-1"
            flat
            @click="statusDialog = false">Disagree</v-btn>
          <v-btn
            color="green darken-1"
            flat
            @click="secTestModal=true; approved(status);statusDialog = false">Agree</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog
      v-model="payDialog"
      persistent
      width="600">
      <v-card style="padding:1%">
        <v-layout row>
          <v-flex
            sx1
            lg1
            hidden-print-only>
            <v-icon
              large
              color="red"
              @click="payDialog=false;$refs.payform.reset()">mdi-close-box</v-icon>
          </v-flex>
          <v-flex
            sx11
            lg11
            text-xs-center>
            <h3>Payment Amount</h3>
          </v-flex>
        </v-layout>

        <v-layout class="font-weight-medium">
          <v-flex>
            <span>Purchase Amount: {{ paying.purchaseAmount }}</span>
          </v-flex>
          <v-flex>
            <span>Paid Amount: {{ paying.paidAmount }}</span>
          </v-flex>
          <v-flex>
            <span>Balance: {{ paying.purchaseAmount-paying.paidAmount }}</span>
          </v-flex>
        </v-layout>
        <br >
        <v-layout class="font-weight-medium">
          <v-flex>
            <span>Last Date: {{ paying.lastDate }}</span>
          </v-flex>
          <v-flex>
            <span>currentDate: {{ paying.today }}</span>
          </v-flex>
        </v-layout>
        <br >
        <v-form
          ref="payform"
          v-model="payValid">
          <v-layout
            wrap
            row
            justify-space-around>
            <v-flex md3>
              <v-text-field
                v-model.number="paying.amount"
                :rules="reqRules"
                label="Amount"
                type="Number"
              />
            </v-flex>
            </v-layout>
            <v-layout wrap
              row
            >
            <v-flex md3>
              <v-autocomplete
                v-model="paying.method"
                :items="method"
                label="Payment Method"
              />
            </v-flex>
            <v-flex offset-md1 md3 v-if="paying.method == 'BANK'">
              <v-text-field
                v-model="paying.chequeId"
                label="Cheque No"
              />
            </v-flex>
          </v-layout>
        </v-form>
        <v-card-actions>
          <v-spacer />
          <v-btn
            :disabled="!payValid"
            color="green"
            @click="payment(paying)">slip</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog
      v-model="testModal"
      width="1000"
      persistent>
      <v-card>
        <v-card-actions>
          <v-flex >
            <v-icon
              large
              color="red"
              hidden-print-only
              @click="testModal=false">mdi-close-box</v-icon>
          </v-flex>
          
        </v-card-actions>
        <div id="payment">

          <v-container style="padding:30px 0 12px 0">
            <v-layout row>
              <v-flex
                text-xs-center
                lg9>
                <span class="title" >Al Mahallahtul Burhaniyah Trust</span><br>
                <span class="caption" >(Charitable Trust)</span><br>
                <span class="subheading">Sf-18, Block "E" Barkat-e-Haidery,</span><br>
                <span class="subheading">North Nazimabad, Karachi-74700,</span><br>
                <span class="subheading">Telephones: (021)36637357,(021)36630696 </span>
              </v-flex>
              <v-divider vertical />
              <v-flex
                text-xs-left
                lg3>
                <v-layout column style="padding-left:10px">
                  <v-flex  headline text-xs-center>
                    <span style="text-decoration: underline;">Receipt</span>
                  </v-flex>

                  <v-flex pt-5>
                    <v-layout >
                      <v-flex pt-4 md1>
                        Dt:
                      </v-flex>
                      <v-flex pa-0 md10>
                        <v-text-field readonly></v-text-field>
                      </v-flex>
                    </v-layout>
                  </v-flex>
                </v-layout>

              </v-flex>
            </v-layout>
            <v-divider horizontal />
          </v-container>
          <v-container pt-0>
            <v-layout
              column>
              <v-layout pt-0 mt-0>
                <span class="padding-to-chalan ">Received with thanks from</span>
                
                <v-text-field readonly></v-text-field>
                
              </v-layout>

              <v-layout pt-0 mt-0>
                
                <span class="padding-to-chalan ">residing at </span>
                
                
                
                <v-text-field pl-3 readonly></v-text-field>
                
              </v-layout>

              <v-layout pt-0 mt-0>
                <span class="padding-to-chalan ">the sum of Rs.</span>
                
                <v-flex md3>
                  <v-text-field readonly></v-text-field>
                </v-flex>

                <span class="padding-to-chalan font-weight-bold">(</span>

                
                <v-text-field readonly></v-text-field>
                

                <span class="padding-to-chalan font-weight-bold">)</span>
              </v-layout>
              
              <v-layout pt-0 mt-0>
                <span class="padding-to-chalan ">being the Security Deposit (Final/</span>
                
                <v-flex md1>
                  <v-text-field readonly></v-text-field>
                </v-flex>

                <span class="padding-to-chalan ">installment) of Shop / Flat No.</span>

                <v-flex md2>
                  <v-text-field readonly></v-text-field>
                </v-flex>

                <span class="padding-to-chalan ">on</span>
                
                <v-text-field readonly></v-text-field>
                
              </v-layout>

              <v-layout pt-0 mt-0>
                <span class="padding-to-chalan ">floor in sub block/ builing</span>
                

                <v-text-field readonly></v-text-field>
                

                <span class="padding-to-chalan">on rental basis, subject to Agreement.</span>

              </v-layout>

              <v-layout pt-0 mt-0 >
                <v-spacer />

                <span class="padding-to-chalan extra-pad"> For</span>
                <span class="padding-to-chalan font-weight-bold">&nbsp; Al Mahallahtul Burhaniyah Trust. </span>

              </v-layout>

            </v-layout>

          </v-container>

          <v-card-actions>
            <v-spacer />
            <span> <b>Trustee</b></span>
          </v-card-actions>
        </div>
      </v-card>
    </v-dialog>
    <!--START Ownership form-->
    <v-dialog
      v-model="ownerDialog"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
      scrollable
    >
      <v-card tile>
        <v-toolbar
          card
          dark
          color="primary">
          <v-btn
            icon
            dark
            @click="ownerDialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>Ownership Act Form</v-toolbar-title>
          <v-spacer />
        </v-toolbar>
        <v-card-text class="text-xs-center">
          <div>
            <h2>Ownership Acceptance Form</h2>
            <v-form
              ref="ownerShipForm"
              v-model="ownervalid">
              <v-container
                grid-list-md
                style="font-size:20">
                <v-layout
                  row
                  wrap>
                  <v-flex xs6>
                    <v-text-field
                      v-model="pDetail.bldg.owner"
                      :rules="reqRules"
                      label="Landlord's Name  "
                      required
                    />
                  </v-flex>
                  <v-flex xs6>
                    <v-text-field
                      v-model="pDetail.bldg.address"
                      :rules="reqRules"
                      label="Landlord's Address"
                      required
                    />
                  </v-flex>
                  <v-flex xs6>
                    <v-text-field
                      v-model="pDetail.owner.tenantName"
                      :rules="reqRules"
                      label="New Owner's Name"
                    />
                  </v-flex>
                  <v-flex xs3>
                    <v-text-field
                      v-model="pDetail.signDate"
                      :rules="reqRules"
                      label="current Date"
                      readonly
                      required
                    />
                  </v-flex>
                  <v-flex xs3>
                    <v-text-field
                      v-model="pDetail.lastDate"
                      :rules="reqRules"
                      label="Last Date of full Paymnet"
                      readonly
                      required
                    />
                  </v-flex>
                </v-layout>
                <v-layout
                  row
                  wrap>
                  <v-flex xs3>Property Purchase Amount is</v-flex>
                  <v-flex xs2>
                    <v-text-field
                      v-model.number="pDetail.purchaseAmount"
                      :rules="reqRules"
                      type="number"
                      label="Amount/Month"
                      required
                    />
                    <br >
                  </v-flex>
                </v-layout>
                <v-layout
                  row
                  wrap>
                  <v-flex xs3>Enter a Monthly Payment.</v-flex>

                  <v-flex xs2>
                    <v-text-field
                      v-model.number="pDetail.ownerRent"
                      :rules="reqRules"
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
    <!--END Ownership form-->

     <v-dialog
      v-model="secTestModal"
      width="1000"
      persistent>
      <v-card>
        <v-card-actions>
          <v-flex hidden-print-only>
            <v-icon
              large
              color="red"
              @click="secTestModal=false">mdi-close-box</v-icon>
          </v-flex>

          
        </v-card-actions>
        <div id="printOSF">

          <v-container style="padding:30px 0 12px 0">
            <v-layout row>
              <v-flex text-xs-center >
                <span class="font-weight-bold display-1" >Al-Mohallahtul Burhaniyah Trust</span><br>
                <span class="headline">Block "E" North Nazimabad,</span><br>
                <span class="headline">Karachi-74700</span><br>
              </v-flex>
             
            </v-layout>
          </v-container>
          <v-container pt-0>
            <v-layout
              column
              >
              <v-layout pt-0 mt-0>
                <v-flex pa-1></v-flex>
                  <v-spacer/>
                <span class="padding-to-chalan text-xs-right ">Date:</span>
                <v-flex>
                  <v-text-field readonly class="shrink"/>
                </v-flex>
                
              </v-layout>

              <v-layout pt-0 mt-0>
               
                <span class="padding-to-chalan"><span class="font-weight-bold">Received </span>from</span>
                <v-flex md12>
                <v-text-field pl-3 readonly></v-text-field>
                </v-flex>
              </v-layout>

              <v-layout pt-0 mt-0>
    
                
                <v-flex md12>
                  <v-text-field readonly></v-text-field>
                </v-flex>

               </v-layout>
              
              <v-layout pt-0 mt-0>
                <span class="padding-to-chalan">the sum of Rs.</span>
                
                <v-text-field readonly></v-text-field>

              </v-layout>

              <v-layout pt-0 mt-0>
                <v-flex md5>
                  <v-text-field readonly></v-text-field>
                </v-flex>

                <span class="padding-to-chalan">by cash/ Cheque No.</span>
                
                <v-text-field readonly></v-text-field>

              </v-layout>

              <v-layout pt-0 mt-0>
                <span class="padding-to-chalan">being</span>
                
                <v-text-field readonly></v-text-field>

              </v-layout>

              <v-layout pt-0 mt-0>
                <span class="padding-to-chalan">Rs.</span>
                <v-text-field readonly></v-text-field>
                <v-spacer />

                <span class="padding-to-chalan ">for <span class="font-weight-bold">AL-MOHALLAHTUL BURHANIYAH TRUST.</span></span>

              </v-layout>

            </v-layout>

          </v-container>
        
          <v-card-actions>
            <v-spacer />
            <span>Managing Trustee/ Jt. Managing Trustee.</span>
          </v-card-actions>
        </div>
      </v-card>
    </v-dialog>


  </v-container>
</template>

<script>
import constants from '../../services/constants'
import rentApi from '../../services/rent-api'
import coaApi from '../../services/coa-api'
export default {
  data () {
    return {
      approve: [],
      search: undefined,
      paymnet_headers: constants.PAYMENT_HEADER,
      detailDialog: false,
      pDetail: {
        bldg: {},
        owner: {}
      },
      status: undefined,
      statusDialog: false,

      reqRules: [v => !!v || ' required'],
      paying: {},
      payDialog: false,
      payValid: false,

      method: ['CASH','BANK'],
      deposit: 0,
      ownerDialog: false,
      ownervalid: false,
      testModal: false,
      secTestModal:false
    }
  },
  created () {
    this.getApproval()
  },
  methods: {
    getApproval () {
      rentApi.getApprovals('Approved').then(res => {
        if (res) {
          console.log(res)
          this.approve = res
        }
      })
    },
    showData (item) {
      this.pDetail = Object.assign({}, item)
      this.pDetail['purchase'] = Math.round(
        (this.pDetail['paidAmount'] / this.pDetail['purchaseAmount']) * 100
      )
      this.detailDialog = true
    },
    getCOAheads () {
      coaApi.getCoa().then(resp => {
        this.coaHeads = resp
      })
    },
    approved (set) {
      // console.log(this.pDetail)
      var change = {
        id: this.pDetail._id,
        type: this.pDetail.bldg.type,
        status: set,
        deposit: this.deposit || 0,
        owner: this.pDetail['owner'].tenantName,
        bldgId: this.pDetail['bldg']._id,
        paidAmount: this.pDetail['paidAmount'],
        date: new Date().toISOString().substr(0, 10)
      }
      rentApi.approved(change).then(res => {
        if (res) {
          this.printOSF()
          // this.$refs.ownerShipForm.reset() // reset the dialog box feilds
          // this.$refs.depform.reset() // reset the dialog box feilds
          // this.detailDialog = false
          // this.getApproval()
        }
      })
    },
    
    payShow (item) {
      this.paying = {
        id: item._id,
        ownid: item.owner._id,
        owner: item.owner.tenantName,
        bldgId: item.bldg._id,
        today: new Date().toISOString().substr(0, 10),
        purchaseAmount: item.purchaseAmount,
        paidAmount: item.paidAmount,
        lastDate: item.lastDate
      }
      this.payDialog = true
      this.getCOAheads()
    },

    payment (paying) {
      paying.today = new Date()
      rentApi.ownerPayment(paying).then(res => {
        if (res) {
          // this.testModal = true
          this.printPayment()
          // this.$refs.payform.reset()
          // this.payDialog = false
          // this.getApproval()
        }
      })
    },

    printOSF () {
      const modal = document.getElementById('printOSF')
      modal.style.width = 700 + 'px'
      modal.style.maxwidth = 100 + '%'
      const cloned = modal.cloneNode(true)
      let section = document.getElementById('print')
      if (!section) {
        section = document.createElement('div')
        section.id = 'print'
        document.body.appendChild(section)
      }
      section.innerHTML = ''
      section.appendChild(cloned)
      window.print()
      modal.style.width = 700 + 'px'
      modal.style.maxwidth = 100 + '%'


      this.$refs.ownerShipForm.reset() // reset the dialog box feilds
      this.$refs.depform.reset() // reset the dialog box feilds
      this.detailDialog = false
      this.getApproval()
       this.secTestModal=false
    },

    printPayment () {
      const modal = document.getElementById('payment')
      modal.style.width = 100 + '%'
      const cloned = modal.cloneNode(true)
      let section = document.getElementById('print')
      if (!section) {
        section = document.createElement('div')
        section.id = 'print'
        document.body.appendChild(section)
      }
      section.innerHTML = ''
      section.appendChild(cloned)
      window.print()
      modal.style.width = 100 + '%'
     
      this.$refs.payform.reset()
      this.payDialog = false
      this.getApproval()
    }
  }
}
</script>

<style>
.extra-pad {padding-right: 10px;}
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
.padding-to-chalan {
  padding-top: 30px;
} 
</style>
