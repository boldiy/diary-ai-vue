<template>
  <div class="content">
    <div class="header">
      <h1>我的日记</h1>
      <div class="header-actions">
        <router-link to="/search"><i class="fas fa-search"></i></router-link>
        <i class="fas fa-sliders-h"></i>
      </div>
    </div>

    <!-- 加载状态 -->
    <div v-if="isLoading" class="loading-container">
      <div class="spinner">
        <i class="fas fa-spinner fa-spin"></i>
      </div>
      <p>正在加载日记...</p>
    </div>

    <!-- 错误提示 -->
    <div v-else-if="error" class="error-container">
      <div class="error-icon">
        <i class="fas fa-exclamation-circle"></i>
      </div>
      <p>{{ error }}</p>
      <button @click="fetchDiaries" class="retry-button">
        <i class="fas fa-redo"></i> 重试
      </button>
    </div>

    <!-- 日记列表为空 -->
    <div v-else-if="diaries.length === 0" class="empty-container">
      <div class="empty-icon">
        <i class="fas fa-book"></i>
      </div>
      <p>暂无日记，点击右下角按钮开始创建</p>
    </div>

    <!-- 日记列表 -->
    <DiaryCard v-else v-for="diary in diaries" :key="diary.id" :diary="diary" />

    <!-- 添加按钮 -->
    <router-link to="/edit">
      <div
        style="position: fixed; bottom: 80px; right: 20px; z-index: 100; display: flex; justify-content: center; align-items: center; width: 60px; height: 60px; border-radius: 50%; background-color: #5e72e4; color: white; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);">
        <span style="font-size: 24px; font-weight: bold;color: white;"><i class="fas fa-plus"></i></span>
      </div>
    </router-link>
  </div>
</template>

<script>
import DiaryCard from '@/components/DiaryCard.vue'
import IconTest from '@/components/IconTest.vue'
import { getAllDiaries } from '@/services/diary'

export default {
  name: 'HomeView',
  components: {
    DiaryCard,
    IconTest
  },
  data() {
    return {
      diaries: [],
      isLoading: false,
      error: null
    }
  },
  created() {
    this.fetchDiaries()
  },
  methods: {
    async fetchDiaries() {
      this.isLoading = true
      this.error = null

      try {
        this.diaries = await getAllDiaries()
        this.diaries = this.diaries.diaries
        console.log('获取到的日记列表:', this.diaries)
      } catch (error) {
        console.error('获取日记列表失败:', error)
        this.error = error.message || '获取日记列表失败，请稍后再试'
      } finally {
        this.isLoading = false
      }
    }
  }
}
</script>

<style scoped>
/* 主页样式会从全局样式表中继承 */
.loading-container,
.error-container,
.empty-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 30px 0;
  text-align: center;
  min-height: 200px;
  color: #666;
}

.spinner,
.error-icon,
.empty-icon {
  font-size: 40px;
  margin-bottom: 16px;
  color: #5e72e4;
}

.error-icon {
  color: #e74c3c;
}

.retry-button {
  margin-top: 16px;
  padding: 8px 16px;
  background-color: #5e72e4;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.retry-button:hover {
  background-color: #4a5abb;
}

.empty-container p {
  color: #95a5a6;
  font-size: 16px;
}
</style>