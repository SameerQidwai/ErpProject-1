import constants from '../services/constants'

const axios = require('axios')
axios.defaults.headers.post['Content-Type'] = 'application/json'

const baseDomain = constants.NODE_DOMAIN

const custUrl = `${baseDomain}/api/customer/detail`

const customerUrl = `${baseDomain}/api/customer`

export default ({
  /** customer Start */
  addCustomer (data) {
    return axios.post(customerUrl, data).then((res) => {
      if (res['data']) {
        console.log(res['data'])
        return res['data']
      }
    })
      .catch((err) => {
        console.log(err)
        return { 'status': false }
      })
  },

  editCustomer (data) {
    return axios.patch(customerUrl, data).then((res) => {
      if (res['data']) {
        console.log(res['data'])
        return res['data']
      }
    })
      .catch((err) => {
        console.log(err)
        return { 'status': false }
      })
  },
  payCustomer (data) {
    return axios.post(customerUrl + '/payment', data).then((res) => {
      if (res['data']) {
        console.log(res['data'])
        return res['data']
      }
    })
      .catch((err) => {
        console.log(err)
        return { 'status': false }
      })
  },

  getCustomer () {
    return axios.get(custUrl).then((res) => {
      if (res['data'] === false) {
        return []
      } else if (res['data']) {
        let resp = res['data']
        return resp
      }
    })
      .catch((err) => {
        console.log(err)
        return { 'status': false }
      })
  },
  customerDetail (id) {
    return axios.get(custUrl + '/order/' + id).then((res) => {
      if (res['data'] === false) {
        return []
      } else if (res['data']) {
        let resp = res['data']
        return resp
      }
    })
      .catch((err) => {
        console.log(err)
        return { 'status': false }
      })
  }
})
