<script setup>
import { ref } from 'vue';
import { stockListService, stockAddService, stockDeleteService } from '@/api/stock';

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
                <el-form-item label="经销商名称:">
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
            <el-table-column label="ID" sortable prop="id" width="200"></el-table-column>
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
            :disabled="disabled" :background="background" layout="total, sizes, prev, pager, next, jumper" :total="total"
            @size-change="handleSizeChange" @current-change="handleCurrentChange"
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
        }

        .search-button {
            margin-left: 30px;
        }
    }
}
</style>