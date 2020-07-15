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
          :headers="approve_headers"
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
            <td>{{ item.lastDate }}</td>
            <td class="text-xs-center">
              <v-icon
                large
                @click="showData(item)">mdi-format-page-break</v-icon>
            </td>
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
          <v-toolbar-items>
            <v-btn
              fab
              class="mr-1 success"
              @click="status='Approved';statusDialog=true;">
              <span>approve</span>
            </v-btn>
            <v-btn
              fab
              class="mr-1 danger"
              @click="status='Rejected';statusDialog=true;">
              <span color="red">Reject</span>
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
      max-width="400">
      <v-card>
        <v-card-title class="headline text-xs-center">Are You Sure Want To {{ status }}</v-card-title>
        <v-card-text class="text-xs-center">
          <kbd>{{ pDetail.owner.tenantName }}</kbd>
          <span
            class="font-weight-bold"
            v-text="' as an Owner for '"/>
          <kbd>{{ pDetail.bldg.address }}</kbd>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="orange darken-1"
            flat
            @click="statusDialog = false"
          >Disagree</v-btn>
          <v-btn
            color="green darken-1"
            flat
            @click="approved(status); statusDialog = false">Agree</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </v-container>
</template>

<script>
import constants from '../../services/constants'
import rentApi from '../../services/rent-api'
export default {
  data () {
    return {
      approve: [],
      search: undefined,
      approve_headers: constants.APPROVE_HEADER,
      detailDialog: false,
      pDetail: {
        bldg: {},
        owner: {}
      },
      status: undefined,
      statusDialog: false
    }
  },
  created () {
    this.getApproval()
  },
  methods: {
    getApproval () {
      rentApi.getApprovals('Signed').then(res => {
        if (res) {
          this.approve = res
        }
      })
    },
    showData (item) {
      this.pDetail = Object.assign({}, item)
      this.detailDialog = true
    },
    approved (set) {
      var change = { id: this.pDetail._id, status: set }
      rentApi.approved(change).then(res => {
        if (res) {
          this.detailDialog = false
          this.getApproval()
        }
      })
    }
  }
}
</script>

<style>
</style>
