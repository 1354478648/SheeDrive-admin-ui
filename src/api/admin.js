import request from '@/utils/request'
import { suffix_query } from '@/utils/url'

// 管理员登录
export const adminLoginService = (loginData) => {
    return request.post('/admin/login', loginData);
}

// 管理员列表查询
export const adminListService = (params) => {
    const queryString = suffix_query(params);
    return request.get(`/admin/list${queryString}`);
}

// 管理员状态切换
export const adminUpdateStatusService = (id) => {
    return request.put("/admin/updateStatus", { id });
}

// 管理员添加
export const adminAddService = (adminData) => {
    return request.post("/admin/add", adminData);
}

// 管理员重置密码
export const adminResetPwdService = (id) => {
    return request.put("/admin/resetPassword", { id });
}

// 管理员删除
export const adminDeleteService = (id) => {
    return request.delete(`/admin/delete?id=${id}`);
}

// 管理员修改
export const adminUpdateService = (adminData) => {
    return request.put("/admin/update", adminData);    
}

// 管理员修改头像
export const adminUpdateAvatarService = (params) => {
    return request.put('/admin/updateAvatar', params)
}

// 管理员修改密码
export const adminUpdatePasswordService = (params) => {
    return request.put('/admin/updatePassword', params)
}