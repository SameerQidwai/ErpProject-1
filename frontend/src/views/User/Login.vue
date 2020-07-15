<template>
  <div>
    <v-content>
      <v-container
        fluid
        fill-height>
        <v-layout
          align-center
          justify-center>
          <v-flex
            xs12
            sm8
            md4>
            <v-card class="elevation-12">
              <v-toolbar
                dark
                color="primary">
                <v-toolbar-title>User Login</v-toolbar-title>
                <v-spacer />
                <v-btn
                  router
                  to="/admin-login"
                  color="blue darken-1">Admin Login</v-btn>
              </v-toolbar>
              <v-card-text>
                <v-form
                  ref="adminLoginRef"
                  v-model="validUserForm">
                  <v-text-field
                    v-model="loginDetails['username']"
                    :rules="reqRules"
                    prepend-icon="mdi-account"
                    name="login"
                    label="Login"
                    type="text"
                  />
                  <v-text-field
                    id="password"
                    v-model="loginDetails['password']"
                    :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                    :type="show1 ? 'text' : 'password'"
                    :rules="reqRules"
                    prepend-icon="mdi-lock"
                    name="password"
                    label="Password"
                    @click:append="show1 = !show1"
                  />
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-btn
                  :disabled="!validUserForm"
                  color="green darken-1"
                  @click="authorize()">Login</v-btn>
              </v-card-actions>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>

    <v-snackbar
      v-model="snackbar"
      color="red">
      {{ text }}
      <v-btn
        dark
        flat
        @click="snackbar = false">Close</v-btn>
    </v-snackbar>
  </div>
</template>

<script>
import userApi from '../../services/user-api'

export default {
  data () {
    return {
      validUserForm: true,
      show1: false,
      loginDetails: {},
      reqRules: [v => !!v || ' required'],
      text: 'Incorrect Username or Password',
      snackbar: false
    }
  },
  methods: {
    authorize () {
      if (this.$refs.adminLoginRef.validate()) {
        userApi.authenticate(this.loginDetails).then(resp => {
          if (resp) {
            localStorage.setItem('views', resp['views'])
            localStorage.setItem('permissions', JSON.stringify(resp['permissions']))
            localStorage.setItem('links', JSON.stringify(resp['links']))
            location.reload()
          } else {
            this.snackbar = true
          }
        })
      }
    }
  }
}
</script>

<style scoped>
nav#core-toolbar {
  display: none;
}

aside#app-drawer {
  display: none;
}
</style>
