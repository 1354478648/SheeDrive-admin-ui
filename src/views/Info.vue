<script setup>
import { ref } from 'vue'
import { useInfoStore } from '@/stores/info';
const infoStore = useInfoStore()
import { useRouter } from 'vue-router'
const router = useRouter()
import { checkRole } from '@/utils/other.js'

const avatar = ref(infoStore.info.avatar ? infoStore.info.avatar : 'src/assets/default_avatar.jpg')

// 当前登录的角色
const role = ref(checkRole(infoStore.info))

const toUpdateAvatar = () => {
    router.push('/updateAvatar')
}

const toUpdatePwd = ()=>{
    router.push('/updatePassword')
}
</script>

<template>
    <el-card class="el-card">
        <el-descriptions title="个人资料" :column="3" size="large" border>
            <template #extra>
                <el-button type="primary" @click="toUpdateAvatar">修改头像</el-button>
                <el-button type="primary" @click="toUpdatePwd">修改密码</el-button>
            </template>
            <el-descriptions-item class="cell-item">
                <template #label>
                    <div>
                        <el-icon>
                            <Key />
                        </el-icon>
                        ID
                    </div>
                </template>
                {{ infoStore.info.id }}
            </el-descriptions-item>
            <el-descriptions-item v-if="!role" class="cell-item">
                <template #label>
                    <div>
                        <el-icon>
                            <user />
                        </el-icon>
                        姓名
                    </div>
                </template>
                {{ infoStore.info.name }}
            </el-descriptions-item>
            <el-descriptions-item v-if="role" class="cell-item">
                <template #label>
                    <div>
                        <el-icon>
                            <user />
                        </el-icon>
                        名字
                    </div>
                </template>
                {{ infoStore.info.name }}
            </el-descriptions-item>
            <el-descriptions-item class="cell-item">
                <template #label>
                    <div>
                        <el-icon>
                            <User />
                        </el-icon>
                        头像
                    </div>
                </template>
                <el-avatar :src="avatar" />
            </el-descriptions-item>
            <el-descriptions-item class="cell-item">
                <template #label>
                    <div>
                        <el-icon>
                            <User />
                        </el-icon>
                        用户名
                    </div>
                </template>
                {{ infoStore.info.username }}
            </el-descriptions-item>
            <el-descriptions-item class="cell-item">
                <template #label>
                    <div>
                        <el-icon>
                            <Unlock />
                        </el-icon>
                        状态
                    </div>
                </template>
                <el-tag type="success" v-if="infoStore.info.status">启用</el-tag>
                <el-tag type="danger" v-else>禁用</el-tag>
            </el-descriptions-item>
            <el-descriptions-item v-if="!role" class="cell-item">
                <template #label>
                    <div>
                        <el-icon>
                            <CoffeeCup />
                        </el-icon>
                        超级管理员
                    </div>
                </template>
                <el-tag type="success" v-if="infoStore.info.isRoot">是</el-tag>
                <el-tag type="danger" v-else>否</el-tag>
            </el-descriptions-item>
            <el-descriptions-item class="cell-item">
                <template #label>
                    <div>
                        <el-icon>
                            <Phone />
                        </el-icon>
                        手机号
                    </div>
                </template>
                {{ infoStore.info.phone }}
            </el-descriptions-item>
            <el-descriptions-item v-if="role" class="cell-item">
                <template #label>
                    <div>
                        <el-icon>
                            <Document />
                        </el-icon>
                        描述信息
                    </div>
                </template>
                {{ infoStore.info.describeInfo }}
            </el-descriptions-item>
            <el-descriptions-item class="cell-item">
                <template #label>
                    <div>
                        <el-icon>
                            <Plus />
                        </el-icon>
                        创建时间
                    </div>
                </template>
                {{ infoStore.info.createTime }}
            </el-descriptions-item>
            <el-descriptions-item class="cell-item">
                <template #label>
                    <div>
                        <el-icon>
                            <Edit />
                        </el-icon>
                        最近更新时间
                    </div>
                </template>
                {{ infoStore.info.updateTime }}
            </el-descriptions-item>
            <el-descriptions-item v-if="role" class="cell-item">
                <template #label>
                    <div>
                        <el-icon>
                            <Location />
                        </el-icon>
                        地址
                    </div>
                </template>
                {{ infoStore.info.address.Province + " " + infoStore.info.address.City + " "
                    + infoStore.info.address.District + " " + infoStore.info.address.Detail }}
            </el-descriptions-item>
        </el-descriptions>
    </el-card>
</template>

<style scoped>
.el-card {
    flex: 1;
    margin-bottom: 35px;

    .cell-item {
        display: flex;
        align-items: center;
    }
}</style>