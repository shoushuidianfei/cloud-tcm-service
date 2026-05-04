import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { mockDoctors } from '@/mock'

export const useDoctorStore = defineStore('doctor', () => {
  const doctors = ref([...mockDoctors])
  const currentDoctor = ref(null)

  const approvedDoctors = computed(() =>
    doctors.value.filter(d => d.auditStatus === 'approved')
  )

  function getDoctorById(id) {
    return doctors.value.find(d => d.id === id)
  }

  function getDoctorsByFilter(filters) {
    let result = [...approvedDoctors.value]

    if (filters.department) {
      result = result.filter(d => d.department === filters.department)
    }
    if (filters.specialty) {
      result = result.filter(d =>
        d.specialties.some(s => s.includes(filters.specialty))
      )
    }
    if (filters.name) {
      result = result.filter(d =>
        d.name.includes(filters.name)
      )
    }

    return result
  }

  function submitDoctorApplication(doctorData) {
    const existingIndex = doctors.value.findIndex(d => d.id === doctorData.id)

    if (existingIndex >= 0) {
      doctors.value[existingIndex] = {
        ...doctors.value[existingIndex],
        ...doctorData,
        auditStatus: 'pending',
        updatedAt: new Date().toISOString()
      }
    } else {
      doctors.value.push({
        ...doctorData,
        id: `D${Date.now()}`,
        auditStatus: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })
    }
  }

  function updateAuditStatus(doctorId, status, rejectReason = '') {
    const doctor = doctors.value.find(d => d.id === doctorId)
    if (doctor) {
      doctor.auditStatus = status
      doctor.rejectReason = rejectReason
      doctor.updatedAt = new Date().toISOString()
    }
  }

  function saveDraft(doctorData) {
    localStorage.setItem('tcm_doctor_draft', JSON.stringify(doctorData))
  }

  function getDraft() {
    const draft = localStorage.getItem('tcm_doctor_draft')
    return draft ? JSON.parse(draft) : null
  }

  function clearDraft() {
    localStorage.removeItem('tcm_doctor_draft')
  }

  return {
    doctors,
    currentDoctor,
    approvedDoctors,
    getDoctorById,
    getDoctorsByFilter,
    submitDoctorApplication,
    updateAuditStatus,
    saveDraft,
    getDraft,
    clearDraft
  }
})
