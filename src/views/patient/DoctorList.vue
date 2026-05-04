<template>
  <div class="page-container">
    <div class="card-container">
      <div class="page-header">
        <h2>找中医</h2>
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
          v-model="filters.department"
          placeholder="选择科室"
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

        <el-select
          v-model="filters.specialty"
          placeholder="擅长领域"
          clearable
          filterable
          style="width: 200px"
          @change="handleSearch"
        >
          <el-option
            v-for="item in specialtyOptions"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>

        <el-button type="primary" @click="handleSearch">
          <el-icon><Search /></el-icon>
          搜索
        </el-button>
        <el-button @click="handleReset">重置</el-button>
      </div>
    </div>

    <div class="card-container">
      <VirtualScroll
        :data="filteredDoctors"
        :item-height="180"
        :container-height="600"
      >
        <template #default="{ item }">
          <div class="doctor-card" @click="handleAppointment(item)">
            <div class="doctor-avatar">
              <el-avatar :size="80" icon="UserFilled" />
            </div>
            <div class="doctor-info">
              <div class="doctor-header">
                <h3 class="doctor-name">{{ item.name }}</h3>
                <el-tag size="small">{{ item.title }}</el-tag>
                <el-tag type="info" size="small">{{ item.department }}</el-tag>
              </div>
              <div class="doctor-meta">
                <span>从业 {{ item.experience }} 年</span>
                <span>{{ item.education }}</span>
              </div>
              <div class="doctor-specialties">
                <el-tag
                  v-for="s in item.specialties"
                  :key="s"
                  size="small"
                  type="success"
                  effect="plain"
                >
                  {{ s }}
                </el-tag>
              </div>
              <div class="doctor-intro text-ellipsis">
                {{ item.introduction }}
              </div>
            </div>
            <div class="doctor-action">
              <el-button type="primary" size="large">
                立即预约
              </el-button>
            </div>
          </div>
        </template>
      </VirtualScroll>

      <el-empty v-if="filteredDoctors.length === 0" description="暂无符合条件的医师" />
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useDoctorStore } from '@/stores/doctor'
import { departments, specialtyOptions } from '@/mock'
import VirtualScroll from '@/components/common/VirtualScroll.vue'

const router = useRouter()
const doctorStore = useDoctorStore()

const filters = reactive({
  name: '',
  department: '',
  specialty: ''
})

const filteredDoctors = ref([])

onMounted(() => {
  handleSearch()
})

function handleSearch() {
  filteredDoctors.value = doctorStore.getDoctorsByFilter(filters)
}

function handleReset() {
  filters.name = ''
  filters.department = ''
  filters.specialty = ''
  handleSearch()
}

function handleAppointment(doctor) {
  router.push(`/patient/appointment/${doctor.id}`)
}
</script>

<style scoped lang="scss">
.doctor-card {
  display: flex;
  align-items: flex-start;
  gap: 20px;
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  margin-bottom: 12px;
  cursor: pointer;
  transition: all 0.3s;
  border: 1px solid #ebeef5;

  &:hover {
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
    border-color: #409eff;
  }
}

.doctor-avatar {
  flex-shrink: 0;
}

.doctor-info {
  flex: 1;
  min-width: 0;
}

.doctor-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
}

.doctor-name {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
}

.doctor-meta {
  color: #909399;
  font-size: 13px;
  margin-bottom: 10px;

  span {
    margin-right: 16px;
  }
}

.doctor-specialties {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 10px;
}

.doctor-intro {
  color: #606266;
  font-size: 14px;
  line-height: 1.5;
}

.doctor-action {
  flex-shrink: 0;
  display: flex;
  align-items: center;
}
</style>
