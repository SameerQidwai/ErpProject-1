import constants from '../services/constants'

const axios = require('axios')
axios.defaults.headers.post['Content-Type'] = 'application/json'

const baseDomain = constants.NODE_DOMAIN

const incomeUrl = `${baseDomain}/api/income`

export default ({ // I am using hard coded revenue and expense id to find data if data delete thi wont work
  getIncome () {
    return axios.get(incomeUrl).then(res => {
      if (res.data) {
        return res.data
      } else {
        return false
      }
    })
  }
})
