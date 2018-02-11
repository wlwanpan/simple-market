import Vue from 'vue'
import Router from 'vue-router'
import Dashboard from '@/components/Dashboard'
import SellSecret from '@/components/SellSecret'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: Dashboard
    },
    {
      path: '/sell-secret',
      name: 'sellSecret',
      component: SellSecret
    }
  ]
})
