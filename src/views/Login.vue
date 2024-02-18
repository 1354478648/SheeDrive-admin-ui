<script setup>
import { dealerLoginService } from '@/api/dealer.js'
import { adminLoginService } from '@/api/admin.js'
import MyFooter from '@/views/public/MyFooter.vue';
import { useRouter } from 'vue-router'
const router = useRouter()
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import SlideVerify from 'vue3-slide-verify';
import "vue3-slide-verify/dist/style.css"

// 控制抽屉的开关
const drawer = ref(false)
// 控制勾选框的开关
const checked = ref(false)
// 控制标签页的激活对象
const activeName = ref('dealer')
// 定义数据模型：用户名和密码
const loginData = ref({
    username: '',
    password: ''
})
// 勾选框DOM
const checkBoxContainer = ref(null)
// 登录失败次数
const failCount = ref(0)
// 控制验证码遮罩的开关
const showModal = ref(false)

// 定义表单校验规则
const rules = {
    username: [
        { required: true, message: '请输入用户名', trigger: 'blur' },
        { min: 3, max: 10, message: '用户名长度在3到10个字符', trigger: 'blur' }
    ],
    password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
    ]
}

// 切换标签页时清空数据
const clearLoginData = () => {
    loginData.value.username = ''
    loginData.value.password = ''
}

const onLogin = async () => {
    // 判断是否勾选用户协议与隐私条款
    if (checked.value == false) {
        ElMessage.warning("请先勾选用户协议与隐私条款")
        // 启动动画
        checkBoxContainer.value.classList.add('shake');
        // 结束动画后，移除shake类，以便下次再添加
        checkBoxContainer.value.addEventListener('animationend', () => {
            checkBoxContainer.value.classList.remove('shake');
        });
        return
    }

    if (activeName.value === 'dealer') {
        // 判断失败次数，如果大于等于5次需要滑块验证
        if (failCount.value >= 5) {
            showModal.value = true
            return
        }

        let result = await dealerLoginService(loginData.value)
        if (result.code !== 0) {
            // 清空输入框
            clearLoginData()
            // 失败次数加一
            failCount.value++
            return
        }
        ElMessage.success(result.msg ? result.msg : '登录成功')
        router.push('/')
    }
    if (activeName.value === 'admin') {
        // 判断失败次数，如果大于等于5次需要滑块验证
        if (failCount.value >= 5) {
            showModal.value = true
            return
        }
        let result = await adminLoginService(loginData.value)
        if (result.code !== 0) {
            // 清空输入框
            clearLoginData()
            // 失败次数加一
            failCount.value++
            return
        }
        ElMessage.success(result.msg ? result.msg : '登录成功')
        router.push('/')
    }
}

const onSuccess = async () => {
    showModal.value = false
    if (activeName.value === 'dealer') {
        let result = await dealerLoginService(loginData.value)
        if (result.code !== 0) {
            // 清空输入框
            clearLoginData()
            // 失败次数加一
            failCount.value++
            return
        }
        ElMessage.success(result.msg ? result.msg : '登录成功')
        router.push('/')
    }
    if (activeName.value === 'admin') {
        let result = await adminLoginService(loginData.value)
        if (result.code !== 0) {
            // 清空输入框
            clearLoginData()
            // 失败次数加一
            failCount.value++
            return
        }
        ElMessage.success(result.msg ? result.msg : '登录成功')
        router.push('/')
    }
}

</script>

<template>
    <div class="root">
        <div class="header">
            <div class="logo">
                <img style="width: 200px" src="@/assets/title_SheeDrive.png" />
            </div>
            <div class="app-download">
                <a class="a" href="#" style="display: flex; align-items: center;">
                    <el-icon>
                        <Download />
                    </el-icon>
                    移动端APP下载
                </a>
            </div>
        </div>

        <div class="body">
            <el-card class="box-card">
                <div class="welcome">
                    <el-text class="text">
                        欢迎使用小羊试驾后台管理系统
                    </el-text>
                </div>
                <el-tabs v-model="activeName" @tab-change="clearLoginData" class="el-tabs">
                    <el-tab-pane label="经销商登录" name="dealer">
                        <el-form :rules="rules" :label-position="labelPosition" :model="loginData" class="el-form">
                            <el-form-item prop="username" class="el-form-item">
                                <el-input v-model="loginData.username" size="large" placeholder="请输入用户名" clearable />
                            </el-form-item>
                            <el-form-item prop="password" class="el-form-item">
                                <el-input v-model="loginData.password" size="large" placeholder="请输入密码" show-password />
                            </el-form-item>

                        </el-form>
                    </el-tab-pane>
                    <el-tab-pane label="管理员登录" name="admin">
                        <el-form :rules="rules" :label-position="labelPosition" :model="loginData" class="el-form">
                            <el-form-item prop="username" class="el-form-item">
                                <el-input v-model="loginData.username" size="large" placeholder="请输入用户名" clearable />
                            </el-form-item>
                            <el-form-item prop="password" class="el-form-item">
                                <el-input v-model="loginData.password" size="large" placeholder="请输入密码" show-password />
                            </el-form-item>
                        </el-form>
                    </el-tab-pane>
                </el-tabs>
                <el-button @click="onLogin" size="large" type="primary" class="login-button">立即登录</el-button>
                <div ref="checkBoxContainer" class="checkbox-container">
                    <el-checkbox v-model="checked" />
                    <span style="margin-left: 5px; font-size: 14px;">我已阅读并同意</span>
                    <el-link type="primary" @click="drawer = true">&nbsp;用户协议与隐私条款&nbsp;</el-link>
                </div>
                <el-text class="pwd">忘记密码？<el-link type="primary">找回密码</el-link></el-text>
            </el-card>
        </div>

        <MyFooter />
    </div>

    <el-drawer v-model="drawer" title="用户协议与隐私条款" direction="btt">
        <span>本系统由 上海工程技术大学 计算机科学与技术专业 2024届毕业生 汤晟 于2024年开发</span>
        <template #footer>
            <div style="flex: auto">
                <el-button @click="drawer = false">取消</el-button>
                <el-button type="primary" @click="drawer = false; checked = true;">我已阅读并同意用户协议与隐私条款</el-button>
            </div>
        </template>
    </el-drawer>

    <teleport to="body">
        <div v-if="showModal" class="overlay">
            <el-card class="modal">
                <slide-verify slider-text="请拖动图片到指定位置" accuracy=2 @success="onSuccess" :w="400" :h="200"></slide-verify>
            </el-card>
        </div>
    </teleport>
</template>

<style lang="scss" scoped>
.root {
    position: relative;
    min-height: 100vh;

    background-image: url("@/assets/login-bgp.png");
    background-size: cover;
    background-repeat: no-repeat;

    .header {
        display: flex;

        .logo {
            padding: 20px 0px 0px 20px;
        }

        .app-download {
            margin-left: auto;
            padding: 20px 20px 0px 0px;
        }
    }

    .body {
        display: flex;
        justify-content: center;
        align-items: center;

        .box-card {
            width: 400px;
            margin: 5% 0px 0px 50%;

            .welcome {
                display: flex;
                justify-content: center;

                .text {
                    font-size: 20px;
                    color: #505050;
                }
            }

            .el-tabs {
                margin-top: 20px;

                .el-form {
                    margin-top: 20px;
                    text-align: center;

                    .el-form-item {
                        display: inline-block;
                        margin-top: 10px;
                        width: 85%;
                    }
                }
            }

            .login-button {
                display: block;
                width: 75%;
                margin: 0 auto;
                margin-top: 30px;
            }

            .checkbox-container {
                display: flex;
                align-items: center;
                justify-content: center;
                margin-top: 10px;
            }

            .pwd {
                display: flex;
                justify-content: right;
                margin: 5px 47px 0px 0px;
            }
        }
    }
}

.a {
    text-decoration: none;
    color: #505050;
}

.overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 2;

    .modal {
        background-color: white;
        padding: 20px;
        border-radius: 5px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
    }
}
</style>