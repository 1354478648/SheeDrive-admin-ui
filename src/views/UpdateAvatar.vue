<script setup>
import { Plus, Upload } from '@element-plus/icons-vue'
import { ref } from 'vue'
import { useInfoStore } from '@/stores/info.js'
const infoStore = useInfoStore()
import { useTokenStore } from '@/stores/token.js'
import { ElMessage } from 'element-plus';
const tokenStore = useTokenStore()
import { dealerUpdateAvatarService } from '@/api/dealer.js'
import { adminUpdateAvatarService } from '@/api/admin.js'

const imgUrl = ref(infoStore.info.avatar ? infoStore.info.avatar : 'src/assets/default_avatar.jpg')

// 当前登录的角色
const role = ref()

if (infoStore.info.hasOwnProperty("describeInfo")) {
    role.value = 1 // 经销商
} else {
    role.value = 0 // 管理员
}

//获取el-upload的DOM
const uploadRef = ref()

const beforeAvatarUpload = (file) => {
    const isImg = file.type === 'image/jpeg' || file.type === 'image/png';
    const isLt2MB = file.size / 1024 / 1024 < 2;

    if (!isImg) {
        ElMessage.error('上传头像图片只能是 JPG 或 PNG 格式!');
        return false // 阻止上传
    }
    if (!isLt2MB) {
        ElMessage.error('上传头像图片大小不能超过 2MB!');
        return false // 阻止上传
    }

    return true
}

//图片上传成功的回调
const handleAvatarSuccess = (result) => {
    //回显图片
    imgUrl.value = result.data.url;
}

// 更新头像
const updateAvatar = async () => {
    const params = {
        id: infoStore.info.id,
        url: imgUrl.value,
    }

    if (role.value == 1) {
        await dealerUpdateAvatarService(params)
    } else if (role.value == 0) {
        await adminUpdateAvatarService(params)
    }

    //修改pinia中的状态
    infoStore.info.avatar = imgUrl.value

    ElMessage.success('修改头像成功')
}

</script>

<template>
    <el-card class="page-container">
        <template #header>
            <div class="header">
                <span>修改头像</span>
            </div>
        </template>
        <el-upload ref="uploadRef" class="avatar-uploader" :auto-upload="true" action="/api/file/upload"
            :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload" name="file"
            :headers="{ 'Authorization': tokenStore.token }">
            <img v-if="imgUrl" :src="imgUrl" class="avatar" />
            <el-icon v-else class="avatar-uploader-icon">
                <Plus />
            </el-icon>
        </el-upload>
        <div class="button-container">
            <el-button type="primary" :icon="Plus" @click="uploadRef.$el.querySelector('input').click()">
                选择图片
            </el-button>
            <el-button type="success" :icon="Upload" @click="updateAvatar">
                确认修改
            </el-button>
        </div>
    </el-card>
</template>

<style scoped>
.el-card {
    flex: 1;
    margin-bottom: 35px;

    .card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .avatar-uploader {
        .avatar {
            width: 200px;
            height: 200px;
            display: block;
        }
    }

    .button-container{
        margin-top:20px;
    }
}
</style>