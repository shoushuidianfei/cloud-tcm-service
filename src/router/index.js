import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { ElMessage } from 'element-plus'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/auth/Login.vue'),
    meta: { title: '登录', public: true }
  },
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/patient',
    component: () => import('@/components/common/MainLayout.vue'),
    meta: { role: 'patient' },
    children: [
      {
        path: '',
        redirect: '/patient/doctors'
      },
      {
        path: 'doctors',
        name: 'PatientDoctors',
        component: () => import('@/views/patient/DoctorList.vue'),
        meta: { title: '医师列表', role: 'patient' }
      },
      {
        path: 'appointment/:doctorId',
        name: 'PatientAppointment',
        component: () => import('@/views/patient/Appointment.vue'),
        meta: { title: '预约挂号', role: 'patient' }
      },
      {
        path: 'history',
        name: 'PatientHistory',
        component: () => import('@/views/patient/History.vue'),
        meta: { title: '预约记录', role: 'patient' }
      }
    ]
  },
  {
    path: '/doctor',
    component: () => import('@/components/common/MainLayout.vue'),
    meta: { role: 'doctor' },
    children: [
      {
        path: '',
        redirect: '/doctor/dashboard'
      },
      {
        path: 'dashboard',
        name: 'DoctorDashboard',
        component: () => import('@/views/doctor/Dashboard.vue'),
        meta: { title: '工作台', role: 'doctor' }
      },
      {
        path: 'apply',
        name: 'DoctorApply',
        component: () => import('@/views/doctor/ApplyForm.vue'),
        meta: { title: '申请入驻', role: 'doctor' }
      },
      {
        path: 'schedule',
        name: 'DoctorSchedule',
        component: () => import('@/views/doctor/Schedule.vue'),
        meta: { title: '排班管理', role: 'doctor' }
      }
    ]
  },
  {
    path: '/admin',
    component: () => import('@/components/common/MainLayout.vue'),
    meta: { role: 'admin' },
    children: [
      {
        path: '',
        redirect: '/admin/dashboard'
      },
      {
        path: 'dashboard',
        name: 'AdminDashboard',
        component: () => import('@/views/admin/Dashboard.vue'),
        meta: { title: '管理首页', role: 'admin' }
      },
      {
        path: 'audit',
        name: 'AdminAudit',
        component: () => import('@/views/admin/AuditList.vue'),
        meta: { title: '医师审核', role: 'admin' }
      },
      {
        path: 'audit/:id',
        name: 'AdminAuditDetail',
        component: () => import('@/views/admin/AuditDetail.vue'),
        meta: { title: '审核详情', role: 'admin' }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  if (to.meta.public) {
    next()
    return
  }

  if (!authStore.isAuthenticated) {
    next('/login')
    return
  }

  if (to.meta.role && to.meta.role !== authStore.userRole) {
    ElMessage.error('无权访问该页面')
    return
  }

  next()
})

export default router
