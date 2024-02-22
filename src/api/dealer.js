import request from '@/utils/request'
import { suffix_query } from '@/utils/url'

export const dealerLoginService = (loginData) => {
    return request.post('/dealer/login', loginData);
}

// 管理员列表查询
export const dealerListService = (params) => {
    const queryString = suffix_query(params);
    return request.get(`/dealer/list${queryString}`);
}

// 管理员状态切换
export const dealerUpdateStatusService = (id) => {
    return request.put("/dealer/updateStatus", { id });
}

// 管理员添加
export const dealerAddService = (dealerData) => {
    return request.post("/dealer/add", dealerData);
}

// 管理员重置密码
export const dealerResetPwdService = (id) => {
    return request.put("/dealer/resetPassword", { id });
}

// 管理员删除
export const dealerDeleteService = (id) => {
    return request.delete(`/dealer/delete?id=${id}`);
}

// 管理员修改
export const dealerUpdateService = (dealerData) => {
    return request.put("/dealer/update", dealerData);    
}