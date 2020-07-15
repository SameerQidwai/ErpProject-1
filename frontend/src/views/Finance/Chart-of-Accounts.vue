<template>
  <v-container>
    <v-layout
      wrap
      row>
      <v-flex
        sm12
        md3
        class="pad">
        <v-card
          v-bind="$attrs"
          v-on="$listeners">
          <helper-offset>
            <v-toolbar
              :color="tableObj.toolbarColor"
              dark>
              <div xs2>
                <v-text-field
                  v-model="search"
                  label="seach Account"
                  class="mr-2"
                  flat
                  solo-inverted
                  dense
                  clearable
                  prepend-inner-icon="mdi-magnify"
                />
              </div>

              <!-- <v-btn @click="createHead()">create Head</v-btn> -->
            </v-toolbar>
          </helper-offset>

          <v-data-table
            :headers="acchead"
            :search="search"
            :items="accounts"
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
              slot-scope="{ index, item }">
              <tr
                class="cursor"
                @click="showCoa(item)">
                <td class="text-xs-left">{{ item.code }}</td>
                <td class="text-xs-right">{{ item.name }}</td>
              </tr>
            </template>
          </v-data-table>
        </v-card>
      </v-flex>

      <v-flex
        sm12
        md9
        class="pad">
        <v-card
          v-bind="$attrs"
          min-height="300px"
          v-on="$listeners">
          <helper-offset>
            <v-toolbar
              :color="tableObj.toolbarColor"
              dark>
              <div xs2>
                <span class="title">Hierarchy</span>
              </div>
              <v-spacer />
              <v-btn
                small
                @click="coaDialog = true; getHead()">Create COA</v-btn>
            </v-toolbar>
          </helper-offset>
          <v-layout
            justify-center
            align-center>
            <v-breadcrumbs :items="levels">
              <template v-slot:divider>
                <v-icon>mdi-forward</v-icon>
              </template>
              <template v-slot:item="props">
                <span class="headline">{{ props.item.name }}</span>
              </template>
            </v-breadcrumbs>
          </v-layout>
        </v-card>
      </v-flex>
      <!-- --------------------Chart Of Account Start------------------------------ -->

      <!-- create COA -->
      <v-dialog
        v-model="coaDialog"
        max-width="600">
        <v-card>
          <v-card-title class="headline">Add COA</v-card-title>
          <v-form
            ref="addCoaRef"
            v-model="validUserFormCoa">
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex md2>
                  <v-text-field
                    v-model="accAdd.code"
                    :rules="reqRules"
                    label="Code"
                    disabled />
                </v-flex>
                <v-flex md9>
                  <v-autocomplete
                    v-model="accAdd"
                    :items="accHeads"
                    :rules="reqRules"
                    item-text="name"
                    return-object
                    label="Select Header"
                    @input="getAccType(accAdd)"
                  />
                </v-flex>
                <v-flex xs1>
                  <v-icon
                    color="blue"
                    @click="ahDialog=true;">mdi-plus</v-icon>
                </v-flex>
                <v-flex md2>
                  <v-text-field
                    v-model="lvl_1.code"
                    :rules="reqRules"
                    label="Code"
                    disabled />
                </v-flex>
                <v-flex xs9>
                  <v-autocomplete
                    v-model="lvl_1"
                    :items="lvls_1"
                    :rules="reqRules"
                    menu-props="auto"
                    item-text="name"
                    return-object
                    label="Select Header"
                    @input="getAccType(lvl_1)"
                  />
                </v-flex>
                <v-flex xs1>
                  <v-icon
                    :disabled="accAdd=={}"
                    color="blue"
                    @click="atDialog=true; types_add=accHeads; refresh = accAdd; type_add=accAdd"
                  >mdi-plus</v-icon>
                </v-flex>
                <v-flex md2>
                  <v-text-field
                    v-model="lvl_2.code"
                    label="Code"
                    disabled />
                </v-flex>
                <v-flex xs9>
                  <v-autocomplete
                    v-model="lvl_2"
                    :items="lvls_2"
                    :rules="reqRules"
                    menu-props="auto"
                    item-text="name"
                    return-object
                    label="Select Header"
                    @input="getAccType(lvl_2)"
                  />
                </v-flex>
                <v-flex xs1>
                  <v-icon
                    :disabled="lvl_1 =={}"
                    color="blue"
                    @click="atDialog=true;types_add=lvls_1 ; refresh = lvl_1; type_add=lvl_1"
                  >mdi-plus</v-icon>
                </v-flex>

                <v-flex md2>
                  <v-text-field
                    v-model="lvl_3.code"
                    label="Code"
                    disabled />
                </v-flex>
                <v-flex xs9>
                  <v-autocomplete
                    v-model="lvl_3"
                    :items="lvls_3"
                    :rules="reqRules"
                    menu-props="auto"
                    item-text="name"
                    label="Select Header"
                    return-object
                  />
                </v-flex>
                <v-flex xs1>
                  <v-icon
                    :disabled="lvl_2 =={}"
                    color="blue"
                    @click="atDialog=true;types_add=lvls_2 ; refresh = lvl_2; type_add=lvl_2"
                  >mdi-plus</v-icon>
                </v-flex>
              </v-layout>
            </v-container>
          </v-form>
        </v-card>
      </v-dialog>

      <!-- create type -->
      <v-dialog
        v-model="atDialog"
        persistent
        max-width="400">
        <v-card>
          <v-card-title class="headline">Add Account Type</v-card-title>
          <v-form
            ref="addAccTypeRef"
            v-model="validUserForm">
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex md2>
                  <v-text-field
                    v-model="type_add.code"
                    :rules="reqRules"
                    label="Code"
                    disabled />
                </v-flex>
                <v-flex md10>
                  <v-autocomplete
                    v-model="type_add"
                    :items="types_add"
                    :rules="reqRules"
                    item-text="name"
                    return-object
                    label="Select Header"
                  />
                </v-flex>
                <v-flex md2>
                  <v-text-field
                    v-model="type_add.at_code"
                    label="Code"
                    disabled />
                </v-flex>
                <v-flex md10>
                  <v-text-field
                    :rules="reqRules"
                    v-model="type_add.at_name"
                    label="Sub Header"
                    required
                  />
                </v-flex>
              </v-layout>
            </v-container>
          </v-form>
          <v-card-actions>
            <v-spacer />
            <v-btn
              :disabled="!validUserForm"
              color="green darken-1"
              @click="addAccType(type_add,refresh)"
            >Save</v-btn>
            <v-btn
              color="orange"
              @click="atDialog = false">Cancel</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <!-- create type end -->

      <!--Crerte  head start-->
      <v-dialog
        v-model="ahDialog"
        persistent
        max-width="400">
        <v-card>
          <v-card-title class="headline">Add Account Type</v-card-title>
          <v-form
            ref="addheadRef"
            v-model="validForm">
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex md2>
                  <v-text-field
                    v-model="head_add.at_code"
                    label="Code"
                    disabled />
                </v-flex>
                <v-flex md10>
                  <v-text-field
                    :rules="reqRules"
                    v-model="head_add.at_name"
                    label="Sub Header"
                    required
                  />
                </v-flex>
              </v-layout>
            </v-container>
          </v-form>
          <v-card-actions>
            <v-spacer />
            <v-btn
              :disabled="!validForm"
              color="green darken-1"
              @click="addHeadType(head_add)"
            >Save</v-btn>
            <v-btn
              color="orange"
              @click="ahDialog = false">Cancel</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <!--Crerte head end-->

      <!----------------------- Account Type Section End --------------------------->
    </v-layout>
  </v-container>
</template>

<script>
import api from '../../services/coa-api'
export default {
  data () {
    return {
      menue_items: [{ title: 'Account Types' }, { title: 'Chart of Accounts' }],
      tableObj: {},
      firstDecision: {
        title: 'Account Types'
      },
      coaDialog: false,
      atDialog: false,
      editAtDialog: false,
      editCoaDialog: false,
      delAtDialog: false,
      delCoaDialog: false,
      // array of table headers of acount type table -------------

      // ---------------------------------------

      validUserForm: true,
      validUserFormCoa: true,

      reqRules: [v => !!v || ' required'],

      selected: false,
      search: null,

      editAtData: {},

      editCoaData: {},

      acchead: [
        { text: 'code', value: 'code', align: 'left' },
        { text: 'Name', value: 'name', align: 'right' }
      ],

      accHeaderData: undefined,
      accTypeData: undefined,
      accAdd: {},
      lvl_1: {},
      lvl_2: {},
      lvl_3: {},
      lvls_1: [],
      lvls_2: [],
      lvls_3: [],
      type_add: {},
      types_add: [],
      refresh: {},
      accounts: [],
      accHeads: [],
      levels: [],
      head_add: {},
      ahDialog: false,
      validForm: true
    }
  },
  created () {
    this.modules(this.firstDecision)
    this.getCoa()
  },

  methods: {
    modules (item) {
      if (item.title == 'Chart of Accounts') {
        this.accAdd = {}
        this.tableObj = {
          headers: this.coaheaders,
          tableData: this.coa_array,
          searchLabel: 'Search COA',
          toolbarColor: 'cyan',
          buttonName: 'Create COA',
          showData: false
        }
      } else {
        this.accAdd = {}
        this.tableObj = {
          headers: this.typeheaders,
          tableData: this.accType_array,
          searchLabel: 'Search Account Types',
          toolbarColor: 'orange',
          buttonName: 'Create Account Type',
          showData: true
        }
      }
    },

    showEdit (obj) {
      // open Edit Dialog
      this.editAtData = Object.assign({}, obj)
      this.editAtDialog = true
    },

    deleteAt (item) {
      // open Delete Dialog
      this.editAtData = item
      this.delAtDialog = true
    },
    showCoaEdit (obj) {
      // open Edit Dialog
      this.editCoaData = Object.assign({}, obj)
      this.editCoaDialog = true
    },
    editCoa () {},

    deleteCOA (item) {
      this.editCoaData = item
      this.delCoaDialog = true
    },

    getHead () {
      api.getHead().then(res => {
        if (res) {
          this.accHeads = res
        }
      })
    },
    getAccType (data) {
      api.getAccType(data).then(res => {
        console.log(res)
        if (res) {
          if (data._lvl1) {
            this.lvls_3 = res
            this.lvl_3 = {}
          } else if (data._head) {
            this.lvls_2 = res
            this.lvls_3 = []
            this.lvl_2 = {}
            this.lvl_3 = {}
          } else {
            this.lvls_1 = res
            this.lvls_2 = []
            this.lvls_3 = []
            this.lvl_1 = {}
            this.lvl_2 = {}
            this.lvl_3 = {}
          }
        }
      })
    },

    addAccType (data, refresh) {
      api.addAccType(data).then(res => {
        if (res) {
          this.getAccType(refresh)
          data = {}
          this.atDialog = false
          this.getCoa()
        }
      })
    },

    addHeadType (data) {
      api.addHeadType(data).then(res => {
        if (res) {
          this.getHead()
          data = {}
          this.ahDialog = false
        }
      })
    },

    getCoa () {
      api.getCoa().then(res => {
        if (res) {
          this.accounts = res
        }
      })
    },

    showCoa (data) {
      api.showCoa(data).then(res => {
        if (res) {
          this.levels = res
        }
      })
    }
  }
}
</script>

<style scoped>
.pad {
  padding-top: 60px !important;
  padding-left: 20px;
}
.text-in-center {
  text-align: center !important;
}
.btn-pos {
  position: absolute;
}
.cursor {
  cursor: pointer;
}
</style>
