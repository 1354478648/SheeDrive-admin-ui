import request from '@/utils/request'
import { suffix_query } from '@/utils/url'

// 订单列表查询
export const orderListService = (params) => {
    const queryString = suffix_query(params);
    return request.get(`/order/list${queryString}`);
}

// 订单详情查询
export const orderGetByIdService = (id) => {
    return request.get(`/order/detail?id=${id}`);
}

// 订单取消
export const orderUpdateCancelService = (data) => {
    return request.put('/order/update/cancel', data);
}

// 订单确认
export const orderUpdateConfirmService = (data) => {
    console.log(data);
    return request.put('/order/update/confirm', data);
}

// 订单签署协议
export const orderUpdateSignService = (data) => {
    return request.put('/order/update/sign', data);
}

// 订单开始试驾
export const orderUpdateStartService = (data) => {
    return request.put('/order/update/start', data);
}

// 订单结束试驾
export const orderUpdateEndService = (data) => {
    return request.put('/order/update/end', data);
}

// 订单待评价
export const orderUpdateEndAllService = (data) => {
    return request.put('/order/update/endAll', data);
}

// 订单删除
export const orderDeleteService = (id) => {
    return request.delete(`/order/delete?id=${id}`);
}

// 获取未完成订单数
export const orderGetIncompleteService = (id) => {
    return request.get(`/order/get/incomplete?dealerId=${id}`);
}

// 获取订单地址出现次数
export const orderGetAddressCountService = (id) => {
    return request.get(`/order/get/address/times?dealerId=${id}`);
}

// 获取订单预定次数
export const orderGetTimeCountService = (id) => {
    return request.get(`/order/get/times?dealerId=${id}`);
}