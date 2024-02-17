<script setup>
import MyFooter from '@/views/public/MyFooter.vue';
import { ref } from 'vue'
import {
    Document,
    Menu as IconMenu,
    Location,
    Setting,
} from '@element-plus/icons-vue'

const avatar = ref("汤")

const handleOpen = (key, keyPath) => {
    console.log(key, keyPath)
}
const handleClose = (key, keyPath) => {
    console.log(key, keyPath)
}
</script>

<template>
    <div class="el-menu-container">
        <el-menu default-active="2" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose">
            <div class="logo">
                <img style="width: 175px;" src="@/assets/title_SheeDrive.png" />
            </div>
            <el-divider border-style="dashed">
                功能栏
            </el-divider>
            <el-menu-item index="1">
                <el-icon>
                    <Odometer />
                </el-icon>
                <template #title>仪表盘</template>
            </el-menu-item>
            <el-menu-item index="2">
                <el-icon>
                    <CoffeeCup />
                </el-icon>
                <template #title>管理员管理</template>
            </el-menu-item>
            <el-menu-item index="3">
                <el-icon>
                    <OfficeBuilding />
                </el-icon>
                <template #title>经销商管理</template>
            </el-menu-item>
            <el-menu-item index="4">
                <el-icon>
                    <User />
                </el-icon>
                <template #title>用户管理</template>
            </el-menu-item>
            <el-menu-item index="5">
                <el-icon>
                    <EditPen />
                </el-icon>
                <template #title>论坛管理</template>
            </el-menu-item>
            <el-menu-item index="6">
                <el-icon>
                    <Van />
                </el-icon>
                <template #title>汽车管理</template>
            </el-menu-item>
            <el-menu-item index="7">
                <el-icon>
                    <Document />
                </el-icon>
                <template #title>订单管理</template>
            </el-menu-item>
            <el-menu-item index="8">
                <el-icon>
                    <ChatDotSquare />
                </el-icon>
                <template #title>评论管理</template>
            </el-menu-item>
            <el-sub-menu index="9">
                <template #title>
                    <el-icon>
                        <Setting />
                    </el-icon>
                    <span>设置</span>
                </template>
                <el-menu-item-group title="请选择以下功能：">
                    <el-menu-item index="9-1">修改头像</el-menu-item>
                    <el-menu-item index="9-2">修改密码</el-menu-item>
                </el-menu-item-group>
            </el-sub-menu>

        </el-menu>
        <div class="header">
            <div class="avatar">
                <el-dropdown>
                    <el-avatar> {{ avatar }} </el-avatar>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item>个人资料</el-dropdown-item>
                            <el-dropdown-item>退出登录</el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>

            </div>
        </div>
    </div>

    <MyFooter/>
</template>

<style lang="scss" scoped>
.el-menu-container {
    display: flex;

    .el-menu-vertical-demo:not(.el-menu--collapse) {
        width: 200px;
        min-height: 100vh;

        .logo {
            display: flex;
            justify-content: center;
            padding: 20px 0px 0px 0px;
        }
    }

    .header {
        flex-grow: 1;
        background-color: #fff;
        height: 60px;
        border-bottom: #dcdfe6 solid 0.5px;

        .avatar {
            display: flex;
            justify-content: flex-end;
            align-items: center;
            padding: 10px 20px 0px 0px;
        }
    }

}
</style>
