import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes:[
    {
      name:'Iniciar',
      path:'/Iniciar',
      component: () => import('./views/Iniciar.vue')
    },
    {
      name:'Home',
      path:'/',
      component: () => import('./views/Inicio.vue')
    }
  ]
})
