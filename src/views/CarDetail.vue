<script setup>
import { ref } from 'vue';
import { carDetailListService, carDetailAddService, carDetailDeleteService, carDetailUpdateService } from '@/api/cardetail';
import { stockAddService } from '@/api/stock';
import { useInfoStore } from '@/stores/info';
const infoStore = useInfoStore()
import { useTokenStore } from '@/stores/token.js'
const tokenStore = useTokenStore()
import { ElMessage } from 'element-plus';
import { checkRole } from '@/utils/other.js'

// 当前登录的角色
const role = ref(checkRole(infoStore.info))

// 搜索对象
const searchData = ref({
    year: '',
    brand: '',
    model: '',
    category: null,
    type: null,
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
    const params = {
        year: searchData.value.year ? searchData.value.year : null,
        brand: searchData.value.brand ? searchData.value.brand : null,
        model: searchData.value.model ? searchData.value.model : null,
        category: searchData.value.category ? searchData.value.category : null,
        type: searchData.value.type ? searchData.value.type : null,
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

const categoryOptions = [
    { value: 0, label: "其他" },
    { value: 1, label: "轿车" },
    { value: 2, label: "SUV" },
    { value: 3, label: "MPV" },
    { value: 4, label: "卡车" },
    { value: 5, label: "跑车" },
]

const typeOptions = [
    { value: 0, label: "其他" },
    { value: 1, label: "纯电动" },
    { value: 2, label: "插电混动" },
    { value: 3, label: "增程" },
    { value: 4, label: "汽油" },
    { value: 5, label: "汽油+48V轻混系统" },
    { value: 6, label: "油电混动" },
    { value: 7, label: "柴油" },
]

// 重置搜索对象
const clearSearchData = () => {
    searchData.value = {
        year: '',
        brand: '',
        model: '',
        category: null,
        type: null,
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

// 汽车信息修改添加基类
const cardetailId = ref(null)
const cardetailData = ref({
    year: '',
    brand: '',
    model: '',
    version: '',
    image: '',
    category: null,
    price: null,
    type: null,
    seats: null,
    describeInfo: ''
})

// 定义表单校验规则
const rules = {
    year: [
        { required: true, message: '请选择年份', trigger: 'blur' },
        { pattern: /^\d{4}$/, message: '年份格式不正确', trigger: 'blur' }
    ],
    brand: [
        { required: true, message: '请输入品牌', trigger: 'blur' },
    ],
    model: [
        { required: true, message: '请输入型号', trigger: 'blur' },
    ],
    version: [
        { required: true, message: '请输入版本', trigger: 'blur' },
    ],
    image: [
        { required: true, message: '请上传图片', trigger: 'blur' },
    ],
    category: [
        { required: true, message: '请选择分类', trigger: 'blur' },
    ],
    price: [
        { required: true, message: '请输入指导价', trigger: 'blur' },
    ],
    type: [
        { required: true, message: '请选择驱动类型', trigger: 'blur' },
    ],
    seats: [
        { required: true, message: '请输入座位数', trigger: 'blur' },
    ],
    describeInfo: [
        { required: true, message: '请输入描述信息', trigger: 'blur' },
    ],
}

const beforeAvatarUpload = (file) => {
    const isImg = file.type === 'image/jpeg' || file.type === 'image/png';
    const isLt2MB = file.size / 1024 / 1024 < 2;

    if (!isImg) {
        ElMessage.error('上传汽车图片只能是 JPG 或 PNG 格式!');
        return false // 阻止上传
    }
    if (!isLt2MB) {
        ElMessage.error('上传汽车图片大小不能超过 2MB!');
        return false // 阻止上传
    }

    return true
}

//图片上传成功的回调
const handleAvatarSuccess = (result) => {
    //回显图片
    cardetailData.value.image = result.data.url;
}

// 清空管理员添加修改对象
const clearCarDetailData = () => {
    cardetailData.value = {
        year: '',
        brand: '',
        model: '',
        version: '',
        image: '',
        category: null,
        price: null,
        type: null,
        seats: null,
        describeInfo: ''
    }
}

const handleClose = () => {
    if (title.value == '修改管理员') {
        drawer.value = false
        clearCarDetailData()
    }

    if (cardetailData.value.year !== '' || cardetailData.value.brand !== '' || cardetailData.value.model !== '' || cardetailData.value.version !== '' || cardetailData.value.image !== '' || cardetailData.value.category !== null || cardetailData.value.price !== null || cardetailData.value.type !== null || cardetailData.value.seats !== null || cardetailData.value.describeInfo !== '') {
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
                clearCarDetailData()
            })
    } else {
        drawer.value = false
    }
}

const addCarDetail = async () => {
    let result = await carDetailAddService(cardetailData.value)
    ElMessage.success('添加成功, ID为 ' + result.data.Id)
    clearCarDetailData()
    drawer.value = false
    getCarDetailList()
}

const delCarDetail = (row) => {
    ElMessageBox.confirm(
        `确认删除 ${row.year} ${row.brand}${row.model} ${row.version} 吗？`,
        '提示',
        {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning',
        }
    )
        .then(async () => {
            await carDetailDeleteService(row.id)
            ElMessage({
                type: 'success',
                message: '删除成功',
            })
            getCarDetailList()
        }
        )
        .catch(() => { })
}

const showDrawer = (row) => {
    title.value = '修改管理员'
    drawer.value = true
    cardetailId.value = row.id

    // 数据回显
    cardetailData.value.year = row.year
    cardetailData.value.brand = row.brand
    cardetailData.value.model = row.model
    cardetailData.value.version = row.version
    cardetailData.value.image = row.image
    cardetailData.value.category = row.category
    cardetailData.value.price = row.price
    cardetailData.value.type = row.type
    cardetailData.value.seats = row.seats
    cardetailData.value.describeInfo = row.describeInfo
}

const updateCarDetail = async () => {
    const params = {
        id: cardetailId.value,
        year: cardetailData.value.year,
        brand: cardetailData.value.brand,
        model: cardetailData.value.model,
        version: cardetailData.value.version,
        image: cardetailData.value.image,
        category: cardetailData.value.category,
        price: cardetailData.value.price,
        type: cardetailData.value.type,
        seats: cardetailData.value.seats,
        describeInfo: cardetailData.value.describeInfo,
    }

    await carDetailUpdateService(params)
    ElMessage.success("修改成功")
    clearCarDetailData()
    drawer.value = false
    getCarDetailList()
}

// 添加库存
const addStock = async (row) => {
    const params = {
        carId: row.id,
        dealerId: infoStore.info.id,
    }

    await stockAddService(params)
    ElMessage.success("添加成功")
}
</script>

<template>
    <el-card class="el-card">
        <template #header>
            <div class="card-header">
                <span>汽车信息管理</span>
                <el-button v-if="!role" type="primary" @click="title = '添加汽车信息'; drawer = true;">添加汽车信息</el-button>
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
                        <el-select v-model="searchData.category" placeholder="请选择分类">
                            <el-option v-for="item in categoryOptions" :key="item.value" :label="item.label"
                                :value="item.value" />
                        </el-select>
                    </el-form-item>
                </div>
                <div class="input-box">
                    <el-form-item label="驱动类型:" style="margin-left: 18px;">
                        <el-select v-model="searchData.type" placeholder="请选择驱动类型">
                            <el-option v-for="item in typeOptions" :key="item.value" :label="item.label"
                                :value="item.value" />
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
                    <el-form-item label="最高价格:" style="margin-left: 18px;">
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
            <el-table-column label="操作" width="100" v-if="role">
                <template #default="{ row }">
                    <el-tooltip content="添加至库存" placement="top">
                        <el-button @click="addStock(row)" icon="Upload" plain type="primary"></el-button>
                    </el-tooltip>
                </template>
            </el-table-column>
            <el-table-column label="年份" prop="year" width="100"></el-table-column>
            <el-table-column label="品牌" prop="brand" width="100"></el-table-column>
            <el-table-column label="型号" prop="model" width="100"></el-table-column>
            <el-table-column label="版本" prop="version" width="200"> </el-table-column>
            <el-table-column label="图片" prop="image" width="250">
                <template #default="scope">
                    <el-image style="width: 200px; height:150px;"
                        :src="scope.row.image ? scope.row.image : 'src/assets/default-car-image.jpg'" :zoom-rate="1.2"
                        :max-scale="7" :min-scale="0.2" :preview-src-list="previewSrcList" :initial-index="scope.$index"
                        :infinite=false :preview-teleported=true fit="cover" />
                </template>
            </el-table-column>
            <el-table-column label="描述信息" prop="describeInfo" width="300"></el-table-column>
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
            <el-table-column label="操作" width="200" v-if="!role">
                <template #default="{ row }">
                    <el-tooltip content="编辑" placement="top">
                        <el-button @click="showDrawer(row);" icon="Edit" circle plain type="primary"></el-button>
                    </el-tooltip>
                    <el-tooltip content="删除" placement="top">
                        <el-button @click="delCarDetail(row)" icon="Delete" circle plain type="danger"></el-button>
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
    <el-drawer v-model="drawer" :title="title" direction="rtl" :before-close="handleClose">
        <el-form :rules="rules" label-width="80px" :model="cardetailData" class="el-form">
            <el-form-item prop="year" label="年份:">
                <el-date-picker v-model="cardetailData.year" type="year" value-format="YYYY" placeholder="请选择年份" />
            </el-form-item>
            <el-form-item prop="brand" label="品牌:">
                <el-input v-model="cardetailData.brand" size="large" placeholder="请输入品牌" clearable />
            </el-form-item>
            <el-form-item prop="model" label="型号:">
                <el-input v-model="cardetailData.model" size="large" placeholder="请输入型号" clearable />
            </el-form-item>
            <el-form-item prop="version" label="版本:">
                <el-input v-model="cardetailData.version" size="large" placeholder="请输入版本" clearable />
            </el-form-item>
            <el-form-item prop="image" label="图片:">
                <el-upload class="avatar-uploader" :auto-upload="true" action="/api/file/upload" :show-file-list="false"
                    :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload" name="file"
                    :headers="{ 'Authorization': tokenStore.token }">
                    <el-image v-if="cardetailData.image" :src="cardetailData.image" class="avatar" fit="cover" />
                    <el-icon v-else class="avatar-uploader-icon">
                        <Plus />
                    </el-icon>
                </el-upload>
            </el-form-item>
            <el-form-item prop="category" label="分类:">
                <el-select v-model="cardetailData.category" placeholder="请选择分类">
                    <el-option v-for="item in categoryOptions" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
            </el-form-item>
            <el-form-item prop="type" label="驱动类型:">
                <el-select v-model="cardetailData.type" placeholder="请选择驱动类型">
                    <el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
            </el-form-item>
            <el-form-item prop="price" label="指导价:">
                <el-input v-model="cardetailData.price"
                    :formatter="(value) => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                    :parser="(value) => value.replace(/\￥\s?|(,*)/g, '')" placeholder="请输入指导价" />
            </el-form-item>
            <el-form-item prop="seats" label="座位数:">
                <el-input v-model="cardetailData.seats" type="number" placeholder="请输入座位数" />
            </el-form-item>
            <el-form-item prop="describeInfo" label="描述信息:">
                <el-input v-model="cardetailData.describeInfo" autosize type="textarea" placeholder="请输入描述信息" />
            </el-form-item>
        </el-form>
        <template #footer>
            <div style="flex: auto">
                <el-button @click="handleClose">取消</el-button>
                <el-button type="primary" @click="title == '添加汽车信息' ? addCarDetail() : updateCarDetail();">确认</el-button>
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
            flex-wrap: wrap;
            width: 80%;

            .input-box {
                width: calc(100% / 4);
                padding: 5px;
                box-sizing: border-box;
            }
        }

        .search-button {
            margin-left: 30px;
        }
    }

    .avatar-uploader {
        .avatar {
            width: 200px;
            height: 150px;
            display: block;
        }
    }
}

.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 200px;
    height: 150px;
    text-align: center;
}
</style>