import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useInfoStore = defineStore('info', () => {
    //定义状态相关的内容
    const info = ref({})

    //修改用户信息状态
    const setInfo = (newInfo) => {
        info.value = newInfo
    }

    //清除用户信息状态
    const removeInfo = () => {
        info.value = {}
    }

    return {
        info,
        setInfo,
        removeInfo
    }
}, {
    persist: true
})