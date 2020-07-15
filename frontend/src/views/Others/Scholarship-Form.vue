<template>
  <v-container>
    <v-layout wrap>
      <v-flex md12>
        <v-card
          v-bind="$attrs"
          v-on="$listeners">
          <helper-offset>
            <v-toolbar
              color="green"
              dark>
              <div xs2>
                <v-text-field
                  v-model="search"
                  flat
                  solo-inverted
                  label="Search"
                  prepend-inner-icon="mdi-magnify"
                />
              </div>
              <v-spacer />
              <v-btn
                v-if="permissions['add']"
                color="info"
                @click="newModal()">New</v-btn>
            </v-toolbar>
          </helper-offset>
        </v-card>
        <v-data-table
          :headers="item_headers"
          :items="scholarships"
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
            <td>{{ index+1 }}</td>
            <td>{{ item.fname }}</td>
            <td>{{ item.lname }}</td>
            <td>{{ item.its }}</td>
            <td>{{ item.cnic }}</td>
            <td class="text-xs-right">
              <v-icon
                v-if="permissions['edit']"
                color="blue"
                large
                @click="editModal(item)"
              >mdi-pencil-circle</v-icon>
              <v-icon
                v-if="permissions['delete']"
                color="red"
                large
                @click="deleteDialog=true; delObj=item"
              >mdi-delete-circle</v-icon>
            </td>
          </template>
        </v-data-table>
      </v-flex>
    </v-layout>

    <v-dialog
      v-model="dialog"
      persistent
      max-width="800px">
      <v-form v-model="valid">
        <v-card>
          <v-card-title>
            <span class="headline">Scholarship Form</span>
          </v-card-title>
          <v-card-text>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex
                  v-for="item of form"
                  :key="item['label']"
                  xs12
                  sm6>
                  <v-text-field
                    v-if="isNew"
                    :label="item['label']"
                    :rules="reqRules"
                    v-model="newObj[item['field']]"
                    outline
                  />
                  <v-text-field
                    v-else
                    :label="item['label']"
                    :rules="reqRules"
                    v-model="editObj[item['field']]"
                    outline
                  />
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer/>
            <v-btn
              color="blue darken-1"
              flat
              @click="dialog = false">Close</v-btn>
            <v-btn
              :disabled="!valid"
              color="blue darken-1"
              flat
              @click="save()">Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>

    <v-dialog
      v-model="deleteDialog"
      max-width="290">
      <v-card>
        <v-card-title class="headline">Sure Want to Delete...</v-card-title>
        <v-card-text>Applicant: {{ delObj['fname'] }} {{ delObj['lname'] }}</v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="warning"
            flat
            @click="deleteDialog = false">Cancel</v-btn>
          <v-btn
            color="warning"
            flat
            @click="deleteScholarship()">Delete</v-btn>
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
import othersApi from '../../services/others-api'
import constants from '../../services/constants'

export default {
  data () {
    return {
      permissions: [],
      dialog: false,
      deleteDialog: false,
      valid: false,
      search: null,
      scholarships: [],
      form: constants.SCHOLARSHIP_FORM,
      item_headers: constants.SCHOLARSHIP_HEADERS,
      newObj: {},
      editObj: {},
      delObj: {},
      isNew: false,
      reqRules: [v => !!v || 'Field is required'],
      text: '',
      snackbar: false
    }
  },
  created () {
    this.getPermissions()
    this.getScholarships()
  },
  methods: {
    newModal () {
      this.isNew = true
      this.dialog = true
    },
    editModal (item) {
      this.isNew = false
      this.editObj = { ...item }
      this.dialog = true
    },
    getScholarships () {
      othersApi.getScholarshipApi().then(res => {
        this.scholarships = res
      })
    },
    addScholarship () {
      othersApi.addScholarshipApi(this.newObj).then(res => {
        if (res.status === 'success') {
          this.dialog = false
          this.text = 'Form Added'
          this.snackbar = true
          this.getScholarships()
        }
      })
    },
    editScholarship () {
      othersApi.editScholarshipApi(this.editObj).then(res => {
        if (res.status === 'success') {
          this.dialog = false
          this.text = 'Form Edited'
          this.snackbar = true
          this.getScholarships()
        }
      })
    },
    deleteScholarship () {
      othersApi.deleteScholarshipApi(this.delObj['_id']['$oid']).then(res => {
        if (res.status === 'success') {
          this.delObj = {}
          this.deleteDialog = false
          this.text = 'Form Deleted'
          this.snackbar = true
          this.getScholarships()
        }
      })
    },
    save () {
      if (this.isNew) {
        this.addScholarship()
        return
      }
      this.editScholarship()
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
    }
  }
}
</script>
