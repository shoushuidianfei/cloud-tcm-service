<template>
  <div class="page-container">
    <div class="card-container">
      <div class="page-header">
        <h2>医师审核</h2>
      </div>

      <div class="filter-bar">
        <el-input
          v-model="filters.name"
          placeholder="搜索医师姓名"
          clearable
          style="width: 200px"
          @input="handleSearch"
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>

        <el-select
          v-model="filters.status"
          placeholder="审核状态"
          clearable
          style="width: 140px"
          @change="handleSearch"
        >
          <el-option label="待审核" value="pending" />
          <el-option label="已通过" value="approved" />
          <el-option label="已驳回" value="rejected" />
        </el-select>

        <el-select
          v-model="filters.department"
          placeholder="所属科室"
          clearable
          style="width: 160px"
          @change="handleSearch"
        >
          <el-option
            v-for="dept in departments"
            :key="dept"
            :label="dept"
            :value="dept"
          />
        </el-select>

        <el-button type="primary" @click="handleSearch">
          <el-icon><Search /></el-icon>
          搜索
        </el-button>
        <el-button @click="handleReset">重置</el-button>
      </div>

      <el-table :data="filteredDoctors" stripe>
        <el-table-column prop="name" label="医师姓名" width="100" />
        <el-table-column prop="gender" label="性别" width="60" />
        <el-table-column prop="department" label="科室" width="140" />
        <el-table-column prop="title" label="职称" width="120" />
        <el-table-column prop="experience" label="从业年限" width="100">
          <template #default="{ row }">
            {{ row.experience }} 年
          </template>
        </el-table-column>
        <el-table-column prop="education" label="学历" width="160" />
        <el-table-column prop="auditStatus" label="审核状态" width="100">
          <template #default="{ row }">
            <el-tag :type="statusTypeMap[row.auditStatus]">
              {{ statusTextMap[row.auditStatus] }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="申请时间" width="180">
          <template #default="{ row }">
            {{ formatDate(row.createdAt) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button
              type="primary"
              size="small"
              @click="handleView(row)"
            >
              查看详情
            </el-button>
            <el-button
              v-if="row.auditStatus === 'pending'"
              type="success"
              size="small"
              @click="handleApprove(row)"
            >
              通过
            </el-button>
            <el-button
              v-if="row.auditStatus === 'pending'"
              type="danger"
              size="small"
              @click="handleReject(row)"
            >
              驳回
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog
      v-model="rejectDialogVisible"
      title="驳回申请"
      width="500px"
    >
      <el-form :model="rejectForm" label-width="80px">
        <el-form-item label="医师姓名">
          <el-input :value="rejectTarget?.name" disabled />
        </el-form-item>
        <el-form-item label="驳回原因" required>
          <el-input
            v-model="rejectForm.reason"
            type="textarea"
            :rows="4"
            placeholder="请填写驳回原因，将反馈给医师"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="rejectDialogVisible = false">取消</el-button>
        <el-button
          type="danger"
          :loading="rejecting"
          @click="confirmReject"
        >
          确认驳回
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useDoctorStore } from '@/stores/doctor'
import { departments } from '@/mock'
import { ElMessage, ElMessageBox } from 'element-plus'
import dayjs from 'dayjs'

const router = useRouter()
const doctorStore = useDoctorStore()

const filters = reactive({
  name: '',
  status: '',
  department: ''
})

const rejectDialogVisible = ref(false)
const rejectTarget = ref(null)
const rejectForm = reactive({ reason: '' })
const rejecting = ref(false)

const statusTypeMap = {
  pending: 'warning',
  approved: 'success',
  rejected: 'danger'
}

const statusTextMap = {
  pending: '待审核',
  approved: '已通过',
  rejected: '已驳回'
}

const filteredDoctors = computed(() => {
  let result = [...doctorStore.doctors]

  if (filters.name) {
    result = result.filter(d => d.name.includes(filters.name))
  }
  if (filters.status) {
    result = result.filter(d => d.auditStatus === filters.status)
  }
  if (filters.department) {
    result = result.filter(d => d.department === filters.department)
  }

  return result
})

function formatDate(date) {
  return dayjs(date).format('YYYY-MM-DD HH:mm')
}

function handleSearch() {
  // Reactivity handles filtering
}

function handleReset() {
  filters.name = ''
  filters.status = ''
  filters.department = ''
}

function handleView(doctor) {
  router.push(`/admin/audit/${doctor.id}`)
}

async function handleApprove(doctor) {
  try {
    await ElMessageBox.confirm(
      `确定通过 ${doctor.name} 的入驻申请吗？`,
      '审核通过',
      { type: 'success' }
    )

    doctorStore.updateAuditStatus(doctor.id, 'approved')
    ElMessage.success('审核已通过')
  } catch {
    // User cancelled
  }
}

function handleReject(doctor) {
  rejectTarget.value = doctor
  rejectForm.reason = ''
  rejectDialogVisible.value = true
}

async function confirmReject() {
  if (!rejectForm.reason.trim()) {
    ElMessage.warning('请填写驳回原因')
    return
  }

  rejecting.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 800))

    doctorStore.updateAuditStatus(rejectTarget.value.id, 'rejected', rejectForm.reason)
    rejectDialogVisible.value = false
    ElMessage.success('已驳回')
  } finally {
    rejecting.value = false
  }
}
</script>

<style scoped>
:deep(.el-table) {
  margin-top: 0;
}
</style>
