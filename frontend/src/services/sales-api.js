import constants from '../services/constants'

const axios = require('axios')
axios.defaults.headers.post['Content-Type'] = 'application/json'

const baseDomain = constants.NODE_DOMAIN

const customerUrl = `${baseDomain}/api/customer`

const cartUrl = `${baseDomain}/api/cart`

const payUrl = `${baseDomain}/api/payment-sales`

const salesRepot = `${baseDomain}/api/sales-report`

export default ({
  /* eslint-disable */
  /**customer Start */
  getCustomer() {
    return axios.get(customerUrl, {
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
  /**POS API Start */
  addToCart(data) {
    return axios.post(cartUrl, data, {
      timeout: 1000 * 180
    }).then((res) => {
      if (res['data']) {
        console.log(res.data)
        return res['data']
      }
    })
      .catch((err) => {
        console.log(err)
        return { 'status': false }
      })
  },

  getCart(id) {
    return axios.get(cartUrl + '/' + id, {
      timeout: 1000 * 180
    }).then((res) => {
      if (res['data']) {
        return res['data']
      }else if(res['data']==""){
        return false
      }
    })
      .catch((err) => {
        console.log(err)
        return { 'status': false }
      })
  },

  delFromCart(data) {
    return axios.patch(cartUrl, data, {
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
  /**POS API END */
  /**Payment Start */
  payment(data) {
    console.log(data)
    return axios.patch(payUrl, data, {
      timeout: 1000 * 180
    }).then((res) => {
      if (res['data']) {
        console.log(res.data)
        return res['data']
      }
    })
      .catch((err) => {
        console.log(err)
        return { 'status': false }
      })
  },

  /**Payment End */

  /**Sales Report */
  getfilter(data) {
    console.log(data)
    return axios.post(salesRepot,data).then((res) => {
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
  getRecipt(id,status) {
    console.log(id,status)
    return axios.get(salesRepot+'/'+id +'?status='+status).then((res) => {
      console.log('data')
      if (res['data']) {
        let resp = res['data']
        console.log('GetRecipt',{resp})
        return resp
      }
    })
      .catch((err) => {
        console.log(err)
        return { 'status': false }
      })
  },
  deleteSale(id){
    return axios.delete(cartUrl+ '/'+id).then(res => {
      if(res.data){
        return res.data
      }else{
        return false
      }
    })
  },

  returnItem(data){
    return axios.patch(cartUrl+ '/return', data).then(res => {
      if(res.data){
        return res.data
      }else{
        return false
      }
    })
  },

  returnSale(id){
    console.log(id)
    return axios.delete(cartUrl+'/returnSale/' +id).then(res => {
      if(res.data){
        return res.data
      }else{
        return false
      }
    })
  }
  
})
