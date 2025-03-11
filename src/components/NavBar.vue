<template>
  <div class="nav-bar">
    <router-link to="/home" class="nav-item" :class="{ active: currentRoute === 'Home' }">
      <i class="fas fa-book" style="font-size: 24px;"></i>
      <span style="font-size: 12px; margin-top: 4px;">日记</span>
    </router-link>
    <router-link to="/calendar" class="nav-item" :class="{ active: currentRoute === 'Calendar' }">
      <i class="fas fa-calendar-alt" style="font-size: 24px;"></i>
      <span style="font-size: 12px; margin-top: 4px;">日历</span>
    </router-link>
    <router-link to="/statistics" class="nav-item" :class="{ active: currentRoute === 'Statistics' }">
      <i class="fas fa-chart-bar" style="font-size: 24px;"></i>
      <span style="font-size: 12px; margin-top: 4px;">统计</span>
    </router-link>
    <router-link to="/settings" class="nav-item" :class="{ active: currentRoute === 'Settings' }">
      <i class="fas fa-cog" style="font-size: 24px;"></i>
      <span style="font-size: 12px; margin-top: 4px;">设置</span>
    </router-link>
  </div>
</template>

<script>
export default {
  name: 'NavBar',
  computed: {
    currentRoute() {
      return this.$route.name
    }
  }
}
</script>

<style scoped>
/* 导航栏样式会从全局样式表中继承 */
</style>