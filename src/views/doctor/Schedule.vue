<template>
  <div class="page-container">
    <div class="card-container">
      <div class="page-header">
        <h2>排班管理</h2>
        <el-button type="primary" @click="handleSave">保存排班</el-button>
      </div>

      <div class="schedule-week">
        <div
          v-for="day in weekDays"
          :key="day.value"
          class="day-column"
          :class="{ active: selectedDay === day.value }"
          @click="selectedDay = day.value"
        >
          <div class="day-label">{{ day.label }}</div>
          <div class="day-count">
            {{ getSlotCount(day.value) }} 个时段
          </div>
        </div>
      </div>

      <div class="slots-container">
        <div class="slots-header">
          <h3>{{ selectedDayLabel }} - 时段设置</h3>
          <el-button size="small" @click="handleAddSlot">添加时段</el-button>
        </div>

        <div class="slots-grid">
          <div
            v-for="(slot, index) in currentSlots"
            :key="index"
            class="slot-item"
            :class="{ active: slot.enabled }"
          >
            <span class="slot-time">{{ slot.time }}</span>
            <el-switch
              v-model="slot.enabled"
              @change="handleSlotChange"
            />
            <el-button
              type="danger"
              size="small"
              text
              @click="handleRemoveSlot(index)"
            >
              删除
            </el-button>
          </div>
        </div>

        <el-empty v-if="currentSlots.length === 0" description="暂未设置时段" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, reactive, onMounted } from 'vue'
import { useDoctorStore } from '@/stores/doctor'
import { useAuthStore } from '@/stores/auth'
import { ElMessage } from 'element-plus'

const doctorStore = useDoctorStore()
const authStore = useAuthStore()

const weekDays = [
  { value: '周一', label: '周一' },
  { value: '周二', label: '周二' },
  { value: '周三', label: '周三' },
  { value: '周四', label: '周四' },
  { value: '周五', label: '周五' },
  { value: '周六', label: '周六' },
  { value: '周日', label: '周日' }
]

const selectedDay = ref('周一')

const doctorInfo = computed(() =>
  doctorStore.doctors.find(d => d.userId === authStore.userInfo?.id)
)

const scheduleData = reactive({
  '周一': [],
  '周二': [],
  '周三': [],
  '周四': [],
  '周五': [],
  '周六': [],
  '周日': []
})

onMounted(() => {
  if (doctorInfo.value?.schedule) {
    doctorInfo.value.schedule.forEach(s => {
      if (scheduleData[s.day]) {
        scheduleData[s.day] = s.slots.map(time => ({ time, enabled: true }))
      }
    })
  }
})

const selectedDayLabel = computed(() =>
  weekDays.find(d => d.value === selectedDay.value)?.label || ''
)

const currentSlots = computed(() => scheduleData[selectedDay.value] || [])

function getSlotCount(day) {
  return scheduleData[day]?.filter(s => s.enabled).length || 0
}

function handleAddSlot() {
  const lastSlot = currentSlots.value[currentSlots.value.length - 1]
  let newTime = '08:00-08:30'

  if (lastSlot) {
    const endTime = lastSlot.time.split('-')[1]
    const [hours, minutes] = endTime.split(':').map(Number)
    const newStart = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
    const newEndMinutes = minutes + 30
    const newEndHours = hours + Math.floor(newEndMinutes / 60)
    const newEnd = `${String(newEndHours).padStart(2, '0')}:${String(newEndMinutes % 60).padStart(2, '0')}`
    newTime = `${newStart}-${newEnd}`
  }

  scheduleData[selectedDay.value].push({ time: newTime, enabled: true })
}

function handleRemoveSlot(index) {
  scheduleData[selectedDay.value].splice(index, 1)
}

function handleSlotChange() {
  // Trigger reactivity
}

function handleSave() {
  const schedule = Object.entries(scheduleData)
    .filter(([_, slots]) => slots.some(s => s.enabled))
    .map(([day, slots]) => ({
      day,
      slots: slots.filter(s => s.enabled).map(s => s.time)
    }))

  if (doctorInfo.value) {
    doctorInfo.value.schedule = schedule
    doctorStore.doctors = [...doctorStore.doctors]
  }

  ElMessage.success('排班已保存')
}
</script>

<style scoped lang="scss">
.schedule-week {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

.day-column {
  flex: 1;
  min-width: 100px;
  padding: 16px;
  background: #f5f7fa;
  border-radius: 8px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background: #ecf5ff;
  }

  &.active {
    background: #409eff;
    color: #fff;

    .day-count {
      color: #ffffffb3;
    }
  }
}

.day-label {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 8px;
}

.day-count {
  font-size: 12px;
  color: #909399;
}

.slots-container {
  background: #fff;
  border: 1px solid #ebeef5;
  border-radius: 8px;
  padding: 20px;
}

.slots-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;

  h3 {
    font-size: 16px;
    color: #303133;
  }
}

.slots-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.slot-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: #f5f7fa;
  border-radius: 6px;
  border: 1px solid #ebeef5;

  &.active {
    background: #ecf5ff;
    border-color: #409eff;
  }
}

.slot-time {
  font-weight: 500;
  color: #303133;
  min-width: 100px;
}
</style>
