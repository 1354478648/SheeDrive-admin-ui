<script setup>
import { ref } from 'vue';
import { userListService, userUpdateStatusService, userDeleteService } from '@/api/user';
import { maskStr } from '@/utils/other';

// 搜索对象
const searchData = ref({
    username: '',
    name: '',
    status: -1,
    beforeDate: '',
    afterDate: '',
})

const page = ref(1)
const size = ref(5)
const total = ref(0)

const dateTimeRange = ref([])

// 用户列表数据模型
const user = ref([])

// 重置搜索对象
const clearSearchData = () => {
    searchData.value = {
        username: '',
        name: '',
        status: -1,
        beforeDate: '',
        afterDate: '',
    }
    dateTimeRange.value = []
    page.value = 1
    size.value = 5
}

// 获取管理员分页数据
const getUserList = async () => {
    const params = {
        username: searchData.value.username ? searchData.value.username : null,
        name: searchData.value.name ? searchData.value.name : null,
        status: searchData.value.status ? searchData.value.status : null,
        beforeDate: dateTimeRange.value[0] ? dateTimeRange.value[0] : null,
        afterDate: dateTimeRange.value[1] ? dateTimeRange.value[1] : null,
        page: page.value,
        size: size.value
    }

    let result = await userListService(params)

    // 将ID转为字符串，避免失去精度
    const modifiedUserList = result.data.List.map(user => {
        return {
            ...user,
            id: user.id.toString() // 转换为字符串
        };
    });
    console.log(modifiedUserList)


    page.value = result.data.Page
    size.value = result.data.Size
    total.value = result.data.Total
    user.value = modifiedUserList
}
getUserList()

const filterStatus = (value, row) => {
    return row.status === value
}

// 当前页码发生变化时，调用此函数
const handleCurrentChange = (newPage) => {
    page.value = newPage
    getUserList()
}
// 每页条数发生变化时，调用此函数
const handleSizeChange = (newSize) => {
    size.value = newSize
    getUserList()
}

// 管理员切换状态
const onSwitchChange = async (id) => {
    await userUpdateStatusService(id)
}

const delUser = (row) => {
    ElMessageBox.confirm(
        `确认删除用户 ${row.lastName}${row.firstName} 吗？`,
        '提示',
        {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning',
        }
    )
        .then(async () => {
            await userDeleteService(row.id)
            ElMessage({
                type: 'success',
                message: '删除成功',
            })
            getUserList()
        }
        )
        .catch(() => { })
}

const isHovering = ref(false)
</script>

<template>
    <el-card class="el-card">
        <template #header>
            <div class="card-header">
                <span>用户管理</span>
            </div>
        </template>
        <!-- 搜索栏 -->
        <el-form class="search-container" :model="searchData">
            <div class="search-input">
                <el-form-item label="用户名:" style="margin-right: 18px;">
                    <el-input v-model="searchData.username" placeholder="请输入用户名" suffix-icon="Search" />
                </el-form-item>
                <el-form-item label="姓名:" style="margin-right: 18px;">
                    <el-input v-model="searchData.name" placeholder="请输入姓名" suffix-icon="Search" />
                </el-form-item>
                <el-form-item label="创建日期:">
                    <el-date-picker v-model="dateTimeRange" type="datetimerange" start-placeholder="请选择时间区间"
                        end-placeholder="请选择时间区间" value-format="YYYY-MM-DD hh:mm:ss" />
                </el-form-item>
            </div>
            <div class="button-container">
                <el-form-item class="search-button">
                    <el-button type="primary" @click="getUserList">查询</el-button>
                    <el-button type="default" @click="clearSearchData(); getUserList();">重置</el-button>
                </el-form-item>
            </div>
        </el-form>
        <!-- 用户列表 -->
        <el-table :data="user" style="width: 100%" stripe @cell-mouse-enter="isHovering = true;"
            @cell-mouse-leave="isHovering = false;">
            <el-table-column label="ID" sortable prop="id" width="200"></el-table-column>
            <el-table-column label="用户名" prop="username" width="150"></el-table-column>
            <el-table-column label="姓名" prop="name" width="100">
                <template #default="{ row }">
                    {{ row.lastName + row.firstName }}
                </template>
            </el-table-column>
            <el-table-column label="头像" prop="avatar" width="100">
                <template #default="{ row }">
                    <el-avatar :size="40" :src="row.avatar ? row.avatar : 'src/assets/default_avatar.jpg'" />
                </template>
            </el-table-column>
            <el-table-column label="手机号" width="150">
                <template #default="{ row }">
                    {{ isHovering ? row.phone : maskStr(row.phone, 4) }}
                </template>
            </el-table-column>
            <el-table-column label="身份证号" width="200">
                <template #default="{ row }">
                    {{ isHovering ? row.idNumber : maskStr(row.idNumber, 8) }}
                </template>
            </el-table-column>
            <el-table-column label="性别" prop="sex" width="100"></el-table-column>
            <el-table-column label="生日" width="150"> <template #default="{ row }">
                    {{ row.birthday.substring(0, 10) }}
                </template>
            </el-table-column>
            <el-table-column label="状态" prop="status" width="100" :filters="[
            { text: '启用', value: 1 },
            { text: '禁用', value: 0 },
        ]" :filter-method="filterStatus" filter-placement="bottom-end">
                <template #default="{ row }">
                    <el-switch v-model="row.status" @change="onSwitchChange(row.id)" :disabled="row.isRoot"
                        :active-value="1" :inactive-value="0"></el-switch>
                </template>
            </el-table-column>
            <el-table-column label="创建时间" sortable prop="createTime" width="200"></el-table-column>
            <el-table-column label="操作">
                <template #default="{ row }">
                    <el-tooltip content="删除" placement="top">
                        <el-button @click="delUser(row)" icon="Delete" circle plain type="danger"></el-button>
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

            .search-button {
                margin-left: 30px;
            }
        }
    }
}
</style>