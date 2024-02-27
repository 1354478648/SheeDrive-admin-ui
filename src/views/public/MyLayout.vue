<script setup>
import MyFooter from '@/views/public/MyFooter.vue';
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import {
    Document,
    Menu as IconMenu,
    Setting,
} from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useInfoStore } from '@/stores/info';
import { useTokenStore } from '@/stores/token.js'
const infoStore = useInfoStore()
const tokenStore = useTokenStore()
const router = useRouter()
import { checkRole } from '@/utils/other.js'

// 当前登录的角色
const role = ref(checkRole(infoStore.info))

const avatar = ref(infoStore.info.avatar ? infoStore.info.avatar : 'src/assets/default_avatar.jpg')

const handleCommand = (command) => {
    //判断指令
    if (command === 'logout') {
        // 提示用户确认框
        ElMessageBox.confirm(
            '确认退出？',
            '提示',
            {
                confirmButtonText: '确认',
                cancelButtonText: '取消',
                type: 'warning',
            })
            //退出登录
            .then(() => {
                //清空pinia中存储的token及个人信息
                tokenStore.removeToken()
                infoStore.removeInfo()

                //跳转到登录页面
                router.push('/login')
                ElMessage.success('退出成功')
            })
            .catch(() => { })
    } else {
        //路由跳转
        router.push('/info')
    }
}

</script>

<template>
    <div class="el-menu-container">
        <el-menu router default-active="/dashboard" class="el-menu-vertical-demo">
            <div class="logo">
                <img style="width: 175px;" src="@/assets/title_SheeDrive.png" />
            </div>
            <el-divider border-style="dashed">
            </el-divider>
            <el-menu-item index="/dashboard" v-if="role">
                <el-icon>
                    <Odometer />
                </el-icon>
                <template #title>仪表盘</template>
            </el-menu-item>
            <el-menu-item index="/admin" v-if="!role">
                <el-icon>
                    <CoffeeCup />
                </el-icon>
                <template #title>管理员管理</template>
            </el-menu-item>
            <el-menu-item index="/dealer" v-if="!role">
                <el-icon>
                    <OfficeBuilding />
                </el-icon>
                <template #title>经销商管理</template>
            </el-menu-item>
            <el-menu-item index="/user" v-if="!role">
                <el-icon>
                    <User />
                </el-icon>
                <template #title>用户管理</template>
            </el-menu-item>
            <el-menu-item index="/carDetail">
                <el-icon>
                    <Van />
                </el-icon>
                <template #title>汽车管理</template>
            </el-menu-item>
            <el-menu-item index="/stock">
                <el-icon>
                    <Collection />
                </el-icon>
                <template #title>库存管理</template>
            </el-menu-item>
            <el-menu-item index="/order">
                <el-icon>
                    <Document />
                </el-icon>
                <template #title>订单管理</template>
            </el-menu-item>
            <el-menu-item index="/comment">
                <el-icon>
                    <ChatDotSquare />
                </el-icon>
                <template #title>评论管理</template>
            </el-menu-item>
            <el-sub-menu>
                <template #title>
                    <el-icon>
                        <Setting />
                    </el-icon>
                    <span>设置</span>
                </template>
                <el-menu-item-group title="请选择以下功能：">
                    <el-menu-item index="/updateAvatar">修改头像</el-menu-item>
                    <el-menu-item index="/updatePassword">修改密码</el-menu-item>
                </el-menu-item-group>
            </el-sub-menu>

        </el-menu>
        <div class="header">
            <div class="avatar">
                <el-dropdown @command="handleCommand">
                    <el-avatar :src="avatar" />
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item command="info">个人资料</el-dropdown-item>
                            <el-dropdown-item command="logout">退出登录</el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
            </div>
        </div>
    </div>
    <div class="content">
        <router-view></router-view>
    </div>
    <MyFooter />
</template>

<style lang="scss" scoped>
.el-menu-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 200px;
    height: 100%;
    z-index: 2;

    .el-menu-vertical-demo:not(.el-menu--collapse) {
        min-height: 100%;
        // background-color: rgba(255, 255, 255, 0.5);
        // backdrop-filter: blur(10px); // 毛玻璃效果
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);

        .logo {
            display: flex;
            justify-content: center;
            padding: 20px 0px 0px 0px;
        }
    }

    .header {
        position: fixed;
        top: 0;
        left: 200px;
        width: calc(100% - 200px);
        height: 60px;
        border-bottom: #dcdfe6 solid 0.5px;
        z-index: 2;
        background-color: rgba(255, 255, 255, 0.5);
        backdrop-filter: blur(10px); // 毛玻璃效果
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);

        .avatar {
            display: flex;
            justify-content: flex-end;
            align-items: center;
            padding: 10px 20px 0px 0px;
        }
    }

}

.content {
    width: calc(100% - 200px - 20px);
    margin: 70px 0 0 210px;
    overflow-y: auto;
}
</style>
