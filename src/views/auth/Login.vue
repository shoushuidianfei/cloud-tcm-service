<template>
  <div class="login-page">
    <div class="login-card">
      <div class="login-header">
        <h1>云中医灵活用工与预约管理系统</h1>
        <p>Cloud-TCM Service</p>
      </div>

      <el-form
        ref="formRef"
        :model="loginForm"
        :rules="rules"
        label-width="0"
        size="large"
      >
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            placeholder="请输入用户名"
            prefix-icon="User"
          />
        </el-form-item>

        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            placeholder="请输入密码"
            prefix-icon="Lock"
            show-password
            @keyup.enter="handleLogin"
          />
        </el-form-item>

        <el-form-item>
          <el-button
            type="primary"
            :loading="loading"
            class="login-btn"
            @click="handleLogin"
          >
            登录
          </el-button>
        </el-form-item>
      </el-form>

      <div class="demo-accounts">
        <p>演示账号：</p>
        <el-tag
          v-for="account in demoAccounts"
          :key="account.username"
          class="account-tag"
          @click="fillAccount(account)"
        >
          {{ account.label }}: {{ account.username }}
        </el-tag>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { ElMessage } from 'element-plus'

const router = useRouter()
const authStore = useAuthStore()
const formRef = ref(null)
const loading = ref(false)

const loginForm = reactive({
  username: '',
  password: ''
})

const rules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
}

const demoAccounts = [
  { label: '患者', username: 'patient1', password: '123456', role: 'patient' },
  { label: '医师', username: 'doctor1', password: '123456', role: 'doctor' },
  { label: '管理员', username: 'admin', password: '123456', role: 'admin' }
]

function fillAccount(account) {
  loginForm.username = account.username
  loginForm.password = account.password
}

async function handleLogin() {
  try {
    await formRef.value.validate()
  } catch {
    return
  }

  loading.value = true
  try {
    authStore.login(loginForm)
    ElMessage.success('登录成功')

    const roleRoutes = {
      patient: '/patient/doctors',
      doctor: '/doctor/dashboard',
      admin: '/admin/dashboard'
    }
    router.push(roleRoutes[authStore.userRole] || '/login')
  } catch (error) {
    ElMessage.error(error.message || '登录失败')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped lang="scss">
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.login-card {
  width: 420px;
  padding: 40px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.login-header {
  text-align: center;
  margin-bottom: 32px;

  h1 {
    font-size: 22px;
    color: #303133;
    margin-bottom: 8px;
  }

  p {
    color: #909399;
    font-size: 14px;
  }
}

.login-btn {
  width: 100%;
}

.demo-accounts {
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid #eee;
  text-align: center;

  p {
    color: #909399;
    font-size: 13px;
    margin-bottom: 12px;
  }
}

.account-tag {
  margin: 4px;
  cursor: pointer;

  &:hover {
    opacity: 0.8;
  }
}
</style>
