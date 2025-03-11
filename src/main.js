import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// 导入Bootstrap样式
import 'bootstrap/dist/css/bootstrap.min.css'
import './assets/css/styles.css'

// 导入FontAwesome图标库 - 完整导入
import '@fortawesome/fontawesome-free/js/fontawesome.js'
import '@fortawesome/fontawesome-free/js/solid.js'
import '@fortawesome/fontawesome-free/js/regular.js'
import '@fortawesome/fontawesome-free/js/brands.js'
import '@fortawesome/fontawesome-free/css/all.min.css'

const app = createApp(App)



app.use(router)
app.mount('#app')
