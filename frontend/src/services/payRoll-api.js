import constants from '../services/constants'

const axios = require('axios')
axios.defaults.headers.post['Content-Type'] = 'application/json'

const baseDomain = constants.NODE_DOMAIN

const addEmployee = `${baseDomain}/api/addEmployee`
const getEmpUrl = `${baseDomain}/api/getEmp`
const editEmployeeUrl = `${baseDomain}/api/editEmployee`
const attendanceUrl = `${baseDomain}/api/attendance`
const LeavesUrl = `${baseDomain}/api/leaves`
const LoanUrl = `${baseDomain}/api/loans`
const payUrl = `${baseDomain}/api/salary`

export default ({

  addEmployee (data) {
    return axios.post(addEmployee, data).then(res => {
      if (res.data === true) {
        return res.data
      }
    })
      .catch((err) => {
        console.log(err)
        return { 'status': false }
      })
  },

  getEmpApi () {
    return axios.get(getEmpUrl, {
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

  editEmployee (data) {
    return axios.patch(editEmployeeUrl, data).then(res => {
      if (res.data === true) {
        return true
      }
    }).catch((err) => {
      console.log(err)
      return { 'status': false }
    })
  },

  delEmployee (data) {
    console.log(data)
    return axios.delete(editEmployeeUrl + '/' + data).then(res => {
      if (res.data === true) {
        return true
      }
    }).catch((err) => {
      console.log(err)
      return { 'status': false }
    })
  },
  /** End of Employee */
  /** Sart Attendence */
  getAttEmp () {
    console.log('data')
    return axios.get(attendanceUrl).then(res => {
      if (res.data) {
        console.log('data', res.data)
        return res.data
      }
    }).catch((err) => {
      console.log(err)
      return { 'status': false }
    })
  },
  present (data) {
    return axios.patch(attendanceUrl, data).then(res => {
      if (res.data === true) {
        return true
      }
    }).catch((err) => {
      console.log(err)
      return { 'status': false }
    })
  },
  history (id) {
    return axios.get(attendanceUrl + '/history/' + id).then(res => {
      if (res.data) {
        return res.data
      }
    }).catch((err) => {
      console.log(err)
      return { 'status': false }
    })
  },
  /** End Attendende */

  /** Leaves Start */
  addLeave (data) {
    return axios.post(LeavesUrl, data).then(res => {
      if (res.data === true) {
        return res.data
      }
    })
      .catch((err) => {
        console.log(err)
        return { 'status': false }
      })
  },

  getLeave () {
    return axios.get(LeavesUrl, {
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
  /** Leaves End */

  /** Loan Start */
  addLoan (data) {
    return axios.post(LoanUrl, data).then(res => {
      if (res.data === true) {
        return res.data
      }
    })
      .catch((err) => {
        console.log(err)
        return { 'status': false }
      })
  },

  getLoans () {
    return axios.get(LoanUrl, {
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

  loanPaid (id) {
    return axios.patch(LoanUrl, id, {
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
  /** Loan End */
  /** Salary Stat */
  getEmpPay () {
    return axios.get(payUrl, {
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
  paySalary (data) {
    console.log(data)
    return axios.patch(payUrl, data).then(res => {
      console.log(res)
    })
      .catch((err) => {
        console.log(err)
        return { 'status': false }
      })
  },
  advancePay (data) {
    return axios.patch(payUrl + '/adv', data).then(res => {
      if (res['data'] === true) {
        return res['data']
      }
    })
      .catch((err) => {
        console.log(err)
        return { 'status': false }
      })
  }
  /** Salary End */
})
