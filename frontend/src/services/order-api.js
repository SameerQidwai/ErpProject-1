import constants from '../services/constants'

const axios = require('axios')
axios.defaults.headers.post['Content-Type'] = 'application/json'

const baseDomain = constants.NODE_DOMAIN

const orderUrl = `${baseDomain}/api/order`

const requestUrl = `${baseDomain}/api/request-order`

const actionUrl = `${baseDomain}/api/request-action`

const reportUrl = `${baseDomain}/api/purchase-report`

const payUrl = `${baseDomain}/api/payment-order`

export default ({
  /* eslint-disable */
  /**Item Start */
  /**Order Item */
  orderApi(data) {
    return axios.post(orderUrl, data).then(res => {
      if (res.data.status) {
        return true
      } else {
        return false
      }
    })
  },
  payment(data) {
    return axios.patch(payUrl, data).then((res) => { //for payment /
      if (res['data'] == true) {
        return res['data']
      }
      /** */
    })
      .catch((err) => {
        console.log(err)
        return { 'status': false }
      })
  },

  editApi(data) {
    return axios.patch(orderUrl, data).then(res => {
      if (res.data) {
        return res.data
      } else {
        return false
      }
    })
  },

  deleteOrder(id) {
    return axios.delete(orderUrl + '/' + id).then(res => {
      if (res.data) {
        return res.data
      } else {
        return false
      }
    })
  },

  getReport(data) {
    return axios.post(reportUrl, data).then((res) => {
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

  getRecipt(id) {
    console.log(id)
    return axios.get(reportUrl + '/' + id).then((res) => {
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

  /**Aproval order Sysytem */
  /**FILEs 
   * create-Order
   * Goods-receipt
   * Order-Approval
   * Order-Payment
   * Request-Order
   */
  getOrders(data) {
    var data = { stage: data }
    return axios.patch(requestUrl +'/get',data).then(res => {
      if (res.data) {
        return res.data
      } else {
        return false
      }
    })
  },

  getOrder(id) {
    return axios.get(requestUrl+"/"+id).then(res => {
      if (res.data) {
        return res.data
      } else {
        return false
      }
    })
  },

  getOrderPaymnet(id) {
    return axios.get(requestUrl+"/payment/"+id).then(res => {
      if (res.data) {
        console.log('here',res.data)
        return res.data
      } else {
        return false
      }
    })
  },

  request(data) {
    return axios.post(requestUrl, data).then(res => {
      if (res.data.status) {
        return true
      } else {
        return false
      }
    })
  },
  editRequest(data) {
    return axios.patch(requestUrl, data).then(res => {
      if (res.data) {
        return res.data
      } else {
        return false
      }
    })
  },
  changeStatus(data){
    return axios.patch(actionUrl, data).then(res => {
      if (res.data) {
        return res.data
      } else {
        return false
      }
    })
  },
  reqAproval(data) {
    return axios.patch(requestUrl+'/approval', data).then(res => {
      if (res.data) {
        return res.data
      } else {
        return false
      }
    })
  },
  /**Aproval order Sysytem */
});


