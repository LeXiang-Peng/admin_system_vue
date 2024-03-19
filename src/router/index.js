import Vue from 'vue'
import VueRouter from 'vue-router'
import loginPage from '../views/LoginView.vue'
import index from '../views/HomeView.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'login',
    component: loginPage
  },
  {
    path: '/',
    component: index,
    children: [
      {
        path: 'home',
        name: 'home',
        component: () => import('../components/maincontent/home'),
      },
      {
        path: '',
        name: 'infomanage',
        component: () => import('../components/maincontent/infomanage'),
        children: [
          {
            path: 'modifyInfo',
            name: 'modifyInfo',
            component: () => import('../components/maincontent/infomanage/modifyInfo')
          },
          {
            path: 'modifyPassword',
            name: 'modifyPassword',
            component: () => import('../components/maincontent/infomanage/modifyPassword')
          },
        ]
      },
      {
        path: '',
        name: 'usermanage',
        component: () => import('../components/maincontent/usermanage'),
        children: [
          {
            path: 'manageTeacher',
            name: 'manageTeacher',
            component: () => import('../components/maincontent/usermanage/manageTeacher')
          },
          {
            path: 'manageStudent',
            name: 'manageStudent',
            component: () => import('../components/maincontent/usermanage/manageStudent')
          },
        ]
      },
      {
        path: '',
        name: 'academicmanage',
        component: () => import('../components/maincontent/academicmanage'),
        children: [
          {
            path: 'manageCourse',
            name: 'manageCourse',
            component: () => import('../components/maincontent/academicmanage/manageCourse')
          },
          {
            path: 'manageDepartment',
            name: 'manageDepartment',
            component: () => import('../components/maincontent/academicmanage/manageDepartment')
          },
        ]
      },
      {
        path: 'authority',
        name: 'authority',
        redirect: 'authority/adminList',
        component: () => import('../components/maincontent/authority'),
        children: [
          {
            path: 'adminList',
            name: 'authority',
            component: () => import('../components/maincontent/authority/adminList')
          },
          {
            path: 'newAdmin',
            name: 'authority',
            component: () => import('../components/maincontent/authority/newAdmin')
          },
          {
            path: 'revoke',
            name: 'authority',
            component: () => import('../components/maincontent/authority/revoke')
          }
        ]
      },
      {
        path: 'authority/*',
        redirect: '/*'
      }
    ]
  },
]


const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
