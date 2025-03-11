<template>
  <div class="content">
    <div class="header">
      <h1>统计</h1>
      <div class="header-actions">
        <i class="fas fa-calendar-alt"></i>
      </div>
    </div>

    <div class="stats-period">
      <div class="period-selector">
        <button 
          v-for="(period, index) in periods" 
          :key="index"
          :class="{ active: selectedPeriod === period }"
          @click="selectedPeriod = period"
        >
          {{ period }}
        </button>
      </div>
    </div>

    <div class="stats-card">
      <div class="stats-header">
        <h3 class="stats-title">写作统计</h3>
      </div>
      <div class="stats-content">
        <div class="stats-item">
          <div class="stats-label">日记总数</div>
          <div class="stats-value">{{ diaryStats.total }}</div>
        </div>
        <div class="stats-item">
          <div class="stats-label">字数总计</div>
          <div class="stats-value">{{ diaryStats.wordCount }}</div>
        </div>
        <div class="stats-item">
          <div class="stats-label">写作天数</div>
          <div class="stats-value">{{ diaryStats.days }}</div>
        </div>
        <div class="stats-item">
          <div class="stats-label">连续天数</div>
          <div class="stats-value">{{ diaryStats.streak }}</div>
        </div>
      </div>
    </div>

    <div class="stats-card">
      <div class="stats-header">
        <h3 class="stats-title">情绪分布</h3>
      </div>
      <div ref="moodChart" class="mood-chart"></div>
    </div>

    <div class="stats-card">
      <div class="stats-header">
        <h3 class="stats-title">常用标签</h3>
      </div>
      <div class="top-tags">
        <div v-for="(tag, index) in topTags" :key="index" class="top-tag">
          <span>{{ tag.name }}</span>
          <div class="tag-bar" :style="{ width: tag.percentage + '%' }"></div>
          <span>{{ tag.count }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Chart from 'chart.js/auto'

export default {
  name: 'StatisticsView',
  data() {
    return {
      selectedPeriod: '本月',
      periods: ['本周', '本月', '今年', '全部'],
      diaries: [
        {
          id: 1,
          date: '2023-10-15',
          title: '快乐的周末',
          content: '今天和朋友去了久违的海边，阳光很好，海风很舒服。我们在沙滩上玩了一整天，像小孩子一样无忧无虑...',
          mood: '开心',
          tags: ['旅行', '朋友']
        },
        {
          id: 2,
          date: '2023-10-13',
          title: '工作总结',
          content: '这一周工作很充实，完成了两个重要项目的初步设计。团队合作非常顺利，虽然有些累但很有成就感...',
          mood: '平静',
          tags: ['工作', '总结']
        },
        {
          id: 3,
          date: '2023-10-10',
          title: '阅读感悟',
          content: '今天读完了《活着》这本书，余华的文字真的很有力量。生命的意义或许就在于经历这些悲欢离合...',
          mood: '难过',
          tags: ['阅读', '感悟']
        },
        {
          id: 4,
          date: '2023-10-05',
          title: '生日聚会',
          content: '今天是朋友的生日，我们在一家餐厅聚会庆祝。很久没见的老朋友们都来了，聊了很多近况...',
          mood: '开心',
          tags: ['生日', '朋友', '聚会']
        },
        {
          id: 5,
          date: '2023-10-01',
          title: '国庆假期计划',
          content: '终于迎来了国庆假期，计划了很多活动。首先想去郊外爬山，然后拜访几个朋友，最后安排一天在家休息...',
          mood: '愉快',
          tags: ['假期', '计划']
        }
      ],
      moodChart: null
    }
  },
  computed: {
    diaryStats() {
      return {
        total: this.diaries.length,
        wordCount: this.diaries.reduce((count, diary) => count + diary.content.length, 0),
        days: new Set(this.diaries.map(diary => diary.date)).size,
        streak: 3 // 假设连续写作天数
      }
    },
    topTags() {
      // 计算所有标签和它们的出现次数
      const tagCount = {}
      this.diaries.forEach(diary => {
        diary.tags.forEach(tag => {
          tagCount[tag] = (tagCount[tag] || 0) + 1
        })
      })
      
      // 转换为数组并排序
      const sortedTags = Object.keys(tagCount).map(tag => ({
        name: tag,
        count: tagCount[tag]
      })).sort((a, b) => b.count - a.count)
      
      // 计算百分比
      const maxCount = sortedTags.length > 0 ? sortedTags[0].count : 0
      sortedTags.forEach(tag => {
        tag.percentage = (tag.count / maxCount) * 100
      })
      
      // 返回前5个标签
      return sortedTags.slice(0, 5)
    },
    moodDistribution() {
      const moodCount = {}
      this.diaries.forEach(diary => {
        moodCount[diary.mood] = (moodCount[diary.mood] || 0) + 1
      })
      
      const moods = ['开心', '愉快', '平静', '难过', '生气']
      return moods.map(mood => moodCount[mood] || 0)
    }
  },
  mounted() {
    this.renderMoodChart()
  },
  methods: {
    renderMoodChart() {
      if (this.moodChart) {
        this.moodChart.destroy()
      }
      
      const ctx = this.$refs.moodChart
      
      this.moodChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['开心', '愉快', '平静', '难过', '生气'],
          datasets: [{
            data: this.moodDistribution,
            backgroundColor: ['#f1c40f', '#2ecc71', '#3498db', '#9b59b6', '#e74c3c'],
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'right'
            }
          }
        }
      })
    }
  },
  watch: {
    selectedPeriod() {
      // 在实际应用中，这里会根据选择的时间段重新获取统计数据
      this.renderMoodChart()
    }
  }
}
</script>

<style scoped>
.stats-period {
  margin-bottom: 20px;
}

.period-selector {
  display: flex;
  gap: 10px;
  overflow-x: auto;
  padding-bottom: 10px;
}

.period-selector button {
  padding: 8px 16px;
  border: 1px solid var(--light-gray);
  background-color: white;
  border-radius: 50px;
  font-size: 14px;
  cursor: pointer;
  white-space: nowrap;
}

.period-selector button.active {
  background-color: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
}

.stats-card {
  background-color: white;
  border-radius: 12px;
  padding: 15px;
  margin-bottom: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.stats-content {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
  margin-top: 15px;
}

.stats-item {
  text-align: center;
}

.stats-label {
  font-size: 14px;
  color: var(--dark-gray);
  margin-bottom: 5px;
}

.stats-value {
  font-size: 24px;
  font-weight: 600;
  color: var(--primary-color);
}

.mood-chart {
  height: 200px;
  margin-top: 10px;
}

.top-tags {
  margin-top: 15px;
}

.top-tag {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  gap: 10px;
}

.top-tag span:first-child {
  width: 60px;
  font-size: 14px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.top-tag span:last-child {
  width: 20px;
  font-size: 14px;
  text-align: right;
}

.tag-bar {
  height: 8px;
  background-color: var(--primary-color);
  border-radius: 4px;
  flex-grow: 1;
}
</style> 