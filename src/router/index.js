import { createRouter, createWebHistory } from 'vue-router'
import { isAuthenticated } from '@/services/auth'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'Login',
            component: () => import('../views/LoginView.vue')
        },
        {
            path: '/home',
            name: 'Home',
            component: () => import('../views/HomeView.vue'),
            meta: { requiresAuth: true }
        },
        {
            path: '/calendar',
            name: 'Calendar',
            component: () => import('../views/CalendarView.vue'),
            meta: { requiresAuth: true }
        },
        {
            path: '/statistics',
            name: 'Statistics',
            component: () => import('../views/StatisticsView.vue'),
            meta: { requiresAuth: true }
        },
        {
            path: '/settings',
            name: 'Settings',
            component: () => import('../views/SettingsView.vue'),
            meta: { requiresAuth: true }
        },
        {
            path: '/edit',
            name: 'Edit',
            component: () => import('../views/EditView.vue'),
            meta: { requiresAuth: true }
        },
        {
            path: '/edit/:id',
            name: 'EditDiary',
            component: () => import('../views/EditView.vue'),
            meta: { requiresAuth: true }
        },
        {
            path: '/search',
            name: 'Search',
            component: () => import('../views/SearchView.vue'),
            meta: { requiresAuth: true }
        }
    ]
})

// 全局前置守卫
router.beforeEach((to, from, next) => {
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth)

    // 如果路由需要认证但用户未登录，则重定向到登录页面
    if (requiresAuth && !isAuthenticated()) {
        next({ name: 'Login' })
    } else {
        // 如果用户已登录且尝试访问登录页面，则重定向到首页
        if (to.name === 'Login' && isAuthenticated()) {
            next({ name: 'Home' })
        } else {
            next() // 正常导航
        }
    }
})

export default router 