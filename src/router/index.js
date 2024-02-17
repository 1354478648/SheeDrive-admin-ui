// 导入vue-router
import { createRouter, createWebHistory } from 'vue-router'

// 导入组件
import LoginVue from '@/views/Login.vue'
import LayoutVue from '@/views/public/MyLayout.vue'
import DashBoardVue from '@/views/Dashboard.vue'

// 定义路由关系
const routes = [
    { path: "/login", component: LoginVue },
    { path: "/", component: LayoutVue },
]

// 创建路由实例
const router = createRouter({
    history: createWebHistory(),
    routes
})

// 导出路由
export default router