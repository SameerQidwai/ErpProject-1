import constants from '../services/constants'

const axios = require('axios')
axios.defaults.headers.post['Content-Type'] = 'application/json'

const baseDomain = constants.NODE_DOMAIN

const supplierUrl = `${baseDomain}/api/Supplier`

export default ({
  /* eslint-disable */
  /**supplier Start */
  addSupplier(data) {
    return axios.post(supplierUrl, data).then((res) => {
      if (res['data']) {
        let resp = res['data']
        return resp
      }
    })
      .catch((err) => {
        console.log(err)
        return { 'status': false }
      })
  },
  //get name of the supplier
  getsup() {
    return axios.get(supplierUrl, {
      timeout: 1000 * 180
    }).then((res) => {
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

  updateSupplier(data) {
    console.log(data)
    return axios.patch(supplierUrl, data).then((res) => {
      if (res['data'] === true) {
        return res['data']
      }
    })
      .catch((err) => {
        console.log(err)
        return { 'status': false }
      })
  },

  deleteSupplier(id) {
    return axios.delete(supplierUrl + '/' + id, {
      timeout: 1000 * 180
    }).then((res) => {
      if (res['data']) {
        let resp = res['data']
        console.log(resp)
        return resp
      }
    })
      .catch((err) => {
        console.log(err)
        return { 'status': false }
      })
  },
  //get Ledger of the supplier
  getsupBill(id) {
    return axios.get(supplierUrl + '-bill/' + id, {
      timeout: 1000 * 180
    }).then((res) => {
      if (res['data']) {
        let resp = res['data']
        return resp
      }
    })
      .catch((err) => {
        console.log(err)
        return { 'status': false }
      })
  },

  /**Supplier End */
  getSupplierAcct() {
    return axios.get(supplierUrl + '/detail', {
      timeout: 1000 * 180
    }).then((res) => {
      if (res['data']) {
        return res['data']
      }
    })
      .catch((err) => {
        console.log(err)
        return { 'status': false }
      })
  },

  supplierDetail(id) {
    return axios.get(supplierUrl + '/detail/' + id).then((res) => {
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
  paySupplier(data){
    return axios.post(supplierUrl+'/payment', data).then((res) => {
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
})

