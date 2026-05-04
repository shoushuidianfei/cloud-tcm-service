import api from './index'

export function getAppointmentList(params) {
  return api.get('/appointments', { params })
}

export function getAppointmentById(id) {
  return api.get(`/appointments/${id}`)
}

export function createAppointment(data) {
  return api.post('/appointments', data)
}

export function cancelAppointment(id) {
  return api.post(`/appointments/${id}/cancel`)
}

export function completeAppointment(id) {
  return api.post(`/appointments/${id}/complete`)
}

export function getAvailableSlots(doctorId, date) {
  return api.get(`/doctors/${doctorId}/slots`, { params: { date } })
}
