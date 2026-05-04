<template>
  <div class="page-container">
    <div class="stats-row">
      <el-row :gutter="20">
        <el-col :span="6">
          <div class="stat-card">
            <div class="stat-icon" style="background: #409eff">
              <el-icon size="24"><User /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ totalDoctors }}</div>
              <div class="stat-label">总医师数</div>
            </div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="stat-card">
            <div class="stat-icon" style="background: #e6a23c">
              <el-icon size="24"><Clock /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ pendingCount }}</div>
              <div class="stat-label">待审核</div>
            </div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="stat-card">
            <div class="stat-icon" style="background: #67c23a">
              <el-icon size="24"><CircleCheck /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ approvedCount }}</div>
              <div class="stat-label">已通过</div>
            </div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="stat-card">
            <div class="stat-icon" style="background: #f56c6c">
              <el-icon size="24"><CircleClose /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ rejectedCount }}</div>
              <div class="stat-label">已驳回</div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>

    <div class="card-container">
      <div class="page-header">
        <h2>待审核医师</h2>
        <el-button type="primary" @click="$router.push('/admin/audit')">
          查看全部
        </el-button>
      </div>

      <el-table :data="pendingDoctors" stripe>
        <el-table-column prop="name" label="姓名" width="100" />
        <el-table-column prop="department" label="科室" width="140" />
        <el-table-column prop="title" label="职称" width="120" />
        <el-table-column prop="experience" label="从业年限" width="100">
          <template #default="{ row }">
            {{ row.experience }} 年
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="申请时间">
          <template #default="{ row }">
            {{ formatDate(row.createdAt) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template #default="{ row }">
            <el-button
              type="primary"
              size="small"
              @click="$router.push(`/admin/audit/${row.id}`)"
            >
              查看
            </el-button>
            <el-button
              type="success"
              size="small"
              @click="handleQuickApprove(row)"
            >
              通过
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-empty v-if="pendingDoctors.length === 0" description="暂无待审核医师" />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useDoctorStore } from '@/stores/doctor'
import { ElMessage, ElMessageBox } from 'element-plus'
import dayjs from 'dayjs'

const doctorStore = useDoctorStore()

const totalDoctors = computed(() => doctorStore.doctors.length)
const pendingCount = computed(() =>
  doctorStore.doctors.filter(d => d.auditStatus === 'pending').length
)
const approvedCount = computed(() =>
  doctorStore.doctors.filter(d => d.auditStatus === 'approved').length
)
const rejectedCount = computed(() =>
  doctorStore.doctors.filter(d => d.auditStatus === 'rejected').length
)

const pendingDoctors = computed(() =>
  doctorStore.doctors.filter(d => d.auditStatus === 'pending')
)

function formatDate(date) {
  return dayjs(date).format('YYYY-MM-DD HH:mm')
}

async function handleQuickApprove(doctor) {
  try {
    await ElMessageBox.confirm(
      `确定通过 ${doctor.name} 的入驻申请吗？`,
      '快速审核',
      { type: 'success' }
    )
    doctorStore.updateAuditStatus(doctor.id, 'approved')
    ElMessage.success('审核已通过')
  } catch {
    // User cancelled
  }
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
</style>
