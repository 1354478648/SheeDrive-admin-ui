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

</script>

<template>
    <div class="el-menu-container">
        <el-menu router default-active="/dashboard" class="el-menu-vertical-demo">
            <div class="logo">
                <img style="width: 175px;" src="@/assets/title_SheeDrive.png" />
            </div>
            <el-divider border-style="dashed">
                功能栏
            </el-divider>
            <el-menu-item index="/dashboard">
                <el-icon>
                    <Odometer />
                </el-icon>
                <template #title>仪表盘</template>
            </el-menu-item>
            <el-menu-item index="/admin">
                <el-icon>
                    <CoffeeCup />
                </el-icon>
                <template #title>管理员管理</template>
            </el-menu-item>
            <el-menu-item index="/dealer">
                <el-icon>
                    <OfficeBuilding />
                </el-icon>
                <template #title>经销商管理</template>
            </el-menu-item>
            <el-menu-item index="/user">
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
        background-color: #fff;
        border-bottom: #dcdfe6 solid 0.5px;
        z-index: 2;

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
