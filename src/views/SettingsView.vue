<template>
  <div class="content">
    <div class="header">
      <h1>设置</h1>
    </div>

    <div class="profile-header">
      <div class="profile-avatar">
        <i class="fas fa-user"></i>
      </div>
      <div class="profile-info">
        <h3 class="profile-name">{{ user ? user.username : '用户' }}</h3>
        <p class="profile-email">{{ user ? user.email : 'user@example.com' }}</p>
      </div>
      <i class="fas fa-chevron-right"></i>
    </div>

    <div class="settings-group">
      <h3>通用设置</h3>
      <div class="settings-list">
        <div class="settings-item">
          <div class="settings-icon">
            <i class="fas fa-bell"></i>
          </div>
          <div class="settings-info">
            <div class="settings-label">提醒</div>
            <div class="settings-description">每天 21:00</div>
          </div>
          <div class="settings-control">
            <i class="fas fa-chevron-right"></i>
          </div>
        </div>

        <div class="settings-item">
          <div class="settings-icon">
            <i class="fas fa-moon"></i>
          </div>
          <div class="settings-info">
            <div class="settings-label">深色模式</div>
          </div>
          <div class="settings-control">
            <label class="switch">
              <input type="checkbox" v-model="darkMode">
              <span class="slider round"></span>
            </label>
          </div>
        </div>

        <div class="settings-item">
          <div class="settings-icon">
            <i class="fas fa-font"></i>
          </div>
          <div class="settings-info">
            <div class="settings-label">字体大小</div>
            <div class="settings-description">默认</div>
          </div>
          <div class="settings-control">
            <i class="fas fa-chevron-right"></i>
          </div>
        </div>
      </div>
    </div>

    <div class="settings-group">
      <h3>数据与隐私</h3>
      <div class="settings-list">
        <div class="settings-item">
          <div class="settings-icon">
            <i class="fas fa-cloud-upload-alt"></i>
          </div>
          <div class="settings-info">
            <div class="settings-label">数据备份</div>
            <div class="settings-description">上次备份: 2023/10/12</div>
          </div>
          <div class="settings-control">
            <i class="fas fa-chevron-right"></i>
          </div>
        </div>

        <div class="settings-item">
          <div class="settings-icon">
            <i class="fas fa-lock"></i>
          </div>
          <div class="settings-info">
            <div class="settings-label">隐私保护</div>
          </div>
          <div class="settings-control">
            <i class="fas fa-chevron-right"></i>
          </div>
        </div>
      </div>
    </div>

    <div class="settings-group">
      <h3>关于</h3>
      <div class="settings-list">
        <div class="settings-item">
          <div class="settings-icon">
            <i class="fas fa-info-circle"></i>
          </div>
          <div class="settings-info">
            <div class="settings-label">版本</div>
            <div class="settings-description">1.0.0</div>
          </div>
        </div>

        <div class="settings-item">
          <div class="settings-icon">
            <i class="fas fa-question-circle"></i>
          </div>
          <div class="settings-info">
            <div class="settings-label">帮助与反馈</div>
          </div>
          <div class="settings-control">
            <i class="fas fa-chevron-right"></i>
          </div>
        </div>
      </div>
    </div>

    <button class="logout-button" @click="handleLogout">
      <i class="fas fa-sign-out-alt"></i>
      退出登录
    </button>
  </div>
</template>

<script>
import { logout, getCurrentUser } from '@/services/auth'

export default {
  name: 'SettingsView',
  data() {
    return {
      darkMode: false,
      user: null
    }
  },
  created() {
    // 获取当前用户信息
    this.user = getCurrentUser()
  },
  watch: {
    darkMode(newValue) {
      // 在实际应用中，这里会切换全局的深色/浅色主题
      console.log('深色模式:', newValue)
    }
  },
  methods: {
    handleLogout() {
      // 显示确认对话框
      if (confirm('确定要退出登录吗？')) {
        // 清除认证信息
        logout()
        // 跳转到登录页面
        this.$router.push('/')
      }
    }
  }
}
</script>

<style scoped>
.settings-group {
  margin-bottom: 30px;
}

.settings-group h3 {
  font-size: 14px;
  color: var(--dark-gray);
  margin-bottom: 10px;
  padding-left: 10px;
}

.settings-list {
  background-color: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.settings-item {
  display: flex;
  align-items: center;
  padding: 15px;
  border-bottom: 1px solid var(--light-gray);
}

.settings-item:last-child {
  border-bottom: none;
}

.settings-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background-color: var(--secondary-color);
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 15px;
}

.settings-icon i {
  font-size: 18px;
  color: var(--primary-color);
}

.settings-info {
  flex: 1;
}

.settings-label {
  font-size: 16px;
  margin-bottom: 2px;
}

.settings-description {
  font-size: 14px;
  color: var(--dark-gray);
}

.settings-control i {
  font-size: 16px;
  color: var(--dark-gray);
}

.profile-header {
  display: flex;
  align-items: center;
  background-color: white;
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 30px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.profile-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: var(--primary-color);
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 15px;
}

.profile-avatar i {
  font-size: 30px;
  color: white;
}

.profile-info {
  flex: 1;
}

.profile-name {
  font-size: 18px;
  margin-bottom: 5px;
}

.profile-email {
  font-size: 14px;
  color: var(--dark-gray);
}

.switch {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 24px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--light-gray);
  transition: .4s;
}

.slider:before {
  position: absolute;
  content: "";
  height: 20px;
  width: 20px;
  left: 2px;
  bottom: 2px;
  background-color: white;
  transition: .4s;
}

input:checked+.slider {
  background-color: var(--primary-color);
}

input:checked+.slider:before {
  transform: translateX(26px);
}

.slider.round {
  border-radius: 34px;
}

.slider.round:before {
  border-radius: 50%;
}

.logout-button {
  width: 100%;
  padding: 15px;
  border: none;
  background-color: white;
  border-radius: 12px;
  font-size: 16px;
  color: #e74c3c;
  margin-top: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.logout-button i {
  font-size: 18px;
}
</style>