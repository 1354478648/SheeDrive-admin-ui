//导入axios  npm install axios
import axios from 'axios';
import { ElMessage } from 'element-plus'
import router from '@/router' 
import { useTokenStore } from '@/stores/token.js'

//定义变量baseURL,用于记录公共的前缀
const baseURL = '/api';
const instance = axios.create({ baseURL })

//添加请求拦截器
instance.interceptors.request.use(
    config => {
        //请求前的回调
        //添加token
        const tokenStore = useTokenStore()
        //判断有没有token
        if (tokenStore.token) {
            config.headers.Authorization = tokenStore.token
        }
        return config
    },
    err => {
        //请求错误的回调
        return Promise.reject(err)
    }
)

//响应拦截器
instance.interceptors.response.use(
    result => {
        //判断业务状态码
        if (result.data.code === 0) {
            return result.data;
        }
        if (result.data.code === 403) {
            console.log('我在这')
            ElMessage.error(result.data.message ? result.data.message : '请先登录')
            router.push('/login')
        }
        //操作失败
        ElMessage.error(result.data.message ? result.data.message : '操作失败')
        return result.data;
    },
    err => {
        ElMessage.error('请求错误')
        return Promise.reject(err);//异步的状态转化成失败的状态
    }
)

export default instance;
