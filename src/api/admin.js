import request from '@/utils/request'

export const adminLoginService = (loginData) => {
    return request.post('/admin/login', loginData);
}

// 管理员列表查询
export const adminListService = (params) => {
    console.log('api的', params.beforeDate,'和',params.afterDate)
    console.log('api的', params.page)
    console.log('api的', params.size)

    const queryString = Object.keys(params)
    .filter(key => params[key] !== null && params[key] !== undefined)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    .join('&');

return request.get(`/admin/list?${queryString}`);
}