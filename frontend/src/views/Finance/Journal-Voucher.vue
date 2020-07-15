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
                  label="Search Referrence No."
                  prepend-inner-icon="mdi-magnify"
                />
              </div>
              <v-spacer />
              <!-- <v-btn @click="formDialog = true">Create Journal Voucher</v-btn> -->
            </v-toolbar>
          </helper-offset>
        </v-card>
        <!-- will do som other Time -->
        <v-data-table
          :headers="JVHeaders"
          :items="JVDataArray"
          :search="search"
          :rows-per-page-items="[50,100,150,200]">
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
            <td class="text-xs-center">{{ index+1 }}</td>
            <td class="text-xs-center">{{ formatDate(item.date) }}</td>
            <td class="text-xs-center">{{ item.voucher }}</td>
            <td class="text-xs-center">
              <span v-if="item.paidAcct">{{ item.recBy=item.paidAcct.name }}</span>
              <span v-else>{{ item.recBy }}</span>
            </td>
            <td class="text-xs-center">
              <span v-if="item.recAcct">{{ item.recBy=item.recAcct.name }}</span>
              <span v-else>{{ item.recBy }}</span>
            </td>
            <td class="text-xs-right">{{ item.debit }}</td>
            <td class="text-xs-right">{{ item.credit }}</td>
          </template>
        </v-data-table>
      </v-flex>
    </v-layout>
    <!--
            If you want dialog box or anything look into history

    -->
  </v-container>
</template>

<script>
import api from '../../services/payments-api'
export default {
  data () {
    return {
      search: null,
      validjvForm: true,
      reqRules: [v => !!v || ' required'],
      // date: new Date().toISOString().substr(0, 10),
      menu2: false,
      menu1: false,
      JVHeaders: [
        { sortable: false, text: 'JV.No.', value: 'jvno', align: 'center' },
        { sortable: true, text: 'Date', value: 'date', align: 'center' },
        { sortable: true, text: 'Reference', value: 'reference', align: 'center', value: 'voucher' },
        { sortable: false, text: 'Debit Account', value: 'debit account', align: 'center' },
        { sortable: false, text: 'Credit Account', value: 'Credit Account', align: 'center' },
        { sortable: true, text: 'Debit', value: 'prepared by ', align: 'right' },
        { sortable: true, text: 'Credit', value: 'paid', align: 'right' }
      ],
      JVDataArray: []
    }
  },
  created () {
    this.getVoucher()
  },
  methods: {
    getVoucher () {
      api.getVouchers().then(res => {
        if (res) {
          this.JVDataArray = res
        }
      })
    },
    formatDate (value) {
      return new Date(value).toDateString()
    }
  }
}
</script>

<style scoped>
</style>
