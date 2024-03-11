<script setup>
import { ref } from 'vue'
import { getWeatherService } from '@/api/custom.js'
import { ElMessage } from 'element-plus';

import { useInfoStore } from '@/stores/info';
const infoStore = useInfoStore()


const weather = ref({})
const getWeather = async () => {
    const params = {
        Province: infoStore.info.address.Province,
        City: infoStore.info.address.City,
        District: infoStore.info.address.District,
        DetailAddress: infoStore.info.address.Detail,
    }
    let result = await getWeatherService(params)
    weather.value = result.data
    console.log(weather.value)
}
getWeather()

const carRank = ref([])
</script>

<template>
    <div class="card-container">
        <div class="left-col-container">
            <el-card shadow="hover">
                <template #header>
                    <div class="card-header">
                        <span>欢迎回来！<strong>{{ infoStore.info.name }}</strong></span>
                    </div>
                </template>
                统计与图表
            </el-card>
            <div class="left-col-second-container">
                <el-card style="margin-right:10px" shadow="hover">
                    <template #header>
                        <div class="card-header">
                            <span>用户地域统计</span>
                        </div>
                    </template>
                    统计与图表
                </el-card>
                <el-card shadow="hover">
                    <template #header>
                        <div class="card-header">
                            <span>热门汽车 ( Top 10 )</span>
                        </div>
                    </template>
                    <el-table :data="carRank" stripe style="width: 100%">
                        <el-table-column prop="id" label="排名"  />
                        <el-table-column prop="name" label="汽车" width="300" />
                        <el-table-column prop="address" label="订单交易量" />
                    </el-table>
                </el-card>
            </div>

        </div>
        <div class="right-col-container">
            <el-card shadow="hover">
                <template #header>
                    <div class="card-header">
                        <el-icon>
                            <Sunrise />
                        </el-icon>
                        <span style="margin-left:5px;">今日天气</span>
                    </div>
                </template>
                <el-text>您所处的位置是：<el-text type="primary">{{ weather.province + ' ' + weather.city }}</el-text></el-text>
                <div class="weather-container">
                    <div class="temperature-container">
                        <span>{{ weather.temperature }} ℃</span>
                    </div>
                    <div class="humidity-container">
                        <span>{{ weather.weather + ' ' + weather.winddirection + '风' + weather.windpower + '级' }}</span>
                        <span>{{ '空气湿度：' + weather.humidity + '%' }}</span>
                    </div>
                </div>
                <el-text>{{ '报告时间：' + weather.reporttime }}</el-text>
            </el-card>
            <el-card shadow="hover">
                <template #header>
                    <div class="card-header">
                        <el-icon>
                            <Connection />
                        </el-icon>
                        <span style="margin-left:5px;">联系作者</span>
                    </div>
                </template>
                <div class="image-container">
                    <span style="font-size:14px;margin-bottom: 10px;">如有使用上的问题，欢迎使用 QQ 扫描二维码联系作者</span>
                    <el-image class="image"
                        src="https://sheedrive.oss-cn-shanghai.aliyuncs.com/sys/myqqqrcode.png"></el-image>
                </div>
            </el-card>
            <el-card shadow="hover">
                <template #header>
                    <div class="notice-card-header">
                        <el-icon>
                            <Message />
                        </el-icon>
                        <span style="margin-left:5px;">公告</span>
                        <el-button @click="ElMessage.error('暂未开放');" class="look-more" type="primary" link>
                            查看更多
                        </el-button>
                    </div>

                </template>
                <div style="margin-bottom: 5px;">
                    <el-tag type="primary">通知</el-tag>
                    <el-text style="margin-left:5px;">小羊试驾后端接口开放上线了</el-text>
                </div>
                <div style="margin-bottom: 5px;">
                    <el-tag type="primary">通知</el-tag>
                    <el-text style="margin-left:5px;">小羊试驾管理员端开放上线了</el-text>
                </div>
                <div style="margin-bottom: 5px;">
                    <el-tag type="danger">新闻</el-tag>
                    <el-text style="margin-left:5px;">凯迪拉克xt5最新落地价</el-text>
                </div>
                <div style="margin-bottom: 5px;">
                    <el-tag type="danger">新闻</el-tag>
                    <el-text style="margin-left:5px;">马自达CX-70官图发布</el-text>
                </div>
                <div style="margin-bottom: 5px;">
                    <el-tag type="danger">新闻</el-tag>
                    <el-text style="margin-left:5px;">比亚迪等车企同日降价掀起价格战</el-text>
                </div>
            </el-card>
            <el-card shadow="hover">
                <template #header>
                    <div class="card-header">
                        <el-icon>
                            <Document />
                        </el-icon>
                        <span style="margin-left:5px;">开发文档</span>
                    </div>
                </template>
                <div class="big-document-container">
                    <div class="document-container">
                        <el-link href="http://tangricheng.com/" type="primary">作者博客</el-link>
                        <el-link href="https://github.com/1354478648/SheeDrive" type="primary">后端开发文档</el-link>
                    </div>
                    <div class="document-container">
                        <el-link href="https://github.com/1354478648/SheeDrive-admin-ui"
                            type="primary">A/B端开发文档</el-link>
                        <el-link href="https://github.com/1354478648/SheeDrive-consumer-ui"
                            type="primary">C端开发文档</el-link>
                    </div>
                </div>

            </el-card>
        </div>
    </div>
</template>

<style scoped>
.card-container {
    display: flex;
    justify-content: space-between;
    width: 99%;

    .left-col-container {
        flex: 4;
        display: flex;
        flex-direction: column;
        margin-right: 10px;

        .left-col-second-container {
            display: flex;
        }
    }

    .right-col-container {
        flex: 1;
        display: flex;
        flex-direction: column;

        .card-header {
            display: flex;
            align-items: center;
        }

        .weather-container {
            display: flex;
            align-items: center;
            margin-bottom: 5px;

            .temperature-container {
                font-size: 48px;
                margin-right: 10px;
                margin-top: 20px;
            }

            .humidity-container {
                display: flex;
                flex-direction: column;
                margin-top: 20px;
            }

            .humidity-container span {
                margin-bottom: 5px;
            }
        }

        .image-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 250px;
        }

        .image {
            max-width: 100%;
            max-height: 100%;
        }

        .notice-card-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .look-more {
            margin-left: auto;
        }

        .big-document-container {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 20px;
            justify-items: center;
        }

        .document-container {
            display: flex;
            flex-direction: column;
            gap: 10px;
        }

    }

    .el-card {
        margin-bottom: 10px;
        width: 100%;
    }
}
</style>