<script setup>
import { ref } from 'vue';
import { adminListService } from '@/api/admin';

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

// 管理员列表数据模型
const admin = ref([])

// {
//         "id": 1,
//         "name": "管理员",
//         "username": "admin",
//         "avatar": "https://sheedrive.oss-cn-shanghai.aliyuncs.com/images/2b5f42e2-10dc-4ae1-a003-21b7b1ac28e0.png",
//         "phone": "13812345678",
//         "status": 1,
//         "isRoot": 1,
//         "createTime": "2024-02-06 14:48:28",
//         "updateTime": "2024-02-06 14:48:28",
//         "deleteTime": null
//     },
//     {
//         "id": 2,
//         "name": "我是管理员",
//         "username": "iamadmin",
//         "avatar": "https://sheedrive.oss-cn-shanghai.aliyuncs.com/images/2b5f42e2-10dc-4ae1-a003-21b7b1ac28e0.png",
//         "phone": "13812345678",
//         "status": 1,
//         "isRoot": 1,
//         "createTime": "2024-02-06 14:48:28",
//         "updateTime": "2024-02-06 14:48:28",
//         "deleteTime": null
//     },
//     {
//         "id": 3,
//         "name": "管理员3",
//         "username": "admin3",
//         "avatar": "https://sheedrive.oss-cn-shanghai.aliyuncs.com/images/2b5f42e2-10dc-4ae1-a003-21b7b1ac28e0.png",
//         "phone": "13812345678",
//         "status": 1,
//         "isRoot": 1,
//         "createTime": "2024-02-06 14:48:28",
//         "updateTime": "2024-02-06 14:48:28",
//         "deleteTime": null
//     },

// 重置搜索对象
const clearSearchData = () => {
    searchData.value = {
        username: '',
        name: '',
        beforeDate: '',
        afterDate: '',
    }
    page.value = 1
    size.value = 5
}

// 获取管理员分页数据
const getAdminList = async () => {
    const params = {
        username: searchData.value.username ? searchData.value.username : null,
        name: searchData.value.name ? searchData.value.name : null,
        beforeDate: searchData.value.beforeDate ? searchData.value.beforeDate + " 00:00:00" : null,
        afterDate: searchData.value.afterDate ? searchData.value.afterDate + " 00:00:00" : null,
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
</script>

<template>
    <el-card class="el-card">
        <template #header>
            <div class="card-header">
                <span>管理员管理</span>
                <el-button type="primary">添加管理员</el-button>
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
                    <el-date-picker v-model="searchData.beforeDate" type="datetime" value-format="YYYY-MM-DD" placeholder="请选择日期区间" />
                    <span style="margin: 0 10px 0 10px;">-</span>
                    <el-date-picker v-model="searchData.afterDate" type="datetime" value-format="YYYY-MM-DD" placeholder="请选择日期区间" />
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
                    <el-avatar :size="40" :src="row.avatar" />
                </template>
            </el-table-column>
            <el-table-column label="手机号" prop="phone"></el-table-column>
            <el-table-column label="状态" prop="status" width="100">
                <template #default="{ row }">
                    <el-switch v-model="row.status" :active-value="1" :inactive-value="0"></el-switch>
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
                        <el-button icon="Edit" circle plain type="primary"></el-button>
                    </el-tooltip>
                    <el-tooltip content="重置密码" placement="top">
                        <el-button icon="RefreshRight" circle plain type="primary"></el-button>
                    </el-tooltip>
                    <el-tooltip content="删除" placement="top">
                        <el-button icon="Delete" circle plain type="danger"></el-button>
                    </el-tooltip>
                </template>
            </el-table-column>
            <template #empty>
                <el-empty description="没有数据" />
            </template>
        </el-table>
        <!-- 分页条 -->
        <el-pagination v-model:current-page="page" v-model:page-size="size" :page-sizes="[1, 2, 3]" :small="small"
            :disabled="disabled" :background="background" layout="total, sizes, prev, pager, next, jumper" :total="total"
            @size-change="handleSizeChange" @current-change="handleCurrentChange"
            style="margin-top: 20px; justify-content: flex-end" />
    </el-card>
</template>

<style scoped>
.el-card {
    flex: 1;
    margin-bottom: 30px;

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