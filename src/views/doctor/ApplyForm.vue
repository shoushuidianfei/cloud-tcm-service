<template>
  <div class="page-container">
    <div class="card-container">
      <div class="page-header">
        <h2>医师申请入驻</h2>
        <el-button @click="handleSaveDraft" :icon="Document">保存草稿</el-button>
      </div>

      <el-steps :active="currentStep" finish-status="success" align-center>
        <el-step title="基本信息" />
        <el-step title="专业资质" />
        <el-step title="证书上传" />
        <el-step title="提交审核" />
      </el-steps>

      <el-form
        ref="formRef"
        :model="formData"
        :rules="rules"
        label-width="120px"
        class="apply-form"
      >
        <div v-show="currentStep === 0" class="step-content">
          <el-form-item label="姓名" prop="name">
            <el-input v-model="formData.name" placeholder="请输入真实姓名" />
          </el-form-item>
          <el-form-item label="性别" prop="gender">
            <el-radio-group v-model="formData.gender">
              <el-radio label="男">男</el-radio>
              <el-radio label="女">女</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="年龄" prop="age">
            <el-input-number v-model="formData.age" :min="18" :max="100" />
          </el-form-item>
          <el-form-item label="手机号" prop="phone">
            <el-input v-model="formData.phone" placeholder="请输入手机号" />
          </el-form-item>
          <el-form-item label="所属科室" prop="department">
            <el-select v-model="formData.department" placeholder="请选择科室">
              <el-option
                v-for="dept in departments"
                :key="dept"
                :label="dept"
                :value="dept"
              />
            </el-select>
          </el-form-item>
        </div>

        <div v-show="currentStep === 1" class="step-content">
          <el-form-item label="职称" prop="title">
            <el-select v-model="formData.title" placeholder="请选择职称">
              <el-option label="主任医师" value="主任医师" />
              <el-option label="副主任医师" value="副主任医师" />
              <el-option label="主治医师" value="主治医师" />
              <el-option label="住院医师" value="住院医师" />
            </el-select>
          </el-form-item>
          <el-form-item label="擅长领域" prop="specialties">
            <el-select
              v-model="formData.specialties"
              multiple
              filterable
              allow-create
              placeholder="请选择擅长领域"
            >
              <el-option
                v-for="item in specialtyOptions"
                :key="item"
                :label="item"
                :value="item"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="从业年限" prop="experience">
            <el-input-number v-model="formData.experience" :min="1" :max="60" />
            <span class="form-suffix">年</span>
          </el-form-item>
          <el-form-item label="学历" prop="education">
            <el-input v-model="formData.education" placeholder="请输入毕业院校及学历" />
          </el-form-item>
          <el-form-item label="个人简介" prop="introduction">
            <el-input
              v-model="formData.introduction"
              type="textarea"
              :rows="4"
              placeholder="请输入个人简介，包括从业经历、专业特长等"
            />
          </el-form-item>
        </div>

        <div v-show="currentStep === 2" class="step-content">
          <el-form-item label="执业证书" prop="certificates">
            <FileUpload
              v-model="formData.certificates"
              :limit="5"
              :max-size="10"
              accept=".jpg,.jpeg,.png,.pdf"
              accept-text="JPG、PNG、PDF"
            />
            <div class="upload-hint">
              请上传医师执业证书、医师资格证书等相关证件的清晰照片或扫描件
            </div>
          </el-form-item>
        </div>

        <div v-show="currentStep === 3" class="step-content">
          <div class="submit-summary">
            <h3>申请信息确认</h3>
            <el-descriptions :column="2" border>
              <el-descriptions-item label="姓名">{{ formData.name }}</el-descriptions-item>
              <el-descriptions-item label="性别">{{ formData.gender }}</el-descriptions-item>
              <el-descriptions-item label="年龄">{{ formData.age }}</el-descriptions-item>
              <el-descriptions-item label="手机号">{{ formData.phone }}</el-descriptions-item>
              <el-descriptions-item label="所属科室">{{ formData.department }}</el-descriptions-item>
              <el-descriptions-item label="职称">{{ formData.title }}</el-descriptions-item>
              <el-descriptions-item label="从业年限">{{ formData.experience }}年</el-descriptions-item>
              <el-descriptions-item label="学历">{{ formData.education }}</el-descriptions-item>
              <el-descriptions-item label="擅长领域" :span="2">
                <el-tag v-for="s in formData.specialties" :key="s" class="specialty-tag">{{ s }}</el-tag>
              </el-descriptions-item>
              <el-descriptions-item label="个人简介" :span="2">
                {{ formData.introduction }}
              </el-descriptions-item>
              <el-descriptions-item label="证书附件" :span="2">
                {{ formData.certificates.length }} 个文件
              </el-descriptions-item>
            </el-descriptions>
          </div>
        </div>

        <div class="form-actions">
          <el-button v-if="currentStep > 0" @click="currentStep--">上一步</el-button>
          <el-button v-if="currentStep < 3" type="primary" @click="handleNext">
            下一步
          </el-button>
          <el-button
            v-if="currentStep === 3"
            type="primary"
            :loading="submitting"
            @click="handleSubmit"
          >
            提交审核
          </el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useDoctorStore } from '@/stores/doctor'
import { useAuthStore } from '@/stores/auth'
import { departments, specialtyOptions } from '@/mock'
import { validatePhone } from '@/utils/validate'
import FileUpload from '@/components/common/FileUpload.vue'
import { ElMessage } from 'element-plus'
import { Document } from '@element-plus/icons-vue'

const router = useRouter()
const doctorStore = useDoctorStore()
const authStore = useAuthStore()
const formRef = ref(null)
const currentStep = ref(0)
const submitting = ref(false)

const formData = reactive({
  name: '',
  gender: '男',
  age: 30,
  phone: '',
  department: '',
  title: '',
  specialties: [],
  experience: 5,
  education: '',
  introduction: '',
  certificates: []
})

const rules = {
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  gender: [{ required: true, message: '请选择性别', trigger: 'change' }],
  age: [{ required: true, message: '请输入年龄', trigger: 'blur' }],
  phone: [{ required: true, validator: validatePhone, trigger: 'blur' }],
  department: [{ required: true, message: '请选择科室', trigger: 'change' }],
  title: [{ required: true, message: '请选择职称', trigger: 'change' }],
  specialties: [{ required: true, message: '请选择擅长领域', trigger: 'change', type: 'array' }],
  experience: [{ required: true, message: '请输入从业年限', trigger: 'blur' }],
  education: [{ required: true, message: '请输入学历', trigger: 'blur' }],
  introduction: [{ required: true, message: '请输入个人简介', trigger: 'blur' }]
}

onMounted(() => {
  const draft = doctorStore.getDraft()
  if (draft) {
    Object.assign(formData, draft)
    ElMessage.info('已恢复草稿数据')
  }
})

async function handleNext() {
  try {
    await formRef.value.validate()
    currentStep.value++
  } catch {
    ElMessage.warning('请填写完整信息')
  }
}

function handleSaveDraft() {
  doctorStore.saveDraft({ ...formData })
  ElMessage.success('草稿已保存')
}

async function handleSubmit() {
  submitting.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 1500))

    doctorStore.submitDoctorApplication({
      ...formData,
      id: `D${Date.now()}`,
      userId: authStore.userInfo.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    })

    doctorStore.clearDraft()
    ElMessage.success('申请已提交，请等待审核')
    router.push('/doctor/dashboard')
  } catch (error) {
    ElMessage.error('提交失败')
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped lang="scss">
.apply-form {
  max-width: 700px;
  margin: 30px auto 0;
}

.step-content {
  min-height: 300px;
  padding: 20px 0;
}

.form-suffix {
  margin-left: 10px;
  color: #909399;
}

.upload-hint {
  color: #909399;
  font-size: 12px;
  margin-top: 8px;
}

.form-actions {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #eee;
}

.submit-summary {
  h3 {
    margin-bottom: 20px;
    color: #303133;
  }
}

.specialty-tag {
  margin-right: 8px;
  margin-bottom: 4px;
}

:deep(.el-steps) {
  margin-bottom: 20px;
}
</style>
