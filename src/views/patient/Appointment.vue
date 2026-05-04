<template>
  <div class="page-container">
    <div class="card-container">
      <div class="page-header">
        <h2>预约挂号</h2>
        <el-button @click="$router.back()">返回列表</el-button>
      </div>

      <div v-if="doctor" class="doctor-detail">
        <div class="doctor-card-full">
          <el-avatar :size="100" icon="UserFilled" />
          <div class="doctor-info">
            <h2>{{ doctor.name }}</h2>
            <div class="info-tags">
              <el-tag>{{ doctor.title }}</el-tag>
              <el-tag type="info">{{ doctor.department }}</el-tag>
              <el-tag type="success">从业 {{ doctor.experience }} 年</el-tag>
            </div>
            <p class="introduction">{{ doctor.introduction }}</p>
          </div>
        </div>
      </div>
    </div>

    <div class="card-container">
      <h3 class="section-title">选择预约时间</h3>

      <div class="date-picker">
        <el-radio-group v-model="selectedDate" @change="handleDateChange">
          <el-radio-button
            v-for="date in dateOptions"
            :key="date.value"
            :label="date.value"
          >
            {{ date.label }}
          </el-radio-button>
        </el-radio-group>
      </div>

      <div class="slots-container">
        <h4>可选时段</h4>
        <div class="slots-grid">
          <div
            v-for="slot in availableSlots"
            :key="slot.timeSlot"
            class="slot-item"
            :class="{
              active: selectedSlot === slot.timeSlot,
              disabled: !slot.available
            }"
            @click="handleSelectSlot(slot)"
          >
            <span class="slot-time">{{ slot.timeSlot }}</span>
            <span class="slot-status">
              {{ slot.available ? '可预约' : '已约满' }}
            </span>
          </div>
        </div>

        <el-empty v-if="availableSlots.length === 0" description="该日期暂无可预约时段" />
      </div>
    </div>

    <div v-if="selectedSlot" class="card-container">
      <h3 class="section-title">填写预约信息</h3>

      <el-form
        ref="formRef"
        :model="appointmentForm"
        :rules="rules"
        label-width="100px"
        style="max-width: 500px"
      >
        <el-form-item label="预约时段">
          <el-tag type="primary">{{ selectedDate }} {{ selectedSlot }}</el-tag>
        </el-form-item>
        <el-form-item label="症状描述" prop="symptoms">
          <el-input
            v-model="appointmentForm.symptoms"
            type="textarea"
            :rows="3"
            placeholder="请简要描述您的症状，以便医师提前了解"
          />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            size="large"
            :loading="submitting"
            @click="handleConfirm"
          >
            确认预约
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useDoctorStore } from '@/stores/doctor'
import { useAppointmentStore } from '@/stores/appointment'
import { useAuthStore } from '@/stores/auth'
import { ElMessage } from 'element-plus'
import dayjs from 'dayjs'

const route = useRoute()
const router = useRouter()
const doctorStore = useDoctorStore()
const appointmentStore = useAppointmentStore()
const authStore = useAuthStore()
const formRef = ref(null)
const submitting = ref(false)

const doctorId = route.params.doctorId
const doctor = computed(() => doctorStore.getDoctorById(doctorId))

const selectedDate = ref(dayjs().format('YYYY-MM-DD'))
const selectedSlot = ref('')

const appointmentForm = reactive({
  symptoms: ''
})

const rules = {
  symptoms: [{ required: true, message: '请描述您的症状', trigger: 'blur' }]
}

const dateOptions = computed(() => {
  const dates = []
  for (let i = 0; i < 7; i++) {
    const date = dayjs().add(i, 'day')
    dates.push({
      value: date.format('YYYY-MM-DD'),
      label: i === 0 ? '今天' : i === 1 ? '明天' : date.format('MM/DD 周dd')
    })
  }
  return dates
})

const availableSlots = computed(() =>
  appointmentStore.getAvailableSlots(doctorId, selectedDate.value)
)

function handleDateChange() {
  selectedSlot.value = ''
}

function handleSelectSlot(slot) {
  if (!slot.available) {
    ElMessage.warning('该时段已被预约')
    return
  }
  selectedSlot.value = slot.timeSlot
}

async function handleConfirm() {
  try {
    await formRef.value.validate()
  } catch {
    return
  }

  submitting.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 1000))

    appointmentStore.createAppointment({
      patientId: authStore.userInfo.id,
      patientName: authStore.userName,
      doctorId: doctor.value.id,
      doctorName: doctor.value.name,
      department: doctor.value.department,
      appointmentDate: selectedDate.value,
      timeSlot: selectedSlot.value,
      symptoms: appointmentForm.symptoms
    })

    ElMessage.success('预约成功')
    router.push('/patient/history')
  } catch (error) {
    ElMessage.error(error.message || '预约失败')
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped lang="scss">
.doctor-detail {
  margin-bottom: 20px;
}

.doctor-card-full {
  display: flex;
  gap: 24px;
  padding: 20px;
  background: #f5f7fa;
  border-radius: 8px;
}

.doctor-info {
  h2 {
    font-size: 24px;
    margin-bottom: 12px;
  }
}

.info-tags {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
}

.introduction {
  color: #606266;
  line-height: 1.6;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 20px;
  color: #303133;
}

.date-picker {
  margin-bottom: 24px;
}

.slots-container {
  h4 {
    margin-bottom: 16px;
    color: #606266;
  }
}

.slots-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.slot-item {
  padding: 12px 20px;
  border: 1px solid #ebeef5;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s;
  text-align: center;

  &:hover:not(.disabled) {
    border-color: #409eff;
    background: #ecf5ff;
  }

  &.active {
    background: #409eff;
    border-color: #409eff;
    color: #fff;

    .slot-status {
      color: #ffffffb3;
    }
  }

  &.disabled {
    background: #f5f7fa;
    cursor: not-allowed;
    opacity: 0.6;
  }
}

.slot-time {
  display: block;
  font-weight: 500;
  margin-bottom: 4px;
}

.slot-status {
  font-size: 12px;
  color: #909399;
}
</style>
