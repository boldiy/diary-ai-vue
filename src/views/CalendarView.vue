<template>
  <div class="content">
    <div class="calendar-container">
      <div class="calendar-header">
        <h1>日历</h1>
        <div class="calendar-month">
          {{ currentYear }}年{{ currentMonth + 1 }}月
        </div>
        <div class="calendar-nav">
          <i class="fas fa-chevron-left" @click="prevMonth"></i>
          <i class="fas fa-chevron-right" @click="nextMonth"></i>
        </div>
      </div>

      <div class="calendar-grid">
        <div v-for="(day, index) in weekdays" :key="'day-' + index" class="weekday">
          {{ day }}
        </div>
        <div v-for="(date, index) in calendarDates" :key="'date-' + index" class="calendar-date" :class="{
          'has-entry': hasEntry(date),
          'today': isToday(date),
          'empty': !date,
          'selected': isSelectedDate(date)
        }" @click="date && viewDate(date)">
          <span v-if="date">{{ date.getDate() }}</span>
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
        <button @click="retryLoadDiaries" class="retry-button">
          <i class="fas fa-redo"></i> 重试
        </button>
      </div>

      <!-- 日记列表 -->
      <div v-else-if="selectedDate && selectedDateEntries.length > 0" class="diary-list">
        <h3 class="date-header">{{ formattedSelectedDate }}</h3>
        <DiaryCard v-for="diary in selectedDateEntries" :key="diary.id" :diary="diary" />
      </div>

      <!-- 空状态 -->
      <div v-else-if="selectedDate && !selectedDateEntries.length" class="empty-container">
        <p>{{ formattedSelectedDate }}还没有日记，现在写一篇？</p>
        <router-link :to="{ name: 'Edit', query: { date: selectedDateString } }" class="create-button">
          <i class="fas fa-pen"></i> 写日记
        </router-link>
      </div>

      <router-link :to="{ name: 'Edit', query: { date: selectedDateString } }" class="fab">
        <i class="fas fa-pen"></i>
      </router-link>
    </div>
  </div>
</template>

<script>
import DiaryCard from '@/components/DiaryCard.vue'
import { getDiariesByDate } from '@/services/diary'

export default {
  name: 'CalendarView',
  components: {
    DiaryCard
  },
  data() {
    return {
      currentDate: new Date(),
      currentYear: new Date().getFullYear(),
      currentMonth: new Date().getMonth(),
      selectedDate: null,
      weekdays: ['日', '一', '二', '三', '四', '五', '六'],
      selectedDateEntries: [],
      isLoading: false,
      error: null
    }
  },
  computed: {
    calendarDates() {
      const dates = []
      const firstDay = new Date(this.currentYear, this.currentMonth, 1)
      const lastDay = new Date(this.currentYear, this.currentMonth + 1, 0)

      // 填充上个月的日期
      for (let i = 0; i < firstDay.getDay(); i++) {
        dates.push(null)
      }

      // 填充当前月的日期
      for (let i = 1; i <= lastDay.getDate(); i++) {
        dates.push(new Date(this.currentYear, this.currentMonth, i))
      }

      // 如果总数不是7的倍数，添加下个月的日期占位
      while (dates.length % 7 !== 0) {
        dates.push(null)
      }

      return dates
    },
    formattedSelectedDate() {
      if (!this.selectedDate) return ''

      const year = this.selectedDate.getFullYear()
      const month = this.selectedDate.getMonth() + 1
      const day = this.selectedDate.getDate()
      const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
      const weekday = weekdays[this.selectedDate.getDay()]

      return `${year}年${month}月${day}日 ${weekday}`
    },
    selectedDateString() {
      return this.selectedDate ? this.selectedDate.toISOString().split('T')[0] : ''
    }
  },
  methods: {
    prevMonth() {
      if (this.currentMonth === 0) {
        this.currentYear--
        this.currentMonth = 11
      } else {
        this.currentMonth--
      }
      this.selectedDate = null
      this.selectedDateEntries = []
    },
    nextMonth() {
      if (this.currentMonth === 11) {
        this.currentYear++
        this.currentMonth = 0
      } else {
        this.currentMonth++
      }
      this.selectedDate = null
      this.selectedDateEntries = []
    },
    hasEntry(date) {
      if (!date) return false
      return this.selectedDateEntries.some(diary => {
        const diaryDate = new Date(diary.date_value)
        return diaryDate.getFullYear() === date.getFullYear() &&
          diaryDate.getMonth() === date.getMonth() &&
          diaryDate.getDate() === date.getDate()
      })
    },
    isToday(date) {
      if (!date) return false

      const today = new Date()
      return date.getFullYear() === today.getFullYear() &&
        date.getMonth() === today.getMonth() &&
        date.getDate() === today.getDate()
    },
    isSelectedDate(date) {
      if (!date || !this.selectedDate) return false
      return date.getFullYear() === this.selectedDate.getFullYear() &&
        date.getMonth() === this.selectedDate.getMonth() &&
        date.getDate() === this.selectedDate.getDate()
    },
    async viewDate(date) {
      this.selectedDate = date
      await this.loadDiaries()
    },
    async loadDiaries() {
      if (!this.selectedDate) return

      this.isLoading = true
      this.error = null

      try {
        const dateStr = this.selectedDate.toISOString().split('T')[0]
        const response = await getDiariesByDate(dateStr)
        this.selectedDateEntries = Array.isArray(response.diaries) ? response.diaries : []
      } catch (error) {
        console.error('加载日记失败:', error)
        this.error = error.message || '加载日记失败，请稍后再试'
        this.selectedDateEntries = []
      } finally {
        this.isLoading = false
      }
    },
    retryLoadDiaries() {
      this.loadDiaries()
    }
  }
}
</script>

<style scoped>
.calendar-container {
  max-width: 480px;
  margin: 0 auto;
}

.date-header {
  margin-top: 20px;
  margin-bottom: 10px;
  padding-bottom: 10px;
  border-bottom: 1px solid var(--light-gray);
  font-size: 16px;
  color: var(--dark-gray);
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 5px;
  margin-bottom: 30px;
}

/* 修改weekday样式使其与日期格子对齐 */
.calendar-grid .weekday {
  text-align: center;
  padding: 10px 0;
  font-size: 12px;
  font-weight: 600;
  color: var(--dark-gray);
}

.calendar-date {
  position: relative;
  width: 100%;
  padding-top: 100%;
  /* 创建正方形格子 */
}

.calendar-date.has-entry {
  background-color: var(--secondary-color, #f8d7da);
}

.calendar-date.today {
  background-color: var(--primary-color, #5e72e4);
  color: white;
}

.calendar-date span {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
}

.fab {
  position: fixed;
  bottom: 80px;
  right: 20px;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: #5e72e4;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  text-decoration: none;
  z-index: 10;
}

.fab i {
  font-size: 24px;
}

.loading-container,
.error-container,
.empty-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  text-align: center;
  color: #666;
}

.spinner {
  font-size: 24px;
  margin-bottom: 10px;
  color: #5e72e4;
}

.error-icon {
  color: #e74c3c;
  font-size: 24px;
  margin-bottom: 10px;
}

.retry-button,
.create-button {
  margin-top: 10px;
  padding: 8px 16px;
  background-color: #5e72e4;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  text-decoration: none;
  transition: background-color 0.3s;
}

.retry-button:hover,
.create-button:hover {
  background-color: #4a5abb;
}

.calendar-date.selected span {
  background-color: rgba(94, 114, 228, 0.1);
  border: 2px solid #5e72e4;
}

.empty-container p {
  color: #95a5a6;
  margin-bottom: 16px;
}
</style>