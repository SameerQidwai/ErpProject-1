import constants from '../services/constants'

const axios = require('axios')
axios.defaults.headers.post['Content-Type'] = 'application/json'

const baseDomain = constants.NODE_DOMAIN

const itemUrl = `${baseDomain}/api/items`

const categoryUrl = `${baseDomain}/api/category`

const itemDetailUrl = `${baseDomain}/api/item-detail`

const unitsUrl = `${baseDomain}/api/units`

export default ({
  /* eslint-disable */
 /**Item Start */
 getItemApi() {
    return axios.get(itemUrl).then((res) => {
      if (res['data']) {
        // console.log(res['data'])
        let resp = res['data']
        return resp
      }
    })
  },
  getItemCat(data) {
    console.log(data)
    return axios.post(itemUrl +'/cat',data).then((res) => {
      if (res['data']) {
        // console.log(res['data'])
        let resp = res['data']
        return resp
      }
    })
  },
  addItem(data){
    return axios.post(itemUrl, data).then(res => {
      if (res.data) {
        return { 'status': true }
      }
    }).catch((err) => {
      console.log(err)
      return { 'status': false }
    })
  },

  deleteItem(id){
    return axios.delete(itemUrl + '/' + id, {
      timeout: 1000 * 180
    }).then((res) => {
      if (res['data']=== true) {
        return { 'status': true }
      }else{
        return{ 'status': false }
      }
    })
      .catch((err) => {
        console.log(err)
        return { 'status': false }
      })
  },
  editItem(data) {
    console.log(data)
    return axios.patch(itemUrl, data).then(res => {
      if (res.data === true) {
        return {'status': res.data}
      }else {
        return {'status': res.data}
      }
    }).catch((err) => {
      console.log(err)
      return { 'status': false }
    })
  },
  /**End Add Item */
   /**Category Stuff */
   getCategory(id) {
    return axios.get(categoryUrl + '/'+ id).then(res => {
      if (res.data) {
        return res.data
      }
    }).catch((err) => {
      console.log(err)
      return { 'status': false }
    })
  },
  addCategory(data) {
    return axios.post(categoryUrl, data).then(res => {
      if (res.data) {
        return { 'status': true }
      }
    }).catch((err) => {
      console.log(err)
      return { 'status': false }
    })
  },
  /**Category End */
  /**Add Item */
  itemDteail(id){
    return axios.get(itemDetailUrl + '/'+ id).then(res => {
      if (res.data) {
        return res.data
      }
    }).catch((err) => {
      console.log(err)
      return { 'status': false }
    })
  },
  /**Item End */
  /**Units start */
  getUnits(){
    return axios.get(unitsUrl).then(res=>{
      if(res.data){
        return res['data']
      }
    }).catch((err) => {
      console.log(err)
      return { 'status': false }
    })
  },
  saveUnit(data){
    return axios.post(unitsUrl,data).then(res=>{
      if(res.data){
        return res['data']
      }
    }).catch((err) => {
      console.log(err)
      return { 'status': false }
    })
  }
  /**Units Ends  */
})