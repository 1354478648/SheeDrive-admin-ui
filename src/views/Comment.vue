<script setup>
import { ref } from 'vue'
import { commentListService, commentDeleteService } from '@/api/comment'
import { useInfoStore } from '@/stores/info';
const infoStore = useInfoStore()
import { checkRole } from '@/utils/other.js'
import { ElMessage } from 'element-plus';

// 当前登录的角色
const role = ref(checkRole(infoStore.info))

// 搜索对象
const searchData = ref({
    orderId: '',
    dealerName: '',
    carName: '',
    beforeDate: '',
    afterDate: '',
})

const page = ref(1)
const size = ref(5)
const total = ref(0)

const dateTimeRange = ref([])

// 评论列表数据模型
const comment = ref([])

// 重置搜索对象
const clearSearchData = () => {
    searchData.value = {
        orderId: '',
        dealerName: '',
        carName: '',
        beforeDate: '',
        afterDate: '',
    }
    dateTimeRange.value = []
    page.value = 1
    size.value = 5
}

// 获取管理员分页数据
const getCommentList = async () => {
    const params = {
        orderId: searchData.value.orderId ? searchData.value.orderId : null,
        dealerName: (role.value ? infoStore.info.name : (searchData.value.dealerName ? searchData.value.dealerName : null)),
        carName: searchData.value.carName ? searchData.value.carName : null,
        beforeDate: dateTimeRange.value[0] ? dateTimeRange.value[0] : null,
        afterDate: dateTimeRange.value[1] ? dateTimeRange.value[1] : null,
        page: page.value,
        size: size.value
    }

    let result = await commentListService(params)

    page.value = result.data.Page
    size.value = result.data.Size
    total.value = result.data.Total
    comment.value = result.data.List
}
getCommentList()

// 当前页码发生变化时，调用此函数
const handleCurrentChange = (newPage) => {
    page.value = newPage
    getCommentList()
}
// 每页条数发生变化时，调用此函数
const handleSizeChange = (newSize) => {
    size.value = newSize
    getCommentList()
}

const delComment = (id) => {
    ElMessageBox.confirm(
        `确认删除该评论吗？`,
        '提示',
        {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning',
        }
    )
        .then(async () => {
            await commentDeleteService(id)
            ElMessage({
                type: 'success',
                message: '删除成功',
            })
            getCommentList()
        }
        )
        .catch(() => { })
}
</script>

<template>
    <el-card class="el-card">
        <template #header>
            <div class="card-header">
                <span>评论管理</span>
            </div>
        </template>
        <!-- 搜索栏 -->
        <el-form class="search-container" :model="searchData">
            <div class="search-input">
                <el-form-item label="订单ID:" style="margin-right: 18px;">
                    <el-input v-model="searchData.orderId" placeholder="请输入订单ID" suffix-icon="Search" />
                </el-form-item>
                <el-form-item label="经销商名:" v-if="!role" style="margin-right: 18px;">
                    <el-input v-model="searchData.dealerName" placeholder="请输入经销商名" suffix-icon="Search" />
                </el-form-item>
                <el-form-item label="汽车名:" style="margin-right: 18px;">
                    <el-input v-model="searchData.carName" placeholder="请输入汽车名" suffix-icon="Search" />
                </el-form-item>
                <el-form-item label="评论时间:" style="margin-right: 18px;">
                    <el-date-picker v-model="dateTimeRange" type="datetimerange" start-placeholder="请选择时间区间"
                        end-placeholder="请选择时间区间" value-format="YYYY-MM-DD hh:mm:ss" />
                </el-form-item>
            </div>
            <div class="button-container">
                <el-form-item class="search-button">
                    <el-button type="primary" @click="getCommentList">查询</el-button>
                    <el-button type="default" @click="clearSearchData(); getCommentList();">重置</el-button>
                </el-form-item>
            </div>

        </el-form>
        <!-- 管理员列表 -->
        <el-table :data="comment" style="width: 100%" stripe>
            <el-table-column label="订单号" sortable prop="orderId" width="200"></el-table-column>
            <el-table-column label="总评分" width="175">
                <template #default="{ row }">
                    <el-rate v-model="row.totalScore" disabled show-score text-color="#ff9900"
                        score-template="{value} 分" />
                </template>
            </el-table-column>
            <el-table-column label="经销商名" width="150">
                <template #default="{ row }">
                    {{ row.orderInfo.dealerInfo.name }}
                </template>
            </el-table-column>
            <el-table-column label="经销商评分" width="175">
                <template #default="{ row }">
                    <el-rate v-model="row.dealerScore" disabled show-score text-color="#ff9900"
                        score-template="{value} 分" />
                </template>
            </el-table-column>
            <el-table-column label="汽车名" width="200">
                <template #default="{ row }">
                    {{ row.orderInfo.carDetailInfo.year + ' ' + row.orderInfo.carDetailInfo.brand +
            row.orderInfo.carDetailInfo.model + ' ' +
            row.orderInfo.carDetailInfo.version }}
                </template>
            </el-table-column>
            <el-table-column label="经销商评分" width="175">
                <template #default="{ row }">
                    <el-rate v-model="row.carScore" disabled show-score text-color="#ff9900"
                        score-template="{value} 分" />
                </template>
            </el-table-column>
            <el-table-column label="评论内容" prop="content" width="200"></el-table-column>
            <el-table-column label="评论时间" sortable prop="createTime" width="200"></el-table-column>
            <el-table-column label="操作" width="75" v-if="!role">
                <template #default="{ row }">
                    <el-tooltip content="删除" placement="top" v-if="!role">
                        <el-button @click="delComment(row.id);" icon="Delete" circle plain type="danger"></el-button>
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
            width: 250px;

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