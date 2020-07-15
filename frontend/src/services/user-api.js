import constants from '../services/constants'

const axios = require('axios')
axios.defaults.headers.post['Content-Type'] = 'application/json'

const baseDomain = constants.PYTHON_DOMAIN

const userDetailsUrl = `${baseDomain}user/user-details`

const authenticateUrl = `${baseDomain}user/login`

export default ({

  getUsers () {
    return axios.get(userDetailsUrl).then((res) => {
      if (res['data']['status'] === 200) {
        return res['data']['data']
      }
    }).catch((err) => {
      console.log(err)
      return false
    })
  },

  postUser (data) {
    return axios.post(userDetailsUrl, data).then(res => {
      if (res['data']['status'] === 200) {
        return true
      }
    })
      .catch((err) => {
        console.log(err)
        return false
      })
  },

  patchUser (data) {
    return axios.patch(userDetailsUrl, data).then(res => {
      if (res['data']['status'] === 200) {
        return true
      }
    })
      .catch((err) => {
        console.log(err)
        return false
      })
  },

  deleteUser (data) {
    return axios.delete(userDetailsUrl + '?id=' + data).then(res => {
      if (res['data']['status'] === 200) {
        return true
      }
    })
      .catch((err) => {
        console.log(err)
        return false
      })
  },

  authenticate (data) {
    return axios.post(authenticateUrl, data).then(res => {
      if (res['data']['status'] === 200) {
        return res['data']['data']
      }
    })
      .catch((err) => {
        console.log(err)
        return false
      })
  }

})
