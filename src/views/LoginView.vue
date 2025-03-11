<template>
  <div class="welcome-screen">
    <div class="logo">
      <i class="fas fa-book-open"></i>
    </div>
    <h1 class="welcome-title">心情日记</h1>
    <p class="welcome-subtitle">记录每一天的故事</p>

    <div class="login-container" v-if="showLoginForm">
      <div class="login-form">
        <div class="form-group">
          <label for="username">用户名</label>
          <input type="text" id="username" v-model="loginForm.username" placeholder="请输入用户名"
            :class="{ 'input-error': errors.username }">
          <div class="error-message" v-if="errors.username">{{ errors.username }}</div>
        </div>

        <div class="form-group">
          <label for="password">密码</label>
          <input type="password" id="password" v-model="loginForm.password" placeholder="请输入密码"
            :class="{ 'input-error': errors.password }">
          <div class="error-message" v-if="errors.password">{{ errors.password }}</div>
        </div>

        <div class="login-actions">
          <button class="btn btn-primary" @click="handleLogin" :disabled="isLoading">
            <i class="fas fa-spinner fa-spin" v-if="isLoading"></i>
            <span v-else>登录</span>
          </button>
        </div>

        <transition name="fade">
          <div v-if="errors.login" class="login-error-container">
            <div class="error-message login-error">{{ errors.login }}</div>
          </div>
        </transition>
      </div>

      <div class="auth-toggle">
        <span>没有账号？</span>
        <a href="#" @click.prevent="toggleAuthMode">立即注册</a>
      </div>
    </div>

    <div class="login-container" v-else>
      <div class="login-form">
        <div class="form-group">
          <label for="reg-username">用户名</label>
          <input type="text" id="reg-username" v-model="registerForm.username" placeholder="请输入用户名"
            :class="{ 'input-error': errors.regUsername }">
          <div class="error-message" v-if="errors.regUsername">{{ errors.regUsername }}</div>
        </div>

        <div class="form-group">
          <label for="email">邮箱</label>
          <input type="email" id="email" v-model="registerForm.email" placeholder="请输入邮箱"
            :class="{ 'input-error': errors.email }">
          <div class="error-message" v-if="errors.email">{{ errors.email }}</div>
        </div>

        <div class="form-group">
          <label for="reg-password">密码</label>
          <input type="password" id="reg-password" v-model="registerForm.password" placeholder="请输入密码"
            :class="{ 'input-error': errors.regPassword }">
          <div class="error-message" v-if="errors.regPassword">{{ errors.regPassword }}</div>
        </div>

        <div class="login-actions">
          <button class="btn btn-primary" @click="handleRegister" :disabled="isLoading">
            <i class="fas fa-spinner fa-spin" v-if="isLoading"></i>
            <span v-else>注册</span>
          </button>
        </div>

        <transition name="fade">
          <div v-if="errors.register" class="login-error-container">
            <div class="error-message login-error">{{ errors.register }}</div>
          </div>
        </transition>
      </div>

      <div class="auth-toggle">
        <span>已有账号？</span>
        <a href="#" @click.prevent="toggleAuthMode">立即登录</a>
      </div>
    </div>
  </div>
</template>

<script>
import { login, register } from '@/services/auth'

export default {
  name: 'LoginView',
  data() {
    return {
      showLoginForm: true,
      isLoading: false,
      loginForm: {
        username: '',
        password: ''
      },
      registerForm: {
        username: '',
        email: '',
        password: ''
      },
      errors: {
        username: '',
        password: '',
        login: '',
        regUsername: '',
        email: '',
        regPassword: '',
        register: ''
      }
    }
  },
  methods: {
    toggleAuthMode() {
      this.showLoginForm = !this.showLoginForm
      this.clearErrors()
    },

    clearErrors() {
      // 使用Vue的响应式更新方式
      this.errors = Object.assign({}, {
        username: '',
        password: '',
        login: '',
        regUsername: '',
        email: '',
        regPassword: '',
        register: ''
      })
    },

    validateLoginForm() {
      let isValid = true
      this.clearErrors()

      if (!this.loginForm.username.trim()) {
        this.errors.username = '请输入用户名'
        isValid = false
      }

      if (!this.loginForm.password) {
        this.errors.password = '请输入密码'
        isValid = false
      }

      return isValid
    },

    validateRegisterForm() {
      let isValid = true
      this.clearErrors()

      if (!this.registerForm.username.trim()) {
        this.errors.regUsername = '请输入用户名'
        isValid = false
      }

      if (!this.registerForm.email.trim()) {
        this.errors.email = '请输入邮箱'
        isValid = false
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.registerForm.email)) {
        this.errors.email = '请输入有效的邮箱地址'
        isValid = false
      }

      if (!this.registerForm.password) {
        this.errors.regPassword = '请输入密码'
        isValid = false
      } else if (this.registerForm.password.length < 6) {
        this.errors.regPassword = '密码长度至少为6位'
        isValid = false
      }

      return isValid
    },

    async handleLogin() {
      console.log(this.loginForm.username, this.loginForm.password)

      // 重置错误信息
      if (!this.validateLoginForm()) return

      // 确保错误消息为空
      this.errors.login = ''

      try {
        await login(this.loginForm.username, this.loginForm.password)
        // 登录成功，跳转到首页
        this.$router.push('/home')
      } catch (error) {
        console.log("error", error)
        console.error('登录视图捕获到错误:', error)

        // 设置错误消息
        if (error && typeof error === 'object') {
          this.errors.login = error.message || '登录失败，请稍后再试'
        } else {
          this.errors.login = '登录过程中发生未知错误'
        }

        // 设置定时器，3秒后自动清除错误消息
        setTimeout(() => {
          this.errors.login = ''
        }, 3000)
      } finally {
        this.isLoading = false
      }
    },

    async handleRegister() {
      if (!this.validateRegisterForm()) return

      this.isLoading = true
      // 重置错误信息
      this.errors.register = ''

      try {
        await register(
          this.registerForm.username,
          this.registerForm.email,
          this.registerForm.password
        )

        // 注册成功，切换到登录表单
        this.showLoginForm = true
        this.loginForm.username = this.registerForm.username
        this.loginForm.password = ''

        // 清空注册表单
        this.registerForm = {
          username: '',
          email: '',
          password: ''
        }

        alert('注册成功，请登录')
      } catch (error) {
        console.error('注册视图捕获到错误:', error)
        if (error && typeof error === 'object') {
          this.errors.register = error.message || '注册失败，请稍后再试'
        } else {
          this.errors.register = '注册过程中发生未知错误'
        }

        // 设置定时器，3秒后自动清除错误消息
        setTimeout(() => {
          this.errors.register = ''
        }, 3000)
      } finally {
        this.isLoading = false
      }
    }
  }
}
</script>

<style scoped>
.login-container {
  width: 85%;
  max-width: 360px;
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 12px;
  padding: 25px;
  margin-top: 20px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.login-form {
  width: 100%;
}

.form-group {
  margin-bottom: 16px;
}

label {
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  color: #333;
  text-align: left;
  font-weight: 500;
}

input {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 15px;
  background-color: white;
}

.input-error {
  border-color: #ff4d4f;
}

.login-error-container {
  margin-top: 16px;
  width: 100%;
}

.error-message {
  color: #ff4d4f;
  font-size: 13px;
  margin-top: 4px;
  text-align: left;
}

.login-error {
  text-align: center;
  background-color: rgba(255, 77, 79, 0.1);
  border-radius: 4px;
  padding: 8px;
  font-weight: 500;
  border-left: 3px solid #ff4d4f;
}

.login-actions {
  margin-top: 24px;
}

.auth-toggle {
  margin-top: 16px;
  font-size: 14px;
  color: #666;
}

.auth-toggle a {
  color: var(--primary-color);
  text-decoration: none;
  font-weight: 500;
  margin-left: 5px;
}

/* 过渡动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 针对welcome-screen的样式修改 */
.welcome-screen {
  padding: 20px;
  background: linear-gradient(135deg, #5e72e4 0%, #825ee4 100%);
}

.logo {
  color: white;
}

.welcome-title {
  margin-top: 10px;
}
</style>