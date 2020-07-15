<template>
  <section>
    <v-container>
      <v-card />
    </v-container>
    <v-container
      fill-height
      fluid
      grid-list-xl>
      <v-layout
        wrap
        justify-center>
        <v-flex md12>
          <!-- can make this component will do after -->
          <v-card
            v-bind="$attrs"
            v-on="$listeners">
            <helper-offset>
              <v-toolbar
                color="cyan"
                dark
                tabs>
                <span class="headline">Balance Sheet</span>
              </v-toolbar>
            </helper-offset>
            <v-container
              fill-height
              fluid
              grid-list-xl>
              <v-layout
                wrap
                justify-center>
                <v-flex>
                  <div
                    v-for="values of accounts"
                    :key="values._id"
                    class="brdr">
                    <v-layout class="backColor">
                      <v-flex md6>
                        <h4>{{ values.name }}</h4>
                      </v-flex>
                      <v-flex
                        md6
                        text-xs-right>
                        <h4>{{ values.blnc=blnclvl0(values._id) +blnclvl3(values._id) }}</h4>
                      </v-flex>
                    </v-layout>
                    <div
                      v-for="i of lvl1"
                      :key="i._id">
                      <div v-if="i['_head'] == values['_id']">
                        <v-layout class="clvl1 backColor1">
                          <v-flex md6>
                            <h4>{{ i.name }}</h4>
                          </v-flex>
                          <v-flex
                            md6
                            text-xs-right>
                            <h4>{{ i.blnc=blnclvl1(i._id) + blnclvl3(i._id) }}</h4>
                          </v-flex>
                        </v-layout>
                        <div
                          v-for="j of lvl2"
                          :key="j._id">
                          <div v-if="j['_lvl1'] == i['_id']">
                            <v-layout class="clvl2 backColor">
                              <v-flex md6>
                                <h4>{{ j.name }}</h4>
                              </v-flex>
                              <v-flex
                                md6
                                text-xs-right>
                                <h4>{{ j.blnc=blnclvl2(j._id) + blnclvl3(j._id) }}</h4>
                              </v-flex>
                            </v-layout>
                            <div
                              v-for="k of lvl3"
                              :key="k._id">
                              <div v-if="k['_lvl2'] == j['_id']">
                                <v-layout class="clvl3 backColor1">
                                  <v-flex md6>
                                    <h4>{{ k.name }}</h4>
                                  </v-flex>
                                  <v-flex
                                    md6
                                    text-xs-right>
                                    <h4>{{ k.blnc=blnclvl3(k._id ) }}</h4>
                                  </v-flex>
                                </v-layout>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </section>
</template>

<script>
import api from '../../services/coa-api'

export default {
  data () {
    return {
      accounts: [],
      menu1: false,
      menu2: false,
      from_date: undefined,
      to_date: undefined,
      lvl1: [],
      lvl2: [],
      lvl3: [],
      balances: null,
      show: false,
      isShow: false,
      toggle: false
    }
  },
  computed: {
    check () {
      this.getAccounts()
      return this.balances
    }
  },
  created () {
    this.getAccounts()
    this.getBalances()
  },
  methods: {
    getAccounts () {
      api.getAccounts().then(res => {
        this.accounts = res[0]
        this.lvl1 = res[1]
        this.lvl2 = res[2]
        this.lvl3 = res[3]
        this.isShow = true
      })
    },
    getBalances () {
      api.getBalances().then(resp => {
        this.balances = resp
        this.show = true
      })
    },
    blnclvl0 (id) {
      let data = this.balances[0].filter(map => map._id == id)
      let arr = 0
      for (let values of data) {
        arr = arr + (values['debit'] - values['credit'])
      }
      return arr
    },
    blnclvl1 (id) {
      let data = this.balances[1].filter(map => map._id == id)
      let arr = 0
      for (let values of data) {
        arr = arr + (values['debit'] - values['credit'])
      }
      return arr
    },
    blnclvl2 (id) {
      let data = this.balances[2].filter(map => map._id == id)
      let arr = 0
      for (let values of data) {
        arr = arr + (values['debit'] - values['credit'])
      }
      return arr
    },
    blnclvl3 (id) {
      let data = this.balances[3].filter(map => map._id == id)
      let arr = 0
      for (let values of data) {
        arr = arr + (values['debit'] - values['credit'])
      }
      return arr
    },
    filterBalance (from_date, to_date) {
      var data = { from_date, to_date }
      api.balanceFilter(data).then(res => {
        this.balances = res
        this.show = true
      })
    }
  }
}
</script>

<style>
.font-text-bold {
  font-weight: 400 !important;
}

h4 {
  margin: 0px;
}

.brdr {
  border: 1px solid;
}

.brdr {
  border: 1px solid;
}

.clvl1 {
  padding: 0px 10px 0 15px;
}
.clvl2 {
  padding: 0px 10px 0 30px;
}
.clvl3 {
  padding: 0px 10px 0 45px;
}
.backColor {
  background-color: #ddebf7;
}
.backColor1 {
  background-color: white;
}
</style>
