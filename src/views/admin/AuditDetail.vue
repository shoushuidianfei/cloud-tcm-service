<template>
  <div class="page-container">
    <div class="card-container">
      <div class="page-header">
        <h2>审核详情</h2>
        <el-button @click="$router.back()">返回列表</el-button>
      </div>

      <div v-if="doctor" class="audit-detail">
        <div class="audit-status-bar">
          <el-alert
            :type="auditAlertType"
            :title="auditAlertTitle"
            :description="auditAlertDesc"
            show-icon
            :closable="false"
          />
        </div>

        <el-descriptions title="基本信息" :column="2" border class="detail-section">
          <el-descriptions-item label="姓名">{{ doctor.name }}</el-descriptions-item>
          <el-descriptions-item label="性别">{{ doctor.gender }}</el-descriptions-item>
          <el-descriptions-item label="年龄">{{ doctor.age }} 岁</el-descriptions-item>
          <el-descriptions-item label="手机号">{{ doctor.phone }}</el-descriptions-item>
          <el-descriptions-item label="所属科室">{{ doctor.department }}</el-descriptions-item>
          <el-descriptions-item label="职称">{{ doctor.title }}</el-descriptions-item>
          <el-descriptions-item label="从业年限">{{ doctor.experience }} 年</el-descriptions-item>
          <el-descriptions-item label="学历">{{ doctor.education }}</el-descriptions-item>
        </el-descriptions>

        <el-descriptions title="专业资质" :column="1" border class="detail-section">
          <el-descriptions-item label="擅长领域">
            <el-tag v-for="s in doctor.specialties" :key="s" class="tag-item">
              {{ s }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="个人简介">
            {{ doctor.introduction }}
          </el-descriptions-item>
        </el-descriptions>

        <div class="detail-section">
          <h3 class="section-title">证书附件</h3>
          <div class="cert-list">
            <div
              v-for="(cert, index) in doctor.certificates"
              :key="index"
              class="cert-item"
            >
              <el-icon size="40" color="#409eff"><Document /></el-icon>
              <span class="cert-name">{{ cert.name }}</span>
              <el-button type="primary" link size="small">查看</el-button>
            </div>
          </div>
          <el-empty v-if="doctor.certificates.length === 0" description="暂无证书" />
        </div>

        <div v-if="doctor.auditStatus === 'pending'" class="audit-actions">
          <el-button
            type="success"
            size="large"
            :loading="approving"
            @click="handleApprove"
          >
            审核通过
          </el-button>
          <el-button
            type="danger"
            size="large"
            @click="showRejectDialog = true"
          >
            驳回申请
          </el-button>
        </div>
      </div>

      <el-empty v-else description="未找到医师信息" />
    </div>

    <el-dialog v-model="showRejectDialog" title="驳回申请" width="500px">
      <el-form :model="rejectForm" label-width="80px">
        <el-form-item label="驳回原因" required>
          <el-input
            v-model="rejectForm.reason"
            type="textarea"
            :rows="4"
            placeholder="请详细说明驳回原因，以便医师修改后重新提交"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showRejectDialog = false">取消</el-button>
        <el-button type="danger" :loading="rejecting" @click="handleReject">
          确认驳回
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useDoctorStore } from '@/stores/doctor'
import { ElMessage } from 'element-plus'

const route = useRoute()
const router = useRouter()
const doctorStore = useDoctorStore()

const doctorId = route.params.id
const doctor = computed(() => doctorStore.getDoctorById(doctorId))

const showRejectDialog = ref(false)
const rejectForm = reactive({ reason: '' })
const approving = ref(false)
const rejecting = ref(false)

const auditAlertType = computed(() => {
  const map = { pending: 'warning', approved: 'success', rejected: 'error' }
  return map[doctor.value?.auditStatus] || 'info'
})

const auditAlertTitle = computed(() => {
  const map = { pending: '待审核', approved: '已通过', rejected: '已驳回' }
  return doctor.value ? map[doctor.value.auditStatus] : ''
})

const auditAlertDesc = computed(() => {
  if (!doctor.value) return ''
  if (doctor.value.auditStatus === 'rejected') {
    return `驳回原因：${doctor.value.rejectReason}`
  }
  return ''
})

async function handleApprove() {
  approving.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 800))
    doctorStore.updateAuditStatus(doctorId, 'approved')
    ElMessage.success('审核已通过')
    router.push('/admin/audit')
  } finally {
    approving.value = false
  }
}

async function handleReject() {
  if (!rejectForm.reason.trim()) {
    ElMessage.warning('请填写驳回原因')
    return
  }

  rejecting.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 800))
    doctorStore.updateAuditStatus(doctorId, 'rejected', rejectForm.reason)
    ElMessage.success('已驳回')
    showRejectDialog.value = false
    router.push('/admin/audit')
  } finally {
    rejecting.value = false
  }
}
</script>

<style scoped lang="scss">
.audit-status-bar {
  margin-bottom: 24px;
}

.detail-section {
  margin-bottom: 24px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 16px;
  color: #303133;
}

.tag-item {
  margin-right: 8px;
  margin-bottom: 4px;
}

.cert-list {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.cert-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 16px 20px;
  background: #f5f7fa;
  border-radius: 8px;
  border: 1px solid #ebeef5;
}

.cert-name {
  font-weight: 500;
  color: #303133;
}

.audit-actions {
  display: flex;
  justify-content: center;
  gap: 24px;
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #eee;
}
</style>
