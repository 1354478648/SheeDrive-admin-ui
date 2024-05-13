<script setup>
import { ref } from 'vue'
import { useInfoStore } from '@/stores/info.js'
const infoStore = useInfoStore()
import { dealerUpdatePasswordService } from '@/api/dealer.js'
import { adminUpdatePasswordService } from '@/api/admin.js'
import { checkRole } from '@/utils/other.js'

// 当前登录的角色
const role = ref(checkRole(infoStore.info))

// 超级管理员不允许修改密码
const forbidden = ref(false)
if (role.value == 0) {
    if (infoStore.info.isRoot == 1) {
        forbidden.value = true
    }
}

const pwd = ref({
    oPwd: '',
    nPwd: '',
    cPwd: '',
})

//校验密码的函数
const checkCPwd = (rule, value, callback) => {
    if (value !== pwd.value.nPwd) {
        callback(new Error('两次输入的密码不一致'))
    } else {
        callback()
    }
}

// 定义表单校验规则
const rules = {
    oPwd: [
        { required: true, message: '请输入原密码', trigger: 'blur' },
    ],
    nPwd: [
        { required: true, message: '请输入新密码', trigger: 'blur' },
        { min: 6, max: 18, message: '密码长度为6-18位', trigger: 'blur' },
    ],
    cPwd: [
        { required: true, message: '请重新输入新密码', trigger: 'blur' },
        { validator: checkCPwd, trigger: 'blur' }
    ]
}

const updatePwd = async () => {
    const params = {
        id: infoStore.info.id,
        password: pwd.value.oPwd,
        newPassword: pwd.value.nPwd,
        confirmPassword: pwd.value.cPwd,
    }

    if (role.value == 1) {
        await dealerUpdatePasswordService(params)
        ElMessage.success('修改经销商密码成功')
    } else if (role.value == 0) {
        await adminUpdatePasswordService(params)
        ElMessage.success('修改管理员密码成功')
    }
}
</script>

<template>
    <el-card class="page-container">
        <template #header>
            <div class="header">
                <span>修改密码</span>
            </div>
        </template>
        <div class="pwd-container">
            <el-form :rules="rules" label-width="80px" :model="pwd" class="el-form">
                <el-form-item prop="oPwd" label="原密码:">
                    <el-input v-model="pwd.oPwd" size="large" placeholder="请输入原密码" clearable show-password />
                </el-form-item>
                <el-form-item prop="nPwd" label="新密码:" style="margin-top: 20px;">
                    <el-input v-model="pwd.nPwd" size="large" placeholder="请输入新密码" clearable show-password />
                </el-form-item>
                <el-form-item prop="cPwd" label="确认密码:" style="margin-top: 20px;">
                    <el-input v-model="pwd.cPwd" size="large" placeholder="请重新输入新密码" clearable show-password />
                </el-form-item>
            </el-form>
            <el-button @click="updatePwd" type="primary" class="confirm-button" :disabled="forbidden">确认修改</el-button>
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

    .pwd-container {
        width: 400px;

        .confirm-button {
            margin: 20px 0 0 80px;
        }
    }
}
</style>