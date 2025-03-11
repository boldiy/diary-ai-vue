<template>
  <router-link :to="'/edit/' + diary.id" class="diary-card">
    <div class="diary-date">{{ formattedDate }}</div>
    <h3 class="diary-title">{{ diary.title }}</h3>
    <p class="diary-preview">{{ diary.content }}</p>
    <div class="diary-footer">
      <div class="mood">
        <i :class="moodIcon.icon" :style="{ color: moodIcon.color }"></i>
        <span>{{ diary.mood }}</span>
      </div>
      <div class="tags">
        <span v-for="(tag, index) in diary.tags" :key="index" class="tag">{{ tag }}</span>
      </div>
    </div>
  </router-link>
</template>

<script>
export default {
  name: 'DiaryCard',
  props: {
    diary: {
      type: Object,
      required: true
    }
  },
  computed: {
    formattedDate() {
      const date = new Date(this.diary.date_value)
      const year = date.getFullYear()
      const month = date.getMonth() + 1
      const day = date.getDate()
      const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
      const weekday = weekdays[date.getDay()]
      return `${year}年${month}月${day}日 ${weekday}`
    },
    moodIcon() {
      const moodIcons = {
        '开心': { icon: 'fas fa-laugh-beam', color: '#f1c40f' },
        '愉快': { icon: 'fas fa-smile', color: '#f1c40f' },
        '平静': { icon: 'fas fa-meh', color: '#3498db' },
        '难过': { icon: 'fas fa-frown', color: '#9b59b6' },
        '生气': { icon: 'fas fa-angry', color: '#e74c3c' }
      }
      return moodIcons[this.diary.mood] || { icon: 'fas fa-meh', color: '#95a5a6' }
    }
  }
}
</script>

<style scoped>
/* 日记卡片样式会从全局样式表中继承 */
</style>