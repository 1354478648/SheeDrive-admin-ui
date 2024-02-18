//导入axios  npm install axios
import axios from 'axios';
import { ElMessage } from 'element-plus'

//定义变量baseURL,用于记录公共的前缀
const baseURL = '/api';
const instance = axios.create({ baseURL })

//响应拦截器
instance.interceptors.response.use(
    result => {
        //判断业务状态码
        if (result.data.code === 0) {
            return result.data;
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
