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
              color="blue"
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
                @click="formDialog = true">Add Tenant</v-btn>
            </v-toolbar>
          </helper-offset>
        </v-card>
        <!-- will do som other Time -->
        <v-data-table
          :headers="item_headers"
          :items="tenants"
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
            <td>{{ item.tenantName }}</td>
            <!-- itemCode-->
            <td>{{ item.tenantPhone }}</td>
            <td>{{ item.tenantNIC }}</td>
            <!-- itemType-->
            <!--itemCost -->
            <td>{{ item.tenantAddress }}</td>
            <td>{{ item.tenantEmail }}</td>
            <td class="text-xs-right">
              <!-- <v-icon color="green" large @click="oldTenant = item; detailDialog = true;" >mdi-view-list</v-icon> -->
              <v-icon
                v-if="permissions['edit']"
                color="blue"
                large
                @click="showData(item); editDialog = true;"
              >mdi-pencil-circle</v-icon>
              <v-icon
                v-if="permissions['delete']"
                color="red"
                large
                @click="oldTenant = item; delDialog = true;"
              >mdi-delete-circle</v-icon>
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
        <v-form
          ref="createform"
          v-model="createvalid">
          <v-card-title class="headline">Add Tenant</v-card-title>
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex md6>
                <v-text-field
                  v-model="newTenant.tenantName"
                  label="Name"
                  hint="i.e: xyz-123"
                />
              </v-flex>
              <v-flex md6>
                <v-text-field
                  v-model="newTenant.tenantPhone"
                  label="Phone"
                  hint="i.e: xyz-123"
                />
              </v-flex>
              <v-flex md6>
                <v-text-field
                  v-model="newTenant.tenantNIC"
                  label="CNIC"
                  hint="i.e: xyz-123"
                />
              </v-flex>
              <v-flex md6>
                <v-text-field
                  v-model="newTenant.tenantAddress"
                  label="Permenant Address"
                  required
                />
              </v-flex>
              <v-flex md6>
                <v-text-field
                  v-model="newTenant.tenantEmail"
                  label="Email Address"
                  required
                />
              </v-flex>
              <v-flex md6>
                <v-text-field
                  v-model="newTenant.familyMember"
                  label="Family member"
                  type="Number"
                  required
                />
              </v-flex>
              <v-flex md12>
                <v-textarea
                  v-model="newTenant.tenantDetail"
                  label="Detail"
                  rows="1" />
              </v-flex>
            </v-layout>
          </v-container>
          <v-card-actions>
            <v-spacer />
            <v-btn
              :disabled="!createvalid"
              color="green darken-1"
              @click="addTanent();formDialog = false"
            >Save</v-btn>
            <v-btn
              color="orange"
              @click="formDialog = false">Cancel</v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>
    <!--Form dialog end-->

    <!-- Delete dialog End -->
    <v-dialog
      v-if="oldTenant"
      v-model="editDialog"
      persistent
      max-width="600">
      <v-card>
        <v-form
          ref="editform"
          v-model="editvalid">
          <v-card-title class="headline">Edit Tenant</v-card-title>
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex md6>
                <v-text-field
                  :rules="reqRules"
                  v-model="oldTenant.tenantName"
                  label="Name"
                  outline
                  hint="i.e: xyz-123"
                />
              </v-flex>
              <v-flex md6>
                <v-text-field
                  v-model="oldTenant.tenantPhone"
                  :rules="reqRules"
                  label="Phone"
                  outline
                  hint="i.e: xyz-123"
                />
              </v-flex>
              <v-flex md6>
                <v-text-field
                  v-model="oldTenant.tenantNIC"
                  :rules="reqRules"
                  label="CNIC"
                  outline
                  hint="i.e: xyz-123"
                />
              </v-flex>
              <v-flex md6>
                <v-text-field
                  :rules="reqRules"
                  v-model="oldTenant.tenantAddress"
                  label="Permenant Address"
                  outline
                  required
                />
              </v-flex>
              <v-flex md6>
                <v-text-field
                  v-model="oldTenant.tenantEmail"
                  label="Email Address"
                  outline
                  required
                />
              </v-flex>
              <v-flex md6>
                <v-text-field
                  :rules="reqRules"
                  v-model="oldTenant.familyMember"
                  type="Number"
                  label="Family Member"
                  outline
                  required
                />
              </v-flex>
              <v-flex md12>
                <v-textarea
                  v-model="oldTenant.tenantDetail"
                  label="Detail"
                  rows="1"
                  outline
                />
              </v-flex>
            </v-layout>
          </v-container>
          <v-card-actions>
            <v-spacer />
            <v-btn
              color="green darken-1"
              @click="editTanent()">Save</v-btn>
            <v-btn
              color="orange darken-1"
              @click="editDialog = false;">Cancel</v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>

    <!--Delete dialog form-->
    <v-dialog
      v-model="delDialog"
      max-width="290">
      <v-card>
        <v-card-title class="headline">Sure Want to Delete...</v-card-title>
        <v-card-text>Tenant Name: {{ oldTenant.tenantName }}</v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="orange darken-1"
            flat
            @click="delDialog = false">Cancel</v-btn>
          <v-btn
            color="green darken-1"
            flat
            @click="delTanent(oldTenant._id); delDialog = false"
          >Delete</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!--End Delete dialog-->
     <v-snackbar
    :value="snackbar.stat"
    :color="snackbar.color"
  >
    <v-icon dark>{{ snackbar.icon }}</v-icon>
    <b>{{ snackbar.msg }}</b>
    <v-icon @click="snackbar.stat=false">mdi-close-circle</v-icon>
  </v-snackbar>
    <!--End Dialog'S-->
  </v-container>
</template>

<script>
import rentApi from '../../services/rent-api'

export default {
  data () {
    return {
      /** For valid variable */
      snackbar:{stat:false},
      valid: true,
      createvalid: true,
      editvalid: true,
      search: null,
      /** For valid variable */

      item_headers: [
        { sortable: false, text: 'Name', value: 'name' },
        { sortable: false, text: 'Phone', value: 'type' },
        { sortable: false, text: 'CNIC', value: 'nic' },
        { sortable: false, text: 'Old Address', value: 'address' },
        { sortable: false, text: 'Email Address', value: 'tenantEmail' },
        { sortable: false, text: 'Action', align: 'right' }
      ],
      /** Dialog  variable */
      formDialog: false, // hide and show form Dialog
      editDialog: false, // hide and show eidt Dialog
      delDialog: false,
      /** Dialog  variable */

      oldTenant: {}, // call Item attribute in edit dialog
      newTenant: {},
      tenants: [],
      reqRules: [v => !!v || ' required']
    }
  },
  created () {
    this.getTenantInfo()
    this.getPermissions()
  },
  methods: {
    getTenantInfo () {
      rentApi.getTenantApi().then(res => {
        this.tenants = res
      })
    },
    addTanent () {
      if (this.$refs.createform.validate()) {
        rentApi.addTenantApi(this.newTenant).then(res => {
          if (res.status === 'success') {
            this.getTenantInfo()
            this.$refs.createform.reset()
          }
        })
      }
    },
    
    editTanent () {
      if (this.$refs.editform.validate()) {
        rentApi.editTenantApi(this.oldTenant).then(res => {
          console.log(res)
          if (res.status === 'success') {
            this.getTenantInfo()
            this.editDialog = false
          }
        })
      }
    },
    delTanent (tenantId) {
      rentApi.deleteTenantApi(tenantId).then(res => {
       if (res === 202) {
          this.getTenantInfo()
        }else if (res === 200){
          this.snackbar = {
            msg: 'You can`t delete this Tenant, remove his ownership first',
            stat: true,
            color: 'red',
            icon: 'mdi-close-circle-outline'
          }
        } 
      })
    },
    showData (obj) {
      this.oldTenant = Object.assign({}, obj)
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

<style scoped>

</style>
