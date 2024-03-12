<script setup>
import { ref, onMounted } from 'vue'
import { getWeatherService, getCarRankService } from '@/api/custom.js'
import { ElMessage } from 'element-plus';
import * as echarts from "echarts";
import { orderListService, orderGetIncompleteService } from "@/api/order.js";
import { stockListService } from '@/api/stock.js';

import { useInfoStore } from '@/stores/info';
const infoStore = useInfoStore()

const orderTotal = ref()
const orderGetTotal = async () => {
    const params = {
        dealerName: infoStore.info.name
    }
    let result = await orderListService(params)
    orderTotal.value = result.data.Total
}
orderGetTotal()

const incompleteTotal = ref()
const orderGetIncomplete = async () => {
    let result = await orderGetIncompleteService(infoStore.info.id)
    incompleteTotal.value = result.data.total
}
orderGetIncomplete()

const carTotal = ref()
const carGetTotal = async () => {
    const params = {
        dealerName: infoStore.info.name
    }
    let result = await stockListService(params)
    carTotal.value = result.data.Total
}
carGetTotal()

const main = ref() // 使用ref创建虚拟DOM引用
const main2 = ref()
onMounted(
    () => {
        initMain()
        initMain2()
    }
)

function initMain() {
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(main.value);
    var option = {
        title: {
            text: '订单趋势'
        },
        tooltip: {},
        legend: {
            data: ['当日订单创建数', '当日预定数']
        },
        xAxis: {
            type: 'category',
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        },
        yAxis: {
            type: 'value'
        },
        series: [
            {
                name: '当日订单创建数',
                data: [150, 230, 224, 218, 135, 147, 260],
                type: 'line'
            },
            {
                name: '当日预定数',
                data: [100, 200, 220, 200, 100, 10, 300],
                type: 'line'
            }
        ]
    };
    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);
}

function initMain2() {
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(main2.value);
    var option = {
        tooltip: {
            trigger: 'item'
        },
        legend: {
            top: '5%',
            left: 'center'
        },
        series: [
            {
                name: 'Access From',
                type: 'pie',
                radius: ['40%', '70%'],
                avoidLabelOverlap: false,
                itemStyle: {
                    borderRadius: 10,
                    borderColor: '#fff',
                    borderWidth: 2
                },
                label: {
                    show: false,
                    position: 'center'
                },
                emphasis: {
                    label: {
                        show: true,
                        fontSize: 40,
                        fontWeight: 'bold'
                    }
                },
                labelLine: {
                    show: false
                },
                data: [
                    { value: 1048, name: 'Search Engine' },
                    { value: 735, name: 'Direct' },
                    { value: 580, name: 'Email' },
                    { value: 484, name: 'Union Ads' },
                    { value: 300, name: 'Video Ads' }
                ]
            }
        ]
    };
    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);
}

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
}
getWeather()

const carRank = ref([])
const getCarRank = async () => {
    let result = await getCarRankService()
    carRank.value = result.data.List
}
getCarRank()
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
                <div>
                    <div class="item-container">
                        <div class="item">
                            <el-image class="el-image" src="src/assets/popularity-025aa888.png"></el-image>
                            <div class="text">
                                <span style="font-size: 14px;margin-bottom: 10px;">累计服务（人）</span>
                                <span style="font-size: 20px;">{{ orderTotal }}</span>
                            </div>
                        </div>
                        <div class="item">
                            <el-image class="el-image" src="src/assets/same-city-a8b8e292.png"></el-image>
                            <div class="text">
                                <span style="font-size: 14px;margin-bottom: 10px;">待完成订单（件）</span>
                                <span style="font-size: 20px;">{{ incompleteTotal }}</span>
                            </div>
                        </div>
                        <div class="item">
                            <el-image class="el-image" src="src/assets/data-9d10c710.png"></el-image>
                            <div class="text">
                                <span style="font-size: 14px;margin-bottom: 10px;">在库车辆（辆）</span>
                                <span style="font-size: 20px;">{{ carTotal }}</span>
                            </div>
                        </div>
                        <div class="item">
                            <el-image class="el-image" src="src/assets/hot-4ea8698b.png"></el-image>
                            <div class="text">
                                <span style="font-size: 14px;margin-bottom: 10px;">综合评分（分）</span>
                                <span style="font-size: 20px;">5</span>
                            </div>
                        </div>
                    </div>
                    <el-divider border-style="dashed" />
                    <div>
                        <div ref="main" style="display: flex;justify-content: center;width: 100%; height: 350px"></div>
                    </div>
                </div>
            </el-card>
            <div class="left-col-second-container">
                <el-card style="margin-right:10px" shadow="hover">
                    <template #header>
                        <div class="card-header">
                            <span>用户地域统计</span>
                        </div>
                    </template>
                    <div ref="main2" style="display: flex;justify-content: center;width: 100%; height: 450px"></div>
                </el-card>
                <el-card shadow="hover">
                    <template #header>
                        <div class="card-header">
                            <span>热门汽车 ( Top 10 )</span>
                        </div>
                    </template>
                    <el-table :data="carRank" stripe style="width: 100%">
                        <el-table-column type="index" label="排名" width="60" />
                        <el-table-column label="汽车" width="300">
                            <template #default="{ row }">
                                {{ row.carInfo.brand + row.carInfo.model + ' ' + row.carInfo.version }}
                            </template>
                        </el-table-column>
                        <el-table-column prop="times" label="订单交易量" />
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

        .item-container {
            display: flex;
            /* flex-wrap: wrap; */
            justify-content: center;

            .item {
                width: 200px;
                margin: 10px;
                display: flex;
                flex-direction: column;
                align-items: center;
                text-align: center;

                .el-image {
                    width: 50px;
                    height: auto;
                    margin-bottom: 10px;
                }

                .text {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                }
            }
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
                font-size: 36px;
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