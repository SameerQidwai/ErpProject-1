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
                  label="Search User"
                  prepend-inner-icon="mdi-magnify"
                />
              </div>
              <v-spacer />
              <v-btn @click="formDialog = true">Create User</v-btn>
            </v-toolbar>
          </helper-offset>
        </v-card>
        <!-- will do som other Time -->
        <v-data-table
          :headers="item_headers"
          :items="array"
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
            <td>{{ item.id }}</td>
            <td>{{ item.name }}</td>
            <td>{{ item.contact }}</td>
            <td>{{ item.email }}</td>
            <td>{{ item.role }}</td>
            <td>{{ item.username }}</td>
            <!--itemCost -->
            <td class="text-xs-right">
              <v-icon
                color="blue"
                user-obj="{}"
                large
                @click="showEdit(item)">mdi-pencil-circle</v-icon>
              <v-icon
                color="red"
                user-obj="{}"
                large
                @click="deleteThis(item)">mdi-delete-circle</v-icon>
            </td>
          </template>
        </v-data-table>
      </v-flex>
    </v-layout>
    <!--DialogS-->

    <!--Dialog  form to create item-->
    <v-dialog
      v-model="formDialog"
      persistent
      max-width="600">
      <v-card>
        <v-card-title class="headline">Add New User</v-card-title>
        <v-container grid-list-md>
          <v-form
            ref="addUserRef"
            v-model="validUserForm">
            <v-layout wrap>
              <v-flex
                xs12
                sm3
                md3>
                <v-text-field
                  :rules="reqRules"
                  v-model="newUser.fname"
                  label="First Name" />
              </v-flex>
              <v-flex
                xs12
                sm3
                md3>
                <v-text-field
                  :rules="reqRules"
                  v-model="newUser.lname"
                  label="Last Name" />
              </v-flex>
              <v-flex
                xs12
                sm6
                md6>
                <v-text-field
                  :rules="reqRules"
                  v-model="newUser.contact"
                  label="Contact" />
              </v-flex>
              <v-flex
                md12
                xs12
                sm12>
                <v-text-field
                  :rules="reqRules"
                  v-model="newUser.address"
                  label="Address" />
              </v-flex>
              <v-flex
                xs12
                sm6
                md6>
                <v-text-field
                  v-model="newUser.email"
                  :rules="reqRules"
                  label="Email" />
              </v-flex>
              <v-flex
                xs12
                sm6
                md6>
                <v-text-field
                  :rules="reqRules"
                  v-model="newUser.username"
                  label="Username" />
              </v-flex>
              <v-flex
                xs12
                sm6
                md6>
                <v-text-field
                  v-model="newUser.password"
                  :append-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'"
                  :rules="[reqRules, minRules]"
                  :type="show2 ? 'text' : 'password'"
                  label="Password"
                  hint="At least 8 characters"
                  counter
                  @click:append="show2 = !show2"
                />
              </v-flex>
              <v-flex
                xs12
                sm6
                md6>
                <v-text-field
                  v-model="newUser.rePassword"
                  :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                  :rules="[reqRules, minRules, passwordConfirmationRule]"
                  :type="show1 ? 'text' : 'password'"
                  label="Confirm Password"
                  hint="At least 8 characters"
                  counter
                  @click:append="show1 = !show1"
                />
              </v-flex>
              <v-flex
                xs12
                sm6
                md6>
                <v-select
                  v-model="newUser.role"
                  :items="userroles"
                  :rules="reqRules"
                  menu-props="auto"
                  label="Select Role"
                  hide-details
                  single-line
                />
              </v-flex>
            </v-layout>
          </v-form>
        </v-container>
        <v-card-actions>
          <v-spacer />
          <v-btn
            :disabled="!validUserForm"
            color="green darken-1"
            @click="addItem()">Save</v-btn>
          <v-btn
            color="orange"
            @click="formDialog = false">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!--Form dialog end-->

    <!-- delete Dialog -->
    <v-dialog
      v-model="delDialog"
      persistent
      max-width="290">
      <v-card>
        <v-card-title class="headline">Are You Sure Want To Delete {{ UserObj.itemName }}</v-card-title>
        <!-- <v-card-text>Item in stock: {{UserObj.itemQty}}</v-card-text> -->
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="orange darken-1"
            flat
            @click="delDialog = false">Disagree</v-btn>
          <v-btn
            color="green darken-1"
            flat
            @click="deleteBtn(UserObj._id); delDialog = false"
          >Agree</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- Delete dialog End -->

    <!--Eidt Dialog-->
    <v-dialog
      v-if="UserObj"
      v-model="editDialog"
      persistent
      max-width="600">
      <v-card>
        <form ref="form">
          <v-card-title class="headline">Edit User</v-card-title>
          <v-container grid-list-md>
            <v-layout wrap>
              <!-- <v-flex xs12 sm6 md6>
                <v-text-field label="Item Code" v-model="UserObj.code" hint="i.e: xyz-123"></v-text-field>
              </v-flex>-->
              <v-flex
                xs12
                sm6
                md6>
                <v-text-field
                  v-model="UserObj.name"
                  label="Name"
                  required />
              </v-flex>
              <v-flex
                xs12
                sm6
                md6>
                <v-text-field
                  v-model="UserObj.contact"
                  label="Contact"
                  required />
              </v-flex>

              <v-flex
                xs12
                sm6
                md6>
                <v-text-field
                  v-model="UserObj.email"
                  label="Email"
                  required />
              </v-flex>
              <v-flex
                xs12
                sm6
                md6>
                <v-select
                  v-model="UserObj.role"
                  :items="userroles"
                  menu-props="auto"
                  label="Select Role"
                  hide-details
                  single-line
                />
              </v-flex>
              <v-flex
                md12
                xs12
                sm12>
                <v-text-field
                  v-model="UserObj.username"
                  label="Username" />
              </v-flex>
            </v-layout>
          </v-container>
          <v-card-actions>
            <v-spacer />
            <v-btn
              :disabled="disThisBtn"
              color="green darken-1"
              @click="editItem()">Save</v-btn>
            <v-btn
              color="orange darken-1"
              @click="editDialog = false;">Cancel</v-btn>
          </v-card-actions>
        </form>
      </v-card>
    </v-dialog>
    <!--Edit dialog End-->
  </v-container>
</template>

<script>
import api from '../../services/api'

export default {
  /** props for header can make it a component */
  props: {
    color: {
      type: String,
      default: 'seconadry'
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
      validUserForm: true,
      search: null,
      disThisBtn: false,
      show1: false,
      show2: false,
      item_headers: [
        { sortable: false, text: 'ID', value: 'id' },
        { sortable: false, text: 'Name', value: 'name' },
        { sortable: false, text: 'Contact', value: 'contact' },
        { sortable: false, text: 'Email', value: 'email' },
        { sortable: false, text: 'Role', value: 'role', align: '' },
        { sortable: false, text: 'Username', value: 'username', align: '' },
        { sortable: false, text: 'Actions', value: 'Actions', align: 'right' }
      ],
      array: [
        {
          id: 1,
          name: 'Sameer',
          contact: '+923342354532',
          email: 'abc@gmail.com',
          role: 'Admin',
          username: 'Sam123'
        },
        {
          id: 2,
          name: 'Murtaza',
          contact: '+923342354532',
          email: 'xyz@gmail.com',
          role: 'Admin',
          username: 'Murt123'
        },
        {
          id: 3,
          name: 'Shabbir',
          contact: '+923342354532',
          email: 'rte@gmail.com',
          role: 'Accountant',
          username: 'Shab213'
        },
        {
          id: 4,
          name: 'Ali',
          contact: '+923342354532',
          email: 'ali@gmail.com',
          role: 'Salesman',
          username: 'Ali232'
        },
        {
          id: 5,
          name: 'Hamza',
          contact: '+923342354532',
          email: 'hamza@gmail.com',
          role: 'Admin',
          username: 'Sam123'
        }
      ],
      product: [], // get all product availlabe for the autocomplete
      delDialog: false, // hide $ show delete dialog
      formDialog: false, // hide and show form Dialog
      editDialog: false, // hide and show eidt Dialog
      itemId: null, // Save Item id to delete
      ErrorDel: false, // snackbar error function
      userroles: ['Admin', 'Salesman', 'Accountant'],
      getsupp: [],
      UserObj: {}, // call Item attribute in edit dialog
      reqRules: [v => !!v || ' required'],
      minRules: [v => v.length >= 8 || 'Min 8 characters'],
      newUser: {}
    }
  },
  computed: {
    passwordConfirmationRule () {
      return () =>
        this.newUser['password'] === this.newUser['rePassword'] ||
        'Password must match'
    }
  },
  created () {
    // call function on load
    api.getsup().then(res => {
      this.getsupp = res
    })
    /** Get All Item into Table */
    api.getItemApi().then(res => {
      // this.array = res;
    })
  },
  methods: {
    deleteThis (item) {
      // open Delete Dialog
      this.UserObj = item
      this.delDialog = true
      this.itemId = this.UserObj._id
    },
    deleteBtn () {
      // Del7ete Item
      /** this function delete The Item  */
      api.deleteItemApi(this.itemId).then(res => {
        if (res === true) {
          api.getItemApi().then(res => {
            // reload Item Table
            this.array = res
            this.delDialog = false
          })
        }
      })
    },
    showEdit (obj) {
      // open Edit Dialog
      this.UserObj = Object.assign({}, obj)
      this.editDialog = true
    },
    editItem () {
      // Edit Item
      console.log(this.UserObj)
      /** This api edit data end call the table agian */
      api.editItemApi(this.UserObj).then(res => {
        if (res === true) {
          api.getItemApi().then(res => {
            // this.array = res;
            this.editDialog = false
          })
        }
      })
    },
    addItem () {
      if (this.$refs.addUserRef.validate()) {
        this.array.push(this.newUser)
        this.formDialog = false
        this.$refs.addUserRef.reset()
      } else {
        alert("you can't leave field empty")
      }
    }
  }
}
</script>
<!--Edit Item and Delete created their api but not yet calling-->
<style lang="sass" scoped>

</style>
