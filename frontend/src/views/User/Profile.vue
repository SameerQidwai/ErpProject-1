<template>
  <v-container
    fill-height
    fluid
    grid-list-xl>
    <v-layout
      justify-center
      wrap>
      <v-flex
        xs12
        md8>
        <material-card
          :title="fullName"
          :text="user.role"
          color="green">
          <v-form>
            <v-container py-0>
              <v-layout wrap>

                <v-flex
                  xs12
                  md6>
                  <v-text-field
                    v-model="user.contact"
                    label="Contact"
                    outline
                    readonly />
                </v-flex>
                <v-flex
                  xs12
                  md6>
                  <v-text-field
                    v-model="user.email"
                    label="Email"
                    outline
                    readonly />
                </v-flex>

                <v-flex
                  xs12
                  md6>
                  <v-text-field
                    v-model="user.username"
                    label="Username"
                    outline
                    readonly />
                </v-flex>
              </v-layout>
            </v-container>
          </v-form>
        </material-card>
      </v-flex>

    </v-layout>
  </v-container>
</template>

<script>
export default {
  data () {
    return {
      item_headers: [
        { sortable: false, text: 'ID', value: 'id' },
        { sortable: false, text: 'Name', value: 'name' },
        { sortable: false, text: 'Contact', value: 'contact' },
        { sortable: false, text: 'Email', value: 'email' },
        { sortable: false, text: 'Role', value: 'role', align: '' },
        { sortable: false, text: 'Username', value: 'username', align: '' },
        { sortable: false, text: 'Actions', value: 'Actions', align: 'right' }
      ],
      user: {
        id: 5,
        Firstname: 'Hamza',
        Lastname: 'Quaid Joher',
        contact: '+923342354532',
        email: 'hamza@gmail.com',
        role: 'Admin',
        username: 'Sam123'
      },
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
      newItem: {},
      newUser: {}
    }
  },
  computed: {
    fullName () {
      return this.user['Firstname'] + ' ' + this.user['Lastname']
    }
  }
}
</script>
