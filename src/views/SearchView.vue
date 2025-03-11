<template>
  <div class="content">
    <div class="search-header">
      <router-link to="/home"><i class="fas fa-arrow-left"></i></router-link>
      <div class="search-input">
        <i class="fas fa-search"></i>
        <input type="text" placeholder="搜索日记..." v-model="searchQuery" @input="search">
      </div>
    </div>

    <div class="filters">
      <div 
        v-for="(filter, index) in filters" 
        :key="index"
        class="filter"
        :class="{ active: activeFilter === filter }"
        @click="setFilter(filter)"
      >
        {{ filter }}
      </div>
    </div>

    <div v-if="searchResults.length > 0">
      <DiaryCard v-for="diary in searchResults" :key="diary.id" :diary="diary" />
    </div>

    <div v-else-if="searchQuery" class="no-results">
      <i class="fas fa-search"></i>
      <p>未找到匹配"{{ searchQuery }}"的结果</p>
    </div>

    <div v-else class="search-tips">
      <h3>搜索提示</h3>
      <p>可以搜索日记标题、内容或标签</p>
      <div class="recent-searches" v-if="recentSearches.length > 0">
        <h4>最近搜索</h4>
        <div class="recent-search-list">
          <div 
            v-for="(term, index) in recentSearches" 
            :key="index"
            class="recent-search-item"
            @click="searchQuery = term; search()"
          >
            <i class="fas fa-history"></i>
            <span>{{ term }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import DiaryCard from '@/components/DiaryCard.vue'

export default {
  name: 'SearchView',
  components: {
    DiaryCard
  },
  data() {
    return {
      searchQuery: '',
      activeFilter: '全部',
      filters: ['全部', '标题', '内容', '标签', '心情'],
      recentSearches: ['旅行', '工作', '读书'],
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
      searchResults: []
    }
  },
  methods: {
    search() {
      if (!this.searchQuery.trim()) {
        this.searchResults = []
        return
      }
      
      const query = this.searchQuery.toLowerCase()
      
      // 根据过滤条件进行搜索
      switch (this.activeFilter) {
        case '标题':
          this.searchResults = this.diaries.filter(diary => 
            diary.title.toLowerCase().includes(query)
          )
          break
        case '内容':
          this.searchResults = this.diaries.filter(diary => 
            diary.content.toLowerCase().includes(query)
          )
          break
        case '标签':
          this.searchResults = this.diaries.filter(diary => 
            diary.tags.some(tag => tag.toLowerCase().includes(query))
          )
          break
        case '心情':
          this.searchResults = this.diaries.filter(diary => 
            diary.mood.toLowerCase().includes(query)
          )
          break
        default: // 全部
          this.searchResults = this.diaries.filter(diary => 
            diary.title.toLowerCase().includes(query) ||
            diary.content.toLowerCase().includes(query) ||
            diary.tags.some(tag => tag.toLowerCase().includes(query)) ||
            diary.mood.toLowerCase().includes(query)
          )
      }
      
      // 添加到最近搜索（实际应用中还需要去重和限制长度）
      if (this.searchQuery.trim() && !this.recentSearches.includes(this.searchQuery)) {
        this.recentSearches.unshift(this.searchQuery)
        if (this.recentSearches.length > 5) {
          this.recentSearches.pop()
        }
      }
    },
    setFilter(filter) {
      this.activeFilter = filter
      this.search()
    }
  }
}
</script>

<style scoped>
.search-header {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 20px;
}

.search-header i {
  font-size: 20px;
  color: var(--dark-gray);
}

.search-input {
  flex: 1;
  display: flex;
  align-items: center;
  background-color: var(--secondary-color);
  border-radius: 50px;
  padding: 8px 15px;
}

.search-input i {
  color: var(--dark-gray);
  margin-right: 10px;
}

.search-input input {
  flex: 1;
  border: none;
  background: transparent;
  outline: none;
  font-size: 16px;
}

.filters {
  display: flex;
  gap: 10px;
  overflow-x: auto;
  margin-bottom: 20px;
  padding-bottom: 10px;
}

.filter {
  padding: 6px 12px;
  background-color: white;
  border: 1px solid var(--light-gray);
  border-radius: 50px;
  font-size: 14px;
  cursor: pointer;
  white-space: nowrap;
}

.filter.active {
  background-color: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
}

.no-results {
  margin-top: 40px;
  text-align: center;
  color: var(--dark-gray);
}

.no-results i {
  font-size: 40px;
  margin-bottom: 10px;
  opacity: 0.5;
}

.search-tips {
  margin-top: 30px;
}

.search-tips h3 {
  font-size: 18px;
  margin-bottom: 10px;
}

.search-tips p {
  color: var(--dark-gray);
  margin-bottom: 20px;
}

.recent-searches h4 {
  font-size: 16px;
  margin-bottom: 10px;
  color: var(--dark-gray);
}

.recent-search-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.recent-search-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 0;
  cursor: pointer;
  border-bottom: 1px solid var(--light-gray);
}

.recent-search-item i {
  color: var(--dark-gray);
}
</style> 