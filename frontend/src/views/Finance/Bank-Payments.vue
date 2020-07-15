<template>
  <v-container
    fill-height
    fluid
    grid-list-xl>
    <v-layout justify-center>
      <v-flex md8>
        <v-card>
          <v-card-title class="headline">Create Bank Payment Voucher</v-card-title>
          <v-container grid-list-md>
            <v-form
              ref="addform"
              v-model="valid">
              <v-layout wrap>
                <v-flex md6>
                  <v-menu
                    v-model="menu"
                    :close-on-content-click="false">
                    <template v-slot:activator="{ on }">
                      <v-text-field
                        v-model="obj.date"
                        outline
                        label="Date"
                        no-title
                        readonly
                        v-on="on"
                      />
                    </template>
                    <v-date-picker
                      v-model="obj.date"
                      dark
                      @input="menu = false" />
                  </v-menu>
                </v-flex>

                <v-flex md6>
                  <v-text-field
                    v-model="obj.voucher"
                    outline
                    readonly
                    label="Voucher #" />
                </v-flex>

                <v-flex md6>
                  <v-autocomplete
                    v-model="obj.recAcct"
                    :items="coaHeads"
                    item-text="name"
                    return-object
                    label="Select Debit Account"
                    outline
                  />
                </v-flex>

                <v-flex md6>
                  <v-autocomplete
                    v-model="obj.paidAcct"
                    :items="coaHeads"
                    item-text="name"
                    return-object
                    label="Select Credit Account"
                    outline
                  />
                </v-flex>

                <v-flex md6>
                  <v-text-field
                    :rules="reqRules"
                    v-model.number="obj.credit"
                    label="Amount"
                    type="number"
                    min="0"
                    outline
                  />
                </v-flex>

                <v-flex md6>
                  <v-text-field
                    :rules="reqRules"
                    v-model="obj.narration"
                    outline
                    label="Narration"
                  />
                </v-flex>
              </v-layout>
            </v-form>
          </v-container>
          <v-card-actions>
            <v-spacer />
            <v-btn
              :disabled="!valid"
              color="green darken-1"
              @click="bankPayment()">Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>

    <v-dialog
      v-model="receipt"
      width="500">
      <v-card>
        <v-container
          id="printThis"
          grid-list-md>
          <v-layout
            wrap
            row
            class="border">
            <v-flex md12>
              <h2>Bank Payment Voucher</h2>
            </v-flex>

            <v-flex md6>
              <div>
                <v-text-field
                  v-model="item.date"
                  readonly
                  label="Date" />
              </div>
            </v-flex>

            <v-flex md6>
              <div>
                <v-text-field
                  v-model="item.voucher"
                  readonly
                  label="Voucher #" />
              </div>
            </v-flex>

            <v-flex md6>
              <v-text-field
                v-model="item.recAcct"
                readonly
                label="Select Credit Account" />
            </v-flex>

            <v-flex md6>
              <v-text-field
                v-model="item.paidAcct"
                readonly
                label="Select Credit Account" />
            </v-flex>

            <v-flex md6>
              <v-text-field
                v-model="item.credit"
                readonly
                label="Amount" />
            </v-flex>

            <v-flex md6>
              <v-text-field
                v-model="item.narration"
                readonly
                label="Narration" />
            </v-flex>
          </v-layout>
        </v-container>
      </v-card>
    </v-dialog>

  </v-container>
</template>

<script>
import coaApi from '../../services/coa-api'
import api from '../../services/payments-api'

export default {
  data () {
    return {
      obj: {},
      item: {},
      date: new Date().toISOString().substr(0, 10),
      valid: true,
      menu: false,
      coaHeads: [],
      receipt: false,
      reqRules: [v => !!v || ' required']
    }
  },
  created () {
    this.getCOAheads()
    this.getVoucher()
  },
  methods: {
    getCOAheads () {
      coaApi.getCoa().then(resp => {
        this.coaHeads = resp
      })
    },
    getVoucher () {
      api.getVoucher().then(resp => {
        if (resp) {
          this.obj.voucher = resp.index
        }
      })
    },
    bankPayment () {
      api.bankPayment(this.obj).then(resp => {
        this.receipt = true
        if (resp === true) {
          this.item = { ...this.obj }
          this.item['paidAcct'] = this.item['paidAcct']['name']
          this.item['recAcct'] = this.item['recAcct']['name']
          this.$refs.addform.reset()
          this.getVoucher()
          setTimeout(() => {
            this.print()
          }, 2000)
        }
      })
    },
    print () {
      const modal = document.getElementById('printThis')
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
    }
  }
}
</script>

<style>
.border {
  border: 1px solid;
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
  #print {
    position: absolute;
    left: 0;
    top: 0;
  }
}
</style>
