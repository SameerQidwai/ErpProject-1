import constants from '../services/constants'

const axios = require('axios')
axios.defaults.headers.post['Content-Type'] = 'application/json'

const baseDomain = constants.PYTHON_DOMAIN

const nodeDomain = constants.NODE_DOMAIN

const propertyUrl = `${nodeDomain}/property-details`

// const transferUrl = `${baseDomain}rent/transfer-details`
const transferUrl = `${nodeDomain}rent/transfer-details`

// const transferHistoryUrl = `${baseDomain}rent/transfer-history`

const transferHistoryUrl = `${nodeDomain}/rent/transfer-history`

const tenantUrl = `${nodeDomain}/tenant-details`

// const rentURL = `${baseDomain}rent/rent-details`
const rentURL = `${nodeDomain}/rent/rent-details`

// const nodeRentURL = `${nodeDomain}/rent/rent-details`

// const rentURL = `${nodeDomain}/rent/rent-details`

const ownerShipURl = `${nodeDomain}/property/ownership`

const proDepURL = `${nodeDomain}/property/deposit`

const propTypesURL = `${nodeDomain}/property/type`

export default ({

  getPropertyApi() {
    return axios.get(propertyUrl).then((res) => {
      if (res['status'] === 200) {
        return res['data']
      }
    }).catch((err) => {
      console.log(err)
      return { 'status': false }
    })
  },

  addPropertyApi(data) {
    return axios.post(propertyUrl, data).then(res => {
      if (res['status'] === 200) {
        return ({ status: 'success' })
      }
    })
      .catch((err) => {
        console.log(err)
        return { 'status': false }
      })
  },

  editPropertyApi(data) {
    return axios.patch(propertyUrl, data).then(res => {
      if (res['status'] === 200) {
        return ({ status: 'success' })
      }
    })
      .catch((err) => {
        console.log(err)
        return { 'status': false }
      })
  },

  deletePropertyApi(data) {
    return axios.delete(propertyUrl + '/' + data).then(res => {
      if (res['status']) {
        return res['status']
      }
    })
      .catch((err) => {
        console.log(err)
        return { 'status': false }
      })
  },

  getTransHistoryApi() {
    return axios.get(transferHistoryUrl).then(res => {
      if (res['status']==200) {
        return res['data']
      }
    }).catch((err) => {
      console.log(err)
      return { 'status': false }
    })
  },

  delPerson(data) {
    return axios.patch(transferHistoryUrl, data).then(res => {
      console.log(res)
      if (res['data']['status'] === 200) {
        console.log(res['data']['status'])
        return ({ status: 'success' })
      }
    })
      .catch((err) => {
        console.log(err)
        return { 'status': false }
      })
  },

  rentTransferApi(data){
    console.log(data)
    return axios.post(transferHistoryUrl,data).then(res => {
      if (res['data']) {
        return res['data']
      }
    }).catch((err) => {
      console.log(err)
      return { 'status': false }
    })
  },

  getTenantApi() {
    return axios.get(tenantUrl).then(res => {
      if (res['status'] === 200) {
        return res['data']
      }
    }).catch((err) => {
      console.log(err)
      return { 'status': false }
    })
  },

  addTenantApi(data) {
    return axios.post(tenantUrl, data).then(res => {
      if (res['status'] === 200) {
        return ({ status: 'success' })
      }
    })
      .catch((err) => {
        console.log(err)
        return { 'status': false }
      })
  },

  editTenantApi(data) {
    return axios.patch(tenantUrl, data).then(res => {
      if (res['status'] === 200) {
        return ({ status: 'success' })
      }
    })
      .catch((err) => {
        console.log(err)
        return { 'status': false }
      })
  },

  deleteTenantApi(data) {
    return axios.delete(tenantUrl + '/' + data).then(res => {
      if (res['status']) {
        return (res['status'])
      }
    })
      .catch((err) => {
        console.log(err)
        return { 'status': false }
      })
  },

  getRentDetail() {
    return axios.get(rentURL).then(res => {
      if (res['status'] == 200) {
        return res['data']
      }
    }).catch((err) => {
      console.log(err)
      return { 'status': false }
    })
  },

  postRent(data) {
    return axios.patch(rentURL, data).then(res => {
      console.log(res)
      if (res['status'] === 200) {
        return ({ status: 'success' })
      }
    })
      .catch((err) => {
        console.log(err)
        return { 'status': false }
      })
  },

  ownerShip(data) {
    return axios.post(ownerShipURl, data).then(res => {
      if (res['data']) {
        console.log(res['data'])
        return (res['data'])
      }
    })
      .catch((err) => {
        console.log(err)
        return { 'status': false }
      })
  },
  getownerShip(id) {
    return axios.get(ownerShipURl + '/' + id).then(res => {
      if (res['data']) {
        return (res['data'])
      }
    })
      .catch((err) => {
        console.log(err)
        return { 'status': false }
      })
  },
  
  getApprovals(process) {
    return axios.get(ownerShipURl + '/approval/' + process).then(res => {
      if (res['data']) {
        return (res['data'])
      }
    })
      .catch((err) => {
        console.log(err)
        return { 'status': false }
      })
  },
  approved(data) {
    return axios.patch(ownerShipURl + '/approval', data).then(res => {
      if (res['data']) {
        return (res['data'])
      }
    })
      .catch((err) => {
        console.log(err)
        return { 'status': false }
      })
  },
  ownerPayment(data) {
    return axios.patch(ownerShipURl + '/payment', data).then(res => {
      if (res['data']) {
        return (res['data'])
      }
    })
      .catch((err) => {
        console.log(err)
        return { 'status': false }
      })
  },
  incDeposit(data) {
    return axios.patch(proDepURL, data).then(res => {
      console.log(res)
      if (res['data'] === true) {
        return (res['data'])
      } else if (res['data'] === false) {
        return (res['data'])
      }
    })
      .catch((err) => {
        console.log(err)
        return { 'status': false }
      })
  },
  addtype(data) {
    return axios.post(propTypesURL, data).then(res => {
      if (res['data']) {
        return (res['data'])
      }
    })
      .catch((err) => {
        console.log(err)
        return { 'status': false }
      })
  },
  getType() {
    return axios.get(propTypesURL).then(res => {
      if (res['data']) {
        console.log(res['data'])
        return (res['data'])
      }
    })
      .catch((err) => {
        console.log(err)
        return { 'status': false }
      })
  },
  setMant(data) {
    return axios.patch(propTypesURL, data).then(res => {
      if (res['data']) {
        return (res['data'])
      }
    })
      .catch((err) => {
        console.log(err)
        return { 'status': false }
      })
  }
})
