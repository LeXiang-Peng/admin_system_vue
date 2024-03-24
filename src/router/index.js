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
        meta:{
          name: '首页'
        }
      },
      {
        path: '',
        name: 'infomanage',
        component: () => import('../components/maincontent/infomanage'),
        children: [
          {
            path: 'modifyInfo',
            name: 'modifyInfo',
            component: () => import('../components/maincontent/infomanage/modifyInfo'),
            meta:{
              name: '修改信息'
            }
          },
          {
            path: 'modifyPassword',
            name: 'modifyPassword',
            component: () => import('../components/maincontent/infomanage/modifyPassword'),
            meta:{
              name: '修改密码'
            }
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
            component: () => import('../components/maincontent/usermanage/manageTeacher'),
            meta:{
              name: '教师管理'
            }
          },
          {
            path: 'manageStudent',
            name: 'manageStudent',
            component: () => import('../components/maincontent/usermanage/manageStudent'),
            meta:{
              name: '学生管理'
            }
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
            component: () => import('../components/maincontent/academicmanage/manageCourse'),
            meta:{
              name: '课程管理'
            }
          },
          {
            path: 'manageDepartment',
            name: 'manageDepartment',
            component: () => import('../components/maincontent/academicmanage/manageDepartment'),
            meta:{
              name: '院系管理'
            }
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
            component: () => import('../components/maincontent/authority/adminList'),
            meta:{
              name: '管理员列表'
            }
          },
          {
            path: 'grantedTeachers',
            name: 'authority',
            component: () => import('../components/maincontent/authority/grantedTeachers'),
            meta:{
              name: '授权教师'
            }
          },
          {
            path: 'revoke',
            name: 'authority',
            component: () => import('../components/maincontent/authority/revoke'),
            meta:{
              name: '禁权列表'
            }
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
