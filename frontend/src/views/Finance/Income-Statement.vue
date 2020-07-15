<template>
  <v-container>
    <v-layout justify-center>
      <v-flex md7>
        <!-- can make this component will do after -->
        <v-card
          v-bind="$attrs"
          v-on="$listeners">
          <helper-offset>
            <v-toolbar
              color="orange"
              dark
              tabs>
              <v-flex text-xs-center>
                <span class="display-2">Income Statement</span>
              </v-flex>
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
                  class="brdr"
                  md12>
                  <v-layout>
                    <v-flex md6>
                      <h4>{{ values.name }}</h4>
                    </v-flex>
                    <v-flex md6>
                      <h4>{{ values.balc=blnclvl0(values._id) }}</h4>
                    </v-flex>
                  </v-layout>
                  <div
                    v-for="i of lvl1"
                    :key="i._id">
                    <div v-if="i['_head'] == values['_id']">
                      <v-layout class="clvl1">
                        <v-flex md6>
                          <h4>{{ i.name }}</h4>
                        </v-flex>
                        <v-flex md6>
                          <h4>{{ i.balc=blnclvlAcc(i._id) + blnclvl1(i._id) }}</h4>
                        </v-flex>
                      </v-layout>
                      <div
                        v-for="j of lvl2"
                        :key="j._id">
                        <div v-if="j['_lvl1'] == i['_id']">
                          <v-layout class="clvl2">
                            <v-flex md6>
                              <h4>{{ j.name }}</h4>
                            </v-flex>
                            <v-flex md6>
                              <h4>{{ j.balc=blnclvlAcc(j._id) + blnclvl2(j._id) }}</h4>
                            </v-flex>
                          </v-layout>
                          <div
                            v-for="k of lvl3"
                            :key="k._id">
                            <div v-if="k['_lvl2'] == j['_id']">
                              <v-layout class="clvl3">
                                <v-flex md6>
                                  <h4>{{ k.name }}</h4>
                                </v-flex>
                                <v-flex md6>
                                  <h4>{{ k.balc=blnclvlAcc(k._id) }}</h4>
                                </v-flex>
                              </v-layout>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <h3 class="income">Net Income: <span class="font-weight-bolder text--darken-3">{{ income }}</span></h3>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import api from '../../services/income-api'

export default {
  data () {
    return {
      accounts: [],
      lvl1: [],
      lvl2: [],
      lvl3: [],
      balances: null,
      show: false,
      isShow: false,
      find: [],
      temp: [],
      income: 0
    }
  },
  computed: {},
  created () {
    this.getIncome()
  },
  methods: {
    calculateIncome () {
      for (let values of this.accounts) {
        let data = this.balances.filter(map => map._head == values['_id'])
        let arr = 0
        for (let values of data) {
          arr = arr + (values['debit'] - values['credit'])
        }
        this.temp.push(arr)
      }
      this.income = this.temp[0] - this.temp[1]
      // this.income = this.income < 0 ? `(${this.income * -1})` : this.income
    },
    getIncome () {
      api.getIncome().then(res => {
        if (res) {
          this.find = res
          this.accounts = res[0]
          this.lvl1 = res[1]
          this.lvl2 = res[2]
          this.lvl3 = res[3]
          this.balances = res[4]
          this.isShow = true
          this.show = true
          this.calculateIncome()
        }
      })
    },
    blnclvl0 (id) {
      let data = this.balances.filter(map => map._head == id)
      let arr = 0
      for (let values of data) {
        arr = arr + (values['debit'] - values['credit'])
      }
      // arr = arr< 0 ? `(${arr * -1})` : arr
      return arr
    },
    blnclvl1 (id) {
      let data = this.balances.filter(map => map._lvl1 == id)
      let arr = 0
      for (let values of data) {
        arr = arr + (values['debit'] - values['credit'])
      }
      // arr = arr< 0 ? `(${arr * -1})` : arr
      return arr
    },
    blnclvl2 (id) {
      let data = this.balances.filter(map => map._lvl2 == id)
      let arr = 0
      for (let values of data) {
        arr = arr + (values['debit'] - values['credit'])
      }
      // arr = arr< 0 ? `(${arr * -1})` : arr
      return arr
    },
    blnclvlAcc (id) {
      let data = this.balances.filter(map => map._accType == id)
      let arr = 0
      for (let values of data) {
        arr = arr + (values['debit'] - values['credit'])
      }
      // arr = arr< 0 ? `(${arr * -1})` : arr
      return arr
    }
  }
}
</script>

<style>
.font-text-bold {
  font-weight: 400 !important;
}
h4{
  margin:0px 5px
}
.brdr {
  border: 1px solid;
}
.income {
  text-align: center;
  border: 1px dashed grey;
  border-top: none;
}
.clvl1 {
  padding: 0px 15px;
}
.clvl2 {
  padding: 0px 30px;
}
.clvl3 {
  padding: 0px 45px;
}
</style>
