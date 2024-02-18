import request from '@/utils/request'

export const adminLoginService = (loginData) => {
    return request.post('/admin/login', loginData);
}