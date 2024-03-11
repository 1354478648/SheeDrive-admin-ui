<script setup>
import { ref } from 'vue'
import { getWeatherService, getGeoCodeService } from '@/api/custom.js'

import { useInfoStore } from '@/stores/info';
const infoStore = useInfoStore()

const getGeoCode = async () => {
    console.log(infoStore.info);
    // const result = await getGeoCodeService()
    console.log(result);
}
getGeoCode()

</script>

<template>
    <div class="card-container">
        <div class="left-col-container">
            <el-card style="width: 1000px" shadow="hover">
                <template #header>
                    <div class="card-header">
                        <span>欢迎回来！<strong>{{ infoStore.info.name }}</strong></span>
                    </div>
                </template>
                统计与图表
            </el-card>
            <div class="left-col-second-container">
                <el-card style="width: 495px;margin-right: 10px;" shadow="hover">
                    <template #header>
                        <div class="card-header">
                            <span>用户地域统计</span>
                        </div>
                    </template>
                    统计与图表
                </el-card>
                <el-card style="width: 495px" shadow="hover">
                    <template #header>
                        <div class="card-header">
                            <span>热门汽车 ( Top 10 )</span>
                        </div>
                    </template>
                    统计与图表
                </el-card>
            </div>

        </div>
        <div class="right-col-container">
            <el-card style="width: 300px" shadow="hover">
                <template #header>
                    <div class="card-header">
                        <span>今日天气</span>
                    </div>
                </template>
                weather
            </el-card>
            <el-card style="width: 300px" shadow="hover">
                QRcode
            </el-card>
            <el-card style="width: 300px" shadow="hover">
                <template #header>
                    <div class="card-header">
                        <span>公告</span>
                    </div>
                </template>
                notice
            </el-card>
            <el-card style="width: 300px;height:500px;" shadow="hover">
                <template #header>
                    <div class="card-header">
                        <span>开发文档</span>
                    </div>
                </template>
                document
            </el-card>
        </div>
    </div>
</template>

<style scoped>
.card-container {
    display: flex;
    justify-content: space-between;

    .left-col-container {
        display: flex;
        flex-direction: column;

        .left-col-second-container {
            display: flex;
        }
    }

    .right-col-container {
        display: flex;
        flex-direction: column;
    }

    .el-card {
        margin-bottom: 10px;
    }
}
</style>