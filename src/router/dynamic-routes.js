//管理员
const infoManagementPage = () => import('')
const modifyInfoPage = () => import('')
const modifyPasswordPage = () => import('')
const userManagementPage = () => import('')
const manageStudentPage = () => import('')
const manageTeacherPage = () => import('')
const academicManagementPage = () => import('')
const manageCoursePage = () => import('')
const manageDeparmentPage = () => import('')
//超级管理员
const manageAuthority = () => import('')

const dynamicRoutes = [
    {
        path: '/info',
        component: infoManagementPage,
        name: 'info-manage',
        mata: {
            name: '个人信息',
            icon: ""
        },
        children: [
            {
                path: 'modifyInfo',
                name: 'modify-info',
                component: modifyInfoPage,
                mata: {
                    name: '修改信息',
                }
            },
            {
                path: 'modifyPassword',
                name: 'modify-password',
                component: modifyPasswordPage,
                mata: {
                    name: '修改密码'
                }
            }
        ]
    },
    {
        path: '/user',
        name: 'user-manage',
        component: userManagementPage,
        mata: {
            name: '用户管理',
            icon: ''
        },
        children: [
            {
                path: 'manageStudnet',
                name: 'manage-student',
                component: manageStudentPage,
                mata: {
                    name: '学生管理'
                }
            },
            {
                path: 'manageTeacher',
                name: 'manage-teacher',
                component: manageTeacherPage,
                mata: {
                    name: '教师管理'
                }
            }
        ]
    },
    {
        path: '/academic',
        name: 'academic-manage',
        component: academicManagementPage,
        mata: {
            name: '教务管理',
            icon: ''
        },
        children: [
            {
                path: 'manageCourse',
                name: 'manage-course',
                component: manageCoursePage,
                mata: {
                    name: '课程管理'
                }
            },
            {
                path: 'manageDepartment',
                name: 'manage-department',
                component: manageDeparmentPage,
                mata: {
                    name: '院系管理'
                }
            }
        ]
    },
    {
        path: '/authority',
        name: 'manage-authority',
        component: manageAuthority,
        mata: {
            name: '权限控制',
            icon: ''
        }
    }
]

