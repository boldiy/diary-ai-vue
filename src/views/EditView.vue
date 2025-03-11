<template>
  <div class="content">
    <div class="editor-header">
      <router-link to="/home"><i class="fas fa-arrow-left"></i></router-link>
      <div class="page-title">{{ isCreateMode ? '新建日记' : '编辑日记' }}</div>
      <div class="editor-actions">
        <a href="#" @click.prevent="saveDiary" :class="{ 'disabled': isSaving }">
          <i class="fas fa-spinner fa-spin" v-if="isSaving"></i>
          <i class="far fa-save" v-else></i>
        </a>
        <a href="#" @click.prevent="deleteDiary" :class="{ 'disabled': isSaving }">
          <i class="fas fa-trash"></i>
        </a>
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
      <router-link to="/home" class="back-button">
        <i class="fas fa-arrow-left"></i> 返回首页
      </router-link>
    </div>

    <div v-else>
      <div class="editor-title">
        <input type="text" placeholder="日记标题" v-model="diary.title">
      </div>

      <div class="diary-date">
        <div class="date-icon">
          <i class="far fa-calendar-alt"></i>
        </div>
        <input type="date" id="diary-date" v-model="diary.date_value" @change="handleDateChange">
      </div>

      <div class="editor-content">
        <textarea placeholder="今天发生了什么？写下你的想法..." v-model="diary.content"></textarea>
      </div>

      <div class="mood-selector">
        <div v-for="(mood, index) in moods" :key="index" class="mood-option"
          :class="{ selected: diary.mood === mood.name }" @click="selectMood(mood.name)">
          <i :class="mood.icon"></i>
          <span>{{ mood.name }}</span>
        </div>
      </div>

      <div class="editor-tools">
        <div class="tool-button">
          <i class="fas fa-image"></i>
        </div>
        <div class="tool-button">
          <i class="fas fa-microphone"></i>
        </div>
        <div class="tool-button">
          <i class="fas fa-map-marker-alt"></i>
        </div>
        <div class="tool-button" @click="showTagInput = !showTagInput">
          <i class="fas fa-tag"></i>
        </div>
        <div class="tool-button">
          <i class="fas fa-lock"></i>
        </div>
        <div class="tool-button">
          <i class="fas fa-palette"></i>
        </div>
      </div>

      <div class="tag-input" v-if="showTagInput">
        <input type="text" placeholder="添加标签，按回车确认" v-model="newTag" @keyup.enter="addTag">
        <div class="current-tags">
          <div v-for="(tag, index) in diary.tags" :key="index" class="tag">
            {{ tag }}
            <i class="fas fa-times" @click="removeTag(index)"></i>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getDiary, createDiary, updateDiary, deleteDiary } from '@/services/diary'

export default {
  name: 'EditView',
  data() {
    // 获取当前日期，格式为YYYY-MM-DD
    const today = new Date().toISOString().split('T')[0]

    return {
      diary: {
        id: null,
        title: '',
        content: '',
        date_value: today,
        mood: '愉快',
        tags: []
      },
      moods: [
        { name: '开心', icon: 'fas fa-laugh-beam' },
        { name: '愉快', icon: 'fas fa-smile' },
        { name: '平静', icon: 'fas fa-meh' },
        { name: '难过', icon: 'fas fa-frown' },
        { name: '生气', icon: 'fas fa-angry' }
      ],
      showTagInput: false,
      newTag: '',
      isLoading: false,
      error: null,
      isSaving: false,
      isCreateMode: true,
      dateChanged: false
    }
  },
  created() {
    // 如果是编辑模式，根据ID获取日记数据
    const id = this.$route.params.id
    if (id) {
      this.isCreateMode = false
      this.loadDiary(id)
    } else {
      this.isLoading = false
      this.isCreateMode = true
    }
  },
  methods: {
    async loadDiary(id) {
      this.isLoading = true
      this.error = null

      try {
        const response = await getDiary(id)
        console.log('获取到的日记详情:', response)

        // 处理API返回的可能嵌套结构
        if (response) {
          let diaryData = null;

          // 如果返回的是 { diary: {...} } 结构
          if (response.diary) {
            diaryData = { ...response.diary };
          }
          // 如果返回的直接是日记对象
          else if (response.id) {
            diaryData = { ...response };
          }

          if (diaryData) {
            // 从created_at映射到date_value (如果API返回的是created_at)
            if (diaryData.created_at && !diaryData.date_value) {
              diaryData.date_value = diaryData.created_at;
              delete diaryData.created_at;
            }

            // 处理日期格式，确保date_value为YYYY-MM-DD格式
            if (diaryData.date_value) {
              // 尝试转换日期格式
              try {
                const dateObj = new Date(diaryData.date_value);
                if (!isNaN(dateObj.getTime())) {
                  diaryData.date_value = dateObj.toISOString().split('T')[0];
                }
              } catch (err) {
                console.warn('日期转换失败:', err);
                // 保持原始格式
              }
            }

            // 确保tags是数组
            if (!Array.isArray(diaryData.tags)) {
              diaryData.tags = diaryData.tags ? [diaryData.tags] : [];
            }

            this.diary = diaryData;
          } else {
            this.error = '无法识别的日记数据格式';
            console.error('无法识别的日记数据格式:', response);
          }
        } else {
          this.error = '未找到日记数据'
        }
      } catch (error) {
        console.error(`获取日记#${id}失败:`, error)
        this.error = error.message || '获取日记详情失败，请稍后再试'
      } finally {
        this.isLoading = false
      }
    },
    selectMood(mood) {
      this.diary.mood = mood
    },
    addTag() {
      if (this.newTag.trim() && !this.diary.tags.includes(this.newTag.trim())) {
        this.diary.tags.push(this.newTag.trim())
        this.newTag = ''
      }
    },
    removeTag(index) {
      this.diary.tags.splice(index, 1)
    },
    handleDateChange(event) {
      console.log('日期已更改为:', this.diary.date_value)
      this.dateChanged = true
    },
    async saveDiary() {
      if (!this.validateDiary()) {
        return
      }

      // this.isSaving = true

      try {
        // 准备要保存的日记数据
        const diaryData = {
          title: this.diary.title,
          content: this.diary.content,
          date_value: this.diary.date_value,
          mood: this.diary.mood,
          tags: this.diary.tags
        }

        // 确保日期转换为API期望的格式
        if (diaryData.date_value) {
          // 尝试确保日期格式正确
          try {
            // 如果日期被修改过或者是新建模式，使用选择的日期
            // 否则可能需要去掉这个字段，让后端保持原有日期
            if (!this.dateChanged && !this.isCreateMode) {
              console.log('使用原始日期')
            } else {
              // 确保格式正确
              const dateObj = new Date(diaryData.date_value);
              if (!isNaN(dateObj.getTime())) {
                // 使用ISO格式，API可能需要这种格式
                diaryData.date_value = dateObj.toISOString().split('T')[0];
              }
              console.log('格式化后的日期:', diaryData.date_value)
            }
          } catch (err) {
            console.warn('日期格式化失败:', err);
          }
        }

        console.log('准备保存的日记数据:', diaryData)

        let response
        if (this.diary.id) {
          // 更新现有日记
          response = await updateDiary(this.diary.id, diaryData)
        } else {
          // 创建新日记
          response = await createDiary(diaryData)
        }

        console.log('保存日记返回结果:', response)
        alert('日记已保存！')
        this.$router.push('/home')
      } catch (error) {
        console.error('保存日记失败:', error)
        alert(`保存失败: ${error.message || '请稍后再试'}`)
      } finally {
        // this.isSaving = false
      }
    },
    async deleteDiary() {
      if (!this.diary.id) {
        alert('无法删除未保存的日记');
        return;
      }

      if (!confirm('确定要删除这篇日记吗？')) {
        return;
      }

      this.isSaving = true;
      try {
        await deleteDiary(this.diary.id);
        alert('日记已删除');
        this.$router.push('/home');
      } catch (error) {
        console.error('删除日记失败:', error);
        alert(`删除失败: ${error.message || '请稍后再试'}`);
      } finally {
        this.isSaving = false;
      }
    },
    validateDiary() {
      // 简单验证
      if (!this.diary.title.trim()) {
        alert('请输入日记标题')
        return false
      }
      if (!this.diary.content.trim()) {
        alert('请输入日记内容')
        return false
      }
      return true
    }
  }
}
</script>

<style scoped>
.tag-input {
  margin-top: 15px;
  padding: 10px;
  background-color: #f8f9fa;
  border-radius: 8px;
}

.tag-input input {
  width: 100%;
  padding: 8px;
  border: 1px solid var(--light-gray);
  border-radius: 4px;
}

.current-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 10px;
}

.current-tags .tag {
  display: flex;
  align-items: center;
  gap: 5px;
  background-color: var(--secondary-color);
  color: var(--dark-gray);
  padding: 5px 10px;
  border-radius: 50px;
  font-size: 12px;
}

.current-tags .tag i {
  cursor: pointer;
  font-size: 10px;
}

/* 加载和错误状态样式 */
.loading-container,
.error-container {
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
.error-icon {
  font-size: 40px;
  margin-bottom: 16px;
  color: #5e72e4;
}

.error-icon {
  color: #e74c3c;
}

.back-button {
  margin-top: 16px;
  padding: 8px 16px;
  background-color: #5e72e4;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  text-decoration: none;
  transition: background-color 0.3s;
}

.back-button:hover {
  background-color: #4a5abb;
}

/* 禁用按钮样式 */
.disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* 页面标题样式 */
.editor-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.page-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

/* 优化日期输入样式 */
.diary-date {
  margin: 12px 0;
  display: flex;
  align-items: center;
  position: relative;
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 8px;
}

.date-icon {
  margin-right: 10px;
  color: #5e72e4;
  font-size: 16px;
}

.diary-date input {
  border: none;
  background: transparent;
  flex-grow: 1;
  padding: 8px 0;
  font-size: 15px;
  color: #333;
  outline: none;
}

.diary-date input::-webkit-calendar-picker-indicator {
  cursor: pointer;
  opacity: 0.6;
}

.diary-date input::-webkit-calendar-picker-indicator:hover {
  opacity: 1;
}
</style>