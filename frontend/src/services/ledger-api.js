import constants from '../services/constants'

const axios = require('axios')
axios.defaults.headers.post['Content-Type'] = 'application/json'

const baseDomain = constants.NODE_DOMAIN

const ledgerUrl = `${baseDomain}/api/general`

export default ({

  getLedger () {
    return axios.get(ledgerUrl).then(res => {
      if (res.data) {
        return res.data
      } else {
        return false
      }
    })
  },
  ledgerFilter (data) {
    console.log(data)
    return axios.patch(ledgerUrl + '/filter', data).then(res => {
      if (res.data) {
        return res.data
      } else {
        return false
      }
    })
  }
})
