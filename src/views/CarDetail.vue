<script setup>
import { ref, onMounted, watch, nextTick } from 'vue';
import { carDetailListService, carDetailAddService, carDetailDeleteService, carDetailUpdateService } from '@/api/cardetail';
import { ElMessage } from 'element-plus';
import { rowKey } from 'element-plus/es/components/table-v2/src/common';

// 搜索对象
const searchData = ref({
    year: '',
    brand: '',
    model: '',
    lowPrice: null,
    highPrice: null,
})

const page = ref(1)
const size = ref(5)
const total = ref(0)

// 控制抽屉的开关
const drawer = ref(false)
// 定义变量，用于控制弹窗标题的显示
const title = ref('')

// 管理员列表数据模型
const cardetail = ref([])

// 获取管理员分页数据
const previewSrcList = []
const getCarDetailList = async () => {
    console.log(searchData.value.year)

    const params = {
        year: searchData.value.year ? searchData.value.year : null,
        brand: searchData.value.brand ? searchData.value.brand : null,
        model: searchData.value.model ? searchData.value.model : null,
        lowPrice: searchData.value.lowPrice ? searchData.value.lowPrice : null,
        highPrice: searchData.value.highPrice ? searchData.value.highPrice : null,
        page: page.value,
        size: size.value
    }

    let result = await carDetailListService(params)

    page.value = result.data.Page
    size.value = result.data.Size
    total.value = result.data.Total
    cardetail.value = result.data.List

    for (let i = 0; i < cardetail.value.length; i++) {
        // 获取当前汽车信息对象的图片属性值，并添加到预览数组中
        let imageSrc = cardetail.value[i].image;
        previewSrcList.push(imageSrc);
    }
}
getCarDetailList()


// 重置搜索对象
const clearSearchData = () => {
    searchData.value = {
        year: '',
        brand: '',
        model: '',
        lowPrice: null,
        highPrice: null,
    }
    page.value = 1
    size.value = 5
}

// 筛选分类
const filterCategory = (value, row) => {
    return row.category === value
}

// 筛选驱动类型
const filterType = (value, row) => {
    return row.type === value
}

// 当前页码发生变化时，调用此函数
const handleCurrentChange = (newPage) => {
    page.value = newPage
    getCarDetailList()
}
// 每页条数发生变化时，调用此函数
const handleSizeChange = (newSize) => {
    size.value = newSize
    getCarDetailList()
}
</script>

<template>
    <el-card class="el-card">
        <template #header>
            <div class="card-header">
                <span>汽车信息管理</span>
                <el-button type="primary" @click="title = '添加汽车信息'; drawer = true;">添加汽车信息</el-button>
            </div>
        </template>
        <!-- 搜索栏 -->
        <el-form class="search-container" :model="searchData" label-width="80">
            <div class="search-input">
                <div class="input-box">
                    <el-form-item label="年份:">
                        <el-date-picker v-model="searchData.year" type="year" value-format="YYYY" placeholder="请选择年份" />
                    </el-form-item>
                </div>
                <div class="input-box">
                    <el-form-item label="品牌:" style="margin-left: 18px;">
                        <el-input v-model="searchData.brand" placeholder="请输入品牌" suffix-icon="Search" />
                    </el-form-item>
                </div>
                <div class="input-box">
                    <el-form-item label="型号:" style="margin-left: 18px;">
                        <el-input v-model="searchData.model" placeholder="请输入型号" suffix-icon="Search" />
                    </el-form-item>
                </div>
                <div class="input-box"></div>
                <div class="input-box">
                    <el-form-item label="分类:">
                        <el-select v-model="value" placeholder="请选择分类">
                            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
                        </el-select>
                    </el-form-item>
                </div>
                <div class="input-box">
                    <el-form-item label="驱动类型:" style="margin-left: 18px;">
                        <el-select v-model="value" placeholder="请选择驱动类型">
                            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
                        </el-select>
                    </el-form-item>
                </div>
                <div class="input-box">
                    <el-form-item label="最低价格:" style="margin-left: 18px;">
                        <el-input v-model="searchData.lowPrice"
                            :formatter="(value) => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                            :parser="(value) => value.replace(/\￥\s?|(,*)/g, '')" placeholder="请输入最低价格" />
                    </el-form-item>
                </div>
                <!-- <span>-</span> -->
                <div class="input-box">
                    <el-form-item label="最低价格:" style="margin-left: 18px;">
                        <el-input v-model="searchData.highPrice"
                            :formatter="(value) => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                            :parser="(value) => value.replace(/\￥\s?|(,*)/g, '')" placeholder="请输入最高价格" />
                    </el-form-item>
                </div>
            </div>
            <el-form-item class="search-button">
                <el-button type="primary" @click="getCarDetailList">查询</el-button>
                <el-button type="default" @click="clearSearchData(); getCarDetailList();">重置</el-button>
            </el-form-item>
        </el-form>
        <!-- 汽车信息列表 -->
        <el-table :data="cardetail" style="width: 100%" stripe @cell-mouse-enter="handleCellMouseEnter">
            <el-table-column label="ID" sortable prop="id" width="100"></el-table-column>
            <el-table-column label="年份" prop="year" width="100"></el-table-column>
            <el-table-column label="品牌" prop="brand" width="100"></el-table-column>
            <el-table-column label="型号" prop="model" width="100"> </el-table-column>
            <el-table-column label="版本" prop="version" width="200"> </el-table-column>
            <el-table-column label="图片" prop="image" width="150" type="index">
                <template #default="scope">
                    <el-image style="width: 125px; height:75px;"
                        :src="scope.row.image ? scope.row.image : 'src/assets/default-car-image.jpg'" :zoom-rate="1.2"
                        :max-scale="7" :min-scale="0.2" :preview-src-list="previewSrcList" :initial-index="scope.$index"
                        :infinite=false :preview-teleported=true fit="cover" />
                </template>
            </el-table-column>
            <el-table-column label="颜色" prop="color" width="75"></el-table-column>
            <el-table-column label="座位数" prop="seats" width="75"></el-table-column>
            <el-table-column label="分类" :filters="[
                { text: '其他', value: 0 },
                { text: '轿车', value: 1 },
                { text: 'SUV', value: 2 },
                { text: 'MPV', value: 3 },
                { text: '卡车', value: 4 },
                { text: '跑车', value: 5 },
            ]" :filter-method="filterCategory" filter-placement="bottom-end" width="100">
                <template #default="{ row }">
                    <el-tag v-if="row.category == 0" type="info">其他</el-tag>
                    <el-tag v-if="row.category == 1" type="primary">轿车</el-tag>
                    <el-tag v-if="row.category == 2" type="success">SUV</el-tag>
                    <el-tag v-if="row.category == 3" color="#66b1ff">MPV</el-tag>
                    <el-tag v-if="row.category == 4" type="warning">卡车</el-tag>
                    <el-tag v-if="row.category == 5" type="danger">跑车</el-tag>
                </template>
            </el-table-column>
            <el-table-column label="驱动类型" :filters="[
                { text: '其他', value: 0 },
                { text: '纯电动', value: 1 },
                { text: '插电混动', value: 2 },
                { text: '增程', value: 3 },
                { text: '汽油', value: 4 },
                { text: '汽油+48V轻混系统', value: 5 },
                { text: '油电混动', value: 6 },
                { text: '柴油', value: 7 },
            ]" :filter-method="filterType" filter-placement="bottom-end" width="100">
                <template #default="{ row }">
                    <el-tag v-if="row.type == 0" type="info" effect="dark">其他</el-tag>
                    <el-tag v-if="row.type == 1" type="success" effect="dark">纯电动</el-tag>
                    <el-tag v-if="row.type == 2" color="#85ce61" effect="dark">插电混动</el-tag>
                    <el-tag v-if="row.type == 3" color="#4e8e2f" effect="dark">增程</el-tag>
                    <el-tag v-if="row.type == 4" type="primary" effect="dark">汽油</el-tag>
                    <el-tag v-if="row.type == 5" color="#3e6b27" effect="dark">汽油+48V轻混系统</el-tag>
                    <el-tag v-if="row.type == 6" color="#2d481f" effect="dark">油电混动</el-tag>
                    <el-tag v-if="row.type == 7" type="danger" effect="dark">柴油</el-tag>
                </template>
            </el-table-column>
            <el-table-column label="指导价" width="200">
                <template #default="{ row }">
                    {{ "￥" + row.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") }}
                </template>
            </el-table-column>
            <!-- <el-table-column label="创建时间" sortable prop="createTime" width="200"></el-table-column> -->
            <el-table-column label="操作">
                <template #default="{ row }">
                    <el-tooltip content="编辑" placement="top">
                        <el-button @click="showDrawer(row);" icon="Edit" circle plain type="primary"
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

    <!-- 汽车信息添加&修改 -->
    <!-- <el-drawer v-model="drawer" :title="title" direction="rtl" :before-close="handleClose">
        <el-form :rules="rules" label-width="80px" :model="cardetailData" class="el-form">
            <el-form-item prop="name" label="姓名:">
                <el-input v-model="cardetailData.name" size="large" placeholder="请输入姓名" clearable />
            </el-form-item>
            <el-form-item prop="username" label="用户名:">
                <el-input v-model="cardetailData.username" size="large" placeholder="请输入用户名" clearable />
            </el-form-item>
            <el-form-item prop="phone" label="手机号:">
                <el-input v-model="cardetailData.phone" size="large" placeholder="请输入手机号" maxlength="11" show-word-limit
                    clearable />
            </el-form-item>
        </el-form>
        <template #footer>
            <div style="flex: auto">
                <el-button @click="handleClose">取消</el-button>
                <el-button type="primary" @click="title == '添加汽车信息' ? addAdmin() : updateAdmin();">确认</el-button>
            </div>
        </template>
    </el-drawer> -->
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
            width: 75%;

            .input-box {
                width: calc(100% / 4);
                /* 每列宽度为容器宽度的1/3 */
                padding: 5px;
                box-sizing: border-box;
            }
        }

        .search-button {
            margin-left: 30px;
        }
    }
}
</style>