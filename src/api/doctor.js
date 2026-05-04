import api from './index'

export function getDoctorList(params) {
  return api.get('/doctors', { params })
}

export function getDoctorById(id) {
  return api.get(`/doctors/${id}`)
}

export function submitDoctorApplication(data) {
  return api.post('/doctors/apply', data)
}

export function updateDoctorApplication(id, data) {
  return api.put(`/doctors/${id}`, data)
}

export function getAuditList(params) {
  return api.get('/doctors/audit', { params })
}

export function approveDoctor(id) {
  return api.post(`/doctors/${id}/approve`)
}

export function rejectDoctor(id, reason) {
  return api.post(`/doctors/${id}/reject`, { reason })
}
