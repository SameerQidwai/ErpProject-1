import constants from '../services/constants'

const axios = require('axios')
axios.defaults.headers.post['Content-Type'] = 'application/json'

const baseDomain = constants.NODE_DOMAIN

const accountUrl = `${baseDomain}/api/account`

const coaUrl = `${baseDomain}/api/coa`

const accounts = `${baseDomain}/api/myAccount`

const balanceUrl = `${baseDomain}/api/Balance`

const rentUrl = `${baseDomain}/api/rent/credit`

export default ({

  getHead () {
    return axios.get(accountUrl + '/head').then(res => {
      if (res.data) {
        return res.data
      } else {
        return false
      }
    })
  },

  addAccType (data) {
    return axios.post(accountUrl + '/type', data).then(res => {
      if (res.data) {
        console.log(res.data)
        return res.data
      } else {
        return false
      }
    })
  },
  addHeadType (data) {
    console.log(data)
    return axios.post(accountUrl + '/head', data).then(res => {
      if (res.data) {
        console.log(res.data)
        return res.data
      } else {
        return false
      }
    })
  },

  getAccType (data) { // get api for type
    return axios.patch(accountUrl + '/type', data).then(res => {
      if (res.data) {
        return res.data
      } else {
        return false
      }
    })
  },

  getCoa () {
    return axios.get(coaUrl).then(res => {
      if (res.data) {
        return res.data
      } else {
        return false
      }
    })
  },

  getCoaAll () {
    return axios.get(coaUrl + '/all').then(res => {
      if (res.data) {
        return res.data
      } else {
        return false
      }
    })
  },

  showCoa (data) {
    return axios.post(coaUrl + '/show', data).then(res => {
      if (res.data) {
        return res.data
      } else {
        return false
      }
    })
  },

  getAccounts () {
    return axios.get(accounts).then(res => {
      if (res.data) {
        return res.data
      } else {
        return false
      }
    })
  },

  getBalances () {
    return axios.get(balanceUrl).then(res => {
      if (res.data) {
        return res.data
      } else {
        return false
      }
    })
  },

  rentCredit (data) {
    return axios.patch(rentUrl, data).then(res => {
      if (res.data) {
        return res.data
      } else {
        return false
      }
    })
  },

  balanceFilter (data) {
    console.log(data)
    return axios.patch(balanceUrl + '/filter', data).then(res => {
      if (res.data) {
        return res.data
      } else {
        return false
      }
    })
  },
  findAccount (id) {
    return axios.get(accounts + '/find/' + id).then(res => {
      if (res.data) {
        return res.data
      } else {
        return false
      }
    })
  },
  getBanks (){
    return axios.get(accounts + '/type-banks').then(res => {
      if (res['status']===200) {
        return res['data']
      } else {
        return false
      }
    })
  },
  setBank (obj){
    return axios.patch(accounts + '/type-banks', obj).then(res => {
      if (res['status']===200) {
        return res['data']
      } else {
        return false
      }
    })
  },
  getSave_Bank (obj){
    return axios.post(accounts + '/type-banks', obj).then(res => {
      if (res['status']===200) {
        return res['data']
      } else {
        return false
      }
    })
  }
})

