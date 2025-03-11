<template>
  <div class="icon-test">
    <h2>图标测试</h2>
    <div class="icon-grid">
      <div class="icon-item">
        <i class="fas fa-home"></i>
        <span>fa-home</span>
      </div>
      <div class="icon-item">
        <i class="fas fa-user"></i>
        <span>fa-user</span>
      </div>
      <div class="icon-item">
        <i class="fas fa-cog"></i>
        <span>fa-cog</span>
      </div>
      <div class="icon-item">
        <i class="fas fa-book"></i>
        <span>fa-book</span>
      </div>
      <div class="icon-item">
        <i class="fas fa-calendar-alt"></i>
        <span>fa-calendar-alt</span>
      </div>
      <div class="icon-item">
        <i class="fas fa-chart-bar"></i>
        <span>fa-chart-bar</span>
      </div>
      <div class="icon-item">
        <i class="fas fa-wifi"></i>
        <span>fa-wifi</span>
      </div>
      <div class="icon-item">
        <i class="fas fa-signal"></i>
        <span>fa-signal</span>
      </div>
      <div class="icon-item">
        <i class="fas fa-battery-full"></i>
        <span>fa-battery-full</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'IconTest'
}
</script>

<style scoped>
.icon-test {
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 8px;
  margin: 20px 0;
}

h2 {
  margin-bottom: 20px;
  text-align: center;
}

.icon-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
}

.icon-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 15px;
  background-color: white;
  border-radius: 6px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.icon-item i {
  font-size: 24px;
  margin-bottom: 8px;
  color: var(--primary-color, #5e72e4);
}

.icon-item span {
  font-size: 12px;
  color: #666;
}
</style> 