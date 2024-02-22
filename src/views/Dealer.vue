<script setup>
import { ref } from 'vue';
import { dealerListService, dealerUpdateStatusService, dealerAddService, dealerResetPwdService, dealerDeleteService, dealerUpdateService } from '@/api/dealer';
import { checkPhone } from '@/utils/validate';
import { ElMessage } from 'element-plus';
import {
    pcaTextArr
} from "element-china-area-data";

// 搜索对象
const searchData = ref({
    name: '',
})

const page = ref(1)
const size = ref(5)
const total = ref(0)

// 控制抽屉的开关
const drawer = ref(false)
// 定义变量，用于控制弹窗标题的显示
const title = ref('')

// 经销商列表数据模型
const dealer = ref([])

// 省市区下拉框数据模型(仅负责渲染)
const ssqArr = ref()

// 经销商添加修改对象
const dealerData = ref({
    name: '',
    username: '',
    phone: '',
    describeInfo: '',
    province: '',
    city: '',
    district: '',
    detailAddress: '',
})
// 经销商修改id
const dealerId = ref(null)

// 重置搜索对象
const clearSearchData = () => {
    searchData.value = {
        name: '',

    }
    page.value = 1
    size.value = 5
}

// 获取经销商分页数据
const getDealerList = async () => {
    const params = {
        name: searchData.value.name ? searchData.value.name : null,
        page: page.value,
        size: size.value
    }

    let result = await dealerListService(params)

    page.value = result.data.Page
    size.value = result.data.Size
    total.value = result.data.Total
    dealer.value = result.data.List
}
getDealerList()

// 当前页码发生变化时，调用此函数
const handleCurrentChange = (newPage) => {
    page.value = newPage
    getDealerList()
}
// 每页条数发生变化时，调用此函数
const handleSizeChange = (newSize) => {
    size.value = newSize
    getDealerList()
}

// 管理员切换状态
const onSwitchChange = async (id) => {
    await dealerUpdateStatusService(id)
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
    ],
    describeInfo: [],
    // address: [
    //     { required: true, message: '请选择省市区', trigger: 'change' }
    // ],
    detailAddress: [
        { required: true, message: '请输入详细地址', trigger: 'blur' }
    ],
}

const handleChange = (value) => {
    dealerData.value.province = value[0]
    dealerData.value.city = value[1]
    dealerData.value.district = value[2]
}

// 清空经销商添加修改对象
const clearDealerData = () => {
    dealerData.value = {
        name: '',
        username: '',
        phone: '',
        describeInfo: '',
        province: '',
        city: '',
        district: '',
        detailAddress: '',
    }
    ssqArr.value = []
}

const handleClose = () => {
    if (title.value == '修改经销商') {
        drawer.value = false
        clearDealerData()
    }

    if (dealerData.value.name !== '' || dealerData.value.username !== '' || dealerData.value.phone !== '' || dealerData.value.describeInfo !== '' || dealerData.value.province !== '' || dealerData.value.city !== '' || dealerData.value.district !== '' || dealerData.value.detailAddress !== '') {
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
                clearDealerData()
            })
    } else {
        drawer.value = false
    }
}

const addDealer = async () => {
    let result = await dealerAddService(dealerData.value)
    ElMessage.success('添加成功, ID为 ' + result.data.id)
    clearDealerData()
    drawer.value = false
    getDealerList()
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
            await dealerResetPwdService(id)
            ElMessage({
                type: 'success',
                message: '重置成功',
            })
            getDealerList()
        }
        )
        .catch(() => { })
}

const delDealer = (id, name) => {
    ElMessageBox.confirm(
        `确认删除经销商 ${name} 吗？`,
        '提示',
        {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning',
        }
    )
        .then(async () => {
            await dealerDeleteService(id)
            ElMessage({
                type: 'success',
                message: '删除成功',
            })
            getDealerList()
        }
        )
        .catch(() => { })
}

const showDrawer = (row) => {
    title.value = '修改经销商'
    drawer.value = true
    dealerId.value = row.id

    console.log(row)

    // 数据回显
    dealerData.value.name = row.name
    dealerData.value.username = row.username
    dealerData.value.phone = row.phone
    dealerData.value.describeInfo = row.describeInfo
    ssqArr.value = [row.address.Province, row.address.City, row.address.District]
    dealerData.value.detailAddress = row.address.Detail
}

const updateDealer = async () => {
    const params = {
        id: dealerId.value,
        name: dealerData.value.name,
        username: dealerData.value.username,
        phone: dealerData.value.phone,
        describeInfo: dealerData.value.describeInfo,
        province: dealerData.value.province,
        city: dealerData.value.city,
        district: dealerData.value.district,
        detailAddress: dealerData.value.detailAddress,
    }

    await dealerUpdateService(params)
    ElMessage.success("修改成功")
    clearDealerData()
    drawer.value = false
    getDealerList()
}
</script>

<template>
    <el-card class="el-card">
        <template #header>
            <div class="card-header">
                <span>经销商管理</span>
                <el-button type="primary" @click="title = '添加经销商'; drawer = true;">添加经销商</el-button>
            </div>
        </template>
        <!-- 搜索栏 -->
        <el-form class="search-container" :model="searchData">
            <div class="search-input">
                <el-form-item label="名字:">
                    <el-input v-model="searchData.name" placeholder="请输入名字" suffix-icon="Search" />
                </el-form-item>
            </div>
            <el-form-item class="search-button">
                <el-button type="primary" @click="getDealerList">查询</el-button>
                <el-button type="default" @click="clearSearchData(); getDealerList();">重置</el-button>
            </el-form-item>
        </el-form>
        <!-- 经销商列表 -->
        <el-table :data="dealer" style="width: 100%">
            <el-table-column label="ID" prop="id" width="50"></el-table-column>
            <el-table-column label="用户名" prop="username" width="150"></el-table-column>
            <el-table-column label="名字" prop="name" width="200"> </el-table-column>
            <el-table-column label="头像" prop="avatar" width="100">
                <template #default="{ row }">
                    <el-avatar :size="40" :src="row.avatar ? row.avatar : 'src/assets/default_avatar.jpg'" />
                </template>
            </el-table-column>
            <el-table-column label="手机号" prop="phone" width="150"></el-table-column>
            <el-table-column label="状态" prop="status" width="100">
                <template #default="{ row }">
                    <el-switch v-model="row.status" @change="onSwitchChange(row.id)" :disabled="row.isRoot"
                        :active-value="1" :inactive-value="0"></el-switch>
                </template>
            </el-table-column>
            <el-table-column label="描述信息" prop="describeInfo" width="200">
            </el-table-column>
            <el-table-column label="地址" width="200">
                <template #default="{ row }">
                    {{ row.address.Province + " " + row.address.City + " " + row.address.District + " " +
                        row.address.Detail }}
                </template>
            </el-table-column>
            <el-table-column label="创建时间" prop="createTime" width="200"></el-table-column>
            <el-table-column label="操作" width="200">
                <template #default="{ row }">
                    <el-tooltip content="编辑" placement="top">
                        <el-button @click="showDrawer(row);" icon="Edit" circle plain type="primary"></el-button>
                    </el-tooltip>
                    <el-tooltip content="重置密码" placement="top">
                        <el-button @click="resetPwd(row.id, row.name)" icon="RefreshRight" circle plain
                            type="primary"></el-button>
                    </el-tooltip>
                    <el-tooltip content="删除" placement="top">
                        <el-button @click="delDealer(row.id, row.name)" icon="Delete" circle plain
                            type="danger"></el-button>
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

    <!-- 经销商添加&修改 -->
    <el-drawer v-model="drawer" :title="title" direction="rtl" :before-close="handleClose">
        <el-form :rules="rules" label-width="80px" :model="dealerData" class="el-form">
            <el-form-item prop="name" label="名字:">
                <el-input v-model="dealerData.name" size="large" placeholder="请输入名字" clearable />
            </el-form-item>
            <el-form-item prop="username" label="用户名:">
                <el-input v-model="dealerData.username" size="large" placeholder="请输入用户名" clearable />
            </el-form-item>
            <el-form-item prop="phone" label="手机号:">
                <el-input v-model="dealerData.phone" size="large" placeholder="请输入手机号" maxlength="11" show-word-limit
                    clearable />
            </el-form-item>
            <el-form-item prop="describeInfo" label="描述信息:">
                <el-input v-model="dealerData.describeInfo" size="large" placeholder="请输入描述信息" clearable />
            </el-form-item>
            <el-form-item prop="address" label="省市区:">
                <el-cascader v-model="ssqArr" size="large" :options="pcaTextArr" @change="handleChange" clearable>
                </el-cascader>
            </el-form-item>
            <el-form-item prop="detailAddress" label="详细地址:">
                <el-input v-model="dealerData.detailAddress" size="large" placeholder="请输入详细地址" clearable />
            </el-form-item>
        </el-form>
        <template #footer>
            <div style="flex: auto">
                <el-button @click="handleClose">取消</el-button>
                <el-button type="primary" @click="title == '添加经销商' ? addDealer() : updateDealer();">确认</el-button>
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