import request from '@/utils/request'

export const adminLoginService = (loginData) => {
    return request.post('/admin/login', loginData);
}

// 管理员列表查询
export const adminListService = (params) => {
    const queryString = Object.keys(params)
    .filter(key => params[key] !== null && params[key] !== undefined)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    .join('&');

return request.get(`/admin/list?${queryString}`);
}