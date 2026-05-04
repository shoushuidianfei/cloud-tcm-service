<template>
  <div class="page-container">
    <div class="card-container">
      <div class="page-header">
        <h2>预约记录</h2>
      </div>

      <div class="filter-bar">
        <el-radio-group v-model="statusFilter" @change="handleFilter">
          <el-radio-button label="">全部</el-radio-button>
          <el-radio-button label="waiting">待就诊</el-radio-button>
          <el-radio-button label="completed">已完成</el-radio-button>
          <el-radio-button label="cancelled">已取消</el-radio-button>
          <el-radio-button label="overdue">已逾期</el-radio-button>
        </el-radio-group>
      </div>

      <el-table :data="filteredAppointments" stripe>
        <el-table-column prop="doctorName" label="医师" width="120" />
        <el-table-column prop="department" label="科室" width="140" />
        <el-table-column prop="appointmentDate" label="预约日期" width="120" />
        <el-table-column prop="timeSlot" label="预约时段" width="140" />
        <el-table-column prop="symptoms" label="症状描述" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="statusTypeMap[row.status]">
              {{ statusTextMap[row.status] }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120">
          <template #default="{ row }">
            <el-button
              v-if="row.status === 'waiting'"
              type="danger"
              size="small"
              @click="handleCancel(row)"
            >
              取消预约
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-empty v-if="filteredAppointments.length === 0" description="暂无预约记录" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAppointmentStore } from '@/stores/appointment'
import { useAuthStore } from '@/stores/auth'
import { ElMessage, ElMessageBox } from 'element-plus'

const appointmentStore = useAppointmentStore()
const authStore = useAuthStore()
const statusFilter = ref('')

const myAppointments = computed(() =>
  appointmentStore.getAppointmentsByPatient(authStore.userInfo?.id)
)

const filteredAppointments = computed(() => {
  if (!statusFilter.value) return myAppointments.value
  return myAppointments.value.filter(a => a.status === statusFilter.value)
})

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

onMounted(() => {
  appointmentStore.updateOverdueAppointments()
})

function handleFilter() {
  // Reactivity handles filtering
}

async function handleCancel(appointment) {
  try {
    await ElMessageBox.confirm('确定要取消该预约吗？', '取消预约', {
      confirmButtonText: '确定',
      cancelButtonText: '再想想',
      type: 'warning'
    })

    appointmentStore.cancelAppointment(appointment.id)
    ElMessage.success('预约已取消')
  } catch {
    // User cancelled
  }
}
</script>

<style scoped>
.filter-bar {
  margin-bottom: 20px;
}
</style>
