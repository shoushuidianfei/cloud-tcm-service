<template>
  <div class="page-container">
    <div class="stats-row">
      <el-row :gutter="20">
        <el-col :span="8">
          <div class="stat-card">
            <div class="stat-icon" style="background: #409eff">
              <el-icon size="24"><Calendar /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ todayAppointments.length }}</div>
              <div class="stat-label">今日预约</div>
            </div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="stat-card">
            <div class="stat-icon" style="background: #67c23a">
              <el-icon size="24"><CircleCheck /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ completedCount }}</div>
              <div class="stat-label">已完成</div>
            </div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="stat-card">
            <div class="stat-icon" style="background: #e6a23c">
              <el-icon size="24"><Clock /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ waitingCount }}</div>
              <div class="stat-label">待就诊</div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>

    <div class="card-container">
      <div class="page-header">
        <h2>审核状态</h2>
      </div>

      <el-alert
        v-if="doctorInfo"
        :type="auditAlertType"
        :title="auditAlertTitle"
        :description="auditAlertDesc"
        show-icon
        :closable="false"
      />

      <el-button
        v-if="!doctorInfo || doctorInfo.auditStatus === 'rejected'"
        type="primary"
        class="apply-btn"
        @click="$router.push('/doctor/apply')"
      >
        {{ doctorInfo ? '重新申请' : '申请入驻' }}
      </el-button>
    </div>

    <div class="card-container">
      <div class="page-header">
        <h2>今日预约</h2>
      </div>

      <el-table :data="todayAppointments" stripe>
        <el-table-column prop="patientName" label="患者姓名" width="120" />
        <el-table-column prop="timeSlot" label="预约时段" width="150" />
        <el-table-column prop="symptoms" label="症状描述" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="statusTypeMap[row.status]">
              {{ statusTextMap[row.status] }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template #default="{ row }">
            <el-button
              v-if="row.status === 'waiting'"
              type="success"
              size="small"
              @click="handleComplete(row)"
            >
              完成就诊
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-empty v-if="todayAppointments.length === 0" description="今日暂无预约" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useDoctorStore } from '@/stores/doctor'
import { useAppointmentStore } from '@/stores/appointment'
import { useAuthStore } from '@/stores/auth'
import { ElMessage } from 'element-plus'
import dayjs from 'dayjs'

const doctorStore = useDoctorStore()
const appointmentStore = useAppointmentStore()
const authStore = useAuthStore()

const doctorInfo = computed(() =>
  doctorStore.doctors.find(d => d.userId === authStore.userInfo?.id)
)

const myAppointments = computed(() =>
  doctorInfo.value
    ? appointmentStore.getAppointmentsByDoctor(doctorInfo.value.id)
    : []
)

const todayAppointments = computed(() =>
  myAppointments.value.filter(a =>
    dayjs(a.appointmentDate).isSame(dayjs(), 'day')
  )
)

const completedCount = computed(() =>
  myAppointments.value.filter(a => a.status === 'completed').length
)

const waitingCount = computed(() =>
  myAppointments.value.filter(a => a.status === 'waiting').length
)

const statusTypeMap = {
  waiting: 'warning',
  completed: 'success',
  cancelled: 'info',
  overdue: 'danger'
}

const statusTextMap = {
  waiting: '待就诊',
  completed: '已完成',
  cancelled: '已取消',
  overdue: '已逾期'
}

const auditAlertType = computed(() => {
  const map = { pending: 'warning', approved: 'success', rejected: 'error' }
  return map[doctorInfo.value?.auditStatus] || 'info'
})

const auditAlertTitle = computed(() => {
  const map = {
    pending: '审核中',
    approved: '已通过',
    rejected: '已驳回'
  }
  return doctorInfo.value ? map[doctorInfo.value.auditStatus] || '未申请' : '未申请'
})

const auditAlertDesc = computed(() => {
  if (!doctorInfo.value) return '请先申请入驻'
  if (doctorInfo.value.auditStatus === 'rejected') {
    return `驳回原因：${doctorInfo.value.rejectReason}`
  }
  if (doctorInfo.value.auditStatus === 'approved') {
    return '您已通过审核，可以正常接诊'
  }
  return '您的申请正在审核中，请耐心等待'
})

function handleComplete(appointment) {
  appointmentStore.completeAppointment(appointment.id)
  ElMessage.success('已完成就诊')
}
</script>

<style scoped lang="scss">
.stats-row {
  margin-bottom: 20px;
}

.stat-card {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
}

.stat-icon {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
}

.stat-value {
  font-size: 28px;
  font-weight: 600;
  color: #303133;
}

.stat-label {
  color: #909399;
  font-size: 14px;
  margin-top: 4px;
}

.apply-btn {
  margin-top: 16px;
}
</style>
