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
                  label="Search Item"
                  prepend-inner-icon="mdi-magnify"
                />
              </div>
              <v-spacer />
              <v-btn
                v-if="permissions['add']"
                @click="formDialog = true">Add Employee</v-btn>
            </v-toolbar>
          </helper-offset>
        </v-card>

        <v-data-table
          :headers="item_headers"
          :items="getEmp"
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
            <td>{{ item.name }}</td>
            <td>{{ item.fName }}</td>
            <td>{{ item.address }}</td>
            <td>{{ item.phone }}</td>
            <td>{{ item.payroll }}</td>
            <td class="text-xs-right">
              <v-icon
                v-if="permissions['edit']"
                color="blue"
                item-obj="{}"
                large
                @click="showEdit(item)"
              >mdi-pencil-circle</v-icon>
              <v-icon
                v-if="permissions['delete']"
                color="red"
                item-obj="{}"
                large
                @click="deleteThis(item)"
              >mdi-delete-circle</v-icon>
            </td>
          </template>
        </v-data-table>
      </v-flex>
    </v-layout>

    <v-dialog
      v-model="formDialog"
      persistent
      max-width="600">
      <v-card>
        <v-card-title class="headline">Add Employee</v-card-title>
        <v-form
          ref="addform"
          v-model="addvalid">
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex md6>
                <v-text-field
                  v-model="newItem.name"
                  :rules="reqRules"
                  label="Employee Name"
                  hint="i.e: xyz-123"
                />
              </v-flex>
              <v-flex md6>
                <v-text-field
                  v-model="newItem.fName"
                  :rules="reqRules"
                  label="Employee Father's Name"
                />
              </v-flex>
              <v-flex md12>
                <v-text-field
                  v-model="newItem.address"
                  :rules="reqRules"
                  label="Employee Address" />
              </v-flex>
              <v-flex md6>
                <v-text-field
                  v-model="newItem.phone"
                  :rules="reqRules"
                  label="Employee Phone" />
              </v-flex>
              <v-flex md6>
                <v-text-field
                  v-model="newItem.payroll"
                  :rules="reqRules"
                  label="Employee Payroll" />
              </v-flex>
            </v-layout>
          </v-container>
        </v-form>
        <v-card-actions>
          <v-spacer />
          <v-btn
            :disabled="!addvalid"
            color="green darken-1"
            @click="addEmployee()">Save</v-btn>
          <v-btn
            color="orange"
            @click="formDialog = false">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog
      v-model="delDialog"
      persistent
      max-width="290">
      <v-card>
        <v-card-title class="headline">Use Sure Want to Delete</v-card-title>
        <v-card-text>Employe Name:</v-card-text>
        <v-card-text class="text-primary text-xs-center">{{ ItemObj.name }} S/o {{ ItemObj.fName }}</v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="orange darken-1"
            flat
            @click="delDialog = false">Disagree</v-btn>
          <v-btn
            color="green darken-1"
            flat
            @click="deleteBtn(ItemObj._id); delDialog = false"
          >Agree</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog
      v-if="ItemObj"
      v-model="editDialog"
      persistent
      max-width="600">
      <v-card>
        <v-form
          ref="editform"
          v-model="editvalid">
          <v-card-title class="headline">Edit Item</v-card-title>
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex md6>
                <v-text-field
                  v-model="ItemObj.name"
                  :rules="reqRules"
                  label="Name"
                  hint="i.e: xyz-123"
                />
              </v-flex>
              <v-flex md6>
                <v-text-field
                  v-model="ItemObj.fName"
                  :rules="reqRules"
                  label="Father's Name" />
              </v-flex>
              <v-flex md12>
                <v-text-field
                  v-model="ItemObj.address"
                  :rules="reqRules"
                  label="Address" />
              </v-flex>
              <v-flex md6>
                <v-text-field
                  v-model="ItemObj.phone"
                  :rules="reqRules"
                  label="Contact Number" />
              </v-flex>
              <v-flex md6>
                <v-text-field
                  v-model="ItemObj.payroll"
                  :rules="reqRules"
                  label="Salary" />
              </v-flex>
            </v-layout>
          </v-container>
          <v-card-actions>
            <v-spacer />
            <v-btn
              :disabled="!editvalid"
              color="green darken-1"
              @click="editEmplyee()">Save</v-btn>
            <v-btn
              color="orange darken-1"
              @click="editDialog = false;">Cancel</v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import api from '../../services/payRoll-api'

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
      delDialog: false,
      formDialog: false,
      editDialog: false,
      addvalid: true,
      editvalid: true,
      getEmp: [],
      ItemObj: {},
      newItem: {},
      search: null,
      item_headers: [
        { sortable: false, text: 'Name', value: 'name' },
        { sortable: false, text: 'Father Name', value: 'fname' },
        { sortable: false, text: 'Address', value: 'address' },
        { sortable: false, text: 'Phone No', value: 'no', align: '' },
        { sortable: false, text: 'Payroll', value: 'payroll', align: '' },
        { sortable: false, text: 'Actions', value: 'Actions', align: 'right' }
      ],
      reqRules: [v => !!v || ' required']
    }
  },
  created () {
    this.getEmployee()
    this.getPermissions()
  },
  methods: {
    getEmployee () {
      api.getEmpApi().then(res => {
        this.getEmp = res
      })
    },
    showEdit (obj) {
      this.ItemObj = Object.assign({}, obj)
      this.editDialog = true
    },
    editEmplyee () {
      api.editEmployee(this.ItemObj).then(res => {
        if (res === true) {
          this.getEmployee()
          this.editDialog = false
        }
      })
    },
    deleteThis (item) {
      this.ItemObj = item
      this.delDialog = true
    },
    deleteBtn (id) {
      api.delEmployee(id).then(res => {
        if (res === true) {
          this.getEmployee()
          this.delDialog = false
        }
      })
    },
    addEmployee () {
      api.addEmployee(this.newItem).then(res => {
        if (res === true) {
          this.getEmployee()
          this.formDialog = false
        }
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
