// 导入vue-router
import { createRouter, createWebHistory } from 'vue-router'

// 导入组件
import LoginVue from '@/views/Login.vue'
import LayoutVue from '@/views/public/MyLayout.vue'
import DashBoardVue from '@/views/Dashboard.vue'
import AdminVue from '@/views/Admin.vue'
import DealerVue from '@/views/Dealer.vue'
import UserVue from '@/views/User.vue'
import CarDetailVue from '@/views/CarDetail.vue'
import OrderVue from '@/views/Order.vue'
import CommentVue from '@/views/Comment.vue'
import UpdateAvatarVue from '@/views/UpdateAvatar.vue'
import UpdatePasswordVue from '@/views/UpdatePassword.vue'

// 定义路由关系
const routes = [
    { path: "/login", component: LoginVue },
    {
        path: "/",
        component: LayoutVue,
        redirect: '/dashboard',
        children: [
            { path: '/dashboard', component: DashBoardVue },
            { path: '/admin', component: AdminVue },
            { path: '/dealer', component: DealerVue },
            { path: '/user', component: UserVue },
            { path: '/carDetail', component: CarDetailVue },
            { path: '/order', component: OrderVue },
            { path: '/comment', component: CommentVue },
            { path: '/updateAvatar', component: UpdateAvatarVue },
            { path: '/updatePassword', component: UpdatePasswordVue },
        ],
    },
]

// 创建路由实例
const router = createRouter({
    history: createWebHistory(),
    routes
})

// 导出路由
export default router