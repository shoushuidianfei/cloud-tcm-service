<template>
  <div class="file-upload">
    <el-upload
      :file-list="fileList"
      :action="uploadAction"
      :before-upload="handleBeforeUpload"
      :on-progress="handleProgress"
      :on-success="handleSuccess"
      :on-error="handleError"
      :on-remove="handleRemove"
      :on-preview="handlePreview"
      :limit="limit"
      :on-exceed="handleExceed"
      :accept="accept"
      list-type="picture-card"
      :auto-upload="autoUpload"
    >
      <el-icon><Plus /></el-icon>
      <template #tip>
        <div class="upload-tip">
          支持 {{ acceptText }} 格式，单个文件不超过 {{ maxSize }}MB
        </div>
      </template>
    </el-upload>

    <el-dialog v-model="previewVisible" title="预览" width="600px">
      <img :src="previewUrl" alt="预览" style="width: 100%" />
    </el-dialog>

    <div v-if="uploading" class="upload-progress">
      <el-progress :percentage="uploadProgress" :status="progressStatus" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => []
  },
  limit: {
    type: Number,
    default: 5
  },
  maxSize: {
    type: Number,
    default: 10
  },
  accept: {
    type: String,
    default: '.jpg,.jpeg,.png,.pdf'
  },
  acceptText: {
    type: String,
    default: 'JPG、PNG、PDF'
  },
  uploadAction: {
    type: String,
    default: '/api/upload'
  },
  autoUpload: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['update:modelValue'])

const fileList = ref([...props.modelValue])
const previewVisible = ref(false)
const previewUrl = ref('')
const uploading = ref(false)
const uploadProgress = ref(0)
const progressStatus = ref('')

watch(() => props.modelValue, (val) => {
  fileList.value = [...val]
})

function handleBeforeUpload(file) {
  const isValidSize = file.size / 1024 / 1024 < props.maxSize
  if (!isValidSize) {
    ElMessage.error(`文件大小不能超过 ${props.maxSize}MB`)
    return false
  }

  const validTypes = ['image/jpeg', 'image/png', 'application/pdf']
  if (!validTypes.includes(file.type)) {
    ElMessage.error('只支持 JPG、PNG、PDF 格式')
    return false
  }

  uploading.value = true
  uploadProgress.value = 0
  return true
}

function handleProgress(event) {
  uploadProgress.value = Math.round(event.percent)
}

function handleSuccess(response, file, files) {
  uploading.value = false
  uploadProgress.value = 100
  progressStatus.value = 'success'
  fileList.value = files
  emit('update:modelValue', files.map(f => ({
    name: f.name,
    url: f.url || f.response?.url || ''
  })))
  ElMessage.success('上传成功')
}

function handleError() {
  uploading.value = false
  progressStatus.value = 'exception'
  ElMessage.error('上传失败')
}

function handleRemove(file, files) {
  fileList.value = files
  emit('update:modelValue', files.map(f => ({
    name: f.name,
    url: f.url || ''
  })))
}

function handlePreview(file) {
  previewUrl.value = file.url
  previewVisible.value = true
}

function handleExceed() {
  ElMessage.warning(`最多上传 ${props.limit} 个文件`)
}
</script>

<style scoped>
.file-upload {
  width: 100%;
}

.upload-tip {
  color: #909399;
  font-size: 12px;
  margin-top: 8px;
}

.upload-progress {
  margin-top: 16px;
}

:deep(.el-upload--picture-card) {
  width: 120px;
  height: 120px;
}

:deep(.el-upload-list__item) {
  width: 120px;
  height: 120px;
}
</style>
