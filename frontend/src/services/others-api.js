import constants from '../services/constants'

const axios = require('axios')
axios.defaults.headers.post['Content-Type'] = 'application/json'

const baseDomain = constants.NODE_DOMAIN

const scholarshipDetailsUrl = `${baseDomain}others/scholarship-details`

const amakinDetailsUrl = `${baseDomain}others/amakin-details`

export default ({

  getScholarshipApi () {
    return axios.get(scholarshipDetailsUrl).then((res) => {
      if (res['data']['status'] === 200) {
        return JSON.parse(res['data']['data'])
      }
    }).catch((err) => {
      console.log(err)
      return { 'status': false }
    })
  },

  addScholarshipApi (data) {
    return axios.post(scholarshipDetailsUrl, data).then(res => {
      if (res['data']['status'] === 200) {
        return ({ status: 'success' })
      }
    })
      .catch((err) => {
        console.log(err)
        return { 'status': false }
      })
  },

  editScholarshipApi (data) {
    return axios.patch(scholarshipDetailsUrl, data).then(res => {
      if (res['data']['status'] === 200) {
        return ({ status: 'success' })
      }
    })
      .catch((err) => {
        console.log(err)
        return { 'status': false }
      })
  },

  deleteScholarshipApi (data) {
    return axios.delete(scholarshipDetailsUrl + '?id=' + data).then(res => {
      if (res['data']['status'] === 200) {
        return ({ status: 'success' })
      }
    })
      .catch((err) => {
        console.log(err)
        return { 'status': false }
      })
  },

  getAmakinApi () {
    return axios.get(amakinDetailsUrl).then((res) => {
      if (res['data']['status'] === 200) {
        return JSON.parse(res['data']['data'])
      }
    }).catch((err) => {
      console.log(err)
      return { 'status': false }
    })
  },

  addAmakinApi (data) {
    return axios.post(amakinDetailsUrl, data).then(res => {
      if (res['data']['status'] === 200) {
        return ({ status: 'success' })
      }
    })
      .catch((err) => {
        console.log(err)
        return { 'status': false }
      })
  },

  editAmakinApi (data) {
    return axios.patch(amakinDetailsUrl, data).then(res => {
      if (res['data']['status'] === 200) {
        return ({ status: 'success' })
      }
    })
      .catch((err) => {
        console.log(err)
        return { 'status': false }
      })
  },

  deleteAmakinApi (data) {
    return axios.delete(amakinDetailsUrl + '?id=' + data).then(res => {
      if (res['data']['status'] === 200) {
        return ({ status: 'success' })
      }
    })
      .catch((err) => {
        console.log(err)
        return { 'status': false }
      })
  }
})
