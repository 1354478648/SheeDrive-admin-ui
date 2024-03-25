import request from '@/utils/request'
import { suffix_query } from '@/utils/url'

// 用户列表查询
export const userListService = (params) => {
    const queryString = suffix_query(params);
    return request.get(`/user/list${queryString}`);
}

// 用户状态切换
export const userUpdateStatusService = (id) => {
    return request.put("/user/updateStatus", { id });
}

// 用户删除
export const userDeleteService = (id) => {
    return request.delete(`/user/delete?id=${id}`);
}

// 用户添加
export const userAddService = (params) => {
    return request.post("/user/register", params);
}