<script setup>
import { dealerLoginService, dealerUpdatePasswordByPhoneService } from '@/api/dealer.js'
import { adminLoginService, adminUpdatePasswordByPhoneService } from '@/api/admin.js'
import { SmsSendCode } from '@/api/sms.js';
import MyFooter from '@/views/public/MyFooter.vue';
import { useRouter } from 'vue-router'
const router = useRouter()
import { ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { useTokenStore } from '@/stores/token.js'
import { useInfoStore } from '@/stores/info';
const tokenStore = useTokenStore()
const infoStore = useInfoStore()
import SlideVerify from 'vue3-slide-verify';
import "vue3-slide-verify/dist/style.css"
import { checkPhone } from '@/utils/validate';

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
// 控制找回密码的开关
const showFindPassword = ref(false)

// 定义表单校验规则
const rules = {
    username: [
        { required: true, message: '请输入用户名', trigger: 'blur' },
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
        // 把得到的token存储到pinia中
        tokenStore.setToken(result.data.token)
        // 把得到的用户信息存储到pinia中
        infoStore.setInfo(result.data.dealer_info)
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
        // 把得到的token存储到pinia中
        tokenStore.setToken(result.data.token)
        // 把得到的用户信息存储到pinia中
        infoStore.setInfo(result.data.admin_info)
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
        // 把得到的token存储到pinia中
        tokenStore.setToken(result.data.token)
        // 把得到的用户信息存储到pinia中
        infoStore.setInfo(result.data.dealer_info)
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
        // 把得到的token存储到pinia中
        tokenStore.setToken(result.data.token)
        // 把得到的用户信息存储到pinia中
        infoStore.setInfo(result.data.admin_info)
        router.push('/')
    }
}

const findPwd = ref({
    phone: '',
    code: '',
    password: '',
    confirmPassword: ''
})

const clearFindPwd = () => {
    findPwd.value = {
        phone: '',
        code: '',
        password: '',
        confirmPassword: ''
    }
}

//校验密码的函数
const checkCPwd = (rule, value, callback) => {
    if (value !== findPwd.value.password) {
        callback(new Error('两次输入的密码不一致'))
    } else {
        callback()
    }
}
// 定义表单校验规则
const findPwdRules = {
    phone: [
        { required: true, message: '请输入手机号', trigger: 'blur' },
        { validator: checkPhone, trigger: 'blur' },
    ],
    code: [
        { required: true, message: '请输入验证码', trigger: 'blur' },
    ],
    password: [
        { required: true, message: '请输入新密码', trigger: 'blur' },
        { min: 6, max: 18, message: '密码长度为6-18位', trigger: 'blur' },
    ],
    confirmPassword: [
        { required: true, message: '请重新输入新密码', trigger: 'blur' },
        { validator: checkCPwd, trigger: 'blur' }
    ]
}

const getCodeButtonActive = ref(false)
const countDown = ref(60)

const getCode = () => {
    if (findPwd.value.phone === '') {
        ElMessage.error('请输入手机号')
        return
    }
    if (!(/^1[3456789]\d{9}$/.test(findPwd.value.phone))) {
        ElMessage.error('请输入正确的手机号码格式')
        return
    }
    showModal1.value = true;
}

const startCountdown = () => {
    const timer = setInterval(() => {
        if (countDown.value > 0) {
            countDown.value--;
        } else {
            clearInterval(timer);
            getCodeButtonActive.value = !getCodeButtonActive.value;
            countDown.value = 60;
        }
    }, 1000);
};

const showModal1 = ref(false)
const onSuccess1 = async () => {
    showModal1.value = false;
    getCodeButtonActive.value = !getCodeButtonActive.value;
    startCountdown();
    let params = {
        phone: findPwd.value.phone
    }
    let result = await SmsSendCode(params)
    ElMessage.success(result.msg ? result.msg : '验证码已发送')
    findPwd.value.code = result.data.code
}

const handleUpdatePwd = async () => {
    let params = {
        phone: findPwd.value.phone,
        code: findPwd.value.code,
        newPassword: findPwd.value.password,
        confirmPassword: findPwd.value.confirmPassword,
    }

    if (activeName.value == 'admin') {
        await adminUpdatePasswordByPhoneService(params)
        ElMessage.success('修改密码成功')
        clearFindPwd()
        showFindPassword.value = false
        getCodeButtonActive.value = !getCodeButtonActive.value;
    } else {
        await dealerUpdatePasswordByPhoneService(params)
        ElMessage.success('修改密码成功')
        clearFindPwd()
        showFindPassword.value = false
        getCodeButtonActive.value = !getCodeButtonActive.value;
    }
}
</script>

<template>
    <div class="root">
        <div class="header">
            <div class="logo">
                <img style="width: 200px" src="@/assets/new-logo.png" />
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
                        欢迎使用汽车试驾管理系统
                    </el-text>
                </div>
                <!-- 登录流程 -->
                <div v-if="!showFindPassword">
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
                    <el-text class="pwd">忘记密码？<el-link type="primary"
                            @click="showFindPassword = !showFindPassword">找回密码</el-link></el-text>
                </div>

                <!-- 找回密码流程 -->
                <div v-if="showFindPassword" class="find-password-container">
                    <el-text class="role-radio-container">您的身份是： <el-radio-group v-model="activeName">
                            <el-radio label="dealer" size="large" border>经销商</el-radio>
                            <el-radio label="admin" size="large" border>管理员</el-radio>
                        </el-radio-group>
                    </el-text>
                    <el-form :rules="findPwdRules" :label-position="labelPosition" :model="findPwd" class="el-form">
                        <el-form-item prop="phone" class="el-form-item">
                            <el-input v-model="findPwd.phone" size="large" placeholder="请输入手机号" clearable maxlength="11"
                                show-word-limit />
                        </el-form-item>
                        <el-form-item prop="code" class="el-form-item">
                            <el-input v-model="findPwd.code" size="large" placeholder="请输入验证码" clearable
                                class="code-input" />
                            <el-button type="primary" plain size="large" class="get-code-button" @click="getCode"
                                :disabled="getCodeButtonActive">
                                {{ !getCodeButtonActive ? "点击获取验证码" : `${countDown}秒后重试` }}
                            </el-button>
                        </el-form-item>
                        <el-form-item prop="password" class="el-form-item">
                            <el-input v-model="findPwd.password" size="large" placeholder="请输入新密码" clearable
                                show-password />
                        </el-form-item>
                        <el-form-item prop="confirmPassword" class="el-form-item">
                            <el-input v-model="findPwd.confirmPassword" size="large" placeholder="请重新输入新密码" clearable
                                show-password />
                        </el-form-item>
                    </el-form>
                    <el-button type="primary" size="large" class="confirm-button" @click="handleUpdatePwd">
                        修改密码
                    </el-button>
                    <el-link @click="showFindPassword = !showFindPassword; clearFindPwd();" style="margin-top: 20px;">
                        ← 返回登录
                    </el-link>
                </div>
            </el-card>
        </div>
        <div class="footer">
            <MyFooter />
        </div>
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

    <teleport to="body">
        <div v-if="showModal1" class="overlay">
            <el-card class="modal">
                <slide-verify slider-text="请拖动图片到指定位置" accuracy=2 @success="onSuccess1" :w="400" :h="200"></slide-verify>
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
            margin: 20px 0px 0px 50%;
            // margin-left: 50%;

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

            .find-password-container {
                margin-top: 20px;

                .role-radio-container {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .el-form {
                    margin-top: 20px;
                    text-align: center;

                    .el-form-item {
                        display: inline-block;
                        margin-top: 10px;
                        width: 85%;

                        .code-input {
                            width: 60%;
                        }

                        .get-code-button {
                            margin-left: 10px;
                            width: 110px;
                        }
                    }
                }
            }

            .confirm-button {
                display: block;
                width: 75%;
                margin: 0 auto;
                margin-top: 30px;
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

.footer {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
}
</style>

<style>
.el-form-item__label {
    font-size: 12px;
    color: #505050;
}
</style>