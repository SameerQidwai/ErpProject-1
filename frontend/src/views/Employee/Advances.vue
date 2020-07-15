<template>
  <v-container
    fill-height
    fluid
    grid-list-xl>
    <v-layout
      wrap
      class="justify-center">
      <v-flex
        md8
        lg8>
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
              <v-spacer />
              <v-btn @click="loanDialog = true">Advance</v-btn>
            </v-toolbar>
          </helper-offset>
        </v-card>
        <!-- will do som other Time -->
        <v-data-table
          :headers="item_headers"
          :items="getLoan"
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
            <td>{{ index }}</td>
            <td>{{ item.name }}</td>
            <!-- itemCode-->
            <td>{{ item.idate }}</td>
            <td>{{ item.adv }}</td>
            <!-- itemType-->
            <!--itemCost -->
          </template>
        </v-data-table>
      </v-flex>
    </v-layout>
    <!--DialogS-->

    <!--Dialog  form to create item-->
    <v-dialog
      v-model="loanDialog"
      persistent
      max-width="600">
      <v-card>
        <v-card-title class="headline">Advance Pay</v-card-title>
        <v-container grid-list-md>
          <v-layout wrap>
            <v-flex md12>
              <v-text-field
                v-model="newItem.name"
                label="Name"
                hint="i.e: xyz-123" />
            </v-flex>
            <v-flex
              xs12
              md6
              lg6>
              <v-menu
                ref="menu1"
                v-model="menu1"
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
                    v-model="dateFormatted"
                    label="Date"
                    @blur="date = parseDate(dateFormatted)"
                    v-on="on"
                  />
                </template>
                <v-date-picker
                  v-model="date"
                  dark
                  no-title
                  @input="menu1 = false" />
              </v-menu>
            </v-flex>
            <v-flex
              xs12
              md6
              lg6>
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
                    v-model="computedDateFormatted"
                    label="Date"
                    persistent-hint
                    readonly
                    v-on="on"
                  />
                </template>
                <v-date-picker
                  v-model="date"
                  dark
                  no-title
                  @input="menu2 = false" />
              </v-menu>
            </v-flex>
            <v-flex md12>
              <v-text-field
                v-model="newItem.address"
                label="Advance"
                required />
            </v-flex>
          </v-layout>
        </v-container>
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="green darken-1"
            @click="loanDialog = false">Save</v-btn>
          <v-btn
            color="orange"
            @click="loanDialog = false">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!--Form dialog end-->
    <!-- delete Dialog -->
    <!-- Delete dialog End -->
    <!--Eidt Dialog-->

    <!--Edit dialog End-->
    <!--End Dialog'S-->

    <!--Snackbar Notification-->
    <!--Snakebar Notification end-->
  </v-container>
</template>

<script>
import api from '../../services/api'

export default {
  data () {
    return {
      search: null,
      disThisBtn: false,
      item_headers: [
        { sortable: false, text: 'ID', value: 'id' },
        { sortable: false, text: 'Name', value: 'name' },
        { sortable: false, text: 'Issue Date', value: 'idate' },
        { sortable: false, text: 'Advance', value: 'advance' },
        { sortable: false, text: 'Remainig', value: 'rem' }
      ],
      array: [],
      product: [], // get all product availlabe for the autocomplete
      loanDialog: false, // hide and show form Dialog
      itemId: null, // Save Item id to delete
      ErrorDel: false, // snackbar error function
      getLoan: [
        {
          name: 'shabbir',
          idate: '2/10/2019',
          adv: 54000,
          sal: 5000000
        },
        {
          name: 'nathan',
          idate: '1/1/2020',
          adv: 5000,
          sal: 8000
        }
      ],
      ItemObj: {}, // call Item attribute in edit dialog
      newItem: {}
    }
  },
  created () {
    this.getPermissions()
    this.getEmployees()
  },
  methods: {
    getEmployees () {
      api.getEmpApi().then(res => {
        this.getEmp = res
      })
    },
    getPermissions () {
      let admin = localStorage.getItem('admin')
      if (admin) {
        this.permissions = { 'add': true, 'edit': true, 'delete': true }
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

<style lang="sass" scoped>

</style>
