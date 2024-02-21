<script setup>
import { ref } from 'vue';
import { adminListService, adminUpdateStatusService, adminAddService, adminResetPwdService, adminDeleteService, adminUpdateService } from '@/api/admin';
import { checkPhone } from '@/utils/validate';
import { ElMessage } from 'element-plus';

// 搜索对象
const searchData = ref({
    username: '',
    name: '',
    beforeDate: '',
    afterDate: '',
})

const page = ref(1)
const size = ref(5)
const total = ref(0)

const dateTimeRange = ref([])

// 控制抽屉的开关
const drawer = ref(false)
// 定义变量，用于控制弹窗标题的显示
const title = ref('')

// 管理员列表数据模型
const admin = ref([])

// 管理员添加修改对象
const adminData = ref({
    name: '',
    username: '',
    phone: '',
})
// 管理员修改id
const adminId = ref(null)

// 重置搜索对象
const clearSearchData = () => {
    searchData.value = {
        username: '',
        name: '',

    }
    dateTimeRange.value = []
    page.value = 1
    size.value = 5
}

// 获取管理员分页数据
const getAdminList = async () => {
    const params = {
        username: searchData.value.username ? searchData.value.username : null,
        name: searchData.value.name ? searchData.value.name : null,
        beforeDate: dateTimeRange.value[0] ? dateTimeRange.value[0] : null,
        afterDate: dateTimeRange.value[1] ? dateTimeRange.value[1] : null,
        page: page.value,
        size: size.value
    }

    let result = await adminListService(params)

    page.value = result.data.Page
    size.value = result.data.Size
    total.value = result.data.Total
    admin.value = result.data.List
}
getAdminList()

// 当前页码发生变化时，调用此函数
const handleCurrentChange = (newPage) => {
    page.value = newPage
    getAdminList()
}
// 每页条数发生变化时，调用此函数
const handleSizeChange = (newSize) => {
    size.value = newSize
    getAdminList()
}

// 管理员切换状态
const onSwitchChange = async (id) => {
    await adminUpdateStatusService(id)
}

// 定义表单校验规则
const rules = {
    name: [
        { required: true, message: '请输入姓名', trigger: 'blur' }
    ],
    username: [
        { required: true, message: '请输入用户名', trigger: 'blur' },
        { min: 6, max: 18, message: '用户名长度在6到18个字符', trigger: 'blur' }
    ],
    phone: [
        { required: true, message: '请输入手机号', trigger: 'blur' },
        { validator: checkPhone, trigger: 'blur' },
    ]
}

// 清空管理员添加修改对象
const clearAdminData = () => {
    adminData.value = {
        name: '',
        username: '',
        phone: '',
    }
}

const handleClose = () => {
    if (title.value == '修改管理员') {
        drawer.value = false
        clearAdminData()
    }

    if (adminData.value.name !== '' || adminData.value.username !== '' || adminData.value.phone !== '') {
        ElMessageBox.confirm(
            '需要保存草稿吗？',
            '提示',
            {
                confirmButtonText: '保存',
                cancelButtonText: '取消',
                type: 'info',
            }
        )
            .then(() => {
                drawer.value = false
                ElMessage({
                    type: 'success',
                    message: '保存成功',
                })
            }
            )
            .catch(() => {
                drawer.value = false
                clearAdminData()
            })
    } else {
        drawer.value = false
    }
}

const addAdmin = async () => {
    let result = await adminAddService(adminData.value)
    ElMessage.success('添加成功, ID为 ' + result.data.id)
    clearAdminData()
    drawer.value = false
    getAdminList()
}

const resetPwd = (id, name) => {
    ElMessageBox.confirm(
        `确认重置 ${name} 的密码吗？`,
        '提示',
        {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning',
        }
    )
        .then(async () => {
            await adminResetPwdService(id)
            ElMessage({
                type: 'success',
                message: '重置成功',
            })
            getAdminList()
        }
        )
        .catch(() => { })
}

const delAdmin = (id, name) => {
    ElMessageBox.confirm(
        `确认删除管理员 ${name} 吗？`,
        '提示',
        {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning',
        }
    )
        .then(async () => {
            await adminDeleteService(id)
            ElMessage({
                type: 'success',
                message: '删除成功',
            })
            getAdminList()
        }
        )
        .catch(() => { })
}

const showDrawer = (row) => {
    title.value = '修改管理员'
    drawer.value = true
    adminId.value = row.id

    // 数据回显
    adminData.value.name = row.name
    adminData.value.username = row.username
    adminData.value.phone = row.phone
}

const updateAdmin = async () => {
    const params = {
        id: adminId.value,
        name: adminData.value.name,
        username: adminData.value.username,
        phone: adminData.value.phone,
    }

    await adminUpdateService(params)
    ElMessage.success("修改成功")
    clearAdminData()
    drawer.value = false
    getAdminList()
}
</script>

<template>
    <el-card class="el-card">
        <template #header>
            <div class="card-header">
                <span>管理员管理</span>
                <el-button type="primary" @click="title = '添加管理员'; drawer = true;">添加管理员</el-button>
            </div>
        </template>
        <!-- 搜索栏 -->
        <el-form class="search-container" :model="searchData">
            <div class="search-input">
                <el-form-item label="用户名:">
                    <el-input v-model="searchData.username" placeholder="请输入用户名" suffix-icon="Search" />
                </el-form-item>
                <el-form-item label="姓名:" style="margin-left: 18px;">
                    <el-input v-model="searchData.name" placeholder="请输入姓名" suffix-icon="Search" />
                </el-form-item>
                <el-form-item label="创建日期:" style="margin-left: 18px;">
                    <el-date-picker v-model="dateTimeRange" type="datetimerange" start-placeholder="请选择时间区间"
                        end-placeholder="请选择时间区间" value-format="YYYY-MM-DD hh:mm:ss" />
                </el-form-item>
            </div>
            <el-form-item class="search-button">
                <el-button type="primary" @click="getAdminList">查询</el-button>
                <el-button type="default" @click="clearSearchData(); getAdminList();">重置</el-button>
            </el-form-item>
        </el-form>
        <!-- 管理员列表 -->
        <el-table :data="admin" style="width: 100%">
            <el-table-column label="ID" prop="id" width="100"></el-table-column>
            <el-table-column label="用户名" prop="username"></el-table-column>
            <el-table-column label="姓名" prop="name"> </el-table-column>
            <el-table-column label="头像" prop="avatar" width="100">
                <template #default="{ row }">
                    <el-avatar :size="40" :src="row.avatar ? row.avatar : 'src/assets/default_avatar.jpg'" />
                </template>
            </el-table-column>
            <el-table-column label="手机号" prop="phone"></el-table-column>
            <el-table-column label="状态" prop="status" width="100">
                <template #default="{ row }">
                    <el-switch v-model="row.status" @change="onSwitchChange(row.id)" :disabled="row.isRoot"
                        :active-value="1" :inactive-value="0"></el-switch>
                </template>
            </el-table-column>
            <el-table-column label="超级管理员" prop="isRoot" width="100">
                <template #default="{ row }">
                    <el-tag type="success" v-if="row.isRoot == 1">是</el-tag>
                    <el-tag type="danger" v-else>否</el-tag>
                </template>
            </el-table-column>
            <el-table-column label="创建时间" prop="createTime" width="200"></el-table-column>
            <el-table-column label="操作" width="200">
                <template #default="{ row }">
                    <el-tooltip content="编辑" placement="top">
                        <el-button @click="showDrawer(row);" icon="Edit" circle plain type="primary"
                            :disabled="row.isRoot"></el-button>
                    </el-tooltip>
                    <el-tooltip content="重置密码" placement="top">
                        <el-button @click="resetPwd(row.id, row.name)" icon="RefreshRight" circle plain type="primary"
                            :disabled="row.isRoot"></el-button>
                    </el-tooltip>
                    <el-tooltip content="删除" placement="top">
                        <el-button @click="delAdmin(row.id, row.name)" icon="Delete" circle plain type="danger"
                            :disabled="row.isRoot"></el-button>
                    </el-tooltip>
                </template>
            </el-table-column>
            <template #empty>
                <el-empty description="没有数据" />
            </template>
        </el-table>
        <!-- 分页条 -->
        <el-pagination v-model:current-page="page" v-model:page-size="size" :page-sizes="[5, 10, 20]" :small="small"
            :disabled="disabled" :background="background" layout="total, sizes, prev, pager, next, jumper" :total="total"
            @size-change="handleSizeChange" @current-change="handleCurrentChange"
            style="margin-top: 20px; justify-content: flex-end" />
    </el-card>

    <!-- 管理员添加&修改 -->
    <el-drawer v-model="drawer" :title="title" direction="rtl" :before-close="handleClose">
        <el-form :rules="rules" label-width="80px" :model="adminData" class="el-form">
            <el-form-item prop="name" label="姓名:">
                <el-input v-model="adminData.name" size="large" placeholder="请输入姓名" clearable />
            </el-form-item>
            <el-form-item prop="username" label="用户名:">
                <el-input v-model="adminData.username" size="large" placeholder="请输入用户名" clearable />
            </el-form-item>
            <el-form-item prop="phone" label="手机号:">
                <el-input v-model="adminData.phone" size="large" placeholder="请输入手机号" maxlength="11" show-word-limit
                    clearable />
            </el-form-item>
        </el-form>
        <template #footer>
            <div style="flex: auto">
                <el-button @click="handleClose">取消</el-button>
                <el-button type="primary" @click="title == '添加管理员' ? addAdmin() : updateAdmin();">确认</el-button>
            </div>
        </template>
    </el-drawer>
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

    .search-container {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .search-input {
            display: flex;
        }

        .search-button {
            margin-left: 30px;
        }
    }
}
</style>