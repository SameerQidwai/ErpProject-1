import constants from '../services/constants'

const axios = require('axios')
axios.defaults.headers.post['Content-Type'] = 'application/json'

const baseDomain = constants.NODE_DOMAIN

const paymentUrls = `${baseDomain}/api/payments`
const receivedUrls = `${baseDomain}/api/received`

const voucherUrl = `${baseDomain}/api/voucher`
const getVoucher = `${baseDomain}/api/vouchers`

export default ({
  cashPayment (data) {
    return axios.patch(paymentUrls + '/cash', data).then(res => {
      if (res) {
        console.log(res)
        return res.data
      }
    })
      .catch((err) => {
        console.log(err)
        return { 'status': false }
      })
  },

  cashReceive (data) {
    return axios.patch(receivedUrls + '/cash', data).then(res => {
      if (res) {
        console.log(res)
        return res.data
      }
    })
      .catch((err) => {
        console.log(err)
        return { 'status': false }
      })
  },

  bankPayment (data) {
    return axios.patch(paymentUrls + '/bank', data).then(res => {
      if (res) {
        console.log(res)
        return res.data
      }
    })
      .catch((err) => {
        console.log(err)
        return { 'status': false }
      })
  },

  bankReceive (data) {
    return axios.patch(receivedUrls + '/bank', data).then(res => {
      if (res) {
        console.log(res)
        return res.data
      }
    })
      .catch((err) => {
        console.log(err)
        return { 'status': false }
      })
  },

  getVoucher () {
    return axios.get(voucherUrl).then(res => {
      if (res) {
        return res.data
      }
    })
      .catch((err) => {
        console.log(err)
        return { 'status': false }
      })
  },
  getVouchers () {
    return axios.get(getVoucher).then(res => {
      if (res) {
        return res.data
      }
    })
      .catch((err) => {
        console.log(err)
        return { 'status': false }
      })
  },
  paySupplier (data) {
    console.log(data)
    return axios.patch(paymentUrls + '/supplier', data).then(res => {
      if (res) {
        return res.data
      }
    })
      .catch((err) => {
        console.log(err)
        return { 'status': false }
      })
  }
})
