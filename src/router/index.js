// 导入vue-router
import { createRouter, createWebHistory } from 'vue-router'

// 鉴权
import { useInfoStore } from '@/stores/info';
import { checkRole } from '@/utils/other.js'

import { ElMessage } from 'element-plus'

// 导入组件
import LoginVue from '@/views/Login.vue'
import LayoutVue from '@/views/public/MyLayout.vue'
import DashBoardVue from '@/views/Dashboard.vue'
import AdminVue from '@/views/Admin.vue'
import DealerVue from '@/views/Dealer.vue'
import UserVue from '@/views/User.vue'
import CarDetailVue from '@/views/CarDetail.vue'
import StockVue from '@/views/Stock.vue'
import OrderVue from '@/views/Order.vue'
import CommentVue from '@/views/Comment.vue'
import UpdateAvatarVue from '@/views/UpdateAvatar.vue'
import UpdatePasswordVue from '@/views/UpdatePassword.vue'
import InfoVue from '@/views/Info.vue'

// 定义路由关系
const routes = [
    { path: "/login", component: LoginVue, meta: { title: '登录' } },
    {
        path: "/",
        component: LayoutVue,
        redirect: '/dashboard',
        children: [
            { path: '/dashboard', component: DashBoardVue, meta: { isDealerAuth: true, title: '仪表盘' } },
            { path: '/admin', component: AdminVue, meta: { isAdminAuth: true, title: '管理员管理' } },
            { path: '/dealer', component: DealerVue, meta: { isAdminAuth: true, title: '经销商管理' } },
            { path: '/user', component: UserVue, meta: { isAdminAuth: true, title: '用户管理' } },
            { path: '/carDetail', component: CarDetailVue, meta: { title: '汽车信息管理' } },
            { path: '/stock', component: StockVue, meta: { title: '库存管理' } },
            { path: '/order', component: OrderVue, meta: { title: '订单管理' } },
            { path: '/comment', component: CommentVue, meta: { title: '评论管理' } },
            { path: '/updateAvatar', component: UpdateAvatarVue, meta: { title: '修改头像' } },
            { path: '/updatePassword', component: UpdatePasswordVue, meta: { title: '修改密码' } },
            { path: '/info', component: InfoVue, meta: { title: '个人资料' } }
        ],
    },
]

// 创建路由实例
const router = createRouter({
    history: createWebHistory(),
    routes
})

router.beforeEach((to, from, next) => {
    const infoStore = useInfoStore()
    // 当前登录的角色
    const role = checkRole(infoStore.info)

    if (to.meta.isAdminAuth) {
        //需要管理员权限验证
        if (!role) {
            next()
        } else {
            ElMessage.error("请停止非法访问")
            next(from.path)
        }
    } else if (to.meta.isDealerAuth) {
        if (role) {
            next()
        } else {
            next('/admin')
        }
    } else {
        next()
    }
})

router.afterEach((to, from) => {
    document.title = "汽车试驾系统 | " + to.meta.title || "小羊试驾" // "demo"是默认名字
})

// 导出路由
export default router