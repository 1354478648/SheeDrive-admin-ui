import request from '@/utils/request'
import { suffix_query } from '@/utils/url'

// 库存列表查询
export const stockListService = (params) => {
    const queryString = suffix_query(params);
    return request.get(`/stock/list${queryString}`);
}

// 库存添加
export const stockAddService = (stockData) => {
    return request.post("/stock/add", stockData);
}

// 库存删除
export const stockDeleteService = (id) => {
    return request.delete(`/stock/delete?id=${id}`);
}