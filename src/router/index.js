import Vue from 'vue'
import Router from 'vue-router'
import Consulta from '@/components/Consulta'
import Exame from '@/components/Exame'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'consulta',
      component: Consulta
    },
    {
      path: '/exame',
      name: 'exame',
      component: Exame
    }
  ]
})
