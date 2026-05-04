export const roleMenuMap = {
  patient: [
    { path: '/patient/doctors', title: '医师列表', icon: 'User' },
    { path: '/patient/history', title: '预约记录', icon: 'Calendar' }
  ],
  doctor: [
    { path: '/doctor/dashboard', title: '工作台', icon: 'Odometer' },
    { path: '/doctor/apply', title: '申请入驻', icon: 'EditPen' },
    { path: '/doctor/schedule', title: '排班管理', icon: 'Calendar' }
  ],
  admin: [
    { path: '/admin/dashboard', title: '管理首页', icon: 'Odometer' },
    { path: '/admin/audit', title: '医师审核', icon: 'Checked' }
  ]
}

export function getMenuByRole(role) {
  return roleMenuMap[role] || []
}

export function hasPermission(requiredRole, userRole) {
  if (!requiredRole) return true
  return requiredRole === userRole
}
