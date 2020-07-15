<template>
  <v-container
    fill-height
    fluid
    grid-list-xl>
    <v-layout wrap>
      <v-flex
        sm12
        lg12
        class="pad">
        <v-form
          ref="form"
          v-model="valid">
          <v-text-field
            v-model="newCustomer.name"
            :rules="reqRules"
            label="Customer Name"
            clearable
          />

          <v-text-field
            v-model="newCustomer.phone"
            :rules="phoneRules"
            label="Phone#"
            hint="Phone# starts with +92"
            clearable
            persistent-hint
          />

          <v-text-field
            v-model="newCustomer.email"
            label="E-mail"
            clearable/>

          <v-text-field
            v-model="newCustomer.address"
            :counter="100"
            label="Address"
            max="100"
            clearable
          />

          <v-btn
            :disabled="!valid"
            color="success"
            @click="addCustomer">Add</v-btn>

          <v-btn
            color="error"
            @click="reset">Reset Form</v-btn>
        </v-form>
      </v-flex>
    </v-layout>

    <v-snackbar
      v-model="snackbar.stat"
      :color="snackbar.color"
      multi-line >
      <v-icon>{{ snackbar.icon }}</v-icon>
      <b>{{ snackbar.msg }}</b>
      <v-icon @click="snackbar=false">mdi-close</v-icon>
    </v-snackbar>
  </v-container>
</template>

<script>
import api from '../../services/sales-api'
export default {
  data () {
    return {
      valid: true,
      newCustomer: {},
      reqRules: [v => !!v || 'required'],
      // emailRules: [v => /.+@.+/.test(v) || "E-mail must be valid"],
      phoneRules: [
        v => !!v || 'Phone# is required',
        v => (v && v.length === 13) || 'Phone# must be equal to 13 digits'
      ],
      // addressRules: [
      //   v =>
      //     (v && v.length <= 100) || "Address must be less than 100 characters"
      // ],

      snackbar: {}
    }
  },
  methods: {

  }
}
</script>
<style  scoped>
</style>
