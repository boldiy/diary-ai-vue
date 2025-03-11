<script>
import NavBar from './components/NavBar.vue'

export default {
  name: 'App',
  components: {
    NavBar
  },
  data() {
    return {
      currentTime: '9:41',
      showStatusBar: false,
      showNavBar: true
    }
  },
  watch: {
    '$route'(to) {
      // 如果是登录页面，则不显示导航栏
      this.showNavBar = to.name !== 'Login'
    }
  },
  mounted() {
    this.updateCurrentTime()
    setInterval(this.updateCurrentTime, 60000) // 每分钟更新一次时间
  },
  methods: {
    updateCurrentTime() {
      const now = new Date()
      const hours = now.getHours().toString().padStart(2, '0')
      const minutes = now.getMinutes().toString().padStart(2, '0')
      this.currentTime = `${hours}:${minutes}`
    }
  }
}
</script>

<template>
  <div class="container">
    <router-view />
    <NavBar v-if="showNavBar" />
  </div>
</template>

<style>
/* 确保图标正常显示 */
.fas,
.fab,
.far {
  display: inline-block;
  font-style: normal;
  font-variant: normal;
  text-rendering: auto;
  line-height: 1;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-weight: 900;
  /* 针对solid图标 */
}

.far {
  font-weight: 400;
  /* 针对regular图标 */
}

/* 状态栏图标样式 */
.status-bar i {
  margin-left: 5px;
  font-size: 14px;
}

/* 全局样式会被放在assets文件夹中的CSS文件中 */
</style>
