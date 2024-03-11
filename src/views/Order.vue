<script setup>
import { ref } from 'vue'
import { orderListService, orderGetByIdService, orderUpdateCancelService, orderUpdateConfirmService, orderUpdateSignService, orderUpdateStartService, orderUpdateEndService, orderUpdateEndAllService, orderDeleteService } from '@/api/order'
import { useInfoStore } from '@/stores/info';
const infoStore = useInfoStore()
import { checkRole } from '@/utils/other.js'
import { ElMessage } from 'element-plus';
import { formatDate } from '@/utils/other.js'

// 当前登录的角色
const role = ref(checkRole(infoStore.info))

// 订单详情窗口的开关
const showDialog = ref(false)

// 搜索对象
const searchData = ref({
    userName: '',
    dealerName: '',
    carName: '',
    status: null,
    orderDate: '',
})

// 订单操作对象
const data = ref({
    id: ''
})

const page = ref(1)
const size = ref(5)
const total = ref(0)

// 订单列表数据模型
const order = ref([])

// 重置搜索对象
const clearSearchData = () => {
    searchData.value = {
        userName: '',
        dealerName: '',
        carName: '',
        status: null,
        orderDate: '',
    }
    page.value = 1
    size.value = 5
}

const getOrderList = async () => {
    const params = {
        userName: searchData.value.userName ? searchData.value.userName : null,
        dealerName: (role.value ? infoStore.info.name : (searchData.value.dealerName ? searchData.value.dealerName : null)),
        carName: searchData.value.carName ? searchData.value.carName : null,
        status: searchData.value.status + 2 ? searchData.value.status : null,
        orderDate: searchData.value.orderDate ? searchData.value.orderDate : null,
        page: page.value,
        size: size.value
    }
    let result = await orderListService(params)

    page.value = result.data.Page
    size.value = result.data.Size
    total.value = result.data.Total
    order.value = result.data.List
}
getOrderList()

const OrderDetail = ref()
const getOrderById = async (id) => {
    let result = await orderGetByIdService(id)
    OrderDetail.value = result.data.orderInfo

    showDialog.value = true
}

// 当前页码发生变化时，调用此函数
const handleCurrentChange = (newPage) => {
    page.value = newPage
    getOrderList()
}
// 每页条数发生变化时，调用此函数
const handleSizeChange = (newSize) => {
    size.value = newSize
    getOrderList()
}

// 给日期选择器提供的快捷输入选项
const shortcuts = [
    {
        text: '今天',
        value: new Date(),
    },
    {
        text: '明天',
        value: () => {
            const date = new Date()
            date.setTime(date.getTime() + 3600 * 1000 * 24)
            return date
        },
    },
    {
        text: '昨天',
        value: () => {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24)
            return date
        },
    }
]

const statusOptions = [
    { value: -1, label: "异常" },
    { value: 0, label: "取消" },
    { value: 1, label: "未确认" },
    { value: 2, label: "已确认" },
    { value: 3, label: "签署协议" },
    { value: 4, label: "试驾中" },
    { value: 5, label: "试驾结束" },
    { value: 6, label: "待评价" },
    { value: 7, label: "已评价" },
]

const orderUpdateCancel = async (id) => {
    ElMessageBox.confirm(
        `确认取消订单(订单号:${id})吗？`,
        '提示',
        {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning',
        }
    )
        .then(async () => {
            data.value.id = id
            await orderUpdateCancelService(data.value)
            ElMessage({
                type: 'success',
                message: '取消成功',
            })
            getOrderList()
        }
        )
        .catch(() => { })
}

const orderUpdateConfirm = async (id) => {
    ElMessageBox.confirm(
        `请确认您和用户已取得联系！`,
        '提示',
        {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning',
        }
    )
        .then(async () => {
            data.value.id = id
            await orderUpdateConfirmService(data.value)
            ElMessage({
                type: 'success',
                message: '订单确认成功',
            })
            getOrderList()
        }
        )
        .catch(() => { })
}

const orderUpdateSign = async (id) => {
    let result = await orderGetByIdService(id)
    const orderTime = result.data.orderInfo.orderTime
    const currentDate = new Date();
    if (formatDate(currentDate) < orderTime) {
        ElMessage.error("还未到预定时间！")
        return
    }

    ElMessageBox.confirm(
        `请确认用户已知晓并签署试驾协议！`,
        '提示',
        {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning',
        }
    )
        .then(async () => {
            data.value.id = id
            await orderUpdateSignService(data.value)
            ElMessage({
                type: 'success',
                message: '订单切换状态成功',
            })
            getOrderList()
        }
        )
        .catch(() => { })
}

const orderUpdateStart = async (id) => {
    ElMessageBox.confirm(
        `请确认用户即将(或已经)开始试驾！`,
        '提示',
        {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning',
        }
    )
        .then(async () => {
            data.value.id = id
            await orderUpdateStartService(data.value)
            ElMessage({
                type: 'success',
                message: '订单切换状态成功',
            })
            getOrderList()
        }
        )
        .catch(() => { })
}

const orderUpdateEnd = async (id) => {
    ElMessageBox.confirm(
        `请确认用户即将(或已经)结束试驾！`,
        '提示',
        {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning',
        }
    )
        .then(async () => {
            data.value.id = id
            await orderUpdateEndService(data.value)
            ElMessage({
                type: 'success',
                message: '订单切换状态成功',
            })
            getOrderList()
        }
        )
        .catch(() => { })
}

const orderUpdateEndAll = async (id) => {
    ElMessageBox.confirm(
        `请确认所有订单流程是否都结束了！`,
        '提示',
        {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning',
        }
    )
        .then(async () => {
            data.value.id = id
            await orderUpdateEndAllService(data.value)
            ElMessage({
                type: 'success',
                message: '订单切换状态成功',
            })
            getOrderList()
        }
        )
        .catch(() => { })
}

const orderDelete = async (id) => {
    ElMessageBox.confirm(
        `确认删除订单(订单号:${id})吗？`,
        '提示',
        {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning',
        }
    )
        .then(async () => {
            await orderDeleteService(id)
            ElMessage({
                type: 'success',
                message: '订单删除成功',
            })
            getOrderList()
        }
        )
        .catch(() => { })
}
</script>

<template>
    <el-card class="el-card">
        <template #header>
            <div class="card-header">
                <span>订单管理</span>
            </div>
        </template>
        <!-- 搜索栏 -->
        <el-form class="search-container" :model="searchData">
            <div class="search-input">
                <el-form-item label="用户姓名:" style="margin-right: 18px;">
                    <el-input v-model="searchData.userName" placeholder="请输入用户姓名" suffix-icon="Search" />
                </el-form-item>
                <el-form-item label="经销商名:" v-if="!role" style="margin-right: 18px;">
                    <el-input v-model="searchData.dealerName" placeholder="请输入经销商名" suffix-icon="Search" />
                </el-form-item>
                <el-form-item label="汽车名:" style="margin-right: 18px;">
                    <el-input v-model="searchData.carName" placeholder="请输入汽车名" suffix-icon="Search" />
                </el-form-item>
                <el-form-item label="订单状态:" style="margin-right: 18px;">
                    <el-select v-model="searchData.status" placeholder="请选择订单状态">
                        <el-option v-for="item in statusOptions" :key="item.value" :label="item.label"
                            :value="item.value" />
                    </el-select>
                </el-form-item>
                <el-form-item label="预定时间:">
                    <el-date-picker v-model="searchData.orderDate" type="date" placeholder="请选择订单的预定时间"
                        :shortcuts="shortcuts" value-format="YYYY-MM-DD" />
                </el-form-item>
            </div>
            <div class="button-container">
                <el-form-item class="search-button">
                    <el-button type="primary" @click="getOrderList">查询</el-button>
                    <el-button type="default" @click="clearSearchData(); getOrderList();">重置</el-button>
                </el-form-item>
            </div>

        </el-form>
        <!-- 管理员列表 -->
        <el-table :data="order" style="width: 100%" stripe>
            <el-table-column label="ID" sortable prop="id"></el-table-column>
            <el-table-column label="用户姓名">
                <template #default="{ row }">
                    {{ row.userInfo.lastName + row.userInfo.firstName }}
                </template>
            </el-table-column>
            <el-table-column label="经销商名">
                <template #default="{ row }">
                    {{ row.dealerInfo.name }}
                </template>
            </el-table-column>
            <el-table-column label="汽车名">
                <template #default="{ row }">
                    {{ row.carDetailInfo.year + ' ' + row.carDetailInfo.brand + row.carDetailInfo.model + ' ' +
            row.carDetailInfo.version }}
                </template>
            </el-table-column>
            <el-table-column label="用户手机号" width="150">
                <template #default="{ row }">
                    {{ row.userInfo.phone }}
                </template>
            </el-table-column>
            <el-table-column label="用户地址">
                <template #default="{ row }">
                    {{ row.address.province + ' ' + row.address.city + ' ' + row.address.district + ' ' +
            row.address.detail }}
                </template>
            </el-table-column>
            <el-table-column label="状态" prop="status" width="100" :filters="[
            { text: '异常', value: -1 },
            { text: '取消', value: 0 },
            { text: '未确认', value: 1 },
            { text: '已确认', value: 2 },
            { text: '签署协议', value: 3 },
            { text: '试驾中', value: 4 },
            { text: '试驾结束', value: 5 },
            { text: '待评价', value: 6 },
            { text: '已评价', value: 7 },
        ]" :filter-method="filterStatus" filter-placement="bottom-end">
                <template #default="{ row }">
                    <el-tag color="#f78989" v-if="row.status == -1" effect="dark">异常</el-tag>
                    <el-tag type="danger" v-if="row.status == 0">取消</el-tag>
                    <el-tag type="warning" v-if="row.status == 1">未确认</el-tag>
                    <el-tag type="primary" v-if="row.status == 2">已确认</el-tag>
                    <el-tag color="#66b1ff" v-if="row.status == 3" effect="dark">签署协议</el-tag>
                    <el-tag color="#a77730" v-if="row.status == 4" effect="dark">试驾中</el-tag>
                    <el-tag color="#85ce61" v-if="row.status == 5" effect="dark">试驾结束</el-tag>
                    <el-tag color="#ebb563" v-if="row.status == 6" effect="dark">待评价</el-tag>
                    <el-tag type="success" v-if="row.status == 7">已评价</el-tag>
                </template>
            </el-table-column>
            <el-table-column label="预定时间" sortable prop="orderTime" width="200">
                <template #default="{ row }">
                    {{ row.orderTime.substring(0, 10) }}
                </template>
            </el-table-column>
            <el-table-column label="操作" width="200">
                <template #default="{ row }">
                    <el-tooltip content="查看详情" placement="top">
                        <el-button @click="getOrderById(row.id);" icon="MoreFilled" circle plain
                            type="primary"></el-button>
                    </el-tooltip>
                    <el-tooltip content="确认订单" placement="top" v-if="row.status == 1">
                        <el-button @click="orderUpdateConfirm(row.id);" icon="Check" circle plain
                            type="success"></el-button>
                    </el-tooltip>
                    <el-tooltip content="签署协议" placement="top" v-if="row.status == 2">
                        <el-button @click="orderUpdateSign(row.id);" icon="EditPen" circle plain
                            type="success"></el-button>
                    </el-tooltip>
                    <el-tooltip content="试驾开始" placement="top" v-if="row.status == 3">
                        <el-button @click="orderUpdateStart(row.id);" icon="VideoPlay" circle plain
                            type="success"></el-button>
                    </el-tooltip>
                    <el-tooltip content="试驾结束" placement="top" v-if="row.status == 4">
                        <el-button @click="orderUpdateEnd(row.id);" icon="VideoPause" circle plain
                            type="success"></el-button>
                    </el-tooltip>
                    <el-tooltip content="完成订单" placement="top" v-if="row.status == 5">
                        <el-button @click="orderUpdateEndAll(row.id);" icon="CircleCheck" circle plain
                            type="success"></el-button>
                    </el-tooltip>
                    <el-tooltip content="取消订单" placement="top" v-if="row.status == 1">
                        <el-button @click="orderUpdateCancel(row.id);" icon="Close" circle plain
                            type="danger"></el-button>
                    </el-tooltip>
                    <el-tooltip content="删除" placement="top" v-if="!role">
                        <el-button @click="orderDelete(row.id);" icon="Delete" circle plain type="danger"></el-button>
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

    <el-dialog v-model="showDialog" title="订单详情" width="80%" draggable>
        <span>
            <el-descriptions class="margin-top" :title="'订单号: ' + OrderDetail.id" :column="3" border>
                <el-descriptions-item>
                    <template #label>
                        <div class="cell-item">
                            <el-icon style="margin-right: 5px;">
                                <user />
                            </el-icon>
                            用户姓名
                        </div>
                    </template>
                    {{ OrderDetail.userInfo.lastName + OrderDetail.userInfo.firstName }}
                </el-descriptions-item>
                <el-descriptions-item>
                    <template #label>
                        <div class="cell-item">
                            <el-icon style="margin-right: 5px;">
                                <iphone />
                            </el-icon>
                            联系电话
                        </div>
                    </template>
                    {{ OrderDetail.userInfo.phone }}
                </el-descriptions-item>
                <el-descriptions-item>
                    <template #label>
                        <div class="cell-item">
                            <el-icon style="margin-right: 5px;">
                                <Female />
                            </el-icon>
                            性别
                        </div>
                    </template>
                    {{ OrderDetail.userInfo.sex }}
                </el-descriptions-item>
                <el-descriptions-item>
                    <template #label>
                        <div class="cell-item">
                            <el-icon style="margin-right: 5px;">
                                <Postcard />
                            </el-icon>
                            身份证号
                        </div>
                    </template>
                    {{ OrderDetail.userInfo.idNumber }}
                </el-descriptions-item>
                <el-descriptions-item>
                    <template #label>
                        <div class="cell-item">
                            <el-icon style="margin-right: 5px;">
                                <LocationInformation />
                            </el-icon>
                            用户地址
                        </div>
                    </template>
                    {{ OrderDetail.address.province + ' ' + OrderDetail.address.city + ' ' +
            OrderDetail.address.district
            + ' ' + OrderDetail.address.detail }}
                </el-descriptions-item>
                <el-descriptions-item>
                    <template #label>
                        <div class="cell-item">
                            <el-icon style="margin-right: 5px;">
                                <User />
                            </el-icon>
                            用户名
                        </div>
                    </template>
                    {{ OrderDetail.userInfo.username }}
                </el-descriptions-item>
                <el-descriptions-item>
                    <template #label>
                        <div class="cell-item">
                            <el-icon style="margin-right: 5px;">
                                <OfficeBuilding />
                            </el-icon>
                            经销商
                        </div>
                    </template>
                    {{ OrderDetail.dealerInfo.name }}
                </el-descriptions-item>
                <el-descriptions-item>
                    <template #label>
                        <div class="cell-item">
                            <el-icon style="margin-right: 5px;">
                                <LocationInformation />
                            </el-icon>
                            经销商地址
                        </div>
                    </template>
                    {{ OrderDetail.dealerInfo.address.Province + ' ' + OrderDetail.dealerInfo.address.City + ' ' +
            OrderDetail.dealerInfo.address.District + ' ' + OrderDetail.dealerInfo.address.Detail }}
                </el-descriptions-item>
                <el-descriptions-item>
                    <template #label>
                        <div class="cell-item">
                            <el-icon style="margin-right: 5px;">
                                <Phone />
                            </el-icon>
                            经销商联系电话
                        </div>
                    </template>
                    {{ OrderDetail.dealerInfo.phone }}
                </el-descriptions-item>
                <el-descriptions-item>
                    <template #label>
                        <div class="cell-item">
                            <el-icon style="margin-right: 5px;">
                                <Van />
                            </el-icon>
                            试驾车辆
                        </div>
                    </template>
                    {{ OrderDetail.carDetailInfo.year + ' ' + OrderDetail.carDetailInfo.brand + ' ' +
            OrderDetail.carDetailInfo.model + ' ' + OrderDetail.carDetailInfo.version }}
                </el-descriptions-item>
                <el-descriptions-item>
                    <template #label>
                        <div class="cell-item">
                            <el-icon style="margin-right: 5px;">
                                <Upload />
                            </el-icon>
                            订单创建时间
                        </div>
                    </template>
                    {{ OrderDetail.createTime }}
                </el-descriptions-item>
                <el-descriptions-item>
                    <template #label>
                        <div class="cell-item">
                            <el-icon style="margin-right: 5px;">
                                <Timer />
                            </el-icon>
                            订单预定时间
                        </div>
                    </template>
                    {{ OrderDetail.orderTime.substring(0, 10) }}
                </el-descriptions-item>
                <el-descriptions-item>
                    <template #label>
                        <div class="cell-item">
                            <el-icon style="margin-right: 5px;">
                                <Operation />
                            </el-icon>
                            订单进度
                        </div>
                    </template>
                    <el-tag color="#f78989" v-if="OrderDetail.status == -1" effect="dark">订单异常</el-tag>
                    <el-tag type="danger" v-if="OrderDetail.status == 0">订单取消</el-tag>
                    <el-steps v-if="OrderDetail.status != -1 && OrderDetail.status != 0"
                        style="max-width: 100%;margin: 20px 0 10px 0;" :active="OrderDetail.status" align-center>
                        <el-step title="未确认" :description="'订单已生成'" />
                        <el-step title="已确认"
                            :description="OrderDetail.confirmTime ? OrderDetail.confirmTime : '请联系用户后再确认订单'" />
                        <el-step title="签署协议"
                            :description="OrderDetail.signTime ? OrderDetail.signTime : '请确保用户知晓并签署试驾协议'" />
                        <el-step title="试驾中"
                            :description="OrderDetail.startTime ? OrderDetail.startTime : '请确保用户开始试驾'" />
                        <el-step title="试驾结束" :description="OrderDetail.endTime ? OrderDetail.endTime : '请确保用户结束试驾'" />
                        <el-step title="待评价"
                            :description="OrderDetail.precommentTime ? OrderDetail.precommentTime : '请确保完成试驾的所有流程'" />
                        <el-step title="已评价"
                            :description="OrderDetail.commentTime ? OrderDetail.commentTime : '请等待用户填写评价'" />
                    </el-steps>
                </el-descriptions-item>
            </el-descriptions>
        </span>
        <template #footer>
            <div class="dialog-footer">
                <el-button type="primary" @click="showDialog = false">
                    确认
                </el-button>
            </div>
        </template>
    </el-dialog>
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
            flex-wrap: wrap;
        }

        .button-container {
            display: flex;
            width: 300px;

            .search-button {
                margin-left: 30px;
            }
        }
    }

}

.cell-item {
    display: flex;
    align-items: center;
}
</style>