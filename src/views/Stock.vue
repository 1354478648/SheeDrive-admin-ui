<script setup>
import { ref } from 'vue';
import { stockListService, stockDeleteService } from '@/api/stock';
import { carDetailGetByIdService } from '@/api/cardetail';
import { userListService, userAddService } from '@/api/user';
import { addressAddService } from '@/api/address'
import { orderAddService } from '@/api/order'
import { useInfoStore } from '@/stores/info';
const infoStore = useInfoStore()
import { checkRole } from '@/utils/other.js'
import { checkPhone, checkIdNumber } from '@/utils/validate';

// 当前登录的角色
const role = ref(checkRole(infoStore.info))

// 搜索对象
const searchData = ref({
    dealerName: '',
    carName: ''
})

const page = ref(1)
const size = ref(5)
const total = ref(0)

// 库存列表数据模型
const stock = ref([])

// 控制抽屉的开关
const drawer = ref(false)

const activeName = ref('haveAcc')
const handleClick = (e) => {
    activeName.value = e.props.name
}

// 重置搜索对象
const clearSearchData = () => {
    searchData.value = {
        dealerName: '',
        carName: ''
    }
    page.value = 1
    size.value = 5
}

// 获取库存分页数据
const getStockList = async () => {
    if (role.value) {
        searchData.value.dealerName = infoStore.info.name
    }

    const params = {
        dealerName: searchData.value.dealerName ? searchData.value.dealerName : null,
        carName: searchData.value.carName ? searchData.value.carName : null,
        page: page.value,
        size: size.value
    }

    let result = await stockListService(params)

    page.value = result.data.Page
    size.value = result.data.Size
    total.value = result.data.Total
    stock.value = result.data.List
}
getStockList()

// 当前页码发生变化时，调用此函数
const handleCurrentChange = (newPage) => {
    page.value = newPage
    getStockList()
}
// 每页条数发生变化时，调用此函数
const handleSizeChange = (newSize) => {
    size.value = newSize
    getStockList()
}

const delStock = (row) => {
    ElMessageBox.confirm(
        `确认删除这条库存记录吗？`,
        '提示',
        {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning',
        }
    )
        .then(async () => {
            await stockDeleteService(row.id)
            ElMessage({
                type: 'success',
                message: '删除成功',
            })
            getStockList()
        }
        )
        .catch(() => { })
}

// 定义表单校验规则
const rules = {
    lastName: [
        { required: true, message: '请输入用户的姓', trigger: 'blur' }
    ],
    firstName: [
        { required: true, message: '请输入用户的名', trigger: 'blur' }
    ],
    phone: [
        { required: true, message: '请输入手机号', trigger: 'blur' },
        { validator: checkPhone, trigger: 'blur' },
    ],
    username: [
        { required: true, message: '请输入手机号', trigger: 'blur' },
        { validator: checkPhone, trigger: 'blur' },
    ],
    idNumber: [
        { required: true, message: '请输入身份证号', trigger: 'blur' },
        { validator: checkIdNumber, trigger: 'blur' },
    ]
}

const carId = ref('')
const carName = ref('')
const addOrder = async (id) => {
    carId.value = id
    let result = await carDetailGetByIdService(id)
    carName.value = result.data.car_detail.brand + ' ' + result.data.car_detail.model + ' ' + result.data.car_detail.version

    drawer.value = true
}

const orderAddDataHaveAcc = ref({
    username: '',
})

const orderAddDataNoAcc = ref({
    lastName: '',
    firstName: '',
    idNumber: '',
    phone: ''
})

const clearOrderAddData = () => {
    orderAddDataHaveAcc.value.username = ''

    orderAddDataNoAcc.value = {
        lastName: '',
        firstName: '',
        idNumber: '',
        phone: ''
    }
}

const handleClose = () => {
    if (orderAddDataHaveAcc.value.username !== '' || orderAddDataNoAcc.value.lastName !== '' || orderAddDataNoAcc.value.idNumber !== '' || orderAddDataNoAcc.value.phone !== '') {
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
                clearOrderAddData()
            })
    } else {
        drawer.value = false
    }
}

const confirmAddOrder = async (carId) => {
    if (activeName.value == "haveAcc") {
        let userListResult = await userListService({
            username: orderAddDataHaveAcc.value.username,
        })
        let addressAddResult = await addressAddService({
            id: userListResult.data.List[0].id,
            province: infoStore.info.address.Province,
            city: infoStore.info.address.City,
            district: infoStore.info.address.District,
            detailAddress: infoStore.info.address.Detail,
        })
        const params = {
            userId: userListResult.data.List[0].id,
            dealerId: infoStore.info.id,
            carId,
            addrId: addressAddResult.data.id,
            orderTime: new Date().toISOString().split('T')[0],
        }
        let result = await orderAddService(params)
        ElMessage({
            type: 'success',
            message: `订单添加成功，订单号为${result.data.orderInfo.id}`,
        })
        drawer.value = false
        clearOrderAddData()
    }

    if (activeName.value == "noAcc") {
        let userAddResult = await userAddService({
            lastName: orderAddDataNoAcc.value.lastName,
            firstName: orderAddDataNoAcc.value.firstName,
            idNumber: orderAddDataNoAcc.value.idNumber,
            phone: orderAddDataNoAcc.value.phone,
            password: 123456,
            confirmPassword: 123456,
        })
        let addressAddResult = await addressAddService({
            id: userAddResult.data.user_info.id,
            province: infoStore.info.address.Province,
            city: infoStore.info.address.City,
            district: infoStore.info.address.District,
            detailAddress: infoStore.info.address.Detail,
        })
        const params = {
            userId: userAddResult.data.user_info.id,
            dealerId: infoStore.info.id,
            carId,
            addrId: addressAddResult.data.id,
            orderTime: new Date().toISOString().split('T')[0],
        }
        let result = await orderAddService(params)
        ElMessage({
            type: 'success',
            message: `订单添加成功，订单号为${result.data.orderInfo.id}`,
        })
        drawer.value = false
        clearOrderAddData()
    }
}

</script>

<template>
    <el-card class="el-card">
        <template #header>
            <div class="card-header">
                <span>库存管理</span>
            </div>
        </template>
        <!-- 搜索栏 -->
        <el-form class="search-container" :model="searchData">
            <div class="search-input">
                <el-form-item label="经销商名称:" v-if="!role">
                    <el-input v-model="searchData.dealerName" placeholder="请输入经销商名称" suffix-icon="Search" />
                </el-form-item>
                <el-form-item label="汽车名称:" style="margin-left:18px;">
                    <el-input v-model="searchData.carName" placeholder="请输入汽车名称" suffix-icon="Search" />
                </el-form-item>
            </div>
            <el-form-item class="search-button">
                <el-button type="primary" @click="getStockList">查询</el-button>
                <el-button type="default" @click="clearSearchData(); getStockList();">重置</el-button>
            </el-form-item>
        </el-form>
        <!-- 库存列表 -->
        <el-table :data="stock" style="width: 100%" stripe>
            <el-table-column label="ID" sortable prop="id" width="100"></el-table-column>
            <el-table-column label="操作" width="100" v-if="role">
                <template #default="{ row }">
                    <el-tooltip content="添加订单" placement="top">
                        <el-button @click="addOrder(row.carDetailInfo.id)" icon="Plus" plain type="primary"></el-button>
                    </el-tooltip>
                </template>
            </el-table-column>
            <el-table-column label="经销商名称" width="200">
                <template #default="{ row }">
                    {{ row.dealerInfo.name }}
                </template>
            </el-table-column>
            <el-table-column label="用户名" width="150">
                <template #default="{ row }">
                    {{ row.dealerInfo.username }}
                </template>
            </el-table-column>
            <el-table-column label="手机号" width="150">
                <template #default="{ row }">
                    {{ row.dealerInfo.phone }}
                </template>
            </el-table-column>
            <el-table-column label="在库汽车" width="300">
                <template #default="{ row }">
                    {{ row.carDetailInfo.year + ' ' + row.carDetailInfo.brand + row.carDetailInfo.model + ' ' +
            row.carDetailInfo.version }}
                </template>
            </el-table-column>
            <el-table-column label="地址" width="300">
                <template #default="{ row }">
                    {{ row.dealerInfo.address.Province + ' ' + row.dealerInfo.address.City + ' ' +
            row.dealerInfo.address.District + ' ' + row.dealerInfo.address.Detail }}
                </template>
            </el-table-column>
            <el-table-column label="入库时间" sortable prop="createTime" width="200"></el-table-column>
            <el-table-column label="操作" width="200">
                <template #default="{ row }">
                    <el-tooltip content="删除" placement="top">
                        <el-button @click="delStock(row)" icon="Delete" circle plain type="danger"
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
            :disabled="disabled" :background="background" layout="total, sizes, prev, pager, next, jumper"
            :total="total" @size-change="handleSizeChange" @current-change="handleCurrentChange"
            style="margin-top: 20px; justify-content: flex-end" />
    </el-card>

    <!-- 经销商添加&修改 -->
    <el-drawer v-model="drawer" title="添加订单" direction="rtl" :before-close="handleClose">
        <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
            <el-tab-pane label="已有账号" name="haveAcc">
                <el-form :rules="rules" label-width="100px" :model="orderAddDataHaveAcc" class="el-form">
                    <el-form-item prop="username" label="用户手机号码:">
                        <el-input v-model="orderAddDataHaveAcc.username" size="large" placeholder="请输入用户手机号码"
                            maxlength="11" show-word-limit clearable />
                    </el-form-item>
                    <el-form-item label="经销商名:">
                        <el-input :value="infoStore.info.name" size="large" disabled />
                    </el-form-item>
                    <el-form-item label="汽车名:">
                        <el-input :value="carName" size="large" disabled />
                    </el-form-item>
                    <el-form-item label="地址:">
                        <el-input
                            :value="infoStore.info.address.Province + ' ' + infoStore.info.address.City + ' ' + infoStore.info.address.District + ' ' + infoStore.info.address.Detail"
                            size="large" disabled />
                    </el-form-item>
                    <el-form-item label="预约时间:">
                        <el-input :value="new Date().toISOString().split('T')[0]" size="large" disabled />
                    </el-form-item>
                </el-form>
            </el-tab-pane>
            <el-tab-pane label="未有账号" name="noAcc">
                <el-form :rules="rules" label-width="100px" :model="orderAddDataNoAcc" class="el-form">
                    <el-form-item prop="lastName" label="用户的姓:">
                        <el-input v-model="orderAddDataNoAcc.lastName" size="large" placeholder="请输入用户的姓" clearable />
                    </el-form-item>
                    <el-form-item prop="firstName" label="用户的名:">
                        <el-input v-model="orderAddDataNoAcc.firstName" size="large" placeholder="请输入用户的名" clearable />
                    </el-form-item>
                    <el-form-item prop="idNumber" label="用户身份证号:">
                        <el-input v-model="orderAddDataNoAcc.idNumber" size="large" placeholder="请输入用户身份证号"
                            maxlength="18" show-word-limit clearable />
                    </el-form-item>
                    <el-form-item prop="phone" label="用户手机号码:">
                        <el-input v-model="orderAddDataNoAcc.phone" size="large" placeholder="请输入用户手机号码" maxlength="11"
                            show-word-limit clearable />
                    </el-form-item>
                    <el-form-item label="经销商名:">
                        <el-input :value="infoStore.info.name" size="large" disabled />
                    </el-form-item>
                    <el-form-item label="汽车名:">
                        <el-input :value="carName" size="large" disabled />
                    </el-form-item>
                    <el-form-item label="地址:">
                        <el-input
                            :value="infoStore.info.address.Province + ' ' + infoStore.info.address.City + ' ' + infoStore.info.address.District + ' ' + infoStore.info.address.Detail"
                            size="large" disabled />
                    </el-form-item>
                    <el-form-item label="预约时间:">
                        <el-input :value="new Date().toISOString().split('T')[0]" size="large" disabled />
                    </el-form-item>
                </el-form>
            </el-tab-pane>
        </el-tabs>
        <template #footer>
            <div style="flex: auto">
                <el-button @click="handleClose">取消</el-button>
                <el-button type="primary" @click="confirmAddOrder(carId)">确认添加</el-button>
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