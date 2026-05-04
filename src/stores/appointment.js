import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { mockAppointments, mockSchedules } from '@/mock'
import dayjs from 'dayjs'

export const useAppointmentStore = defineStore('appointment', () => {
  const appointments = ref([...mockAppointments])
  const schedules = ref([...mockSchedules])

  const pendingAppointments = computed(() =>
    appointments.value.filter(a => a.status === 'waiting')
  )

  const completedAppointments = computed(() =>
    appointments.value.filter(a => a.status === 'completed')
  )

  function getAppointmentsByPatient(patientId) {
    return appointments.value.filter(a => a.patientId === patientId)
  }

  function getAppointmentsByDoctor(doctorId) {
    return appointments.value.filter(a => a.doctorId === doctorId)
  }

  function getScheduleByDoctor(doctorId, date) {
    return schedules.value.filter(s =>
      s.doctorId === doctorId &&
      dayjs(s.date).isSame(dayjs(date), 'day')
    )
  }

  function getAvailableSlots(doctorId, date) {
    const schedule = getScheduleByDoctor(doctorId, date)
    const bookedSlots = appointments.value
      .filter(a =>
        a.doctorId === doctorId &&
        dayjs(a.appointmentDate).isSame(dayjs(date), 'day') &&
        a.status !== 'cancelled'
      )
      .map(a => a.timeSlot)

    return schedule.map(slot => ({
      ...slot,
      available: !bookedSlots.includes(slot.timeSlot)
    }))
  }

  function createAppointment(appointmentData) {
    const conflict = appointments.value.find(a =>
      a.doctorId === appointmentData.doctorId &&
      dayjs(a.appointmentDate).isSame(dayjs(appointmentData.appointmentDate), 'day') &&
      a.timeSlot === appointmentData.timeSlot &&
      a.status !== 'cancelled'
    )

    if (conflict) {
      throw new Error('该时段已被预约，请选择其他时段')
    }

    const newAppointment = {
      ...appointmentData,
      id: `A${Date.now()}`,
      status: 'waiting',
      createdAt: new Date().toISOString()
    }

    appointments.value.push(newAppointment)
    return newAppointment
  }

  function cancelAppointment(appointmentId) {
    const appointment = appointments.value.find(a => a.id === appointmentId)
    if (appointment) {
      appointment.status = 'cancelled'
      appointment.updatedAt = new Date().toISOString()
    }
  }

  function completeAppointment(appointmentId) {
    const appointment = appointments.value.find(a => a.id === appointmentId)
    if (appointment) {
      appointment.status = 'completed'
      appointment.updatedAt = new Date().toISOString()
    }
  }

  function updateOverdueAppointments() {
    const now = dayjs()
    appointments.value.forEach(a => {
      if (a.status === 'waiting') {
        const appointmentTime = dayjs(`${a.appointmentDate} ${a.timeSlot.split('-')[1]}`)
        if (now.isAfter(appointmentTime)) {
          a.status = 'overdue'
        }
      }
    })
  }

  return {
    appointments,
    schedules,
    pendingAppointments,
    completedAppointments,
    getAppointmentsByPatient,
    getAppointmentsByDoctor,
    getScheduleByDoctor,
    getAvailableSlots,
    createAppointment,
    cancelAppointment,
    completeAppointment,
    updateOverdueAppointments
  }
})
