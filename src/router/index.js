import Vue from 'vue'
import VueRouter from 'vue-router'
import loginPage from '../views/LoginView.vue'
import homePage from '../views/HomeView.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'login',
    component: loginPage
  },
  {
    path:'/',
    name:'home',
    component: homePage,
    meta: {requireAuth: true}
  }
]


const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
