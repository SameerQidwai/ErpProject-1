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
          <helper-offset
            :inline="inline"
            :full-width="fullWidth"
            :offset="offset">
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
                  label="Search"
                  prepend-inner-icon="mdi-magnify"
                />
              </div>
              <v-spacer />
              <v-btn @click="addDialog = true">Add New Admin</v-btn>
            </v-toolbar>
          </helper-offset>
        </v-card>

        <v-data-table
          v-if="usersArray"
          :headers="item_headers"
          :items="usersArray"
          :search="search"
          hide-actions
        >
          <template
            slot="headerCell"
            slot-scope="{ header }">
            <span
              class="font-weight-light text-warning text--darken-3"
              v-text="header.text" />
          </template>
          <template
            slot="items"
            slot-scope="{  index , item }">
            <td>{{ item.fname }}</td>
            <td>{{ item.lname }}</td>
            <td>{{ item.contact }}</td>
            <td>{{ item.email }}</td>
            <td>{{ item.username }}</td>
            <td class="text-xs-right">
              <v-icon
                color="blue"
                large
                @click="showEdit(item)">mdi-pencil-circle</v-icon>
              <v-icon
                color="red"
                large
                @click="deleteDialog = true; deleteId=item._id; deleteName=item.fname"
              >mdi-delete-circle</v-icon>
            </td>
          </template>
        </v-data-table>
      </v-flex>
    </v-layout>

    <v-dialog
      v-model="addDialog"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition">
      <v-card tile>
        <v-toolbar
          card
          color="orange">
          <v-btn
            icon
            dark
            @click="addDialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>Create New Admin</v-toolbar-title>
          <v-spacer />
          <v-toolbar-items>
            <v-btn
              :disabled="!validUserForm"
              color="orange"
              dark
              flat
              @click="addUser()">Save</v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-form
          ref="addUserRef"
          v-model="validUserForm">
          <v-container
            grid-list-md
            justify-center>
            <v-card>
              <v-layout
                row
                wrap
                pa-4
                mb-2
                justify-center>
                <v-flex
                  xs12
                  md5>
                  <v-text-field
                    :rules="reqRules"
                    v-model="newUser.fname"
                    outline
                    label="First Name"
                  />
                </v-flex>

                <v-spacer class="userForm" />

                <v-flex
                  xs12
                  md5>
                  <v-text-field
                    :rules="reqRules"
                    v-model="newUser.lname"
                    outline
                    label="Last Name"
                  />
                </v-flex>

                <v-flex
                  xs12
                  md5>
                  <v-text-field
                    v-model="newUser.email"
                    :rules="reqRules"
                    outline
                    label="Email" />
                </v-flex>

                <v-spacer class="userForm" />

                <v-flex
                  xs12
                  md5>
                  <v-text-field
                    :rules="reqRules"
                    v-model="newUser.username"
                    outline
                    label="Username"
                  />
                </v-flex>

                <v-flex
                  xs12
                  md5>
                  <v-text-field
                    :rules="reqRules"
                    v-model="newUser.contact"
                    outline
                    label="Contact"
                  />
                </v-flex>

                <v-spacer class="userForm" />

                <v-flex
                  xs12
                  md5>
                  <v-text-field
                    v-model="newUser.password"
                    :append-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'"
                    :rules="reqRules"
                    :type="show2 ? 'text' : 'password'"
                    outline
                    label="Password"
                    @click:append="show2 = !show2"
                  />
                </v-flex>

                <v-flex
                  xs12
                  md10>
                  <v-autocomplete
                    v-model="newUser['views']"
                    :items="pages"
                    :rules="reqRules"
                    outline
                    chips
                    hide-selected
                    color="blue-grey lighten-2"
                    label="Pages"
                    item-text="name"
                    item-value="name"
                    multiple
                  >
                    <template v-slot:selection="data">
                      <v-chip
                        :selected="data.selected"
                        close
                        class="chip--select-multi"
                        @input="removeNew(data.item)"
                      >
                        <v-avatar>
                          <v-icon>mdi-tag</v-icon>
                        </v-avatar>
                        {{ data.item.name }}
                      </v-chip>
                    </template>
                    <template v-slot:item="data">
                      <template v-if="typeof data.item !== 'object'">
                        <v-list-tile-content v-text="data.item" />
                      </template>
                      <template v-else>
                        <v-list-tile-avatar>
                          <v-icon>mdi-jira</v-icon>
                        </v-list-tile-avatar>
                        <v-list-tile-content>
                          <v-list-tile-title v-html="data.item.name" />
                          <v-list-tile-sub-title v-html="data.item.group" />
                        </v-list-tile-content>
                      </template>
                    </template>
                  </v-autocomplete>
                </v-flex>
              </v-layout>
            </v-card>
          </v-container>
        </v-form>
      </v-card>
    </v-dialog>

    <v-dialog
      v-model="editDialog"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition">
      <v-card tile>
        <v-toolbar
          card
          color="orange">
          <v-btn
            icon
            dark
            @click="editDialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>Edit Admin</v-toolbar-title>
          <v-spacer />
          <v-toolbar-items>
            <v-btn
              :disabled="!validEditForm"
              color="orange"
              dark
              flat
              @click="updateUser()">Save</v-btn>
          </v-toolbar-items>
        </v-toolbar>

        <v-form
          ref="editUserRef"
          v-model="validEditForm">
          <v-container
            grid-list-md
            justify-center>
            <v-card>
              <v-layout
                row
                wrap
                pa-4
                mb-2
                justify-center>
                <v-flex
                  xs12
                  md5>
                  <v-text-field
                    :rules="reqRules"
                    v-model="editUser.fname"
                    outline
                    label="First Name"
                  />
                </v-flex>

                <v-spacer class="userForm" />

                <v-flex
                  xs12
                  md5>
                  <v-text-field
                    :rules="reqRules"
                    v-model="editUser.lname"
                    outline
                    label="Last Name"
                  />
                </v-flex>

                <v-flex
                  xs12
                  md5>
                  <v-text-field
                    v-model="editUser.email"
                    :rules="reqRules"
                    outline
                    label="Email" />
                </v-flex>

                <v-spacer class="userForm" />

                <v-flex
                  xs12
                  md5>
                  <v-text-field
                    :rules="reqRules"
                    v-model="editUser.username"
                    outline
                    label="Username"
                  />
                </v-flex>

                <v-flex
                  xs12
                  md5>
                  <v-text-field
                    :rules="reqRules"
                    v-model="editUser.contact"
                    outline
                    label="Contact"
                  />
                </v-flex>

                <v-spacer class="userForm" />

                <v-flex
                  xs12
                  md5>
                  <v-text-field
                    v-model="editUser.password"
                    :append-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'"
                    :rules="reqRules"
                    :type="show2 ? 'text' : 'password'"
                    outline
                    label="Password"
                    @click:append="show2 = !show2"
                  />
                </v-flex>

                <v-flex
                  xs12
                  md10>
                  <v-autocomplete
                    v-model="editUser['views']"
                    :items="pages"
                    :rules="reqRules"
                    outline
                    hide-selected
                    chips
                    color="blue-grey lighten-2"
                    label="Pages"
                    item-text="name"
                    item-value="name"
                    multiple
                  >
                    <template v-slot:selection="data">
                      <v-chip
                        :selected="data.selected"
                        close
                        class="chip--select-multi"
                        @input="removeEdit(data.item)"
                      >
                        <v-avatar>
                          <v-icon>mdi-tag</v-icon>
                        </v-avatar>
                        {{ data.item.name }}
                      </v-chip>
                    </template>
                    <template v-slot:item="data">
                      <template v-if="typeof data.item !== 'object'">
                        <v-list-tile-content v-text="data.item" />
                      </template>
                      <template v-else>
                        <v-list-tile-avatar>
                          <v-icon>mdi-jira</v-icon>
                        </v-list-tile-avatar>
                        <v-list-tile-content>
                          <v-list-tile-title v-html="data.item.name" />
                          <v-list-tile-sub-title v-html="data.item.group" />
                        </v-list-tile-content>
                      </template>
                    </template>
                  </v-autocomplete>
                </v-flex>
              </v-layout>
            </v-card>
          </v-container>
        </v-form>
      </v-card>
    </v-dialog>

    <v-dialog
      v-model="deleteDialog"
      persistent
      max-width="290">
      <v-card>
        <v-card-title class="headline">Delete {{ deleteName }}</v-card-title>
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="orange darken-1"
            flat
            @click="deleteDialog = false">Cancel</v-btn>
          <v-btn
            color="green darken-1"
            flat
            @click="deleteUser()">Delete</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar
      v-model="snackbar"
      color="blue">
      {{ text }}
      <v-btn
        flat
        @click="snackbar = false">Close</v-btn>
    </v-snackbar>
  </v-container>
</template>

<script>
import userApi from '../../services/admin-api'

export default {
  props: {
    color: {
      type: String,
      default: 'secondary'
    },
    elevation: {
      type: [Number, String],
      default: 10
    },
    inline: {
      type: Boolean,
      default: false
    },
    fullWidth: {
      type: Boolean,
      default: false
    },
    offset: {
      type: [Number, String],
      default: 24
    }
  },
  data () {
    return {
      search: null,
      pages: [
        { header: 'Purchase Management' },
        { name: 'Detail of Suppliers', group: 'Purchase Management' },
        { name: 'Request Order', group: 'Purchase Management' },
        { name: 'Create Order', group: 'Purchase Management' },
        { name: 'Order Approval', group: 'Purchase Management' },
        { name: 'Goods Receipt', group: 'Purchase Management' },
        { name: 'Order Payment', group: 'Purchase Management' },
        { name: 'Purchase Order', group: 'Purchase Management' },
        { name: 'Purchase Report', group: 'Purchase Management' },
        { divider: true },
        { header: 'Employee Management' },
        { name: 'Employee Information', group: 'Employee Management' },
        { name: 'Employee Attendence', group: 'Employee Management' },
        { name: 'Employee Leaves', group: 'Employee Management' },
        { name: 'Employee Loan', group: 'Employee Management' },
        { name: 'Employee Advance', group: 'Employee Management' },
        { name: 'Employee PayRoll', group: 'Employee Management' },
        { divider: true },
        { header: 'Rent Management' },
        { name: 'Property Details', group: 'Rent Management' },
        { name: 'Property Approval', group: 'Rent Management' },
        { name: 'Property Payment', group: 'Rent Management' },
        { name: 'Tenant Details', group: 'Rent Management' },
        { name: 'Transfer Details', group: 'Rent Management' },
        { name: 'Rent History', group: 'Rent Management' },
        /** To remove from the add list */
        // { divider: true },
        // { header: 'Expenses Management' },
        // { name: 'Expenses', group: 'Expenses Management' },
        { divider: true },
        { header: 'Finance Management' },
        { name: 'Balance Sheet', group: 'Finance Management' },
        { name: 'Account Ledger', group: 'Finance Management' },
        { name: 'Income Statement', group: 'Finance Management' },
        { name: 'Bank Payments', group: 'Finance Management' },
        { name: 'Bank Receipt', group: 'Finance Management' },
        { name: 'Cash Receipt', group: 'Finance Management' },
        { name: 'Cash Payments', group: 'Finance Management' },
        { name: 'Chart of Accounts', group: 'Finance Management' },
        // { name: "Journal Voucher", group: "Finance Management" },
        { divider: true },
        { header: 'Inventory Management' },
        { name: 'Stock Inventory', group: 'Inventory Management' },
        { divider: true },
        { header: 'Point Of Sale Management' },
        // { name: 'Customers', group: 'Point Of Sale Management' },
        { name: 'Sale Order', group: 'Point Of Sale Management' },
        { name: 'Sales Report', group: 'Point Of Sale Management' },
        { divider: true },
        { header: 'Others' },
        { name: 'Scholarship Form', group: 'Others' },
        { name: 'Amakin Form', group: 'Others' }
      ],
      item_headers: [
        { sortable: false, text: 'First Name', value: 'fname' },
        { sortable: false, text: 'Last Name', value: 'lname' },
        { sortable: false, text: 'Contact', value: 'contact' },
        { sortable: false, text: 'Email', value: 'email' },
        { sortable: false, text: 'Username', value: 'username', align: '' },
        { sortable: false, text: 'Actions', value: 'Actions', align: 'right' }
      ],
      usersArray: null,
      validUserForm: true,
      validEditForm: true,
      show1: false,
      show2: false,
      deleteId: null,
      deleteName: null,
      editUser: {},
      newUser: {},
      reqRules: [v => !!v || 'required'],
      deleteDialog: false,
      addDialog: false,
      editDialog: false,
      text: '',
      snackbar: false
    }
  },
  created () {
    this.getUsers()
  },
  methods: {
    removeEdit (item) {
      let index = this.editUser['views'].indexOf(item.name)
      if (index >= 0) this.editUser['views'].splice(index, 1)
    },
    removeNew (item) {
      let index = this.newUser['views'].indexOf(item.name)
      if (index >= 0) this.newUser['views'].splice(index, 1)
    },
    getUsers () {
      userApi.getAdmins().then(resp => {
        if (resp) {
          this.usersArray = resp
        }
      })
    },
    addUser () {
      if (this.$refs.addUserRef.validate()) {
        let exist = this.usersArray.find(
          x => x.username === this.newUser['username']
        )
        if (exist) {
          this.text = 'User Already Exist'
          this.snackbar = true
          return
        }

        this.newUser['pageHeaders'] = this.createPageHeaders()
        this.newUser['links'] = this.createLinks()
        this.newUser['views'].push('Dashboard')

        userApi.postAdmin(this.newUser).then(resp => {
          if (resp) {
            this.text = 'Added!'
            this.addDialog = false
            this.$refs.addUserRef.reset()
            this.getUsers()
          } else {
            this.text = 'Try Again'
          }
          this.snackbar = true
        })
      }
    },
    updateUser () {
      if (this.$refs.editUserRef.validate()) {
        let exist = this.usersArray.find(
          x => x.username === this.editUser['username']
        )
        if (exist) {
          if (exist['_id'] !== this.editUser['_id']) {
            this.text = 'User Already Exist'
            this.snackbar = true
            return
          }
        }

        this.editUser['pageHeaders'] = this.createPageHeaders(true)
        this.editUser['links'] = this.createLinks(true)
        userApi.patchAdmin(this.editUser).then(resp => {
          if (resp) {
            this.getUsers()
            this.text = 'Success!'
            this.$refs.editUserRef.reset()
            this.editDialog = false
          } else {
            this.text = 'Try Again'
          }
          this.snackbar = true
        })
      }
    },
    deleteUser () {
      userApi.deleteAdmin(this.deleteId).then(resp => {
        if (resp) {
          this.text = 'Success!'
          this.getUsers()
          this.deleteDialog = false
        } else {
          this.text = 'Try Again'
        }
        this.snackbar = true
      })
    },
    showEdit (obj) {
      this.editUser = Object.assign({}, obj)
      this.editDialog = true
    },
    createLinks (edit = false) {
      let allowPurchase = false
      let allowEmployee = false
      let allowRent = false
      let allowFinance = false
      let allowSales = false
      let allowInventory = false
      let allowOthers = false
      let allowExpenses = false

      let allowedInventory = {
        icon: 'mdi-firebase',
        group: 'Inventory'
      }
      let allowedSales = {
        icon: 'mdi-sale',
        text: 'Sales',
        group: 'Sales',
        groupItem: []
      }
      let allowedPurchase = {
        icon: 'mdi-clipboard-outline',
        text: 'Purchase',
        group: 'Purchase',
        groupItem: []
      }
      let allowedEmployee = {
        icon: 'mdi-home-circle',
        text: 'Employee',
        group: 'Employee',
        groupItem: []
      }
      let allowedRent = {
        icon: 'mdi-home-circle',
        text: 'Rent Management',
        group: 'Rent',
        groupItem: []
      }
      let allowedExpenses = {
        icon: 'mdi-home-circle',
        text: 'Expenses'
      }
      let allowedFinance = {
        icon: 'mdi-bank',
        text: 'Finance',
        group: 'Finance',
        groupItem: []
      }
      let allowedOthers = {
        icon: 'mdi-creation',
        text: 'Others',
        group: 'Others',
        groupItem: []
      }

      let data
      if (edit) {
        data = this.editUser['views']
      } else {
        data = this.newUser['views']
      }

      if (data.includes('Stock Inventory')) {
        allowInventory = true
        allowedInventory = {
          icon: 'mdi-firebase',
          to: '/stock-inventory',
          text: 'Stock Inventory',
          group: 'Inventory'
        }
      }
      if (data.includes('Customers')) {
        allowSales = true
        allowedSales['groupItem'].push({
          to: '/customers',
          icon: 'mdi-account',
          text: 'Customers'
        })
      }
      if (data.includes('Sale Order')) {
        allowSales = true
        allowedSales['groupItem'].push({
          to: '/point-of-sale',
          icon: 'mdi-store',
          text: 'Sale Order'
        })
      }
      if (data.includes('Sales Report')) {
        allowSales = true
        allowedSales['groupItem'].push({
          to: '/sales-report',
          icon: 'mdi-jira',
          text: 'Sales Report'
        })
      }
      if (data.includes('Detail of Suppliers')) {
        allowPurchase = true
        allowedPurchase['groupItem'].push({
          to: '/supplier',
          icon: 'mdi-account',
          text: 'Supplier'
        })
      }
      if (data.includes('Request Order')) {
        allowPurchase = true
        allowedPurchase['groupItem'].push({
          to: '/request-order',
          icon: 'mdi-cart-plus',
          text: 'Request Order'
        })
      }
      if (data.includes('Create Order')) {
        allowPurchase = true
        allowedPurchase['groupItem'].push({
          to: '/create-order',
          icon: 'mdi-cart-outline',
          text: 'Create Order'
        })
      }
      if (data.includes('Order Approval')) {
        allowPurchase = true
        allowedPurchase['groupItem'].push({
          to: '/approve-order',
          icon: 'mdi-cart-outline',
          text: 'Order Approval'
        })
      }
      if (data.includes('Goods Receipt')) {
        allowPurchase = true
        allowedPurchase['groupItem'].push({
          to: '/goods-receipt',
          icon: 'mdi-cart-outline',
          text: 'Goods Receipt'
        })
      }
      if (data.includes('Order Payment')) {
        allowPurchase = true
        allowedPurchase['groupItem'].push({
          to: '/order-payment',
          icon: 'mdi-cart-outline',
          text: 'Order Payment'
        })
      }
      if (data.includes('Purchase Order')) {
        allowPurchase = true
        allowedPurchase['groupItem'].push({
          to: '/purchase-order',
          icon: 'mdi-cart-outline',
          text: 'Purchase Order'
        })
      }
      if (data.includes('Purchase Report')) {
        allowPurchase = true
        allowedPurchase['groupItem'].push({
          to: '/purchase-report',
          icon: 'mdi-jira',
          text: 'Purchase-Report'
        })
      }
      if (data.includes('Expenses')) {
        allowExpenses = true
        allowedExpenses = {
          icon: 'mdi-firebase',
          text: 'Expenses',
          to: '/expenses',
          group: 'Expenses'
        }
      }
      if (data.includes('Account Ledger')) {
        allowFinance = true
        allowedFinance['groupItem'].push({
          to: 'account-ledger',
          icon: 'mdi-account-multiple',
          text: 'Account Ledger'
        })
      }
      if (data.includes('Balance Sheet')) {
        allowFinance = true
        allowedFinance['groupItem'].push({
          to: 'balance-sheet',
          icon: 'mdi-account-multiple',
          text: 'Balance Sheet'
        })
      }
      if (data.includes('Bank Payments')) {
        allowFinance = true
        allowedFinance['groupItem'].push({
          to: 'bank-payments',
          icon: 'mdi-account-multiple',
          text: 'Bank Payments'
        })
      }
      if (data.includes('Bank Receipt')) {
        allowFinance = true
        allowedFinance['groupItem'].push({
          to: 'bank-receipt',
          icon: 'mdi-account-multiple',
          text: 'Bank Receipt'
        })
      }
      if (data.includes('Cash Payments')) {
        allowFinance = true
        allowedFinance['groupItem'].push({
          to: 'cash-payments',
          icon: 'mdi-account-multiple',
          text: 'Cash Payments'
        })
      }
      if (data.includes('Cash Receipt')) {
        allowFinance = true
        allowedFinance['groupItem'].push({
          to: 'cash-receipt',
          icon: 'mdi-account-multiple',
          text: 'Cash Receipt'
        })
      }
      if (data.includes('Chart of Accounts')) {
        allowFinance = true
        allowedFinance['groupItem'].push({
          to: 'chart-of-accounts',
          icon: 'mdi-account-multiple',
          text: 'Chart of Accounts'
        })
      }
      if (data.includes('Income Statement')) {
        allowFinance = true
        allowedFinance['groupItem'].push({
          to: 'income-statements',
          icon: 'mdi-account-multiple',
          text: 'Income Statement'
        })
      }
      if (data.includes('Journal Voucher')) {
        allowFinance = true
        allowedFinance['groupItem'].push({
          to: 'journal-voucher',
          icon: 'mdi-account-multiple',
          text: 'Journal Voucher'
        })
      }
      if (data.includes('Property Details')) {
        allowRent = true
        allowedRent['groupItem'].push({
          to: '/property-details',
          icon: 'mdi-home-modern',
          text: 'Property Details'
        })
      }
      if (data.includes('Property Approval')) {
        allowRent = true
        allowedRent['groupItem'].push({
          to: '/property-approval',
          icon: 'mdi-home-modern',
          text: 'Property Approval'
        })
      }
      if (data.includes('Property Payment')) {
        allowRent = true
        allowedRent['groupItem'].push({
          to: '/property-payment',
          icon: 'mdi-home-modern',
          text: 'Property Payment'
        })
      }
      if (data.includes('Tenant Details')) {
        allowRent = true
        allowedRent['groupItem'].push({
          to: '/tenant-details',
          icon: 'mdi-cart-outline',
          text: 'Tenant Details'
        })
      }
      if (data.includes('Transfer Details')) {
        allowRent = true
        allowedRent['groupItem'].push({
          to: '/transfer-details',
          icon: 'mdi-transit-transfer',
          text: 'Transfer Details'
        })
      }
      if (data.includes('Rent History')) {
        allowRent = true
        allowedRent['groupItem'].push({
          to: '/rent-history',
          icon: 'mdi-cash-usd',
          text: 'Rent History'
        })
      }
      if (data.includes('Employee Information')) {
        allowEmployee = true
        allowedEmployee['groupItem'].push({
          to: '/employee',
          icon: 'mdi-account',
          text: 'Employee'
        })
      }
      if (data.includes('Employee Attendence')) {
        allowEmployee = true
        allowedEmployee['groupItem'].push({
          to: '/attendence',
          icon: 'mdi-calendar-check',
          text: 'Attendence'
        })
      }
      if (data.includes('Employee Leaves')) {
        allowEmployee = true
        allowedEmployee['groupItem'].push({
          to: '/leaves',
          icon: 'mdi-calendar',
          text: 'Leaves'
        })
      }
      if (data.includes('Employee Loan')) {
        allowEmployee = true
        allowedEmployee['groupItem'].push({
          to: '/loan',
          icon: 'mdi-cash-multiple',
          text: 'Loan'
        })
      }
      if (data.includes('Employee PayRoll')) {
        allowEmployee = true
        allowedEmployee['groupItem'].push({
          to: '/payroll',
          icon: 'mdi-jira',
          text: 'Payroll'
        })
      }
      if (data.includes('Scholarship Form')) {
        allowOthers = true
        allowedOthers['groupItem'].push({
          to: '/scholarship',
          icon: 'mdi-school',
          text: 'Scholarship'
        })
      }
      if (data.includes('Amakin Form')) {
        allowOthers = true
        allowedOthers['groupItem'].push({
          to: '/amakin',
          icon: 'mdi-lifebuoy',
          text: 'Amakin'
        })
      }

      let links = []

      links.push({
        to: '/',
        icon: 'mdi-view-dashboard',
        text: 'Dashboard'
      })
      if (allowInventory) {
        links.push(allowedInventory)
      }
      if (allowSales) {
        links.push(allowedSales)
      }
      if (allowPurchase) {
        links.push(allowedPurchase)
      }
      if (allowExpenses) {
        links.push(allowedExpenses)
      }
      if (allowFinance) {
        links.push(allowedFinance)
      }
      if (allowEmployee) {
        links.push(allowedEmployee)
      }
      if (allowRent) {
        links.push(allowedRent)
      }
      if (allowOthers) {
        links.push(allowedOthers)
      }
      links.push({
        icon: 'mdi-account-settings-variant',
        text: 'User',
        to: '/admin-home'
      })

      return links
    },
    createPageHeaders (edit = false) {
      let data
      if (edit) {
        data = this.editUser['views']
      } else {
        data = this.newUser['views']
      }
      let purchaseMangementHeader = { header: 'Purchase Management' }
      let employeeManagementHeader = { header: 'Employee Management' }
      let rentManagementHeader = { header: 'Rent Management' }
      let ExpensesManagementHeader = { header: 'Expenses Management' }
      let financeManagementHeader = { header: 'Finance Management' }
      let inventoryManagementHeader = { header: 'Inventory Management' }
      let posManagementHeader = { header: 'Point Of Sale Management' }
      let othersHeader = { header: 'Others' }
      let divider = { divider: true }

      let pageHeaders = []

      pageHeaders.push(purchaseMangementHeader)
      if (data.includes('Detail of Suppliers')) {
        pageHeaders.push({
          name: 'Detail of Suppliers',
          group: 'Purchase Management'
        })
      }
      if (data.includes('Create Order')) {
        pageHeaders.push({
          name: 'Create Order',
          group: 'Purchase Management'
        })
      }
      if (data.includes('Order Approval')) {
        pageHeaders.push({
          name: 'Order Approval',
          group: 'Purchase Management'
        })
      }
      if (data.includes('Goods Receipt')) {
        pageHeaders.push({
          name: 'Goods Receipt',
          group: 'Purchase Management'
        })
      }
      if (data.includes('Order Payment')) {
        pageHeaders.push({
          name: 'Order Payment',
          group: 'Purchase Management'
        })
      }
      if (data.includes('Purchase Order')) {
        pageHeaders.push({
          name: 'Purchase Order',
          group: 'Purchase Management'
        })
      }
      if (data.includes('Purchase Report')) {
        pageHeaders.push({
          name: 'Purchase Report',
          group: 'Purchase Management'
        })
      }
      pageHeaders.push(divider)
      pageHeaders.push(employeeManagementHeader)
      if (data.includes('Employee Information')) {
        pageHeaders.push({
          name: 'Employee Information',
          group: 'Employee Management'
        })
      }
      if (data.includes('Employee Attendence')) {
        pageHeaders.push({
          name: 'Employee Attendence',
          group: 'Employee Management'
        })
      }
      if (data.includes('Employee Leaves')) {
        pageHeaders.push({
          name: 'Employee Leaves',
          group: 'Employee Management'
        })
      }
      if (data.includes('Employee Loan')) {
        pageHeaders.push({
          name: 'Employee Loan',
          group: 'Employee Management'
        })
      }
      if (data.includes('Employee Advance')) {
        pageHeaders.push({
          name: 'Employee Advance',
          group: 'Employee Management'
        })
      }
      if (data.includes('Employee PayRoll')) {
        pageHeaders.push({
          name: 'Employee PayRoll',
          group: 'Employee Management'
        })
      }
      pageHeaders.push(divider)
      pageHeaders.push(rentManagementHeader)
      if (data.includes('Property Details')) {
        pageHeaders.push({
          name: 'Property Details',
          group: 'Rent Management'
        })
      }
      if (data.includes('Property Approval')) {
        pageHeaders.push({
          name: 'Property Approval',
          group: 'Rent Management'
        })
      }
      if (data.includes('Property Payment')) {
        pageHeaders.push({
          name: 'Property Payment',
          group: 'Rent Management'
        })
      }
      if (data.includes('Tenant Details')) {
        pageHeaders.push({
          name: 'Tenant Details',
          group: 'Rent Management'
        })
      }
      if (data.includes('Transfer Details')) {
        pageHeaders.push({
          name: 'Transfer Details',
          group: 'Rent Management'
        })
      }
      if (data.includes('Rent History')) {
        pageHeaders.push({ name: 'Rent History', group: 'Rent Management' })
      }
      pageHeaders.push(divider)
      pageHeaders.push(ExpensesManagementHeader)
      if (data.includes('Expenses')) {
        pageHeaders.push({
          name: 'Expenses',
          group: 'Expenses Management'
        })
      }
      pageHeaders.push(divider)
      pageHeaders.push(financeManagementHeader)
      if (data.includes('Balance Sheet')) {
        pageHeaders.push({
          name: 'Balance Sheet',
          group: 'Finance Management'
        })
      }
      if (data.includes('Account Ledger')) {
        pageHeaders.push({
          name: 'Account Ledger',
          group: 'Finance Management'
        })
      }
      if (data.includes('Bank Payments')) {
        pageHeaders.push({
          name: 'Bank Payments',
          group: 'Finance Management'
        })
      }
      if (data.includes('Bank Receipt')) {
        pageHeaders.push({
          name: 'Bank Receipt',
          group: 'Finance Management'
        })
      }
      if (data.includes('Cash Receipt')) {
        pageHeaders.push({
          name: 'Cash Receipt',
          group: 'Finance Management'
        })
      }
      if (data.includes('Cash Payments')) {
        pageHeaders.push({
          name: 'Cash Payments',
          group: 'Finance Management'
        })
      }
      if (data.includes('Chart of Accounts')) {
        pageHeaders.push({
          name: 'Chart of Accounts',
          group: 'Finance Management'
        })
      }
      if (data.includes('Income Statement')) {
        pageHeaders.push({
          name: 'Income Statement',
          group: 'Finance Management'
        })
      }
      if (data.includes('Journal Voucher')) {
        pageHeaders.push({
          name: 'Journal Voucher',
          group: 'Finance Management'
        })
      }
      pageHeaders.push(divider)
      pageHeaders.push(inventoryManagementHeader)
      if (data.includes('Stock Inventory')) {
        pageHeaders.push({
          name: 'Stock Inventory',
          group: 'Inventory Management'
        })
      }
      pageHeaders.push(divider)
      pageHeaders.push(posManagementHeader)
      if (data.includes('Customers')) {
        pageHeaders.push({
          name: 'Customers',
          group: 'Point Of Sale Management'
        })
      }
      if (data.includes('Sale Order')) {
        pageHeaders.push({
          name: 'Sale Order',
          group: 'Point Of Sale Management'
        })
      }
      if (data.includes('Sales Report')) {
        pageHeaders.push({
          name: 'Sales Report',
          group: 'Point Of Sale Management'
        })
      }
      pageHeaders.push(divider)
      pageHeaders.push(othersHeader)
      if (data.includes('Scholarship Form')) {
        pageHeaders.push({
          name: 'Scholarship Form',
          group: 'Others'
        })
      }
      if (data.includes('Amakin Form')) {
        pageHeaders.push({
          name: 'Amakin Form',
          group: 'Others'
        })
      }
      return pageHeaders
    }
  }
}
</script>

<style scoped>
.spacer.userForm {
  flex-grow: 0.2 !important;
}
.font-text-bold {
  font-weight: 500 !important;
  padding-left: 5px;
}
</style>
