// 定义store
import { defineStore } from 'pinia'
import { ref } from 'vue'

/**
 * useTokenStore函数
 *   第一个参数：字符串，代表名字，具有唯一性
 *   第二个参数：函数，函数内部可以定义状态的所有内容
 * 
 * 返回值：函数，能调用该函数得到第二个参数函数的返回值内容
 */
export const useTokenStore = defineStore('token', () => {
    // 定义状态的内容
    // 1. 响应式变量
    const token = ref('')

    // 2.定义一个函数，用于修改token的值
    const setToken = (newToken) => {
        token.value = newToken
    }

    // 3. 定义一个函数，用于移除token的值
    const removeToken = () => {
        token.value = ''
    }

    // 返回值
    return {
        token, setToken, removeToken
    }
},
    {
        persist: true //持久化存储
    }
)