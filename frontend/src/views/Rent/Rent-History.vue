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
              color="orange"
              dark
              tabs>
              <v-flex xs2>
                <v-text-field
                  v-model="search"
                  class="mr-2"
                  flat
                  solo-inverted
                  dense
                  clearable
                  prepend-inner-icon="mdi-magnify"
                >
                  <template slot="label">
                  <span
                    class="lbl_clr"
                    v-text="'Search Item'" />
                </template>
                </v-text-field>
              </v-flex>
              <v-flex xs2>
                <v-menu
                  v-model="menu2"
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
                      v-model="date"
                      label="Date"
                      readonly
                      v-on="on" >
                      <template slot="label">
                        <span
                          class="lbl_clr"
                          v-text="'Date'" />
                      </template>
                    </v-text-field>
                  </template>
                  <v-date-picker
                    v-model="date"
                    type="month"
                    dark
                    no-title
                    @input="menu2 = false; MonthFilter(date)"
                  />
                </v-menu>
              </v-flex>
              <v-spacer/>
              <v-flex text-xs-right @click="getBanks();bankDialog=true;">
                <v-btn black small>Set Bank</v-btn>
              </v-flex>
            </v-toolbar>
          </helper-offset>
        </v-card>

        <v-data-table
          :headers="item_headers"
          :items="data"
          :search="search"
          hide-actions
          loading>
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
            <td>
              <span v-for ="(obj,index) of item.tenant" :key="index">
                <span >{{'- '+ obj }}<br></span>
              </span>
            </td>
            <td>
              <span v-if="item.subletName" >{{ item.subletName }}</span>
              <span v-else class="text-xs-center"> - </span>
            </td>
            <td>{{ item.address }}</td>
            <td>{{ item.ownerRent }}/month </td>
            <td>
              <span
                v-if="item.acceptedRent"
              >{{ item.acceptedRent }}/month</span>
              <span
                v-else
                class="text-xs-center"
              >-</span>
            </td>
            <td width="1%">
              <v-icon
                :disabled="!permissions['add']"
                large
                class="text-danger"
                @click="openRent(item)"
              >mdi-account</v-icon>
            </td>
            <td
              class="text-xs-center"
              :class="{ 'success--text': fineDate <= new Date(item.curMonth), 'error--text': fineDate > new Date (item.curMonth) }"
              @click="tenantFilter(item)"
            >
              <span
                class="subheading cursor"
              >
                {{ item.paidMonth= new Date(item.curMonth).getMonth()- fineDate.getMonth()
                + (12 * ( new Date(item.curMonth).getFullYear() - fineDate.getFullYear())) }}
                Month
              </span>
              <v-icon
                class="text-info cursor"
                >mdi-view-list</v-icon>
            </td>
            <td 
              class="text-xs-center"
              :class="{ 'success--text': fineDate <= new Date(item.subMonth), 'error--text': fineDate > new Date(item.subMonth) }"
              @click="subletFilter(item)"
            >
              <span
                v-if="item.subMonth"
                class="subheading cursor"
              >
                  {{ item.paidMonth= new Date(item.subMonth).getMonth()- fineDate.getMonth()
                + (12 * ( new Date (item.subMonth).getFullYear() - fineDate.getFullYear())) }}
                Month
                <v-icon
                  class="text-info cursor"
                >mdi-view-list</v-icon>
              </span>
              
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

    <v-dialog
      v-model="detailDialog"
      width="800">
      <v-card>
        <v-layout justify-space-between>
          <v-icon
            large
            color="red"
            @click="detailDialog=false">mdi-close-box</v-icon>
          <v-icon
            large
            color="success"
            @click="printHistory('printHistory')">mdi-printer</v-icon>
        </v-layout>
        <div id="printHistory">
          <v-container style="padding:0 0 12px 0">
            <v-layout justify-center>
              <span class="display-1">Rent History</span>
            </v-layout>
            <v-layout justify-center>
              <span class="font-weight-bolder text--darken-3">Tenant:{{ pDetail.tenantName }}</span>
            </v-layout>
            <v-layout justify-center>
              <span class="font-weight-bolder text--darken-3">Address:{{ pDetail.address }}</span>
            </v-layout>
          </v-container>
          <v-container>
            <v-data-table
              :headers="dialog_headers"
              :items="slipArray"
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
                <td>{{ item.month }}</td>
                <td>{{ new Date (item.date).toISOString().substr(0, 10) }}</td>
                <td>{{ item.amount }}</td>
                <td>{{ item.lessDeposit }}</td>
                <td>{{ item.mant }}</td>
                <td>{{ item.OChrg }}</td>
                <td>{{ item.amount - item.lessDeposit + item.mant +item.OChrg }}</td>
              </template>
            </v-data-table>
          </v-container>
        </div>
      </v-card>
    </v-dialog>

    <v-dialog
      v-model="subdetailDialog"
      width="800">
      <v-card>
        <v-layout justify-space-between>
          <v-icon
            large
            color="red"
            @click="subdetailDialog=false">mdi-close-box</v-icon>
          <v-icon
            large
            color="success"
            @click="printHistory('printSubHistory')">mdi-printer</v-icon>
        </v-layout>
        <div id="printSubHistory">
          <v-container style="padding:0 0 12px 0">
            <v-layout justify-center>
              <span class="display-1">Sublet Rent History</span>
            </v-layout>
            <v-layout justify-center>
              <span class="font-weight-bolder text--darken-3">Tenant:{{ pDetail.tenantName }}</span>
            </v-layout>
            <v-layout justify-center>
              <span class="font-weight-bolder text--darken-3">Address:{{ pDetail.address }}</span>
            </v-layout>
          </v-container>
          <v-container>
            <v-data-table
              :headers="dialog_headers"
              :items="slipArray"
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
                <td>{{ item.month }}</td>
                <td>{{ new Date (item.date).toISOString().substr(0, 10) }}</td>
                <td>{{ item.amount }}</td>
              </template>
            </v-data-table>
          </v-container>
        </div>
      </v-card>
    </v-dialog>

    <v-dialog
      v-model="rentDialog"
      persistent
      width="650">
      <v-card style="padding:1%">
        <v-layout row>
          <v-flex
            sx1
            lg1>
            <v-icon
              large
              color="red"
              @click="rentClose()">mdi-close-box</v-icon>
          </v-flex>
          <v-flex
            sx11
            lg11
            headline
            text-xs-center>
            Owner Rent Payment
          </v-flex>
        </v-layout>
          <v-form
            ref="payform"
            v-model.number="payValid">
            <v-layout
              pl-4>
              <v-flex md3>
                <v-select
                  v-model.number="paying.secMeth"
                  :items="sec_meths"
                  item-text="name"
                  item-value="id"
                  label="Select Month"
                  @change="rentMethod(paying.secMeth)"
                />
              </v-flex>
                <v-flex offset-md2 md2>
                  <v-text-field
                    :disabled="paying.secMeth >0"
                    v-model.number="paying.amount"
                    :rules="reqRules"
                    label="Amount"
                    type="Number"
                  />
              </v-flex>
                <v-flex md2 offset-md1>
                <v-text-field
                  v-if="own.relief"
                  label="Relief"
                  v-model.number="own.ref"
                  type="number"
                />
                <v-text-field
                  v-if="own.panelty"
                  label="panelty"
                  v-model.number="own.pan"
                  type="number"
                />
              </v-flex>
              <v-flex offset-md1 md1>
                <v-icon v-if="!own.relief" color="blue" @click="own={relief:true, panelty: false}">mdi-plus-box</v-icon>
                <v-icon v-if="!own.panelty" color="warning" @click="own={relief:false, panelty: true}">mdi-minus-box</v-icon>
                <v-icon v-if="own.relief || own.panelty" color="error" @click="own={relief:false, panelty: false}">mdi-close-box</v-icon>
              </v-flex>
            </v-layout>
            <v-layout
              wrap
              row
              justify-space-around>
            </v-layout>
            <br/>
            <v-layout pl-4 v-if="!showSubRent">
              <v-flex md3>
                <v-select
                  v-model="pDetail.paymeth"
                  :items="['Cash','Bank']"
                  label="Select Method"
                />
              </v-flex>
              <v-flex offset-md2 md4 v-show="pDetail.paymeth=='Bank'">
                <v-text-field 
                  v-model="pDetail.chequeId"
                  label="Cheaque No"
                />
              </v-flex>
            </v-layout>
            <br>
            <v-card-actions v-if="!showSubRent">
              <div v-if="pDetail.acceptedRent && !showSubRent">
                <v-btn class="success" @click="showSubRent= !showSubRent">Show Sublet Rent Paymnet</v-btn>
              </div>
              <v-spacer/>
              <v-btn
                :disabled="!payValid && !pDetail.paymeth"
                color="green"
                @click="createSlip(paying)">slip</v-btn>
            </v-card-actions>
          </v-form>
          <div v-show="pDetail.acceptedRent && showSubRent">
             <v-layout row justify-space-between>
               <v-icon
              large
              color="red"
              @click="rentSubClose()">mdi-progress-close</v-icon>
          <v-flex
            text-xs-center
            headline
            >
            Sublet Rent Payment
          </v-flex>
        </v-layout>
        <br>
          <v-form
            ref="subPayform"
            v-model="subPayValid"
          >
            <v-layout
              wrap
              pl-4>
              <v-flex md3>
                <v-select
                  v-model.number="paying.subSecMeth"
                  :items="sec_meths"
                  item-text="name"
                  item-value="id"
                  label="Select Month"
                  @change="subMethod(paying.subSecMeth)"
                />
              </v-flex>
              <v-flex offset-md2 md2>
                <v-text-field
                  :disabled="paying.subSecMeth > 0"
                  v-model.number="paying.subAmount"
                  :rules="numRule"
                  label="Amount"
                  type="Number"
                />
              </v-flex>
              <v-flex md2 offset-md1>
                <v-text-field
                  v-if="sub.relief"
                  label="Relief"
                  v-model.number="sub.ref"
                  type="number"
                />
                <v-text-field
                  v-if="sub.panelty"
                  label="panelty"
                  v-model.number="sub.pan"
                  type="number"
                />
              </v-flex>
              <v-flex offset-md1 md1>
                <v-icon v-if="!sub.relief" color="blue" @click="sub={relief:true, panelty: false}">mdi-plus-box</v-icon>
                <v-icon v-if="!sub.panelty" color="warning" @click="sub={relief:false, panelty: true}">mdi-minus-box</v-icon>
                <v-icon v-if="sub.relief || sub.panelty" color="error" @click="sub={relief:false, panelty: false}">mdi-close-box</v-icon>
              </v-flex>
            </v-layout>
            <br/>
            <v-layout pl-4>
              <v-flex md3>
                <v-select
                  v-model="pDetail.paymeth"
                  :items="['Cash','Bank']"
                  label="Select Method"
                />
              </v-flex>
              <v-flex offset-md2 md4 v-show="pDetail.paymeth=='Bank'">
                <v-text-field 
                  v-model="pDetail.chequeId"
                  label="Cheaque No"
                />
              </v-flex>
            </v-layout>
            <br>
            <v-card-actions>
              <v-spacer />
              <v-btn
                :disabled="!payValid && !subPayValid && !pDetail.paymeth"
                color="green"
                @click="createSlip(paying)">slip</v-btn>
            </v-card-actions>
          </v-form>
          </div>
      </v-card>
    </v-dialog>

    <v-dialog
      v-model="slipDialog"
      max-width="100%"
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <v-container>
        <v-card>
          <div id="printThis">
            <v-layout row>
              <v-flex
                sx1
                lg1
                hidden-print-only>
                <v-icon
                  large
                  color="red"
                  @click="slipDialogClose()">mdi-close-box</v-icon>
              </v-flex>
              <v-flex i>
                <h2 class="center">Deposit Slip</h2>
              </v-flex>
            </v-layout>
            <v-layout>
              <v-layout
                column
                align-space-between>
                <v-flex
                  ma-0
                  pa-0
                  align-self-center>
                  <span class="headline">Al-Mohallatul Burhaniyah Trust</span>
                </v-flex>
                <v-flex
                  ma-0
                  pa-0
                  pr-3>
                  <v-layout
                    row
                    justify-space-around
                    px-1>
                    <v-flex md2 />
                    <v-flex
                      md8
                      text-xs-center
                    >SF/14-18 Bloack 'E' North Nazimabad, Scheme No. 2, Karachi</v-flex>
                    <v-flex
                      md2
                      text-xs-right>Date : {{ pDetail.payDate }}</v-flex>
                  </v-layout>
                </v-flex>
                <v-flex
                  ma-0
                  pa-0
                  align-self-center>36631193</v-flex>
                <v-flex
                  ma-0
                  pa-0
                  align-self-center
                  body-2>Al-Burhan Arcade Flats</v-flex>
              </v-layout>
            </v-layout>
            <v-layout pl-2 
              font-weight-regular
            >
              <v-flex>
                <span>Shop/Flat: {{ pDetail.type }}</span>
              </v-flex>
              <v-flex>
                <span>Tenant: {{ pDetail.address }}</span>
              </v-flex>
              <v-flex>Name: {{ pDetail.ownerShip }}</v-flex>
            </v-layout>
            <div class="first">
              <v-layout 
                class="B-border"
              >
                <v-flex
                  text-xs-center
                  class="R-border"
                  grow
                >
                  <v-layout
                    row
                    class="B-border"
                    font-weight-medium
                  >
                    <v-flex
                      xs2
                      class="R-border">
                      <span>Rent</span>
                    </v-flex>
                    <v-flex
                      xs2
                      class="R-border">
                      <span>Other Charges</span>
                    </v-flex>
                    <v-flex
                      xs2
                      class="R-border"
                    >
                      <span class="caption font-weight-medium" >Mantainance</span>
                    </v-flex>
                    <v-flex
                      xs2
                      class="R-border">
                      <span>Less 10% Deposit</span>
                    </v-flex>
                    <v-flex
                      xs2
                      class="R-border">
                      <span>Advance</span>
                    </v-flex>
                    <v-flex
                      xs2
                      class="R-border"
                      v-show="own.pan||own.ref||sub.pan||sub.ref"  
                    >
                      <span v-if="own.ref||sub.ref">Relief</span>
                      <span v-if="(own.pan||sub.pan) && (own.ref||sub.ref)">/ <br></span>
                      <span v-if="own.pan||sub.pan">Panelty</span>
                    </v-flex>
                    <v-flex
                      xs2
                    >
                      <span>Total</span>
                    </v-flex>
                  </v-layout>

                  <v-layout
                    row
                    class="B-border"
                    v-if="pDetail.T_ownerRent"
                    font-weight-regular
                    >
                   
                    <v-flex
                      xs2
                      class="R-border"
                      text-xs-center
                    >
                      <span>{{ pDetail.T_ownerRent }}</span>
                    </v-flex>
                    <v-flex
                      xs2
                      class="R-border"
                      text-xs-center
                    >
                      <span>{{ pDetail.OChrg }}</span>
                    </v-flex>
                    <v-flex xs2
                     class="R-border"
                      text-xs-center
                    >
                      <span>{{ pDetail.manti||'-' }}</span>
                    </v-flex>
                    <v-flex
                      xs2
                      class="R-border"
                      text-xs-center
                    >
                      <span v-if="pDetail.lessDeposit">({{ pDetail.lessDeposit }})</span>
                      <span v-else>{{ '-' }}</span>
                    </v-flex>
                    <v-flex
                      xs2
                      class="R-border"
                      text-xs-center
                    >
                      <span v-if="pDetail.advance">({{ pDetail.advance }})</span>
                      <span v-else>{{ "-" }}</span>
                    </v-flex>
                    <v-flex
                      xs2
                      text-xs-center
                      class="R-border"
                      v-show="own.pan||own.ref||sub.pan||sub.ref"
                    >
                      <span v-if="own.ref">({{own.ref }})</span>
                      <span v-else-if="own.pan">{{own.pan}}</span>
                      <span v-else >-</span>
                    </v-flex>
                     <v-flex
                      xs2
                      text-xs-center
                    >
                      <span>{{pDetail.ownerPay}}</span>
                    </v-flex>
                  </v-layout>

                  
                  <v-layout
                    row
                    class="B-border"
                    v-if="pDetail.T_acceptedRent"
                    font-weight-regular
                    >
                    <v-flex
                      xs3
                      class="R-border"
                      text-xs-center
                    >
                      <span>{{ pDetail.T_acceptedRent }}</span>
                    </v-flex>
                    <v-flex
                      xs3
                      class="R-border"
                      text-xs-center
                    >
                      <span>-</span>
                    </v-flex>
                    <v-flex
                      xs3
                      class="R-border"
                      text-xs-center
                      >
                      <span>-</span>
                    </v-flex>
                    <v-flex xs3
                      class="R-border"
                      text-xs-center
                    >
                      <span>-</span>
                    </v-flex>
                    <v-flex
                      xs3
                      class="R-border"
                      text-xs-center
                    >
                      <span v-if="pDetail.subAdv">({{ pDetail.subAdv || '-'}})</span>
                      <span v-else>-</span>
                    </v-flex>
                     <v-flex
                      xs3
                      class="R-border"
                      v-show="own.pan||own.ref||sub.pan||sub.ref"
                    >
                      <span v-if="sub.ref">({{sub.ref }})</span>
                      <span v-else-if="sub.pan">{{sub.pan}}</span>
                      <span v-else >-</span>
                    </v-flex>
                     <v-flex
                      xs3
                      text-xs-center
                    >
                      <span>{{pDetail.subletpPay}}</span>
                    </v-flex>
                  </v-layout>

                  <v-layout column
                    font-weight-regular
                  >
                    <v-flex :class="[(!pDetail.T_acceptedRent || !pDetail.T_ownerRent) || (!pDetail.T_acceptedRent && !pDetail.T_ownerRent)  ? 'curMonth' : '']" ></v-flex>
                    <v-flex
                      mr-3
                      text-xs-right 
                      >
                      <span>Arrears:</span>
                    </v-flex>
                    <v-flex
                      mr-3
                      text-xs-right>
                      <span>Advance:</span>
                    </v-flex>
                    <v-flex
                      ml-3
                      text-xs-left
                      title>
                      <!-- <span>Cheque No:</span> -->
                      <v-flex pt-1>Total: {{ pDetail.Gtotal }}</v-flex>
                    </v-flex>
                    <v-flex
                      ml-3
                      text-xs-left>
                      <span>Paymnet Mode: {{pDetail.paymeth}}</span>
                    </v-flex>
                    <v-flex
                      ml-3
                      text-xs-left v-show="pDetail.paymeth=='Bank'"
                    >
                      cheque No: {{pDetail.chequeId}}
                    </v-flex>
                  </v-layout>


                </v-flex>

                <v-flex
                  class="R-border"
                  shrink
                  >
                  <v-layout
                    class="B-border"
                    pb-4
                    font-weight-medium
                  >
                    <v-flex xs12 text-xs-center>
                      <span>For the Month Of</span>
                    </v-flex>
                  </v-layout>

                 <v-layout
                    row
                    pb-2
                  >
                    <v-flex
                      v-if="pDetail.T_ownerRent"
                      body-2
                      sm-3
                      md-3
                      lg-3
                      pl-3
                    >Owner Rent </v-flex>
                    <v-flex
                      v-if="pDetail.T_acceptedRent"
                      body-2
                    > Sublet Rent</v-flex>
                  </v-layout>

                   <v-layout
                    column
                    pl-3
                    font-weight-regular
                  >
                    <v-layout
                      row
                    >
                      <v-flex  v-if="pDetail.T_ownerRent" :class="[!saveMonths.curr ? 'curMonth' : '']">
                        <span>{{ saveMonths.curr }}</span>
                      </v-flex>
                      <v-flex :class="[!subMonths.curr ? 'curMonth' : '']">
                        <span>{{ subMonths.curr }}</span>
                      </v-flex>
                    </v-layout>

                    <v-layout
                      row
                    >
                      <v-flex v-if="pDetail.T_ownerRent" :class="[saveMonths.pre==0 ? 'curMonth' : '']">
                        <span>{{ saveMonths.pre[0] }}</span>
                        <span
                          v-if="saveMonths.pre.length > 1"
                        >&nbsp to {{ saveMonths.pre[saveMonths.pre.length-1] }}</span>
                      </v-flex>
                      <v-flex :class="[subMonths.pre==0 ? 'curMonth' : '']">
                        <span>{{ subMonths.pre[0] }}</span>
                        <span
                          v-if="subMonths.pre.length > 1"
                        >&nbsp to {{ subMonths.pre[subMonths.pre.length-1] }}</span>
                      </v-flex>
                    </v-layout>

                    <v-layout
                      row
                    >
                      <v-flex v-if="pDetail.T_ownerRent" :class="[saveMonths.adv == 0 ? 'curMonth' : '']">
                        <span>{{ saveMonths.adv[0] }}</span>
                        <span
                          v-if="saveMonths.adv.length > 1"
                        >&nbsp to {{ saveMonths.adv[saveMonths.adv.length-1] }}</span>
                      </v-flex>

                      <v-flex :class="[subMonths.adv == 0 ? 'curMonth' : '']">
                        <span>{{ subMonths.adv[0] }}</span>
                        <span
                          v-if="subMonths.adv.length > 1"
                        >&nbsp to {{ subMonths.adv[subMonths.adv.length-1] }}</span>
                      </v-flex>
                    </v-layout>

                  </v-layout>

                  <v-layout
                    pl-2
                    align-end
                    justify-center
                    style="min-height:70px">
                    <v-flex>
                      <span class="font-weight-medium">Rupees in Word: </span>
                      <span class="font-weight-regular">{{ inWords(parseInt(pDetail.Gtotal ||0)) }} only</span></v-flex>
                  </v-layout>

                </v-flex>
                  
                <v-flex shrink>
                   <v-layout
                    class="B-border"
                    pb-4
                    font-weight-medium
                  >
                  <v-flex xs12 text-xs-center>
                    <span>Advance/Deposit</span>
                  </v-flex>
                  </v-layout>

                   <v-layout
                    column
                    fill-height 
                    pl-1  
                  >
                    <v-flex xs12 v-show="pDetail.T_ownerRent">
                      <span class="font-weight-medium">Owner Adv: </span>
                      <span class="font-weight-regular">{{ pDetail.ownerAdv || 0 }}</span>
                    </v-flex>
                    <v-flex xs12 v-show="pDetail.T_acceptedRent">
                      <span class="font-weight-medium">Sublet Adv: </span>
                      <span class="font-weight-regular">{{ pDetail.subAdvance || 0 }}</span>
                    </v-flex>
                    <v-flex xs12 v-show="pDetail.T_ownerRent">
                      <span class="font-weight-medium">Left Dep: </span>
                      <span class="font-weight-regular">{{ pDetail.T_deposit || 0}}</span>
                      </v-flex>
                  </v-layout>

                </v-flex>
              </v-layout>

               <v-layout
                pt-5
                mt-5>
                <v-flex
                  class="T-border"
                  md2
                  text-xs-center>Signature of Payer</v-flex>
                <v-spacer />
                <v-flex
                  class="T-border"
                  md2
                  text-xs-center>Signature Rent Collector</v-flex>
              </v-layout>

            </div>

             <v-layout
              justify-center
              align-center>
              <v-flex md6>
                <p class="reds">*This is an auto generated slip and does not require signature</p>
              </v-flex>
              <v-flex md2 />
            </v-layout>
            <!-- <v-card-actions> -->
            <v-layout>
              <v-spacer />
              <v-flex
                md1
                hidden-print-only>
                <v-btn
                  color="green darken-1"
                  @click="paids();print();">Save</v-btn>
                  <!-- <v-btn
                color="green darken-1"
                @click="print();">Save</v-btn>-->
              </v-flex>
            </v-layout>
            <!-- </v-card-actions> -->
          </div>
        </v-card>
      </v-container>
    </v-dialog>

    <v-dialog
       v-model="bankDialog"
       width="500px"
    >
      <v-card>
        <v-layout justify-space-around>
          <v-flex md1>
            <v-icon
            large
            color="red"
            @click="$refs.BankForm.reset();bankDialog=false;">mdi-close-box</v-icon>
          </v-flex>
          <v-flex headline text-xs-center md10 pt-3 pr-5>SET BANK</v-flex>
        </v-layout>
          <v-card-text>
            
              <v-layout justify-space-around>
                <v-flex md4>
                  <v-text-field
                      readonly
                      v-model="bank.set"
                      label="Current Rent Bank"
                    />
                </v-flex>
                <v-flex pt-4 md2 text-xs-center title>
                  <span>set to</span>
                </v-flex>
                
                <v-flex md4>
                  <v-form ref="BankForm">
                    <v-autocomplete
                        auto-select-first
                        v-model="bank.setNew"
                        :items="bank.Banks"
                        item-text="name"
                        label="Set Rent Bank"
                      />
                    </v-form>
                </v-flex>
              </v-layout>
          </v-card-text>
          <v-card-actions>
            <v-spacer/>
            <v-btn small dark @click="setBank(bank.setNew)">Update</v-btn>
          </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar
      v-model="snackbar.stat"
      :color="snackbar.color"
      multi-line>
      <v-icon>{{ snackbar.icon }}</v-icon>
      <b>{{ snackbar.msg }}</b>
      <v-icon @click="snackbar.stat=false">mdi-close</v-icon>
    </v-snackbar>

  </v-container>
</template>

<script>
import rentApi from '../../services/rent-api'
import { v4 as uuidv4 } from 'uuid'
import coaApi from '../../services/coa-api'
import constants from '../../services/constants'
export default {
  data () {
    return {
      bankDialog:false,
      bank : {set:undefined,newSet:{},Banks:[]},
      coaHeads: [],
      headAcct: null,
      search: null,
      disThisBtn: false,
      menu2: false,
      dateMenu: false,
      tillMenu: false,
      detailDialog: false,
      slipDialog: false,
      rentDialog: false,
      item_headers: constants.RENT_HEADER,
      dialog_headers: constants.RENT_HISTORY,
      data: [],
      slipArray: [],
      pDetail: {},
      tempPdetail: {},
      date: new Date().toISOString().substr(0, 10),
      fineDate: null,
      Dates: [],
      fromDate: null,
      tillDate: null,
      multiply: 1,
      reqRules: [v => !!v || ' required'],
      numRule : [v => v >= 0 || 'required'],
      payValid: true,

      paying: { },
      saveMonths: {
        curr: undefined,
        pre: [],
        adv: []
      },

      snackbar: {},
      sec_meths: constants.SECLECT_METHODS,
      sub: {
        relief:false,
        panelty: false
      },
      own: {
        relief:false,
        panelty: false
      },
      showSubRent:false,
      subPayValid:false,

      subMonths:{
        curr: undefined,
        pre: [],
        adv: []
      },
     subdetailDialog :false,
    }
  },
  computed: {},
  created () {
    this.getPermissions()
    this.getData()
    this.getBank()
    this.getCOAheads()
  },
  methods: {
    getData () {
      rentApi.getRentDetail().then(res => {
        if (res.length>0){
          this.data = res
          this.fineDate = new Date()
        }
      })
    },
    getBanks () {
      coaApi.getBanks().then(res => {
        if (res.length>0){
          this.bank['Banks'] = res
        }
      })
    },
    setBank(set){
      var obj = {acc_name:set,purpose:'bank_rent'}
      coaApi.setBank(obj).then(res => {
        if (res){
          this.bank['set'] =res.acc_name
          this.bankDialog=false;
          this.$refs.BankForm.reset()
        }
      })
    },

    getBank(){
      var obj = {purpose:'bank_rent'}
      coaApi.getSave_Bank(obj).then(res => {
        if (res){
          this.bank['set'] =res.acc_name
        }
      })
    },

    tenantFilter (data) {
      this.pDetail = data
      this.slipArray = data.rent
      this.detailDialog = true
      this.dialog_headers= constants.RENT_HISTORY
    },

    subletFilter (data) {
      this.pDetail = data
      this.slipArray = data.subRent
      this.subdetailDialog = true
      this.dialog_headers= constants.SUB_RENT_HISTORY
    },

    MonthFilter (month) {
      this.fineDate = new Date(this.date)
    },

    openRent (item) {
      this.rentDialog = !this.rentDialog;
      this.pDetail = Object.assign({}, item);
      this.tempPdetail = Object.assign({}, this.pDetail)
    },
    rentClose(){
      this.rentDialog=false;
      this.$refs.payform.reset();
      this.$refs.subPayform.reset()
      this.saveMonths = { curr: undefined, pre: [], adv: [] }
      this.subMonths= { curr: undefined, pre: [], adv: [] }
      this.own={relief:false, panelty: false}
      this.sub={relief:false, panelty: false}
      this.showSubRent= false
      this.pDetail = {}
    },
    rentSubClose(){
      this.showSubRent= !this.showSubRent;
      this.$refs.subPayform.reset();
      this.sub={relief:false, panelty: false}
      this.subMonths={ curr: undefined, pre: [], adv: [] }
      this.pDetail['subDates'] = undefined
      this.pDetail['SubpayAmt'] = undefined
      this.pDetail['subletpPay'] = undefined
      this.pDetail['T_acceptedRent'] = undefined
      this.pDetail['subAdvance'] = undefined
    },
    slipDialogClose(){
      this.slipDialog =false;
      this.saveMonths = { curr: undefined, pre: [], adv: [] }
      this.subMonths= { curr: undefined, pre: [], adv: [] }
      this.pDetail = Object.assign({}, this.tempPdetail)
    },
    subMethod (met) {
      if (met > 0){
        var rent = this.pDetail['acceptedRent'] * met
        var adv = parseInt(this.pDetail['subAdv']) || 0
        this.paying.subAmount = adv > rent ? 0 : rent - adv

         /**New thing for seprate RR */
            // this.paying.subAmount = rent
            /**new thing */
      }
    },
    subletSlip (paying) {
      var subAdv = parseInt(this.pDetail['subAdv']) || 0
      var amount = paying.subAmount + subAdv
      var rent = this.pDetail['acceptedRent']
      var mydate = new Date(this.pDetail['subMonth']) || new Date()
      var curMonth = new Date(new Date().getFullYear(), new Date().getMonth())
      var monthNames = constants.MONTHS_NAMES
      var monthArray = []
      var sumRent = 0
      var loop = true

      while (loop){
        if (amount >=rent){
          amount -= rent
          sumRent += rent
          mydate = new Date(mydate.setMonth(mydate.getMonth() + 1))
          var months = `${
            monthNames[mydate.getMonth()]
          }-${mydate.getFullYear()}`
          monthArray.push(months)
          
          var mydateValue = new Date(new Date(mydate).getFullYear(), new Date(mydate).getMonth())


          if (curMonth.valueOf() == mydateValue.valueOf()) {
            this.subMonths.curr = months
          } else if (curMonth.valueOf() > mydateValue.valueOf()) {
            this.subMonths.pre.push(months)
          } else if (curMonth.valueOf() < mydateValue.valueOf()) {
            this.subMonths.adv.push(months)
          }
        }else{
          loop = false
        }
      }

      if (monthArray.length > 0) {
          this.pDetail['subDates'] = monthArray
          this.pDetail['SubpayAmt'] = paying.subAmount
          // this.pDetail['subletpPay'] = sumRent - subAdv
          this.pDetail['subletpPay'] = sumRent - subAdv + amount + (this.sub.pan||0) - (this.sub.ref || 0)
          this.pDetail['T_acceptedRent'] = sumRent
          this.pDetail['subAdvance'] = amount
        }
    },

    rentMethod (sec) {
      if (sec > 0) {
        var rent = this.pDetail['ownerRent'] * sec
        var Savedeposit = parseInt(this.pDetail['deposit'] || 0)
        var ownerAdv = this.pDetail['advance'] || 0
        var depositPer = 10
        var perD = Math.round((depositPer / 100) * this.pDetail['ownerRent'] || 0)
        var perD = perD * sec
        var dep = Savedeposit > perD ? perD : Savedeposit
        console.log({perD},{dep},{rent})
        // this.paying.amount = Math.round(rent - dep)
        this.paying.amount = Math.round(rent - ownerAdv - dep )
        this.paying.perD = Math.round(dep) 
        var otherCharges = 15
        var oChrg = Math.round((otherCharges / 100) * rent) || 0
        this.paying.oChrg = oChrg
      }
    },

    ownerSlip (paying) {
      var rent = parseInt(this.pDetail['ownerRent'])
      var Savedeposit = parseInt(this.pDetail['deposit']) || 0
      var ownerAdv = this.pDetail['advance'] || 0
      var depositPer = 10
      var perD = Math.round(((depositPer / 100) * rent) || 0)
      var otherCharges = 15
      var oChrg = Math.round(((otherCharges / 100) * rent)|| 0)
      var amount = (paying.amount || 0) + ownerAdv
      var mydate = new Date(this.pDetail['curMonth'])
      var curMonth = new Date(new Date().getFullYear(), new Date().getMonth())
      var mant = parseInt(this.pDetail.mant) || 0
      var monthNames = constants.MONTHS_NAMES
      var deposit = 0
      var monthArray = []
      var loop = true
      var sumRent = 0
      var RRPay = 0
      var URPay = 0
      var ownerPay = 0
      while (loop) {

        var dep = Savedeposit >= perD ? perD : Savedeposit
      
        if (amount + dep >= rent) {
          deposit += dep
          Savedeposit -= dep
          amount = amount - rent + dep
          // sumRent += rent

          /**New thing for seprate RR */
            ownerPay += mant + oChrg + rent - dep
            /**new thing */
          // console.log({rent,dep,amount,mant,oChrg,deposit,Savedeposit,ownerPay})
          mydate = new Date(mydate.setMonth(mydate.getMonth() + 1))
          var months = `${
            monthNames[mydate.getMonth()]
          }-${mydate.getFullYear()}`
          monthArray.push(months)
          
          var mydateValue = new Date(new Date(mydate).getFullYear(), new Date(mydate).getMonth())
          if (curMonth.valueOf() == mydateValue.valueOf()) {
            this.saveMonths.curr = months
            /**New thing for seprate RR */
            RRPay += mant + oChrg + rent - dep
            /**new thing */
          } else if (curMonth.valueOf() > mydateValue.valueOf()) {
            this.saveMonths.pre.push(months)
            /**New thing for seprate RR */
            RRPay += mant + oChrg + rent - dep
            /**new thin2  g */
          } else if (curMonth.valueOf() < mydateValue.valueOf()) {
            this.saveMonths.adv.push(months)
            /**New thing for seprate RR */
            URPay += mant + oChrg + rent - dep
            /**new thing */
          }
        }else{ 
          loop = false
        }
      }

      if (monthArray.length > 0) {
        this.pDetail['manti'] = mant * monthArray.length
        this.pDetail['Dates'] = monthArray
        this.pDetail['OChrg'] = Math.round(oChrg * monthArray.length)
        // this.pDetail['ownerPay'] = Math.round(mant * monthArray.length + oChrg * monthArray.length + sumRent - deposit -ownerAdv)
        this.pDetail['ownerPay'] = Math.round(ownerPay - ownerAdv + amount + ( this.own.pan || 0 ) - (this.own.ref || 0))
        this.pDetail['lessDeposit'] = deposit
        this.pDetail['ownerAdv'] = Math.round(amount)
        this.pDetail['T_ownerRent'] = rent * monthArray.length
        // this.pDetail['T_deposit'] = this.pDetail.deposit - deposit || 0
        this.pDetail['T_deposit'] = Savedeposit
        this.pDetail['RRPay'] = RRPay 
        this.pDetail['URPay'] = URPay
        } else {
        this.snackbar = {
          msg: 'Rent is not enough!',
          stat: true,
          color: 'red',
          icon: 'mdi-bell-plus'
        }
      }

    },

    createSlip (paying) {
      if(paying.subAmount >=0){
        this.subletSlip(paying)
      }
      if(paying.amount){
        this.ownerSlip(paying)
      }

      this.pDetail['payDate'] = new Date().toISOString().substr(0, 10)
    
      this.pDetail['Gtotal'] = (this.pDetail['ownerPay'] || 0) + (this.pDetail['subletpPay'] || 0)
      this.slipDialog = true
        
    },

    getCOAheads () {
      coaApi.getCoa().then(resp => {
        this.coaHeads = resp
      })
    },
    paids () {
      let obj = this.pDetail
      let dataObj = {
        rentId: obj._id,
        payDate: new Date(obj.payDate),
        method:obj.paymeth,
      }
      if (obj.subDates){
        dataObj.subDates= obj.subDates
        dataObj.subAdv = obj.subAdvance //subAdv
        dataObj.subRent = obj.acceptedRent
      }
      if(obj.Dates){
        dataObj.Dates= obj.Dates // 1 obj
        dataObj.ownerRent = obj.ownerRent //obj
        dataObj.ownerAdv= obj.ownerAdv //Advance
        dataObj.lessDeposit= obj.lessDeposit / obj.Dates.length //obj
        dataObj.OChrg= obj.OChrg / obj.Dates.length //obj
        dataObj.mant= obj.manti / obj.Dates.length //obk
      }
      rentApi.postRent(dataObj).then(res => {
        if (res['status'] === 'success') {
          this.slipDialog = false
          this.rentDialog = false
          this.$refs.payform.reset()
          this.$refs.subPayform.reset()
          this.getData()
          // this.credit()
        }
      })
      // console.log('PAID')
      // this.credit()
    },
    credit () {
      let obj = this.pDetail
      let dataObj = {
        rentId: obj.id,
        payDate: new Date(obj.payDate),
        Dates: obj.Dates,
        ownerPay: obj.ownerPay,
        deposit: obj.lessDeposit,
        mant: obj.mant,
        ownerRent: obj.ownerRent,
        ownerMonths: this.saveMonths,
        OChrg: obj.OChrg,

        method: obj.paymeth,
        chequeId: obj.chequeId,
        bank: this.bank.set,


        oldAdv: obj.advance || 0,
        ownerAdv: obj.ownerAdv || 0,

        own: this.own,

        subDates: obj.subDates,
        subletMonths: this.subMonths,
        subletRent: obj.acceptedRent,
        subletPay: obj.SubpayAmt,
        type: obj.type,

        oldSubAdvance: obj.subAdv || 0,
        SubAdv: obj.subAdvance || 0,

        sub: this.sub,

        RRPay: obj.RRPay,
        URPay: obj.URPay,
        GTotal: obj.Gtotal,
      }
      coaApi.rentCredit(dataObj)
      // this.showSubRent =false
      // this.sub= { relief:false, panelty: false }
      // this.own= { relief:false, panelty: false }
      // this.pDetail = {}
    },
    printHistory (printId) {
      const modal = document.getElementById(printId)
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
    },
    print () {
      const modal = document.getElementById('printThis')
      modal.style.width = 850 + 'px'
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
    },
    inWords(n, custom_join_character) {
      var string = n.toString(),
          units, tens, scales, start, end, chunks, chunksLen, chunk, ints, i, word, words;

      var and = custom_join_character || 'and';

      /* Is number zero? */
      if (parseInt(string) === 0) {
          return 'zero';
      }
      /* Array of units as words */
      units = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
      /* Array of tens as words */
      tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
      /* Array of scales as words */
      scales = ['', 'thousand', 'million', 'billion', 'trillion', 'quadrillion', 'quintillion', 'sextillion', 'septillion', 'octillion', 'nonillion', 'decillion', 'undecillion', 'duodecillion', 'tredecillion', 'quatttuor-decillion', 'quindecillion', 'sexdecillion', 'septen-decillion', 'octodecillion', 'novemdecillion', 'vigintillion', 'centillion'];
      /* Split user arguemnt into 3 digit chunks from right to left */
      start = string.length;
      chunks = [];
      while (start > 0) {
          end = start;
          chunks.push(string.slice((start = Math.max(0, start - 3)), end));
      }

      /* Check if function has enough scale words to be able to stringify the user argument */
      chunksLen = chunks.length;
      if (chunksLen > scales.length) {
          return '';
      }
      /* Stringify each integer in each chunk */
      words = [];
      for (i = 0; i < chunksLen; i++) {
        chunk = parseInt(chunks[i]);
        if (chunk) {
            ints = chunks[i].split('').reverse().map(parseFloat);
            if (ints[1] === 1) {
              ints[0] += 10;
            }
            if ((word = scales[i])) {
              words.push(word);
            }
            if ((word = units[ints[0]])) {
              words.push(word);
            }
            if ((word = tens[ints[1]])) {
              words.push(word);
            }
            if (ints[0] || ints[1]) {
              if (ints[2] || !i && chunksLen) {
                  words.push(and);
              }
            }
            if ((word = units[ints[2]])) {
              words.push(word + ' hundred');
            }
        }
      }
      return words.reverse().join(' ');
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

<style>
.amt {
  font-size: 35px !important;
  border: 2px solid grey;
  text-align: center;
}
.first {
  border: 2px solid grey;
  margin: 10px;
}
.B-border {
  border-bottom: 2px solid grey;
  margin: 0px;
  padding: 0px;
}
.R-border {
  border-right: 2px solid grey;
  margin: 0px;
  padding: 0px;
}
.T-border {
  border-top: 2px solid grey;
}
.center {
  text-align: center;
}
.reds {
  color: red !important;
  margin-top: 7px;
  margin-left: -10px;
}
.theme--light.v-subheader {
  font-size: 15px;
}
img {
  width: 165px;
  transform: rotate(20deg);
}
.weight {
  font-size: 18px;
  font-weight: 900;
}
.R-width {
  width: 3px;
}
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
  .caption{
    font-size:10px !important
  }
  #print {
    position: absolute;
    left: 0;
    top: 0;
  }
}
.curMonth {
  padding: 13px 0;
}
.totalPad {
  padding: 20px 0;
}
.lbl_clr {
  color: #eee
}
.cursor {
  cursor: pointer;
}
</style>
