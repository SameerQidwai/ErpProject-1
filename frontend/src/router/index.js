import Vue from 'vue'
import Router from 'vue-router'
import Meta from 'vue-meta'

import paths from './paths'

function route(path, view, name, cd) {
  return {
    name: name || view,
    cd,
    path,
    component: (resolve) => import(`@/views/${cd}/${view}.vue`).then(resolve),
    beforeEnter: (to, from, next) => {
      let data = localStorage.getItem('views')
    
      if (!data) {
        next('user-login')
      } else {
        data = data.split(',')
        if (!data.includes(to['name'])) {
          next('dashboard')
        } else {
          next()
        }
      }
    }
  }
}

Vue.use(Router)

// Create a new router
const router = new Router({
  mode: 'hash',
  routes: paths.map(path => route(path.path, path.view, path.name, path.cd)).concat([
    { path: '', redirect: '/dashboard' },
    {
      path: '/admin-login',
      name: 'Admin Authentication',
      component: (resolve) => import(`@/views/Admin/Admin-Login.vue`).then(resolve),
      beforeEnter: (to, from, next) => {
        if (!localStorage.getItem('admin') ) {
          next()
        } else {
          next('admin-home')
        }
      }
    },
    {
      path: '/user-login',
      name: 'Login Authentication',
      component: (resolve) => import(`@/views/User/Login.vue`).then(resolve),
      beforeEnter: (to, from, next) => {
        if (!localStorage.getItem('views')) {
          next()
        } else {
          next('dashboard')
        }
      }
    },
    {
      path: '/admin-home',
      name: 'Admin Home',
      component: (resolve) => import(`@/views/Admin/Admin-Home.vue`).then(resolve),
      beforeEnter: (to, from, next) => {
        if (localStorage.getItem('admin')) {
          next()
        } else {
          next('admin-login')
        }
      }
    },
    {
      path: '/super-admin-login',
      name: 'Super Admin Authentication',
      component: (resolve) => import(`@/views/Super/Super-Admin-Login.vue`).then(resolve),
      beforeEnter: (to, from, next) => {
        if (!localStorage.getItem('super-admin')) {
          next()
        } else {
          next('super-admin-home')
        }
      }
    },
    {
      path: '/super-admin-home',
      name: 'Super Admin Home',
      component: (resolve) => import(`@/views/Super/Super-Admin-Home.vue`).then(resolve),
      beforeEnter: (to, from, next) => {
        if (localStorage.getItem('super-admin')) {
          next()
        } else {
          next('super-admin-login')
        }
      }
    }
  ])
})

Vue.use(Meta)

export default router
