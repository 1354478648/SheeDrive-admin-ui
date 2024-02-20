import request from '@/utils/request'

// 管理员登录
export const adminLoginService = (loginData) => {
    return request.post('/admin/login', loginData);
}

// 管理员列表查询
export const adminListService = (params) => {
    // 拼接URL字符串
    const queryString = Object.keys(params)
        .filter(key => params[key] !== null && params[key] !== undefined)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
        .join('&');

    return request.get(`/admin/list?${queryString}`);
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